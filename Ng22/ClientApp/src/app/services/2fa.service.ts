import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ExpiryConfigVm, TwoFA } from "../shared/models/2fa.data";
import { AppConfigService } from "./appconfig.service";

@Injectable({
  providedIn: 'root'
})

export class TwoFAService {

  constructor(private http: HttpClient,
    private appCfgSvc: AppConfigService) {}
   
  Get2FAExpiry(): Observable<any> {
    return this.http.get<any>(`${this.appCfgSvc.cfg["baseUrl"]}api/TwoFA/Get2FAExpiry`)
      .pipe(map(expiry => {
        var x: any[] = [];
        expiry.forEach(e => {
          x.push({
            'id': e.uid,
            'name': `${e.duration} ${e.unit}`
          });
        });
        return x;
      }));
  }

  Add2FA(data: TwoFA): Observable<any> {
    return this.http.post<any>(`${this.appCfgSvc.cfg["baseUrl"]}api/TwoFA/Add2FA`, data);
  }

  Remove2FA(data: TwoFA): Observable<any> {
    return this.http.post<any>(`${this.appCfgSvc.cfg["baseUrl"]}api/TwoFA/Remove2FA`, data);
  }

  Get2FA(): Observable<any> {
    return this.http.get<any>(`${this.appCfgSvc.cfg["baseUrl"]}api/TwoFA/Get2FA`);
  }

  AddExpiryConfig(data: ExpiryConfigVm): Observable<any> {
    return this.http.post<any>(`${this.appCfgSvc.cfg["baseUrl"]}api/TwoFA/AddExpiryConfig`, data);
  }

  RemoveExpiryConfig(uid): Observable<any> {
    return this.http.post<any>(`${this.appCfgSvc.cfg["baseUrl"]}api/TwoFA/RemoveExpiryConfig/${uid}`, uid);
  }
}
