import express from "express";
import type { Request, Response } from "express";
const app = express();
import cors from "cors";
import router from "./app/router/index.js";
import notFound from "./app/router/notFound.js";

app.use(express.json());
app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.send("Kaj lagbe ");
});

app.use(router);

// Not Found - catch all unmatched routes (must be last)
app.use(notFound);

export default app;

// middleware