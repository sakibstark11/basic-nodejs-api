import express from "express";
import "dotenv/config";

import pingRouter from "./routes/ping.mjs";
import postsRouter from "./routes/posts.mjs";
import validation from "./utils/validationMiddleware.mjs";
const app = express();

app.use("/api/ping", pingRouter);
app.use("/api/posts", validation, postsRouter);

export default app;
