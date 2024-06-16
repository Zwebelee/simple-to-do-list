import { httpService } from "./http-service.js";

class TodoService {

  async createTodo(todo) {
    return httpService.fetch("POST", "/todos/", todo);
  }

  async updateTodo (todo) {
    return httpService.fetch("PUT", `/todos/${todo.guid}`, todo); // TODO check
  }

  async deleteTodo(guid) {
    return httpService.fetch("DELETE", `/todos/${guid}`);
  }


  async getTodoById(guid) {
    return httpService.fetch("GET", `/todos/${guid}`);
  }

  async getTodos() {
    return httpService.fetch("GET", "/todos/");
  }

}

export const todoService = new TodoService();