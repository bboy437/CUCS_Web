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
import { ServiceRequestDialogComponent } from './dialog/service-request-dialog/service-request-dialog.component';
import { MessageDialogComponent } from '../../dialogs/message-dialog/message-dialog.component';
import { ServiceRequest } from '../../interfaces/cu';
import { IAPIResponse } from '../../interfaces/apiResponse';
import { ConfirmDeleteDialogComponent } from '../../dialogs/confirm-delete-dialog/confirm-delete-dialog.component';
import { FormGroup } from '@angular/forms';
import { json } from 'd3';
export const MY_FORMATS = {
  parse: {
    dateInput: "DD/MM/YYYY "
  },
  display: {
    dateInput: "DD/MM/YYYY",
    monthYearLabel: "MMM YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM YYYY"
  }
};


@Component({
  selector: 'app-service-request-entry',
  templateUrl: './service-request-entry.component.html',
  styleUrls: ['./service-request-entry.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]

})
export class ServiceRequestEntryComponent implements OnInit {
  version = VERSION;
  dialogRef: MatDialogRef<MessageDialogComponent>;
  RowID: string;
  objRow: any = {};
  objAPIResponse: any = {};
  filter: string;
  readonly: boolean = true;
  repairNoteDate: Moment = moment();
  referDocDate: Moment = moment();
  referRepairNoteDate: Moment = moment();
  // referDocDate: any;
  // referRepairNoteDate: any;
  startdate: Moment = moment()
  customerId: string;
  isSubmited: string;
  objSerialNoList: string;
  objarrEquimentInfo: any = [];
  objarrEquimentInfo1: any = [];
  dataSerialNoList: any = {};
  key: string;
  disableMe = true;
  repairNoteNo : string;
  email: string;
  private UrlAPI_GetSingleRow: string = "ServiceRequest/GetServiceRequest/";
  private UrlAPI_GetEquimentInfo: string = "ServiceRequest/GetEquimentInfo/";
  private UrlAPI_CreateServiceRequest: string = "ServiceRequest/CreateServiceRequest";
  private UrlAPI_UpdateServiceRequest: string = "ServiceRequest/UpdateServiceRequest";
  private UrlAPI_DeleteServiceRequest: string = "ServiceRequest/DeleteServiceRequest";
  private UrlAPI_SubmitServiceRequest: string = "ServiceRequest/SubmitServiceRequest";
  private UrlAPI_GetSerialNoList: string = "ServiceRequest/GetSerialNoList/";
  private Url_Listing: string = "/auth/pages/service-list";
  private UrlAPI_GetCustomerId: string = "Account/GetCustomerId";

  constructor(
    private brokerAPIService: BrokerAPIService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.getCustomerId()
    let params = this.route.snapshot.paramMap;
    this.RowID = params.get('id');
    this.objSerialNoList = params.get('objSerialNoList');
    console.log("objSerialNoList", this.objSerialNoList);
    console.log("referDocDate", this.referDocDate);
    if (params.has('id')) {
      console.log(params.get('id'));
      this.RowID = params.get('id');
      this.filter = params.get("filter");
      if (this.RowID == "new") {
        this.readonly = true;
        this.repairNoteNo = "<Auto Gen.>";
        this.referDocDate = undefined
        this.referRepairNoteDate = undefined
      }
      else {
        this.brokerAPIService.get(this.UrlAPI_GetSingleRow + this.RowID).subscribe(
          data => {
            this.objRow = <ServiceRequest>data;
            this.repairNoteDate = this.objRow.repairNoteDate;
            this.referRepairNoteDate = this.objRow.referRepairNoteDate;
            this.referDocDate = this.objRow.referDocDate;
            this.objSerialNoList = this.objRow.serialNo
            this.getEquimentInfo();
            console.log("objRow", this.objRow);
          });

      }
    }
  }

  getEquimentInfo() {
    this.brokerAPIService.get(this.UrlAPI_GetEquimentInfo + this.objSerialNoList).subscribe(data => {
      this.objarrEquimentInfo = data;
      console.log("objarrSerialNoList", this.objarrEquimentInfo)
    });
  }

  private getCustomerId() {
    this.brokerAPIService.get(this.UrlAPI_GetCustomerId).subscribe(data => {
      this.customerId = data;
      console.log("customerId", this.customerId)
    });
  }

 
  validate() {
    let strValidate: string = "";
    if (this.objarrEquimentInfo.serialNo == undefined || this.objarrEquimentInfo.serialNo == "") {
      strValidate = "Serial No.";
    }
    if (strValidate != "") {
      this.showDialog("error", "Error", strValidate);
      return false;
    }
    if (this.objRow.informer == undefined || this.objRow.informer == "") {
      strValidate = "ชื่อผู้แจ้ง";
    }
    if (strValidate != "") {
      this.showDialog("error", "Error", strValidate);
      return false;
    }
    if (this.objRow.phoneNo == undefined || this.objRow.phoneNo == "") {
      strValidate = "หมายเลขโทรศัพท์";
    }
    if (strValidate != "") {
      this.showDialog("error", "Error", strValidate);
      return false;
    }
    if (this.objRow.problemDetail == undefined || this.objRow.problemDetail == "") {
      strValidate = "รายละเอียดปัญหา";
    }
    if (strValidate != "") {
      this.showDialog("error", "Error", strValidate);
      return false;
    }

    else {
      return true;
    }
  }

 

  btnSubmitClick() {
    if (this.validate()) {
      this.submit();
    }
  }

  submit() {
    this.objRow.serialNo = this.objarrEquimentInfo.serialNo;
    this.objRow.equipmentDetail = this.objarrEquimentInfo.equipmentDetail;
    this.objRow.contractEndDate = this.objarrEquimentInfo.contractEndDate;
    this.objRow.contractPerson = this.objarrEquimentInfo.contractPerson;
    this.objRow.contractPhoneNo = this.objarrEquimentInfo.contractPhoneNo;
    this.objRow.customerId = this.customerId;
    this.objRow.repairNoteDate = this.repairNoteDate.format("YYYY-MM-DDTHH:mm:ss");

  

    // this.objRow.referRepairNoteDate = this.referRepairNoteDate;
    this.objRow.equipmentId = this.dataSerialNoList.equipmentId;
    this.objRow.deptId = this.dataSerialNoList.deptId;
    this.objRow.divisionId = this.dataSerialNoList.divisionId;
    this.objRow.contractId = this.dataSerialNoList.contractId;

    if(this.referDocDate == undefined){
      this.objRow.referDocNo = "";
    }else{
      console.log('Something went wrong!', moment(this.referDocDate).format("YYYY-MM-DDTHH:mm:ss"));
      this.objRow.referDocDate = moment(this.referDocDate,"YYYY-MM-DDTHH:mm:ss").format("YYYY-MM-DDTHH:mm:ss");
    }

    if(this.objRow.referDocNo == ""){
      this.objRow.referDocNo = "";
    }
    if(this.objRow.referRepairNoteNo == ""){
      this.objRow.referRepairNoteNo = "";
    }

    if(this.objRow.remark == ""){
      this.objRow.remark = "";
    }

    if(this.objRow.email == undefined || this.objRow.email == ""){
      this.objRow.email = "";
    }

    this.brokerAPIService.post(this.UrlAPI_SubmitServiceRequest, this.objRow).subscribe(
      data => {
        this.objAPIResponse = <IAPIResponse>data;
        if (this.objAPIResponse.success) {
          this.showSnackBar("Save Complete");
          this.router.navigate([this.Url_Listing]);
        }
        else {
          console.log('this.objAPIResponse.success :' + this.objAPIResponse.success);
        }
      },
      err => {
        // กรณี error
        console.log('Something went wrong!');
      });
  }


  // btnDeleteClick() {
  //   this.delete();
  // }


  // delete() {
  //   const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
  //     disableClose: true
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       let objdelete = this.objRow
  //       this.brokerAPIService.post(this.UrlAPI_DeleteServiceRequest, objdelete).subscribe(
  //         data => {
  //           this.objAPIResponse = <IAPIResponse>data;
  //           if (this.objAPIResponse.success) {
  //             this.router.navigate([this.Url_Listing]);
  //           }
  //           else {
  //             console.log('this.objAPIResponse.success :' + this.objAPIResponse.success);
  //           }
  //         });
  //     }
  //   });
  // }


  keyserialNo(filterValue: string) {
    this.key = filterValue;
    if (filterValue != null ) {
      this.brokerAPIService.get(this.UrlAPI_GetSerialNoList +  this.customerId + "," + "*" + "," + "*" + "," + "*").subscribe(data => {
        if (data.length > 0) {
          for (let i = 0; i < data.length; i++) {
            if (data[i].serailNo == filterValue) {
              this.dataSerialNoList = data[i]  
              console.log("dataSerialNoList", this.dataSerialNoList.serailNo)
              this.key = filterValue;
              console.log("key", this.key)
   
            }
          }
        }
      });
    }
    if(filterValue == "") {
      this.objarrEquimentInfo = [];
      console.log("objarrEquimentInfo", this.objarrEquimentInfo)
    }

  }


  search() {

    if (this.key != null ) {
      console.log("key", this.key)
      this.brokerAPIService.get(this.UrlAPI_GetEquimentInfo + this.key).subscribe(data => {
        this.objarrEquimentInfo = data;
        this.key = null;
        console.log("objarrEquimentInfo", data)

        let strValidate: string = "";
        if (this.objarrEquimentInfo.serialNo == null) {
          strValidate = "No data";
          this.objarrEquimentInfo = [];
        }
        if (strValidate != "") {
          this.showDialog("error", "Error", strValidate);
          return false;
        } else {

        }

      });
    }

    if (this.key == null || this.key == "") {
      const dialogRef = this.dialog.open(ServiceRequestDialogComponent, {
        disableClose: true
      });

      dialogRef.afterClosed().subscribe(result => {
        let params = this.route.snapshot.paramMap;
        this.objSerialNoList = params.get('objSerialNoList');
        this.dataSerialNoList = JSON.parse(params.get('dataSerialNoList'));
        console.log("objSerialNoList", this.objSerialNoList);
        this.getEquimentInfo();
        console.log("result", result);
        if (result != undefined) {
       
        }

      });
    }


  }



  btnCloseClick() {
    this.router.navigate([this.Url_Listing]);
  }

  showSnackBar(message: string) {
    this.snackBar.open(message, "", {
      duration: 2000
    });
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



}
