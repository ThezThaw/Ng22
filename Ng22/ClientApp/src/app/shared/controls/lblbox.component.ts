import { Injectable } from "@angular/core";
import { Component, Output, EventEmitter, ElementRef, ViewChild, Input } from "@angular/core";
import { BaseControlComponent } from "./base-control.component";

@Component({
  selector: 'lblbox',
  templateUrl: './lblbox.component.html',
  //styleUrls: ['./inputbox.component.css'],
})

export class LabelboxComponent extends BaseControlComponent {

  @ViewChild('field', { read: ElementRef }) field!: ElementRef;
  @Input() style: string = '';
  @Input() title!: string;
  @Input() prefix!: string;
  @Output() clickEmitter = new EventEmitter();

  constructor() {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    this.style += 'width:100%;';
    //var el = this.field.nativeElement.querySelector('.mat-form-field-flex');
    //el.style.padding = '1em .75em .5em .75em';

    //el = this.field.nativeElement.querySelector('.mat-form-field-infix');
    //el.style.padding = '.6em 0 .2em 0';
  }

  onClick() {
    this.clickEmitter.emit();
  }

}
