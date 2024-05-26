const todos = [
  {id: '01', title: 'SampleToDo', description: 'something todo', dueDate:'', importance:3, finished: false},
  {id: '02', title: 'SampleElseToDo', description: 'something else todo', dueDate:'', importance:1,finished: false},
  {id: '03', title: 'Dont forget', description: 'i forgot', dueDate:'', importance:4,finished: true},
  {id: '04', title: 'A thing i need to do', description: 'something todo123', dueDate:'', importance:4,finished: false}
];

function compareTodosById(t1,t2){
  return t1.id.localeCompare(t2.id)
}

function compareTodosByTitle(t1,t2){
  return t1.title.localeCompare(t2.title)
}

function compareTodosByDescription(t1,t2){
  return t1.description.localeCompare(t2.description)
}

function compareTodosByDueDate(t1,t2){
  // TODO
  console.error('not implemented yet')
  return t1.id.localeCompare(t2.id)
}

function compareTodosImportance(t1,t2){
  return t2.importance - t1.importance;
}


function todosSortedBy(field, order='asc') {
  let compareFunction;

  switch (field) {
    case 'id':
      compareFunction = compareTodosById;
      break;
    case 'title':
      compareFunction = compareTodosByTitle;
      break;
    case 'description':
      compareFunction = compareTodosByDescription;
      break;
    case 'dueDate':
      compareFunction = compareTodosByDueDate;
      break;
    case 'importance':
      compareFunction = compareTodosImportance;
      break;
    default:
      throw new Error(`Invalid field: ${field}`);
  }

  const sortedTodos = [...todos].sort(compareFunction);

  if (order === 'desc') {
    sortedTodos.reverse();
  }

  return sortedTodos;
}

export default {todos, todosSortedBy};
