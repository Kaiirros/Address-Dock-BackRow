import fs from "fs";
import express, { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { ENV } from "./constants/environment-vars.constants";

const router = express.Router();

router.get("*", async (req: Request, res: Response, next: NextFunction) => {
  const module = await import(getEndpointControllerPath(req));
  module.getRoute(req, res, next);
});

router.post("*", async (req: Request, res: Response, next: NextFunction) => {
  const module = await import(getEndpointControllerPath(req));
  module.postRoute(req, res, next);
});

router.put("*", async (req: Request, res: Response, next: NextFunction) => {
  const module = await import(getEndpointControllerPath(req));
  module.putRoute(req, res, next);
});

router.delete("*", async (req: Request, res: Response, next: NextFunction) => {
  const module = await import(getEndpointControllerPath(req));
  module.deleteRoute(req, res, next);
});

router.post(
  "/address/zipcode",
  async (req: Request, res: Response, next: NextFunction) => {
    const module = await import(getEndpointControllerPath(req));
    module.postRoute(req, res, next);
  }
);

function getEndpointControllerPath(req: Request): string {
  const paths = req.baseUrl.split("/");

  const ext = ENV === "dev" ? "ts" : "js";
  const route = `${__dirname}/endpoints/${paths[1]}.endpoint.${ext}`;
  if (paths.length === 1 || !fs.existsSync(route) || paths[1] == "base") {
    throw new createHttpError.NotFound(`Endpoint ${req.originalUrl} not found`);
  }
  return route;
}

export default router;
