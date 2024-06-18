import { todoStore } from "../services/todo-store.js";

export class TodosController {

  // eslint-disable-next-line class-methods-use-this
  getTodos = async (req, res) => {
    try {
      const todos = await todoStore.getAll();
      res.json(todos || []);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // eslint-disable-next-line class-methods-use-this
  createTodo = async (req, res) => {
    res.json(await todoStore.add(req.body));
  };

  // eslint-disable-next-line class-methods-use-this
  getTodo = async (req, res) => {
    try {
      const todo = await todoStore.get(req.params.guid);
      if (todo) {
        res.json(todo);
      } else {
        res.status(404).json({ error: "Todo not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // eslint-disable-next-line class-methods-use-this
  deleteTodo = async (req, res) => {
    res.json(await todoStore.delete(req.params.guid));
  };

  // eslint-disable-next-line class-methods-use-this
  updateTodo = async (req, res, next) => {
    try {
      const updatedTodo = await todoStore.update(req.body);
      res.json(updatedTodo);
    } catch (error) {
      next(error);
    }
  };
}

export const todosController = new TodosController();