import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { ToolbarHelpers } from './toolbar.helpers';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/service/auth.service';
import { BrokerAPIService } from '../../services/brokerapi.service';

@Component({
  selector: 'cdk-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
	private UrlAPI_GetCustomerId: string = "Account/GetCustomerId";
  private UrlAPI_GetSystemUserList: string = "Account/GetSystemUserList";
  @Input() sidenav;
	@Input() sidebar;
	@Input() drawer;
	@Input() matDrawerShow;
  
	searchOpen: boolean = false;
    toolbarHelpers = ToolbarHelpers;
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
							console.log("data[i]", data[i])
							console.log("systemUserList", this.systemUserList.id)
						}
					}
				}
			});
		}
}
