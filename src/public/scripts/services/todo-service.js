import { httpService } from "./http-service.js";

class TodoService {

  static async createTodo(todo) {
    return httpService.ajax("POST", "/todos/", todo);
  }
}

export const todoService = new TodoService();