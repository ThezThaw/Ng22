import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { map, tap, delay, finalize } from 'rxjs/operators';
import { AppConfigService } from 'src/app/shared/services/appconfig.service';
import { AppUser, LoginRequest, LoginResult } from '../../../shared/models/login.data';
import { MissionService } from '../../../shared/services/mission.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {  
  private timer: Subscription;
  private _user = new BehaviorSubject<AppUser>(null);
  user$: Observable<AppUser> = this._user.asObservable();



  private storageEventListener(event: StorageEvent) {
    if (event.storageArea === localStorage) {
      if (event.key === 'logout-event') {
        this.finishLogout();
      }
    }
  }

  constructor(private router: Router, private http: HttpClient,
    private appCfgSvc: AppConfigService,
    private missionSvc: MissionService) {
    window.addEventListener('storage', this.storageEventListener.bind(this));
  }

  ngOnDestroy(): void {
    window.removeEventListener('storage', this.storageEventListener.bind(this));
  }

  isloggedIn_isValidToken(isL2token: boolean, isStartup: boolean): any {
    const token = localStorage.getItem(isL2token ? 'token-l2' : 'token');
    if (token) {
      const expires = this.getExpire(token);
      if (expires < (new Date)) {
        if (!isL2token) {
          this.router.navigate(['login']);
        }        
        return of(false);
      }

      if (isStartup) {
        this.startTokenTimer();
      }
      return of(true);
    } else {
      return of(false);
    }
  }

  getUserInfo(): Observable<AppUser> {

    if (this._user.value) return this.user$;
    return this.http.get<AppUser>(`${this.appCfgSvc.cfg["baseUrl"]}api/auth/get-user`).pipe(map(x => {
      this._user.next({
        userId: x.userId,
        nickName: x.nickName
      });
      return x;
    }));
  }

  login(username: string, password: string) {
    let vm: LoginRequest =
    {
      userId: username,
      password: password
    }
    return this.http
      .post<LoginResult>(`${this.appCfgSvc.cfg["baseUrl"]}api/auth/token-l1`, vm)
      .pipe(
        map((x) => {
          this._user.next({
            userId: x.userInfo.userId,
            nickName: x.userInfo.nickName
          });
          this.missionSvc.setMission(x.missions);
          this.setLocalStorage(x);
          this.startTokenTimer();
          return x;
        })
      );
  }

  logout() {
    this.clearLocalStorage();
    this.finishLogout();
  }

  finishLogout() {    
    this._user.next(null);    
    this.stopTokenTimer();
    this.router.navigate(['login']);
  }

  setLocalStorage(x: LoginResult) {
    localStorage.setItem('token', x.token);
    //localStorage.setItem('login-event', 'login' + Math.random());
  }

  clearLocalStorage() {
    localStorage.removeItem('token');
    //localStorage.removeItem('login-event');
    localStorage.removeItem('token-l2');
    localStorage.setItem('logout-event', 'logout' + Math.random());
  }

  private getExpire(token:string = null) {
    token = token ? token : localStorage.getItem('token');
    if (!token) {
      return null;
    }
    const jwtToken = JSON.parse(atob(token.split('.')[1]));
    const expires = new Date(jwtToken.exp * 1000);
    return expires;
  }

  private getTokenRemainingTime() {
    const expires = this.getExpire();
    if (expires) {
      return expires.getTime() - Date.now();
    } else {
      return 0;
    }
  }

  private startTokenTimer() {
    const timeout = this.getTokenRemainingTime();
    this.timer = of(true)
      .pipe(
        delay(timeout),
        tap(() => this.logout())
      )
      .subscribe();
  }

  private stopTokenTimer() {
    this.timer?.unsubscribe();
  }
}
