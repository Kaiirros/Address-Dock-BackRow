import express, { NextFunction, Request, Response } from "express";
import cors from "cors";

import createHttpError from "http-errors";
import router from "./router";
import loggerService from "./services/logger.service";

interface HttpError extends Error {
  status?: number;
}

const app = express();
app.disable("x-powered-by");
app.use(cors());
app.use(cors({ credentials: true, origin: "*" }));

app.locals.HEALTH_CHECK_ENABLED = true;
app.get("/health", (_, res) => {
  if (app.locals.HEALTH_CHECK_ENABLED) {
    res.end("OK\n");
    return;
  }

  res.status(503).end("Server shutting down!");
});

app.use(express.json());
app.use("/", router);

app.use(async (req, res: Response, next: NextFunction) => {
  next(createHttpError.BadRequest());
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: HttpError, req: Request, res: Response, _next: NextFunction) => {
  loggerService.error({ message: err.message, path: req.path }).flush();
  res.status(err.status || 500).send({
    error: {
      status: err.status || 500,
      message: err.message || "Internal Error",
    },
  });
});

export default app;
