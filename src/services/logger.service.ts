import { ILoggerBody, ILoggerTransports } from "../interfaces/logger.interface";

interface LogKeyPairs {
  [key: string]: unknown;
}

class Logger {
  private readonly cache: Array<string>;
  private readonly host: string;
  private readonly writeToStdOut: boolean;

  public constructor(transport: ILoggerTransports) {
    this.cache = Array<string>();
    this.host = transport.host || "";
    this.writeToStdOut = transport.writeToStdOut || true;
  }

  /**
   * @description This method accepts a structured log format and saves it to an internal cache to be flushed
   *              at a later time.
   * @param logType A interface that accepts the request path and the log message
   * @param fieldSet An empty object that extending the logging frame with custom structured key value pairs.
   */
  public fatal(logType: ILoggerBody, logKeyPairs: LogKeyPairs = {}): Logger {
    this.log(logType, "error", logKeyPairs);
    return this;
  }

  /**
   * @description This method accepts a structured log format and saves it to an internal cache to be flushed
   *              at a later time.
   * @param logType A interface that accepts the request path and the log message
   * @param logKeyPairs An empty object that extending the logging frame with custom structured key value pairs.
   */
  public error(logType: ILoggerBody, logKeyPairs: LogKeyPairs = {}): Logger {
    this.log(logType, "error", logKeyPairs);
    return this;
  }

  /**
   * @description This method accepts a structured log format and saves it to an internal cache to be flushed
   *              at a later time.
   * @param logType A interface that accepts the request path and the log message
   * @param logKeyPairs An empty object that extending the logging frame with custom structured key value pairs.
   */
  public warning(logType: ILoggerBody, logKeyPairs: LogKeyPairs = {}): Logger {
    this.log(logType, "warning", logKeyPairs);
    return this;
  }

  /**
   * @description This method accepts a structured log format and saves it to an internal cache to be flushed
   *              at a later time.
   * @param logType A interface that accepts the request path and the log message
   * @param logKeyPairs An empty object that extending the logging frame with custom structured key value pairs.
   */
  public info(logType: ILoggerBody, logKeyPairs: LogKeyPairs = {}): Logger {
    this.log(logType, "info", logKeyPairs);
    return this;
  }

  /**
   * @description This method accepts a structured log format and saves it to an internal cache to be flushed
   *              at a later time.
   * @param logType A interface that accepts the request path and the log message
   * @param logKeyPairs An empty object that extending the logging frame with custom structured key value pairs.
   */
  public debug(logType: ILoggerBody, logKeyPairs: LogKeyPairs = {}): Logger {
    this.log(logType, "debug", logKeyPairs);
    return this;
  }

  /**
   * @description write log to transport (log file, standard out or log aggregator service (i.e: datadog))
   */
  public flush(): void {
    this.writeToStandardOut();
    this.sendLogsToAggregatorService();
    this.cache.length = 0;
  }

  /**
   * @description write log console (stdout).
   */
  private writeToStandardOut(): void {
    if (this.writeToStdOut) {
      this.cache.forEach((log) => {
        process.stdout.write(`${log}\n`);
      });
    }
  }

  /**
   * @description write log to an aggregation service (like Prometheus | Grafana Loki).
   */
  private sendLogsToAggregatorService(): void {
    //TODO: Implement logic to send log to a log aggregattion service like Prometheus | Grafana Loki.
  }

  private log(
    logType: ILoggerBody,
    level: string,
    logKeyPairs?: LogKeyPairs
  ): void {
    const currentTime = this.executionTime();
    const timeStamp = this.timeStamp();
    const log = {
      timestamp: timeStamp,
      level,
      path: logType.path,
      message: logType.message,
      executionTime: currentTime,
      ...this.parseLogKeyPairs(logKeyPairs),
    };
    this.cache.push(JSON.stringify(log));
  }

  /**
   * @description calculation request execution time.
   * @returns The execution time of the request.
   */
  private executionTime(): number {
    return Date.now();
  }

  /**
   * @description creates a timestamp for the log object.
   * @returns The timestamp the log was created.
   */
  private timeStamp(): string {
    return new Date().toISOString();
  }

  /**
   * @param logKeyPair An object containing a key value pair of added log values.
   * @returns A formatted string in a structured log format.
   */
  private parseLogKeyPairs(
    logKeyPairs: LogKeyPairs = {}
  ): Record<string, unknown> {
    const parsedPairs: Record<string, unknown> = {};
    for (const key in logKeyPairs) {
      if (Object.prototype.hasOwnProperty.call(logKeyPairs, key)) {
        parsedPairs[key] = logKeyPairs[key];
      }
    }
    return parsedPairs;
  }
}

export default new Logger({ host: "", writeToStdOut: true });
