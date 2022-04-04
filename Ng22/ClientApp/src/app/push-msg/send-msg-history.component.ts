import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { Subscription } from 'rxjs';
import { MissionService } from '../services/mission.service';
import { PushMessageService } from '../services/push-msg.service';
import { Const } from '../shared/const';
import { BottomSheetComponent } from '../shared/controls/bottom-sheet.component';
import { PopupComponent } from '../shared/controls/popup.component';
import { Mission } from '../shared/mission.data';
import { MissionUserRelation } from '../shared/models/mission.data';
import { Header, HeaderButton } from '../shared/models/shared-data.model';
import { CommonMethodService, HeaderService } from '../shared/service';

@Component({
  selector: 'send-msg-history',
  templateUrl: './send-msg-history.component.html',
})
export class SendMessageHistoryComponent implements OnInit, OnDestroy {

  btn: any[] = [{ 'icon': 'add' }];
  fg: FormGroup;
  get c() { return this.fg.controls; }
  focusElementId = '#title';
  ssx: Subscription = new Subscription();
  busy: boolean = false;

  lst: Mission[] = [];
  addNew: boolean = false;
  selected: MissionUserRelation;

  constructor(
    private ref: ChangeDetectorRef,
    private notiSvc: NotifierService,
    private bs: BottomSheetComponent,
    private popup: PopupComponent,
    private hdrSvc: HeaderService,
    private pmSvc: PushMessageService) {

    var ssx = this.hdrSvc.clickEvent$.subscribe(btn => {
      if (btn && (btn as HeaderButton)?.ownby == Const.CurrentPageSendMessageHistory) this[(btn as HeaderButton)?.func]();
    });
    this.ssx.add(ssx);
  }

  ngOnDestroy(): void {
    this.ssx?.unsubscribe();
  }

  ngOnInit(): void {
    this.getList();    
  }

  new_message() {
    this.addNew = true;
  }

  delete_message(uid: string) {
    var confirm = this.popup.show(Const.PopupTypeConfirmation, true, '25%', 'Confirm remove ?');
    confirm.afterClosed().subscribe(yes => {
      if (!yes) return;

      this.setBusy(true);
      this.pmSvc.DeleteMessage(uid).subscribe(x => {

        if (x.status === true) {

          this.notiSvc.notify('error', 'DELETED');
          this.getList();

        } else {
          this.bs.open(x.message);
        }
        this.setBusy(false);

      }, err => {
        this.setBusy(false);
        this.bs.open(JSON.stringify(err));
      });
    });
  }

  clear_all_message() {
    this.delete_message(Const.EmptyGuid);
  }

  setBusy(busy) {
    this.busy = busy;
    this.hdrSvc.setBusy(busy);
  }

  getList() {
    var ssx = this.pmSvc.GetSentMessage(true).subscribe(x => {      
      this.lst = x;
      this.setHeader();
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
        name: 'New Message',
        icon: 'add',
        func: 'new_message',
        ownby: Const.CurrentPageSendMessageHistory
      }]
    };

    if (this.lst?.length > 0) {
      h.btn.push({
        name: 'Remove All Messages',
        icon: 'delete_forever',
        color: 'warn',
        func: 'clear_all_message',
        ownby: Const.CurrentPageSendMessageHistory
      });
    }

    this.hdrSvc.setHeader(h);
  }

  edit(val) {
    this.selected = val;
    this.ref.detectChanges();
    this.addNew = true;
  }
}
