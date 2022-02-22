import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from "@angular/material/form-field";
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from './app.routing.module';
import { LoginComponent } from './login/login';
import { LoginModule } from './login/module/login.module';
import { AuthService } from './login/module/services/auth.service';
import { MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatRippleModule } from '@angular/material/core';
import { MatInputModule } from "@angular/material/input";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { MissionComponent } from './mission/mission.component';
import { SpeedDialFabComponent } from './shared/controls/speed-dial/speed-dial-fab.component';
import { AppLayoutComponent } from './layout/app-layout.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { L2LoginComponent } from './login/l2-login/l2-login.component';
import { AppConfigService } from './services/appconfig.service';
import { UserListComponent } from './app-user/user-list.component';
import { UserCardComponent } from './app-user/user-card.component';
import { InputboxComponent } from './shared/controls/inputbox.component';
import { LabelboxComponent } from './shared/controls/lblbox.component';
import { ButtonComponent } from './shared/controls/btn.component';
import { MissionSetupComponent } from './mission/create/mission-setup.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MissionLinkComponent } from './mission/link/mission-link.component';
import { NotifierModule, NotifierOptions } from "angular-notifier";
import { BottomSheet, BottomSheetComponent } from './shared/controls/bottom-sheet.component';
import { MatBottomSheetModule } from "@angular/material/bottom-sheet";
import { PopupComponent, PopupPlaceholderComponent } from './shared/controls/popup.component';
import { CheckboxComponent } from './shared/controls/chk.component';
import { MatCheckboxModule } from "@angular/material/checkbox";
import { AddInstructionComponent } from './mission/create/add-instruction.component';
import { MatTableModule } from '@angular/material/table';
import { CreateMissionComponent } from './mission/create/create-mission.component';
import { MatCardModule } from '@angular/material/card';
import { FromNowPipe } from './shared/controls/pipe/dateFormat';
import { MissionAssignComponent } from './mission/link/mission-assign.component';
import { MatChipsModule } from '@angular/material/chips';
import { TwoFAComponent } from './2fa/2fa.component';
import { TwoFASetupComponent } from './2fa/2fa-setup.component';
import { ToggleComponent } from './shared/controls/toggle.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { AddExpireDurationComponent } from './2fa/add-exp-duration.component';
import { AccessRightComponent } from './app-user/access-right/access-right.component';
import { AccessRightSetupComponent } from './app-user/access-right/access-right-setup.component';
import { MatBadgeModule } from '@angular/material/badge';

//https://stackblitz.com/edit/angular-notifier-demo?file=src%2Fapp%2Fapp.module.ts
const customNotifierOptions: NotifierOptions = {
  position: {
    horizontal: {
      position: 'middle',
      distance: 12
    },
    vertical: {
      position: 'top',
      distance: 5,
      gap: 10
    }
  },
  theme: 'material',
  behaviour: {
    autoHide: 3000,
    onClick: 'hide',
    onMouseover: false,
    showDismissButton: false,
    stacking: 4
  },
  animations: {
    enabled: true,
    show: {
      preset: 'slide',
      speed: 300,
      easing: 'ease'
    },
    hide: {
      preset: 'fade',
      speed: 300,
      easing: 'ease',
      offset: 50
    },
    shift: {
      speed: 300,
      easing: 'ease'
    },
    overlap: 150
  }
};

@NgModule({
  exports: [
    ReactiveFormsModule,    
    MatFormFieldModule,
    MatAutocompleteModule,
    MatInputModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatCardModule,
    MatRippleModule,
    MatBadgeModule,
    //MatTabsModule,
    MatIconModule,
    MatTableModule,
    MatProgressBarModule,
    MatBottomSheetModule,
    MatDialogModule,
    MatButtonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatChipsModule,
    MatButtonToggleModule,
    MatDividerModule,
    //MatExpansionModule,
    CommonModule,
  ]
})
export class MatModule { }

@NgModule({
  declarations: [
    InputboxComponent,
    LabelboxComponent,
    ButtonComponent,
    BottomSheet,
    BottomSheetComponent,
    CheckboxComponent,
    FromNowPipe,
    ToggleComponent,
  ],
  exports: [
    InputboxComponent,
    LabelboxComponent,
    ButtonComponent,
    BottomSheet,
    BottomSheetComponent,    
    CheckboxComponent,
    FromNowPipe,
    ToggleComponent,
  ],
  imports: [
    MatModule
  ]
})
export class CustomControlModule {
  //static forRoot() {
  //  return {
  //    ngModule: CustomControlModule,
  //  }
  //}
}

@NgModule({
  declarations: [
    AppLayoutComponent,
    AppComponent,
    HomeComponent,
    LoginComponent,
    L2LoginComponent,
    MissionComponent,
    SpeedDialFabComponent,
    UserListComponent,
    UserCardComponent,
    SidebarComponent,
    MissionSetupComponent,
    MissionLinkComponent,
    AddInstructionComponent,
    PopupComponent,
    PopupPlaceholderComponent,
    CreateMissionComponent,
    MissionAssignComponent,
    TwoFAComponent,
    TwoFASetupComponent,
    AddExpireDurationComponent,
    AccessRightComponent,
    AccessRightSetupComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    BrowserAnimationsModule,
    HttpClientModule,
    NotifierModule.withConfig(customNotifierOptions),
    LoginModule,
    AppRoutingModule,    
    BrowserAnimationsModule,    
    FormsModule,
    MatModule,
    CustomControlModule,
  ],
  providers: [
    BottomSheetComponent, PopupComponent,
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
    }
  ],
  //entryComponents: [
  //  PopupPlaceholderComponent
  //],
  bootstrap: [AppComponent]
})
export class AppModule { }
