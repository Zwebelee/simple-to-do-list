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
        `<li>
      <input type="checkbox" ${todo.finished ? "checked" : ""}/>
      <h3>${todo.title}</h3>
      <p>${todo.description}</p>
      <button type="button" class="button-edit" data-action="edit" data-todo-guid=${todo.guid}>edit</button>
      <button type="button" class="button-delete" data-action="delete" data-todo-guid=${todo.guid}>delete</button>
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

const form = document.querySelector("#form");
const titleInput = document.querySelector("#title");
const importanceInput = document.querySelector("#importance");
const dueDateInput = document.querySelector("#dueDate");
const finishedInput = document.querySelector("#finished");
const descriptionInput = document.querySelector("#description");

if (form) {
  form.addEventListener("submit", event => {
    event.preventDefault();

    const ids = todoStore.todos.map(todo => todo.id);

    // Find the maximum id
    const maxId = Math.max(...ids);

    // Create a new todolist-object
    const newTodo = {
      guid: crypto.randomUUID(),
      id: maxId+1,
      title: titleInput.value,
      importance: importanceInput.value,
      dueDate: dueDateInput.value,
      finished: finishedInput.checked,
      description: descriptionInput.value
    };


    // Push the new to-do to the todos array
    todoStore.todos.push(newTodo);

    // Save the updated todos array to localStorage
    localStorage.setItem('simple-todos', JSON.stringify(todoStore.todos));

    // Clear the form fields
    titleInput.value = '';
    importanceInput.value = '';
    dueDateInput.value = '';
    finishedInput.checked = false;
    descriptionInput.value = '';

    // Update the UI
    renderTodoList();

  });
}


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
    }
  }

});
