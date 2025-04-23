import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";

export type EndpointMethod = {
  [key: string]: (req: Request, res: Response) => void;
};

class BaseEndpoint {
  private readonly extensions = new Map<string, string>([
    ["dev", ".js"],
    ["prod", ".ts"],
  ]);

  public constructor() {}

  public get(req: Request, res: Response): void {
    void req;
    void res;
    throw new createHttpError.BadRequest();
  }

  public post(req: Request, res: Response): void {
    void req;
    void res;
    throw new createHttpError.BadRequest();
  }

  public put(req: Request, res: Response): void {
    void req;
    void res;
    throw new createHttpError.BadRequest();
  }

  public delete(req: Request, res: Response): void {
    void req;
    void res;
    throw new createHttpError.BadRequest();
  }

  public executeSubRoute(
    endPointMethod: EndpointMethod,
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    let subRoute = req.originalUrl.split("/")[2];
    subRoute = `${subRoute}_${req.method.toLowerCase()}`;

    const method = endPointMethod[subRoute as keyof typeof endPointMethod];
    if (method) {
      method(req, res);
    } else {
      next();
    }
  }
}

export default BaseEndpoint;
