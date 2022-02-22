import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../login/module/services/auth.service';
import { MissionService } from '../services/mission.service';
import { Const } from '../shared/const';
import { PopupComponent } from '../shared/controls/popup.component';
import { Mission, MissionDetails } from '../shared/models/mission.data';

@Component({
  selector: 'mission',
  templateUrl: './mission.component.html',
})
export class MissionComponent implements OnInit, OnDestroy {
  missions: Mission[];
  lstDetails: MissionDetails[];

  constructor(
    private authService: AuthService,
    private popup: PopupComponent,
    private missionSvc: MissionService) { }

  ngOnDestroy(): void {

  }

  ngOnInit(): void {

    this.authService.getUserInfo().subscribe(u => {
      this.missionSvc.getMission(u?.userId).subscribe(m => {
        this.missions = m;
      });
    });

  }


  viewDetails(m) {    
    this.authService.isloggedIn_isValidToken(true, false).subscribe(ok => {
      if (ok) {

        this.missionSvc.getMissionDetails(true, m.uid).subscribe(md => {
          m.missionDetails = md;
        });

      } else {
        localStorage.removeItem('token-l2');
        this.l2Login(m);
      }
    });
  }

  l2Login(m) {
    var p = this.popup.show(Const.PopupTypeL2Login, true, '95%', m.uid);
    p.afterClosed().subscribe(result => {
      if (result) {

        m.missionDetails = result;

        //var existing = this.lst.find(x => x.uid == result.uid);
        //if (existing) {
        //  existing.instruction = result.instruction;
        //  existing.updatedOn = result.updatedOn;
        //} else {
        //  this.lst.push(result as MissionDetails);
        //}
      }
    });
  }

  closed() {
    alert('closed');
  }

}
