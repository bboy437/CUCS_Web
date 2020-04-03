import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { AnonymousSubject } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';


@Component({
  selector: 'app-message-dialog-login',
  templateUrl: './message-dialog-login.component.html',
  styleUrls: ['./message-dialog-login.component.scss']
})
export class MessageDialogLoginComponent implements OnInit {

  
  constructor(public dialogRef: MatDialogRef<MessageDialogLoginComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }
  
    
    
    
    ngOnInit() {
      
    }
  
    OKClick(): void {
      this.dialogRef.close();
    }
  
  
    validate(){
      console.log(this.dialogRef.afterOpen);
      let strValidate : string = "";
  
      if(strValidate != "")
      {
        alert(strValidate);
        return false;
      }
      else
      {
        return true;
      }
     
    }
    // Messagetype: type,
    // Messagetitle: title,
    // Messagebody: body
    
  }