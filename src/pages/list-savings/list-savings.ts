import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { SavingModel } from "../../models/saving.model";
import { DetailSavingModel } from "../../models/detailsaving.model";
import { Savings } from '../savings/savings';
import { ListDetailsSavings } from '../list-details-savings/list-details-savings';

/**Imports services  */
import { SavingSqliteService } from '../../providers/savings.service.sqlite';
import { CategorySqliteService } from '../../providers/category.service.sqlite';

import * as moment from 'moment';

@Component({
  selector: 'page-list-savings',
  templateUrl: 'list-savings.html',
})
export class ListSavings {

  private savings: SavingModel[] = [];

  constructor(private navCtrl: NavController,
    private savingService: SavingSqliteService,
    private categoryService: CategorySqliteService,
    private alertCtrl: AlertController) {

    this.loadData();

  }

  ionViewWillEnter() {
    this.loadData();
  }

  loadData() {
    let arrSavings = [];
    this.savingService.getAll().then(data => {
      if (data) {
        data.forEach(data => {

          let saving = data;
          let incomings = 0;
          let withdraws = 0;

          this.savingService.getDetailList(saving.id).then(data => {
            if (data) {
              data.forEach(detail => {
                if (detail.type == "1") {
                  incomings += detail.amount;
                } else {
                  withdraws += detail.amount;
                }
              });
              saving.cumulated = incomings - withdraws;
              saving.percentage = ((saving.cumulated * 100) / saving.amount).toString().substr(0, 5);
            }
          });

          this.categoryService.getCategory(saving.category)
            .then(category => {
              saving.category = category;
            });

          arrSavings.push(saving);

        });
      }
    });
    this.savings = arrSavings;
  }

  ionViewDidLoad() {
    this.loadData();
  }

  onAddClick() {
    this.navCtrl.push(Savings);
  }

  onClickSaving(saving: SavingModel) {
    this.navCtrl.push(Savings, {
      saving: saving
    });
  }


  doRefresh(refresher) {

    let arrSavings = [];
    this.savingService.getAll().then(data => {
      if (data) {
        data.forEach(data => {

          let saving = data;
          let incomings = 0;
          let withdraws = 0;

          this.savingService.getDetailList(saving.id).then(data => {
            if (data) {
              data.forEach(detail => {
                if (detail.type == "1") {
                  incomings += detail.amount;
                } else {
                  withdraws += detail.amount;
                }
              });
              saving.cumulated = incomings - withdraws;
              saving.percentage = ((saving.cumulated * 100) / saving.amount).toString().substr(0, 5);
            }
          });

          this.categoryService.getCategory(saving.category)
            .then(category => {
              saving.category = category;
            });

          arrSavings.push(saving);

        });
      }
      refresher.complete();
    })
      .catch(e => console.log(e));

    this.savings = arrSavings;

  }

  onTrash(saving: SavingModel) {
    let confirm = this.alertCtrl.create({
      title: 'Delete',
      message: `Are you sure you want to delete this saving: "${saving.description}"?`,
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
          }
        },
        {
          text: 'Confirm',
          handler: () => {
            this.savingService.delete(saving);
            this.loadData();
          }
        }
      ]
    });
    confirm.present();
  }

  showDetails(saving) {
    this.navCtrl.push(ListDetailsSavings, { savingId: saving.id, cumulated: saving.cumulated });
  }

  makeIncoming(savingId) {
    let prompt = this.alertCtrl.create({
      title: 'Incoming',
      message: "Plese enter the amount to be Consigned.",
      inputs: [
        {
          type: 'number',
          name: 'amount',
          placeholder: 'Amount'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => { }
        },
        {
          text: 'Save',
          handler: data => {

            let detail: DetailSavingModel = {
              savingid: savingId,
              date: moment(new Date().toISOString()).format(),
              type: "1",
              amount: data.amount
            };
            this.savingService.addDetail(detail).then(data => {
              this.showAlert();
            });
          }
        }
      ]
    });
    prompt.present();
  }

  makeWithDraw(savingId) {
    let prompt = this.alertCtrl.create({
      title: 'Withdraw',
      message: "Please enter the amount to Withdraw.",
      inputs: [
        {
          type: 'number',
          name: 'amount',
          placeholder: 'Amount'
        },
        {
          type: 'text',
          name: 'justification',
          placeholder: 'Justification'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => { }
        },
        {
          text: 'Save',
          handler: data => {
            let detail: DetailSavingModel = {
              savingid: savingId,
              justification: data.justification,
              date: moment(new Date().toISOString()).format(),
              type: "2",
              amount: data.amount
            };
            this.savingService.addDetail(detail).then(data => {
              this.showAlert();
            });
          }
        }
      ]
    });
    prompt.present();
  }

  showAlert() {
    let alert = this.alertCtrl.create({
      title: 'Well Done!',
      subTitle: 'Your movement was create!',
      buttons: ['OK']
    });
    alert.present();
    this.loadData();
  }

}
