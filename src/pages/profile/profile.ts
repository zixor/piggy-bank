import { Component } from '@angular/core';
import { NavController, NavParams, Loading, MenuController } from 'ionic-angular';
import { AngularFireModule } from 'angularfire2';
import { HomePage } from '../home/home';
import firebase from 'firebase';
import { UtilitiesService } from "../../providers/utilities.service";

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  private profile: any;
  private refresher;

  constructor(private navCtrl: NavController,
    private navParams: NavParams,
    private menu: MenuController,
    private utilitiesService: UtilitiesService) {
    this.profile = {
      uid: "",
      name: "",
      email: "",
      password: "",
      repeatpassword: "",
    };
  }

  ionViewDidLeave() {
    this.menu.swipeEnable(true);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  doRefresh(refresher) {
    this.refresher = refresher;
  }

  createProfile() {
    if (this.validateForm()) {
      firebase.auth().createUserWithEmailAndPassword(this.profile.email, this.profile.password)
        .then(user => {
          this.setProfile(user.uid);
          this.navCtrl.push(HomePage);
        })
        .catch(e => {
          this.utilitiesService.showMessage("Error", e.message);
        });
    }
  }

  setProfile(uid) {
    firebase
      .database()
      .ref('/userProfile')
      .child(uid)
      .set({ name: this.profile.name, email: this.profile.email });
  }

  validateForm() {
    if (this.profile.password != this.profile.repeatpassword) {
      this.utilitiesService.showMessage("Error", "El Password no coincide!");
      return false;
    } else if (this.profile.name == "" || this.profile.name.length < 4) {
      this.utilitiesService.showMessage("Error", "Longitud mínima para el Nombre son 4 caracteres!");
      return false;
    } else if (this.profile.password == "" || this.profile.password.length < 7) {
      this.utilitiesService.showMessage("Error", "Longitud mínima para el Password es 7 caracteres!");
      return false;
    } else if (this.profile.email.indexOf("@") == -1) {
      return false;
    }
    return true;
  }

}
