import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HomePage } from '../home/home';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})

export class Login {

  constructor(private navCtrl: NavController) {
  }

  singIn() {
    this.navCtrl.setRoot(HomePage);
  }
  
  /*
      onGoogleLogin() {
      let self = this;
      this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider)
        .then(function (response) {
          console.log(response);
          let userProfile = {
            username: response.user.email,
            uid: response.user.uid,
            photoUrl: response.user.photoURL,
            displayName: response.user.displayName
          };
          self.events.publish("userProfile:changed", userProfile);
          window.localStorage.setItem('userProfile', JSON.stringify(userProfile));
          self.navCtrl.setRoot(HomePage);
        })
        .catch(e => console.log(e));
      }*/

}
