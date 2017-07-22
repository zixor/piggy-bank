import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';


@Component({
  selector: 'page-modal-colors',
  templateUrl: 'modal-colors.html',
})
export class ModalColors {


  private colors: string[];
  private selectedColor: string;

  constructor(private viewCtl: ViewController) {
    this.colors = ["warm-1", "warm-2", "warm-3", "warm-4", "warm-5", "warm-6",
      "warm-7", "warm-8", "warm-9", "warm-10", "warm-11", "warm-12",
      "warm-13", "warm-14", "warm-15", "warm-16", "warm-17", "warm-18",
      "warm-19", "warm-20"];
  }

  ionViewDidLoad() {
    
  }

  onSelectedColor(color) {
    this.viewCtl.dismiss(color);
  }


  closeModal() {
    this.viewCtl.dismiss(this.selectedColor);
  }

}
