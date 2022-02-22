import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppUserService } from '../services/app-user.service';
import { NotifierService } from "angular-notifier";
import { AppUser } from '../shared/models/app-user.data';
import { CommonMethodService, HeaderService } from '../shared/service';
import { BottomSheetComponent } from '../shared/controls/bottom-sheet.component';
import { PopupComponent } from '../shared/controls/popup.component';
import { Const } from '../shared/const';
import { Header, HeaderButton } from '../shared/models/shared-data.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'user-card',
  templateUrl: './user-card.component.html',
})
export class UserCardComponent implements OnInit, OnDestroy {
  @Input() user: AppUser;
  @Input() self: boolean = false;  
  @Output() gobackEmitter = new EventEmitter();

  fg: FormGroup;
  get c() { return this.fg.controls; }
  focusElementId = '#userId';
  readonly Const = Const;
  busy: boolean = false;
  ssx: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private notiSvc: NotifierService,
    private bs: BottomSheetComponent,
    private cfm: PopupComponent,
    private hdrSvc: HeaderService,
    private cms: CommonMethodService,
    private appUserSvc: AppUserService) {
    var ssx = this.hdrSvc.clickEvent$.subscribe(btn => {
      if (btn && (btn as HeaderButton)?.ownby == Const.CurrentPageUserCard) this[(btn as HeaderButton)?.func]();
    });
    this.ssx.add(ssx);
  }

  ngOnDestroy(): void {
    this.ssx?.unsubscribe();
  }

  ngOnInit(): void {
    this.focusElementId = this.user ? '#nickName' : '#userId';

    this.fg = this.fb.group({
      userId: [this.user?.userId, [Validators.required, Validators.pattern(Const.RegxNotAllowedSpacePattern)]],
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
    this.setHeader();
  }

  save() {
    if (this.fg.invalid) return;
    let user = this.fg.getRawValue() as AppUser;
    user.uid = this.user?.uid;
    user.alive = true;
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

        this.setBusy(false);
        this.gobackEmitter.emit();

      } else {
        this.bs.open(result.message);
        this.setBusy(false);
        this.touch();
        this.cms.focus(this.focusElementId);
      }

      

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
        this.setBusy(false);
        this.gobackEmitter.emit();

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

  setHeader() {
    let h: Header = {
      btn: [{
        name: 'Save',
        icon: 'save',
        func: 'save',
        ownby: Const.CurrentPageUserCard
      }]
    };

    if (this.user && this.user.userId != Const.AppUserAdmin && !this.self) {
      h.btn.push({
        name: 'Delete',
        icon:'delete_forever',
        func: 'delete',
        color: 'warn',
        ownby: Const.CurrentPageUserCard
      });
    }

    if (!this.self) {
      h.btn.push({
        name: 'Go Back',
        icon:'arrow_left',
        func: 'cancel',
        color: 'basic',
        ownby: Const.CurrentPageUserCard
      });
    }    
    this.hdrSvc.setHeader(h);
  }
}
