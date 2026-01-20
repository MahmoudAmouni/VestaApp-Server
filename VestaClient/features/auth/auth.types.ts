export type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type AuthUser = {
  id: number;
  diet_id: number | null;
  allergy_id: number | null;
  email: string;
  name: string;
  avatar_url: string | null;
  phone: string | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
};

export type Home = {
  id: number;
  name: string;
  owner_id: number;
  created_at?: string;
  updated_at?: string;
};

export type RegisterDto = {
  email: string;
  password: string;
  name: string;
  home_name: string;
  phone?: string | null;
  avatar_url?: string | null;
};

export type LoginDto = {
  email: string;
  password: string;
};

export type RegisterData = {
  user: AuthUser;
  home: Home;
  access_token: string;
  token_type: string; 
};

export type LoginData = {
  user: AuthUser;
  home_id: number;
  access_token: string;
  token_type: string; 
};

export type AuthSession = {
  token: string;
  tokenType: string; 
  user: AuthUser;
  homeId: number;
  home?: Home; 
};


export type UpdateUserDto = {
  email?: string;
  name?: string;
  phone?: string | null;
  diet?: string | null;
  allergy?: string | null;

  password?: string | null;
  passwordConfirmation?: string | null;
};
export type UpdateUserResponse = {
  success?: boolean;
  message?: string;
  data?: any;
};


export type GoogleAuthDto = {
  id_token?: string;
  access_token?: string;
};

export type GoogleAuthData = {
  user: AuthUser;
  home: Home;
  home_id: number;
  access_token: string;
  token_type: string;
  is_new_user: boolean;
};