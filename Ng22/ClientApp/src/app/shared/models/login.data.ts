import { Mission, MissionDetails } from "./mission.data";

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
  missions: Mission[];
}

export interface LoginResultL2 {
  token: string;
  missionDetails: MissionDetails;
}
