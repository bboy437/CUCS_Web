import { WebDataRocksPivot } from "../webdatarocks/webdatarocks.angular4";
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { GlobalsValue } from '../../globals.value';
import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  AfterViewInit
} from "@angular/core";
import { BrokerAPIService } from "../../services/brokerapi.service";
import "rxjs/add/operator/map";
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from "@angular/material";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import * as moment from "moment";
import { Moment } from "moment";
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
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  arrobjService: any = [];
  private Url_listing: string = "";
  @ViewChild('pivot1') child: WebDataRocksPivot;
  isLoadingResults = true;

  constructor(private brokerAPIService: BrokerAPIService, private route: ActivatedRoute,
    private router: Router, private http: HttpClient, private globalsvalue: GlobalsValue) {

  }

  ngOnInit() {
    this.isLoadingResults = true;
    let params = this.route.snapshot.paramMap;
    this.arrobjService = JSON.parse(params.get('data'))
    console.log("data", params.get('data'))
    this.Url_listing = params.get('Urllisting');
    this.isLoadingResults = false;
  }

  onPivotReady(pivot: WebDataRocks.Pivot): void {
    // console.log("[ready] WebDataRocksPivot", this.child);
  }

  onCustomizeCell(cell: WebDataRocks.CellBuilder, data: WebDataRocks.Cell): void {
    // console.log("[customizeCell] WebDataRocksPivot");
    if (data.isClassicTotalRow) cell.addClass("fm-total-classic-r");
    if (data.isGrandTotalRow) cell.addClass("fm-grand-total-r");
    if (data.isGrandTotalColumn) cell.addClass("fm-grand-total-c");
  }


  customizeToolbar(toolbar) {

    var tabs = toolbar.getTabs();
    toolbar.getTabs = function () {
      delete tabs[0];
      delete tabs[1];
      delete tabs[2];

      return tabs;
    }

  }


  onReportComplete(): void {
    this.child.webDataRocks.off("reportcomplete");
    this.child.webDataRocks.setReport({

      "dataSource": {
        "dataSourceType": "json",
        "data": this.arrobjService,
      },
      "options": {
        "grid": {
          "type": "flat",
          "showGrandTotals": "off",
          // "title": 'รายงานการใช้ Gift รายวัน  Test second line',
        },

      },

      "localization": {
        "grid": {
          "blankMember": "",
        },

      }

    });

  }



  btnCloseClick() {
    this.router.navigate([this.Url_listing]);
  }
}
