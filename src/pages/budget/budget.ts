import { Component } from '@angular/core';
import { NavController, ModalController, AlertController, NavParams } from 'ionic-angular';
import { Detail } from '../detail/detail';
import { BudgetSqliteService } from '../../providers/budget.service.sqlite';
import { CategoryModel } from '../../models/category.model';
import { Calculator } from '../calculator/calculator';
import { UtilitiesService } from '../../providers/utilities.service';

import { ModalCategory } from '../modal-category/modal-category';

@Component({
  selector: 'page-budget',
  templateUrl: 'budget.html'
})
export class Budget {

  private budget: any;
  private category: CategoryModel;

  private CANCEL: string;
  private DELETE: string;
  private CONFIRM: string;
  private ERROR: string;
  private BUDGET_FOR: string;
  private BUDGET_SAME_DATES: string;
  private QUESTION_DELETE_BUDGET: string;

  constructor(private navCtrl: NavController,
    private budgetService: BudgetSqliteService,
    private utilitiesService: UtilitiesService,
    private modalCtl: ModalController,
    private alertCtrl: AlertController,
    private navParams: NavParams
  ) {

    const budget = this.navParams.get('budget');
    this.initializeConstants();

    if (budget) {

      this.budget = {
        id: budget.id,
        initialDate: budget.initialDate,
        finalDate: budget.finalDate,
        amount: budget.amount,
        category: budget.category.id
      }

      this.category = budget.category;

    } else {

      let date = new Date();
      let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      let lastDayCurrentMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      this.budget = {
        initialDate: new Date(firstDay).toISOString(),
        finalDate: new Date(lastDayCurrentMonth).toISOString(),
        amount: 0,
        category: ""
      }

      this.category = {
        name: "",
        description: "",
        icon: "help",
        color: "light"
      };
    }

  }


  initializeConstants() {

    this.utilitiesService.getValueByLanguaje("ERROR").then(value => {
      this.ERROR = value;
    });
    this.utilitiesService.getValueByLanguaje("BUDGET_FOR").then(value => {
      this.BUDGET_FOR = value;
    });
    this.utilitiesService.getValueByLanguaje("BUDGET_SAME_DATES").then(value => {
      this.BUDGET_SAME_DATES = value;
    });
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


  ionViewWillEnter() {

  }

  onItemClick(expense) {
    this.navCtrl.push(Detail, {
      expense: expense
    });
  }

  onAddClick() {
    this.navCtrl.push(Detail);
  }


  onSave() {

    this.budgetService.getAll(this.budget.initialDate, this.budget.finalDate, this.budget.category).then(category => {
      //README If already exist the budget and I´m not editting the record
      if ((category.length > 0) && (this.budget.id == undefined)) {

        let confirm = this.alertCtrl.create({
          title: this.ERROR,
          message: this.BUDGET_FOR + " " + this.category.name + " " + this.BUDGET_SAME_DATES,
          buttons: ['OK']
        });

        confirm.present();

      } else {

        this.saveBudget();

      }
    })

    this.navCtrl.pop();
  }

  saveBudget() {

    if (this.budget.id) {
      this.budgetService.update(this.budget);
    } else {
      this.budgetService.add(this.budget);
    }

  }

  openModalCategory() {
    const modal = this.modalCtl.create(ModalCategory);
    modal.present();

    modal.onDidDismiss(category => {
      this.category = category;
      this.budget.category = this.category.id.toString();
    });
  }

  onTrash() {
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
            this.budgetService.delete(this.budget);
            this.navCtrl.pop();
          }
        }
      ]
    });
    confirm.present();
  }

  openCalc() {

    const modal = this.modalCtl.create(Calculator);
    modal.present();

    modal.onDidDismiss(value => {
      if (value) {
        this.budget.amount = value;
      }
    });
  }

}
