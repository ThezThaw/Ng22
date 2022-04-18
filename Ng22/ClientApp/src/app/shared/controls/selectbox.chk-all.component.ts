import { Component, OnInit, Input, ViewEncapsulation } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatCheckboxChange } from "@angular/material/checkbox";

@Component({
  selector: 'selectbox-chkall',
  templateUrl: './selectbox.chk-all.component.html',
  //styleUrls: ['./selectbox.chk-all.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class SelectboxCheckAllComponent {

  @Input() selected: FormControl;
  @Input() list = [];

  isChecked(): boolean {
    return this.list?.length &&
      this.selected?.value?.length === this.list?.length;
  }

  isIndeterminate(): boolean {
    return this.selected?.value?.length > 0 && this.selected?.value?.length < this.list?.length;
  }

  toggleSelection(change: MatCheckboxChange): void {
    if (change.checked) {
      this.selected?.setValue(this.list);
    } else {
      this.selected?.setValue([]);
    }
  }

}
