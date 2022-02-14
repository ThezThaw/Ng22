import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AppUser, Page, UserPageRelation } from "../shared/models/app-user.data";
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

  getAvailablePageByUser(userId): Observable<Page[]> {
    return this.http.get<Page[]>(`${this.url}GetAvailablePageByUser/${userId}`);
  }

  getUserList(filter: string = ''): Observable<AppUser[]> {
    var params = new HttpParams().set('filter', filter);
    return this.http.get<AppUser[]>(`${this.url}GetUserList/`,
      { params: params });
  }

  createUpdate(user: AppUser, isnew: boolean): Observable<StatusResult> {
    let url = isnew ? `${this.url}AddUser` : `${this.url}UpdateUser`;
    return this.http.post<StatusResult>(url, user);
  }

  searchPage(filter: string): Observable<Page[]> {
    var params = new HttpParams().set('filter', filter);
    return this.http.get<Page[]>(`${this.url}SearchPage`,
      { params: params });
  }

  pageSetup(data: UserPageRelation): Observable<any> {
    return this.http.post<any>(`${this.url}PageSetup`, data);
  }
}
