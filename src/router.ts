import fs from "fs";
import express, { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { ENV } from "./constants/environment-vars.constants";

const router = express.Router();

router.post(
  "/address/zipcode",
  async (req: Request, res: Response, next: NextFunction) => {
    const module = await import(getEndpointControllerPath(req));
    module.postRoute(req, res, next);
  }
);

router.get("*", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const modulePath = getEndpointControllerPath(req);
    const module = await import(modulePath);
    module.getRoute(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.post("*", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const modulePath = getEndpointControllerPath(req);
    const module = await import(modulePath);
    module.postRoute(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.put("*", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const modulePath = getEndpointControllerPath(req);
    const module = await import(modulePath);
    module.putRoute(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.delete("*", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const modulePath = getEndpointControllerPath(req);
    const module = await import(modulePath);
    module.deleteRoute(req, res, next);
  } catch (error) {
    next(error);
  }
});

function getEndpointControllerPath(req: Request): string {
  const paths = req.path.split("/");
  const ext = ENV === "dev" ? "ts" : "js";
  const route = `${__dirname}/endpoints/${paths[1]}.endpoint.${ext}`;
  if (paths.length === 1 || !fs.existsSync(route) || paths[1] == "base") {
    throw new createHttpError.NotFound(`Endpoint ${req.originalUrl} not found`);
  }
  return route;
}

export default router;
