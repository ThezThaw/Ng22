import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BehaviorSubject } from "rxjs";
import { map } from "rxjs/operators";
import { Mission, MissionDetails } from "../models/mission.data";
import { AppConfigService } from "./appconfig.service";

@Injectable({
  providedIn: 'root'
})

export class MissionService {

  public cfg: any;
  private missions = new BehaviorSubject<Mission[]>(null);
  private missions$: Observable<Mission[]> = this.missions.asObservable();

  constructor(private http: HttpClient,
    private appCfgSvc: AppConfigService) { }
   
  setMission(missions) {
    this.missions.next(missions);
  }

  getMission(): Observable<Mission[]> {
    if (this.missions.value) return this.missions$;
    return this.http.get<Mission[]>(`${this.appCfgSvc.cfg["baseUrl"]}api/mission/get-mission`).pipe(map(m => {
      this.missions.next(m);
      return m;
    }));
  }

  getMissionDetails(): Observable<MissionDetails> {



    return this.http.get<MissionDetails>(`${this.appCfgSvc.cfg["baseUrl"]}api/mission/l2/get-mission-details`);
  }

}
