import { httpService } from "./http-service.js";

class TodoService {

  // eslint-disable-next-line class-methods-use-this
  async createTodo(todo) {
    return httpService.fetch("POST", "/todos/", todo);
  }

  // eslint-disable-next-line class-methods-use-this
  async updateTodo (guid, todo) {
    return httpService.fetch("PUT", `/todos/${guid}`, todo);
  }

  // eslint-disable-next-line class-methods-use-this
  async deleteTodo(guid) {
    return httpService.fetch("DELETE", `/todos/${guid}`);
  }

  // eslint-disable-next-line class-methods-use-this
  async getTodoById(guid) {
    return httpService.fetch("GET", `/todos/${guid}`);
  }

  // eslint-disable-next-line class-methods-use-this
  async getTodos() {
    return httpService.fetch("GET", "/todos/");
  }

}

export const todoService = new TodoService();