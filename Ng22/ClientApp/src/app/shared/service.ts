import { Injectable, Renderer2, RendererFactory2 } from "@angular/core";
import { Subject } from "rxjs";
import { Observable } from "rxjs";
import { BehaviorSubject } from "rxjs";
import { Header } from "./models/shared-data.model";

@Injectable({
  providedIn: 'root'
})
export class CommonMethodService {
  private renderer: Renderer2;
  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  focus(elementId) {
    setTimeout(() => {
      try {
        var elem = this.renderer.selectRootElement(elementId);
        elem.focus();
      } catch (e) { }

    }, 10);
  }

  convertErrorsToArray(errors: any) {
    var e = JSON.stringify(errors);
    e = e.substr(1, e.length - 2);
    var r = e.split(',"');
    return r;
  }

}


@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  private _header = new BehaviorSubject<Header>(null);
  header$: Observable<Header> = this._header.asObservable();
  public clickEvent$ = new Subject();
  public isBusy$ = new Subject();
  busy: boolean;

  setHeader(header: Header) {
    this._header.next({
      btn: header.btn,
      title: header.title
    });
  }

  resetHeader() {
    this._header.next(null);
  }

  triggerClickEvent(btn) {
    this.clickEvent$.next(btn);
  }

  setBusy(busy) {
    this.busy = busy;
    this.isBusy$.next(busy);
  }
}


