// Core HTTP server definition

import express from "express";
import {StatusCodes as http} from "http-status-codes";
import config from "./config.ts";
import apiRouter from "./api.ts";
import timeRouter from "./resource/time.ts";
import userRouter from "./resource/user.ts";
import eventRouter from "./resource/event.ts";

// Server parameters

const server = express();

// Use JSON middleware

server.use(express.json());

// Resource definitions

server.use("/", express.static(config.client.path));
server.use("/api", apiRouter);
server.use("/api/time", timeRouter);
server.use("/api/user", userRouter);
server.use("/api/event", eventRouter);

server.all("/{*any}", (req: express.Request, res: express.Response) => {
    res.status(http.NOT_FOUND).send("Resource not found");
});

// Start server

server.listen(config.server.port, () => {
    console.info(`Listening at http://localhost:${config.server.port}`);
});
