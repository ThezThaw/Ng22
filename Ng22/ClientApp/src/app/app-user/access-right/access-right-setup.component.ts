import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { NotifierService } from "angular-notifier";
import { Subscription } from 'rxjs';
import { AccessRightService } from '../../services/access-right.service';
import { AppUserService } from '../../services/app-user.service';
import { Const } from '../../shared/const';
import { BottomSheetComponent } from '../../shared/controls/bottom-sheet.component';
import { PopupComponent } from '../../shared/controls/popup.component';
import { Page, UserPageRelation } from '../../shared/models/access-right.data';
import { AppUser } from '../../shared/models/app-user.data';
import { Header, HeaderButton } from '../../shared/models/shared-data.model';
import { CommonMethodService, HeaderService } from '../../shared/service';

@Component({
  selector: 'access-right-setup',
  templateUrl: './access-right-setup.component.html',
  //styleUrls: ['mission-setup.component.css'],
})
export class AccessRightSetupComponent implements OnInit, OnDestroy {
  @Input() upr: any;//UserPageRelation
  @Output() gobackEmitter = new EventEmitter();
  //@ViewChild(InstructionListComponent) child: InstructionListComponent;

  btn: any[] = [{ 'icon': 'save' }];
  fg: FormGroup;
  get c() { return this.fg.controls; }
  focusElementId = '#title';
  busy: boolean = false;
  ssx: Subscription = new Subscription();

  dsUser = new MatTableDataSource<AppUser>();
  userSelection = new SelectionModel<AppUser>(true, []);
  userDisplayedColumns: string[] = ['select', 'user'];

  dsPage = new MatTableDataSource<Page>();
  pageSelection = new SelectionModel<string>(true, []);
  pageDisplayedColumns: string[] = ['select', 'name'];

  constructor(
    private ref: ChangeDetectorRef,
    private fb: FormBuilder,
    private cms: CommonMethodService,
    private popup: PopupComponent,
    private notiSvc: NotifierService,
    private bs: BottomSheetComponent,
    private hdrSvc: HeaderService,
    private userSvc: AppUserService,
    private arSvc: AccessRightService) {
    var ssx = this.hdrSvc.clickEvent$.subscribe(btn => {
      if (btn && (btn as HeaderButton)?.ownby == Const.CurrentPageAccessRightSetup) this[(btn as HeaderButton)?.func]();
    });
    this.ssx.add(ssx);
  }

  ngOnDestroy(): void {
    this.ssx?.unsubscribe();
  }

  ngOnInit(): void {

    var ssx = this.arSvc.searchPage().subscribe(p => {
      this.dsPage.data = p;

      if (this.upr) {
        this.upr.pages.forEach(p => {
          this.dsPage.data.find(x => x.uid == p.uid).default = p.default;
        });
      }

    });
    this.ssx.add(ssx);

    if (this.upr) {

      this.dsUser.data.push(this.upr.appUser);
      this.userSelection = new SelectionModel<AppUser>(true, [this.upr.appUser]);
      this.pageSelection.select(...this.upr.pages.map(x => { return x.uid }));      

    } else {
      ssx = this.userSvc.getUserList('', true).subscribe(u => {
        this.dsUser.data = u;
      });
      this.ssx.add(ssx);
    }

    this.setHeader();
  }

  applyFilter(event: Event, isuser: boolean) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (isuser) {
      this.dsUser.filter = filterValue.trim().toLowerCase();
    } else {
      this.dsPage.filter = filterValue.trim().toLowerCase();
    }
    
  }

  setDefault(e) {
    this.dsPage.data.forEach(d => d.default = e.default && (e.uid == d.uid));
    this.dsPage._updateChangeSubscription();
  }

  pageCheckChange(e, row) {
    e ? this.pageSelection.toggle(row.uid) : null;
    if (row.default && !this.pageSelection.isSelected(row.uid)) {
      row.default = false;
    }    
  }

  setHeader() {
 
    let h: Header = {
      btn: [{
        name: 'Save',
        icon: 'save',
        func: 'addPermission',
        ownby: Const.CurrentPageAccessRightSetup
      }]
    };

    if (this.upr) {
      h.btn.push({
        name: 'Revoke Access',
        icon: 'link_off',
        func: 'revokeAccess',
        color: 'warn',
        ownby: Const.CurrentPageAccessRightSetup
      });
    }

    h.btn.push({
      name: 'Go Back',
      icon: 'arrow_left',
      func: 'cancel',
      color: 'basic',
      ownby: Const.CurrentPageAccessRightSetup
    });
    this.hdrSvc.setHeader(h);
  }

  revokeAccess() {
    var confirm = this.popup.show(Const.PopupTypeConfirmation, true, '25%', `Confirm Revoke ?`);
    confirm.afterClosed().subscribe(yes => {
      if (!yes) return;

      this.setBusy(true);

      this.arSvc.RemoveAccessRight(this.upr.appUser.uid).subscribe(result => {
        if (result.status === true) {
          this.notiSvc.notify('error', 'REVOKED');
          this.gobackEmitter.emit('deleted');
        } else {
          this.bs.open(result.message);
        }
        this.setBusy(false);

      }, err => {
        this.setBusy(false);
      });


    });
  }

  addPermission() {

    if (this.upr == undefined && this.userSelection.selected.length == 0) {
      this.bs.open("Select user to give access!");
      return;
    }

    if (this.pageSelection.selected.length == 0) {
      this.bs.open("Select page to give access!");
      return;
    }

    this.setBusy(true);

    let d: UserPageRelation[] = [];
    this.userSelection.selected.forEach(u => {
      this.pageSelection.selected.forEach(p => {
        d.push({
          userUid: u.uid,
          pageUid: p,
          default: (this.dsPage.data.find(x => x.default)?.uid == p)
        });
      });
    });

    var ssx = this.arSvc.AddAccessRight(d).subscribe(result => {
        if (result.status === true) {
          this.notiSvc.notify('success', 'SAVED');
          this.gobackEmitter.emit('cancel');
        } else {
          this.bs.open(result.message);
        }
      this.setBusy(false);      
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



  isAllSelected(userTbl: boolean) {
    const numSelected = userTbl ? this.userSelection.selected.length : this.pageSelection.selected.length;
    const numRows = userTbl ? this.dsUser.data.length : this.dsPage.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle(userTbl: boolean) {
    if (this.isAllSelected(userTbl)) {
      userTbl ? this.userSelection.clear() : this.pageSelection.clear();
      return;
    }
    userTbl ? this.userSelection.select(...this.dsUser.data) : this.pageSelection.select(...this.dsPage.data.map(x => { return x.uid }));
  }
}
