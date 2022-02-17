import { Component, Inject, Injectable } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { Const } from "../const";

@Injectable()
@Component({
  selector: 'popup',
  template: `<html></html>`,
})
export class PopupComponent {

  constructor(private dialog: MatDialog) { }

  show(popupType, disableClose, width?, data?) {
    const popup = this.dialog.open(PopupPlaceholderComponent, {
      hasBackdrop: true,
      disableClose: popupType == Const.PopupTypeConfirmation || disableClose,
      width: width ? width : '50%',
      data: { 'type': popupType, 'data': data },
    });
    return popup;
  }
}

@Component({
  selector: 'popup-placeholder',
  templateUrl: 'popup.component.html',
})
export class PopupPlaceholderComponent {
  readonly LibConst = Const;
  constructor(
    public dialogRef: MatDialogRef<PopupPlaceholderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  close(e) {
    this.dialogRef.close(e);
  }

}
