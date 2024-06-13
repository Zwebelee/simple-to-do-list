import express from "express";
import { todosController } from "../controller/todos-controller.js";

const router = express.Router();

router.get("/", todosController.getTodos);
router.post("/", todosController.createTodo);
router.get("/:id/", todosController.getTodo);
router.delete("/:id/", todosController.deleteTodo);

export const todoRoutes = router;