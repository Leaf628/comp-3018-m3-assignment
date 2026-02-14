import express, { Express } from "express";
import morgan from "morgan";
import router from "../api/v1/routes/eventRoute"

const app: Express = express();

app.use(express.json()); //  use JSON body parsing

// Use Morgan for HTTP request logging
app.use(morgan("combined"));

// GET request at the app root
app.get("/", (req, res) => {
    res.send("Hello, World!");
});

export default app;