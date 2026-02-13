import express, { Express } from "express";
import morgan from "morgan";
import router from "../src/api/v1/routes/postRoutes"

const app: Express = express();

app.use(express.json()); //  use JSON body parsing

// Use Morgan for HTTP request logging
app.use(morgan("combined"));

// GET request at the app root
app.get("/", (req, res) => {
    res.send("Hello, World!");
});
