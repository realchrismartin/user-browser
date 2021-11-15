const express = require("express");
const passport = require("passport");
const cors = require("cors");
const config = require("../config/config").default;
const passportConfig = require("../config/passportConfig").default
const apiRouter = require("../router/apiRouter");

function run() {
  const expressApp = express();
  passport.use(passportConfig);
  expressApp.use(passport.initialize());
  expressApp.use(cors());

  expressApp.use(
    "/api",
    passport.authenticate("oauth-bearer", { session: false }),
    apiRouter
  );

  expressApp.listen(config.port, () => {
    console.log("user-browser backend live on " + config.port);
  });
}

export default run;
