const config = require("./config").default
const BearerStrategy = require("passport-azure-ad").BearerStrategy;

const passportOptions = {
    identityMetadata: `https://${config.metadata.authority}/${config.credentials.tenantID}/${config.metadata.version}/${config.metadata.discovery}`,
    issuer: `https://sts.windows.net/${config.credentials.tenantID}/`,
    clientID: config.credentials.clientID,
    audience: "api://" + config.credentials.clientID,
    validateIssuer: config.settings.validateIssuer,
    passReqToCallback: config.settings.passReqToCallback,
    loggingLevel: config.settings.loggingLevel,
    scope: config.protectedRoutes.test.scopes,
  };

  const passportConfig = new BearerStrategy(
    passportOptions,
    (token: any, done: any) => {
      done(null, {}, token);
    }
  );


export default passportConfig;