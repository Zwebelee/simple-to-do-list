import express from "express";
import { todosController } from "../controller/todos-controller.js";

const router = express.Router();

router.get("/", todosController.getTodos);
router.post("/", todosController.createTodo);
router.get("/:guid/", todosController.getTodo);
router.put("/:guid/", todosController.updateTodo);
router.delete("/:guid/", todosController.deleteTodo);

export const todoRoutes = router;