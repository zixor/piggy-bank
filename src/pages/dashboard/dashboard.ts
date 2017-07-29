import { Component, ViewChild } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { Datefilter } from '../datefilter/datefilter';
import { Chart } from 'chart.js';
import * as moment from 'moment';


import { ExpenseSqliteService } from '../../providers/expense.service.sqlite';
import { UtilitiesService } from '../../providers/utilities.service';

@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class Dashboard {

  @ViewChild('barCanvas') barCanvas;
  @ViewChild('doughnutCanvas') doughnutCanvas;

  barChart: any;
  doughnutChart: any;
  //lineChart: any;  
  private borderColor = [];
  private backgroundColor = [];
  private colors = {};
  private initialDate: string;
  private finalDate: string;
  private currentDate:string;
  private data = [];

  constructor(
    private modalCtl: ModalController,
    private expenseService: ExpenseSqliteService,
    private utilitiesService: UtilitiesService) {

    this.getColors();
    let arrDates = this.utilitiesService.getInitialRangeOfDates();
    this.initialDate = arrDates[0];
    this.initialDate = arrDates[1];
    this.currentDate = moment(this.initialDate).format("MMM YYYY"); 
  }

  getColors() {
    this.colors = this.utilitiesService.getAppColors();
  }


  initializeData(initialDate, finalDate) {
    let data = [];
    let labels = [];
    this.expenseService.getExpensesGroupByCategory(initialDate, finalDate, null).then(response => {      
      if (response) {
        this.data = response;
        response.forEach(report => {

          labels.push(report.category);
          data.push(report.amount);

          this.borderColor.push(this.colors[report.color]);
          this.backgroundColor.push(this.colors[report.color]);

        });
        this.makeGraphics(labels, data, this.borderColor, this.backgroundColor);
      }

    });
  }

  ionViewDidLoad() {

    this.initializeData(this.initialDate, this.finalDate);

  }

  private makeGraphics(labels, data, borderColor, backgroundColor) {
    this.barChart = new Chart(this.barCanvas.nativeElement, {

      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Expenses By Category',
          data: data,
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

    this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {

      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          label: 'Category',
          data: data,
          backgroundColor: backgroundColor,
          hoverBackgroundColor: borderColor
        }]
      }

    });

  }

  showItem() {
    console.log("show in cloud");
  }

  doFilter() {

    const modal = this.modalCtl.create(Datefilter);
    modal.present();

    modal.onDidDismiss(filter => {
      console.log(filter);
      this.initialDate = filter.initialDate;
      this.finalDate = filter.finalDate;
      this.currentDate = moment(this.initialDate).format("MMM YYYY"); 
      this.initializeData(this.initialDate, this.finalDate);
    });

  }

}
