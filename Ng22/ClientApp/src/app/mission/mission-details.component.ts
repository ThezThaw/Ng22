import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { L2LoginComponent } from '../home/l2-login/l2-login.component';
import { AuthService } from '../login/module/services/auth.service';
import { MissionService } from '../shared/services/mission.service';

@Component({
  selector: 'mission-details',
  templateUrl: './mission-details.component.html',
})
export class MissionDetailsComponent implements OnInit, OnDestroy {
  @Output() cancelEmitter = new EventEmitter();
  instructions: any;
  l2login: any;
  authorized: boolean = false;
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private missionSvc: MissionService,
    private l2login_popup: L2LoginComponent) { }

  ngOnDestroy(): void {

    if (this.l2login) {
      this.l2login.close();
    }
  }

  ngOnInit(): void {
    this.getMissionDetails();
  }


  getMissionDetails() {
    this.loading = true;
    this.authorized = false;
    this.authService.isloggedIn_isValidToken(true, false).subscribe(ok => {
      if (ok) {

        this.missionSvc.getMissionDetails().subscribe(d => {          
          this.instructions = d.instructions;
          this.authorized = true;
        });

      } else {
        localStorage.removeItem('token-l2');
        this.l2login = this.l2login_popup.show();


        this.l2login.afterClosed().subscribe(d => {
          if (d == 'cancel') {
            this.loading = false;
            return;
          }

          if (d) {
            this.instructions = d.instructions;
            this.authorized = true;
          }
        });

      }
    });
  }

}
