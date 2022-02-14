import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../login/module/services/auth.service';
import { AppUserService } from '../services/app-user.service';
import { AppUser, Page } from '../shared/models/app-user.data';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['sidebar.component.css'],
})

export class SidebarComponent implements OnInit, OnDestroy {
  @Output() clickEmitter = new EventEmitter();
  menuList: Page[] = [];
  ssx: Subscription = new Subscription();

  constructor(
    private authSvc: AuthService,
    private urSvc: AppUserService) { }
    

  ngOnInit(): void {

    this.authSvc.isloggedIn_isValidToken(false, false).subscribe(x => {

      var ssx = this.authSvc.getUserInfo().subscribe(user => {
        if (user) {
          this.urSvc.getAvailablePageByUser(user.userId).subscribe(m => {
            this.menuList = m;
            this.menuList.forEach(m => m.user = user);
          });
        }
      });
      this.ssx.add(ssx);
    });
  }

  ngOnDestroy(): void {    
    this.ssx?.unsubscribe();
  }

}
