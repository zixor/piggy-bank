import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TranslateService } from 'ng2-translate/ng2-translate';

//Imports pages to Use
import { HomePage } from '../pages/home/home';
import { Dashboard } from '../pages/dashboard/dashboard';
import { Settings } from '../pages/settings/settings';
import { Login } from '../pages/login/login';
import { ListBudget } from '../pages/list-budget/list-budget';
import { ListCategory } from '../pages/list-category/list-category';
import { ListSavings } from '../pages/list-savings/list-savings';
import { UserProfile } from "./user-profile.model";
import { Credits } from '../pages/credits/credits';
import { UtilitiesService } from "../providers/utilities.service";

//imports services
import { ExpenseSqliteService } from '../providers/expense.service.sqlite';
import { CategorySqliteService } from '../providers/category.service.sqlite';
import { BudgetSqliteService } from '../providers/budget.service.sqlite';
import { SavingSqliteService } from '../providers/savings.service.sqlite';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = Login;

  private pages: Array<{ title: string, component: any, icon: string }>;
  userProfile: UserProfile;

  private DASHBOARD: string;
  private CATEGORY_TITLE: string;
  private TRANSACTIONS_TITLE: string;
  private BUDGETS: string;
  private SAVINGS: string;
  private CREDITS: string;
  private SETTINGS: string;


  constructor(public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public translate: TranslateService,
    public events: Events,
    private expenseSqlService: ExpenseSqliteService,
    private categorySqlService: CategorySqliteService,
    private budgetSqlService: BudgetSqliteService,
    private savingeService: SavingSqliteService,
    private utilitiesService: UtilitiesService) {

    this.translate.setDefaultLang("es");

    this.events.subscribe("constants:loaded", loaded => {
      if (loaded) {
        this.updateMenu();
      }
    });


    this.initializeApp();

    this.userProfile = {
      username: "",
      uid: "",
      photoURL: "",
      displayName: ""
    };


    this.events.subscribe("userProfile:changed", userProfile => {
      if (userProfile !== undefined) {
        this.userProfile = userProfile;
      }
    });

  }

  updateMenu() {
    
    this.initializeConstants();    

  }


  setMenuItems() {
    // used for an example of ngFor and navigation
    this.pages = [

      { title: this.DASHBOARD, component: Dashboard, icon: 'analytics' },
      { title: this.CATEGORY_TITLE, component: ListCategory, icon: 'cube' },
      { title: this.TRANSACTIONS_TITLE, component: HomePage, icon: 'pulse' },
      { title: this.BUDGETS, component: ListBudget, icon: 'card' },
      { title: this.SAVINGS, component: ListSavings, icon: 'cash' },
      { title: this.SETTINGS, component: Settings, icon: 'md-settings' },
      { title: this.CREDITS, component: Credits, icon: 'md-contact' }

    ];
  }


  initializeConstants() {

    this.utilitiesService.getValueByLanguaje("DASHBOARD").then(value => {
      this.DASHBOARD = value;
      this.setMenuItems();
    });
    this.utilitiesService.getValueByLanguaje("CATEGORY_TITLE").then(value => {
      this.CATEGORY_TITLE = value;
      this.setMenuItems();
    });
    this.utilitiesService.getValueByLanguaje("TRANSACTIONS_TITLE").then(value => {
      this.TRANSACTIONS_TITLE = value;
      this.setMenuItems();
    });
    this.utilitiesService.getValueByLanguaje("BUDGETS").then(value => {
      this.BUDGETS = value;
      this.setMenuItems();
    });
    this.utilitiesService.getValueByLanguaje("SAVINGS").then(value => {
      this.SAVINGS = value;
      this.setMenuItems();
    });
    this.utilitiesService.getValueByLanguaje("CREDITS").then(value => {
      this.CREDITS = value;
      this.setMenuItems();
    });
    this.utilitiesService.getValueByLanguaje("SETTINGS").then(value => {
      this.SETTINGS = value;
      this.setMenuItems();
    });

  }    

  initializeApp() {
    this.platform.ready().then(() => {

      this.initializeConstants();

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();

      this.expenseSqlService.openDataBase().then(self => {
        let arrDates = this.utilitiesService.getInitialRangeOfDates();
        self.getAll(arrDates[0], arrDates[1]);
        this.events.publish("constants:loaded", true);
        this.categorySqlService.openDataBase().then(data => {
          this.budgetSqlService.openDataBase().then(data => {
            this.savingeService.openDataBase().then(data => {
              setTimeout(() => {
                this.splashScreen.hide();
              }, 100);
            });
          });
        });
      });

    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  closeSession() {
    window.localStorage.removeItem("userProfile");
    this.nav.push(HomePage);
  }
}
