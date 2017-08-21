import { Component } from '@angular/core';
import { ModalController, NavController, NavParams, AlertController } from 'ionic-angular';
import { CategoryModel } from '../../app/category.model';
import { ModalColors } from '../modal-colors/modal-colors';
import { ModalIcons } from '../modal-icons/modal-icons';

/**Import services  */
import { CategorySqliteService } from '../../providers/category.service.sqlite';
import { ExpenseSqliteService } from '../../providers/expense.service.sqlite';
import { SavingSqliteService } from '../../providers/savings.service.sqlite';
import { BudgetSqliteService } from '../../providers/budget.service.sqlite';

import { UtilitiesService } from '../../providers/utilities.service';


@Component({
  selector: 'page-category',
  templateUrl: 'category.html',
})
export class Category {

  private category: CategoryModel;
  private DELETE: string;
  private CATEGORY_CAN_NOT_DELETED: string;
  private CATEGORY_CAN_NOT_DELETED_DESC: string;

  constructor(private navCtrl: NavController,
    private navParams: NavParams,
    private modalCtl: ModalController,
    private utilitiesService: UtilitiesService,
    private categoryService: CategorySqliteService,
    private expensesService: ExpenseSqliteService,
    private savingsService: SavingSqliteService,
    private budgetService: BudgetSqliteService,
    private alertCtrl: AlertController) {
    this.category = {
      name: "",
      description: "",
      icon: "help",
      color: "light"
    };

    const category = navParams.get('category');
    if (category) {
      this.category = category;
    }

    this.initializeConstants();
  }

  ionViewDidLoad() {

  }

  initializeConstants() {

    this.utilitiesService.getValueByLanguaje("CATEGORY_CAN_NOT_DELETED").then(value => {
      this.CATEGORY_CAN_NOT_DELETED = value;
    });
    this.utilitiesService.getValueByLanguaje("CATEGORY_CAN_NOT_DELETED_DESC").then(value => {
      this.CATEGORY_CAN_NOT_DELETED_DESC = value;
    });
    this.utilitiesService.getValueByLanguaje("DELETE").then(value => {
      this.DELETE = value;
    });
  }

  onModalIcons() {

    const modal = this.modalCtl.create(ModalIcons);
    modal.present();

    modal.onDidDismiss(iconName => {
      if (iconName) {
        this.category.icon = iconName;
      }
    });

  }

  openModalColors() {
    const modal = this.modalCtl.create(ModalColors);
    modal.present();

    modal.onDidDismiss(color => {
      if (color) {
        this.category.color = color;
      }
    });
  }

  onSave() {
    if (this.category.id) {
      this.categoryService.update(this.category);
    } else {
      this.categoryService.add(this.category);
    }
    this.navCtrl.pop();
  }

  onTrash() {

    this.isCategoryUsedByOthers(this.category).then(exist => {

      if (exist) {

        let alert = this.alertCtrl.create({
          title: this.CATEGORY_CAN_NOT_DELETED,
          subTitle: this.CATEGORY_CAN_NOT_DELETED_DESC,
          buttons: ['OK']
        });
        alert.present();

      } else {

        let confirm = this.alertCtrl.create({
          title: this.DELETE,
          message: `Are you sure you want to delete this category: "${this.category.description}"?`,
          buttons: [
            {
              text: 'Cancel',
              handler: () => {
              }
            },
            {
              text: 'Confirm',
              handler: () => {
                this.categoryService.delete(this.category);
                this.navCtrl.pop();
              }
            }
          ]
        });
        confirm.present();

      }

    });

  }

  isCategoryUsedByOthers(category): Promise<any> {
    return new Promise((resolve, reject) => {

      this.expensesService.existCategoryInExpenses(category.id).then(exist => {

        if (exist) {
          resolve(true);
        } else {

          this.budgetService.existCategoryInBudget(category.id).then(exist => {

            if (exist) {
              resolve(true);
            } else {

              this.savingsService.existCategoryInSavings(category.id).then(exist => {

                if (exist) {
                  resolve(true);
                } else {
                  resolve(false);
                }

              });
            }
          });
        }

      });
    });
  }

}


