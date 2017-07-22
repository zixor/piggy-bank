import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { CategoryModel } from '../app/category.model';

@Injectable()
export class CategorySqliteService {

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
    let sql = 'CREATE TABLE IF NOT EXISTS category(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, description TEXT, icon TEXT, color TEXT)';
    this.sqlObject.executeSql(sql, {})
      .then(() => console.log('SQL Category Initialized'))
      .catch(e => console.log(e));

  }

  delete(category: CategoryModel) {

    let sql = 'DELETE FROM category WHERE id=?';
    this.sqlObject.executeSql(sql, [category.id]);

  }

  getAll(): Promise<any> {

    let categorys = [];
    let sql = 'SELECT * FROM category';

    return new Promise((resolve, reject) => {
      this.sqlObject.executeSql(sql, [])
        .then(response => {
          for (let index = 0; index < response.rows.length; index++) {
            let category = response.rows.item(index);
            if (category !== undefined) {
              categorys.push(category);
            }
          }
          resolve(categorys);
        })
        .catch(e => reject(e));
    });

  }

  getCategory(categoryId): Promise<any> {

    let category;
    let sql = 'SELECT * FROM category where id = ?';

    return new Promise((resolve, reject) => {
      this.sqlObject.executeSql(sql, [categoryId])
        .then(response => {
          for (let index = 0; index < response.rows.length; index++) {
            category = response.rows.item(index);
          }
          resolve(category);
        })
        .catch(e => reject(e));
    });

  }

  update(category: CategoryModel) {

    let sql = 'UPDATE category SET name = ?, description = ?, icon = ?, color = ? WHERE id=?';
    this.sqlObject.executeSql(sql, [category.name, category.description, category.icon, category.color, category.id]);

  }

  add(category: CategoryModel) {
    return new Promise((resolve, reject) => {
      let sql = 'insert into category ( name, description, icon, color ) values ( ?,?,?,? )';
      this.sqlObject.executeSql(sql, [category.name, category.description, category.icon, category.color])
        .then(response => {
          resolve(response);
        })
        .catch(e => console.log(e));
    });
  }

  closeConnection() {
    this.sqlObject.close();
  }


}
