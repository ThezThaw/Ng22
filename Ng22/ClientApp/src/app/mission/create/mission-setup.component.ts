import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MissionService } from '../../services/mission.service';
import { Const } from '../../shared/const';
import { PopupComponent } from '../../shared/controls/popup.component';
import { Mission } from '../../shared/models/mission.data';
import { Header, HeaderButton } from '../../shared/models/shared-data.model';
import { CommonMethodService, HeaderService } from '../../shared/service';

@Component({
  selector: 'mission-setup',
  templateUrl: './mission-setup.component.html',
  styleUrls: ['mission-setup.component.css'],
})
export class MissionSetupComponent implements OnInit, OnDestroy {

  btn: any[] = [{ 'icon': 'add' }];
  fg: FormGroup;
  get c() { return this.fg.controls; }
  focusElementId = '#title';
  ssx: Subscription = new Subscription();

  lst: Mission[] = [];
  addNew: boolean = false;
  selectedMission: Mission;

  constructor(
    private ref: ChangeDetectorRef,
    private fb: FormBuilder,
    private cms: CommonMethodService,
    private popup: PopupComponent,
    private hdrSvc: HeaderService,
    private missionSvc: MissionService) {    
    this.hdrSvc.clickEvent$.subscribe(btn => {      
      if (btn && (btn as HeaderButton)?.ownby == Const.CurrentPageMissionSetup) this[(btn as HeaderButton)?.func]();
    });
  }

  ngOnDestroy(): void {
    this.ssx?.unsubscribe();
  }

  ngOnInit(): void {
    this.getList();
    this.setHeader();
  }

  addNewMission() {
    this.addNew = true;
  }

  getList() {
    var ssx = this.missionSvc.searchMission().subscribe(x => {
      this.lst = x;
    });
    this.ssx.add(ssx);
  }

  edit(val: Mission) {
    this.selectedMission = val;
    this.ref.detectChanges();
    this.addNew = true;
  }

  switchUi() {
    this.addNew = false;    
    this.selectedMission = null;
    this.setHeader();
    this.getList();
  }

  setHeader() {
    let h: Header = {
      btn: [{
        name: 'Add New Mission',
        func: 'addNewMission',
        ownby: Const.CurrentPageMissionSetup
      }]
    };
    this.hdrSvc.setHeader(h);
  }


}
