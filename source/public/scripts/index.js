import todoStore from './todo-store.js';

// theme toggle
const themeToggle = document.querySelector('.theme-toggle');
const themeIcon = document.querySelector('.theme-icon')

themeToggle.addEventListener('click', () => {
  if (themeIcon.src.includes('light_mode.svg')) {
    themeIcon.src = 'assets/dark_mode.svg';
  } else {
    themeIcon.src = 'assets/light_mode.svg';
  }
})

function createSampleToDos(todos){
  return todos.map(todo =>
    `<li>
      <h3>${todo.title}</h3>
      <p>${todo.description}</p>
      <input type="checkbox" ${todo.finished ? "checked" : ""}/>
      </li>`
  ).join('');
}

const todoListElement = document.querySelector("#todo-list")

function renderTodoList(){
  if (todoListElement){
    todoListElement.innerHTML= createSampleToDos(todoStore.todosSorted());
  }
}


renderTodoList()

/** const form = document.querySelector("#form");

if (form) {
  form.addEventListener("submit", event => {
    event.preventDefault();
    alert("lalalala")
  });
} */

