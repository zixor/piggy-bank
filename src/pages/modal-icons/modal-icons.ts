import { Component } from "@angular/core";
import { ViewController } from "ionic-angular";


@Component({
  selector: "page-modal-icons",
  templateUrl: "modal-icons.html",
})
export class ModalIcons {

  private icons: string[];
  private selectedIcon: string;

  constructor(private viewCtl: ViewController) {
    this.icons = ["game-controller-b", "pizza", "bus", "medkit", "plane", "musical-note",
      "logo-playstation", "leaf", "alarm", "analytics", "american-football",
      "logo-android", "logo-apple", "at", "attach", "basketball", "basket",
      "beer", "bicycle", "bonfire", "bookmarks", "bowtie", "brush", "car",
      "contacts", "cut", "flash", "football", "headset", "heart-outline",
      "home", "ice-cream", "images", "paw", "school", "rose", "shirt", "logo-snapchat",
      "stats", "train", "watch", "wine", "body", "build", "cafe"];
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad ModalIcons");
  }

  onSelectedIcon(icon) {
    this.viewCtl.dismiss(icon);
  }


  closeModal() {
    this.viewCtl.dismiss(this.selectedIcon);
  }
}
