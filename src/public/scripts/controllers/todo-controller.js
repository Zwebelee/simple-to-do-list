import { TodoStore } from "../services/stores/todo-store.js";
import ThemeController from "../utils/themecontroll.js";
import { todoService } from "../services/todo-service.js";

export default class TodoController {
  constructor() {
    this.todoStore = new TodoStore();
    this.themeController = new ThemeController();
    this.todoListElement = document.querySelector("#todo-list");
    this.sortersContainer = document.querySelector(".sorters");
  }

  initEventHandlers() {

    const testbtn = document.querySelector(".testbutton")
    console.log(testbtn)
    testbtn.addEventListener("click", ()=>{
      console.log("test")
      todoService.createTodo({"title": "test", "description": "test", "dueDate": "2021-06-01", "importance": 3, "finished": false});
    })

    /** testbtn.addEventListener("click", async()=>{
      // TODO: send todo-object oder nur die props dafür ? wo soll das erstellt werden
      const randTodo = new Todo(
        5, "test", "desctest", Date.now(), null, null, 3, false,"123-321"
      )
      await todoService.createTodo(randTodo)
    })*/

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

        this.todoStore.sort(field, order);
        this.renderTodos();
      }
    });

    const filterButton = document.querySelector(".filters");
    filterButton.addEventListener("click", (event) => {
      const { state } = event.target.dataset;
      const newState = state === "off" ? "on" : "off";
      this.todoStore.filter(newState);
      this.renderTodos();

      const targetFilter = event.target;
      targetFilter.dataset.state = newState === "on" ? "All" : "Filter";
    });

    this.todoListElement.addEventListener("click", (event) => {
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
          this.todoStore
            .deleteTodo(todoGuid)
            .then(() => {
              this.renderTodos();
            })
            .catch((rejection) => {
              window.alert(rejection);
            });
        todoService.deleteTodo(todoGuid)


        }, 500);
      } else if (action === "edit") {
        window.location.href = `form.html?guid=${todoGuid}`;
      } else if (action === "details") {
        event.preventDefault();

        // Close any existing popups
        const existingPopups = document.querySelectorAll(".popup");
        existingPopups.forEach((popup) => popup.remove());

        // Open new popup
        const popupHtml = TodoController.createTodoPopUp(
          this.todoStore.getTodo(todoGuid)
        );
        document.body.insertAdjacentHTML("beforeend", popupHtml);
      }
    });

    this.todoListElement.addEventListener("change", (event) => {
      if (event.target.type === "checkbox") {
        const guid = event.target.dataset.todoGuid;
        const todo = this.todoStore.getTodo(guid);
        if (todo) {
          // TODO: duplicate.. update better?!?
          const updateParams = {
            title: todo.title,
            description: todo.description,
            dueDate: todo.dueDate,
            importance: todo.importance,
            finished: event.target.checked,
          };
          this.todoStore.updateTodo(guid, updateParams);
        }
        this.renderTodos();
      }
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

  createTodos() {
    return this.todoStore.visibleItems
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
                <p>${TodoController.reformatDate(todo.dueDate)}</p>
              </div>
              <div class="todo-importance">
                ${TodoController.createStars(todo.importance)}
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

  async renderTodos() {
    // this.todoListElement.innerHTML = this.createTodos();
    this.todoListElement.innerHTML = await TodoController.testcreateTodos();
  }

  renderSortButtons() {
    this.sortersContainer.innerHTML = TodoController.createSortButtons();
  }

  async initialize() {
    this.initEventHandlers();
    this.themeController.initialize();
    await this.todoStore.ready;
    this.renderTodos();
    this.renderSortButtons();
  }

  static async testcreateTodos(){
    const todos = await todoService.getTodos();
    console.log(todos)

    return todos
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
                <p>${TodoController.reformatDate(todo.dueDate)}</p>
              </div>
              <div class="todo-importance">
                ${TodoController.createStars(todo.importance)}
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
}

new TodoController().initialize();
