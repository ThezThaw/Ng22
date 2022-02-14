import { Component, Output, EventEmitter, Input } from "@angular/core";
import { BaseControlComponent } from "./base-control.component";

@Component({
  selector: 'chk',
  templateUrl: './chk.component.html',
  //styleUrls: ['./inputbox.component.css'],
})

export class CheckboxComponent extends BaseControlComponent {

  constructor() {
    super();
  }

  emitEvent() {
    this.valueChangeEmitter.emit();
  }
}
