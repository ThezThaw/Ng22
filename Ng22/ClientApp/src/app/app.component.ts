import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavigationStart, Router, RouterEvent } from '@angular/router';
import { filter, tap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'app';

  constructor(router: Router, matDialog: MatDialog) {

    // Close any opened dialog when route changes
    router.events.pipe(
      filter((event: RouterEvent) => event instanceof NavigationStart),
      tap(() => {
        matDialog.closeAll()
      })
    ).subscribe();
  }

}
