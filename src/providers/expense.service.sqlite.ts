import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Expense } from '../app/expense.model';
import { CategorySqliteService } from './category.service.sqlite';
import { Events } from 'ionic-angular';

@Injectable()
export class ExpenseSqliteService {

  private dbConfig = { name: 'data.db', location: 'default' };
  private sqlObject: SQLiteObject;

  constructor(private sqlite: SQLite,
    private events: Events,
    private categoryService: CategorySqliteService) {

  }

  openDataBase(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.sqlite.create(this.dbConfig).then((db: SQLiteObject) => {
        this.sqlObject = db;
        this.createTable();
        //README return the service instance in order to execute the findall and register the event        
        resolve(this);
      });
    });
  }

  createTable() {
    let sql = 'CREATE TABLE IF NOT EXISTS expense(id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT, amount REAL, category TEXT, description TEXT, image TEXT, incoming TEXT)';
    this.sqlObject.executeSql(sql, {})
      .then(() => console.log('SQL Expenses Initialized'))
      .catch(e => console.log(e));

  }

  delete(expense: Expense) {

    let sql = 'DELETE FROM expense WHERE id=?';
    this.sqlObject.executeSql(sql, [expense.id]);

  }

  getAll(initialDate: string, finalDate: string): Promise<any> {

    let expenses = [];
    let sql = 'SELECT * FROM expense ';
    let conditional = "";
    let params = [];
    let totalIncomes = 0;
    let totalExpenses = 0;
    let expense = { "totalExpenses": 0, "totalIncomes": 0, "balance": 0, "expenses": [] };

    if (initialDate != null && finalDate != null) {
      conditional += " date between ? and ? ";
      params = [initialDate, finalDate];
    }

    sql += " where " + conditional + " order by date desc ";

    if (this.sqlObject) {
      return new Promise((resolve, reject) => {
        this.sqlObject.executeSql(sql, params)
          .then(response => {
            for (let index = 0; index < response.rows.length; index++) {

              let expense = response.rows.item(index);

              if (expense !== undefined) {

                if (expense.incoming == "true") {
                  totalIncomes += expense.amount;
                } else {
                  totalExpenses += expense.amount;
                }


                this.categoryService.getCategory(expense.category).then(category => {
                  expense.category = category;
                  expenses.push(expense);
                });
              }
            }

            expense.totalIncomes = totalIncomes;
            expense.totalExpenses = totalExpenses;
            expense.balance  = totalIncomes - totalExpenses;
            expense.expenses = expenses;
            this.events.publish("expenses:loaded", expense);
            resolve(true);

          }).catch(e => reject(e));
      });
    }
  }

  getAllByDateAndCategory(initialDate: string, finalDate: string, cateories: string): Promise<any> {

    let expenses = [];
    let sql = 'SELECT * FROM expense ';
    let conditional = "";
    let params = [];

    if (initialDate != null && finalDate != null) {
      conditional += " date between ? and ? ";
      params = [initialDate, finalDate];
    }

    if (cateories != null) {
      conditional += " and category in (" + cateories + ")";
    }

    sql += " where " + conditional + " order by date desc ";

    if (this.sqlObject) {
      return new Promise((resolve, reject) => {
        this.sqlObject.executeSql(sql, params)
          .then(response => {
            for (let index = 0; index < response.rows.length; index++) {
              expenses.push(response.rows.item(index));
            }
            resolve(expenses);
          }).catch(e => reject(e));
      });
    }
  }

  getExpenses(): Promise<any> {

    let expenses = 0;
    let sql = "SELECT sum(amount) as sum FROM expense where incoming = 'false' ";

    return new Promise((resolve, reject) => {
      if (this.sqlObject) {
        this.sqlObject.executeSql(sql, [])
          .then(response => {
            let data = response.rows.item(0);
            if (data.sum) {
              expenses = data.sum;
            }
            resolve(expenses);
          })
          .catch(e => reject(e));
      }

    });

  }

  getExpenseByRangeDate(categoryId, initialDate, finalDate): Promise<any> {
    let amount = 0;
    let sql = " select ifnull(sum(e.amount),0) amount from expense e " +
      " where e.category = ? " +
      " and  e.date >= ? and e.date <= ? " +
      " and e.incoming = 'false' ";

    return new Promise((resolve, reject) => {

      if (this.sqlObject) {
        this.sqlObject.executeSql(sql, [categoryId, initialDate, finalDate])
          .then(response => {
            let data = response.rows.item(0);
            if (data.amount) {
              amount = data.amount;
            }
            resolve(amount);
          })
          .catch(e => {
            reject(e)
          });
      }

    });

  }

  getExpensesGroupByCategory(initialDate: string, finalDate: string, category: string): Promise<any> {

    let params = [];
    let data = [];
    let sql = " SELECT sum(e.amount) amount, c.name category, c.icon icon, c.color color, c.id idcategory " +
      " FROM expense e, category c " +
      " where  e.category = c.id  " +
      " and e.incoming = 'false' ";

    if (initialDate != null && finalDate != null) {
      sql += " and e.date between ? and ? ";
      params = [initialDate, finalDate];
    }

    if (category != null) {
      sql += " and c.id = ? ";
      params.push(category);
    }

    sql += " GROUP BY category ";
    sql += " having  e.category = c.id order by amount desc";

    return new Promise((resolve, reject) => {
      if (this.sqlObject) {
        this.sqlObject.executeSql(sql, params)
          .then(response => {
            for (let index = 0; index < response.rows.length; index++) {
              let record = response.rows.item(index);
              if (record) {
                data.push(record);
              }
            }
            resolve(data);
          })
          .catch(e => reject(e));
      }

    });

  }

  getIncomes(initialDate: string, finalDate: string) {

    let params = [];
    let sql = "SELECT sum(amount) as sum FROM expense where incoming = 'true' ";

    if (initialDate != null && finalDate != null) {
      sql += " and date between ? and ? ";
      params = [initialDate, finalDate];
    }

    if (this.sqlObject) {
      this.sqlObject.executeSql(sql, params)
        .then(response => {
          let data = response.rows.item(0);
          if (data.sum) {
            this.events.publish("incomes:loaded", data.sum);
          }
        })
    }

  }

  update(expense: Expense) {

    let sql = 'UPDATE expense SET date=?, amount=?, category=?, description=?, image = ?, incoming = ? WHERE id=?';
    this.sqlObject.executeSql(sql, [expense.date, expense.amount, expense.category, expense.description, expense.image, expense.incoming, expense.id]);

  }

  add(expense: Expense) {
    return new Promise((resolve, reject) => {
      let sql = 'insert into expense ( date,amount,category, description, image, incoming ) values ( ?,?,?,?,?,? )';
      this.sqlObject.executeSql(sql, [expense.date, expense.amount, expense.category, expense.description, expense.image, expense.incoming])
        .then(response => {
          resolve(response);
        })
        .catch(e => console.log(e));
    });
  }

  existCategoryInExpenses(idcategory: number): Promise<any> {
    let exist = false;
    return new Promise((resolve, reject) => {
      let sql = 'SELECT * from expense where category = ? LIMIT 1';
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
