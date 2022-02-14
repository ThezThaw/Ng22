export class StatusResult {
  status: boolean;
  id: string;
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
