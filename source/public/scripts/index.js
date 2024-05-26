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
      <h3>${todo.title}</h3>
      <p>${todo.description}</p>
      <input type="checkbox" ${todo.finished ? "checked" : ""}/>
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
