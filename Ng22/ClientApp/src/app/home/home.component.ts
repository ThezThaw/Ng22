import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../login/module/services/auth.service';
import { Const } from '../shared/const';
import { AppUser } from '../shared/models/app-user.data';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {  
  readonly Const = Const;
  pageCode: string;
  user: AppUser;
  ssx: Subscription = new Subscription();

  constructor(private authSvc: AuthService) { }

  ngOnDestroy(): void {
    
  }

  ngOnInit(): void {

  }
}
