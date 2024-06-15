import { httpService } from "./http-service.js";

class TodoService {

  async createTodo(todo) {
    return httpService.fetch("POST", "/todos/", todo);
  }

  async deleteTodo(guid) {
    return httpService.fetch("DELETE", `/todos/${guid}`);
  }

  async getTodos() {
    return httpService.fetch("GET", "/todos/");
  }

}

export const todoService = new TodoService();