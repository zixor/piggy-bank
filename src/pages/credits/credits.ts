import { Component, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { UtilitiesService } from '../../providers/utilities.service';

@Component({
  selector: 'page-credits',
  templateUrl: 'credits.html',
})
export class Credits {

  @ViewChild('barCanvas') barCanvas;


  barChart: any;
  doughnutChart: any;
  //lineChart: any;  
  private borderColor = [];
  private backgroundColor = [];
  private colors = {};
  private initialDate: string;
  private finalDate: string;
  private currentDate: string;
  private data = [];


  constructor(

    private utilitiesService: UtilitiesService,

  ) {

    this.getColors();

  }

  getColors() {
    this.colors = this.utilitiesService.getAppColors();
  }


  initializeData(initialDate, finalDate) {

    let amount = [];
    let labels = [];
    labels.push("Java");
    amount.push("90");
    this.borderColor.push(this.colors["primary"]);
    this.backgroundColor.push(this.colors["primary"]);
    labels.push("JavaScript");
    amount.push("85");
    this.borderColor.push(this.colors["warm-1"]);
    this.backgroundColor.push(this.colors["warm-1"]);
    labels.push("PHP");
    amount.push("80");
    this.borderColor.push(this.colors["warm-10"]);
    this.backgroundColor.push(this.colors["warm-10"]);
    labels.push("SQL and Plsql");
    amount.push("80");
    this.borderColor.push(this.colors["warm-6"]);
    this.backgroundColor.push(this.colors["warm-6"]);
    labels.push("Mobile Applications");
    amount.push("70");
    this.borderColor.push(this.colors["warm-5"]);
    this.backgroundColor.push(this.colors["warm-5"]);
    labels.push("Scrum Master Certified");
    amount.push("100");
    this.borderColor.push(this.colors["warm-14"]);
    this.backgroundColor.push(this.colors["warm-14"]);
    labels.push("Scrum Developer Certified");
    amount.push("100");
    this.borderColor.push(this.colors["warm-7"]);
    this.backgroundColor.push(this.colors["warm-7"]);
    labels.push("Intermediate English");
    amount.push("67");
    this.borderColor.push(this.colors["warm-11"]);
    this.backgroundColor.push(this.colors["warm-11"]);

    this.makeGraphics(labels, amount, this.borderColor, this.backgroundColor);

  }

  ionViewDidLoad() {

    this.initializeData(this.initialDate, this.finalDate);

  }

  private makeGraphics(labels, amount, borderColor, backgroundColor) {
    this.barChart = new Chart(this.barCanvas.nativeElement, {

      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: '',
          data: amount,
          backgroundColor: backgroundColor,
          borderColor: borderColor,
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }

    });

  }

  showItem() {
    console.log("show in cloud");
  }



}
