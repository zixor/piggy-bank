import { Component } from '@angular/core';
import { NavController, NavParams, Loading, MenuController, Events } from 'ionic-angular';
import { AngularFireModule } from 'angularfire2';
import { HomePage } from '../home/home';
import firebase from 'firebase';
import { UtilitiesService } from "../../providers/utilities.service";
import { UserProfile } from "../../app/user-profile.model";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  private refresher;
  private profile: any;
  private userData:any[] = [];
  private frmRegister: FormGroup;
  private userProfile: UserProfile;

  constructor(private navCtrl: NavController,
    private utilitiesService: UtilitiesService,
    private menu: MenuController,
    private navParams: NavParams,
    private events: Events,
    private fb: FormBuilder) {
    this.profile = {
      uid: "",
      name: "",
      email: "",
      password: "",
      repeatpassword: "",
    };

    this.frmRegister = this.fb.group({
      name:[this.userData['name'],[Validators.required,Validators.minLength(4)]],      
      email:[this.userData['email'],[Validators.required,Validators.email]],
      password:[this.userData['password'],[Validators.required, Validators.minLength(7)]]
    });
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
          this.navCtrl.setRoot(HomePage,{'fromProfile' : true});
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
      .set({ displayName: this.profile.name, email: this.profile.email });
    this.userProfile.uid = uid;
    this.userProfile.displayName = this.profile.name;
    this.userProfile.photoURL = "";
    this.userProfile.email = this.profile.email;
    window.localStorage.setItem('userProfile', JSON.stringify(this.userProfile));
    this.events.publish("userProfile:changed", this.userProfile);
  }

  validateForm() {
    if (this.profile.name == "" || this.profile.name.length < 4) {
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
