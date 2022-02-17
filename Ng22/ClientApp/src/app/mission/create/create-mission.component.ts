import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotifierService } from "angular-notifier";
import { Subscription } from 'rxjs';
import { MissionService } from '../../services/mission.service';
import { Const } from '../../shared/const';
import { BottomSheetComponent } from '../../shared/controls/bottom-sheet.component';
import { PopupComponent } from '../../shared/controls/popup.component';
import { Mission, MissionDetails } from '../../shared/models/mission.data';
import { Header, HeaderButton } from '../../shared/models/shared-data.model';
import { CommonMethodService, HeaderService } from '../../shared/service';

@Component({
  selector: 'create-mission',
  templateUrl: './create-mission.component.html',
  //styleUrls: ['mission-setup.component.css'],
})
export class CreateMissionComponent implements OnInit, OnDestroy {
  @Input() mission: Mission;
  @Output() gobackEmitter = new EventEmitter();
  //@ViewChild(InstructionListComponent) child: InstructionListComponent;

  btn: any[] = [{ 'icon': 'save' }];
  fg: FormGroup;
  get c() { return this.fg.controls; }
  focusElementId = '#title';
  busy: boolean = false;
  ssx: Subscription = new Subscription();

  lst: MissionDetails[];

  constructor(
    private ref: ChangeDetectorRef,
    private fb: FormBuilder,
    private cms: CommonMethodService,
    private popup: PopupComponent,
    private notiSvc: NotifierService,
    private bs: BottomSheetComponent,
    private hdrSvc: HeaderService,
    private missionSvc: MissionService) {
    var ssx = this.hdrSvc.clickEvent$.subscribe(btn => {
      if (btn && (btn as HeaderButton)?.ownby == Const.CurrentPageCreateMission) this[(btn as HeaderButton)?.func]();
    });
    this.ssx.add(ssx);
  }

  ngOnDestroy(): void {
    this.ssx?.unsubscribe();
  }

  ngOnInit(): void {

    if (this.mission) this.refreshInstructionList();

    this.fg = this.fb.group({
      title: [this.mission?.title, Validators.required],
      brief: [this.mission?.brief, Validators.required],
    });

    this.touch();
    this.cms.focus(this.focusElementId);
    this.setHeader();
  }

  setHeader() {
    let h: Header = {
      btn: [{
        name: 'Save Mission',
        func: 'save',
        ownby: Const.CurrentPageCreateMission
      }]
    };

    if (this.mission) {
      h.btn.push({
        name: 'Delete Mission',
        func: 'delete',
        color: 'warn',
        ownby: Const.CurrentPageCreateMission
      },
      {
        name: 'Add Instruction',
        func: 'addInstruction',
        ownby: Const.CurrentPageCreateMission
      });
    }

    h.btn.push({
      name: 'Go Back',
      func: 'cancel',
      color: 'basic',
      ownby: Const.CurrentPageCreateMission
    });    
    this.hdrSvc.setHeader(h);
  }

  delete() {

    var assigned = this.mission.isAssigned ? 'Already assigned to user.' : '';
    var confirm = this.popup.show(Const.PopupTypeConfirmation, true, '25%', `${assigned} Confirm delete ?`);
    confirm.afterClosed().subscribe(yes => {
      if (!yes) return;

      this.mission.alive = false;
      this.setBusy(true);

      this.missionSvc.AddUpdateMission(this.mission).subscribe(result => {
        if (result.status === true) {
          this.notiSvc.notify('error', 'DELETED');
          this.gobackEmitter.emit('deleted');
        } else {
          this.bs.open(result.message);
        }

        this.setBusy(false);
        this.touch();
        this.cms.focus(this.focusElementId);

      }, err => {
        this.setBusy(false);
        this.cms.focus(this.focusElementId);
        this.bs.open(JSON.stringify(err));
      });


    });
    
  }

  save() {    
    if (this.fg.invalid) return;
    this.setBusy(true);
    let raw = this.fg.getRawValue() as Mission;
    raw.uid = this.mission?.uid;
    this.missionSvc.AddUpdateMission(raw).subscribe(result => {
      if (result.status === true) {        
        if (this.mission) {
          this.notiSvc.notify('success', 'UPDATED');
        } else {          
          this.notiSvc.notify('success', 'CREATED');
          this.mission = result.data;
          this.setHeader();
        }       
        this.refreshInstructionList();
      } else {
        this.bs.open(result.message);
      }

      this.setBusy(false);
      this.touch();
      this.cms.focus(this.focusElementId);

    }, err => {
      this.setBusy(false);
      this.cms.focus(this.focusElementId);
      this.bs.open(JSON.stringify(err));
    });
  }

  setBusy(busy) {
    this.busy = busy;
    this.hdrSvc.setBusy(busy);
    if (busy) {
      this.fg.disable();
    } else {
      this.fg.enable();
    }
  }

  touch() {
    for (let c in this.fg.controls) {
      this.fg.controls[c].markAsTouched();
    }
  }

  cancel() {
    this.gobackEmitter.emit('cancel');
  }

  refreshInstructionList() {
    var ssx = this.missionSvc.getMissionDetails(false, this.mission.uid).subscribe(x => {
      this.mission.missiondetails = this.lst = x;
    });
    this.ssx.add(ssx);
  }

  addInstruction(md: MissionDetails) {
    if (md == undefined) {
      md = {
        missionUid: this.mission.uid,
        instruction: null
      };
    }

    var p = this.popup.show(Const.PopupTypeAddInstruction, true, '90%', md);
    p.afterClosed().subscribe(result => {
      if (result) {

        var existing = this.lst.find(x => x.uid == result.uid);
        if (existing) {
          existing.instruction = result.instruction;
          existing.updatedDt = result.updatedDt;
        } else {
          this.lst.push(result as MissionDetails);
        }
      }
    });

  }

  deleteInstruction(md: MissionDetails) {

    var assigned = this.mission.isAssigned ? 'Already assigned to user.' : '';
    var confirm = this.popup.show(Const.PopupTypeConfirmation, true, '25%', `${assigned} Confirm delete ?`);
    confirm.afterClosed().subscribe(yes => {
      if (!yes) return;
      this.setBusy(true);

      this.missionSvc.DeleteMissionDetails(md).subscribe(result => {
        if (result.status === true) {
          this.notiSvc.notify('error', 'DELETED');
          this.refreshInstructionList();
        } else {
          this.bs.open(result.message);
        }

        this.setBusy(false);

      }, err => {
        this.setBusy(false);

        this.bs.open(JSON.stringify(err));
      });


    });

  }
}
