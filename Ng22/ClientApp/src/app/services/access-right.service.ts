import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Page, UserPageRelation } from "../shared/models/access-right.data";

import { AppConfigService } from "./appconfig.service";

@Injectable({
  providedIn: 'root'
})

export class AccessRightService {
  public url: string;
  constructor(private http: HttpClient,
    private appCfgSvc: AppConfigService)
  {
    this.url = `${this.appCfgSvc.cfg["baseUrl"]}api/AccessRight/`;
  }

  getAvailablePageByUser(userId): Observable<Page[]> {
    return this.http.get<Page[]>(`${this.url}GetAvailablePageByUser/${userId}`);
  }

  searchPage(filter: string = ''): Observable<Page[]> {
    var params = new HttpParams().set('filter', filter);
    return this.http.get<Page[]>(`${this.url}SearchPage`,
      { params: params });
  }

  AddAccessRight(data: UserPageRelation[]): Observable<any> {
    return this.http.post<any>(`${this.url}AddAccessRight`, data);
  }

  GetAccessRightList(useruid?): Observable<any> {
    var params = useruid ? new HttpParams().set('useruid', useruid) : new HttpParams();
    return this.http.get<any>(`${this.url}GetAccessRightList`,
      { params: params });
  }

  RemoveAccessRight(useruid): Observable<any> {
    return this.http.post<any>(`${this.url}RemoveAccessRight/${useruid}`, null);
  }
}
