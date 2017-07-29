import { Component } from '@angular/core';
import { NavController, AlertController, ModalController, Events } from 'ionic-angular';
import { Detail } from '../detail/detail';
import { ExpenseSqliteService } from '../../providers/expense.service.sqlite';
import { CategorySqliteService } from '../../providers/category.service.sqlite';
import { Datefilter } from '../datefilter/datefilter';
import { UtilitiesService } from '../../providers/utilities.service';
import * as moment from 'moment';

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

  constructor(private navCtrl: NavController,
    private modalCtl: ModalController,
    private expenseService: ExpenseSqliteService,
    private categoryService: CategorySqliteService,
    private utilitiesService: UtilitiesService,
    private alertCtrl: AlertController,
    private events: Events
  ) {

    console.log("1.constructor");

    let arrDates = this.utilitiesService.getInitialRangeOfDates();
    this.initialDate = arrDates[0];
    this.finalDate = arrDates[1];

    this.subscribeExpensesLoaded();
    this.subscribeIncomesLoaded();

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

  onExport(){

    let initialDate = moment(this.initialDate).format("MMM Do YY");
    let finalDate = moment(this.initialDate).format("MMM Do YY");

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
            //TODO make
          }
        }
      ]
    });
    confirm.present();
  }

  exportExpenses(){
    //TODO MAKE EXPORT HERE
  }


}
