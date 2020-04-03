import { Component, OnInit, Input } from '@angular/core';
import { BrokerAPIService } from '../../services/brokerapi.service';

@Component({
  selector: 'app-production-record-header',
  templateUrl: './production-record-header.component.html',
  styleUrls: ['./production-record-header.component.scss']
})
export class ProductionRecordHeaderComponent implements OnInit {
  isLoadingResults = false;
  JobOrderNo = "";
  Fabric = "";
  Process = "";
  Product = "";

  private UrlAPI_GetProductionPlan: string = "ProductionOrder/GetProductionPlan/";
  private UrlAPI_GetArticleInstruction: string = "Article/GetArticleInstruction/";
  
  @Input() ProductionPlanID : string;
  objProductionPlan : any = {};
  constructor(private brokerAPIService: BrokerAPIService) { }

  ngOnInit() {
    this.isLoadingResults = true;
    this.brokerAPIService.get(this.UrlAPI_GetProductionPlan + this.ProductionPlanID).subscribe(
      data => {
        this.JobOrderNo = data.jobOrderNo; 
        this.Process = data.process.processName; 
        this.Product = data.product.productName; 

        //this.Fabric = data.jobOrderNo; 
        console.log(data);
        this.isLoadingResults = false;
      },
      err => {
        console.log(err);
        this.isLoadingResults = false;
      }
      );


   
  }

}
