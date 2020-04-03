import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { ChangeDetectionStrategy, ViewChild, TemplateRef } from "@angular/core";
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from "date-fns";

import { DatePipe } from "@angular/common";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE
} from "@angular/material/core";
import { MatDatepicker } from "@angular/material/datepicker";
import {
  MatSort,
  MatPaginator,
  MatTableDataSource,
  MatDialog
} from "@angular/material";
import { Subject } from "rxjs";
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarMonthViewDay
} from "angular-calendar";
import { BrokerAPIService } from "../../services/brokerapi.service";
import { Router, ActivatedRoute } from "@angular/router";
import {
  IProductionPlanByMonthAndShift,
  IShiftSchdule
} from "../../interfaces/productionrecords";

const colors: any = {
  red: {
    primary: "#ad2121",
    secondary: "#FAE3E3"
  },
  blue: {
    primary: "#1e90ff",
    secondary: "#D1E8FF"
  },
  yellow: {
    primary: "#e3bc08",
    secondary: "#FDF1BA"
  }
};

import * as moment from "moment";
import { Moment } from "moment";
import { FormControl } from "@angular/forms";
// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/

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
  selector: 'app-production-plan-list',
  templateUrl: './production-plan-list.component.html',
  styleUrls: ['./production-plan-list.component.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ],
  encapsulation: ViewEncapsulation.None

})
export class ProductionPlanListComponent implements OnInit {

  // DateSelected : string;
  isLoadingResults = false;
  objarrYear: any = [];
  objarrMonth: any = [];
  numYearSelected: number;
  numMonthSelected: number;
  arrobjProductionPlan: any = [];
  dataSource = new MatTableDataSource();
  displayedColumns = [
    "jobOrderNo",
    "productCode",
    "planQty",
    "rollNo",
    "processName",
    "planStartTime",
    "teamName",
    "standard",
    "status"
  ];
  private UrlAPI_GetProductionPlanByMonthAndShift: string =
    "ProductionOrder/GetProductionPlanByMonthAndShift/";
  private UrlAPI_GetProductionPlanByDateAndShift: string =
    "ProductionOrder/GetProductionPlanByDateAndShift/";
  private UrlAPI_GetAllShift: string = "ShiftSchedule/GetAll";

  private Url_MachineCheckList: string = "/auth/productionrecord/machine-check-list";
  private Url_Detail: string = "/auth/productionrecord/production-plan-detail";

  @ViewChild("modalContent") modalContent: TemplateRef<any>;
  view: string = "list";

  arrobjShift: any = [];
  Date : string = "";

  shiftID: number;
  DateSelected: Moment = moment();
  viewDate: Date = new Date();

 
  refresh: Subject<any> = new Subject();
  activeDayIsOpen: boolean = true;

  constructor(
    private brokerAPIService: BrokerAPIService,
    private router: Router,private route: ActivatedRoute,
    public datepipe: DatePipe
  ) { }

  setYear() {
    var year = new Date();
    this.numYearSelected = year.getFullYear();
    for (let index = 0; index < 11; index++) {
      if (index != 0) {
        year.setFullYear(year.getFullYear() - 1);
      }

      this.objarrYear.push({ year: year.getFullYear() });
    }
    //console.log(this.objarrYear);
  }

  setMonth() {
    var month = new Date();
    this.numMonthSelected = month.getMonth() + 1;
    for (let index = 0; index < 12; index++) {
      month.setMonth(index, 15);
      this.objarrMonth.push({
        month: month.getMonth() + 1,
        name: month.getMonth() + 1
      });
    }

    //  console.log(this.objarrMonth);
  }

  selectedMonthViewDay: CalendarMonthViewDay;

  dayClicked(day: CalendarMonthViewDay): void {
    this.DateSelected = moment(day.date);

    if (this.selectedMonthViewDay) {
      delete this.selectedMonthViewDay.cssClass;
    }

    // console.log(day);
    if (isSameMonth(day.date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, day.date) && this.activeDayIsOpen === true) ||
        day.events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = day.date;
      }
      this.getProductionPlanByMonthAndShift_List();
    } else {
      this.viewDate = day.date;
      this.numMonthSelected = day.date.getMonth() + 1;
      this.getProductionPlanByMonthAndShift_List();
    }

    //console.log("this.viewDate");

    day.cssClass = "cal-day-selected";
    this.selectedMonthViewDay = day;
  }

  public onDateChanged(event): void {
    console.log(event);
    this.viewDate = event;

    // this.selectedMonthViewDay.cssClass = "cal-day-selected";
    this.DateSelected = event;
    this.getProductionPlanByMonthAndShift_List();
  }

  

  ngOnInit() {
    this.isLoadingResults = true;
    // this.setYear();
    // this.setMonth();
    let params = this.route.snapshot.paramMap;
    if(params.get("Date") != null ){

      this.DateSelected = moment(params.get("Date"));
      console.log("DateSelected",this.DateSelected); 
     
    }
     this.setSelectShift();


  }

  private changeView() {
    this.activeDayIsOpen = false;
    console.log(this.viewDate);
    this.numMonthSelected = this.viewDate.getMonth() + 1;
    this.numYearSelected = this.viewDate.getFullYear();
    this.getProductionPlanByMonthAndShift_List();
  }

  btnPreviousClick() {
    let date = this.DateSelected.add(-1, "days").toDate();
    this.DateSelected = moment(date);
    this.viewDate = this.DateSelected.toDate();
    this.changeView();
  }

  btnTodayClick() {
    let date: Date = new Date();
    this.DateSelected = moment(date);
    this.viewDate = this.DateSelected.toDate();
    this.changeView();
  }

  btnNextClick() {
    let date = this.DateSelected.add(+1, "days").toDate();
    this.DateSelected = moment(date);
    this.viewDate = this.DateSelected.toDate();
    this.changeView();
  }

  ShiftChange() {
    localStorage.setItem("shiftID", this.shiftID.toString());
    this.getProductionPlanByMonthAndShift_List();
  }

  

  events: CalendarEvent[] = [];

  getProductionPlanByMonthAndShift_List() {
    this.isLoadingResults = true;
    let strselecteddate: String;
    // strselecteddate = this.datepipe.transform(this.DateSelected, "MM-dd-yyyy");
    strselecteddate = moment(this.DateSelected).format("MM-DD-YYYY");
    //selecteddate.setDate(this.DateSelected.getDate);
    console.log(
      this.UrlAPI_GetProductionPlanByDateAndShift +
      strselecteddate +
      "," +
      this.shiftID
    );
    this.brokerAPIService
      .get(
        this.UrlAPI_GetProductionPlanByDateAndShift +
        strselecteddate +
        "," +
        this.shiftID
      )
      .subscribe(data => {
        this.dataSource.data = data;
        console.log(data);
        this.isLoadingResults = false;
      });
  }

  

  btnNewClick() {
    this.router.navigate([
      this.Url_Detail,
      { id: "new", date: this.DateSelected.format("YYYY-MM-DDTHH:mm:ss") }
    ]);
  }

  rowClicked(row: any): void {

    //this.router.navigate([this.Url_MachineCheckList, { id: row.id }]);
    this.router.navigate([this.Url_Detail, { id: row.id, DateSelected: this.DateSelected.format("YYYY-MM-DDTHH:mm:ss") }]);
  }

  setSelectShift() {
    this.brokerAPIService.get(this.UrlAPI_GetAllShift).subscribe(data => {
      this.arrobjShift = <IShiftSchdule[]>data.sort(function (a, b) { return a.shiftNo - b.shiftNo; });

      // console.log(this.arrobjShift);
      if (localStorage.getItem("shiftID") == null) {
        this.shiftID = this.arrobjShift[0].id;
        localStorage.setItem("shiftID", this.shiftID.toString());
      } else {
        this.shiftID = +localStorage.getItem("shiftID");
      }
      console.log(localStorage.getItem("shiftID"));
      //this.shiftID = this.arrobjShift[0].id;
      // console.log(this.arrobjFG);
      this.getProductionPlanByMonthAndShift_List();
    });
  }
}


