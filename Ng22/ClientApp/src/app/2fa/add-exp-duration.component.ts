import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TwoFAService } from '../services/2fa.service';
import { Const } from '../shared/const';
import { NotifierService } from "angular-notifier";
import { BottomSheetComponent } from '../shared/controls/bottom-sheet.component';
import { PopupComponent } from '../shared/controls/popup.component';
import { ExpiryConfigVm } from '../shared/models/2fa.data';
import { CommonMethodService } from '../shared/service';

@Component({
  selector: 'add-exp-duration',
  templateUrl: './add-exp-duration.component.html',
})
export class AddExpireDurationComponent implements OnInit, OnDestroy {
  @Input() lst;
  @Output() closeEmitter = new EventEmitter();

  fg: FormGroup;
  get c() { return this.fg.controls; }
  focusElementId = '#duration';
  busy: boolean = false;
  selectedUnit: any = { 'id': 'M', 'name': 'Minute' }

  constructor(
    private fb: FormBuilder,
    private popup: PopupComponent,
    private bs: BottomSheetComponent,
    private notiSvc: NotifierService,
    private twoFaSvc: TwoFAService,
    private cms: CommonMethodService) { }

  ngOnDestroy(): void {

  }

  ngOnInit(): void {
    this.fg = this.fb.group({
      unit: [],
      duration: [null, [Validators.required, Validators.min(1), Validators.max(60)]],
    });

    this.touch();
    this.cms.focus(this.focusElementId);
  }

  close() {
    this.closeEmitter.emit();
  }

  delete(uid) {

    var confirm = this.popup.show(Const.PopupTypeConfirmation, true, '25%', 'Confirm delete ?');
    confirm.afterClosed().subscribe(yes => {
      if (!yes) return;

      this.setBusy(true);
      this.twoFaSvc.RemoveExpiryConfig(uid).subscribe(result => {
        if (result.status === true) {
          this.notiSvc.notify('error', 'DELETED');          
          this.lst = this.lst.filter(x => x.id != uid);
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

  save() {
    if (this.fg.invalid) return;
    this.setBusy(true);
    let data: ExpiryConfigVm = {
      uid: Const.EmptyGuid,
      duration: this.c.duration.value,
      unit: this.selectedUnit['id']
    };

    this.twoFaSvc.AddExpiryConfig(data).subscribe(result => {
      if (result.status === true) {
        
        //this.notiSvc.notify('success', this.md?.uid ? 'UPDATED' : 'ADDED');
        this.closeEmitter.emit(result.data);

      } else {
        this.cms.focus(this.focusElementId);
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

  changeToggle() {    
    this.selectedUnit = this.c.unit.value;
    if (this.selectedUnit['id'] == 'M') {      
      this.c.duration.setValidators(Validators.max(60));
    } else if (this.selectedUnit['id'] == 'H') {
      this.c.duration.setValidators(Validators.max(24));
    } else if (this.selectedUnit['id'] == 'D') {
      this.c.duration.setValidators(Validators.max(30));
    }
    this.c.duration.updateValueAndValidity();
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
