import { Component, OnInit, ViewChild } from '@angular/core';
import { BrokerAPIService } from '../../services/brokerapi.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IAPIResponse } from '../../interfaces/apiResponse';
import { FinalInspection } from '../../interfaces/productionrecords';
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import {
  MatSnackBar, MatDialog, MatDialogRef, VERSION,
  MAT_DATE_FORMATS,
  DateAdapter,
  MAT_DATE_LOCALE,
  MatSort,
  MatPaginator,
  MatTableDataSource,
} from "@angular/material";
import * as moment from "moment";
import { Moment } from "moment";
import { FinalInspectionDetailDialogComponent } from './dialog/final-inspection-detail-dialog/final-inspection-detail-dialog.component';

export const MY_FORMATS = {
  parse: {
    dateInput: "DD/MM/YYYY"
  },
  display: {
    dateInput: "DD/MM/YYYY",
    monthYearLabel: "MMM YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM YYYY"
  }
};


@Component({
  selector: 'app-final-inspection-detail',
  templateUrl: './final-inspection-detail.component.html',
  styleUrls: ['./final-inspection-detail.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class FinalInspectionDetailComponent implements OnInit {

  startdate: Moment = moment();
  enddate: Moment = moment();
  dataSource = new MatTableDataSource();
  displayedColumns = [
    "TankNo",
    "MixingDate",
    "SoildContent",
    "RefToDDNo",
    "Startngime",
    "In",
    "Out",
    "VesselWt",
    "RefToRcNo",
    "actions"
  ];
  dataSourcedefect = new MatTableDataSource();
  displayedColumnsdefect = [
    "defect",
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  private UrlAPI_GetSingleRow: string = "FinalInspection/Get/";
  private UrlAPI_Update: string = "FinalInspection/Update";
  private UrlAPI_Create: string = "FinalInspection/Create";
  private Url_Listing: string = "/auth/productionrecord/final-inspection-list";

  objRow: any = {};
  objAPIResponse: any = {};
  private RowID: string;

  constructor(
    private brokerAPIService: BrokerAPIService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private dialog: MatDialog) { }

  ngOnInit() {

    let params = this.route.snapshot.paramMap;
    if (params.has("id")) {
      console.log(params.get("id"));
      this.RowID = params.get("id");

      if (this.RowID == "new") {

      } else {
        this.brokerAPIService
          .get(this.UrlAPI_GetSingleRow + this.RowID)
          .subscribe(data => {
            this.objRow = <FinalInspection>data;
            console.log(this.objRow);
            this.dataSource.data = this.objRow;

          });
      }
    }
  }

  btnCloseClick() {
    this.router.navigate([this.Url_Listing]);
  }

  addNew() {

    const dialogRef = this.dialog.open(FinalInspectionDetailDialogComponent, {
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      // this.getProductionOrderList();
      if (result != undefined) {
        if (result.process != undefined) {
        }
      }
    });
  }

}
