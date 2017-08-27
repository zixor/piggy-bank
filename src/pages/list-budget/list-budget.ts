import { Component } from '@angular/core';
import { NavController, AlertController, ModalController } from 'ionic-angular';
import { Budget } from '../budget/budget';
import { BudgetSqliteService } from '../../providers/budget.service.sqlite';
import { CategorySqliteService } from '../../providers/category.service.sqlite';
import { ExpenseSqliteService } from '../../providers/expense.service.sqlite';
import { UtilitiesService } from '../../providers/utilities.service';
import { BudgetModel } from '../../models/budget.model';
import { Datefilter } from '../datefilter/datefilter';

@Component({
  selector: 'page-list-budget',
  templateUrl: 'list-budget.html'
})
export class ListBudget {

  private budgets: any[] = [];
  private initialDate: string;
  private finalDate: string;
  private DELETE: string;
  private CANCEL: string;
  private CONFIRM: string;
  private QUESTION_DELETE_BUDGET: string;

  constructor(private navCtrl: NavController,
    private budgetService: BudgetSqliteService,
    private categoryService: CategorySqliteService,
    private utilitiesService: UtilitiesService,
    private expenseService: ExpenseSqliteService,
    private modalCtl: ModalController,
    private alertCtrl: AlertController
  ) {
    this.initializeConstants();
    this.findAll();

  }

  initializeConstants() {
    this.utilitiesService.getValueByLanguaje("CANCEL").then(value => {
      this.CANCEL = value;
    });
    this.utilitiesService.getValueByLanguaje("CONFIRM").then(value => {
      this.CONFIRM = value;
    });
    this.utilitiesService.getValueByLanguaje("DELETE").then(value => {
      this.DELETE = value;
    });
    this.utilitiesService.getValueByLanguaje("QUESTION_DELETE_BUDGET").then(value => {
      this.QUESTION_DELETE_BUDGET = value;
    });

  }


  findAll() {
    let arrBudgets = [];
    this.budgetService.getAll(null, null, null).then(data => {
      if (data) {
        data.forEach(budget => {

          this.categoryService.getCategory(budget.category)
            .then(data => {
              budget.category = data;
              this.expenseService.getExpenseByRangeDate(budget.category.id, budget.initialDate, budget.finalDate)
                .then(data => {
                  budget.executed = data;
                  budget.percent = ((data / budget.amount) * 100).toString().substr(0, 5);
                });
            });
          arrBudgets.push(budget);
        });
      }
      this.budgets = arrBudgets;
    });
    console.log(this.budgets);
  }

  ionViewWillEnter() {
    this.findAll();
  }

  ionViewDidLoad() {
    this.findAll();
  }

  onItemClick(budget) {
    this.navCtrl.push(Budget, {
      budget: budget
    });
  }

  doRefresh(refresher) {
    let arrBudget = [];
    this.budgetService.getAll(null, null, null)
      .then(data => {
        if (data) {
          data.forEach(budget => {
            this.categoryService.getCategory(budget.category)
              .then(data => {
                budget.category = data;
                this.expenseService.getExpenseByRangeDate(budget.category.id, budget.initialDate, budget.finalDate)
                  .then(data => {
                    budget.executed = data;
                    budget.percent = ((data / budget.amount) * 100).toString().substr(0, 5);
                  });
              });
            arrBudget.push(budget);
          });
        }
        this.budgets = arrBudget;
        refresher.complete();
      })
      .catch(e => console.log(e));

  }

  onAddClick() {
    this.navCtrl.push(Budget);
  }


  onTrash(budget: BudgetModel) {
    console.log("onTrash");
    let confirm = this.alertCtrl.create({
      title: this.DELETE,
      message: this.QUESTION_DELETE_BUDGET,
      buttons: [
        {
          text: this.CANCEL,
          handler: () => {
          }
        },
        {
          text: this.CONFIRM,
          handler: () => {
            this.budgetService.delete(budget);
            this.findAll();
          }
        }
      ]
    });
    confirm.present();
  }

  onClickBudget(budget) {
    this.navCtrl.push(Budget, { "budget": budget });
  }

  doFilter() {

    const modal = this.modalCtl.create(Datefilter);
    modal.present();

    modal.onDidDismiss(filter => {
      this.initialDate = filter.initialDate;
      this.finalDate = filter.finalDate;
    });

  }

}
