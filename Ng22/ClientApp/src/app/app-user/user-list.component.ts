import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppUserService } from '../services/app-user.service';
import { Const } from '../shared/const';
import { AppUser } from '../shared/models/app-user.data';
import { Header, HeaderButton } from '../shared/models/shared-data.model';
import { HeaderService } from '../shared/service';

@Component({
  selector: 'user-list',
  templateUrl: './user-list.component.html',
})
export class UserListComponent implements OnInit, OnDestroy {
  selected: AppUser;
  addNew: boolean = false;
  userlist: AppUser[] = [];
  ssx: Subscription = new Subscription();

  constructor(
    private hdrSvc: HeaderService,
    private appUserSvc: AppUserService) {
    this.hdrSvc.clickEvent$.subscribe(btn => {
      if (btn && (btn as HeaderButton)?.ownby == Const.CurrentPageUserList) this[(btn as HeaderButton)?.func]();
    });
  }

  ngOnDestroy(): void {
    this.ssx?.unsubscribe();
  }

  ngOnInit(): void {    
    this.refreshList();
    this.setHeader();
  }

  refreshList() {
    var ssx = this.appUserSvc.getUserList().subscribe(u => {
      this.userlist = u;
    });
    this.ssx.add(ssx);
  }

  edit(user) {
    this.selected = user;
    //this.ref.detectChanges();
    this.addNew = true;
  }

  switchUi() {
    this.addNew = false;
    this.selected = undefined;
    this.setHeader();
    this.refreshList();
  }

  addNewUser() {
    this.addNew = true;
  }

  setHeader() {
    let h: Header = {
      btn: [{
        name: 'Create New User',
        icon: 'person_add',
        func: 'addNewUser',
        ownby: Const.CurrentPageUserList
      }]
    };
    this.hdrSvc.setHeader(h);
  }

}
