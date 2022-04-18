import { FormGroup } from "@angular/forms";
import { OnInit, OnDestroy, Input, HostBinding, EventEmitter, Output, Injectable } from "@angular/core";
import { Subscription } from "rxjs";
import { Directive } from "@angular/core";
import { Const } from "../const";

@Injectable()
@Directive()
export abstract class BaseControlComponent implements OnInit, OnDestroy {

  public readonly LibConst = Const;
  public ssx: Subscription;
  public skipService: boolean = false;
  public loading: boolean = false;

  @Input() placeholder: string = '';
  @Input() fg: FormGroup;
  @Input() name: string;
  @Input() public label!: string;
  @Input() service: string;
  @Input() method: string;
  @Input() type: string = 'text';
  @Input() list: any[] = [];
  @Input() selected: any;
  @Input() markTouch: boolean = false;  
  @Input() readonly: boolean = false;
  @Input() class: string = 'col-12';
  @HostBinding('class') cls: string;

  @Output() valueChangeEmitter = new EventEmitter();

  get c() { return this.fg.controls[this.name]; }

  constructor() {
    this.ssx = new Subscription();
  }

  ngOnInit() {
    this.cls = this.class;
    if (this.markTouch) this.c.markAsTouched();
    if (this.service && !this.skipService) {
      this.loading = true;
      var ssx = this.service[this.method]().subscribe(result => {
        this.loading = false;
        if (result) {
          this.list = result;
          if (this.list.length == 1) {
            this.c.setValue(this.list[0]);
          }

          if (this.type == 'toggle') {
            if (this.selected) {
              this.selected = this.list.find(x => x.id == this.selected.id);
            } else {
              this.selected = this.list[0];
            }
            this.c.setValue(this.selected);
          }

          

        }
      }, err => {
        alert('ERROR in base control component');
        this.loading = false;
      });

      this.ssx.add(ssx);
    }
  }

  ngOnDestroy() {
    this.ssx.unsubscribe();
  }
}
