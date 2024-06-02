import { Todo } from "../models/todo.js";

export class TodoStore {
  constructor() {
    const todos = JSON.parse(localStorage.getItem("simple-todos"));
    if (todos) {
      this.todos = todos;
      this.visibleItems = todos;
      this.sort("id", "desc");
    } else {
      this.todos = [];
      this.visibleItems = [];
      this.loadSampleTodos();
    }
  }

  sort(field, order = "asc") {
    function compareText(a, b) {
      return a[field].localeCompare(b[field]);
    }

    function compareNumber(a, b) {
      return a[field] - b[field];
    }

    function compareDates(a, b) {
      return new Date(a[field]) - new Date(b[field]);
    }

    let compareFunction;

    switch (field) {
      case "id":
        compareFunction = compareNumber;
        break;
      case "title":
        compareFunction = compareText;
        break;
      case "description":
        compareFunction = compareText;
        break;
      case "dueDate":
        compareFunction = compareDates;
        break;
      case "importance":
        compareFunction = compareNumber;
        break;

      default:
        throw new Error(`Invalid field: ${field}`);
    }

    const sortedTodos = [...this.todos].sort(compareFunction);

    if (order === "desc") {
      sortedTodos.reverse();
    }
    this.visibleItems = sortedTodos;
  }

  filter(state) {
    if (state === "off") {
      this.visibleItems = this.todos;
    } else if (state === "on") {
      this.visibleItems = this.todos.filter((todo) => !todo.finished);
    } else {
      throw new Error(`Invalid state: ${state}`);
    }
  }

  getTodo(guid) {
    const targetTodo = this.todos.find((todo) => todo.guid === guid);
    if (!targetTodo) {
      window.alert("Not a valid guid for this todo");
    }
    return targetTodo;
  }

  // addTodo() {}
  // incl. createdAt!

  // updateTodo(guid) {}

  deleteTodo(guid) {
    return new Promise((resolve, reject) => {
      const targetTodo = this.todos.find((todo) => todo.guid === guid);
      if (targetTodo) {
        this.todos = this.todos.filter((todo) => todo.guid !== guid);
        this.visibleItems = this.todos;
        localStorage.setItem("simple-todos", JSON.stringify(this.todos));
        resolve();
      } else {
        reject(new Error("Not a valid guid for this todo"));
      }
    });
  }
  // TODO make it private to todostore, only in constructor.

  loadSampleTodos() {
    fetch("scripts/services/data/todo-sample-data.json")
      .then((response) => response.json())
      .then((data) => {
        const sampleTodoData = data["sample-todos"];
        const sampleTodos = sampleTodoData.map(
          ({
            id,
            title,
            description,
            dueDate,
            createdAt,
            updatedAt,
            importance,
            finished,
            guid,
          }) =>
            new Todo(
              id,
              title,
              description,
              createdAt,
              updatedAt,
              dueDate,
              importance,
              finished,
              guid
            )
        );
        this.todos = sampleTodos;
        localStorage.setItem("simple-todos", JSON.stringify(sampleTodos));
        this.sort("id", "desc");
      })
      .catch((error) => console.error("Error loading sample todos", error));
  }
}

export default new TodoStore();
