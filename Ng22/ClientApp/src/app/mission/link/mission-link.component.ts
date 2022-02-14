import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AppUserService } from '../../services/app-user.service';
import { MissionService } from '../../services/mission.service';
import { MissionUserRelation } from '../../shared/models/mission.data';

@Component({
  selector: 'mission-link',
  templateUrl: './mission-link.component.html',
})
export class MissionLinkComponent implements OnInit, OnDestroy {

  fg: FormGroup;
  get c() { return this.fg.controls; }

  constructor(
    private fb: FormBuilder,
    public missionSvc: MissionService,
    public appUserSvc: AppUserService) { }

  ngOnDestroy(): void {

  }

  ngOnInit(): void {
    this.fg = this.fb.group({
      mission: [],
      user: [],
    });

    for (let c in this.fg.controls) {
      this.fg.controls[c].markAsTouched();
    }
  }

  save() {

    if (this.fg.invalid) return;
    var raw = this.fg.getRawValue();

    let data: MissionUserRelation = {
      missionuid: raw.mission['uid'],
      useruid: raw.user['uid']
    };

    this.missionSvc.linkMission(data).subscribe(x => {
      this.fg.reset();
    });

  }
}
