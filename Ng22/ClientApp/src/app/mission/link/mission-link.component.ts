import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MissionService } from '../../services/mission.service';
import { Const } from '../../shared/const';
import { PopupComponent } from '../../shared/controls/popup.component';
import { Mission, MissionUserRelation } from '../../shared/models/mission.data';
import { Header, HeaderButton } from '../../shared/models/shared-data.model';
import { CommonMethodService, HeaderService } from '../../shared/service';

@Component({
  selector: 'mission-link',
  templateUrl: './mission-link.component.html',
})
export class MissionLinkComponent implements OnInit, OnDestroy {

  btn: any[] = [{ 'icon': 'add' }];
  fg: FormGroup;
  get c() { return this.fg.controls; }
  focusElementId = '#title';
  ssx: Subscription = new Subscription();

  lst: Mission[] = [];
  addNew: boolean = false;
  selected: MissionUserRelation;

  constructor(
    private ref: ChangeDetectorRef,
    private fb: FormBuilder,
    private cms: CommonMethodService,
    private popup: PopupComponent,
    private hdrSvc: HeaderService,
    private missionSvc: MissionService) {

    this.hdrSvc.clickEvent$.subscribe(btn => {
      if (btn && (btn as HeaderButton)?.ownby == Const.CurrentPageAssignMissionList) this[(btn as HeaderButton)?.func]();
    });
  }

  ngOnDestroy(): void {
    this.ssx?.unsubscribe();
  }

  ngOnInit(): void {
    this.getList();
    this.setHeader();
  }

  assign() {
    this.addNew = true;
  }

  getList() {
    var ssx = this.missionSvc.GetAssignedMission().subscribe(x => {
      this.lst = x;
    });
    this.ssx.add(ssx);
  }

  switchUi() {
    this.addNew = false;
    this.selected = null;
    this.setHeader();
    this.getList();
  }

  setHeader() {
    let h: Header = {
      btn: [{
        name: 'Assign to User',
        icon: 'how_to_reg',
        func: 'assign',
        ownby: Const.CurrentPageAssignMissionList
      }]
    };
    this.hdrSvc.setHeader(h);
  }

  edit(val) {
    this.selected = val;
    this.ref.detectChanges();
    this.addNew = true;
  }
}
