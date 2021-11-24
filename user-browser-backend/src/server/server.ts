import cors from "../config/cors";
const express = require("express");
const config = require("../config/config").default;
const passport = require("../config/passport").default;
const apiRouter = require("../router/apiRouter");

function run() {
  const expressApp = express();
  expressApp.use(passport.initialize());
  expressApp.use(cors);
  expressApp.use(
    "/api",
    passport.authenticate("oauth-bearer", { session: true }),
    apiRouter
  );

  expressApp.listen(config.port, () => {
    console.log("user-browser backend live on " + config.port);
  });
}

export default run;
