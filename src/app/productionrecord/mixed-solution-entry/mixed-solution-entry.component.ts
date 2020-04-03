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
import { IArticle, IProductionOrder } from "../../interfaces/productionrecords";
import { Observable } from "rxjs/Observable";
import {
  MatSort,
  MatPaginator,
  MatTableDataSource,
  MatDialog,
  MatSnackBar
} from "@angular/material";
import { Router, ActivatedRoute } from "@angular/router";
import { MixedSolutionEntryDialogComponent } from "./dialog/mixed-solution-entry-dialog/mixed-solution-entry-dialog.component";

@Component({
  selector: 'app-mixed-solution-entry',
  templateUrl: './mixed-solution-entry.component.html',
  styleUrls: ['./mixed-solution-entry.component.scss']
})
export class MixedSolutionEntryComponent implements OnInit {
  isLoadingResults = true;
  dataSource = new MatTableDataSource();
  displayedColumns = [
    "TankNo",
    "MixingDate",
    "SoildContent",
    "RefToDDNo",
    "Startngime",
    "In",
    "Out",
    "VesselWt",
    "RefToRcNo",
    "actions"
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  ProductionPlanID: string;

  constructor(private brokerAPIService: BrokerAPIService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    let params = this.route.snapshot.paramMap;
    if (params.has("id")) {
      console.log(params.get("id"));
      this.ProductionPlanID = params.get("id");
    }
  }

  addNew() {

    const dialogRef = this.dialog.open(MixedSolutionEntryDialogComponent, {
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      // this.getProductionOrderList();
      if (result != undefined) {
        if (result.process != undefined) {
        }
      }
    });
    
  }


}
