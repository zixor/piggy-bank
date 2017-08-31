import { Component, ViewChild } from '@angular/core';
import { ModalController, AlertController } from 'ionic-angular';
import { Datefilter } from '../datefilter/datefilter';
import { DatePipe, CurrencyPipe } from '@angular/common';
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
  private currentDate: string;
  private data = [];
  private EXPORT_TITTLE: string = "";
  private EXPORT_QUESTION: string = "";
  private CANCEL: string = "";
  private CONFIRM: string = "";
  private REPORT_TITLE_EXPORT:string = "";
  private REPORT_TITLE_BODY:string = "";


  constructor(
    private modalCtl: ModalController,
    private expenseService: ExpenseSqliteService,
    private utilitiesService: UtilitiesService,
    private alertCtrl: AlertController,
    private datePipe: DatePipe,
    private currencyPipe: CurrencyPipe
  ) {

    this.getColors();
    let arrDates = this.utilitiesService.getInitialRangeOfDates();
    this.initialDate = arrDates[0];
    this.finalDate = arrDates[1];
    this.currentDate = moment(this.finalDate).format("MMM YYYY");
    this.initializeConstants();

  }

  initializeConstants() {

    this.utilitiesService.getValueByLanguaje("EXPORT_TITTLE").then(value => {
      this.EXPORT_TITTLE = value;
    });
    this.utilitiesService.getValueByLanguaje("EXPORT_QUESTION").then(value => {
      this.EXPORT_QUESTION = value;
    });
    this.utilitiesService.getValueByLanguaje("CANCEL").then(value => {
      this.CANCEL = value;
    });
    this.utilitiesService.getValueByLanguaje("CONFIRM").then(value => {
      this.CONFIRM = value;
    });
this.utilitiesService.getValueByLanguaje("REPORT_TITLE_EXPORT").then(value => {
      this.REPORT_TITLE_EXPORT = value;
    });
    this.utilitiesService.getValueByLanguaje("REPORT_TITLE_BODY").then(value => {
      this.REPORT_TITLE_BODY = value;
    });
  }

  getColors() {
    this.colors = this.utilitiesService.getAppColors();
  }


  initializeData(initialDate, finalDate) {
    let amount = [];
    let labels = [];
    this.expenseService.getExpensesGroupByCategory(initialDate, finalDate, null).then(response => {
      if (response) {
        this.data = response;
        response.forEach(report => {

          labels.push(report.category);
          amount.push(report.amount);

          this.borderColor.push(this.colors[report.color]);
          this.backgroundColor.push(this.colors[report.color]);

        });
        this.makeGraphics(labels, amount, this.borderColor, this.backgroundColor);
      }

    });
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
          label: 'Expenses By Category',
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

    this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {

      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          label: 'Category',
          data: amount,
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
      this.currentDate = moment(this.finalDate).format("MMM YYYY");
      this.initializeData(this.initialDate, this.finalDate);
    });

  }

  onExport() {

    let confirm = this.alertCtrl.create({
      title: this.EXPORT_TITTLE,
      message: this.EXPORT_QUESTION,
      buttons: [
        {
          text: this.CANCEL,
          handler: () => {
          }
        },
        {
          text: this.CONFIRM,
          handler: () => {
            this.getDataReport().then(data => {
              this.sendFile(data);
            });
          }
        }
      ]
    });
    confirm.present();

  }

  getDataReport(): Promise<any> {

    let categories = "";
    let dataReport = "";

    this.data.forEach(report => {
      categories += report.idcategory + ",";
    });

    categories = categories.substring(0, categories.length - 1);
    return new Promise((resolve, reject) => {
      this.expenseService.getAllByDateAndCategory(this.initialDate, this.finalDate, categories).then(expenses => {
        this.data.forEach(report => {
          dataReport += " Date " + "|" + " Total " + report.category + "|" + this.currencyPipe.transform(report.amount, 'USD', true) + "|\n";
          expenses.forEach(expense => {
            if (expense.category == report.idcategory) {
              let date = moment(expense.date).format('MMMM Do YYYY, h:mm:ss a');
              dataReport += date + "|";
              dataReport += expense.description + "|";
              dataReport += this.currencyPipe.transform(expense.amount, 'USD', true) + "\n";
            }
          });
          dataReport += "||\n";
        });
        resolve(dataReport);
      });
    });

  }

  sendFile(dataReport) {
    let body = this.REPORT_TITLE_BODY + "\n";
    this.utilitiesService.exportToFile("expenses.txt", dataReport).then(fileEntry => {
      this.utilitiesService.sendEmail('', this.REPORT_TITLE_EXPORT,
        body, fileEntry.nativeURL);
    });
  }


}
