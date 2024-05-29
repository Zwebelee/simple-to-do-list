import todoStore from "./services/stores/todo-store.js";

window.onload = function () {
  const urlParams = new URLSearchParams(window.location.search);

  // Get the guid from the URL
  const guid = urlParams.get("guid");
  console.log(guid);

  if (guid) {
    const todos = JSON.parse(localStorage.getItem("simple-todos"));

    // Find the todo with the matching guid
    const targetTodo = todos.find((todo) => todo.guid === guid);

    // If a matching todo was found, populate the form fields
    if (targetTodo) {
      console.log("valid guid");
      document.querySelector("#title").value = targetTodo.title;
      document.querySelector("#importance").value = targetTodo.importance;
      document.querySelector("#dueDate").value = targetTodo.dueDate;
      document.querySelector("#finished").checked = targetTodo.finished;
      document.querySelector("#description").value = targetTodo.description;
    }
    console.log("no valid guid");
  }
  console.log("load empty");
};

function createSampleToDos(todos) {
  return todos
    .map(
      (todo) =>
        `<li>
      <input type="checkbox" ${todo.finished ? "checked" : ""}/>
      <h3>${todo.title}</h3>
      <p>${todo.description}</p>
      <button type="button" class="button-edit" data-action="edit" data-todo-guid=${
        todo.guid
      }>edit</button>
      <button type="button" class="button-delete" data-action="delete" data-todo-guid=${
        todo.guid
      }>delete</button>
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

const form = document.querySelector("#form");
const titleInput = document.querySelector("#title");
const importanceInput = document.querySelector("#importance");
const dueDateInput = document.querySelector("#dueDate");
const finishedInput = document.querySelector("#finished");
const descriptionInput = document.querySelector("#description");

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const urlParams = new URLSearchParams(window.location.search);

    // Get the guid from the URL
    const guid = urlParams.get("guid");

    if (guid) {
      const targetTodo = todoStore.todos.find((todo) => todo.guid === guid);
      if (targetTodo) {
        targetTodo.title = titleInput.value;
        targetTodo.importance = importanceInput.value;
        targetTodo.dueDate = dueDateInput.value;
        targetTodo.finished = finishedInput.checked;
        targetTodo.description = descriptionInput.value;
      }
    } else {
      const ids = todoStore.todos.map((todo) => todo.id);

      // Find the maximum id
      const maxId = Math.max(...ids);

      // Create a new todolist-object
      const newTodo = {
        guid: crypto.randomUUID(),
        id: maxId + 1,
        title: titleInput.value,
        importance: importanceInput.value,
        dueDate: dueDateInput.value,
        finished: finishedInput.checked,
        description: descriptionInput.value,
      };

      // Push the new to-do to the todos array
      todoStore.todos.push(newTodo);
    }

    // Save the updated todos array to localStorage
    localStorage.setItem("simple-todos", JSON.stringify(todoStore.todos));

    // Clear the form fields
    titleInput.value = "";
    importanceInput.value = "";
    dueDateInput.value = "";
    finishedInput.checked = false;
    descriptionInput.value = "";

    // Update the UI
    renderTodoList();
  });
}
