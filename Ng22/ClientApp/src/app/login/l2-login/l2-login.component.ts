import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { BottomSheetComponent } from "../../shared/controls/bottom-sheet.component";
import { LoginRequest, LoginResultL2 } from "../../shared/models/login.data";
import { CommonMethodService } from "../../shared/service";
import { AuthService } from "../module/services/auth.service";

@Component({
  selector: 'l2-login',
  templateUrl: 'l2-login.component.html',
})
export class L2LoginComponent implements OnInit {
  @Input() missionUid;
  @Output() closeEmitter = new EventEmitter();

  fg: FormGroup;
  get c() { return this.fg.controls; }
  focusElementId = '#passcode';
  busy: boolean = false;

  constructor(
    private fb: FormBuilder,
    private cms: CommonMethodService,
    private bs: BottomSheetComponent,
    private authSvc: AuthService) { }

  ngOnInit() {
    this.fg = this.fb.group({
      passcode: [null, Validators.required],
    });

    this.touch();
    this.cms.focus(this.focusElementId);
  }

  authenticate() {
    if (this.fg.invalid) return;
    this.setBusy(true);
    let raw = this.fg.getRawValue();

    let vm: LoginRequest =
    {
      userId: '',
      password: raw.passcode,
      missionUid: this.missionUid
    }

    this.busy = true;
    //this.authSvc.l2login(vm).subscribe(result => {
    //  this.setLocalStorage(result);
    //  this.closeEmitter.emit(result.missionDetails);
    //}, err => {
    //  this.setBusy(false);
    //  this.cms.focus(this.focusElementId);
    //  this.bs.open(JSON.stringify(err));
    //});

    this.authSvc.l2login(vm).subscribe(result => {
      if (result.status === true) {
        this.setLocalStorage(result?.data);
        this.closeEmitter.emit(result?.data?.missionDetails);

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

  setLocalStorage(x: LoginResultL2) {
    localStorage.setItem('token-l2', x.token);    
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
