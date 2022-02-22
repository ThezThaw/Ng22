import { AppUser } from "./app-user.data";

export interface UserPageRelation {
  uid?: string;
  userUid: string;
  pageUid: string;
  default: boolean;
}

export interface Page {
  uid?: string;
  pageCode: string;
  menuName: string;
  user: AppUser;
  default: boolean;
}
