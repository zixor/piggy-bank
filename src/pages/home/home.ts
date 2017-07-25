import { Component } from '@angular/core';
import { NavController, AlertController, ModalController, Events } from 'ionic-angular';
import { Detail } from '../detail/detail';
import { ExpenseSqliteService } from '../../providers/expense.service.sqlite';
import { CategorySqliteService } from '../../providers/category.service.sqlite';
import { Datefilter } from '../datefilter/datefilter';

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

  constructor(private navCtrl: NavController,
    private modalCtl: ModalController,
    private expenseService: ExpenseSqliteService,
    private categoryService: CategorySqliteService,
    private alertCtrl: AlertController,
    private events: Events
  ) {

    console.log("1.constructor");
    this.subscribeExpensesLoaded();
    this.doRefresh(event);

  }

  subscribeExpensesLoaded() {
    this.events.subscribe("expenses:loaded", expenses => {
      this.initializeForm(expenses);
    });
  }

  initializeForm(expenses) {
    //TODO there are some methods that can be improve
    this.setExpenses();
    this.setIncomes();
    this.setBalance();
    this.expenses = expenses;
    if (this.refresher != null) {
      this.refresher.complete();
    }
  }

  setExpenses() {
    this.expenseService.getExpenses().then(data => {
      this.amountExpenses = data;
      this.setBalance();
    });
  }

  setIncomes() {
    this.expenseService.getIncomes().then(data => {
      this.incomes = data;
      this.setBalance();
    });
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
  }

  onItemClick(expense) {
    this.navCtrl.push(Detail, {
      expense: expense
    });
  }

  doRefresh(refresher) {
    this.findAll(null, null);
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
            this.findAll(null, null);
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
      this.findAll(filter.initialDate, filter.finalDate);
    });

  }


}
