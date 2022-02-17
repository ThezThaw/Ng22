export class StatusResult {
  status: boolean;
  data?: any;
  message: string[];
}

export class ResultWithMessage {
  lst: any[];
  vm: any;
  msg: string;
  ok: boolean;
}

export class FilterRequest {
  dt: string;
  fd: string;
  td: string;
  code: string;
  id?: number;
  txnType?: any;
  rptType?: any;
  status?: number;
}

export interface Header {
  btn: HeaderButton[];
  title?: HeaderTitle;
}

export interface HeaderButton {
  name: string;
  func: string;
  color?: string;
  ownby: string;
}

export interface HeaderTitle {
  title: string;
  subtitle: string;
}
