import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import * as moment from 'moment';

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

      let initialDate = moment(this.filter.initialDate).utcOffset(0);
      initialDate.set({hour:0,minute:0,second:0,millisecond:0})

      let finalDate = moment(this.filter.finalDate).utcOffset(0);
      finalDate.set({hour:23,minute:59,second:59,millisecond:0})

      this.filter.initialDate = initialDate.toISOString();
      this.filter.finalDate = finalDate.toISOString();      

    this.closeModal();
  }

}
