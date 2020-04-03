import { Component, OnInit, ViewChild } from '@angular/core';
import { BrokerAPIService } from '../../services/brokerapi.service';
import 'rxjs/add/operator/map'
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { IAPIResponse } from '../../interfaces/apiResponse';
import {
    MatSort,
    MatPaginator,
    MatTableModule,
    MatTableDataSource,
    MatDialog
} from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { user } from '../../interfaces/cu';
import { stringify } from '@angular/core/src/render3/util';

@Component({
    selector: 'app-system-user-list',
    templateUrl: './system-user-list.component.html',
    styleUrls: ['./system-user-list.component.scss']
})
export class SystemUserListComponent implements OnInit {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild("fileInput") fileInput;
    dataSource = new MatTableDataSource();
    displayedColumns = ['userName', 'customerCode', 'customerName', 'inActivated'];
    objRowSelected: any;
    filter: string = "";
    expandedElement: any;
    private UrlAPI_GetAll: string = "Account/GetSystemUserList";
    private Url_Detail: string = "/auth/pages/system-user-detail";;
    objRow: any = {};
    objoperationInstruction: any = {};
    objAPIResponse: any = {};
    arrobjPrivilege: any = [];
    public isLoadingResults = false;

    constructor(
        private brokerAPIService: BrokerAPIService,
        private route: ActivatedRoute,
        private router: Router,
        private dialog: MatDialog,
    ) { }

    ngOnInit() {
        this.showdata();
    }

    private showdata() {

        this.isLoadingResults = true;
        this.dataSource.filterPredicate = function (data: user, filter): boolean {
            const status = String(data.inActivated == true ? 'Inactive' : (data.inActivated == false ? 'Active' : data.inActivated));
            return status.toString().toLowerCase().includes(filter.toLowerCase())
                || data.userName.toLowerCase().includes(filter.toLowerCase())
                || data.customerCode.toLowerCase().includes(filter.toLowerCase())
                || data.customerName.toLowerCase().includes(filter.toLowerCase())

        };

        let params = this.route.snapshot.paramMap;
        this.brokerAPIService.get(this.UrlAPI_GetAll).subscribe(data => {
            this.arrobjPrivilege = data;
            this.dataSource.data = data;
            console.log("data", data);
            if (params.get("filter") != null) {
                this.filter = params.get("filter");
            }
            this.dataSource.filter = this.filter;
            this.isLoadingResults = false;
        });



    }

    btnNewClick() {
        this.router.navigate([this.Url_Detail, { id: "new", filter: this.filter }]);
    }

    rowClicked(row: any): void {
        //  console.log(row);
        this.objRowSelected = row;
        this.router.navigate([this.Url_Detail, { id: this.objRowSelected.id, filter: this.filter }]);
    }

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim().toLowerCase();
        this.dataSource.filter = filterValue;
        
    }


    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }


}

