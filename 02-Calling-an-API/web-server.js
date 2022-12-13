const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const { auth } = require("express-oauth2-jwt-bearer");
const { join } = require("path");
const authConfig = require("./auth_config.json");

const app = express();

if (!authConfig.domain || !authConfig.authorizationParams.audience) {
  throw "Please make sure that auth_config.json is in place and populated";
}

app.use(morgan("dev"));
app.use(cors());
app.use(express.static(join(__dirname, "dist")));

const checkJwt = auth({
  audience: authConfig.authorizationParams.audience,
  issuerBaseURL: `https://${authConfig.domain}`,
});

app.get("/api/external", checkJwt, (req, res) => {
  res.send({
    msg: "Your access token was successfully validated!"
  });
});

if (process.env.NODE_ENV === "production") {
  app.use((_, res) => {
    res.sendFile(join(__dirname, "dist", "index.html"));
  });
}
const port = process.env.NODE_ENV === "production" ? 3000 : 3001;
app.listen(port, () => console.log(`Server listening on port ${port}`));