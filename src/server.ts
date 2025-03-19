import app from './app';
import { SERVER_PORT } from './constants/environment-vars.constants';

const server = app.listen(SERVER_PORT || 5000, () => {
    console.info("==========================================================");
    console.info(`|| The application has started on http://localhost:${SERVER_PORT} ||`);
    console.info("==========================================================");
});

function gracefulShutdownHandler(signal: NodeJS.Signals) {
    const GRACEFUL_SHUTDOWN_TIME = 15000;
    app.locals.HEALTH_CHECK_ENABLED = false;

    console.info(`Caught signal ${signal} gracefully shutting down!`);

    setTimeout(() => {
        server.close(() => {
            console.info("No longer accepting incoming request. Gracefully shutting down!")
            process.exit();
        })
    }, GRACEFUL_SHUTDOWN_TIME)
}

process.on("SIGINT", gracefulShutdownHandler);
process.on("SIGTERM", gracefulShutdownHandler);