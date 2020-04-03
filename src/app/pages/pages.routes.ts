import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ServiceRequestListComponent } from './service-request-list/service-request-list.component';
import { ServiceRequestEntryComponent } from './service-request-entry/service-request-entry.component';
import { SystemUserListComponent } from './system-user-list/system-user-list.component';
import { UserChangpasswordComponent } from './user-changpassword/user-changpassword.component';
import { SystemUserDetailComponent } from './system-user-detail/system-user-detail.component';
import { ServiceDetailComponent } from './service-detail/service-detail.component';
import { ServiceListComponent } from './service-list/service-list.component';
import { ReportComponent } from './report/report.component';



const pagesRoutes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  // { path: 'service-request-list', component: ServiceRequestListComponent, data: { animation: 'service-request-list' } },
  { path: 'system-user-list', component: SystemUserListComponent, data: { animation: 'system-user-list' } },
  { path: 'user-changpassword', component: UserChangpasswordComponent, data: { animation: 'user-changpassword' } },
  { path: 'system-user-detail', component: SystemUserDetailComponent, data: { animation: 'system-user-detail' } },
  { path: 'service-request-entry', component: ServiceRequestEntryComponent, data: { animation: 'service-request-entry' } },
  { path: 'service-list', component: ServiceListComponent, data: { animation: 'service-list' } },
  { path: 'service-detail', component: ServiceDetailComponent, data: { animation: 'service-detail' } },
  { path: 'report', component: ReportComponent, data: { animation: 'report' } },

];

@NgModule({
  imports: [
    RouterModule.forChild(pagesRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class PagesRouterModule { }