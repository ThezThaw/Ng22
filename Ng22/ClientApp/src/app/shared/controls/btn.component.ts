import { Component, Output, EventEmitter, Input } from "@angular/core";
import { BaseControlComponent } from "./base-control.component";

@Component({
  selector: 'btn',
  templateUrl: './btn.component.html',
  //styleUrls: ['./inputbox.component.css'],
})

export class ButtonComponent extends BaseControlComponent {
  @Input() icon: string;
  @Input() color: string = 'primary';
  @Input() busy: boolean = false;
  @Output() clickEmitter = new EventEmitter();
  
  constructor() {
    super();   
  }

  emitEvent() {
    this.clickEmitter.emit();
  }
}
