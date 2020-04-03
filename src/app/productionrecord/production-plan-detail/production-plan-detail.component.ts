import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BrokerAPIService } from '../../services/brokerapi.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-production-plan-detail',
  templateUrl: './production-plan-detail.component.html',
  styleUrls: ['./production-plan-detail.component.scss']
})
export class ProductionPlanDetailComponent implements OnInit {
  ProductionPlanID: any;
  DateSelected: string ="";

  private Url_Listing: string = "/auth/productionrecord/";
  private Url_MachineCheckList: string = "/auth/productionrecord/machine-check-list";
  private Url_MixedSolution: string = "/auth/productionrecord/mixed-solution-entry";
  private Url_StandardInspect: string = "/auth/productionrecord/standard-inspect-entry";

  constructor(private brokerAPIService: BrokerAPIService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    
    let params = this.route.snapshot.paramMap;
    if (params.has("id")) {
      console.log(params.get("id"));
      this.ProductionPlanID = params.get("id");
      this.DateSelected = params.get("DateSelected");
    }
  }

  btnCloseClick() {
    this.router.navigate([this.Url_Listing,{Date: this.DateSelected}]);
  }

  btnMixedSolutionClick() {
    this.router.navigate([this.Url_MixedSolution , { id: this.ProductionPlanID }] );
  }

  btnStandardIspectClick() {
    this.router.navigate([this.Url_StandardInspect, { id: this.ProductionPlanID }]);
  }

  btnMachineCheckListClick() {
    this.router.navigate([this.Url_MachineCheckList, { id: this.ProductionPlanID }]);
  }

 


}
