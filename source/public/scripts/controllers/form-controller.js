import todoStore from "../services/stores/todo-store.js";
import ThemeController from "../utils/themecontroll.js";

export default class FormController {
  constructor() {
    this.themeController = new ThemeController();

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
    this.themeController.initialize();
    this.formCancel();
    if (this.form) {
      this.form.addEventListener("submit", this.handleSubmit.bind(this));
    }
  }

  populateForm() {
    debugger;
    const urlParams = new URLSearchParams(window.location.search);
    const guid = urlParams.get("guid");

    const templateSource = document.getElementById("button-template").innerHTML;
    const template = Handlebars.compile(templateSource);

    // TODO: make a "getNode" on todostore -> get them from store, not from localstorage
    // if guid is wrong -> warning / alert invalid guid
    if (guid) {
      const todos = JSON.parse(localStorage.getItem("simple-todos"));
      const targetTodo = todos.find((todo) => todo.guid === guid);
      const data = { isUpdate: !targetTodo };
      const buttonsHtml = template(data);
      document.querySelector(".form-row-submitting").innerHTML = buttonsHtml;

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
    const cancelButtons = document.querySelector(".addAndCancel");
    cancelButtons.addEventListener("click", (event) => {
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
      if (todoStore.checkGuid(guid)) {
        console.log("found guid - update");
        const updateParams = {
          title: this.titleInput.value,
          description: this.descriptionInput.value,
          dueDate: this.dueDateInput.value,
          importance: this.importanceInput.value,
          finished: this.finishedInput.checked,
        };

        todoStore.updateTodo(guid, updateParams);
      } else {
        window.alert("No todo found for this guid.");
      }
    } else {
      todoStore.addTodo(
        this.titleInput.value,
        this.descriptionInput.value,
        this.dueDateInput.value,
        this.importanceInput.value,
        this.finishedInput.checked
      );
      this.resetForm();
    }
  }

  resetForm() {
    this.form.reset();
  }
}

new FormController().initialize();
