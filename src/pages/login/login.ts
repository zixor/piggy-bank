import { Component } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { HomePage } from '../home/home';
import { UserProfile } from "../../app/user-profile.model";

import { GooglePlus } from '@ionic-native/google-plus';
import { Facebook } from "@ionic-native/facebook";
import { AngularFireModule } from 'angularfire2';
import firebase from 'firebase';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})

export class Login {

  userProfile: UserProfile;

  constructor(private navCtrl: NavController,
    private googlePlus: GooglePlus,
    private facebook: Facebook,
    public events: Events) {

    this.userProfile = {
      username: "",
      uid: "",
      photoURL: "",
      displayName: "",
      email: ""
    };

  }

  singIn() {
    this.navCtrl.setRoot(HomePage);
  }


  onGoogleLogin() {
    /* this.googlePlus.login({
       'webClientId': '354841706808-jrttgjnfcque0v0un4de7n7p23o3olvi.apps.googleusercontent.com',
       'offline': true
     }).then(res => {
       console.log(res);
       firebase.auth().signInWithCredential(firebase.auth.GoogleAuthProvider.credential(res.idToken))
         .then(response => {
           console.log(response);
           alert("Login Success");
         }).catch(error => console.log("Firebase failure: " + JSON.stringify(error)));
     }).catch(err => console.error("Error: ", err));*/
  }

  onFacebookLogin() {
    let self = this;
    this.facebook.login(['email']).then(response => {
      const facebookCredential = firebase.auth.FacebookAuthProvider.credential(response.authResponse.accessToken);
      firebase.auth().signInWithCredential(facebookCredential)
        .then(response => {

          self.userProfile.uid = response.uid;
          self.userProfile.displayName = response.displayName;
          self.userProfile.photoURL = response.photoURL;
          self.userProfile.email = response.email;

          self.events.publish("userProfile:changed", self.userProfile);
          window.localStorage.setItem('userProfile', JSON.stringify(self.userProfile));
          self.navCtrl.setRoot(HomePage);


          console.log("Firebase success: " + JSON.stringify(response));
        });

    });
  }
  /* this.facebook.login(['email']).then(response => {
     const fc = firebase.auth.FacebookAuthProvider.credential(response.authResponse.accessToken)
     firebase.auth().signInWithCredential(fc).then(response => {

       console.log(response);

       self.userProfile.uid = response.uid;
       self.userProfile.displayName = response.displayName;
       self.userProfile.photoURL = response.photoURL;
       self.userProfile.email = response.email;

       self.events.publish("userProfile:changed", self.userProfile);
       window.localStorage.setItem('userProfile', JSON.stringify(self.userProfile));
       self.navCtrl.setRoot(HomePage);

     }).catch(ferr => {
       alert("Error")
     })
   }).catch(err => {
     alert(JSON.stringify(err));
   });
 }*/

}
