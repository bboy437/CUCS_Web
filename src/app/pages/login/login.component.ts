import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/service/auth.service';
// import { AuthService } from '../../core/auth.service';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import 'rxjs/add/operator/map'
import { BrokerAPIService } from '../../services/brokerapi.service';
import {
  MatSnackBar, MatDialog, MatDialogRef, VERSION,
  MAT_DATE_FORMATS,
  DateAdapter,
  MAT_DATE_LOCALE
} from "@angular/material";
import { MessageDialogLoginComponent } from '../../dialogs/message-dialog-login/message-dialog-login.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  private loading = false;
  public userForm: FormGroup;
  dialogRef: MatDialogRef<MessageDialogLoginComponent>;
  disableBtn = false;
  loginGroup: FormGroup;
  MachineID: string;
  arrobjMachine: any = [];

  // objMachine : 
  model: any = {};

  private UrlAPI_GetAll_Machine: string = "/Machine/GetAll";
  private UrlAPI_GetCurrentUser: string = "Account/GetCurrentUser";
  private UrlAPI_GetSystemUserList: string = "Account/GetSystemUserList";
  private UrlAPI_GetCustomerId: string = "Account/GetCustomerId";

  formErrors = {
    'username': '',
    'password': '',
    'machine': ''
  };
  validationMessages = {
    'username': {
      'required': 'Please enter your username',
      'username': 'please enter your vaild username',
    },
    'password': {
      'required': 'please enter your password',
      'pattern': 'The password must contain numbers and letters',
      'minlength': 'Please enter more than 4 characters',
      'maxlength': 'Please enter less than 25 characters',
    },
    'machine': {
      'required': 'Please enter your machine',
      'machine': 'please enter your vaild machine',
    }
  };

  constructor(
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder,
    private brokerAPIService: BrokerAPIService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {



  }
  ngOnInit() {
    this.buildForm();
    // this.setMachine();
    this.model.username = "";
    this.model.password = "";

    this.loginGroup = this.fb.group({
      usernameCtrl: ['', Validators.required],
      passwordCtrl: ['', Validators.required],
      machineCtrl: ['', Validators.required],

    });

    this.loginGroup.valueChanges
      .subscribe((changedObj: any) => {
        this.disableBtn = this.loginGroup.valid;
        //  console.log(changedObj);
      });

  }

  save() {

  }

  form = new FormGroup({
    loginGroup: new FormControl({
      usernameCtrl: new FormControl('', Validators.required),
      passwordCtrl: new FormControl('', Validators.required),
      machineCtrl: new FormControl('', Validators.required),

    })
  });

  buildForm() {
    this.userForm = this.fb.group({
      'username': ['', [Validators.required]],
      'password': ['', [
        // Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
        Validators.minLength(6),
        Validators.maxLength(25)
      ]],
      'machine': ['', [Validators.required]],

    });

    this.userForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged();
  }

  onValueChanged(data?: any) {
    if (!this.userForm) {
      return;
    }
    const form = this.userForm;
    for (const field in this.formErrors) {
      if (Object.prototype.hasOwnProperty.call(this.formErrors, field)) {
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (Object.prototype.hasOwnProperty.call(control.errors, key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  showSnackBar(message: string) {
    this.snackBar.open(message, "", {
      duration: 2000
    });
  }

  showDialog(type: string, title: string, body: string) {
    this.dialogRef = this.dialog.open(MessageDialogLoginComponent, {
      width: '300px', height: '200px',
      data: {
        Messagetype: type,
        Messagetitle: title,
        Messagebody: body
      },
      disableClose: true
    });
  }

  validate() {

    let strValidate: string = "";
    if (this.model.password == "" || this.model.password == undefined || this.model.username == "" || this.model.username == undefined) {
      strValidate = "Invalid data";
    }
    if (strValidate != "") {
      this.showDialog("error", "Error", strValidate);
      return false;
    }
  }

  btnLoginClick() {
    if (this.validate()) {
      this.login();
    }
  }

  login() {
    if (this.model.username != "" && this.model.password != "" && this.model.machine != "") {
      this.loading = true;
      this.authService.login(this.model.username, this.model.password, this.model.machine)
        .subscribe(
          datalogin => {
            if (datalogin) {
              this.getCurrentUser();

            }
            else {
              console.log("message " + datalogin);
              console.log("message " + this.authService.responseLogin.message);

              let strValidate: string = "";
              if (this.authService.responseLogin.message == "Login failed, Invalid username or passowrd") {
                strValidate = "Invalid username or password";
              }

              if (strValidate != "") {
                this.showDialog("error", "Error", strValidate);
                return false;

              } if (this.authService.responseLogin.message == "Login failed, user lock or expired") {
                strValidate = "Login failed, user lock or expired";
              }

              

              if (strValidate != "") {
                this.showDialog("error", "Error", strValidate);
                return false;

              } else {
                return true;
              }
            }

          },

          error => {
            this.loading = false;
          });
    }
  }




  CurrentUser: any = [];
  private getCurrentUser() {
    this.brokerAPIService.get(this.UrlAPI_GetCurrentUser).subscribe(data => {
      this.CurrentUser = data;
      // console.log("data", data)
      localStorage.setItem("currentUserName", data.userName);
      // this.router.navigate(["auth/pages"]);
      this.getCustomerId()

    });
  }
  CustomerId: String;
  private getCustomerId() {
    this.brokerAPIService.get(this.UrlAPI_GetCustomerId).subscribe(data => {
      this.CustomerId = data;
      this.getsystemUserList();
      // this.router.navigate(["auth/pages"]);
    });
  }

  systemUserList: any = {};
  private getsystemUserList() {
    // this.router.navigate(["auth/pages/system-user-list"]);
    if ( this.CustomerId == null){

      this.router.navigate(["auth/pages/system-user-list"]);
    }else{
    
      this.brokerAPIService.get(this.UrlAPI_GetSystemUserList).subscribe(data => {
        if (data.length > 0) {
          for (let i = 0; i < data.length; i++) {
            if (data[i].customerId == this.CustomerId) {
            
              
              this.systemUserList = data[i]
              
  
              if (this.systemUserList.isAdmin == false) {
                this.router.navigate(["auth/pages/service-list"]);
              }  
              else {
                this.router.navigate(["auth/pages/system-user-list"]);
              }
  
            }
          }
        }
  
      });
    }
    
    
  }

  clear() {
    this.model.username = "";
    this.model.password = "";
  }
}

