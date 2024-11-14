import express, { Express } from "express";
import { list, load, save, saveScore } from './routes';
import bodyParser from 'body-parser';


// Configure and start the HTTP server.
const port: number = 8088;
const app: Express = express();
app.use(bodyParser.json());
//app.get("/api/dummy", dummy);  // TODO: REMOVE
app.get("/api/list", list);
app.get("/api/load", load);
app.post("/api/save", save);
app.post("/api/saveScore", saveScore);
app.listen(port, () => console.log(`Server listening on ${port}`));
