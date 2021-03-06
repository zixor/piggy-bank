import { Component } from '@angular/core';
import { NavController, Events, MenuController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { UserProfile } from "../../app/user-profile.model";
import { GooglePlus } from '@ionic-native/google-plus';
import { Facebook } from "@ionic-native/facebook";
import { AngularFireModule } from 'angularfire2';
import { ProfilePage } from '../profile/profile';
import firebase from 'firebase';
import { UtilitiesService } from "../../providers/utilities.service";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})

export class Login {

  userProfile: UserProfile;
  private password: string;
  private user: string;

  constructor(private navCtrl: NavController,
    private utilitiesService: UtilitiesService,
    private menu: MenuController,
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

  ionViewDidEnter() {
    this.menu.swipeEnable(false);
  }

  singIn() {
    try {
      if ((this.user == null || this.user == "") || this.user.length < 4 ||
        (this.password == null || this.password == "") || this.password.length < 7) {
        this.utilitiesService.showMessage("Error", "Usuario o Password no válido!");
      } else {
        firebase.auth().signInWithEmailAndPassword(this.user, this.password).then(response => {
          this.setUserProfile(response);
        }, err => {
          let msg;
          switch (err.code) { // SWITCH THE CODE RETURNED TO SEE WHAT MESSAGE YOU'LL DISPLAY
            case "auth/wrong-password":
              msg = "Email or Password is wrong.";
              break;

            case "auth/user-not-found":
              msg = 'User not found.'
              break;

            case "auth/invalid-email":
              msg = 'Email or Password is wrong.';
              break;
          }
          this.utilitiesService.showMessage("Error:", msg);
        });
      }
    } catch (error) {
      this.utilitiesService.showMessage("Error", error.message);
    }
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
          this.setUserProfile(response);
        })
    })
  }

  setUserProfile(response) {
    let self = this;
    if (response.uid) {
      self.userProfile.uid = response.uid;
      self.userProfile.photoURL = response.photoURL;
      self.userProfile.email = response.email;
      if (!response.displayName) {
        firebase.database().ref('/userProfile/' + response.uid).once('value').then(function (snapshot) {
          self.userProfile.displayName = snapshot.val().displayName
        });
      } else {
        self.userProfile.displayName = response.displayName;
      }
      window.localStorage.setItem('userProfile', JSON.stringify(self.userProfile));
      self.events.publish("userProfile:changed", self.userProfile);
      self.navCtrl.setRoot(HomePage);
    }
  }

  onCreateProfile() {
    this.navCtrl.setRoot(ProfilePage);
  }
}
