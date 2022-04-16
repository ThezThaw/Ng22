import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AppConfigService } from "./appconfig.service";

@Injectable({
  providedIn: 'root'
})

export class PushMessageService {

  constructor(private http: HttpClient,
    private appCfgSvc: AppConfigService) {}

  ClientRegistration(subscriberInfo: any): Observable<any> {
    return this.http.post<any>(`${this.appCfgSvc.cfg["baseUrl"]}api/PushMessage/ClientRegistration`, subscriberInfo);
  }

  SendMessage(msg: any): Observable<any> {
    return this.http.post<any>(`${this.appCfgSvc.cfg["baseUrl"]}api/PushMessage/SendMessage`, msg);
  }

  GetSentMessage(isInbox: boolean): Observable<any> {
    return this.http.post<any>(`${this.appCfgSvc.cfg["baseUrl"]}api/PushMessage/GetSentMessage/${isInbox}`, undefined);
  }

  DeleteMessage(uids: string[], isInbox: boolean, softdelete: boolean): Observable<any> {
    return this.http.post<any>(`${this.appCfgSvc.cfg["baseUrl"]}api/PushMessage/DeleteMessage/${softdelete}/${isInbox}`, uids);
  }
}
