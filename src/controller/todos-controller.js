import {todoStore} from '../services/todo-store.js';

export class TodosController {

  getTodos = async (req, res) => {
    res.json(await todoStore.getAll() || []) // TODO: check
  }

  createTodo = async (req, res) => {
    res.json(await todoStore.add(req.body));
  }

  getTodo = async (req, res) => {
    res.json(await todoStore.get(req.params.guid));
  }

  deleteTodo = async (req, res) => {
    res.json(await todoStore.delete(req.params.guid)); //TODO guid or ID ?
  }

  updateTodo = async (req,res) => {
    res.json(await todoStore.update(req.body));
  }
}

export const todosController = new TodosController();
