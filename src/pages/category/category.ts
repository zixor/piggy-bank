import { Component } from '@angular/core';
import { ModalController, NavController, NavParams, AlertController } from 'ionic-angular';
import { CategoryModel } from '../../app/category.model';
import { ModalColors } from '../modal-colors/modal-colors';
import { ModalIcons } from '../modal-icons/modal-icons';

/**Import services  */
import { CategorySqliteService } from '../../providers/category.service.sqlite';


@Component({
  selector: 'page-category',
  templateUrl: 'category.html',
})
export class Category {

  private category: CategoryModel;
  constructor(private navCtrl: NavController,
    private navParams: NavParams,
    private modalCtl: ModalController,
    private categoryService: CategorySqliteService,
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
  }

  ionViewDidLoad() {

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
    let confirm = this.alertCtrl.create({
      title: 'Delete',
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



}
