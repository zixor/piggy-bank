import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { BudgetModel } from '../models/Budget.model';


@Injectable()
export class BudgetSqliteService {

  private dbConfig = { name: 'data.db', location: 'default' };
  private sqlObject: SQLiteObject;

  constructor(private sqlite: SQLite) {

  }

  openDataBase() {
    return this.sqlite.create(this.dbConfig).then((db: SQLiteObject) => {
      this.sqlObject = db;
      this.createTable();
    });
  }

  createTable() {
    let sql = 'CREATE TABLE IF NOT EXISTS budget(id INTEGER PRIMARY KEY AUTOINCREMENT, initialDate TEXT, finalDate TEXT, amount REAL, category TEXT)';
    this.sqlObject.executeSql(sql, {})
      .then(() => console.log('SQL Budgets Initialized'))
      .catch(e => console.log(e));

  }

  delete(budget: any) {

    let sql = 'DELETE FROM budget WHERE id=?';
    this.sqlObject.executeSql(sql, [budget.id]);

  }

  getAll(initialDate: string, finalDate: string, category: string): Promise<any> {

    let budgets = [];
    let params = [];

    let sql = "select * from budget ";
    let orderBy = " order by initialDate desc ";
    let conditional = "";

    if (initialDate != null && finalDate != null) {
      conditional += " initialDate >= ? and finalDate <= ? "
      params = [initialDate, finalDate];
    }

    if (category != null) {

      if (conditional.length > 0) {
        conditional += " and ";
      }

      conditional += " category = ? ";
      params.push(category);

    }

    if (params.length > 0) {
      conditional = " where " + conditional;
    }

    sql = sql + conditional + orderBy;

    return new Promise((resolve, reject) => {
      this.sqlObject.executeSql(sql, params)
        .then(response => {
          for (let index = 0; index < response.rows.length; index++) {
            let record = response.rows.item(index);
            if (record) {
              budgets.push(record);
            }
          }
          resolve(budgets);
        })
        .catch(e => reject(e));
    });

  }


  getBudgetByDateExpenseAndCategory(dateExpense: string, category: string): Promise<any> {

    let budgets = [];
    let params = [];

    let sql = "select * from budget where ? between initialDate and finalDate and category = ? ";
    params = [dateExpense, category];

    return new Promise((resolve, reject) => {
      this.sqlObject.executeSql(sql, params)
        .then(response => {
          for (let index = 0; index < response.rows.length; index++) {
            let record = response.rows.item(index);
            if (record) {
              budgets.push(record);
            }
          }
          resolve(budgets);
        })
        .catch(e => reject(e));
    });


  }


  update(budget: BudgetModel) {

    let sql = 'UPDATE budget SET initialDate = ?, finalDate = ?, amount= ?, category = ? WHERE id=?';
    this.sqlObject.executeSql(sql, [budget.initialDate, budget.finalDate, budget.amount, budget.category, budget.id]);

  }

  add(budget: BudgetModel) {
    return new Promise((resolve, reject) => {
      let sql = 'insert into budget ( initialDate, finalDate, amount, category ) values ( ?,?,?,? )';
      this.sqlObject.executeSql(sql, [budget.initialDate, budget.finalDate, budget.amount, budget.category])
        .then(response => {
          resolve(response);
        })
        .catch(e => console.log(e));
    });
  }

  existCategoryInBudget(idcategory: number): Promise<any> {
    let exist = false;
    return new Promise((resolve, reject) => {
      let sql = 'SELECT * from budget  where category = ? LIMIT 1';
      this.sqlObject.executeSql(sql, [idcategory])
        .then(response => {
          if (response.rows.length == 1) {
            exist = true;
          }
          resolve(exist);
        })
        .catch(e => console.log(e));
    });

  }

  closeConnection() {
    this.sqlObject.close();
  }


}
