const request = require("request");
const crypto = require("crypto");
const baseurl = "https://api.coindcx.com";
import { key, secret } from "./config";

export const createOrder = (
  side: "buy" | "sell",
  market: string,
  price: number,
  quantity: number,
  clientOrderId: string
) => {
  return new Promise<void>((resolve, reject) => {
    const body = {
      side,
      order_type: "limit_order",
      market: market,
      price_per_unit: price,
      total_quantity: quantity,
      timestamp: Math.floor(Date.now()),
      client_order_id: clientOrderId,
    };

    const payload = new Buffer(JSON.stringify(body)).toString();
    const signature = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex");

    const options = {
      url: baseurl + "/exchange/v1/orders/create",
      headers: {
        "X-AUTH-APIKEY": key,
        "X-AUTH-SIGNATURE": signature,
      },
      json: true,
      body: body,
    };

    request.post(options, function (error: any, response: any, body: any) {
      if (error) {
        reject(error);
        console.error("Error creating order:", error);
      } else {
        console.log(body);
        console.log(response.statusCode);
      }
      resolve();
    });
  });
};

export const cancelOrder = () => {};

export const cancelAllOrders = (market: string) => {
  return new Promise<void>((resolve, reject) => {
    const body = {
      market,
      timestamp: Math.floor(Date.now()),
    };

    const payload = new Buffer(JSON.stringify(body)).toString();
    const signature = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex");

    const options = {
      url: baseurl + "/exchange/v1/orders/cancel_all",
      headers: {
        "X-AUTH-APIKEY": key,
        "X-AUTH-SIGNATURE": signature,
      },
      json: true,
      body: body,
    };

    request.post(options, function (error: any, response: any, body: any) {
      if (error) {
        console.error("Error cancelling all orders:", error);
        reject(error);
      } else {
        console.log(body);
        console.log(response.statusCode);
      }
      resolve();
    });
  });
};
