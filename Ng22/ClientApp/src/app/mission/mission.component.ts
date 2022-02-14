import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../login/module/services/auth.service';
import { MissionService } from '../services/mission.service';
import { Mission } from '../shared/models/mission.data';

@Component({
  selector: 'mission',
  templateUrl: './mission.component.html',
})
export class MissionComponent implements OnInit, OnDestroy {
  missions: Mission[];

  constructor(
    private authService: AuthService,
    private missionSvc: MissionService) { }

  ngOnDestroy(): void {

  }

  ngOnInit(): void {

    this.missionSvc.getMission().subscribe(m => {
      this.missions = m;
    });

  }
}
