import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Const } from "../shared/const";

@Injectable({
  providedIn: 'root'
})

export class AppConfigService {

  public cfg: any;

  constructor(private http: HttpClient) { }
   
  loadAppConfig() {
    return this.http.get('/assets/appconfig.json')
      .toPromise()
      .then(data => {
        this.cfg = data;
        Const.dbounceTime = Number(this.cfg['dbounceTime']) * 1000;        
      });
  }
}
