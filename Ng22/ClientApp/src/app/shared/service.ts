import { Injectable, Renderer2, RendererFactory2 } from "@angular/core";

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
