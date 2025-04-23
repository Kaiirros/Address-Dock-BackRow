import { Request, Response } from "express";
import baseEndpoint from "./base.endpoint";
import addressService from "../services/address.service";
import responseWrapper from "../services/response.service";
import { EndpointMethod } from "./base.endpoint";

import {
  RESPONSE_STATUS_OK,
  RESPONSE_STATUS_FAIL,
  RESPONSE_EVENT_READ,
} from "../constants/generic.constants";

class AddressEndpoint extends baseEndpoint {
  private readonly methods: EndpointMethod = {
    count_post: this.count_post.bind(this),
    request_post: this.request_post.bind(this),
    zipcode_post: this.zipcode_post.bind(this),
    distance_post: this.distance_post.bind(this),
  };

  public post(req: Request, res: Response): void {
    const subRoute = req.originalUrl.split("/")[2];
    const methodKey = `${subRoute}_${req.method.toLowerCase()}`;
    const method = this.methods[methodKey];

    if (method) {
      method(req, res);
    } else {
      res.status(400).send(
        responseWrapper(RESPONSE_STATUS_FAIL, RESPONSE_EVENT_READ, {
          error: "Invalid route",
        })
      );
    }
  }

  private count_post(req: Request, res: Response): void {
    addressService
      .count(req)
      .then((response) => {
        res
          .status(200)
          .send(
            responseWrapper(RESPONSE_STATUS_OK, RESPONSE_EVENT_READ, response)
          );
      })
      .catch((err) => {
        res
          .status(400)
          .send(
            responseWrapper(RESPONSE_STATUS_FAIL, RESPONSE_EVENT_READ, err)
          );
      });
  }

  private request_post(req: Request, res: Response): void {
    addressService
      .request(req)
      .then((response) => {
        res
          .status(200)
          .send(
            responseWrapper(RESPONSE_STATUS_OK, RESPONSE_EVENT_READ, response)
          );
      })
      .catch((err) => {
        res
          .status(400)
          .send(
            responseWrapper(RESPONSE_STATUS_FAIL, RESPONSE_EVENT_READ, err)
          );
      });
  }

  private zipcode_post(req: Request, res: Response): void {
    const { zipcode } = req.body;

    if (!zipcode) {
      res.status(400).send(
        responseWrapper(RESPONSE_STATUS_FAIL, RESPONSE_EVENT_READ, {
          error: "Zip code is required.",
        })
      );
      return;
    }

    addressService
      .getCityByZip(zipcode)
      .then((response) => {
        res.status(200).send(
          responseWrapper(RESPONSE_STATUS_OK, RESPONSE_EVENT_READ, {
            city: response,
          })
        );
      })
      .catch((err) => {
        res.status(500).send(
          responseWrapper(RESPONSE_STATUS_FAIL, RESPONSE_EVENT_READ, {
            error: err.message,
          })
        );
      });
  }

  private distance_post(req: Request, res: Response): void {
    addressService
      .distance(req)
      .then((response) => {
        res
          .status(200)
          .send(
            responseWrapper(RESPONSE_STATUS_OK, RESPONSE_EVENT_READ, response)
          );
      })
      .catch((err) => {
        res
          .status(400)
          .send(
            responseWrapper(RESPONSE_STATUS_FAIL, RESPONSE_EVENT_READ, err)
          );
      });
  }
}

const addressEndpoint = new AddressEndpoint();

const getRoute = addressEndpoint.get;
const postRoute = addressEndpoint.post;
const putRoute = addressEndpoint.put;
const deleteRoute = addressEndpoint.delete;

export { getRoute, postRoute, putRoute, deleteRoute };
