import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { CategoryModel } from '../../app/category.model';
import { Category } from '../category/category';

/**Imports services  */
import { CategorySqliteService } from '../../providers/category.service.sqlite';
import { ExpenseSqliteService } from '../../providers/expense.service.sqlite';
import { SavingSqliteService } from '../../providers/savings.service.sqlite';
import { BudgetSqliteService } from '../../providers/budget.service.sqlite';



@Component({
  selector: 'page-list-category',
  templateUrl: 'list-category.html',
})
export class ListCategory {

  private categories: CategoryModel[] = [];

  constructor(private navCtrl: NavController,
    private categoryService: CategorySqliteService,
    private expensesService: ExpenseSqliteService,
    private savingsService: SavingSqliteService,
    private budgetService: BudgetSqliteService,
    private alertCtrl: AlertController) {

    this.loadData();

  }

  loadData() {
    this.categoryService.getAll().then(data => {
      this.categories = data;
    });
  }


  ionViewWillEnter() {
    this.loadData();
  }
  
  ionViewDidLoad() {
    this.loadData();
  }

  onAddClick() {
    this.navCtrl.push(Category);
  }

  editCategory(category) {
    this.navCtrl.push(Category, {
      category: category
    });
  }


  doRefresh(refresher) {
    this.categoryService.getAll()
      .then(data => {
        this.categories = data;
        refresher.complete();
      })
      .catch(e => console.log(e));
  }

  onTrash(category) {

    this.isCategoryUsedByOthers(category).then(exist => {

      if (exist) {

        let alert = this.alertCtrl.create({
          title: 'Category can´t be deleted!',
          subTitle: 'Because it is being used by other modules!',
          buttons: ['OK']
        });
        alert.present();

      } else {

        let confirm = this.alertCtrl.create({
          title: 'Delete',
          message: `Are you sure you want to delete this category: "${category.description}"?`,
          buttons: [
            {
              text: 'Cancel',
              handler: () => {
              }
            },
            {
              text: 'Confirm',
              handler: () => {
                this.categoryService.delete(category);
                this.loadData();
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
