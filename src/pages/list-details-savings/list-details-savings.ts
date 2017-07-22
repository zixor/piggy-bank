import { Component } from '@angular/core';
import { NavParams, AlertController } from 'ionic-angular';

import { DetailSavingModel } from "../../models/detailsaving.model";
import { SavingSqliteService } from '../../providers/savings.service.sqlite';

@Component({
  selector: 'page-list-details-savings',
  templateUrl: 'list-details-savings.html',
})
export class ListDetailsSavings {

private details: DetailSavingModel[] = [];
private savingId;

  constructor(
    private navParams: NavParams,
    private savingService: SavingSqliteService,
    private alertCtrl: AlertController) {     

    if(navParams.get("savingId")){
        this.savingId = navParams.get("savingId");
    }
    this.loadData();

  }

  loadData(){
    this.savingService.getDetailList(this.savingId).then(data => {
      this.details = data;
    });
  }

  ionViewDidLoad(){
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

  onTrash(detail:DetailSavingModel){
      let confirm = this.alertCtrl.create({
      title: 'Delete',
      message: `Are you sure you want to delete this transaction for this date and amount: "${detail.date}" "${detail.amount}"?`,
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
          }
        },
        {
          text: 'Confirm',
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
