import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

//Imports pages to Use
import { HomePage } from '../pages/home/home';
import { Dashboard } from '../pages/dashboard/dashboard';
import { Settings } from '../pages/settings/settings';
import { Login } from '../pages/login/login';
import { ListBudget } from '../pages/list-budget/list-budget';
import { ListCategory } from '../pages/list-category/list-category';
import { ListSavings } from '../pages/list-savings/list-savings';
import { UserProfile } from "./user-profile.model";

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

  rootPage: any = HomePage;

  private pages: Array<{ title: string, component: any, icon: string }>;
  userProfile: UserProfile;


  constructor(public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public events: Events,
    private expenseSqlService: ExpenseSqliteService,
    private categorySqlService: CategorySqliteService,
    private budgetSqlService: BudgetSqliteService,
    private savingeService: SavingSqliteService) {

    this.initializeApp();

    this.userProfile = {
      username: "",
      uid: "",
      photoURL: "",
      displayName: ""
    };

    // used for an example of ngFor and navigation
    this.pages = [

      { title: 'Dashboard', component: Dashboard, icon: 'analytics' },
      { title: 'Category', component: ListCategory, icon: 'cube' },
      { title: 'Transactions', component: HomePage, icon: 'pulse' },
      { title: 'Budgets', component: ListBudget, icon: 'card' },
      { title: 'Savings', component: ListSavings, icon: 'cash' }
      //   { title: 'Settings', component: Settings, icon: 'hammer' },
      // { title: 'Log Out', component: Login, icon: 'exit' }

    ];

    this.events.subscribe("userProfile:changed", userProfile => {
      if (userProfile !== undefined) {
        this.userProfile = userProfile;
      }
    });

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();

      this.expenseSqlService.openDataBase().then(self => {
        //TODO get the incomes
        self.getAll(null,null).then(data =>{
            if(data){
              self.getIncomes(null,null);
            }
        });
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
