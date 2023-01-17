import { Component, OnInit } from '@angular/core';
import { ChartData, ChartEvent, ChartType, Color,  } from 'chart.js';

@Component({
  selector: 'app-grafica1',
  templateUrl: './grafica1.component.html',
  styles: [
  ]
})
export class Grafica1Component implements OnInit {

public labels1: string[] = [ 'Pan', 'Refresco', 'Tacos' ];
public data1 =[ 50, 450, 100] ;

  constructor() { }

  ngOnInit(): void {
  }
}
