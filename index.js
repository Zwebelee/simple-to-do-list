import app from "./app.js";

const hostname = "localhost";
const port = 3000;

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Example app listening at http://${hostname}:${port}`);
});
