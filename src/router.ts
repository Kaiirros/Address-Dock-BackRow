import fs from 'fs';
import express, { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import { ENV } from './constants/environment-vars.constants';

const router = express.Router();

router.get('*', (req: Request, res: Response, next: NextFunction) => {
    (require(getEndpointControllerPath(req))).getRoute(req, res, next);
});

router.post('*', (req: Request, res: Response, next: NextFunction) => {
    (require(getEndpointControllerPath(req))).postRoute(req, res, next);
});

router.put('*', (req: Request, res: Response, next: NextFunction) => {
    (require(getEndpointControllerPath(req))).putRoute(req, res, next);
});

router.delete('*', (req: Request, res: Response, next: NextFunction) => {
    (require(getEndpointControllerPath(req))).deleteRoute(req, res, next);
});

function getEndpointControllerPath(req: Request): string {
    const paths = req.baseUrl.split('/');

    const ext = (ENV === 'dev') ? 'ts' : 'js';
    const route = `${__dirname}/endpoints/${paths[1]}.endpoint.${ext}`;
    if (paths.length === 1 || !fs.existsSync(route) || paths[1] == 'base') {
        throw new createHttpError.NotFound(`Endpoint ${req.originalUrl} not found`);
    }
    console.log(route);
    return route;
}

export default router;