import { Component, Input, ChangeDetectionStrategy } from "@angular/core";
import { BaseControlComponent } from "./base-control.component";

@Component({
  selector: 'inputbox',
  templateUrl: './inputbox.component.html',
})

export class InputboxComponent extends BaseControlComponent {
  @Input() loading: boolean = false;
  @Input() placeholder: string = '';
  @Input() selectOnFocus: boolean = true;
  @Input() icon: string;
  @Input() max?: number = null;
  @Input() multi: boolean = false;
  @Input() autosizeMinRows: number = 3;
  @Input() autosizeMaxRows: number = 10;

  constructor() {
    super();
  }

  emitEvent() {
    this.valueChangeEmitter.emit();    
  }
}
