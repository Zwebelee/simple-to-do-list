import { httpService } from "./http-service.js";

class TodoService {

  async createTodo(todo) {
    return httpService.fetch("POST", "/todos/", todo);
  }

  async updateTodo (guid, todo) {
    console.log('todo-service -> put request')
    return httpService.fetch("PUT", `/todos/${guid}`, todo);
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