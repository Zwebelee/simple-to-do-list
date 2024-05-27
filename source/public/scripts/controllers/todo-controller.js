import {TodoStore} from "../services/stores/todo-store.js";
// TODO: fix default import ( export default class TodoController
export class TodoController {
  constructor() {
    this.todoStore = new TodoStore();

    this.themeToggle = document.querySelector(".theme-toggle");
    this.themeIcon = document.querySelector(".theme-icon");
    this.todoListElement = document.querySelector("#todo-list");

  }

  toggleTheme() {
    document.body.classList.toggle("dark-theme");
  }

  initEventHandlers(){
    this.themeToggle.addEventListener("click", () => {
      this.toggleTheme();
      if(document.body.classList.contains("dark-theme")){
        this.themeIcon.src = "assets/dark_mode.svg";
      } else {
        this.themeIcon.src = "assets/light_mode.svg";
      }
    });
  }

  createTodos(todos){
    return todos
      .map(
        (todo) =>
          `<li class="todo-list-item">
              <div class="todo-grid-status">
                <input type="checkbox" ${todo.finished ? "checked" : ""}/>
              </div>
              <div class="todo-grid-duedate">
                <p>${todo.dueDate}</p>
              </div>
              <div class="todo-grid-title"><h3>${todo.title}</h3></div>
              <div class="todo-grid-description"><p>${todo.description}</p></div>
              <div class="todo-grid-importance">
                <span class="importance-${todo.importance}">${todo.importance}</span>
              </div>
              <div class="todo-grid-edit">
              <button type="button" class="button-edit" data-action="edit" data-todo-guid=${todo.guid}>Edit</button>
              </div>
              <div class="todo-grid-delete">
                <button type="button" class="button-delete" data-action="delete" data-todo-guid=${todo.guid}>
                  <img class="delete-icon" src="assets/delete.svg" alt="Delete" />
                </button>
              </div>
            </div>
          </li>`
      )
      .join("");
  }

  renderTodos(){
    this.todoListElement.innerHTML = this.createTodos(
      this.todoStore.visibleItems
    );
  }

  initialize(){
    this.initEventHandlers();
    this.renderTodos();
  }

}

new TodoController().initialize();