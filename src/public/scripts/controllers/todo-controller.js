import ThemeController from "../utils/themecontroll.js";
import { todoService } from "../services/todo-service.js";

export default class TodoViewController {

  constructor() {
    this.themeController = new ThemeController();
    this.todoListElement = document.querySelector("#todo-list");
    this.sortersContainer = document.querySelector(".sorters");
    this.filterState = false;
    this.todos = [];
    this.visibleItems = [];
  }

  async loadTodos() {
    this.todos = await todoService.getTodos();
    this.visibleItems = this.todos;
  }

  createTodos(){
    return this.visibleItems
      .map((todo) => {
        const isPastDue = todo.dueDate && new Date(todo.dueDate) < new Date();
        return `<li class="todo-list-item">
              <div class="todo-checkbox">
                <input data-todo-guid=${todo.guid} type="checkbox" ${
          todo.finished ? "checked" : ""
        }/>
              </div>
              <div class="todo-title">
                <h3>${todo.title}</h3>
              </div>
               <div class="todo-duedate ${isPastDue ? "past-due" : ""}">
                <p>${TodoViewController.reformatDate(todo.dueDate)}</p>
              </div>
              <div class="todo-importance">
                ${TodoViewController.createStars(todo.importance)}
              </div>
              <div class="todo-button-group">
                <div class="todo-details">
                  <button type="button" class="button-details" data-action="details" data-todo-guid=${
          todo.guid
        }>
                    <span class="material-symbols-outlined">more_horiz</span>
                  </button>
                </div>
                <div class="todo-edit">
                  <button type="button" class="button-edit" data-action="edit" data-todo-guid=${
          todo.guid
        }>
                    <span class="material-symbols-outlined">edit</span>
                  </button>
                </div>
                <div class="todo-delete">
                  <button type="button" class="button-delete" data-action="delete" data-todo-guid=${
          todo.guid
        }>
                    <span class="material-symbols-outlined">delete</span>
                  </button>
                </div>
              </div>
            </div>
          </li>`;
      })
      .join("");
  }

  sortTodos(field, order = "asc") {
    function compareText(a, b) {
      return b[field].localeCompare(a[field]);
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
      case "createdAt":
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

  filterTodos(state) {
    if (state === "off") {
      this.visibleItems = this.todos;
    } else if (state === "on") {
      this.visibleItems = this.todos.filter((todo) => !todo.finished);
    } else {
      throw new Error(`Invalid state: ${state}`);
    }
  }

  async renderTodos(field = "id", order = "asc") {
    await this.loadTodos();
    if (this.filterState){
      this.filterTodos("on")
    }
    await this.sortTodos(field, order)
    this.todoListElement.innerHTML = this.createTodos();
  }


  initEventHandlers() {
    // TODO -> event handlers einzelne auslagern ?! sonst hier riesen funktion

    const sorterDiv = document.querySelector(".sorters");
    sorterDiv.addEventListener("click", (event) => {
      if (event.target.tagName === "BUTTON") {
        const { field, sortorder } = event.target.dataset;
        const order = event.target.dataset.sortorder;

        const sortButtons = document.querySelectorAll(".sortbutton");
        sortButtons.forEach((button) => {
          button.classList.remove("active");
        });

        const activeButton = event.target;
        const newSortOrder = sortorder === "asc" ? "desc" : "asc";
        activeButton.classList.add("active");
        activeButton.dataset.sortorder = newSortOrder;

        this.renderTodos(field, order);
      }
    });

    const filterButton = document.querySelector(".filters");
    filterButton.addEventListener("click", (event) => {
      const { state } = event.target.dataset;
      console.log('state:', state)

      if (state === "off"){
        this.filterState = true;
      } else if (state === "on"){
        this.filterState = false;
      }
      const newState = state === "off" ? "on" : "off";

      const targetFilter = event.target;
      targetFilter.textContent = newState === "on" ? "All" : "Filter";
      targetFilter.dataset.state = newState === "on" ? "on" : "off";
      this.renderTodos();
    });


    this.todoListElement.addEventListener("click", async (event) => {
      const targetButton = event.target.closest("button");
      if (!targetButton) {
        return;
      }
      const { todoGuid, action } = targetButton.dataset;
      if (action === "delete") {
        const todoItem = targetButton.closest(".todo-list-item");
        todoItem.classList.add("deleting");
        // timeout for the delete animation
        setTimeout(() => {
          todoService.deleteTodo(todoGuid)
            this.renderTodos();
        }, 500);
      } else if (action === "edit") {
        window.location.href = `form.html?guid=${todoGuid}`;
      } else if (action === "details") {
        event.preventDefault();

        // Close any existing popups
        const existingPopups = document.querySelectorAll(".popup");
        existingPopups.forEach((popup) => popup.remove());

        // Open new popup
        const targetTodo = await todoService.getTodoById(todoGuid);
        const popupHtml = TodoViewController.createTodoPopUp(targetTodo
        );
        document.body.insertAdjacentHTML("beforeend", popupHtml);
      }
    });

    this.todoListElement.addEventListener("change", async (event) => {
      if (event.target.type === "checkbox") {
        console.log('updatetest')
        const guid = event.target.dataset.todoGuid;
        console.log(guid)
        // todo work here
        // const todo = todoService.getTodoById(guid);
        // const todoItem = new Todo(...todo)
        // todoItem.finished = event.target.checked;
        // console.log('new todoItem:', todoItem)
        console.log({"guid": guid, "finished": event.target.checked})
        await todoService.updateTodo(guid, { "guid": guid, "finished": event.target.checked});

        }
        this.renderTodos();


      });

    document.body.addEventListener("click", (event) => {
      const targetButton = event.target.closest(".popup-close");
      if (targetButton) {
        event.preventDefault();
        const popup = targetButton.closest(".popup");
        popup.remove();
      }
    });
  }

  static createSortButtons() {
    const sortButtons = [
      { field: "title", alias: "Title", sortorder: "desc" },
      { field: "dueDate", alias: "Date", sortorder: "desc" },
      { field: "createdAt", alias: "Created", sortorder: "desc" },
      { field: "importance", alias: "Importance", sortorder: "desc" },
    ];

    return sortButtons
      .map(
        (props) =>
          `<button class="sortbutton" type="button" id="${props.field}-button" data-field="${props.field}" data-sortorder="${props.sortorder}">${props.alias}</button>`
      )
      .join("");
  }

  static reformatDate(dueDate) {
    if (!dueDate) {
      return "some day";
    }
    const now = new Date();
    const targetDate = new Date(dueDate);
    const diffTime = targetDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return `${Math.abs(diffDays)} days late`;
    }
    if (diffDays === 0) {
      return "today";
    }
    if (diffDays === 1) {
      return "tomorrow";
    }
    if (diffDays >= 2 && diffDays <= 6) {
      return `${diffDays} days`;
    }
    if (diffDays >= 7 && diffDays <= 13) {
      return "1 week";
    }
    if (diffDays >= 14 && diffDays <= 20) {
      return "2 weeks";
    }
    if (diffDays >= 21 && diffDays <= 27) {
      return "3 weeks";
    }
    if (diffDays >= 28 && diffDays < 180) {
      const diffMonths = Math.floor(diffDays / 30);
      return `${diffMonths} month${diffMonths > 1 ? "s" : ""}`;
    }
    return "later";
  }

  static createStars(count) {
    let starsHtml = "";
    for (let i = 1; i <= 5; i++) {
      if (i <= count) {
        starsHtml +=
          '<span class="material-symbols-outlined star-icon colored-star">kid_star</span>';
      } else {
        starsHtml +=
          '<span class="material-symbols-outlined star-icon empty-star">kid_star</span>';
      }
    }
    return starsHtml;
  }

  static createTodoPopUp(todo) {
    return `
        <div class="popup">
            <button class="popup-close"><span class="material-symbols-outlined">close</span></button>
            <h2>${todo.title}</h2>
            <p>Description: ${todo.description ? todo.description : "-"}</p>
            <p>Due date: ${todo.dueDate ? todo.dueDate : "-"}</p>
            <p>Importance: ${todo.importance}</p>
            <p>Finished: ${todo.finished ? "Yes" : "No"}</p>
            <p>ID: ${todo.id}</p>
            <p>GUID: ${todo.guid}</p>
            <p>Created at: ${new Date(todo.createdAt).toLocaleString()}</p>
            <p>Updated at: ${
              todo.updatedAt ? new Date(todo.updatedAt).toLocaleString() : "-"
            }</p>
            
        </div>
    `;
  }

  renderSortButtons() {
    this.sortersContainer.innerHTML = TodoViewController.createSortButtons();
  }

  async initialize() {
    this.initEventHandlers();
    this.themeController.initialize();
    this.renderSortButtons();
    this.renderTodos();
  }

}

new TodoViewController().initialize();
