import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { NotifierService } from "angular-notifier";
import { Subscription } from 'rxjs';
import { AppUserService } from '../../services/app-user.service';
import { MissionService } from '../../services/mission.service';
import { Const } from '../../shared/const';
import { BottomSheetComponent } from '../../shared/controls/bottom-sheet.component';
import { PopupComponent } from '../../shared/controls/popup.component';
import { AppUser } from '../../shared/models/app-user.data';
import { Mission, MissionUserRelation } from '../../shared/models/mission.data';
import { Header, HeaderButton } from '../../shared/models/shared-data.model';
import { CommonMethodService, HeaderService } from '../../shared/service';

@Component({
  selector: 'mission-assign',
  templateUrl: './mission-assign.component.html',
  //styleUrls: ['mission-setup.component.css'],
})
export class MissionAssignComponent implements OnInit, OnDestroy {
  @Input() mur: any;//MissionUserRelation
  @Output() gobackEmitter = new EventEmitter();
  //@ViewChild(InstructionListComponent) child: InstructionListComponent;

  btn: any[] = [{ 'icon': 'save' }];
  fg: FormGroup;
  get c() { return this.fg.controls; }
  focusElementId = '#title';
  busy: boolean = false;
  ssx: Subscription = new Subscription();

  dsUser = new MatTableDataSource<AppUser>();
  userSelection = new SelectionModel<string>(true, []);
  userDisplayedColumns: string[] = ['select', 'user'];

  dsMission = new MatTableDataSource<Mission>();
  missionSelection = new SelectionModel<Mission>(true, []);
  missionDisplayedColumns: string[] = ['select', 'title'];

  constructor(
    private ref: ChangeDetectorRef,
    private fb: FormBuilder,
    private cms: CommonMethodService,
    private popup: PopupComponent,
    private notiSvc: NotifierService,
    private bs: BottomSheetComponent,
    private hdrSvc: HeaderService,
    private userSvc: AppUserService,
    private missionSvc: MissionService) {
    var ssx = this.hdrSvc.clickEvent$.subscribe(btn => {
      if (btn && (btn as HeaderButton)?.ownby == Const.CurrentPageAssignMission) this[(btn as HeaderButton)?.func]();
    });
    this.ssx.add(ssx);
  }

  ngOnDestroy(): void {
    this.ssx?.unsubscribe();
  }

  ngOnInit(): void {

    var ssx = this.userSvc.getUserList().subscribe(u => {
      this.dsUser.data = u;
    });
    this.ssx.add(ssx);


    if (this.mur) {

      this.dsMission.data.push(this.mur.missionVm);
      this.missionSelection = new SelectionModel<Mission>(true, [this.mur.missionVm]);
      this.userSelection.select(...this.mur.appUserVm.map(x => { return x.uid }));      

    } else {
      ssx = this.missionSvc.searchMission('', true).subscribe(m => {
        this.dsMission.data = m;
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
      this.dsMission.filter = filterValue.trim().toLowerCase();
    }
    
  }

  setHeader() {
 
    let h: Header = {
      btn: [{
        name: 'Assign Selected User',
        icon: 'done',
        func: 'assign',
        ownby: Const.CurrentPageAssignMission
      }]
    };

    if (this.mur) {
      h.btn.push({
        name: 'Unassign Mission',
        icon: 'layers_clear',
        func: 'unassign',
        color: 'warn',
        ownby: Const.CurrentPageAssignMission
      });
    }

    h.btn.push({
      name: 'Go Back',
      icon: 'arrow_left',
      func: 'cancel',
      color: 'basic',
      ownby: Const.CurrentPageAssignMission
    });
    this.hdrSvc.setHeader(h);
  }

  unassign() {    
    var confirm = this.popup.show(Const.PopupTypeConfirmation, true, '25%', `Confirm Unassign ?`);
    confirm.afterClosed().subscribe(yes => {
      if (!yes) return;

      this.setBusy(true);

      this.missionSvc.UnAssignAllUser(this.mur.missionVm.uid).subscribe(result => {
        if (result.status === true) {
          this.notiSvc.notify('error', 'Unassigned');
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

  assign() {

    if (this.mur == undefined && this.missionSelection.selected.length == 0) {
      this.bs.open("Select mission to assign!");
      return;
    }

    if (this.userSelection.selected.length == 0) {
      this.bs.open("Select user to assign!");
      return;
    }



    this.setBusy(true);

    let d: MissionUserRelation[] = [];
    this.missionSelection.selected.forEach(m => {
      this.userSelection.selected.forEach(u => {
        d.push({
          missionuid: m.uid,
          useruid: u
        });
      });
    });

    var ssx = this.missionSvc.AssignMission(d).subscribe(result => {
        if (result.status === true) {
          this.notiSvc.notify('success', 'ASSIGNED');
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



  isAllSelected(userTbl: boolean) {
    const numSelected = userTbl ? this.userSelection.selected.length : this.missionSelection.selected.length;
    const numRows = userTbl ? this.dsUser.data.length : this.dsMission.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle(userTbl: boolean) {
    if (this.isAllSelected(userTbl)) {
      userTbl ? this.userSelection.clear() : this.missionSelection.clear();
      return;
    }
    userTbl ? this.userSelection.select(...this.dsUser.data.map(x => { return x.uid })) : this.missionSelection.select(...this.dsMission.data);
  }
}
