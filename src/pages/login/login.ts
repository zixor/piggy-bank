import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HomePage } from '../home/home';

import { GooglePlus } from '@ionic-native/google-plus';
import { Facebook } from "@ionic-native/facebook";
import { AngularFireModule } from 'angularfire2';
import firebase from 'firebase';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})

export class Login {

  constructor(private navCtrl: NavController,
    private googlePlus: GooglePlus,
    private facebook: Facebook) {
  }

  singIn() {
    this.navCtrl.setRoot(HomePage);
  }


  onGoogleLogin() {
    this.googlePlus.login({
      'webClientId': '346822450290-d1itoic036psigphe0neql4a3tg8quno.apps.googleusercontent.com',
      'offline': true
    }).then(res => {
      firebase.auth().signInWithCredential(firebase.auth.GoogleAuthProvider.credential(res.idToken))
        .then(response => {
          console.log(response);
          alert("Login Success");
        }).catch(ns => {
          alert("Not Login Success");
        })
    });
  }

  onFacebookLogin() {
    //this.facebook.login(['name','email','gender','picture','birthday']).then(response => {
      this.facebook.login(['email']).then(response => {
      const fc = firebase.auth.FacebookAuthProvider.credential(response.authResponse.accessToken)
      firebase.auth().signInWithCredential(fc).then(response => {       
        console.log(response);
        alert("firebase sec")
      }).catch(ferr => {
        alert("Error")
      })
    }).catch(err => {
      alert(JSON.stringify(err));
    });
  }

}
