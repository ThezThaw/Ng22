import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { NotifierService } from "angular-notifier";
import { Subscription } from 'rxjs';
import { AppUserService } from '../services/app-user.service';
import { MissionService } from '../services/mission.service';
import { PushMessageService } from '../services/push-msg.service';
import { Const } from '../shared/const';
import { BottomSheetComponent } from '../shared/controls/bottom-sheet.component';
import { PopupComponent } from '../shared/controls/popup.component';
import { Mission } from '../shared/mission.data';
import { AppUser } from '../shared/models/app-user.data';
import { MissionUserRelation } from '../shared/models/mission.data';
import { SendMessage } from '../shared/models/push-msg.data';
import { Header, HeaderButton } from '../shared/models/shared-data.model';
import { CommonMethodService, HeaderService } from '../shared/service';

@Component({
  selector: 'send-msg',
  templateUrl: './send-msg.component.html',
  //styleUrls: ['mission-setup.component.css'],
})
export class SendMessageComponent implements OnInit, OnDestroy {  
  @Output() gobackEmitter = new EventEmitter();

  btn: any[] = [{ 'icon': 'save' }];
  fg: FormGroup;
  get c() { return this.fg.controls; }
  focusElementId = '#msg';
  busy: boolean = false;
  ssx: Subscription = new Subscription();

  dsUser = new MatTableDataSource<AppUser>();
  userSelection = new SelectionModel<string>(true, []);
  userDisplayedColumns: string[] = ['select', 'user'];

  constructor(
    private ref: ChangeDetectorRef,
    private fb: FormBuilder,
    private cms: CommonMethodService,
    private popup: PopupComponent,
    private notiSvc: NotifierService,
    private bs: BottomSheetComponent,
    private hdrSvc: HeaderService,
    private userSvc: AppUserService,
    private pmSvc: PushMessageService) {
    var ssx = this.hdrSvc.clickEvent$.subscribe(btn => {
      if (btn && (btn as HeaderButton)?.ownby == Const.CurrentPageSendMessage) this[(btn as HeaderButton)?.func]();
    });
    this.ssx.add(ssx);
  }

  ngOnDestroy(): void {
    this.ssx?.unsubscribe();
  }

  ngOnInit(): void {

    this.fg = this.fb.group({
      msg: [undefined, Validators.required],
    });

    this.touch();
    this.cms.focus(this.focusElementId);

    var ssx = this.userSvc.getSubscriberList('', false).subscribe(u => {
      this.dsUser.data = u;
    });
    this.ssx.add(ssx);
    this.setHeader();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dsUser.filter = filterValue.trim().toLowerCase();
  }

  setHeader() {
 
    let h: Header = {
      btn: [{
        name: 'Send',
        icon: 'send',
        func: 'sendMessage',
        ownby: Const.CurrentPageSendMessage
      }]
    };

    h.btn.push({
      name: 'Go Back',
      icon: 'arrow_left',
      func: 'cancel',
      color: 'basic',
      ownby: Const.CurrentPageSendMessage
    });
    this.hdrSvc.setHeader(h);
  }

  sendMessage() {

    if (this.userSelection.selected.length == 0) {
      this.bs.open("Select user to send message!");
      return;
    }

    this.setBusy(true);
    let m: SendMessage = {
      message: this.c.msg.value,
      lstUserUid: this.userSelection.selected
    };


    var ssx = this.pmSvc.SendMessage(m).subscribe(result => {
        if (result.status === true) {
          this.notiSvc.notify('success', 'SENT');
        } else {
          this.bs.open(result.message);
        }
      this.setBusy(false);
      this.gobackEmitter.emit('cancel');
    }, err => {
      this.setBusy(false);
      this.bs.open(JSON.stringify(err));
    });
    this.ssx.add(ssx);
  }

  setBusy(busy) {
    this.busy = busy;
    this.hdrSvc.setBusy(busy);
  }

  cancel() {
    this.gobackEmitter.emit('cancel');
  }

  touch() {
    for (let c in this.fg.controls) {
      this.fg.controls[c].markAsTouched();
    }
  }


  isAllSelected() {
    const numSelected = this.userSelection.selected.length;
    const numRows = this.dsUser.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.userSelection.clear();
      return;
    }
    this.userSelection.select(...this.dsUser.data.map(x => { return x.uid }));
  }
}
