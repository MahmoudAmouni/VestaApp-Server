<?php

namespace App\Services\Api;

use App\Exceptions\ApiException;
use App\Models\Allergy;
use App\Models\Diet;
use App\Models\User;
use App\Traits\FindOrCreateByName;
use Illuminate\Filesystem\FilesystemAdapter;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Throwable;

class UserService
{
    use FindOrCreateByName;

    public function update(array $data): array
    {
        if (!auth()->check()) {
            throw ApiException::unauthorized('Unauthorized.');
        }

        $userId = auth()->id();

        $user = User::query()->find($userId);
        if (!$user) {
            throw ApiException::notFound('User not found.');
        }

        if (array_key_exists('email', $data) && $data['email'] !== $user->email) {
            $emailTaken = User::query()
                ->where('email', $data['email'])
                ->where('id', '!=', $userId)
                ->exists();

            if ($emailTaken) {
                throw ApiException::conflict('Email already exists.');
            }
        }

        $oldAvatarUrl = $user->avatar_url;

        $storedAvatar = null;
        if (($data['avatar'] ?? null) instanceof UploadedFile) {
            $storedAvatar = $this->storeUserAvatar($user, $data['avatar']);
        }

        try {
            DB::transaction(function () use ($user, $data, $storedAvatar) {
                foreach (['email', 'name', 'phone'] as $field) {
                    if (array_key_exists($field, $data)) {
                        $user->{$field} = $data[$field];
                    }
                }

                if (array_key_exists('diet', $data)) {
                    $dietName = $this->normalizeName($data['diet']);

                    if ($dietName === null) {
                        $user->diet_id = null;
                    } else {
                        $diet = $this->findOrCreateByName(Diet::class, $dietName);
                        $user->diet_id = $diet->id;
                    }
                }

                if (array_key_exists('allergy', $data)) {
                    $allergyName = $this->normalizeName($data['allergy']);

                    if ($allergyName === null) {
                        $user->allergy_id = null;
                    } else {
                        $allergy = $this->findOrCreateByName(Allergy::class, $allergyName);
                        $user->allergy_id = $allergy->id;
                    }
                }

                if ($storedAvatar) {
                    $user->avatar_url = $storedAvatar['url'];
                }

                if (array_key_exists('password', $data) && filled($data['password'])) {
                    $user->password = Hash::make($data['password']);
                }

                $user->save();
            });
        } catch (Throwable $e) {
            if ($storedAvatar) {
                Storage::disk('public')->delete($storedAvatar['path']);
            }
            throw $e;
        }

        if ($storedAvatar) {
            $this->deleteOldAvatarIfLocal($oldAvatarUrl);
        }

        $user->load(['diet', 'allergy']);

        return ['user' => $user,"data"=>$data];
    }

    private function normalizeName(mixed $value): ?string
    {
        if ($value === null) {
            return null;
        }

        $name = trim((string) $value);
        return $name === '' ? null : $name;
    }

    private function storeUserAvatar(User $user, UploadedFile $file): array
    {
        $path = $file->storePublicly(
            "avatars/users/{$user->id}",
            ['disk' => 'public']
        );

        /** @var FilesystemAdapter $disk */
        $disk = Storage::disk('public');

        return [
            'path' => $path,
            'url' => $disk->url($path),
        ];
    }

    private function deleteOldAvatarIfLocal(?string $oldUrl): void
    {
        if (!$oldUrl) {
            return;
        }

        $path = parse_url($oldUrl, PHP_URL_PATH) ?? '';
        if (!str_starts_with($path, '/storage/')) {
            return;
        }

        $relative = ltrim(str_replace('/storage/', '', $path), '/');
        if ($relative !== '') {
            Storage::disk('public')->delete($relative);
        }
    }
}
