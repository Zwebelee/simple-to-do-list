import { Todo } from "../models/todo.js";

export class TodoStore {
  constructor() {
    let todos = JSON.parse(localStorage.getItem('simple-todos'));
    if (!todos) {
      // fetch('scripts/services/data/sample-todos.json')
      //   .then(response => response.json())
      //   .then(data =>{
      //     todos = data['sample-todos'].map(todoData => new Todo(todoData));
      //     localStorage.setItem('simple-todos', JSON.stringify(todos))
      //   })
      //   .catch(error => console.error('Error loading sample todos', error));

      const sampleTodos = [
        {
          "id": 1,
          "title": "SampleToDo",
          "description": "something todo",
          "dueDate": "2024-05-02",
          "importance": 3,
          "finished": false,
          "guid": "6290969e-e73d-487d-8eb4-acb490e0a5fe"
        },
        {
          "id": 2,
          "title": "SampleElseToDo",
          "description": "something else todo",
          "dueDate": "2024-05-12",
          "importance": 1,
          "finished": false,
          "guid": "c3491f73-3f4d-4dd8-a45b-79cbcc77d623"
        },
        {
          "id": 3,
          "title": "Dont forget",
          "description": "i forgot",
          "dueDate": "2024-05-02",
          "importance": 4,
          "finished": true,
          "guid": "50736f1d-5566-49ad-9f02-61608982a671"
        },
        {
          "id": 4,
          "title": "A thing i need to do",
          "description": "something todo123",
          "dueDate": "2024-03-18",
          "importance": 4,
          "finished": false,
          "guid": "286f4fb8-1ef3-429a-952d-baa47b894d47"
        }
      ]
      todos = sampleTodos.map(({
                                 id,
                                 title,
                                 description,
                                 dueDate,
                                 importance,
                                 finished,
                                 guid
                               }) => new Todo(id, title, description, dueDate, importance, finished, guid));
      localStorage.setItem('simple-todos', JSON.stringify(todos));
      this.sort('id')
    }
    this.todos = todos;
    this.visibleItems = null;
    this.sort('id', 'desc');
  }

  sort(field, order = 'asc') {

    function compareText(a, b) {
      return a[field].localeCompare(b[field])
    }

    function compareNumber(a, b) {
      return a[field] - b[field]
    }

    function compareDates(a, b) {
      return new Date(a[field]) - new Date(b[field])
    }

    let compareFunction;

    switch (field) {
      case 'id':
        compareFunction = compareNumber;
        break;
      case 'title':
        compareFunction = compareText;
        break;
      case 'description':
        compareFunction = compareText;
        break;
      case 'dueDate':
        compareFunction = compareDates;
        break;
      case 'importance':
        compareFunction = compareNumber;
        break;

      default:
        throw new Error(`Invalid field: ${field}`);
    }

    const sortedTodos = [...this.todos].sort(compareFunction);

    if (order === 'desc') {
      sortedTodos.reverse();
    }
    this.visibleItems = sortedTodos;
  }

}

export default new TodoStore();