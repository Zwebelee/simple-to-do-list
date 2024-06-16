import Datastore from 'nedb-promises';
import fs from "fs";
import { Todo } from "../models/todo.js";
import sampleData from "../data/todo-sample-data.js";


export class TodoStore {
  constructor(db) {
    this.db = db || new Datastore({ filename: './src/data/todos.db', autoload: true });

    if(!fs.existsSync('./src/data/todos.db')) {
      this.loadSampleTodos();
    }
  }

  async get(guid) {
    return this.db.findOne({ _id: guid });
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
    const todo = await this.db.findOne({ guid });
    // eslint-disable-next-line no-underscore-dangle
    await this.db.remove({ _id: todo._id }, {});
  }

  async update() {
    console.log('implement update', this.db);

  }

  async validate(guid) {
    const todo = await this.db.findOne({ _id: guid });
    return todo !== null;

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
        todo.finished
      );

      sampleTodo.createAt = todo.createdAt;
      sampleTodo.updatedAt = todo.updatedAt;
      sampleTodo.guid = todo.guid;

      this.add(sampleTodo).then();

    });
  }
}

export const todoStore = new TodoStore();
