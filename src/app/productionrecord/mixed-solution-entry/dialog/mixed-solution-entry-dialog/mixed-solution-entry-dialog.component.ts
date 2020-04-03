import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { BrokerAPIService } from '../../../../services/brokerapi.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { IAPIResponse } from '../../../../interfaces/apiResponse';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import {
  MatSnackBar, MatDialog, MatDialogRef, VERSION,
  MAT_DATE_FORMATS,
  DateAdapter,
  MAT_DATE_LOCALE
} from "@angular/material";
import * as moment from "moment";
import { Moment } from "moment";

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
  selector: 'app-mixed-solution-entry-dialog',
  templateUrl: './mixed-solution-entry-dialog.component.html',
  styleUrls: ['./mixed-solution-entry-dialog.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class MixedSolutionEntryDialogComponent implements OnInit {
  version = VERSION;
  private RowID: string;
  objRow: any = {};
  objAPIResponse: any = {};
  private UrlAPI_Create: string = "";
  mixingdate: Moment = moment();


  constructor(private brokerAPIService: BrokerAPIService,
    private route: ActivatedRoute, private router: Router,
    private dialogRef: MatDialog,
    private dialog: MatDialog, ) {}

  ngOnInit() {
  }

  onNoClick() {
    this.dialogRef.closeAll();

  }


}
