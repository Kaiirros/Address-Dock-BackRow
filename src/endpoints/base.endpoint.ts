import { NextFunction, Request, Response } from 'express';
import responseWrapper from '../services/response.service';
import { RESPONSE_STATUS_FAIL, RESPONSE_EVENT_READ } from '../constants/generic.constants';
import { INVALID_REQUEST } from '../constants/errors.constants';
import createHttpError from 'http-errors';

class BaseEndpoint {
    private readonly extensions = new Map<string, string>([
        ["dev", ".js"],
        ["prod", ".ts"]
    ]);

    public constructor() { }

    public get(req: Request, res: Response, next: NextFunction) {
        throw new createHttpError.BadRequest();
    }

    public post(req: Request, res: Response, next: NextFunction) {
        throw new createHttpError.BadRequest();
    }

    public put(req: Request, res: Response, next: NextFunction) {
        throw new createHttpError.BadRequest();
    }

    public delete(req: Request, res: Response, next: NextFunction) {
        throw new createHttpError.BadRequest();
    }

    public executeSubRoute(endPointMethod: any, req: Request, res: Response, next: NextFunction) {
        let subRoute = req.originalUrl.split('/')[2];
        subRoute = `${subRoute}_${req.method.toLowerCase()}`

        const temp = endPointMethod[subRoute as keyof typeof endPointMethod];
        if (!temp) {
            throw new createHttpError.BadRequest();
        }

        temp(req, res, next);
    }
}

export default BaseEndpoint;