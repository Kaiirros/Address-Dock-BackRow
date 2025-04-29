import { Request, Response, NextFunction } from "express";
import BaseEndpoint from "./base.endpoint";
import addressService from "../services/address.service";
import loggerService from "../services/logger.service";
import responseWrapper from "../services/response.service";

class AddressEndpoint extends BaseEndpoint {
  constructor() {
    super();
  }

  public async postRoute(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const path = req.path.split("/")[2]; // Get the sub-route (count, distance, city-count)

    switch (path) {
      case "count":
        await this.count(req, res, next);
        break;
      case "distance":
        await this.distance(req, res, next);
        break;
      case "city-count":
        await this.cityCount(req, res, next);
        break;
      default:
        next(new Error(`Unknown endpoint: ${path}`));
    }
  }

  private async count(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await addressService.count(req);
      res.json(responseWrapper("success", "read", result));
    } catch (err) {
      loggerService
        .error({ path: "/address/count", message: `${(err as Error).message}` })
        .flush();
      next(err);
    }
  }

  private async distance(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await addressService.distance({ body: req.body.body });
      res.json(responseWrapper("success", "read", result));
    } catch (err) {
      loggerService
        .error({
          path: "/address/distance",
          message: `${(err as Error).message}`,
        })
        .flush();
      next(err);
    }
  }

  private async cityCount(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await addressService.city_count(req);
      res.json(responseWrapper("success", "read", result));
    } catch (err) {
      loggerService
        .error({
          path: "/address/city-count",
          message: `${(err as Error).message}`,
        })
        .flush();
      next(err);
    }
  }
}

const endpoint = new AddressEndpoint();
export const postRoute = endpoint.postRoute.bind(endpoint);
export const getRoute = endpoint.get.bind(endpoint);
export const putRoute = endpoint.put.bind(endpoint);
export const deleteRoute = endpoint.delete.bind(endpoint);
