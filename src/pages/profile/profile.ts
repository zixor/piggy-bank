import { Component } from '@angular/core';
import { NavController, NavParams, Loading } from 'ionic-angular';
import { AngularFireModule } from 'angularfire2';
import { HomePage } from '../home/home';
import firebase from 'firebase';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  private profile;
  private refresher;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.profile = {
      uid: "",
      name: "",
      email: "",
      password: "",
      repeatpassword: "",
    };
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  doRefresh(refresher) {
    this.refresher = refresher;
  }

  createProfile() {
    firebase.auth().createUserWithEmailAndPassword(this.profile.email, this.profile.password)
      .then(user => {
        this.setProfile(user.uid);

        this.navCtrl.push(HomePage);

      }, (error) => {
        console.error(error);
      });
  }

  setProfile(uid) {
    firebase
      .database()
      .ref('/userProfile')
      .child(uid)
      .set({ name: this.profile.name, email: this.profile.email });
  }

}
