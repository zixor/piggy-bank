import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

@Component({
  selector: 'page-datefilter',
  templateUrl: 'datefilter.html',
})
export class Datefilter {

  private filter = {
    initialDate: "",
    finalDate: ""
  }

  constructor(private viewCtl: ViewController) {

    let date = new Date();
    let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    let lastDayCurrentMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    this.filter.initialDate = new Date(firstDay).toISOString();
    this.filter.finalDate = new Date(lastDayCurrentMonth).toISOString();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Datefilter');
  }

  closeModal() {
    this.viewCtl.dismiss(this.filter);
  }

  onApply() {
    this.closeModal();
  }

}
