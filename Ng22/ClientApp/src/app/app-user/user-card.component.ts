import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppUserService } from '../services/app-user.service';
import { NotifierService } from "angular-notifier";
import { AppUser } from '../shared/models/app-user.data';
import { CommonMethodService } from '../shared/service';
import { BottomSheetComponent } from '../shared/controls/bottom-sheet.component';
import { PopupComponent } from '../shared/controls/popup.component';
import { Const } from '../shared/const';

@Component({
  selector: 'user-card',
  templateUrl: './user-card.component.html',
})
export class UserCardComponent implements OnInit, OnDestroy {
  @Input() user: AppUser;
  @Input() self: boolean = false;
  @Output() afterDeleteEmitter = new EventEmitter();

  fg: FormGroup;
  get c() { return this.fg.controls; }
  focusElementId = '#userId';
  readonly Const = Const;
  busy: boolean = false;

  constructor(
    private fb: FormBuilder,
    private notiSvc: NotifierService,
    private bs: BottomSheetComponent,
    private cfm: PopupComponent,
    private cms: CommonMethodService,
    private appUserSvc: AppUserService) {}

  ngOnDestroy(): void {

  }

  ngOnInit(): void {
    this.fg = this.fb.group({
      userId: [this.user?.userId, [Validators.required]],
      nickName: [this.user?.nickName],
      changepassword: [],
      currentpassword: [],
      password: [this.user?.password],
    });

    if (this.user === undefined) {
      this.c.password.setValidators(Validators.required);
      this.c.password.updateValueAndValidity();
    }

    this.touch();
    this.cms.focus(this.focusElementId);
  }

  save() {
    if (this.fg.invalid) return;
    let user = this.fg.getRawValue() as AppUser;
    user.uid = this.user?.uid;
    user.skippassword = !this.c.changepassword.value;
    this.setBusy(true);

    this.appUserSvc.createUpdate(user, this.user == null).subscribe(result => {

      if (result.status === true) {

        if (this.user) {
          this.notiSvc.notify('success', 'UPDATED');
        } else {
          this.fg.reset();
          this.notiSvc.notify('success', 'CREATED');
        }
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

  delete() {

    var confirm = this.cfm.show(Const.PopupTypeConfirmation, true, '25%', 'Confirm delete ?');
    confirm.afterClosed().subscribe(yes => {
      if (!yes) return;

      let user = this.user;
      user.alive = false;
      this.setBusy(true);
      this.appUserSvc.createUpdate(user, false).subscribe(x => {

        this.notiSvc.notify('error', 'DELETED');
        this.afterDeleteEmitter.emit();

      }, err => {
        this.setBusy(false);
        this.cms.focus(this.focusElementId);
        this.bs.open(JSON.stringify(err));
      });
    });
  }

  changePassword() {

    if (this.c.changepassword.value) {
      if (this.self) {
        this.c.currentpassword.setValidators(Validators.required);        
      }
      this.c.password.setValidators(Validators.required);
      
    } else {
      this.c.currentpassword.clearValidators();
      this.c.password.clearValidators();
    }

    this.c.currentpassword.updateValueAndValidity();
    this.c.password.updateValueAndValidity();
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
