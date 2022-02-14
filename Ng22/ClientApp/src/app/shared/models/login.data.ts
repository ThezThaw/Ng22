import { AppUser } from "./app-user.data";
import { Mission, MissionDetails } from "./mission.data";

export interface LoginRequest {
  userId: string;
  password: string;
}

export interface LoginResult {
  token: string;
  appUser: AppUser;
  missions: Mission[];
}

export interface LoginResultL2 {
  token: string;
  missionDetails: MissionDetails;
}
