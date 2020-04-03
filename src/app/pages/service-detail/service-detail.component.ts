import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { BrokerAPIService } from '../../services/brokerapi.service';
import 'rxjs/add/operator/map'
import { Router, ActivatedRoute } from '@angular/router';
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import {
  MatSnackBar, MatDialog, MatDialogRef, VERSION,
  MAT_DATE_FORMATS,
  DateAdapter,
  MAT_DATE_LOCALE,
} from "@angular/material";
import * as moment from "moment";
import { Moment } from "moment";
import { MessageDialogComponent } from '../../dialogs/message-dialog/message-dialog.component';
import { ServiceRequest, Service } from '../../interfaces/cu';
import { IAPIResponse } from '../../interfaces/apiResponse';
import { ConfirmDeleteDialogComponent } from '../../dialogs/confirm-delete-dialog/confirm-delete-dialog.component';
import { FormGroup, FormControl } from '@angular/forms';
export const MY_FORMATS = {
  parse: {
    dateInput: "DD/MM/YYYY"
  },
  display: {
    dateInput: "DD/MM/YYYY  HH:mm",
    monthYearLabel: "MMM YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM YYYY"
  }
};

@Component({
  selector: 'app-service-detail',
  templateUrl: './service-detail.component.html',
  styleUrls: ['./service-detail.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]

})
export class ServiceDetailComponent implements OnInit {
  formGroup: FormGroup;
  version = VERSION;
  dialogRef: MatDialogRef<MessageDialogComponent>;
  RowID: string;
  objRow: any = {};
  objAPIResponse: any = {};
  filter: string;
  readonly: boolean = true;
  jobOrderDate: Moment = moment();
  referDocDate: Moment = moment();
  referJobOrderDate: Moment = moment();
  performOrderDate: Moment = moment();
  startWorkDate: Moment = moment();
  endWorkDate: Moment = moment();
  customerId: string;
  isSubmited: string;
  objSerialNoList: string;
  objarrEquimentInfo: any = [];
  objarrEquimentInfo1: any = [];
  private UrlAPI_GetSingleRow: string = "ServiceRequest/GetCustomerServiceRequest/";
  private UrlAPI_GetEquimentInfo: string = "ServiceRequest/GetEquimentInfo/";
  private Url_Listing: string = "/auth/pages/service-list";
  private UrlAPI_GetCustomerId: string = "Account/GetCustomerId";
  disableMe = true;
  isLoadingResults = true;
  constructor(
    private brokerAPIService: BrokerAPIService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.isLoadingResults = true;
    let params = this.route.snapshot.paramMap;
    if (params.has('id')) {
      console.log("id", params.get('id'));
      this.objRow = JSON.parse(params.get('id'));

      if (this.objRow.jobOrderDate <= ('1900-01-01T00:00:00')) {
        this.jobOrderDate = undefined
      }
      if (this.objRow.referDocDate <= ('1900-01-01T00:00:00')) {
        this.referDocDate = undefined
      }
      if (this.objRow.referJobOrderDate <= ('1900-01-01T00:00:00')) {
        this.referJobOrderDate = undefined
      }
      if (this.objRow.performOrderDate <= ('1900-01-01T00:00:00')) {
        this.performOrderDate = undefined
      }
      if (this.objRow.startWorkDate <= ('1900-01-01T00:00:00')) {
        this.startWorkDate = undefined
      }
      if (this.objRow.endWorkDate <= ('1900-01-01T00:00:00')) {
        this.endWorkDate = undefined
      }
      if (this.objRow.jobOrderDate > ('1900-01-01T00:00:00')) {
        this.jobOrderDate = moment(this.objRow.jobOrderDate);
      }
      if (this.objRow.referDocDate > ('1900-01-01T00:00:00')) {
        this.referDocDate = moment(this.objRow.referDocDate);
      }
      if (this.objRow.referJobOrderDate > ('1900-01-01T00:00:00')) {
        this.referJobOrderDate = moment(this.objRow.referJobOrderDate);
      }
      if (this.objRow.performOrderDate > ('1900-01-01T00:00:00')) {
        this.performOrderDate = moment(this.objRow.performOrderDate);
      }
      if (this.objRow.startWorkDate > ('1900-01-01T00:00:00')) {
        this.startWorkDate = moment(this.objRow.startWorkDate);
      }
      if (this.objRow.endWorkDate > ('1900-01-01T00:00:00')) {
        this.endWorkDate = moment(this.objRow.endWorkDate);
      }
      else {
        // this.performOrderDate = moment(this.objRow.performOrderDate);
        // this.startWorkDate = moment(this.objRow.startWorkDate);
        // this.endWorkDate = moment(this.objRow.endWorkDate);
      }

      // this.RowID = params.get('id');
      this.filter = params.get("filter");
      this.isLoadingResults = false;


    }
  }





  btnCloseClick() {
    this.router.navigate([this.Url_Listing]);
  }





}
