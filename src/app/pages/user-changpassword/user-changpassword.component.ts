import { Component, OnInit } from '@angular/core';
import { BrokerAPIService } from '../../services/brokerapi.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { IAPIResponse } from '../../interfaces/apiResponse';
import {
  MatSnackBar, MatDialog, MatDialogRef, VERSION,
  MAT_DATE_FORMATS,
  DateAdapter,
  MAT_DATE_LOCALE
} from "@angular/material";
import { MessageDialogComponent } from '../../dialogs/message-dialog/message-dialog.component';

@Component({
  selector: 'app-user-changpassword',
  templateUrl: './user-changpassword.component.html',
  styleUrls: ['./user-changpassword.component.scss']
})
export class UserChangpasswordComponent implements OnInit {

  version = VERSION;
  dialogRef: MatDialogRef<MessageDialogComponent>;
  private RowID: string;
  objRow: any = {};
  objAPIResponse: any = {};
  private UrlAPI_UserChangePassword: string = "Account/IdentityUserChangePassword";
  private UrlAPI_GetSystemUserList: string = "Account/GetSystemUserList";
  private UrlAPI_GetCustomerId: string = "Account/GetCustomerId";
  private Listingservice: string = "auth/pages/service-list";
  private user: string = "auth/pages/system-user-list";
  filter: string;
  private Url_Listing: string = "/auth/pages/";
  disabled: boolean;
  arrobjSyseum: any = [];
  NewPassword: string;
  password: string;

  constructor(private brokerAPIService: BrokerAPIService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router) {
  }

 
  ngOnInit() {
    this.getCustomerId();
    this.RowID = "new";
    console.log(localStorage.getItem('password'));
    this.password = localStorage.getItem('password');
  }



  CustomerId: String;
  private getCustomerId() {
    this.brokerAPIService.get(this.UrlAPI_GetCustomerId).subscribe(data => {
      this.CustomerId = data;
      this.getsystemUserList();
    });
  }

  systemUserList: any = [];
  private getsystemUserList() {
    this.brokerAPIService.get(this.UrlAPI_GetSystemUserList).subscribe(data => {
      if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          if (data[i].customerId == this.CustomerId) {
            this.systemUserList = data[i]   
            console.log("aa",this.systemUserList.isAdmin);
          }
        }
      }
 
    });
  }

  btnCloseClick() {
    
    if (this.systemUserList.isAdmin == false) {
      this.router.navigate([this.Listingservice]);
    }  
    else if (this.systemUserList.isAdmin == true) {
      this.router.navigate([this.user]);
    }
    else{
      this.router.navigate([this.user]);
    }
  }

  btnSaveClick() {
      this.save()
  }


  save() {

    let strValidate: string = "";
    if (this.objRow.newPassword  != this.NewPassword) {
      strValidate = "Password ไม่ตรงกัน";
    }
    if (strValidate != "") {
      this.showDialog("error", "Error", strValidate);
      return false;
    }

    if (this.objRow.newPassword  < 6 ) {
      strValidate = "Password 6 หลักขึ้นไป";
    }
    if (strValidate != "") {
      this.showDialog("error", "Error", strValidate);
      return false;
    }

    if (this.objRow.oldPassword == "" || this.objRow.oldPassword == null) {
      strValidate = "Password เดิมไม่ถูกต้อง";
    }
    if (strValidate != "") {
      this.showDialog("error", "Error", strValidate);
      return false;
    }



    if (this.RowID == "new") {
      
      //Create
      this.brokerAPIService.post(this.UrlAPI_UserChangePassword, this.objRow).subscribe(
        data => {
          this.objAPIResponse = <IAPIResponse>data;
          if (this.objAPIResponse.success) {
            this.showSnackBar("Save Complete");
            if (this.systemUserList.isAdmin == false) {
              this.router.navigate([this.Listingservice]);
            } else {
              this.router.navigate([this.user]);
            }

          }
          else {
            console.log(
              "this.objAPIResponse.success :" + this.objAPIResponse.message
            );
            this.dialogRef = this.dialog.open(MessageDialogComponent, {
              width:'320px',height:'220px',
              data: {
                Messagetype: "error",
                Messagetitle: "Error",
                Messagebody: "รหัสผ่านควรมีตัวอักษรอย่างน้อย 6 ตัว และประกอบด้วยอักษร และ ตัวเลข"
              },
              disableClose: true
            });
     
          }
        },
        err => {
          // กรณี error
          console.log('Something went wrong!');
        });
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