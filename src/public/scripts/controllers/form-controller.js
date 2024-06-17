/* global Handlebars */

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
    this.form.addEventListener("submit", this.handleSubmit.bind(this));
  }

  async populateForm() {
    const urlParams = new URLSearchParams(window.location.search);
    const guid = urlParams.get("guid");

    const templateSource = document.getElementById("button-template").innerHTML;
    const template = Handlebars.compile(templateSource);

    let isUpdate = false;

    if (guid) {
      const todo = await todoService.getTodoById(guid);
      isUpdate = !!todo;
      const data = { isUpdate };
      document.querySelector(".form-row-submitting").innerHTML = template(data);

      const buttons = document.querySelectorAll(
        "#form-submit[data-action=\"update\"], #form-submit[data-action=\"add\"]"
      );

      buttons.forEach((button) => {
        button.addEventListener("click", () => {
          button.classList.add("clicked");
        });
        button.addEventListener("animationend", () => {
          button.classList.remove("clicked");
        });
      });

      if (todo) {
        this.titleInput.value = todo.title;
        this.importanceInput.value = todo.importance;
        this.dueDateInput.value = todo.dueDate;
        this.finishedInput.checked = todo.finished;
        this.descriptionInput.value = todo.description;
      }
    } else {
      const data = { isUpdate };
      document.querySelector(".form-row-submitting").innerHTML = template(data);
    }
  }

  async handleSubmit(event) {
    event.preventDefault();
    const { action } = document.activeElement.dataset;

    const todoData = {
      title: this.titleInput.value,
      description: this.descriptionInput.value,
      dueDate: this.dueDateInput.value,
      importance: this.importanceInput.value,
      finished: this.finishedInput.checked
    };

    if (action === "add" || action === "addAndReturn") {
      await todoService.createTodo(todoData);
      if (action === "add") {
        this.resetForm();
      } else {
        window.location.href = "index.html";
      }

    } else if (action === "update" || action === "updateAndReturn") {
      const urlParams = new URLSearchParams(window.location.search);
      const guid = urlParams.get("guid");
      if (guid) {
        if (await todoService.getTodoById(guid)) {
          todoData.guid = guid;
          await todoService.updateTodo(guid, todoData);
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
