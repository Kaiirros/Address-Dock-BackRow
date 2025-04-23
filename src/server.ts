import app from "./app";
import { SERVER_PORT } from "./constants/environment-vars.constants";
import loggerService from "./services/logger.service";

const server = app.listen(SERVER_PORT || 5000, () => {
  loggerService
    .info({
      message: "==========================================================",
    })
    .flush();
  loggerService
    .info({
      message: `|| The application has started on http://localhost:${SERVER_PORT} ||`,
    })
    .flush();
  loggerService
    .info({
      message: "==========================================================",
    })
    .flush();
});

function gracefulShutdownHandler(signal: NodeJS.Signals): void {
  const GRACEFUL_SHUTDOWN_TIME = 15000;
  app.locals.HEALTH_CHECK_ENABLED = false;

  loggerService
    .info({ message: `Caught signal ${signal} gracefully shutting down!` })
    .flush();

  setTimeout(() => {
    server.close(() => {
      loggerService
        .info({
          message:
            "No longer accepting incoming request. Gracefully shutting down!",
        })
        .flush();
      process.exit();
    });
  }, GRACEFUL_SHUTDOWN_TIME);
}

process.on("SIGINT", gracefulShutdownHandler);
process.on("SIGTERM", gracefulShutdownHandler);
