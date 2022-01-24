import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from "@angular/material/form-field";
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from './app.routing.module';
import { AppConfigService } from './shared/services/appconfig.service';
import { LoginComponent } from './login/login';
import { LoginModule } from './login/module/login.module';
import { AuthService } from './login/module/services/auth.service';
import { L2LoginComponent, L2LoginHolderComponent } from './home/l2-login/l2-login.component';
import { MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatRippleModule } from '@angular/material/core';
import { MatInputModule } from "@angular/material/input";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { CommonModule } from '@angular/common';
import { MissionComponent } from './mission/mission.component';
import { MissionDetailsComponent } from './mission/mission-details.component';
import { SpeedDialFabComponent } from './shared/controls/speed-dial/speed-dial-fab.component';

@NgModule({
  exports: [
    ReactiveFormsModule,    
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule,
    //MatCardModule,
    MatRippleModule,
    //MatBadgeModule,
    //MatTabsModule,
    MatIconModule,
    //MatChipsModule,
    //MatTableModule,
    //MatProgressBarModule,
    MatDialogModule,
    MatButtonModule,
    //MatExpansionModule,
  ]
})
export class MatModule { }

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    LoginComponent,
    L2LoginHolderComponent,
    MissionComponent,
    MissionDetailsComponent,
    SpeedDialFabComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    BrowserAnimationsModule,
    HttpClientModule,
    LoginModule,
    AppRoutingModule,    
    BrowserAnimationsModule,
    MatModule,
    CommonModule,
    FormsModule,
  ],
  providers: [
    L2LoginComponent,
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: { hasBackdrop: true }
    },
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [AppConfigService],
      useFactory: (appConfigService: AppConfigService) => {
        return () => {
          //Make sure to return a promise!
          return appConfigService.loadAppConfig();
        };
      }
  },
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [AuthService],
      useFactory: (authService: AuthService) => {
        return () =>
          new Promise((resolve) => {
            authService.isloggedIn_isValidToken(false, true).subscribe().add(resolve);
        });
      }
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
