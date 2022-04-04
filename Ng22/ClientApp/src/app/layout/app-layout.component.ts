import { AfterViewChecked, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from '../login/module/services/auth.service';
import { HeaderButton } from '../shared/models/shared-data.model';
import { HeaderService } from '../shared/service';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-layout',
  templateUrl: './app-layout.component.html',
  styleUrls: ['app-layout.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppLayoutComponent implements OnInit, AfterViewChecked {
  @Output() clickEmitter = new EventEmitter();
  c: Component;
  btn: HeaderButton[] = [];
  busy: boolean;
  isMobile: boolean;
  menuSelected: boolean = false;
  title; icon; currentUser;

  showSF;

  constructor(private authService: AuthService,
    private ref: ChangeDetectorRef,
    private deviceService: DeviceDetectorService,
    private hdrSvc: HeaderService) {
    this.isMobile = this.deviceService.isMobile();
  }

  ngAfterViewChecked() {
    this.hdrSvc.header$.subscribe(h => {
      this.btn = h?.btn;
      this.ref.detectChanges();
    });

    this.hdrSvc.isBusy$.subscribe(b => {
      this.busy = b as boolean;
    });
  }

  ngOnInit() {    
    this.hdrSvc.resetHeader();
    this.authService.getUserInfo().subscribe(x => this.currentUser = x)
  }

  onOutletLoaded(component) {    
    this.c = component;
  }

  menuSelect(event, drawer) {

    if (this.isMobile && !event['default']) {
      drawer.toggle();
    }    

    if (this.c['pageCode'] != event['pageCode']) {
      this.hdrSvc.resetHeader();
    }
    this.c['pageCode'] = event['pageCode'];
    this.c['user'] = event['user'];
    this.title = event['menuName'];
    this.icon = event['icon'];
    event['default'] = null;
  }

  logout() {
    this.hdrSvc.setBusy(false);
    this.authService.logout();
  }

  headerBtnClick(btn) {
    this.hdrSvc.triggerClickEvent(btn);
  }

  snowflake() {
    this.showSF = true;     
    setTimeout(x => this.showSF = false, 20 * 1000);
  }

}
