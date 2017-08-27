import { Component } from '@angular/core';
import { NavParams, AlertController } from 'ionic-angular';

import { UtilitiesService } from '../../providers/utilities.service';
import { DetailSavingModel } from "../../models/detailsaving.model";
import { SavingSqliteService } from '../../providers/savings.service.sqlite';

@Component({
  selector: 'page-list-details-savings',
  templateUrl: 'list-details-savings.html',
})
export class ListDetailsSavings {

  private details: DetailSavingModel[] = [];
  private savingId;
  private cumulated;

  private DELETE: string;
  private CANCEL: string;
  private CONFIRM: string;
  private DELETE_TRANSACTION_FOR_DATE_AMOUNT: string;

  constructor(
    private navParams: NavParams,
    private savingService: SavingSqliteService,
    private utilitiesService: UtilitiesService,
    private alertCtrl: AlertController) {

    if (navParams.get("savingId")) {
      this.savingId = navParams.get("savingId");
      this.cumulated = navParams.get("cumulated");
    }
    this.initializeConstants();
    this.loadData();

  }


  initializeConstants() {

    this.utilitiesService.getValueByLanguaje("DELETE_TRANSACTION_FOR_DATE_AMOUNT").then(value => {
      this.DELETE_TRANSACTION_FOR_DATE_AMOUNT = value;
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

  }

  loadData() {
    this.savingService.getDetailList(this.savingId).then(data => {
      this.details = data;
    });
  }

  ionViewDidLoad() {
    this.loadData();
  }

  doRefresh(refresher) {
    this.savingService.getDetailList(this.savingId)
      .then(data => {
        this.details = data;
        refresher.complete();
      })
      .catch(e => console.log(e));
  }

  onTrash(detail: DetailSavingModel) {
    let confirm = this.alertCtrl.create({
      title: this.DELETE,
      message: this.DELETE_TRANSACTION_FOR_DATE_AMOUNT + " " + detail.date + "" + detail.amount + " ? ",
      buttons: [
        {
          text: this.CANCEL,
          handler: () => {
          }
        },
        {
          text: this.CONFIRM,
          handler: () => {
            this.savingService.deleteDetail(detail);
            this.loadData();
          }
        }
      ]
    });
    confirm.present();
  }

}
