import { Component, OnInit, Input, ViewEncapsulation } from "@angular/core";
import { BaseControlComponent } from "./base-control.component";

@Component({
  selector: 'selectbox',
  templateUrl: './selectbox.component.html',
  //styleUrls: ['./selectbox.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class SelectboxComponent extends BaseControlComponent
                                implements OnInit {  

  @Input() multi: boolean = false;
  @Input() displayField: string = '';

  constructor(){
    super();    
  }

  ngOnInit() {
    super.ngOnInit();
  }

  setSelected(o1, o2) {
    if (o1 == null || o2 == null) return false;
    return o1.id === o2.id;
  }
}
