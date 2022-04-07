export interface TwoFA {
  uid?: string;
  passcode: string;
  expireUid: string;
  lstUserUid?: string[];
}

export interface ExpiryConfigVm {
  uid?: string;
  duration: number;
  unit: string;
}
