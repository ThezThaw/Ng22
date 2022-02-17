import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppUserService } from '../../services/app-user.service';
import { BottomSheetComponent } from '../../shared/controls/bottom-sheet.component';
import { PopupComponent } from '../../shared/controls/popup.component';
import { CommonMethodService } from '../../shared/service';
import { NotifierService } from "angular-notifier";
import { MissionService } from '../../services/mission.service';
import { Mission, MissionDetails } from '../../shared/models/mission.data';
import { Const } from '../../shared/const';

@Component({
  selector: 'add-instruction',
  templateUrl: './add-instruction.component.html',
})
export class AddInstructionComponent implements OnInit, OnDestroy {
  @Input() md: MissionDetails;
  @Output() closeEmitter = new EventEmitter();

  fg: FormGroup;
  get c() { return this.fg.controls; }
  focusElementId = '#instruction';
  busy: boolean = false;

  constructor(
    private fb: FormBuilder,
    private notiSvc: NotifierService,
    private bs: BottomSheetComponent,
    private cfm: PopupComponent,
    private cms: CommonMethodService,
    private missionSvc: MissionService) { }

  ngOnDestroy(): void {

  }

  ngOnInit(): void {
    this.fg = this.fb.group({
      uid: [this.md?.instruction ? this.md?.uid : Const.EmptyGuid],
      missionuid: [this.md?.missionUid],
      instruction: [this.md?.instruction, Validators.required],
    });

    this.touch();
    this.cms.focus(this.focusElementId);
  }

  close() {
    this.closeEmitter.emit();
  }

  save() {
    if (this.fg.invalid) return;
    this.setBusy(true);
    let raw = this.fg.getRawValue() as MissionDetails;
    this.missionSvc.AddUpdateMissionDetails(raw).subscribe(result => {
      if (result.status === true) {

        this.notiSvc.notify('success', this.md?.uid ? 'UPDATED' : 'ADDED');
        this.closeEmitter.emit(result.data);

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
}
