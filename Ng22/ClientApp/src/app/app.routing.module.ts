import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AppLayoutComponent } from './layout/app-layout.component';
import { LoginComponent } from './login/login';
import { AuthGuard } from './login/module/guards/auth.guard';
import { MissionComponent } from './mission/mission.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    component: AppLayoutComponent,
    pathMatch: 'full',
    children: [
      {
        path: '',        
        component: HomeComponent,
        canActivate: [AuthGuard],
      },
    ]
  },  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
