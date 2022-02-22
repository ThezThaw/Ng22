import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotifierService } from "angular-notifier";
import { CommonMethodService, HeaderService } from '../shared/service';
import { BottomSheetComponent } from '../shared/controls/bottom-sheet.component';
import { PopupComponent } from '../shared/controls/popup.component';
import { Const } from '../shared/const';
import { Header, HeaderButton } from '../shared/models/shared-data.model';
import { Subscription } from 'rxjs';
import { TwoFAService } from '../services/2fa.service';
import { TwoFA } from '../shared/models/2fa.data';

@Component({
  selector: 'two-fa-setup',
  templateUrl: './2fa-setup.component.html',
})
export class TwoFASetupComponent implements OnInit, OnDestroy {
  @Output() gobackEmitter = new EventEmitter();
  lst: any[];
  selected: any = {
    'id': Const.Default2FAExpiryUid,
    'name': ''
  };
  add_new: any = {
    'id': 'addnew',
    'name': `Add New Duration`,
    'icon': 'add'
  };

  fg: FormGroup;
  get c() { return this.fg.controls; }
  focusElementId = '#passcode';
  readonly Const = Const;
  busy: boolean = false;
  ssx: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private ref: ChangeDetectorRef,
    private notiSvc: NotifierService,
    private bs: BottomSheetComponent,
    private popup: PopupComponent,
    private hdrSvc: HeaderService,
    private cms: CommonMethodService,
    public twoFASvc: TwoFAService) {
    var ssx = this.hdrSvc.clickEvent$.subscribe(btn => {
      if (btn && (btn as HeaderButton)?.ownby == Const.CurrentPage2FASetup) this[(btn as HeaderButton)?.func]();
    });
    this.ssx.add(ssx);
  }

  ngOnDestroy(): void {
    this.ssx?.unsubscribe();
  }

  ngOnInit(): void {
    this.fg = this.fb.group({
      passcode: [null, [Validators.required, Validators.pattern(Const.RegxNotAllowedSpacePattern)]],
      expiry: [],
    });

    this.refreshExpiryList();

    this.touch();
    this.cms.focus(this.focusElementId);
    this.setHeader();
  }

  refreshExpiryList() {
    var ssx = this.twoFASvc.Get2FAExpiry().subscribe(x => {
      this.lst = x;
      this.lst.push(this.add_new);
    });
    this.ssx.add(ssx);
  }

  save() {
    if (this.fg.invalid) return;
    let data = this.fg.getRawValue() as TwoFA;
    data.uid = Const.EmptyGuid;
    data.expireUid = this.selected['id'];
    this.setBusy(true);

    this.twoFASvc.Add2FA(data).subscribe(result => {

      if (result.status === true) {

        this.notiSvc.notify('success', 'ADDED');
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

  addNewDuration() {

    let l = this.lst.slice(0, -1);//remove addnew button    
    //l = l.reverse().slice(0, -1);//remove default
    l.shift();

    var p = this.popup.show(Const.PopupTypeAddDuration, true, '50%', l);
    p.afterClosed().subscribe(result => {

      //this.lst = this.lst.slice(0, -1);//remove addnew button

      //if (result) {                
      //  let d = {
      //    'id': result.uid,
      //    'name': `${result.duration} ${result.unit}`
      //  };
      //  this.lst.push(d);
      //  this.lst.push(this.add_new);
      //  this.selected = d;        
      //} else {
      //  let d = {
      //    'id': Const.Default2FAExpiryUid,
      //    'name': ''
      //  };
      //  this.lst.push(this.add_new);
      //  this.selected = this.add_new;
      //  this.ref.detectChanges();
      //  this.selected = this.lst[0];
      //  this.ref.detectChanges();
      //}
      this.refreshExpiryList();
      this.cms.focus(this.focusElementId);

      if (result) {                
          this.selected = {
            'id': result.uid,
            'name': `${result.duration} ${result.unit}`
          };
      }

    });

  }


  changeToggle() {    
    if (this.c.expiry.value['id'] == 'addnew') {
      this.addNewDuration();
      return;
    }

    this.selected = {
      'id': this.c.expiry.value['id'],
      'name': this.c.expiry.value['name']
    };
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
        ownby: Const.CurrentPage2FASetup
      }]
    };

    h.btn.push({
      name: 'Go Back',
      icon: 'arrow_left',
      func: 'cancel',
      color: 'basic',
      ownby: Const.CurrentPage2FASetup
    });
    this.hdrSvc.setHeader(h);
  }
}
