import { Component } from '@angular/core';
import { NavController, AlertController, ModalController, Events, Platform, ToastController } from 'ionic-angular';
import { Detail } from '../detail/detail';
import { ExpenseSqliteService } from '../../providers/expense.service.sqlite';
import { CategorySqliteService } from '../../providers/category.service.sqlite';
import { Datefilter } from '../datefilter/datefilter';
import { UtilitiesService } from '../../providers/utilities.service';
import { SocialSharing } from '@ionic-native/social-sharing';
import { File } from '@ionic-native/file';
import * as moment from 'moment';
import { CurrencyPipe, DatePipe } from '@angular/common';

declare var cordova: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private expenses: any[] = [];

  private balance: number = 0;
  private incomes: number = 0;
  private amountExpenses: number = 0;
  private refresher;
  private initialDate: string;
  private finalDate: string;
  private systemDirectory: string

  constructor(private navCtrl: NavController,
    private modalCtl: ModalController,
    private expenseService: ExpenseSqliteService,
    private categoryService: CategorySqliteService,
    private utilitiesService: UtilitiesService,
    private socialSharing: SocialSharing,
    private toastController: ToastController,
    private alertCtrl: AlertController,
    private currencyPipe: CurrencyPipe,
    private datePipe: DatePipe,
    private events: Events,
    private file: File,
    private platform: Platform
  ) {

    console.log("1.constructor");

    let arrDates = this.utilitiesService.getInitialRangeOfDates();
    this.initialDate = arrDates[0];
    this.finalDate = arrDates[1];

    this.setSysmteDirectory();

    this.subscribeExpensesLoaded();
    this.subscribeIncomesLoaded();

  }

  setSysmteDirectory() {
    if (this.platform.is('ios')) {
      //documentsDirectory is specific IOS.
      this.systemDirectory = this.file.documentsDirectory;
    }
    else if (this.platform.is('android')) {
      //cordova.file.dataDirectory or cordova.file.externalDataDirectory is specific to Android
      this.systemDirectory = this.file.dataDirectory;
    }
  }

  subscribeExpensesLoaded() {
    this.events.subscribe("expenses:loaded", expenses => {
      this.initializeForm(expenses);
    });
  }

  subscribeIncomesLoaded() {
    this.events.subscribe("incomes:loaded", data => {
      this.incomes = data;
      this.setTotalExpenses();
      this.setBalance();
    });
  }

  initializeForm(expenses) {
    this.expenses = expenses;
    if (this.refresher != null) {
      this.refresher.complete();
    }
  }

  setTotalExpenses() {
    let totalExpenses = 0;
    if (this.expenses) {
      this.expenses.forEach(expense => {
        if (expense.incoming == "false") {
          totalExpenses += expense.amount;
        }
      });
    }
    this.amountExpenses = totalExpenses;
  }

  setIncomes(initialDate, finalDate) {
    this.expenseService.getIncomes(initialDate, finalDate);
  }

  setBalance() {
    this.balance = this.incomes - this.amountExpenses;
  }

  findAll(initialDate, finalDate) {
    this.expenseService.getAll(initialDate, finalDate);
  }

  ionViewDidLoad() {
    console.log("2.ionViewDidLoad");
  }

  ionViewWillEnter() {
    console.log("3.ionViewWillEnter");
    this.expenseService.getAll(this.initialDate, this.finalDate).then(data => {
      if (data) {
        this.expenseService.getIncomes(this.initialDate, this.finalDate);
      }
    })
  }

  onItemClick(expense) {
    this.navCtrl.push(Detail, {
      expense: expense
    });
  }

  doRefresh(refresher) {

    this.findAll(this.initialDate, this.finalDate);
    this.refresher = refresher;
  }

  onAddClick() {
    this.navCtrl.push(Detail);
  }

  isUserAlreadyLoggedIn() {
    let user = window.localStorage.getItem('userProfile');
    return user !== null;
  }

  onTrash(expense) {
    console.log("onTrash");
    let confirm = this.alertCtrl.create({
      title: 'Delete',
      message: `Are you sure you want to delete this expense: "${expense.description}"?`,
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
          }
        },
        {
          text: 'Confirm',
          handler: () => {
            this.expenseService.delete(expense);
            this.findAll(this.initialDate, this.finalDate);
          }
        }
      ]
    });
    confirm.present();
  }

  doFilter() {

    const modal = this.modalCtl.create(Datefilter);
    modal.present();

    modal.onDidDismiss(filter => {
      console.log(filter);
      this.initialDate = filter.initialDate;
      this.finalDate = filter.finalDate;
      this.findAll(this.initialDate, this.finalDate);
    });

  }

  onExport() {

    let initialDate =  this.datePipe.transform(this.initialDate);
    let finalDate =  this.datePipe.transform(this.finalDate);

    let confirm = this.alertCtrl.create({
      title: 'Exporting current range of expenses',
      message: `Are you want to export the selected range of expenses : "${initialDate}" and "${finalDate}" ?`,
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
          }
        },
        {
          text: 'Confirm',
          handler: () => {
            this.exportExpenses();
          }
        }
      ]
    });
    confirm.present();
  }



  exportExpenses() {

    let expenses = this.expenses;
    let self = this;

    this.file.createFile(this.systemDirectory, "export.txt", true).then(fileEntry => {

      fileEntry.createWriter(function (fileWriter) {

        let data = "";
        expenses.forEach(expense => {
          let dateformat = moment(expense.date, "YYYY-MM-DD").toISOString();
          data += expense.category.name + "," + dateformat + "," + expense.description + "," + expense.amount + "\n";
        });

        fileWriter.seek(fileWriter.length);
        let blob = new Blob([data], { type: 'text/plain' });
        fileWriter.write(blob);

        self.shareWhatsApp();

      }, function (e) {
        this.presentToast('Error while exporting file:\n' + e);
      });
    });


  }

  shareWhatsApp() {
    let prompt = this.alertCtrl.create({
      title: 'Lets share via  WhatsApp',
      message: "Click to share with some friend!.",
      buttons: [
        {
          text: 'Cancel',
          handler: data => { }
        },
        {
          text: 'Share',
          handler: data => {
            // let pathReport = this.systemDirectory + "export.txt";
            let pathReport = cordova.file.dataDirectory + "export.txt";
            this.socialSharing.shareViaWhatsApp("Your expenses report goes here!", pathReport, null);
          }
        }
      ]
    });
    prompt.present();
  }


  private presentToast(text) {
    let toast = this.toastController.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  onShareWhatsApp(expense) {

    let message = "I would like to share with you my expense: \n";    
    let dateformat = moment(expense.date, "YYYY-MM-DD").toISOString();
  
    message += "Description: " + expense.description + "\n";
    message += "Category : " + expense.category.name + "\n";
    message += "Amount : "+  this.currencyPipe.transform(expense.amount,"USD",true) +"\n";
    message += "Date : " + this.datePipe.transform(dateformat) + "\n";

    this.socialSharing.shareViaWhatsApp(message, null, null);

  }

}
