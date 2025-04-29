import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";

type EndpointMethod = {
  [key: string]: (req: Request, res: Response, next: NextFunction) => void;
};

class BaseEndpoint {
  private readonly extensions = new Map<string, string>([
    ["dev", ".js"],
    ["prod", ".ts"],
  ]);

  public constructor() {}

  public get(): void {
    throw new createHttpError.BadRequest();
  }

  public post(): void {
    throw new createHttpError.BadRequest();
  }

  public put(): void {
    throw new createHttpError.BadRequest();
  }

  public delete(): void {
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

    const method = endPointMethod[subRoute];
    if (!method) {
      throw new createHttpError.BadRequest();
    }

    method(req, res, next);
  }
}

export default BaseEndpoint;
