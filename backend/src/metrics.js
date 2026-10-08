const client = require("prom-client");

const register = new client.Registry();
client.collectDefaultMetrics({ register });

const httpRequests = new client.Counter({
  name: "hotel_api_http_requests_total",
  help: "Total HTTP requests received by the hotel API",
  labelNames: ["method", "route", "status"]
});

register.registerMetric(httpRequests);

module.exports = { register, httpRequests };
