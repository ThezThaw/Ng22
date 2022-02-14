import { Component, OnInit, Input, ChangeDetectionStrategy, ChangeDetectorRef } from "@angular/core";
import { BaseControlComponent } from "./base-control.component";
import { debounceTime, tap, switchMap, finalize, map } from "rxjs/operators";
import { Observable } from "rxjs";
import { ValidatorFn, AbstractControl, Validators } from "@angular/forms";
import { Const } from "../const";

@Component({
  selector: 'auto',
  templateUrl: './auto-complete.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class AutoCompleteComponent extends BaseControlComponent
                                implements OnInit {  

  @Input() require: boolean = false;
  @Input() placeholder: string = '';
  @Input() displayField: string = 'name';
  loading: boolean = false;
  lst$: Observable<any>;
  lst: any[] = [];
  
  constructor(private changeRef: ChangeDetectorRef) {
    super();    
  }

  ngOnInit() {
    this.skipService = true;
    super.ngOnInit();


    this.c.valueChanges.pipe(
      debounceTime(Const.dbounceTime),
      tap(() => { this.loading = true; this.changeRef.detectChanges(); }),
      switchMap(filter => this.service[this.method](filter)
        .pipe(finalize(() => {
          this.loading = false; this.changeRef.detectChanges();
        }))))
      .subscribe(result => {
        this.lst = result as any[];
      });




    this.lst$ =  this.c.valueChanges.pipe(
                  debounceTime(Const.dbounceTime),
                  tap(() => this.loading = true),
                  switchMap(filter => this.getData(filter)));

    this.c.setValidators(this.require ? [Validators.required, this.mustSelectValidation()] : this.mustSelectValidation());
  }

  getData(filter) {
    return this.service[this.method](filter)
      .pipe(map((res: any) => { this.lst = res; return res; }), finalize(() => this.loading = false));
  }

  get getDisplayValue() {
    return (selected) => { return selected ? selected[this.displayField] : null; }
  }

  mustSelectValidation(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      return (control.dirty && control.value && !this.isValidValue(control.value)) ? { 'invalid-selected-vlaue': true } : null;
    }
  }

  isValidValue(val: any) {
    return this.lst.some(x => x === val);
  }
}
