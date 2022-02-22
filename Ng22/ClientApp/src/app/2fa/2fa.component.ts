import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { TwoFAService } from '../services/2fa.service';
import { NotifierService } from "angular-notifier";
import { Const } from '../shared/const';
import { BottomSheetComponent } from '../shared/controls/bottom-sheet.component';
import { PopupComponent } from '../shared/controls/popup.component';
import { AppUser } from '../shared/models/app-user.data';
import { Header, HeaderButton } from '../shared/models/shared-data.model';
import { HeaderService } from '../shared/service';
import { TwoFA } from "../shared/models/2fa.data";

@Component({
  selector: 'two-fa',
  templateUrl: './2fa.component.html',
})
export class TwoFAComponent implements OnInit, OnDestroy {
  selected: AppUser;
  addNew: boolean = false;
  lst: any[] = [];
  busy: boolean = false;
  ssx: Subscription = new Subscription();

  constructor(
    private hdrSvc: HeaderService,
    private notiSvc: NotifierService,
    private bs: BottomSheetComponent,
    private popup: PopupComponent,
    private twoFaSvc: TwoFAService) {
    var ssx = this.hdrSvc.clickEvent$.subscribe(btn => {
      if (btn && (btn as HeaderButton)?.ownby == Const.CurrentPage2FA) this[(btn as HeaderButton)?.func]();
    });
    this.ssx.add(ssx);
  }

  ngOnDestroy(): void {
    this.ssx?.unsubscribe();
  }

  ngOnInit(): void {    
    this.refreshList();    
  }

  refreshList() {
    var ssx = this.twoFaSvc.Get2FA().subscribe(fa => {
      this.lst = fa;
      this.setHeader();
    });
    this.ssx.add(ssx);
  }

  delete(fa) {

    let empty: TwoFA = {
      uid: Const.EmptyGuid,
      passcode: undefined,
      expireUid: Const.EmptyGuid
    };

    var confirm = this.popup.show(Const.PopupTypeConfirmation, true, '25%', 'Confirm remove ?');
    confirm.afterClosed().subscribe(yes => {
      if (!yes) return;

      this.setBusy(true);
      this.twoFaSvc.Remove2FA(fa ? fa : empty).subscribe(x => {

        this.notiSvc.notify('error', 'DELETED');
        this.setBusy(false);
        this.refreshList();

      }, err => {
        this.setBusy(false);
        this.bs.open(JSON.stringify(err));
      });
    });
  }

  setBusy(busy) {
    this.busy = busy;
    this.hdrSvc.setBusy(busy);
  }

  switchUi() {
    this.addNew = false;
    this.selected = undefined;
    this.setHeader();
    this.refreshList();
  }

  addNewPasscode() {
    this.addNew = true;
  }

  setHeader() {
    let h: Header = {
      btn: [
        {
          name: '',
          icon: 'refresh',
          color:'basic',
          func: 'refreshList',
          ownby: Const.CurrentPage2FA
        },
        {
        name: 'Add New Passcode',
        icon: 'add',
        func: 'addNewPasscode',
        ownby: Const.CurrentPage2FA
      }]
    };

    if (this.lst && this.lst?.length > 0) {
      h.btn.push({
        name: 'Remove All Expired Passcode',
        icon:'delete_forever',
        color: 'warn',
        func: 'delete',
        ownby: Const.CurrentPage2FA
      });
    }

    this.hdrSvc.setHeader(h);
  }

  isExpired(d) {
    return new Date(d) < new Date();
  }

}
