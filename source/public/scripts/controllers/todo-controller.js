import { TodoStore } from "../services/stores/todo-store.js";
import ThemeController from "../utils/themecontroll.js";

export default class TodoController {
  constructor() {
    this.todoStore = new TodoStore();
    this.themeController = new ThemeController();

    this.themeToggle = document.querySelector(".theme-toggle");
    this.themeIcon = document.querySelector(".theme-icon");
    this.todoListElement = document.querySelector("#todo-list");
    this.sortersContainer = document.querySelector(".sorters");
  }

  /** toggleTheme() {
    this.body.classList.toggle("dark-theme");
  } */

  initEventHandlers() {
    // TODO -> event handlers einzelne auslagern ?! sonst hier riesen funktion
    this.themeToggle.addEventListener("click", () => {
      if (document.body.classList.contains("dark-theme")) {
        this.themeIcon.src = "assets/dark_mode.svg";
      } else {
        this.themeIcon.src = "assets/light_mode.svg";
      }
    });

    const sorterDiv = document.querySelector(".sorters");
    sorterDiv.addEventListener("click", (event) => {
      if (event.target.tagName === "BUTTON") {
        const { field, sortorder} = event.target.dataset;
        const order = event.target.dataset.sortorder;

        const sortButtons = document.querySelectorAll(".sortbutton");
        sortButtons.forEach((button) => {button. classList.remove("active")});

        event.target.classList.add("active");
        this.todoStore.sort(field, order);
        event.target.dataset.sortorder = sortorder === "asc" ? "desc" : "asc"; // TODO how to fix ES LINT ?
        this.renderTodos();
      }
    });

    const filterButton = document.querySelector(".filters");
    filterButton.addEventListener("click", (event) => {
      const { state } = event.target.dataset;
      const newState = state === "off" ? "on" : "off";
      this.todoStore.filter(newState);
      this.renderTodos();

      event.target.dataset.state = newState;
    });

    this.todoListElement.addEventListener("click", (event) => {
      const targetButton = event.target.closest("button");
      if (!targetButton) {
        return;
      }
      const { todoGuid, action } = targetButton.dataset;
      if (action === "delete") {
        this.todoStore
          .deleteTodo(todoGuid)
          .then(() => {
            this.renderTodos();
          })
          .catch((rejection) => {
            window.alert(rejection);
          });
      } else if (action === "edit") {
        window.location.href = `form.html?guid=${todoGuid}`;
      } else if (action === "details") {
        event.preventDefault();

        // Close any existing popups
        const existingPopups = document.querySelectorAll('.popup');
        existingPopups.forEach(popup => popup.remove());

        // Open new popup
        const popupHtml = this.createTodoPopUp(this.todoStore.getTodo(todoGuid));
        document.body.insertAdjacentHTML('beforeend', popupHtml);
      }
    });

    document.body.addEventListener('click', (event) => {
      const targetButton = event.target.closest('.popup-close');
      if (targetButton) {
        event.preventDefault();
        const popup = targetButton.closest('.popup');
        popup.remove();
      }
    });
  }

  createSortButtons() {
    const sortButtons = [
      { field: "title", alias: "Title", sortorder: "desc" },
      { field: "dueDate", alias: "Date", sortorder: "desc" },
      { field: "createdAt", alias: "Created", sortorder: "desc" },
      { field: "importance", alias: "Importance", sortorder: "desc" }
    ];

    const buttonsHtml = sortButtons.map(
      (props) =>
        `<button class="sortbutton" type="button" id="${props.field}-button" data-field="${props.field}" data-sortorder="${props.sortorder}">${props.alias}</button>`
    )
      .join("");
    return buttonsHtml;
  }

  reformatDate(dueDate){
    if (!dueDate){
      return 'some day';
    }
    const now = new Date();
    const targetDate = new Date(dueDate);
    const diffTime = Math.abs(targetDate - now);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return 'tomorrow';
    } else if (diffDays >= 2 && diffDays <= 6) {
      return `${diffDays} days`;
    } else if (diffDays >= 7 && diffDays <= 13) {
      return '1 week';
    } else if (diffDays >= 14 && diffDays <= 20) {
      return '2 weeks';
    } else if (diffDays >= 21 && diffDays <= 27) {
      return '3 weeks';
    } else if (diffDays >= 28 && diffDays < 180) {
      const diffMonths = Math.floor(diffDays / 30);
      return `${diffMonths} month${diffMonths > 1 ? 's' : ''}`;
    } else {
      return 'later';
    }
  }

  createStars(count){
    let starsHtml = '';
    for (let i = 1; i <= 5; i++){
      if(i<=count) {
        starsHtml += '<span class="material-symbols-outlined star-icon colored-star">kid_star</span>';
      } else {
        starsHtml += '<span class="material-symbols-outlined star-icon empty-star">kid_star</span>';
      }
    }
    return starsHtml;
  }

  createTodos() {
    return this.todoStore.visibleItems
      .map(
        (todo) =>
          `<li class="todo-list-item">
              <div class="todo-checkbox">
                <input type="checkbox" ${todo.finished ? "checked" : ""}/>
              </div>
              <div class="todo-title">
                <h3>${todo.title}</h3>
              </div>
               <div class="todo-duedate">
                <p>${this.reformatDate(todo.dueDate)}</p>
              </div>
              <div class="todo-importance">
                ${this.createStars(todo.importance)}
              </div>
              <div class="todo-button-group">
                <div class="todo-details">
                  <button type="button" class="button-details" data-action="details" data-todo-guid=${todo.guid}>
                    <span class="material-symbols-outlined">more_horiz</span>
                  </button>
                </div>
                <div class="todo-edit">
                  <button type="button" class="button-edit" data-action="edit" data-todo-guid=${todo.guid}>
                    <span class="material-symbols-outlined">edit</span>
                  </button>
                </div>
                <div class="todo-delete">
                  <button type="button" class="button-delete" data-action="delete" data-todo-guid=${todo.guid}>
                    <span class="material-symbols-outlined">delete</span>
                  </button>
                </div>
              </div>
            </div>
          </li>`
      )
      .join("");
  }

  createTodoPopUp(todo){
    return `
        <div class="popup">
            <button class="popup-close"><span class="material-symbols-outlined">close</span></button>
            <h2>${todo.title}</h2>
            <p>Description: ${todo.description ? todo.description : "-"}</p>
            <p>Due date: ${todo.dueDate ? todo.dueDate : "-"}</p>
            <p>Importance: ${todo.importance}</p>
            <p>Finished: ${todo.finished ? 'Yes' : 'No'}</p>
            <p>ID: ${todo.id}</p>
            <p>GUID: ${todo.guid}</p>
            <p>Created at: ${(new Date(todo.createdAt)).toLocaleString()}</p>
            <p>Updated at: ${todo.updatedAt ? (new Date(todo.updatedAt)).toLocaleString() : "-"}</p>
            
        </div>
    `;
  }

  renderTodos() {
    this.todoListElement.innerHTML = this.createTodos();
  }

  renderSortButtons() {
    this.sortersContainer.innerHTML = this.createSortButtons();
  }

  async initialize() {
    this.initEventHandlers();
    this.themeController.initialize();
    await this.todoStore.ready;
    this.renderTodos();
    this.renderSortButtons();
  }
}

new TodoController().initialize();
