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
import { SerialNoList,  } from "../../../../interfaces/cu";
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

import { startWith, map } from "rxjs/operators";
import { Observable } from 'rxjs';
import { HttpUrlEncodingCodec } from '@angular/common/http';
import { MessageDialogComponent } from '../../../../dialogs/message-dialog/message-dialog.component';

@Component({
  selector: 'app-service-request-dialog',
  templateUrl: './service-request-dialog.component.html',
  styleUrls: ['./service-request-dialog.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class ServiceRequestDialogComponent implements OnInit {
  RowID: string;
  objRow: any = {};
  objAPIResponse: any = {};
  filter: string;
  readonly: boolean = true;
  customerId: string;
  objarrContactList: any = [];
  ContactList: string;
  objarrEquipmentList: any = [];
  EquipmentList: string;
  objarrBrandList: any = [];
  BrandList: string;
  objarrSerialNoList: any = [];
  SerialNoList: string;
  myControl = new FormControl();
  myControl1 = new FormControl();
  myControl2 = new FormControl();
  myControl3 = new FormControl();
  filterContactList: Observable<any[]>;
  filterEquipmentList: Observable<any[]>;
  filterBrandList: Observable<any[]>;
  filterSerialNoList: Observable<any[]>;
  dialogRef1: MatDialogRef<MessageDialogComponent>;
  isLoadingResults = true;
  private UrlAPI_GetContactList: string = "ServiceRequest/GetContactList/";
  private UrlAPI_GetEquipmentList: string = "ServiceRequest/GetEquipmentList/";
  private UrlAPI_GetBrandList: string = "ServiceRequest/GetBrandList/";
  private UrlAPI_GetSerialNoList: string = "ServiceRequest/GetSerialNoList/";
  private UrlAPI_GetCustomerId: string = "Account/GetCustomerId";
  private Url_Detail: string = "/auth/pages/service-request-entry";
  constructor(private brokerAPIService: BrokerAPIService,
    private route: ActivatedRoute, private router: Router,
    private dialogRef: MatDialog,
    private dialog: MatDialog, ) { }

  ngOnInit() {
    this.getCustomerId();
    this.getSerialNoList();

  }

  private getCustomerId() {
    this.brokerAPIService.get(this.UrlAPI_GetCustomerId).subscribe(data => {
      this.customerId = data;
      this.getContactList();
      console.log("customerId", this.customerId)
    });
  }


  getContactList() {
    this.brokerAPIService.get(this.UrlAPI_GetContactList + this.customerId).subscribe(data => {
      this.objarrContactList = data;
      this.filterContactList = this.myControl.valueChanges.pipe(
        startWith(""),
        map(value => this._filterContactList(value))
      );
    });
  }

  private _filterContactList(value: string): any[] {
    let filterValue = "";
    if (value != null) {
      filterValue = value.toLowerCase();
    }

    let objContactList = this.objarrContactList.filter(option =>
      option.toLowerCase().includes(filterValue)
    );
  

    this.getEquipmentList();

    return this.objarrContactList.filter(option =>
      option.toLowerCase().includes(filterValue)
    );


  }


  getEquipmentList() {
    if (this.ContactList == "" || this.ContactList == undefined) {
      this.brokerAPIService.get(this.UrlAPI_GetEquipmentList + this.customerId + "," + "*").subscribe(data => {
        this.objarrEquipmentList = data;
        this.filterEquipmentList = this.myControl1.valueChanges.pipe(
          startWith(""),
          map(value => this._filterEquipmentList(value))
        );
      });
    } else {
      this.brokerAPIService.get(this.UrlAPI_GetEquipmentList + this.customerId + "," + this.ContactList.replace('/', '|')).subscribe(data => {
        this.objarrEquipmentList = data;
        this.filterEquipmentList = this.myControl1.valueChanges.pipe(
          startWith(""),
          map(value => this._filterEquipmentList(value))
        );
      });
    }

  }

  private _filterEquipmentList(value: string): any[] {

    let filterValue = "";
    if (value != null) {
      filterValue = value.toLowerCase();
    }
  //  const filterValue = value.toLowerCase();

    let objEquipmentList = this.objarrEquipmentList.filter(option1 =>
      option1.toLowerCase().includes(filterValue)
    );

 
    this.getBrandList();
    return this.objarrEquipmentList.filter(option1 =>
      option1.toLowerCase().includes(filterValue)

    );

  }


  getBrandList() {
    // console.log("this.objEquipmentList ", this.objEquipmentList)
    if (this.EquipmentList == "" || this.EquipmentList == undefined) {
      this.brokerAPIService.get(this.UrlAPI_GetBrandList + this.customerId + "," + "*" + "," + "*").subscribe(data => {
        this.objarrBrandList = data;
        this.filterBrandList = this.myControl2.valueChanges.pipe(
          startWith(""),
          map(value => this._filterBrandList(value))
        );
      });
    }
    else if (this.ContactList == "" || this.ContactList == undefined && this.EquipmentList != "" || this.EquipmentList != undefined) {
      this.brokerAPIService.get(this.UrlAPI_GetBrandList + this.customerId + "," + "*" + "," + this.EquipmentList).subscribe(data => {
        this.objarrBrandList = data;
        console.log("this.data ", data)
        this.filterBrandList = this.myControl2.valueChanges.pipe(
          startWith(""),
          map(value => this._filterBrandList(value))
        );
      });
    }


    else {
      this.brokerAPIService.get(this.UrlAPI_GetBrandList + this.customerId + "," + this.ContactList.replace('/', '|') + "," + this.EquipmentList).subscribe(data => {
        this.objarrBrandList = data;
        this.filterBrandList = this.myControl2.valueChanges.pipe(
          startWith(""),
          map(value => this._filterBrandList(value))
        );
      });
    }

  }

  private _filterBrandList(value: string): any[] {
    let filterValue = "";
    if (value != null) {
      filterValue = value.toLowerCase();
    }

    let objBrandList = this.objarrBrandList.filter(option =>
      option.toLowerCase().includes(filterValue)
    );

    this.getSerialNoList();

    return this.objarrBrandList.filter(option =>
      option.toLowerCase().includes(filterValue)

    );

  }



  getSerialNoList() {

    if (this.BrandList == "" || this.BrandList == undefined) {
      this.brokerAPIService.get(this.UrlAPI_GetSerialNoList + this.customerId + "," + "*" + "," + "*" + "," + "*").subscribe(data => {
        this.objarrSerialNoList = <SerialNoList[]>data;

        this.filterSerialNoList = this.myControl3.valueChanges.pipe(
          startWith(""),
          map(value => this._filterSerialNoList(value))
        );
      });
    }
    else if (this.ContactList == undefined || this.ContactList == "" && this.EquipmentList == undefined || this.EquipmentList == "" && this.BrandList != "" || this.BrandList != undefined) {
      this.brokerAPIService.get(this.UrlAPI_GetSerialNoList + this.customerId + "," + "*" + "," + "*" + "," + this.BrandList).subscribe(data => {
        this.objarrSerialNoList = data;
        this.filterSerialNoList = this.myControl3.valueChanges.pipe(
          startWith(""),
          map(value => this._filterSerialNoList(value))
        );
      });
    } else {
      this.brokerAPIService.get(this.UrlAPI_GetSerialNoList + + this.customerId + "," + this.ContactList.replace('/', '|') + "," + this.EquipmentList + "," + this.BrandList).subscribe(data => {
        this.objarrSerialNoList = data;
        this.filterSerialNoList = this.myControl3.valueChanges.pipe(
          startWith(""),
          map(value => this._filterSerialNoList(value))
        );
      });
    }

  }


  private _filterSerialNoList(value: string): any[] {

    let filterValue = "";
    if (value != null) {
      filterValue = value.toLowerCase();
    }

    let objSerialNoList = this.objarrSerialNoList.filter(option =>
      option.serailNo.toLowerCase().includes(filterValue)
    );

    return this.objarrSerialNoList.filter(option =>
      option.serailNo.toLowerCase().includes(filterValue)

    );

  }

  dataSerialNoList: any = {};
  btnOkClick() {

    if (this.SerialNoList == null || this.SerialNoList == "") {
      let strValidate: string = "";
      if (this.SerialNoList == null || this.SerialNoList == "") {
        strValidate = "Serial No.";
      }
      if (strValidate != "") {
        this.showDialog("error", "Error", strValidate);
        return false;
      }

      else {
        return true;
      }

    } else {

      this.brokerAPIService.get(this.UrlAPI_GetSerialNoList + this.customerId + "," + "*" + "," + "*" + "," + "*").subscribe(data => {
        if (data.length > 0) {
          for (let i = 0; i < data.length; i++) {
            if (data[i].serailNo == this.SerialNoList) {
              this.dataSerialNoList = data[i]
              this.router.navigate([this.Url_Detail, { objSerialNoList: this.SerialNoList, dataSerialNoList: JSON.stringify(this.dataSerialNoList) }]);
              this.dialogRef.closeAll();
          

            }
          }
        }

      });

    }

  }

  showDialog(type: string, title: string, body: string) {
    this.dialogRef1 = this.dialog.open(MessageDialogComponent, {
      width: '300px', height: '200px',
      data: {
        Messagetype: type,
        Messagetitle: title,
        Messagebody: body
      },
      disableClose: true
    });
  }

  onNoClick() {

    this.dialogRef.closeAll();

  }
}

