import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { SavingModel } from "../../models/saving.model";
import { DetailSavingModel } from "../../models/detailsaving.model";
import { Savings } from '../savings/savings';
import { ListDetailsSavings } from '../list-details-savings/list-details-savings';
import { UtilitiesService } from '../../providers/utilities.service';

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

  private SAVE: string;
  private GREAT: string;
  private CANCEL: string;
  private DELETE: string;
  private AMOUNT: string;
  private CONFIRM: string;
  private INCOMING: string;
  private WITHDRAWALS: string;
  private QUESTION_DELETE_SAVING: string;
  private JUSTIFICATION: string;
  private MOVEMENT_CREATED: string;
  private AMOUNT_TO_WITHDRAW: string;
  private AMOUNT_TO_CONSIGN: string;

  constructor(private navCtrl: NavController,
    private savingService: SavingSqliteService,
    private categoryService: CategorySqliteService,
    private utilitiesService: UtilitiesService,
    private alertCtrl: AlertController) {

    this.initializeConstants();
    this.loadData();

  }

  ionViewWillEnter() {
    this.loadData();
  }


  initializeConstants() {

    this.utilitiesService.getValueByLanguaje("INCOMING").then(value => {
      this.INCOMING = value;
    });
    this.utilitiesService.getValueByLanguaje("WITHDRAWALS").then(value => {
      this.WITHDRAWALS = value;
    });
    this.utilitiesService.getValueByLanguaje("SAVE").then(value => {
      this.SAVE = value;
    });
    this.utilitiesService.getValueByLanguaje("QUESTION_DELETE_SAVING").then(value => {
      this.QUESTION_DELETE_SAVING = value;
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
    this.utilitiesService.getValueByLanguaje("AMOUNT").then(value => {
      this.AMOUNT = value;
    });
    this.utilitiesService.getValueByLanguaje("JUSTIFICATION").then(value => {
      this.JUSTIFICATION = value;
    });
    this.utilitiesService.getValueByLanguaje("MOVEMENT_CREATED").then(value => {
      this.MOVEMENT_CREATED = value;
    });
    this.utilitiesService.getValueByLanguaje("AMOUNT_TO_WITHDRAW").then(value => {
      this.AMOUNT_TO_WITHDRAW = value;
    });
    this.utilitiesService.getValueByLanguaje("AMOUNT_TO_CONSIGN").then(value => {
      this.AMOUNT_TO_CONSIGN = value;
    });
    this.utilitiesService.getValueByLanguaje("GREAT").then(value => {
      this.GREAT = value;
    });

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
      title: this.DELETE,
      message: this.QUESTION_DELETE_SAVING + " " + saving.description + "?",
      buttons: [
        {
          text: this.CANCEL,
          handler: () => {
          }
        },
        {
          text: this.CONFIRM,
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
      title: this.INCOMING,
      message: this.AMOUNT_TO_CONSIGN,
      inputs: [
        {
          type: 'number',
          name: 'amount',
          placeholder: this.AMOUNT
        },
      ],
      buttons: [
        {
          text: this.CANCEL,
          handler: data => { }
        },
        {
          text: this.SAVE,
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
      title: this.WITHDRAWALS,
      message: this.AMOUNT_TO_WITHDRAW,
      inputs: [
        {
          type: 'number',
          name: 'amount',
          placeholder: this.AMOUNT
        },
        {
          type: 'text',
          name: 'justification',
          placeholder: this.JUSTIFICATION
        },
      ],
      buttons: [
        {
          text: this.CANCEL,
          handler: data => { }
        },
        {
          text: this.SAVE,
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
      title: this.GREAT,
      subTitle: this.MOVEMENT_CREATED,
      buttons: ['OK']
    });
    alert.present();
    this.loadData();
  }

}
