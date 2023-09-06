import http from 'http'; // do we need this?
import express from 'express';
import setupRoutes from "./routes.js";
import cors from "cors"


console.log("Starting server")

const app = express()

app.use(cors())

app.use(express.static('public')) // do we need???

setupRoutes(app)

const PORT = process.env.PORT ?? 6060; // kinda superfluous no?
app.listen(PORT, () => console.log(`The server is running on port ${PORT}`));
