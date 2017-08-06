
//Utilities
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { File } from '@ionic-native/file';
import { Transfer } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
import { StatusBar } from '@ionic-native/status-bar';
import { ProgressBarComponent } from '../components/progress-bar/progress-bar';
import { SocialSharing } from '@ionic-native/social-sharing';
import { EmailComposer } from '@ionic-native/email-composer';
import { SQLite } from '@ionic-native/sqlite';
import { CurrencyPipe, DatePipe } from '@angular/common';

//Services
import { ExpenseSqliteService } from '../providers/expense.service.sqlite';
import { CategorySqliteService } from '../providers/category.service.sqlite';
import { BudgetSqliteService } from '../providers/budget.service.sqlite';
import { UtilitiesService } from '../providers/utilities.service';
import { SavingSqliteService } from '../providers/savings.service.sqlite';

//pages
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { Detail } from '../pages/detail/detail';
import { Login } from '../pages/login/login';
import { ListCategory } from '../pages/list-category/list-category';
import { Category } from '../pages/category/category';
import { ModalColors } from '../pages/modal-colors/modal-colors';
import { ModalIcons } from '../pages/modal-icons/modal-icons';
import { ModalCategory } from '../pages/modal-category/modal-category';
import { ListBudget } from '../pages/list-budget/list-budget';
import { Budget } from '../pages/budget/budget';
import { Calculator } from '../pages/calculator/calculator';
import { Datefilter } from '../pages/datefilter/datefilter';
import { ListSavings } from '../pages/list-savings/list-savings';
import { Savings } from '../pages/savings/savings';
import { Dashboard } from '../pages/dashboard/dashboard';
import { Settings } from '../pages/settings/settings';
import { ListDetailsSavings } from '../pages/list-details-savings/list-details-savings';



@NgModule({
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  declarations: [
    MyApp,
    HomePage,
    Detail,
    Login,
    Dashboard,
    Settings,
    ListCategory,
    ListBudget,
    Budget,
    Category,
    ModalColors,
    ModalIcons,
    ModalCategory,
    ProgressBarComponent,
    Calculator,
    Datefilter,
    ListSavings,
    Savings,
    ListDetailsSavings
  ],
  entryComponents: [
    MyApp,
    HomePage,
    Detail,
    Login,
    Dashboard,
    Settings,
    ListCategory,
    ListBudget,
    Budget,
    Category,
    ModalColors,
    ModalIcons,
    ModalCategory,
    Calculator,
    Datefilter,
    ListSavings,
    Savings,
    ListDetailsSavings
  ],
  providers: [
    ExpenseSqliteService,
    CategorySqliteService,
    BudgetSqliteService,
    SavingSqliteService,
    UtilitiesService,
    SocialSharing,
    EmailComposer,
    StatusBar,
    SplashScreen,
    CurrencyPipe,
    DatePipe,
    SQLite,
    File,
    Transfer,
    Camera,
    FilePath,
    ImagePicker,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ],
  bootstrap: [IonicApp]
})
export class AppModule { }

/*Expense Tracker repository 
for the correct operation of this project you must use the folllowing dependecies:
1. node v6.10.3
2. python v2.7.10
3. git v.2.13.0.windows.1
*/