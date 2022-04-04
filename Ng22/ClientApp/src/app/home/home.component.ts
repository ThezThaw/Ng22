import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { AuthService } from '../login/module/services/auth.service';
import { PushMessageService } from '../services/push-msg.service';
import { Const } from '../shared/const';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  //styleUrls: ['home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {  
  readonly Const = Const;
  pageCode: string;  

  constructor(swp: SwPush,
    authSvc: AuthService,
    pmSvc: PushMessageService) {

    authSvc.getUserInfo().subscribe(user => {

      if (swp.isEnabled && user.userId != Const.AppUserAdmin) {

        const key = 'BHDuQkQUYQdnkSimea3jVDYDDOLH7qVeb8yW9KjjGlCjCNJdlAUE5L5lCdxtIyvdCnZSMQZn-X7Htt-jeypXi94';
        swp.requestSubscription({ serverPublicKey: key })
          .then(sub => {
            pmSvc.ClientRegistration(sub.toJSON()).subscribe(x => {
              debugger;
            });
          });
      }


    });

    
  }

  ngOnDestroy(): void {
    
  }

  ngOnInit(): void {

  }
}
