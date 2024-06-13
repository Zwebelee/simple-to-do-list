import express from 'express';
import { todoRoutes } from './src/routes/todo-routes.js';



const app = express();

// middlewares
app.use(express.static('src/public'));
app.use("/todos", todoRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
})


export default app;