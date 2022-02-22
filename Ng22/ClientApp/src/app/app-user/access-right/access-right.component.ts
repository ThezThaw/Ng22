import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AccessRightService } from '../../services/access-right.service';
import { Const } from '../../shared/const';
import { PopupComponent } from '../../shared/controls/popup.component';
import { UserPageRelation } from '../../shared/models/access-right.data';
import { Mission } from '../../shared/models/mission.data';
import { Header, HeaderButton } from '../../shared/models/shared-data.model';
import { CommonMethodService, HeaderService } from '../../shared/service';

@Component({
  selector: 'access-right',
  templateUrl: './access-right.component.html',
})
export class AccessRightComponent implements OnInit, OnDestroy {

  btn: any[] = [{ 'icon': 'add' }];
  fg: FormGroup;
  get c() { return this.fg.controls; }
  focusElementId = '#title';
  ssx: Subscription = new Subscription();

  lst: Mission[] = [];
  addNew: boolean = false;
  selected: UserPageRelation;

  constructor(
    private ref: ChangeDetectorRef,
    private fb: FormBuilder,
    private cms: CommonMethodService,
    private popup: PopupComponent,
    private hdrSvc: HeaderService,
    private arSvc: AccessRightService) {

    var ssx = this.hdrSvc.clickEvent$.subscribe(btn => {
      if (btn && (btn as HeaderButton)?.ownby == Const.CurrentPageAccessRight) this[(btn as HeaderButton)?.func]();
    });
    this.ssx.add(ssx);
  }

  ngOnDestroy(): void {
    this.ssx?.unsubscribe();
  }

  ngOnInit(): void {
    this.getList();
    this.setHeader();
  }

  add() {
    this.addNew = true;
  }

  getList() {
    var ssx = this.arSvc.GetAccessRightList().subscribe(x => {
      this.lst = x;
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
        name: 'Add Permission',
        icon: 'add',
        func: 'add',
        ownby: Const.CurrentPageAccessRight
      }]
    };
    this.hdrSvc.setHeader(h);
  }

  edit(val) {
    this.selected = val;
    this.ref.detectChanges();
    this.addNew = true;
  }
}
