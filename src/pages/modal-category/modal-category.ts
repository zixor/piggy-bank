import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

import { CategoryModel } from '../../app/category.model';

/**Imports services  */
import { CategorySqliteService } from '../../providers/category.service.sqlite';

@Component({
  selector: 'page-modal-category',
  templateUrl: 'modal-category.html',
})
export class ModalCategory {

  private categories: CategoryModel[] = [];

  constructor(    
    private categoryService: CategorySqliteService,
    private viewCtl: ViewController) {

    this.categoryService.getAll().then(data => {
      this.categories = data;
    });

  }

  ionViewDidLoad() {
    
  }

   onSelectedCategory(category) {
    this.viewCtl.dismiss(category);
  }

  closeModal(){
    this.viewCtl.dismiss();
  }

}
