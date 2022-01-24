import { HttpClient } from "@angular/common/http";
import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { LoginRequest, LoginResultL2 } from "../../shared/models/login.data";
import { AppConfigService } from "../../shared/services/appconfig.service";

@Component({
  selector: 'l2-login',
  template: `<html></html>`,
})
export class L2LoginComponent {
  constructor(private dialog: MatDialog) { }

  show() {
    const popup = this.dialog.open(L2LoginHolderComponent, {
      hasBackdrop: true,
      disableClose: true,
      width: '50%',
      height: '50%',
    });
    return popup;
  }
 }


@Component({
  selector: 'l2-login-holder',
  templateUrl: 'l2-login.component.html',
})
export class L2LoginHolderComponent {
  password: string;
  busy = false;
  constructor(
    public dialogRef: MatDialogRef<L2LoginHolderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,
    private appCfgSvc: AppConfigService) { }

  validate() {

    let vm: LoginRequest =
    {
      userId: 'admin',
      password: this.password
    }

    this.busy = true;
    this.http
      .post<LoginResultL2>(`${this.appCfgSvc.cfg["baseUrl"]}api/auth/token-l2`, vm)
      .subscribe(x => {
        this.setLocalStorage(x);
        this.close(x.missionDetails);
      }, err => {
        throw err;
      });
      //.pipe(
      //  map((data) => {
      //    debugger;
      //    //this.setLocalStorage(x);
      //    return null;
      //  })        
      //);
  }

  close(e) {
    this.dialogRef.close(e);
  }

  setLocalStorage(x: LoginResultL2) {
    localStorage.setItem('token-l2', x.token);    
  }

}
