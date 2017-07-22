import { Component, ViewChild } from '@angular/core';
import {  ModalController } from 'ionic-angular';
import { Datefilter } from '../datefilter/datefilter';
import { Chart } from 'chart.js';


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

  constructor(
    private modalCtl: ModalController,
    private expenseService: ExpenseSqliteService,
    private utilitiesService: UtilitiesService) {
    this.getColors();
  }

  getColors() {
    this.colors = this.utilitiesService.getAppColors();
  }


  initializeData(initialDate,finalDate) {
    let data = [];
    let labels = [];  
    this.expenseService.getExpensesGroupByCategory(initialDate,finalDate,null).then(response => {

      if (response) {
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

    this.initializeData(null,null);

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
       this.initializeData(filter.initialDate,filter.finalDate);
    });

  }

}
