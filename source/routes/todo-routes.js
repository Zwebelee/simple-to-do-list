import express from "express";
import { testsController } from "../controller/todos-controller.js";

const router = express.Router();

router.get("/test", testsController.test);

export default router;