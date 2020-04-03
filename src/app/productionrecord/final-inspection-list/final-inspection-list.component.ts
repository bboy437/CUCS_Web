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
  selector: 'app-final-inspection-list',
  templateUrl: './final-inspection-list.component.html',
  styleUrls: ['./final-inspection-list.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class FinalInspectionListComponent implements OnInit {
  dataSource = new MatTableDataSource();
  displayedColumns = [
    "startProductionTime1",
    "startProductionTime2",
    "startProductionTime3",
    "startProductionTime",
    "endProductionTime",
  ];
  private UrlAPI_GetAll: string = "FinalInspection/GetAllAvailableForInspect";
  private Url_Detail: string = "/auth/productionrecord/final-inspection";
  objRow: any;
  objAPIResponse: IAPIResponse;
  objRowSelected: FinalInspection;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private brokerAPIService: BrokerAPIService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.brokerAPIService.get(this.UrlAPI_GetAll).subscribe(
      data => {
        console.log("UrlAPI_GetAll",data); 
        this.dataSource.data = data;

      }
    );
  }

  rowClicked(row: any): void {
    console.log(row);
    this.objRowSelected = <FinalInspection>row;
    this.router.navigate([this.Url_Detail, { id: this.objRowSelected.id} ]);
    
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    // this.dataSource = this._exampleDatabase.data.slice().filter((item: Baza) => {
    //   const searchStr = (item.ident + item.naziv + item.mt + item.lokacija + item.napomena).toLowerCase();
    //   return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
    // });
    this.dataSource.filterPredicate = function(data: FinalInspection,filter): boolean {
      return (
        data.productionPlanId.toString().toLowerCase().includes(filter) ||
        data.startProductionTime.toString().toLowerCase().includes(filter) ||
        data.endProductionTime.toString().toLowerCase().includes(filter)
      );
    };
  }

}
