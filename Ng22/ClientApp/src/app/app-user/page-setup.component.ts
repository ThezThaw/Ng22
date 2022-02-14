import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AppUserService } from '../services/app-user.service';
import { UserPageRelation } from '../shared/models/app-user.data';

@Component({
  selector: 'page-setup',
  templateUrl: './page-setup.component.html',
})
export class PageSetupComponent implements OnInit, OnDestroy {

  fg: FormGroup;
  get c() { return this.fg.controls; }

  constructor(
    private fb: FormBuilder,
    public appUserSvc: AppUserService) { }

  ngOnDestroy(): void {

  }

  ngOnInit(): void {
    this.fg = this.fb.group({      
      user: [],
      page: [],
    });

    for (let c in this.fg.controls) {
      this.fg.controls[c].markAsTouched();
    }
  }

  save() {

    if (this.fg.invalid) return;
    var raw = this.fg.getRawValue();

    let data: UserPageRelation = {
      userUid: raw.user['uid'],
      pageUid: raw.page['uid']
    };

    this.appUserSvc.pageSetup(data).subscribe(x => {
      this.fg.reset();
    });

  }
}
