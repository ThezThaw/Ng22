import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BehaviorSubject } from "rxjs";
import { map } from "rxjs/operators";
import { Mission, MissionDetails, MissionUserRelation } from "../shared/models/mission.data";
import { AppConfigService } from "./appconfig.service";

@Injectable({
  providedIn: 'root'
})

export class MissionService {
  public url: string;
  private missions = new BehaviorSubject<Mission[]>(null);
  private missions$: Observable<Mission[]> = this.missions.asObservable();

  constructor(private http: HttpClient,
    private appCfgSvc: AppConfigService) {
    
  }
   
  setMission(missions) {
    this.missions.next(missions);
  }

  getMission(userId: string=''): Observable<Mission[]> {
    if (this.missions.value) return this.missions$;
    var params = new HttpParams().set('userId', userId);
    return this.http.get<Mission[]>(`${this.appCfgSvc.cfg["baseUrl"]}api/mission/GetMissionByUser`, { params: params })
      .pipe(map(m => {
        this.missions.next(m);
        return m;
    }));
  }

  getMissionDetails(missionUid: string): Observable<MissionDetails> {
    var params = new HttpParams().set('missionUid', missionUid);
    return this.http.get<MissionDetails>(`${this.appCfgSvc.cfg["baseUrl"]}api/mission/l2/GetMissionDetails`,
      { params: params });
  }

  createUpdate(mission: Mission): Observable<any> {
    return this.http.post<any>(`${this.appCfgSvc.cfg["baseUrl"]}api/mission/AddMission`, mission);
  }

  searchMission(filter: string): Observable<Mission[]> {
    var params = new HttpParams().set('filter', filter);
    return this.http.get<Mission[]>(`${this.appCfgSvc.cfg["baseUrl"]}api/mission/SearchMission`,
      { params: params });
  }

  linkMission(data: MissionUserRelation): Observable<any> {
    return this.http.post<any>(`${this.appCfgSvc.cfg["baseUrl"]}api/mission/LinkMission`, data);
  }
}
