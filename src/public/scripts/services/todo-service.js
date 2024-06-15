import { httpService } from "./http-service.js";

class TodoService {

  async createTodo(todo) {

    return httpService.fetch("POST", "/todos/", todo);
  }
}

export const todoService = new TodoService();