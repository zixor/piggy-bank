import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import { Calculator } from '../calculator/calculator';
import { ModalCategory } from '../modal-category/modal-category';
import { CategoryModel } from '../../models/category.model';
import { SavingModel } from '../../models/saving.model';

import { SavingSqliteService } from '../../providers/savings.service.sqlite';


@Component({
  selector: 'page-savings',
  templateUrl: 'savings.html',
})
export class Savings {

  private saving: SavingModel;
  private category: CategoryModel;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private modalCtl: ModalController,
    private alertCtrl: AlertController,
    private savingService: SavingSqliteService) {


    const saving: SavingModel = this.navParams.get('saving');
    if (saving) {

      this.saving = saving;
      this.category = saving.category;

    } else {

      this.category = {
        name: "",
        description: "",
        icon: "help",
        color: "light"
      };

      this.saving = {
        category: this.category,
        description: "",
        goaldate: new Date().toISOString(),
        amount: 0,
        creationDate: new Date().toString()
      }

    }

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Savings');
  }
 

  openCalc() {

    const modal = this.modalCtl.create(Calculator);
    modal.present();

    modal.onDidDismiss(value => {
      if (value) {
        this.saving.amount = value;
      }
    });
  }

  openModalCategory() {
    const modal = this.modalCtl.create(ModalCategory);
    modal.present();

    modal.onDidDismiss(category => {
      if (category) {
        this.category = category;
        this.saving.category = this.category;
      }
    });
  }

  onSave() {
    if (this.saving.id) {
      this.savingService.update(this.saving);
    } else {
      this.savingService.add(this.saving).then();
    }
    this.navCtrl.pop();
  }

  onTrash() {
    let confirm = this.alertCtrl.create({
      title: 'Delete',
      message: `Are you sure you want to delete this saving: "${this.saving.description}"?`,
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
          }
        },
        {
          text: 'Confirm',
          handler: () => {
            this.savingService.delete(this.saving);
            this.navCtrl.pop();
          }
        }
      ]
    });
    confirm.present();
  }

}
