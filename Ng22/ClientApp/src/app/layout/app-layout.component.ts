import { AfterViewChecked, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from '../login/module/services/auth.service';
import { HeaderButton } from '../shared/models/shared-data.model';
import { HeaderService } from '../shared/service';

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
  constructor(private authService: AuthService,
    private ref: ChangeDetectorRef,
    private hdrSvc: HeaderService) { }

  ngAfterViewChecked() {
    this.hdrSvc.header$.subscribe(h => {
      this.btn = h?.btn;
      this.ref.detectChanges();
    });
    this.busy = this.hdrSvc.busy;
  }

  ngOnInit() {
    this.hdrSvc.resetHeader();
  }

  onOutletLoaded(component) {    
    this.c = component;
  }

  menuSelect(event) {
    if (this.c['pageCode'] != event['pageCode']) {
      this.hdrSvc.resetHeader();
    }
    this.c['pageCode'] = event['pageCode'];
    this.c['user'] = event['user'];
    
  }

  logout() {
    this.authService.logout();
  }

  headerBtnClick(btn) {
    this.hdrSvc.triggerClickEvent(btn);
  }
}
