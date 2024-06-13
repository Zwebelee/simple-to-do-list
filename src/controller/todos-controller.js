import {todoStore} from '../services/todo-store.js';

export class TodosController {

  getTodos = async (req, res) => {
    res.json(await todoStore.getAll() || []) // TODO: check
  }

  createTodo = async (req, res) => {
    res.json(await todoStore.add(req.body));
  }

  getTodo = async (req, res) => {
    res.json(await todoStore.get(req.params.id));
  }

  deleteTodo = async (req, res) => {
    res.json(await todoStore.delete(req.params.id));
  }
}

export const todosController = new TodosController();
