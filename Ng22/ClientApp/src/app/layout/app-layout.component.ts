import { Component } from '@angular/core';
import { AuthService } from '../login/module/services/auth.service';

@Component({
  selector: 'app-layout',
  templateUrl: './app-layout.component.html',
  styleUrls: ['app-layout.component.css'],
})
export class AppLayoutComponent {
  c: Component;

  constructor(private authService: AuthService) { }

  onOutletLoaded(component) {    
    this.c = component;
  }

  menuSelect(event) {    
    this.c['pageCode'] = event['pageCode'];
    this.c['user'] = event['user'];
  }

  logout() {
    this.authService.logout();
  }

}
