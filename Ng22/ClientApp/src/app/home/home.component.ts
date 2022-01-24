import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../login/module/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, OnDestroy {
  ssx: Subscription = new Subscription();

  constructor(private authService: AuthService, private http: HttpClient) { }

  ngOnDestroy(): void {
    
  }

  ngOnInit(): void {

    var ssx = this.authService.getUserInfo().subscribe(u => {
      
    });

    ssx.unsubscribe();

  }

  logout() {
    this.authService.logout();
  }
}
