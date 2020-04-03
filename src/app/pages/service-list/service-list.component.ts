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
import { Service } from '../../interfaces/cu';
import { DatePipe } from '@angular/common';
import { FormControl } from '@angular/forms';
import { MessageDialogComponent } from '../../dialogs/message-dialog/message-dialog.component';

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
  selector: 'app-service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class ServiceListComponent implements OnInit {
  dataSource = new MatTableDataSource();
  objarrServiceRequestList: any = [];
  lastStatus: string;
  startdate: any;
  enddate: any;
  displayedColumns = [
    'jobOrderNo',
    'jobOrderDate',
    'serialNo',
    'equipmentDetail',
    'currentStep',
    'lastUpdateDate',
    'lastStatus'];
  objRowSelected: Service;
  filter: string = "";
  customerId: string;
  toDate: any;
  frDate: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  private UrlAPI_GetAll: string = "ServiceRequest/GetCustomerServiceRequest/";
  private Url_Detail: string = "/auth/pages/service-detail";
  private Url_DetailNew: string = "/auth/pages/service-request-entry";
  private UrlAPI_GetCustomerId: string = "Account/GetCustomerId";
  private Url_Report: string = "/auth/pages/report";
  pipe: DatePipe;
  jobOrderNo: string;
  serialNo: string;
  jobOrderNoFilter = new FormControl();
  serialNoFilter = new FormControl();
  startDateFilter = new FormControl(new Date());
  endDateFilter = new FormControl(new Date());
  lastStatusFilter = new FormControl();
  filteredValues = { jobOrderNo: '', serialNo: '', jobOrderDate: '', lastStatus: '' };
  dialogRef: MatDialogRef<MessageDialogComponent>;
  isLoadingResults = true;

  constructor(private brokerAPIService: BrokerAPIService,
    private router: Router,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private dialog: MatDialog, ) { }

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
    this.isLoadingResults = true;

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

    this.brokerAPIService.get(this.UrlAPI_GetAll + this.customerId).subscribe(
      data => {
        console.log("data", data);
        this.objarrServiceRequestList = data
        this.objarrServiceRequestList = Array.from(new Set(this.objarrServiceRequestList.map((itemInArray) => itemInArray.lastStatus)));
        this.dataSource.data = data;
        this.isLoadingResults = false;
      }
    );


  }


  customFilterPredicate() {
    const myFilterPredicate = function (data: Service, filter: string): boolean {
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
    this.router.navigate([this.Url_DetailNew, { id: "new", filter: this.filter }]);
  }

  btnReportClick() {
    this.Print();
  }

  private Print() {

    console.log("Print Data", this.dataSource.filteredData);
    let filteredData: any;
    filteredData = this.dataSource.filteredData;
    console.log("filteredData", filteredData);
    filteredData.forEach(element => {
      if (element.referDocDate <= ('1900-01-01T00:00:00')) {
        element.referDocDate = undefined;
      }
      else {
        element.referDocDate = moment(element.referDocDate).format("DD/MM/YYYY");
      }

      if (element.lastUpdateDate <= ('1900-01-01T00:00:00')) {
        element.lastUpdateDate = undefined;
      }
      else {
        element.lastUpdateDate = moment(element.lastUpdateDate).format("DD/MM/YYYY");
      }

      if (element.performOrderDate <= ('1900-01-01T00:00:00')) {
        element.performOrderDate = undefined;
      } else {
        element.performOrderDate = moment(element.performOrderDate).format("DD/MM/YYYY");
      }

      if (element.referJobOrderDate <= ('1900-01-01T00:00:00')) {
        element.referJobOrderDate = undefined;
      } else {
        element.referJobOrderDate = moment(element.referJobOrderDate).format("DD/MM/YYYY");
      }

      if (element.startWorkDate <= ('1900-01-01T00:00:00')) {
        element.startWorkDate = undefined;
      }
      else {
        element.startWorkDate = moment(element.startWorkDate).format("DD/MM/YYYY");
      }

      if (element.endWorkDate <= ('1900-01-01T00:00:00')) {
        element.endWorkDate = undefined;
      }
      else {
        element.endWorkDate = moment(element.endWorkDate).format("DD/MM/YYYY");
      }

      if (element.jobOrderDate <= ('1900-01-01T00:00:00')) {
        element.jobOrderDate = undefined;
      } else {
        element.jobOrderDate = moment(element.jobOrderDate).format("DD/MM/YYYY");
      }
    });


    if (filteredData == (0)) {
      let strValidate: string = "";
      strValidate = "No data";
      if (strValidate != "") {
        this.showDialog("error", "Error", strValidate);
        return false;
      } else {
        return true;
      }

    } else {
      filteredData.unshift({
        jobOrderNo: { "type": "string", "caption": "เลขที่งาน" },
        jobOrderDate: { "type": "string ", "caption": "วันที่รับแจ้ง" },
        referDocNo: { "type": "string", "caption": "เอกสารอ้างอิง" },
        referDocDate: { "type": "string", "caption": "วันที่อ้างอิง" },
        referJobOrderNo: { "type": "string", "caption": "อ้างอิงเลขที่ใบแจ้งเดิม" },
        referJobOrderDate: { "type": "string ", "caption": "วันที่ใบแจ้งเดิม" },
        serialNo: { "type": "string", "caption": "Serial No." },
        equipmentDetail: { "type": "string", "caption": "รายละเอียดอุปกรณ์" },
        informer: { "type": "string", "caption": "ชื่อผู้แจ้ง" },
        telephoneNo: { "type": "string", "caption": "หมายเลขโทรศัพท์" },
        emailAddress: { "type": "string", "caption": "Email" },
        installLocation: { "type": "string", "caption": "สถานที่ติดตั้ง" },
        address: { "type": "string", "caption": "ที่อยู่่" },
        provinceName: { "type": "string", "caption": "จังหวัด" },
        zipCode: { "type": "string", "caption": "รหัสไปรษณีย์" },
        performOrderDate: { "type": "string ", "caption": "วันที่แจ้งซ่อม" },
        startWorkDate: { "type": "string ", "caption": "วันที่เข้าดำเนินการแก้ไข" },
        endWorkDate: { "type": "string", "caption": "วันที่แก้ไขเสร็จ" },
        problemDetail: { "type": "string", "caption": "รายละเอียดปัญหา" },
        remark: { "type": "string", "caption": "หมายเหตุ" },
        solution: { "type": "string", "caption": "วิธีการแก้ปัญหา" }
      });
      this.router.navigate([this.Url_Report, { data: JSON.stringify(filteredData), Urllisting: "/auth/pages/service-list" }]);


    }


  }

  rowClicked(row: any): void {
    // console.log(row);
    this.objRowSelected = <Service>row;
    this.router.navigate([this.Url_Detail, { id: JSON.stringify(this.objRowSelected), filter: this.filter }]);

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

  showDialog(type: string, title: string, body: string) {
    this.dialogRef = this.dialog.open(MessageDialogComponent, {
      width: '300px', height: '200px',
      data: {
        Messagetype: type,
        Messagetitle: title,
        Messagebody: body
      },
      disableClose: true
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

  }
}
