import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { BrokerAPIService } from '../../services/brokerapi.service';
import 'rxjs/add/operator/map'
import { IArticle } from '../../interfaces/productionrecords';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute } from '@angular/router';
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
import { ServiceRequestList } from '../../interfaces/cu';
import { DatePipe } from '@angular/common';
import { FormControl } from '@angular/forms';

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
  selector: 'app-service-request-list',
  templateUrl: './service-request-list.component.html',
  styleUrls: ['./service-request-list.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})

export class ServiceRequestListComponent implements OnInit {
  dataSource = new MatTableDataSource();

  objarrServiceRequestList: any = [];
  lastStatus: string;
  startdate: any;
  enddate: any;
  displayedColumns = ['jobOrderNo', 'jobOrderDate', 'serialNo', 'equipmentDetail', 'currentStep', 'lastUpdateDate', 'lastStatus'];
  objRowSelected: IArticle;
  filter: string = "";
  customerId: string;
  toDate: any;
  frDate: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  private UrlAPI_GetAll: string = "ServiceRequest/GetServiceRequestList/";
  private Url_Detail: string = "/auth/pages/service-request-entry";
  private UrlAPI_GetCustomerId: string = "Account/GetCustomerId";
  pipe: DatePipe;
  jobOrderNo: string;
  serialNo: string;
  jobOrderNoFilter = new FormControl();
  serialNoFilter = new FormControl();
  startDateFilter = new FormControl(new Date());
  endDateFilter = new FormControl(new Date());
  lastStatusFilter = new FormControl();
  filteredValues = { jobOrderNo: '', serialNo: '', jobOrderDate: '', lastStatus: '' };

  constructor(private brokerAPIService: BrokerAPIService,
    private router: Router,
    private route: ActivatedRoute,
    private datePipe: DatePipe) { }

  ngOnInit() {

    this.getCustomerId()

  }


  private getCustomerId() {
    this.brokerAPIService.get(this.UrlAPI_GetCustomerId).subscribe(data => {
      this.customerId = data;
      this.showData();

    });
  }

  private showData() {

    this.pipe = new DatePipe('en');
    this.jobOrderNoFilter.valueChanges.subscribe((serialNoFilterValue) => {
      this.filteredValues['jobOrderNo'] = serialNoFilterValue;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
    });

    this.serialNoFilter.valueChanges.subscribe((serialNoFilterValue) => {
      this.filteredValues['serialNo'] = serialNoFilterValue;
      console.log("serialNo", serialNoFilterValue)
      this.dataSource.filter = JSON.stringify(this.filteredValues);
    });

    this.startDateFilter.valueChanges.subscribe((startDateFilterValue) => {
      this.filteredValues['jobOrderDatefrom'] = this.pipe.transform(startDateFilterValue, "yyyy-MM-dd");
      this.filteredValues['jobOrderDateto'] = this.pipe.transform(this.enddate, "yyyy-MM-dd");
      console.log("startDateFilter.valueChanges", this.pipe.transform(startDateFilterValue, "yyyy-MM-dd"))
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      console.log("startdate", JSON.stringify(this.filteredValues))
    });

    this.endDateFilter.valueChanges.subscribe((endDateFilterValue) => {
      this.filteredValues['jobOrderDatefrom'] = this.pipe.transform(this.startdate, "yyyy-MM-dd");
      this.filteredValues['jobOrderDateto'] = this.pipe.transform(endDateFilterValue, "yyyy-MM-dd");
      console.log("enddate", this.pipe.transform(endDateFilterValue, "yyyy-MM-dd"))
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      console.log("enddate", JSON.stringify(this.filteredValues))
    });


    this.lastStatusFilter.valueChanges.subscribe((lastStatusFilterValue) => {
      this.filteredValues['lastStatus'] = lastStatusFilterValue
      this.dataSource.filter = JSON.stringify(this.filteredValues);
    });

    this.dataSource.filterPredicate = this.customFilterPredicate();

    // this.pipe = new DatePipe('en');
    // this.dataSource.filterPredicate = (data: ServiceRequestList, filter) => {
    //   const formatted = this.pipe.transform(data.jobOrderDate, "MM/dd/yyyy");
    //   // formatted >= this.frDate && formatted <= this.toDate;
    //   return formatted.indexOf(filter) >= 0
    //     || data.lastStatus.toLocaleLowerCase().includes(filter.toLocaleLowerCase())
    //     || data.jobOrderNo.toLocaleLowerCase().includes(filter.toLocaleLowerCase())
    //     || data.serialNo.toLocaleLowerCase().includes(filter.toLocaleLowerCase())

    // }

    this.brokerAPIService.get(this.UrlAPI_GetAll + this.customerId).subscribe(
      data => {
        console.log("data", data);
        this.objarrServiceRequestList = data
        this.objarrServiceRequestList = Array.from(new Set(this.objarrServiceRequestList.map((itemInArray) => itemInArray.lastStatus)));
        this.dataSource.data = data;
      }
    );


  }


  customFilterPredicate() {
    const myFilterPredicate = function (data: ServiceRequestList, filter: string): boolean {
      this.pipe = new DatePipe('en');
      let searchString = JSON.parse(filter);
      console.log("customFilterPredicate", this.pipe.transform(data.jobOrderDate, "yyyy-MM-dd"));
      console.log("customFilterPredicate", searchString.jobOrderDateto);
      if (searchString.jobOrderDatefrom == undefined && searchString.jobOrderDateto == undefined) {
        return data.jobOrderNo.toString().trim().toLowerCase().indexOf(searchString.jobOrderNo.toLowerCase()) !== -1 &&
          data.serialNo.toString().trim().toLowerCase().indexOf(searchString.serialNo.toLowerCase()) !== -1 &&
          data.lastStatus.toString().trim().toLowerCase().indexOf(searchString.lastStatus.toLowerCase()) !== -1;
      }
      else if (searchString.jobOrderDatefrom != undefined && searchString.jobOrderDateto == undefined) {
        return data.jobOrderNo.toString().trim().toLowerCase().indexOf(searchString.jobOrderNo.toLowerCase()) !== -1 &&
          data.serialNo.toString().trim().toLowerCase().indexOf(searchString.serialNo.toLowerCase()) !== -1 &&
          data.lastStatus.toString().trim().toLowerCase().indexOf(searchString.lastStatus.toLowerCase()) !== -1
          && (this.pipe.transform(data.jobOrderDate, "yyyy-MM-dd") >= searchString.jobOrderDatefrom)
      }
      else if (searchString.jobOrderDatefrom == undefined && searchString.jobOrderDateto != undefined) {
        return data.jobOrderNo.toString().trim().toLowerCase().indexOf(searchString.jobOrderNo.toLowerCase()) !== -1 &&
          data.serialNo.toString().trim().toLowerCase().indexOf(searchString.serialNo.toLowerCase()) !== -1 &&
          data.lastStatus.toString().trim().toLowerCase().indexOf(searchString.lastStatus.toLowerCase()) !== -1
          && (this.pipe.transform(data.jobOrderDate, "yyyy-MM-dd") <= searchString.jobOrderDateto)
      }
      else {
        return data.jobOrderNo.toString().trim().toLowerCase().indexOf(searchString.jobOrderNo.toLowerCase()) !== -1 &&
          data.serialNo.toString().trim().toLowerCase().indexOf(searchString.serialNo.toLowerCase()) !== -1 &&
          data.lastStatus.toString().trim().toLowerCase().indexOf(searchString.lastStatus.toLowerCase()) !== -1
          && (this.pipe.transform(data.jobOrderDate, "yyyy-MM-dd") >= searchString.jobOrderDatefrom)
          && (this.pipe.transform(data.jobOrderDate, "yyyy-MM-dd") <= searchString.jobOrderDateto);
      }



    }
    return myFilterPredicate;
  }


  btnNewClick() {
    this.router.navigate([this.Url_Detail, { id: "new", filter: this.filter }]);
  }

  rowClicked(row: any): void {
    console.log(row);
    this.objRowSelected = <IArticle>row;
    this.router.navigate([this.Url_Detail, { id: this.objRowSelected.id, filter: this.filter }]);

  }



  clearClicked() {
    this.jobOrderNo = "";
    this.serialNo = "";
    this.startdate = undefined;
    this.enddate = undefined;
    this.lastStatus = "";
    // window.location.reload();
    this.showData();
  }



  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

  }

}

