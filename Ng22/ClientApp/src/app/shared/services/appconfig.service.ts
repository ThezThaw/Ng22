import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

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
        //LibConst.dbounceTimePos = Number(this.cfg['dbounceTimePos']) * 1000;
        //LibConst.dbounceTimeOther = Number(this.cfg['dbounceTimeOther']) * 1000;
        //Const.useViewImage = Boolean(this.cfg['useViewImage']);
      });
  }
}
