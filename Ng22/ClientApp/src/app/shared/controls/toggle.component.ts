import { ChangeDetectionStrategy, Component } from "@angular/core";
import { BaseControlComponent } from "./base-control.component";

@Component({
  selector: 'toggle',
  templateUrl: './toggle.component.html',
  //changeDetection: ChangeDetectionStrategy.OnPush
})

export class ToggleComponent extends BaseControlComponent {    
  constructor(){
    super();
    this.type = 'toggle';
  }

  ngOnInit() {
    super.ngOnInit();
  }
}
