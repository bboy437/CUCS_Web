import { Component, OnInit } from '@angular/core';
import { BrokerAPIService } from "../../services/brokerapi.service";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { IAPIResponse } from "../../interfaces/apiResponse";
import { IDefect } from "../../interfaces/productionrecords";
import { MatSnackBar, MatDialog, MatDialogRef, VERSION } from "@angular/material";
import { MessageDialogComponent } from "../../dialogs/message-dialog/message-dialog.component";
import { GetUser, CustomerList } from '../../interfaces/cu';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from "rxjs/operators";

@Component({
  selector: 'app-system-user-detail',
  templateUrl: './system-user-detail.component.html',
  styleUrls: ['./system-user-detail.component.scss']
})
export class SystemUserDetailComponent implements OnInit {
  version = VERSION;
  isLoadingResults = true;
  private RowID: string;
  objRow: any = {};
  objAPIResponse: any = {};
  private UrlAPI_GetSingleRow: string = "Account/GetSystemUser/";
  private UrlAPI_Update: string = "Account/UpdateSystemUser";
  private UrlAPI_Create: string = "Account/Register";
  private UrlAPI_GetCustomerList: string = "ServiceRequest/GetCustomerList";
  private UrlAPI_GetCustomer: string = "ServiceRequest/GetCustomer/";
  private Url_Listing: string = "/auth/pages/system-user-list";
  dialogRef: MatDialogRef<MessageDialogComponent>;
  filter: string;
  isAdmin: boolean = false;
  inActivated: boolean = false;
  myControl = new FormControl();
  arrobjCustomerList: any = [];
  filterCustomerList: Observable<any[]>;
  customerName: String;
  customerId: String;
  name: any = {};
  isReadOnly = true;

  constructor(private brokerAPIService: BrokerAPIService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }



  ngOnInit() {

    this.customerList();
    let params = this.route.snapshot.paramMap;

    if (params.has("id")) {
      console.log(params.get("id"));
      this.RowID = params.get("id");
      this.filter = params.get("filter");
      this.isLoadingResults = false;
      if (this.RowID == "new") {
        this.isReadOnly = false;
        this.customerList();
      } else {
        this.isLoadingResults = true;
        this.brokerAPIService
          .get(this.UrlAPI_GetSingleRow + this.RowID)
          .subscribe(data => {
            this.objRow = <GetUser>data;
            // this.customerName = this.objRow.customerId
            this.isReadOnly = true;
            this.isAdmin = this.objRow.isAdmin;
            this.inActivated = this.objRow.inActivated;
            // if (this.isAdmin == true) {
            //   this.objRow.isAdmin = "True";
            // } else if (this.isAdmin == false) {
            //   this.objRow.isAdmin = "False";
            // }


            // if (this.isAdmin == true) {
            //   this.objRow.isAdmin = "True";
            // } else if (this.isAdmin == false) {
            //   this.objRow.isAdmin = "False";
            // }

            console.log("Getuser", this.objRow);
            this.showCustomerList();
            this.isLoadingResults = false;
          });
      }
    }
  }


  showCustomerList() {

    this.brokerAPIService.get(this.UrlAPI_GetCustomerList).subscribe(
      data => {
        if (data.length > 0) {
          for (let i = 0; i < data.length; i++) {
            if (data[i].customerId == this.objRow.customerId) {
              this.name = data[i]
              this.customerName = this.name.cusomerName

            }
          }
        }
      });
  }

  customerList() {
    this.brokerAPIService.get(this.UrlAPI_GetCustomerList).subscribe(
      data => {
        this.arrobjCustomerList = <CustomerList>data;
        this.filterCustomerList = this.myControl.valueChanges.pipe(
          startWith(""),
          map(value => this._filter(value))
        );
      }
    );
  }


  private _filter(value: string): any[] {
    const filterValue = value.toLowerCase();

    console.log("filterValue", filterValue);
    let objmember = this.arrobjCustomerList.filter(option =>
      option.cusomerName.toLowerCase().includes(filterValue)
    );
    console.log("objmember", objmember);
    if (objmember.length == 1) {


      this.customerId = objmember[0].customerId;
      console.log("customerId", this.customerId);
      // this.setCustomerId(objmember[0].customerId);
      // this.setCustomerId(objmember[0].customerId);
    } else {
      // this.arrobjchivacode = [];
    }
    return this.arrobjCustomerList.filter(option =>
      option.cusomerName.toLowerCase().includes(filterValue)

    );

  }





  btnSaveClick() {
    if (this.validate()) {
    this.save();
     }
  }

  btnCloseClick() {
    this.router.navigate([this.Url_Listing, { filter: this.filter }]);
  }

  save() {

    if (this.customerName == null || this.customerName == undefined || this.customerName == "") {
      let strValidate: string = "";
      strValidate = "Customer Name";
      if (strValidate != "") {
        this.showDialog("error", "Error", strValidate);
        return false;
      }
    } else {

      if (this.RowID == "new") {
        //Create
        if (this.isAdmin == true) {
          this.objRow.isAdmin = "True";
        } else {
          this.objRow.isAdmin = "False";
        }

        if (this.inActivated == true) {
          this.objRow.inActivated = "True";
        } else {
          this.objRow.inActivated = "False";
        }

        this.objRow.createBy = "admin";
        this.objRow.updateBy = "admin";
        this.objRow.customerId = this.customerId;
        this.objRow.password = "P@ssw0rd"

        this.brokerAPIService.post(this.UrlAPI_Create, this.objRow).subscribe(
          data => {
            this.objAPIResponse = <IAPIResponse>data;
            if (this.objAPIResponse.success) {
              this.showSnackBar("Save Complete");
              this.router.navigate([this.Url_Listing]);
            } else {
              console.log(
                "this.objAPIResponse.success :" + this.objAPIResponse.success
              );
            }
          },
          err => {
            // กรณี error
            console.log("Something went wrong!");
          }
        );
      } else {
        //Update
        if (this.isAdmin == true) {
          this.objRow.isAdmin = "True";
        } else {
          this.objRow.isAdmin = "False";
        }

        if (this.inActivated == true) {
          this.objRow.inActivated = "True";
        } else {
          this.objRow.inActivated = "False";
        }

        this.objRow.customerId = this.customerId;
        this.brokerAPIService
          .post(this.UrlAPI_Update, <IDefect>this.objRow)
          .subscribe(
            data => {
              this.objAPIResponse = <IAPIResponse>data;
              if (this.objAPIResponse.success) {
                this.showSnackBar("Save Complete");
                this.router.navigate([this.Url_Listing]);
              } else {
                console.log(
                  "this.objAPIResponse.success :" + this.objAPIResponse.success
                );
              }
            },
            err => {
              // กรณี error
              console.log("Something went wrong!");
            }
          );
      }
    }

  }

  validate() {
    let strValidate: string = "";
    if (this.objRow.userName == undefined || this.objRow.userName == "") {
      strValidate = "User Name";
    }

    if (strValidate != "") {
      this.showDialog("error", "Error", strValidate);
      return false;

    } if (this.objRow.firstName == undefined || this.objRow.firstName == "") {
      strValidate = "First Name";
    }

    if (strValidate != "") {
      this.showDialog("error", "Error", strValidate);
      return false;

    } if (this.objRow.lastName == undefined || this.objRow.lastName == "") {
      strValidate = "Last Name";
    }

    if (strValidate != "") {
      this.showDialog("error", "Error", strValidate);
      return false;

    }

    if (this.objRow.phoneNo == undefined || this.objRow.phoneNo == "") {
      strValidate = "Phone No";
    }

    if (strValidate != "") {
      this.showDialog("error", "Error", strValidate);
      return false;

    } if (this.customerName == undefined ||this.customerName == null || this.customerName == "") {
      strValidate = "Customer Name";
    }

    if (strValidate != "") {
      this.showDialog("error", "Error", strValidate);
      return false;

    }
    else {
      return true;
    }

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

