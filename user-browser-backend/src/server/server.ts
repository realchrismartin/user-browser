const express = require("express");
const config = require("../config/config").default;
const passport = require("../config/passport").default;
const apiRouter = require("../router/apiRouter");
const samlRouter = require("../router/samlRouter");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
import { createSyntheticData } from "../util/dbUtils";

function run() {
  const expressApp = express();
  expressApp.set('trust proxy', 1); //Trust proxies
  expressApp.use(cors(config.cors));
  expressApp.use(cookieParser());
  expressApp.use(bodyParser.json());
  expressApp.use(bodyParser.urlencoded({extended: false}));
  expressApp.use(session(config.session));
  expressApp.use(passport.initialize());
  expressApp.use(passport.session());

  //Set up the SAML and login router
  expressApp.use(
    "/saml",
    samlRouter
  );

  //Set up the API router
  expressApp.use(
    "/api",
    (req : any, res : any, next: any) => {
      //Middleware: if the user is unauthenticated, refuse API requests
      if(req.user === undefined)
      {
        res.sendStatus(403);
        return;
      }
      next();
    },
    apiRouter
  );

  //Health check endpoint
  expressApp.use("/",(req:any,res:any) =>
  {
    res.sendStatus(200);
  });

  //Start the backend app
  expressApp.listen(config.port, () => {
    
    console.log("user-browser backend live on " + config.port);

    if(config.createSyntheticData)
    {
      createSyntheticData().then(dataCreated => {
        console.log(">>> Loaded synthetic data");
      }).catch((err : Error) => {
        console.log(">>> Skipped loading synthetic data: ",err);
      });
    }

  });
}

export default run;
