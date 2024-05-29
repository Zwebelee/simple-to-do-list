import todoStore from "../services/stores/todo-store.js";

export default class FormController {
  constructor() {
    this.form = document.querySelector("#form");
    this.titleInput = document.querySelector("#title");
    this.importanceInput = document.querySelector("#importance");
    this.dueDateInput = document.querySelector("#dueDate");
    this.finishedInput = document.querySelector("#finished");
    this.descriptionInput = document.querySelector("#description");
    this.todoListElement = document.querySelector("#todo-list");
  }

  initialize() {
    window.onload = this.populateForm.bind(this);
    this.formCancel();
    if (this.form) {
      this.form.addEventListener("submit", this.handleSubmit.bind(this));
    }
  }

  populateForm() {
    const urlParams = new URLSearchParams(window.location.search);
    const guid = urlParams.get("guid");
    if (guid) {
      const todos = JSON.parse(localStorage.getItem("simple-todos"));
      const targetTodo = todos.find((todo) => todo.guid === guid);
      if (targetTodo) {
        this.titleInput.value = targetTodo.title;
        this.importanceInput.value = targetTodo.importance;
        this.dueDateInput.value = targetTodo.dueDate;
        this.finishedInput.checked = targetTodo.finished;
        this.descriptionInput.value = targetTodo.description;
      }
    }
  }

  formCancel() {
    const cancleButtons = document.querySelector(".addAndCancel");
    cancleButtons.addEventListener("click", (event) => {
      event.preventDefault();
      this.handleSubmit(event);
      window.location.href = "index.html";
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    const guid = urlParams.get("guid");
    if (guid) {
      const targetTodo = todoStore.todos.find((todo) => todo.guid === guid);
      if (targetTodo) {
        targetTodo.title = this.titleInput.value;
        targetTodo.importance = this.importanceInput.value;
        targetTodo.dueDate = this.dueDateInput.value;
        targetTodo.finished = this.finishedInput.checked;
        targetTodo.description = this.descriptionInput.value;
      }
    } else {
      const ids = todoStore.todos.map((todo) => todo.id);
      const maxId = Math.max(...ids);
      const newTodo = {
        guid: crypto.randomUUID(),
        id: maxId + 1,
        title: this.titleInput.value,
        importance: this.importanceInput.value,
        dueDate: this.dueDateInput.value,
        finished: this.finishedInput.checked,
        description: this.descriptionInput.value,
      };
      todoStore.todos.push(newTodo);
    }
    localStorage.setItem("simple-todos", JSON.stringify(todoStore.todos));
    this.titleInput.value = "";
    this.importanceInput.value = "";
    this.dueDateInput.value = "";
    this.finishedInput.checked = false;
    this.descriptionInput.value = "";
  }
}

new FormController().initialize();
