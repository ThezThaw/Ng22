import { MatBottomSheet, MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from "@angular/material/bottom-sheet";
import { Component, Injectable, Inject } from "@angular/core";

@Injectable()
@Component({
  selector: 'bs',
  template: `<html></html>`,
})

export class BottomSheetComponent {
  constructor(private bs: MatBottomSheet) { }

  open(message: any) {
    this.bs.open(BottomSheet, {
      data: { 'msg': message }
    });
  }

}

@Component({
  selector: 'bs1',
  templateUrl: 'bottom-sheet.component.html',
})
export class BottomSheet {
  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private bsRef: MatBottomSheetRef<BottomSheet>) { }
}
