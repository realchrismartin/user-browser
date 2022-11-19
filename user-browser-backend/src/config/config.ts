const config = {
  
  //Our app's configuration
  frontEndURL: process.env.NODE_APP_SUB_FRONTEND_URL || "http://localhost:3000",
  backEndURL: process.env.NODE_APP_SUB_BACKEND_URL || "http://localhost:8080",
  port: 8080, //What port the API serves on. TODO: hardcoded

  //Identity Provider configuration
  idpLogInURL: process.env.NODE_APP_SUB_IDP_LOGIN_URL || "https://changeme",
  idpLogOutURL: process.env.NODE_APP_SUB_IDP_LOGOUT_URL || "https://changemealso",

  //Permission configuration for the API
  //Used by routes to decide who gets to do what
  permissions: {
    write: [process.env.REACT_APP_SUB_WRITE_SG_ID],
    admin: [process.env.REACT_APP_SUB_ADMIN_SG_ID]
  },

  //Session configuration
  session: {
    resave: true,
    saveUninitialized: true,
    secret: process.env.NODE_APP_SUB_SESSION_SECRET || "changeme"
  },

  //SQL Configuration
  sql: {
    user: process.env.NODE_APP_SUB_SQL_USERNAME || "sa",
    password: process.env.NODE_APP_SUB_SQL_PASSWORD || "changeme",
    database: process.env.NODE_APP_SUB_SQL_DATABASE || "sqlex1",
    server: process.env.NODE_APP_SUB_SQL_HOSTNAME || "localhost:1433",
    usersQuery: "select * from dbo.users",
    pool: {
      max: 1, 
      min: 0,
      idleTimeoutMillis: 30000,
    },
    options: {
      encrypt: false,
      trustServerCertificate: false,
    },
  },

  //Passport configuration
  //These values normally correspond to the three properties associated with a consumer configured in an IDP.
  //However, we use a loopback endpoint instead of the actual IDP POST SAML endpoint
  //This is because the front-end needs to make the SAML AuthNRequest in order to survive CORS checks

  //Issuer is the entity id from the consumer configuration in the IDP
  //Cert is a PEM formatted private key from the consumer configuration in the IDP
  passport: {
    strategy: 'saml',
    saml: {
      entryPoint: (process.env.NODE_APP_SUB_BACKEND_URL || "http://localhost:8080") + '/saml/loopback', 
      issuer: process.env.NODE_APP_SUB_IDP_ISSUER || "sentinel-user-browser", 
      cert: process.env.NODE_APP_SUB_IDP_CERT || "dontputarealcerthere"
    }
  },

  //CORS configuration - allow traffic from the front-end
  cors: {
    origin: [process.env.NODE_APP_SUB_FRONTEND_URL || "http://localhost:3000"],
    credentials:true,
    methods:['GET', 'PUT', 'POST', 'OPTIONS'],
    allowedHeaders:['Content-Type','Authorization','Access-Control-Allow-Origin'],
    preflightContinue: true
  }
};

export default config;