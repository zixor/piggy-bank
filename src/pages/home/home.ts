import { Component } from '@angular/core';
import {
  NavController, AlertController, ModalController, Events, Platform,
  ToastController, MenuController, NavParams
} from 'ionic-angular';
import { Detail } from '../detail/detail';
import { ExpenseSqliteService } from '../../providers/expense.service.sqlite';
import { CategorySqliteService } from '../../providers/category.service.sqlite';
import { Datefilter } from '../datefilter/datefilter';
import { UtilitiesService } from '../../providers/utilities.service';
import { SocialSharing } from '@ionic-native/social-sharing';
import { EmailComposer } from '@ionic-native/email-composer';
import { File } from '@ionic-native/file';
import * as moment from 'moment';
import { CurrencyPipe, DatePipe } from '@angular/common';
declare var cordova: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private expense;
  private disableGestorBack = false;
  private balance: number = 0;
  private incomes: number = 0;
  private amountExpenses: number = 0;
  private refresher;
  private initialDate: string;
  private finalDate: string;
  private systemDirectory: string;
  private EXPORT_QUESTION: string;
  private QUESTION_DELETE_EXPENSE: string;
  private DELETE: string;
  private CONFIRM: string;
  private CANCEL: string;
  private EXPORT_TITTLE: string;
  private REPORT_TITLE_EXPORT: string;
  private REPORT_TITLE_BODY: string;
  private SHARE_EXPENSE: string;
  private DESCRIPTION: string;
  private CATEGORY_TITLE: string;
  private AMOUNT: String;
  private DATE: string;

  constructor(private navCtrl: NavController,
    private modalCtl: ModalController,
    private expenseService: ExpenseSqliteService,
    private categoryService: CategorySqliteService,
    private utilitiesService: UtilitiesService,
    private socialSharing: SocialSharing,
    private menu: MenuController,
    private email: EmailComposer,
    private toastController: ToastController,
    private alertCtrl: AlertController,
    private currencyPipe: CurrencyPipe,
    private navParms: NavParams,
    private datePipe: DatePipe,
    private platform: Platform,
    private events: Events,
    private file: File
  ) {
    console.log("1.constructor");
    this.disabelBackMenu(navParms.get('fromProfile'));
    this.systemDirectory = this.utilitiesService.getSysmteDirectory();
    let arrDates = this.utilitiesService.getInitialRangeOfDates();
    this.initialDate = arrDates[0];
    this.finalDate = arrDates[1];
    this.initializeConstants();
    this.subscribeExpensesLoaded();
    this.menu.swipeEnable(true);
  }

  disabelBackMenu(disable) {
    this.disableGestorBack = disable;
  }

  initializeConstants() {
    this.utilitiesService.getValueByLanguaje("EXPORT_QUESTION").then(value => {
      this.EXPORT_QUESTION = value;
    });
    this.utilitiesService.getValueByLanguaje("EXPORT_TITTLE").then(value => {
      this.EXPORT_TITTLE = value;
    });
    this.utilitiesService.getValueByLanguaje("QUESTION_DELETE_EXPENSE").then(value => {
      this.QUESTION_DELETE_EXPENSE = value;
    });
    this.utilitiesService.getValueByLanguaje("DELETE").then(value => {
      this.DELETE = value;
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
    this.utilitiesService.getValueByLanguaje("SHARE_EXPENSE").then(value => {
      this.SHARE_EXPENSE = value;
    });
    this.utilitiesService.getValueByLanguaje("DESCRIPTION").then(value => {
      this.DESCRIPTION = value;
    });
    this.utilitiesService.getValueByLanguaje("CATEGORY_TITLE").then(value => {
      this.CATEGORY_TITLE = value;
    });
    this.utilitiesService.getValueByLanguaje("AMOUNT").then(value => {
      this.AMOUNT = value;
    });
    this.utilitiesService.getValueByLanguaje("DATE").then(value => {
      this.DATE = value;
    });
  }

  subscribeExpensesLoaded() {
    this.events.subscribe("expenses:loaded", expense => {
      this.expense = expense;
      this.showLoader();
    });
  }

  showLoader() {
    if (this.refresher != null) {
      this.refresher.complete();
    }
  }

  setIncomes(initialDate, finalDate) {
    this.expenseService.getIncomes(initialDate, finalDate);
  }

  setBalance() {
    this.balance = this.incomes - this.amountExpenses;
  }

  findAll(initialDate, finalDate) {
    this.expenseService.getAll(initialDate, finalDate).then(data => {
      if (data) {
        this.setIncomes(initialDate, finalDate);
      }
    });
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
      title: this.DELETE,
      message: this.QUESTION_DELETE_EXPENSE + expense.description + " ?",
      buttons: [
        {
          text: this.CANCEL,
          handler: () => {
          }
        },
        {
          text: this.CONFIRM,
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
            this.exportExpenses();
          }
        }
      ]
    });
    confirm.present();
  }

  exportExpenses() {
    let expenses = this.expense.expenses;
    let data = "";
    expenses.forEach(expense => {
      let date = moment(expense.date).format('MMMM Do YYYY, h:mm:ss a');
      data += expense.category.name + "|" + date + "|" + expense.description + "|" + this.currencyPipe.transform(expense.amount, 'USD', true) + "\n";
    });
    this.utilitiesService.exportToFile("expenses.txt", data).then(fileEntry => {
      console.log(fileEntry);
      this.utilitiesService.sendEmail('', this.REPORT_TITLE_EXPORT,
        this.REPORT_TITLE_BODY,
        fileEntry.nativeURL);
    });
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
    let message = this.SHARE_EXPENSE + "\n";
    let dateformat = moment(expense.date, "YYYY-MM-DD").toISOString();
    message += this.DESCRIPTION + " : " + expense.description + "\n";
    message += this.CATEGORY_TITLE + " : " + expense.category.name + "\n";
    message += this.AMOUNT + " : " + this.currencyPipe.transform(expense.amount, "USD", true) + "\n";
    message += this.DATE + " : " + this.datePipe.transform(dateformat) + "\n";
    this.utilitiesService.onShareWhatsApp(message);
  }

}
