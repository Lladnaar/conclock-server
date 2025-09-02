// Core HTTP server definition

import express from "express";
import settings from "./settings.ts";
import apiRouter from "./api.ts";
import timeRouter from "./time.ts";
import userRouter from "./user.ts";

// Server parameters

const server = express();

// Use JSON middleware

server.use(express.json());

// Resource definitions

server.use("/", express.static(settings.appPath));
server.use("/api", apiRouter);
server.use("/api/time", timeRouter);
server.use("/api/user", userRouter);

server.all("/{*any}", (req: express.Request, res: express.Response) => {
    res.status(404).send("Resource not found");
});

// Start server

server.listen(settings.serverPort, () => {
    console.info(`Listening at http://localhost:${settings.serverPort}`);
});
