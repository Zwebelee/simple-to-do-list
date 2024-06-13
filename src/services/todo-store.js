import Datastore from 'nedb-promises';
import { Todo } from "../models/todo.js";

export class TodoStore {
  constructor(db) {
    this.db = db || new Datastore({ filename: './src/data/todos.db', autoload: true });
  }

  async get(guid) {
    return this.db.findOne({ _id: guid });
  }

  async getAll() {
    return this.db.find({}) || [];
  }

  async add(todo) {
    const newTodo = new Todo(...todo);
    return this.db.insert(newTodo);
  }

  async delete(guid) {
    await this.db.remove({ _id: guid }, {});
  }

  async update() {
    console.log('implement update', this.db);

  }

  async validate(guid) {
    const todo = await this.db.findOne({ _id: guid });
    return todo !== null;

  }
}

export const todoStore = new TodoStore();
