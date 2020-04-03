import { Component, OnInit } from '@angular/core';
import { BrokerAPIService } from '../../services/brokerapi.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatStepper, MatSnackBar } from '@angular/material';
import { ICreateJobOrder } from '../../interfaces/productionrecords';
import { IAPIResponse } from '../../interfaces/apiResponse';

@Component({
  selector: 'app-machine-check-list',
  templateUrl: './machine-check-list.component.html',
  styleUrls: ['./machine-check-list.component.scss']
})
export class MachineCheckListComponent implements OnInit {
  isLinear = false;
  FormGroup1: FormGroup;
  FormGroup2: FormGroup;
  FormGroup3: FormGroup;
  FormGroup4: FormGroup;

  arrobjMCL1: any = [];
  arrobjMCL2: any = [];
  arrobjMCL3: any = [];
  ProductionPlanID: string;

  private UrlAPI_CreateJobOrder: string = "ProductionRecord/CreateJobOrder";
  private UrlAPI_GetProductionPlan: string = "ProductionOrder/GetProductionPlan/";
  private UrlAPI_GetMachineCheckListForStartProduction: string = "MachineCheckList/GetMachineCheckListForStartProduction/";
  private Url_Listing: string = "/auth/productionrecord/";
  private UrlAPI_Update: any;
  objRow: any;
  objAPIResponse: IAPIResponse;
  fabricRollNo: any;
  spindleNo:any = "";
  remark:any = "";
  shiftId : any;
  teamId : any;
  onMachineId : any;
  lotNo : any;
  processId: any;


  constructor(private _formBuilder: FormBuilder,
    private brokerAPIService: BrokerAPIService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar) { }
  objarrMachineCheckList: any = [];

  ngOnInit() {

    this.FormGroup1 = this._formBuilder.group({
      Ctrl1: ['', Validators.required]
    });

    this.FormGroup2 = this._formBuilder.group({
      Ctrl2: ['', Validators.required]
    });

    this.FormGroup3 = this._formBuilder.group({
      Ctrl3: ['', Validators.required]
    });

    // this.FormGroup4 = this._formBuilder.group({
    //   Ctrl4: ['', Validators.required]
    // });

    let params = this.route.snapshot.paramMap;
    if (params.has("id")) {
      console.log(params.get("id"));
      this.ProductionPlanID = params.get("id");

    }

    this.brokerAPIService.get(this.UrlAPI_GetProductionPlan + this.ProductionPlanID ).subscribe(
      data => {
        console.log("UrlAPI_GetProductionPlan", data);
        this.fabricRollNo = data.rollNo;
        this.shiftId = data.shiftId;
        this.teamId = data.wokingTeamId;
        this.lotNo = data.lotNo;
        this.onMachineId = 3;
        this.processId = data.processId;
      },
      err => {
        console.log(err);
        //  this.isLoadingResults = false;
      }
    );

    this.brokerAPIService.get(this.UrlAPI_GetMachineCheckListForStartProduction + "3,2").subscribe(
      data => {
        console.log("UrlAPI_GetMachineCheckListForStartProduction", data);
        //this.objarrMachineCheckList = data;
        if (data.length > 0) {
          this.arrobjMCL1 = data.filter(x => x.groupOrder === 1);
          this.arrobjMCL2 = data.filter(x => x.groupOrder === 2);
          this.arrobjMCL3 = data.filter(x => x.groupOrder === 3);
        }
        // this.isLoadingResults = false;

      },
      err => {
        console.log(err);
        //  this.isLoadingResults = false;
      }
    );
  }

  getdata()
  {
    let objdata: any;
    objdata = {};
    objdata.productionPlanId = Number(this.ProductionPlanID);
    objdata.lotNo = Number(this.lotNo);
    // objdata.productionRecordStatus = "";
    
    objdata.onMachineId =Number(this.onMachineId);
    objdata.teamId = Number(this.teamId);
    objdata.shiftId = Number(this.shiftId);
    objdata.machineCheckListId = Number(3);
    objdata.processId = Number(this.processId);
    // objdata.startProductionTime = new Date();
    // objdata.endProductionTime =  Date.now;
    objdata.fabricRollNo = this.fabricRollNo;
    objdata.spindleNo = this.spindleNo;
    objdata.remark = this.remark;
   
    objdata.createBy = "admin";
    objdata.updateBy = "admin";

    console.log("getdata");
    console.log(JSON.stringify(objdata));
    return objdata;
  }

  createJobOrder() {
     // this.getdata();
    this.brokerAPIService
      .post(this.UrlAPI_CreateJobOrder,this.getdata())
      .subscribe(
        data => {
          this.objAPIResponse = <IAPIResponse>data;
          if (this.objAPIResponse.success) {
            this.showSnackBar("Save Complete");
            this.router.navigate([this.Url_Listing]);
          } else {
            console.log(
              "this.objAPIResponse.success :" + this.objAPIResponse.success
            );
          }
        },
        err => {
          // กรณี error
          console.log("Something went wrong!");
        }
      );
  }

  showSnackBar(message: string) {
    this.snackBar.open(message, "", {
      duration: 2000
    });
  }

  btnCloseClick() {
    this.router.navigate([this.Url_Listing]);
  }

  btnStartOperationClick() {
    this.createJobOrder();
    //this.router.navigate([this.Url_Listing]);
  }




}
