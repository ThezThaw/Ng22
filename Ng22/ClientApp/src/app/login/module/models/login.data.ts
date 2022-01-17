export interface AppUser {
  userId: string;
  nickName: string;
}

export interface LoginRequest {
  userId: string;
  password: string;
}

export interface LoginResult {
  token: string;
  userInfo: AppUser;
}
