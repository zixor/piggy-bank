import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { SavingModel } from '../models/Saving.model';
import { DetailSavingModel } from '../models/detailsaving.model';
import * as moment from 'moment';

@Injectable()
export class SavingSqliteService {

  private dbConfig = { name: 'data.db', location: 'default' };
  private db: SQLite = null;
  private sqlObject: SQLiteObject;

  constructor() {
    this.db = new SQLite();
  }

  openDataBase() {
      this.db.create(this.dbConfig).then((sqlObject: SQLiteObject) => {
        this.sqlObject = sqlObject;
        this.createTable();
      }).catch(e => console.log(e));
  }

  createTable() {

    let sql = "create table if not exists saving(id integer primary key autoincrement, creationdate text, category text, goaldate text, amount real, description text)";
    this.sqlObject.executeSql(sql, {})
      .then(() => console.log('SQL Savings Initialized'))
      .catch(e => console.log(e));

    sql = "create table if not exists savingdetail(id integer primary key autoincrement, saving_id integer, date text, type text, amount real, justification text)";
    this.sqlObject.executeSql(sql, {})
      .then(() => console.log('SQL Savings Initialized'))
      .catch(e => console.log(e));

  }

  delete(Saving: SavingModel) {

    let sql = 'delete from saving where id=?';
    this.sqlObject.executeSql(sql, [Saving.id]);

  }

  getAll(): Promise<any> {

    let Savings = [];

    let sql = "select * from saving  order by date(creationdate) desc";

    return new Promise((resolve, reject) => {
      this.sqlObject.executeSql(sql, [])
        .then(response => {
          for (let index = 0; index < response.rows.length; index++) {
            let record = response.rows.item(index);
            if (record) {
              Savings.push(record);
            }
          }
          resolve(Savings);
        })
        .catch(e => reject(e));
    });

  }


  update(Saving: SavingModel) {

    let sql = 'update saving set category = ?, goaldate = ?, description = ?,  amount = ? where id=?';
    this.sqlObject.executeSql(sql, [Saving.category.id, Saving.goaldate, Saving.description, Saving.amount, Saving.id]);

  }

  add(Saving: SavingModel): Promise<any> {
    return new Promise((resolve, reject) => {
      let sql = 'insert into saving ( creationdate, category, goalDate, description,  amount ) values ( ?,?,?,?,? )';
      this.sqlObject.executeSql(sql, [Saving.creationDate, Saving.category.id, Saving.goaldate, Saving.description, Saving.amount])
        .then(response => {
          resolve(response);
        })
        .catch(e => console.log(e));
    });
  }

  addDetail(detail: DetailSavingModel): Promise<any> {
    return new Promise((resolve, reject) => {
      let sql = 'insert into savingdetail(saving_id, date, type, amount,justification) values (?,?,?,?,?)';
      this.sqlObject.executeSql(sql, [detail.savingid, detail.date, detail.type, detail.amount, detail.justification])
        .then(response => {
          resolve(response);
        })
        .catch(e => console.log(e));
    });
  }

  deleteDetail(detail: DetailSavingModel) {
    return new Promise((resolve, reject) => {
      let sql = 'delete from savingdetail where id = ?';
      this.sqlObject.executeSql(sql, [detail.id])
        .then(response => {
          resolve(response);
        })
        .catch(e => console.log(e));
    });
  }

  getDetailList(savingId: number): Promise<any> {

    let details = [];

    let sql = "select * from savingdetail where saving_id = ? order by date(date) desc";

    return new Promise((resolve, reject) => {
      this.sqlObject.executeSql(sql, [savingId])
        .then(response => {
          for (let index = 0; index < response.rows.length; index++) {
            let record = response.rows.item(index);
            if (record) {
              record.date = moment(record.date).format('MMMM Do YYYY, h:mm:ss a');
              details.push(record);
            }
          }
          resolve(details);
        })
        .catch(e => reject(e));
    });

  }

  closeConnection() {
    this.sqlObject.close();
  }


}
