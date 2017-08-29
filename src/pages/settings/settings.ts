import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { TranslateService } from 'ng2-translate/ng2-translate';


@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class Settings {

  private language: string;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public events: Events,
    private translate: TranslateService, ) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Settings');
  }

  onChangeLanguage() {

    this.translate.use(this.language);    
    this.events.publish("constants:loaded", true);

  }

}
