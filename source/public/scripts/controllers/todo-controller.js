import {TodoStore} from "../services/stores/todo-store.js";

export default class TodoController {
  constructor() {
    this.todoStore = new TodoStore();

    this.body = document.body;
    this.themeToggle = document.querySelector(".theme-toggle");
    this.themeIcon = document.querySelector(".theme-icon");
    this.todoListElement = document.querySelector("#todo-list");
    this.titleButton = document.querySelector("#title-button");

  }

  toggleTheme() {
    this.body.classList.toggle("dark-theme");
  }

  initEventHandlers() {
    // TODO -> event handlers einzelne auslagern ?! sonst hier riesen funktion
    this.themeToggle.addEventListener("click", () => {
      this.toggleTheme();
      if (document.body.classList.contains("dark-theme")) {
        this.themeIcon.src = "assets/dark_mode.svg";
      } else {
        this.themeIcon.src = "assets/light_mode.svg";
      }
    });


    const sorterDiv = document.querySelector('.sorters');
    sorterDiv.addEventListener('click', (event) => {
      if(event.target.tagName === 'BUTTON') {
        const { field, sortorder } = event.target.dataset;
        const order = event.target.dataset.sortorder;
        this.todoStore.sort(field,order);
        this.renderTodos();
        event.target.dataset.sortorder = sortorder === 'asc' ? 'desc' : 'asc'; // TODO how to fix ES LINT ?
      }
    });
    
    const filterButton = document.querySelector('.filters');
    filterButton.addEventListener('click', (event) => {
      const {state} = event.target.dataset
      const newState = state === 'off' ? 'on' : 'off';
      this.todoStore.filter(newState);
      this.renderTodos();

      event.target.dataset.state = newState;
    });

  }


  createTodos(){
    return this.todoStore.visibleItems
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
    this.todoListElement.innerHTML = this.createTodos();
  }

  initialize(){
    this.initEventHandlers();
    this.renderTodos();
  }

}

new TodoController().initialize();