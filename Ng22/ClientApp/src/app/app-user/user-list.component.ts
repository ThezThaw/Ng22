import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppUserService } from '../services/app-user.service';
import { AppUser } from '../shared/models/app-user.data';

@Component({
  selector: 'user-list',
  templateUrl: './user-list.component.html',
})
export class UserListComponent implements OnInit, OnDestroy {
  addNew: boolean = false;
  btn: any[] = [{ 'icon': 'add' }];
  userlist: AppUser[] = [];
  ssx: Subscription = new Subscription();

  constructor(    
    private appUserSvc: AppUserService) { }

  ngOnDestroy(): void {
    this.ssx?.unsubscribe();
  }

  ngOnInit(): void {    
    this.refreshList();
  }

  refreshList() {
    var ssx = this.appUserSvc.getUserList().subscribe(u => {
      this.userlist = u;
    });
    this.ssx.add(ssx);
  }

  switchUi() {
    this.addNew = !this.addNew;
    if (this.addNew) {
      this.btn = [{ 'icon': 'list' }];
    } else {
      this.btn = [{ 'icon': 'add' }];
      this.refreshList();
    }
    

  }

}
