<?php

namespace App\Services\Api;

use App\Exceptions\ApiException;
use App\Models\Home;
use App\Models\User;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Storage;

class AuthService
{
    public function register(array $data): array
    {
        if (User::where('email', $data['email'])->exists()) {
            throw ApiException::conflict('Email already exists.');
        }

        return DB::transaction(function () use ($data) {
            $user = new User();
            $user->email = $data['email'];
            $user->role_id = 1;
            $user->password = Hash::make($data['password']);
            $user->name = $data['name'];
            $user->phone = $data['phone'] ?? null;
            $user->avatar_url = $data['avatar_url'] ?? null;
            $user->diet_id = $data['diet_id'] ?? null;
            $user->allergy_id = $data['allergy_id'] ?? null;
            $user->save();

            if (isset($data['avatar_url']) && str_starts_with($data['avatar_url'], 'data:image')) {
                 $stored = $this->storeBase64Avatar($user, $data['avatar_url']);
                 $user->avatar_url = $stored['url'];
                 $user->save();
            }

            $home = new Home();
            $home->name = $data["home_name"];
            $home->owner_id = $user->id;
            $home->save();

            $token = JWTAuth::fromUser($user);

            $user->load('allergy');

            return [
                'user' => $user,
                'home'=>$home,
                'access_token' => $token,
                'token_type' => 'bearer',
            ];
        });
    }

    public function login(array $data): array
    {
        $credentials = [
            'email' => $data['email'],
            'password' => $data['password'],
        ];

        $token = JWTAuth::attempt($credentials);

        if (!$token) {
            throw ApiException::unauthorized('Invalid email or password.');
        }

        $user = JWTAuth::user();
        $user->load('allergy');

        $homeId = $user->ownedHomes()->orderBy('id', 'asc')->value('id'); 

        return [
            'user' => $user,
            'home_id' => $homeId,       
            'access_token' => $token,
            'token_type' => 'bearer',
        ];
    }

    public function google(array $data): array
    {
        $idToken = $data['id_token'] ?? null;
        $accessToken = $data['access_token'] ?? null;

        if ($idToken) {
            $resp = Http::get('https://oauth2.googleapis.com/tokeninfo', [
                'id_token' => $idToken,
            ]);

            if (!$resp->ok()) {
                throw ValidationException::withMessages(['id_token' => 'Invalid Google token.']);
            }

            $p = $resp->json();

            if (($p['aud'] ?? null) !== config('services.google.web_client_id')) {
                throw ValidationException::withMessages(['id_token' => 'Wrong audience (aud).']);
            }

            $googleId = $p['sub'] ?? null;
            $email = $p['email'] ?? null;
            $verified = filter_var($p['email_verified'] ?? false, FILTER_VALIDATE_BOOLEAN);
            $name = $p['name'] ?? ($email ? Str::before($email, '@') : 'User');
            $avatar = $p['picture'] ?? null;

        } elseif ($accessToken) {
            $resp = Http::withToken($accessToken)
                ->get('https://www.googleapis.com/oauth2/v2/userinfo');

            if (!$resp->ok()) {
                throw ValidationException::withMessages(['access_token' => 'Invalid Google access token.']);
            }

            $p = $resp->json();

            $googleId = $p['id'] ?? null;
            $email = $p['email'] ?? null;
            $verified = filter_var($p['verified_email'] ?? false, FILTER_VALIDATE_BOOLEAN);
            $name = $p['name'] ?? ($email ? Str::before($email, '@') : 'User');
            $avatar = $p['picture'] ?? null;

        } else {
            throw ValidationException::withMessages(['token' => 'Either id_token or access_token is required.']);
        }

        if (!$googleId || !$email || !$verified) {
            throw ValidationException::withMessages(['token' => 'Token missing required claims.']);
        }

        return DB::transaction(function () use ($googleId, $email, $name, $avatar) {

            $user = User::where('google_id', $googleId)->first();

            if (!$user) {
                $user = User::where('email', $email)->first();
                if ($user && !$user->google_id) {
                    $user->google_id = $googleId;
                    $user->name = $user->name ?: $name;
                    $user->avatar_url = $user->avatar_url ?: $avatar;
                    $user->save();
                }
            }

            $isNew = false;

            if (!$user) {
                $user = new User();
                $user->email = $email;
                $user->role_id = 1;
                $user->google_id = $googleId;
                $user->password = Hash::make(Str::random(32)); 
                $user->name = $name;
                $user->avatar_url = $avatar;
                $user->save();

                $home = new Home();
                $home->name = $name . "'s Home"; 
                $home->owner_id = $user->id;
                $home->save();

                $isNew = true;
            } else {
                $home = $user->ownedHomes()->orderBy('id', 'asc')->first();

                if (!$home) {
                    $home = new Home();
                    $home->name = $user->name . "'s Home";
                    $home->owner_id = $user->id;
                    $home->save();
                }
            }

            $token = JWTAuth::fromUser($user);
            
            $user->load('allergy');

            return [
                'user' => $user,
                'home' => $home,
                'home_id' => $home->id,
                'access_token' => $token,
                'token_type' => 'bearer',
                'is_new_user' => $isNew,
            ];
        });
    }

    private function storeBase64Avatar(User $user, string $base64String): array
    {
        if (preg_match('/^data:image\/(\w+);base64,/', $base64String, $type)) {
            $data = substr($base64String, strpos($base64String, ',') + 1);
            $type = strtolower($type[1]); 

            $data = base64_decode($data);
             if ($data === false) {
                 throw new \Exception('base64_decode failed');
             }

        } else {
             throw new \Exception('Invalid base64 string');
        }

        $filename = Str::random(40) . '.' . $type;
        $path = "avatars/users/{$user->id}/{$filename}";

        Storage::disk('public')->put($path, $data);

        /** @var FilesystemAdapter $disk */
        $disk = Storage::disk('public');

        return [
            'path' => $path,
            'url' => $disk->url($path),
        ];
    }

}
