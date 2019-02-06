const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const { join } = require("path");

const app = express();

if (
  !process.env.AUTH0_DOMAIN ||
  !process.env.AUTH0_CLIENT_ID ||
  !process.env.AUTH0_AUDIENCE
) {
  throw "Make sure you have AUTH0_DOMAIN, AUTH0_AUDIENCE and AUTH0_CLIENT_ID in your .env file";
}

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.static(join(__dirname, "dist")));

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
  }),

  audience: [process.env.AUTH0_AUDIENCE],
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithm: ["RS256"]
});

app.get("/api/external", checkJwt, (req, res) => {
  res.send({
    msg: "Your access token was successfully validated!"
  });
});

app.use((_, res) => {
  res.sendFile(join(__dirname, "dist", "index.html"));
});

module.exports = app;
