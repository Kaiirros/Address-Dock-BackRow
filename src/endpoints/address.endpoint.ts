import { Request, Response, NextFunction, Router } from "express";
import BaseEndpoint from "./base.endpoint";
import addressService from "../services/address.service";
import loggerService from "../services/logger.service";
import responseWrapper from "../services/response.service";

class AddressEndpoint extends BaseEndpoint {
  private router: Router;

  constructor() {
    super();
    this.router = Router();
    this.router.post("/count", this.count.bind(this));
    this.router.post("/distance", this.distance.bind(this));
    this.router.post("/city-count", this.cityCount.bind(this));
  }

  public getRouter(): Router {
    return this.router;
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
      const result = await addressService.distance(req);
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

export default new AddressEndpoint();
