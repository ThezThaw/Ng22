import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AppUser } from "../shared/models/app-user.data";
import { StatusResult } from "../shared/models/shared-data.model";
import { AppConfigService } from "./appconfig.service";

@Injectable({
  providedIn: 'root'
})

export class AppUserService {
  public url: string;
  constructor(private http: HttpClient,
    private appCfgSvc: AppConfigService)
  {
    this.url = `${this.appCfgSvc.cfg["baseUrl"]}api/appuser/`;
  }

  getUserList(filter: string = '', excludeAr: boolean = false): Observable<AppUser[]> {
    var params = new HttpParams()
      .set('filter', filter)
      .set('excludeAr', excludeAr);
    return this.http.get<AppUser[]>(`${this.url}GetUserList/`,
      { params: params });
  }

  createUpdate(user: AppUser, isnew: boolean): Observable<StatusResult> {
    let url = isnew ? `${this.url}AddUser` : `${this.url}UpdateUser`;
    return this.http.post<StatusResult>(url, user);
  }
}
