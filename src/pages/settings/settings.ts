import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { TranslateService } from 'ng2-translate/ng2-translate';


@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class Settings {

  private language:string;

  constructor(public navCtrl: NavController,
   public navParams: NavParams,
   private  translate: TranslateService,) {
     this.setLanguage();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Settings');
  }

  setLanguage(){
    this.translate.use(this.language);
  }

}
