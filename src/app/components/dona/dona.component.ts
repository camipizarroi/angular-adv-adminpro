import { Component, Input, OnInit} from '@angular/core';
import { ChartData, ChartEvent, ChartType, Color,  } from 'chart.js';

@Component({
  selector: 'app-dona',
  templateUrl: './dona.component.html',
  styles: [
  ]
})
export class DonaComponent implements OnInit{

  constructor() {
    this.data = [350, 450, 100];
    this.doughnutChartLabels = ['Labels1', 'Labels2', 'Labels3'];
   }

   ngOnInit() {
    this.validateTitle();
    this.doughnutChartData.datasets[0].data = this.data;
    this.doughnutChartData.labels = this.labels;
   }


  @Input() title: string = '';  
  @Input() labels: string[] = ['Labels1', 'Labels2', 'Labels3']; 
  @Input() data: number[]=[];

   public doughnutChartLabels: string[] = this.labels;
   public doughnutChartData: ChartData<'doughnut'> = {
     labels: this.doughnutChartLabels,
     datasets: [
       { data: this.data ,
         backgroundColor: ["#6857E6", "#009FEE", "#F02059"]},
       
     ]
   };

   validateTitle() {
    if (this.title.length === 0) {
      this.title = 'Sin titulo'
    }
   }

}
