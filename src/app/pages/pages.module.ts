import { NgModule } from "@angular/core";
import {
  MatCardModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatInputModule,
  MatToolbarModule,
  MatIconModule,
  MatCheckboxModule,
  MatListModule,
  MatSortModule,
  MatPaginatorModule,
  MatTableModule,
  MatSelectModule,
  MatDialogModule,
  MatGridListModule,
  MatSnackBarModule,
  MatProgressSpinnerModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatAutocompleteModule,
  MatRadioModule,
  MatStepperModule,
  
} from "@angular/material";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CalendarModule } from 'angular-calendar';
import { TextMaskModule } from 'angular2-text-mask';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PagesRouterModule } from './pages.routes';
import { ServicesComponent } from './services/services.component';
import { CoreModule } from '../core/core.module';
import { ServiceRequestListComponent } from './service-request-list/service-request-list.component';
import { ServiceRequestEntryComponent } from './service-request-entry/service-request-entry.component';
import { ServiceRequestDialogComponent } from './service-request-entry/dialog/service-request-dialog/service-request-dialog.component';
import { UserChangpasswordComponent } from './user-changpassword/user-changpassword.component';
import { SystemUserListComponent } from './system-user-list/system-user-list.component';
import { SystemUserDetailComponent } from './system-user-detail/system-user-detail.component';
import { ServiceListComponent } from './service-list/service-list.component';
import { ServiceDetailComponent } from './service-detail/service-detail.component';
import { WebDataRocksPivot } from "./webdatarocks/webdatarocks.angular4";
import { ReportComponent } from './report/report.component';
  @NgModule({
    imports: [
      CalendarModule.forRoot(),
      // NgbModalModule.forRoot(),
      MatCardModule,
      CommonModule,
      FlexLayoutModule,
      MatButtonModule,
      MatButtonToggleModule,
      MatInputModule,
      MatToolbarModule,
      MatIconModule,
      MatCheckboxModule,
      MatListModule,
      MatChipsModule,
      CoreModule,
      PagesRouterModule,
      MatSortModule,
      MatPaginatorModule,
      MatTableModule,
      FormsModule,
      ReactiveFormsModule,
      MatSelectModule,
      MatDialogModule,
      MatGridListModule,
      MatProgressSpinnerModule,
      MatDatepickerModule,
      MatNativeDateModule,
      MatAutocompleteModule,
      TextMaskModule,
      MatRadioModule,
      MatStepperModule,
      MatSnackBarModule
    ],
    declarations: [   
        ServicesComponent,
        ServiceRequestListComponent,
        ServiceRequestEntryComponent,
        ServiceRequestDialogComponent,
        UserChangpasswordComponent,
        SystemUserListComponent,
        SystemUserDetailComponent,
        ServiceListComponent,
        ServiceDetailComponent,
        WebDataRocksPivot,
        ReportComponent
   
    ],
    exports: [
      CommonModule,
      MatToolbarModule,
      MatInputModule,
      MatSortModule,
      MatPaginatorModule,
      MatTableModule,
      MatSelectModule,
      MatDialogModule,
      MatGridListModule,
      MatProgressSpinnerModule,
      MatDatepickerModule,
      MatNativeDateModule,
      MatAutocompleteModule,
      MatStepperModule,
      MatSnackBarModule

    ],
    providers: [
    ],
    
  entryComponents: [ServiceRequestDialogComponent]
})
export class PagesModule {
}
