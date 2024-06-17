import express from 'express';
import bodyParser from 'body-parser';
import path, {dirname} from 'path';
import { fileURLToPath } from "url";
import { todoRoutes } from './src/routes/todo-routes.js';

const localDirname = dirname(fileURLToPath(import.meta.url));

const app = express();

// middlewares
app.use(express.static(path.resolve('src/public/html')));
app.use(express.static(path.resolve('src/public')));


app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.sendFile("/html/index.html", {root: `${localDirname}/src/public/`});
});
app.get("/form", (req, res) => {
  res.sendFile("/html/form.html", {root: `${localDirname}/src/public/`});
});


app.use("/todos", todoRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
})


export default app;