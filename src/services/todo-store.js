import Datastore from 'nedb-promises';
import fs from 'fs';
import { Todo } from '../models/todo.js';
import sampleData from '../data/todo-sample-data.js';


export class TodoStore {
  constructor(db) {
    this.db = db || new Datastore({ filename: './src/data/todos.db', autoload: true });

    if(!fs.existsSync('./src/data/todos.db')) {
      this.loadSampleTodos();
    }
  }

  async get(guid) {
    const dbItem = await this.db.findOne({ guid });
    if(!dbItem){
      return null;
    }
    const { _id } = dbItem;
    return this.db.findOne({_id });
  }

  async getAll() {
    return this.db.find({}) || [];
  }

  async add(todo) {
    const {title, description, dueDate, importance, finished} = todo;
    const id = await this.highestId() + 1;
    const newTodo = new Todo(id, title, description, dueDate, importance, finished);
    return this.db.insert(newTodo);
  }

  async delete(guid) {
    const { _id } = await this.db.findOne({ guid });
    await this.db.remove({ _id }, {});
  }

  async update(todo) {
    const { _id } = await this.get(todo.guid);
    const updateData = {...todo}
    updateData.updatedAt = new Date().toISOString();
    await this.db.updateOne(
      {_id},
      {$set: updateData},
      {returnUpdatedDocs: true}
    );
  }

  async highestId() {
    const todos = await this.getAll();
    return todos.reduce((max, todo) => Math.max(max, todo.id), 0);
  }

  loadSampleTodos() {
    sampleData.forEach((todo) => {
      const sampleTodo = new Todo(
        todo.id,
        todo.title,
        todo.description,
        todo.dueDate,
        todo.importance,
        todo.finished,
        todo.createdAt,
        todo.updatedAt,
        todo.guid
      );
      this.add(sampleTodo).then();
    });
  }
}

export const todoStore = new TodoStore();
