import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { Subscription } from 'rxjs';
import { PushMessageService } from '../services/push-msg.service';
import { BottomSheetComponent } from '../shared/controls/bottom-sheet.component';
import { PopupComponent } from '../shared/controls/popup.component';
import { HeaderService } from '../shared/service';

@Component({
  selector: 'inbox',
  templateUrl: './inbox.component.html',
})
export class InboxComponent implements OnInit {

  busy: boolean = false;
  lst: any[] = [];
  ssx: Subscription = new Subscription();

  constructor(
    private ref: ChangeDetectorRef,
    private notiSvc: NotifierService,
    private bs: BottomSheetComponent,
    private popup: PopupComponent,
    private hdrSvc: HeaderService,
    private pmSvc: PushMessageService) {
    
  }

  ngOnInit(): void {
    this.getList();    
  }

  setBusy(busy) {
    this.busy = busy;
    this.hdrSvc.setBusy(busy);
  }

  getList() {
    var ssx = this.pmSvc.GetSentMessage(false).subscribe(x => {      
      this.lst = x;
    });
    this.ssx.add(ssx);
  }
}
