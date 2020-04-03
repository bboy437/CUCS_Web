import {
  Component,
  OnInit,
  Input,
  HostListener,
  ElementRef
} from "@angular/core";
import { AuthService } from "../../auth/service/auth.service";
import { Router } from "@angular/router";
import { BrokerAPIService } from "../../services/brokerapi.service";
import { GetUser } from "../../interfaces/cu";

@Component({
  selector: "cdk-user-menu",
  templateUrl: "./user-menu.component.html",
  styleUrls: ["./user-menu.component.scss"]
})
export class UserMenuComponent implements OnInit {
  isOpen: boolean = false;
  objRow: any = {};
  objAPIResponse: any = {};
  //currentUser = null;
  Hari;
  private Url_Detail: string = "/auth/pages/user-changpassword";
  currentUserName: string;
  private UrlAPI_GetCustomerId: string = "Account/GetCustomerId";
  private UrlAPI_GetSystemUserList: string = "Account/GetSystemUserList";
  private UrlAPI_GetSingleRow: string = "Account/GetSystemUser/";
  @Input()
  currentUser = null;
  @HostListener("document:click", ["$event", "$event.target"])
  onClick(event: MouseEvent, targetElement: HTMLElement) {
    if (!targetElement) {
      return;
    }

    const clickedInside = this.elementRef.nativeElement.contains(targetElement);
    if (!clickedInside) {
      this.isOpen = false;
    }
  }

  constructor(
    private elementRef: ElementRef,
    private router: Router,
    private authService: AuthService,
    private brokerAPIService: BrokerAPIService,
  ) {}

  ngOnInit() {

	this.getCustomerId();
  }

  CustomerId: String;
  private getCustomerId() {
    this.brokerAPIService.get(this.UrlAPI_GetCustomerId).subscribe(data => {
      this.CustomerId = data;
      // console.log("CustomerId", this.CustomerId)
      this.getsystemUserList();
    });
  }

  systemUserList: any = [];
  private getsystemUserList() {

    if(this.CustomerId == null){
      this.currentUserName = localStorage.getItem('currentUserName');
    }else{
      this.brokerAPIService.get(this.UrlAPI_GetSystemUserList).subscribe(data => {
        if (data.length > 0) {
          for (let i = 0; i < data.length; i++) {
            if (data[i].customerId == this.CustomerId) {
              this.systemUserList = data[i]
              // console.log("data[i]", data[i])
              // console.log("systemUserList", this.systemUserList.id)
              this.getUser();
            }
          }
        }
      });
    }
   

  }

  
  getUser(){
    this.brokerAPIService
    .get(this.UrlAPI_GetSingleRow + this.systemUserList.id)
    .subscribe(data => {
      this.objRow = <GetUser>data;
      // console.log("data",data)
    });
  
  }

  logout() {
    localStorage.clear();
    this.authService.logout();
    this.router.navigate(["/login"]);
    // this.router.navigate(['/']);
  }
  
  Change() {
    // this.authService.logout();
    this.router.navigate([this.Url_Detail]);
    // this.router.navigate(['/']);
  }
}
