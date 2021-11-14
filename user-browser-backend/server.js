const express = require("express");
const passport = require("passport");
const cors = require("cors");
const config = require ("./config.js");
const router = require('./router.js');
const expressApp = express();
const BearerStrategy = require('passport-azure-ad').BearerStrategy;

const options = {
    identityMetadata: `https://${config.metadata.authority}/${config.credentials.tenantID}/${config.metadata.version}/${config.metadata.discovery}`,
    issuer: `https://sts.windows.net/${config.credentials.tenantID}/`,
    clientID: config.credentials.clientID,
    audience: 'api://' + config.credentials.clientID,
    validateIssuer: config.settings.validateIssuer,
    passReqToCallback: config.settings.passReqToCallback,
    loggingLevel: config.settings.loggingLevel,
    scope: config.protectedRoutes.test.scopes
};

const bearerStrategy = new BearerStrategy(options, (token, done) => {
    done(null, {}, token);
});

expressApp.use(cors());
expressApp.use(passport.initialize())
passport.use(bearerStrategy)

expressApp.use('/api',
    passport.authenticate('oauth-bearer', { session: false }), 
    router
);

expressApp.listen(config.port,() => {
    console.log("user-browser backend live on " + config.port);
});