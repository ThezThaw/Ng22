import { Component } from '@angular/core';
import { AuthService } from '../login/module/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  constructor(private authService: AuthService) { }

  logout() {
    this.authService.logout();
  }

}
