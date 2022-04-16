import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { Subscription } from 'rxjs';
import { AuthService } from '../login/module/services/auth.service';
import { PushMessageService } from '../services/push-msg.service';
import { Const } from '../shared/const';
import { BottomSheetComponent } from '../shared/controls/bottom-sheet.component';
import { PopupComponent } from '../shared/controls/popup.component';
import { AppUser } from '../shared/models/app-user.data';
import { MissionUserRelation } from '../shared/models/mission.data';
import { Header, HeaderButton } from '../shared/models/shared-data.model';
import { CommonMethodService, HeaderService } from '../shared/service';

@Component({
  selector: 'send-msg-history',
  templateUrl: './send-msg-history.component.html',
})
export class SendMessageHistoryComponent implements OnInit, OnDestroy {
  @Input() isInbox: boolean;
  btn: any[] = [{ 'icon': 'add' }];
  fg: FormGroup;
  get c() { return this.fg.controls; }
  focusElementId = '#title';
  ssx: Subscription = new Subscription();
  busy: boolean = false;
  isDelete: boolean = false;
  removeOrDelete: string = '';

  lst: any[] = [];
  addNew: boolean = false;
  selected: MissionUserRelation;
  currentUser: AppUser;
  selection = new SelectionModel<string>(true, []);

  constructor(
    private ref: ChangeDetectorRef,
    private notiSvc: NotifierService,
    private bs: BottomSheetComponent,
    private popup: PopupComponent,
    private hdrSvc: HeaderService,
    private authService: AuthService,
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
    this.authService.getUserInfo().subscribe(x => this.currentUser = x)
    this.getList();    
  }

  new_message() {
    this.addNew = true;
  }

  remove_message(uids: string[]) {
    var confirm = this.popup.show(Const.PopupTypeConfirmation, true, '25%', `Confirm ${this.removeOrDelete} ?`);
    confirm.afterClosed().subscribe(yes => {
      if (!yes) return;

      this.setBusy(true);
      this.pmSvc.DeleteMessage(uids, this.isInbox, !this.isDelete).subscribe(x => {

        if (x.status === true) {
          this.selection.clear();
          this.notiSvc.notify('error', this.isDelete ? 'DELETED' : 'REMOVED');
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

  remove_selected_message() {
    if (this.selection.selected.length == 0) {
      this.bs.open(`Select message to ${this.removeOrDelete}!`);
      return;
    }

    this.remove_message(this.selection.selected);
  }

  setBusy(busy) {
    this.busy = busy;
    this.hdrSvc.setBusy(busy);
  }

  getList() {
    var ssx = this.pmSvc.GetSentMessage(this.isInbox).subscribe(x => {
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
    this.isDelete = this.currentUser.userId == Const.AppUserAdmin && !this.isInbox;
    this.removeOrDelete = this.isDelete ? 'delete' : 'remove';
    let h: Header = {
      btn: []
    };

    if (!this.isInbox) {
      h.btn.push({
        name: 'New Message',
        icon: 'add',
        func: 'new_message',
        ownby: Const.CurrentPageSendMessageHistory
      });
    }

    if (this.lst?.length > 0) {

      h.btn.push({
        name: 'Remove Selected Messages',
        icon: 'delete',
        color: 'basic',
        func: 'remove_selected_message',
        ownby: Const.CurrentPageSendMessageHistory
      });

      if (this.isDelete) {
        h.btn.pop();
        h.btn.push({
          name: 'Delete Selected Messages',
          icon: 'delete_forever',
          color: 'warn',
          func: 'remove_selected_message',
          ownby: Const.CurrentPageSendMessageHistory
        });
      }
    }

    this.hdrSvc.setHeader(h);
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.lst.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.lst.map(x => { return x.uid }));
  }
}
