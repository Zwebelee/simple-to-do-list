/* global Handlebars */

import todoStore from "../services/stores/todo-store.js";
import ThemeController from "../utils/themecontroll.js";
import { todoService } from "../services/todo-service.js";

export default class FormController {
  constructor() {
    this.themeController = new ThemeController();

    this.form = document.querySelector("#form");
    this.titleInput = document.querySelector("#title");
    this.importanceInput = document.querySelector("#importance");
    this.dueDateInput = document.querySelector("#dueDate");
    this.finishedInput = document.querySelector("#finished");
    this.descriptionInput = document.querySelector("#description");
  }

  initialize() {
    window.onload = this.populateForm.bind(this);
    this.themeController.initialize();
    if (this.form) {
      this.form.addEventListener("submit", this.handleSubmit.bind(this));
    }
  }

  populateForm() {
    const urlParams = new URLSearchParams(window.location.search);
    const guid = urlParams.get("guid");

    const templateSource = document.getElementById("button-template").innerHTML;
    const template = Handlebars.compile(templateSource);

    let isUpdate = false;

    // TODO: make a "getNode" on todostore -> get them from store, not from localstorage
    // if guid is wrong -> warning / alert invalid guid
    if (guid) {
      const todos = JSON.parse(localStorage.getItem("simple-todos"));
      const targetTodo = todos.find((todo) => todo.guid === guid);
      isUpdate = !!targetTodo;
      const data = { isUpdate };
      document.querySelector(".form-row-submitting").innerHTML = template(data);

      const buttons = document.querySelectorAll(
        '#form-submit[data-action="update"], #form-submit[data-action="add"]'
      );

      buttons.forEach((button) => {
        button.addEventListener("click", () => {
          button.classList.add("clicked");
        });

        button.addEventListener("animationend", () => {
          button.classList.remove("clicked");
        });
      });

      if (targetTodo) {
        this.titleInput.value = targetTodo.title;
        this.importanceInput.value = targetTodo.importance;
        this.dueDateInput.value = targetTodo.dueDate;
        this.finishedInput.checked = targetTodo.finished;
        this.descriptionInput.value = targetTodo.description;
      }
    } else {
      const data = { isUpdate };
      document.querySelector(".form-row-submitting").innerHTML = template(data);
    }
  }

  async handleSubmit(event) {
    event.preventDefault();
    const { action } = document.activeElement.dataset;

    if (action === "add" || action === "addAndReturn") {
      await todoService.createTodo(
        {
          "title":this.titleInput.value,
          "description":this.descriptionInput.value,
          "dueDate":this.dueDateInput.value,
          "importance":this.importanceInput.value,
          "finished":this.finishedInput.checked
        }
      );
      todoStore.addTodo(
        this.titleInput.value,
        this.descriptionInput.value,
        this.dueDateInput.value,
        this.importanceInput.value,
        this.finishedInput.checked
      );
      if (action === "add") {
        this.resetForm();
      } else {
        window.location.href = "index.html";
      }
    } else if (action === "update" || action === "updateAndReturn") {
      const urlParams = new URLSearchParams(window.location.search);
      const guid = urlParams.get("guid");
      if (guid) {
        if (todoStore.checkGuid(guid)) {
          const updateParams = {
            title: this.titleInput.value,
            description: this.descriptionInput.value,
            dueDate: this.dueDateInput.value,
            importance: this.importanceInput.value,
            finished: this.finishedInput.checked,
          };
          todoStore.updateTodo(guid, updateParams);
          if (action !== "update") {
            window.location.href = "index.html";
          }
        }
      }
    }
  }

  resetForm() {
    this.form.reset();
  }
}

new FormController().initialize();