import { Component, OnInit } from '@angular/core';
import { BrokerAPIService } from '../../services/brokerapi.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-standard-inspect-entry',
  templateUrl: './standard-inspect-entry.component.html',
  styleUrls: ['./standard-inspect-entry.component.scss']
})
export class StandardInspectEntryComponent implements OnInit {

  isLoadingResults = false;
  ProductionPlanID: any;

  constructor(private brokerAPIService: BrokerAPIService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    let params = this.route.snapshot.paramMap;
    if (params.has("id")) {
      console.log(params.get("id"));
      this.ProductionPlanID = params.get("id");
    }
    //this.isLoadingResults = true;
  }

}
