import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../login/module/services/auth.service';
import { AccessRightService } from '../services/access-right.service';
import { Page } from '../shared/models/access-right.data';

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
    private arSvc: AccessRightService) { }
    

  ngOnInit(): void {

    this.authSvc.isloggedIn_isValidToken(false, false).subscribe(x => {

      var ssx = this.authSvc.getUserInfo().subscribe(user => {
        if (user) {
          this.arSvc.getAvailablePageByUser(user.userId).subscribe(m => {
            this.menuList = m;
            this.menuList.forEach(m => m.user = user);
            
            var defaultPage = this.menuList.find(x => x['default'] === true);
            if (defaultPage) {
              this.clickEmitter.emit(defaultPage);
            }

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
