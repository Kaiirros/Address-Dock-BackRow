/**
 * @description Required values that will be passed to our logger service.
 */
export interface ILoggerBody {
    message: string
    path?: string
}

/**
 * @description Configuration paramters for the logger service.
 */
export interface ILoggerTransports {
    host: string,
    json?: true,
    writeToStdOut: boolean
}