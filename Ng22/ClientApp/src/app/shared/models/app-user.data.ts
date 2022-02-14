
export interface Page {
  pageCode: string;
  menuName: string;
  user: AppUser;
}

export interface AppUser {
  uid?: string;
  userId: string;
  nickName: string;
  currentpassword?: string;
  password?: string;
  skippassword?: boolean;
  alive?: boolean;
}

export interface UserPageRelation {
  userUid: string;
  pageUid: string;
}


