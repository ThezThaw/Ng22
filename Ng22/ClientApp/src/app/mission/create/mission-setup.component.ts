import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../../login/module/services/auth.service';
import { MissionService } from '../../services/mission.service';
import { Const } from '../../shared/const';
import { Mission, MissionDetails } from '../../shared/models/mission.data';
import { CommonMethodService } from '../../shared/service';

@Component({
  selector: 'mission-setup',
  templateUrl: './mission-setup.component.html',
})
export class MissionSetupComponent implements OnInit, OnDestroy {
  fg: FormGroup;
  get c() { return this.fg.controls; }
  focusElementId = '#title';

  constructor(
    private fb: FormBuilder,
    private cms: CommonMethodService,
    private authService: AuthService,
    private missionSvc: MissionService) { }

  ngOnDestroy(): void {

  }

  ngOnInit(): void {
    this.fg = this.fb.group({
      title: [],
      brief: [],
      instruction: []
    });

    for (let c in this.fg.controls) {
      this.fg.controls[c].markAsTouched();
    }

    this.cms.focus(this.focusElementId);
  }

  save() {
    if (this.fg.invalid) return;
    let raw = this.fg.getRawValue();



    let md: MissionDetails = {
      missionuid: Const.EmptyGuid,
      instruction: raw.instruction
    };
    

    let m: Mission =
    {
      title: raw.title,
      brief: raw.brief,
      missiondetails: []
    }

    m.missiondetails.push(md);    

    this.missionSvc.createUpdate(m).subscribe(x => {
      this.fg.reset();
      this.cms.focus(this.focusElementId);
    });
  }
}
