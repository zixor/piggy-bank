import { Component } from '@angular/core';
import { NavController, ModalController, AlertController, NavParams } from 'ionic-angular';
import { Detail } from '../detail/detail';
import { BudgetSqliteService } from '../../providers/budget.service.sqlite';
import { CategoryModel } from '../../models/category.model';
import { Calculator } from '../calculator/calculator';

import { ModalCategory } from '../modal-category/modal-category';

@Component({
  selector: 'page-budget',
  templateUrl: 'budget.html'
})
export class Budget {

  private budget: any;
  private category: CategoryModel;

  constructor(private navCtrl: NavController,
    private budgetService: BudgetSqliteService,
    private modalCtl: ModalController,
    private alertCtrl: AlertController,
    private navParams: NavParams
  ) {

    const budget = this.navParams.get('budget');

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
      if (category && !this.budget.id) {

        let confirm = this.alertCtrl.create({
          title: 'Error',
          message: `A Budget for "${this.category.name}" category was already created in the same range of date.`,
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
      title: 'Delete',
      message: `Are you sure you want to delete this budget ?`,
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
          }
        },
        {
          text: 'Confirm',
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
