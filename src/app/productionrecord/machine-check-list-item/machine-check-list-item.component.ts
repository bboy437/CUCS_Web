import { Component, OnInit,Input } from '@angular/core';
import {  ICheckList } from '../../interfaces/productionrecords';

@Component({
  selector: 'app-machine-check-list-item',
  templateUrl: './machine-check-list-item.component.html',
  styleUrls: ['./machine-check-list-item.component.scss']
})
export class MachineCheckListItemComponent implements OnInit {

  @Input() objMachineCheckList : any = {};

  constructor() { }


  ngOnInit() {
 
 //   this.OKNG = 'OK';

   
  }

}
