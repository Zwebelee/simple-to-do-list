const todos = [
  {id: '01', title: 'SampleToDo', description: 'something todo', dueDate:'', importance:3, finished: false},
  {id: '02', title: 'SampleToDo', description: 'something todo', dueDate:'', importance:1,finished: false},
  {id: '03', title: 'SampleToDo', description: 'something todo', dueDate:'', importance:4,finished: true},
  {id: '04', title: 'SampleToDo', description: 'something todo', dueDate:'', importance:4,finished: false}
];

function compareTodosImportance(t1,t2){
  return t2.importance - t1.importance;
}

function todosSorted() {
  return [...todos].sort(compareTodosImportance);
}

export default {todos, todosSorted};
