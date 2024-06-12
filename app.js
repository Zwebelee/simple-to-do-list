import express from 'express';
import todoRoutes from './source/routes/todo-routes.js';



const app = express();

// middlewares
app.use(express.static('source/public'));
app.use("/", todoRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
})


export default app;