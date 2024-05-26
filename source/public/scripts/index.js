import todoStore from "./services/data/todo-store.js";

// theme toggle
const themeToggle = document.querySelector(".theme-toggle");
const themeIcon = document.querySelector(".theme-icon");

themeToggle.addEventListener("click", () => {
  if (themeIcon.src.includes("light_mode.svg")) {
    themeIcon.src = "assets/dark_mode.svg";
    document.body.classList.add("dark-theme");
  } else {
    themeIcon.src = "assets/light_mode.svg";
    document.body.classList.remove("dark-theme");
  }
});

function createSampleToDos(todos) {
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

const todoListElement = document.querySelector("#todo-list");

function renderTodoList() {
  if (todoListElement) {
    todoListElement.innerHTML = createSampleToDos(
      todoStore.todosSortedBy("title")
    );
  }
}

// TODO -> imporve
let isDescending = false;

// TODO -> Bubble event for buttons so not needed on every button
const importanceButton = document.querySelector("#importance-button");

if (importanceButton) {
  importanceButton.addEventListener("click", () => {
    const sortedTodos = todoStore.todosSortedBy(
      "importance",
      isDescending ? "asc" : "desc"
    );
    todoListElement.innerHTML = createSampleToDos(sortedTodos);
    isDescending = !isDescending;
  });
}

const titleButton = document.querySelector("#title-button");

if (titleButton) {
  titleButton.addEventListener("click", () => {
    const sortedTodos = todoStore.todosSortedBy(
      "title",
      isDescending ? "asc" : "desc"
    );
    todoListElement.innerHTML = createSampleToDos(sortedTodos);
    isDescending = !isDescending;
  });
}

renderTodoList();




todoListElement.addEventListener("click", event => {
  console.log(event)
  const {todoGuid, action} = event.target.dataset;
  if(todoGuid) {
    // TODO: refactor delete / edit to store or service
    if(action ==="delete") {
      console.log('delete')
      
      // delete via filter (does not mutate the array, thus slightly slower)
     todoStore.todos = todoStore.todos.filter(todo => todo.guid !== todoGuid);
      
      /** // alternative delete via splice (mutates the array, thus faster on large arrays)
      const todoIndex = todoStore.todos.findIndex(todo => todo.guid === todoGuid);
      if (todoIndex !== -1) {
        todoStore.todos.splice(todoIndex, 1);
      } */
      
      // save the updated todos array to localStorage
      localStorage.setItem('simple-todos', JSON.stringify(todoStore.todos));

      // Update the UI
      renderTodoList();


    } else if (action === "edit") {
      console.log('edit')
      window.location.href = `form.html?guid=${todoGuid}`;

    }
  }

});
