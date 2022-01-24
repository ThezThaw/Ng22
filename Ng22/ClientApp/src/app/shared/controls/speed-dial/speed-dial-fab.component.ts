import { Component, Output, EventEmitter, Input } from "@angular/core";
import { speedDialFabAnimations } from "./speed-dial-fab.animations";

@Component({
  selector: 'app-speed-dial-fab',
  templateUrl: './speed-dial-fab.component.html',
  styleUrls: ['./speed-dial-fab.component.scss'],
  animations: speedDialFabAnimations
})
export class SpeedDialFabComponent {
  @Input() btn: any[] = [{'icon': 'logout'}];//default
  @Output() clickEmitter = new EventEmitter();

  buttons = [];
  fabTogglerState = 'inactive';

  constructor() { }

  showItems() {
    this.fabTogglerState = 'active';
    this.buttons = this.btn;
  }

  hideItems() {
    this.fabTogglerState = 'inactive';
    this.buttons = [];
  }

  onToggleFab() {
    this.buttons.length ? this.hideItems() : this.showItems();
  }

  onClick() {
    if (this.btn.length == 1) {
      this.clickEmitter.emit();
    } else {
      this.onToggleFab();
    }
  }

  onSubClick(func) {
    this.clickEmitter.emit({ 'func': func });
  }
}
