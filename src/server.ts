import app from "./app";
import { SERVER_PORT } from "./constants/environment-vars.constants";
import loggerService from "./services/logger.service";

app.listen(SERVER_PORT || 5000, () => {
  loggerService.info({
    message: "==========================================================",
  });
  loggerService.info({
    message: `|| The application has started on http://localhost:${SERVER_PORT} ||`,
  });
  loggerService.info({
    message: "==========================================================",
  });
  loggerService.flush();
});

// function gracefulShutdownHandler(signal: NodeJS.Signals): void {
//   const GRACEFUL_SHUTDOWN_TIME = 0;
//   app.locals.HEALTH_CHECK_ENABLED = false;

//   loggerService.info({
//     message: `Caught signal ${signal} gracefully shutting down!`,
//   });

//   setTimeout(() => {
//     server.close(() => {
//       loggerService.info({
//         message:
//           "No longer accepting incoming request. Gracefully shutting down!",
//       });
//       process.exit();
//     });
//   }, GRACEFUL_SHUTDOWN_TIME);
// }

// process.on("SIGINT", gracefulShutdownHandler);
// process.on("SIGTERM", gracefulShutdownHandler);
