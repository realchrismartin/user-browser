const config = {
  
  //Our app's configuration
  frontEndURL: process.env.NODE_APP_SUB_FRONTEND_URL || "http://localhost:3000",
  backEndURL: process.env.NODE_APP_SUB_BACKEND_URL || "http://localhost:8080",
  port: 8080, //What port the API serves on. TODO: hardcoded

  //Identity Provider configuration
  idpLogInURL: process.env.NODE_APP_SUB_IDP_LOGIN_URL || "https://changeme",
  idpLogOutURL: process.env.NODE_APP_SUB_IDP_LOGOUT_URL || "https://changemealso",

  //Whether we create test data on application start
  createSyntheticData: (process.env.NODE_APP_SUB_CREATE_DATA) !== undefined || false,

  //Permission configuration for the API
  //Used by routes to decide who gets to do what
  permissions: {
    write: [process.env.REACT_APP_SUB_WRITE_SG_ID],
    admin: [process.env.REACT_APP_SUB_ADMIN_SG_ID]
  },

  //Session configuration
  //Cookie settings sameSite: none and secure:true are required in order for SSO to work properly in a non-localhost setting
  session: {
    resave: true,
    saveUninitialized: true,
    secret: process.env.NODE_APP_SUB_SESSION_SECRET || "changeme",
    cookie: {
      maxAge: 24 * 60 * 60 * 2000,
      sameSite: (process.env.NODE_APP_SUB_INSECURE_COOKIES) === 'false' ? "none" : "lax",
      secure: (process.env.NODE_APP_SUB_INSECURE_COOKIES) === 'false' ? true : false
    }
  },

  //SQL Configuration
  sql: {
    user: process.env.NODE_APP_SUB_SQL_USERNAME || "sa", //User used to log into database
    password: process.env.NODE_APP_SUB_SQL_PASSWORD || "changeme", //Database user password
    database: process.env.NODE_APP_SUB_SQL_DATABASE || "tempdb", //Database used for the app
    server: process.env.NODE_APP_SUB_SQL_HOSTNAME || "localhost", //Hostname of the database. does NOT include a protocol or trailing slash.
    getUsersQuery: `select * from dbo.Users`,

    createTableQuery: `CREATE TABLE Users (
      UserID int,
      FirstName varchar(100),
      LastName varchar(100),
      Degree varchar(100),
      Company varchar(100),
      Title varchar(50),
      Email varchar(100),
      Phone varchar(10),
      FDACenter varchar(50),
      FDADivision varchar(50),
      PrincipalInvestigator bit,
      MainContact varchar(50),
      NPI1Location varchar(50),
      HPHCLogin varchar(50));`,

    createFakeDataQuery: `
      INSERT INTO [dbo].[Users]([UserID],[FirstName],[LastName],[Degree],[Company],[Title],[Email],[Phone],[FDACenter] ,[FDADivision] ,[PrincipalInvestigator] ,[MainContact] ,[NPI1Location] ,[HPHCLogin])
      VALUES
      (1,'FirstName','LastName' ,'Degree','Company','Title','user1@email.com','1-1','Center','Division',0,'6' ,'6' ,'6'),
      (2,'FirstName','LastName' ,'Degree','Company','Title','user2@email.com','1-1','Center','Division',0,'6' ,'6' ,'6'),
      (3,'FirstName','LastName' ,'Degree','Company','Title','user3@email.com','1-1','Center','Division',0,'6' ,'6' ,'6'),
      (4,'FirstName','LastName' ,'Degree','Company','Title','user4@email.com','1-1','Center','Division',0,'6' ,'6' ,'6'),
      (5,'FirstName','LastName' ,'Degree','Company','Title','user5@email.com','1-1','Center','Division',0,'6' ,'6' ,'6'),
      (6,'FirstName','LastName' ,'Degree','Company','Title','user6@email.com','1-1','Center','Division',0,'6' ,'6' ,'6'),
      (7,'FirstName','LastName' ,'Degree','Company','Title','user7@email.com','1-1','Center','Division',0,'6' ,'6' ,'6'),
      (8,'FirstName','LastName' ,'Degree','Company','Title','user8@email.com','1-1','Center','Division',0,'6' ,'6' ,'6'),
      (9,'FirstName','LastName' ,'Degree','Company','Title','user9@email.com','1-1','Center','Division',0,'6' ,'6' ,'6'),
      (10,'FirstName','LastName' ,'Degree','Company','Title','user10@email.com','1-1','Center','Division',0,'6' ,'6' ,'6'),
      (11,'FirstName','LastName' ,'Degree','Company','Title','user11@email.com','1-1','Center','Division',0,'6' ,'6' ,'6'),
      (12,'FirstName','LastName' ,'Degree','Company','Title','user12@email.com','1-1','Center','Division',0,'6' ,'6' ,'6')
      `,

    pool: {
      max: 1, 
      min: 0,
      idleTimeoutMillis: 30000,
    },
    options: {
      //Whether to encrypt the database traffic. Required for Azure PaaS databases.
      encrypt: (process.env.NODE_APP_SUB_SQL_ENCRYPT || "").length > 0 ? true : false,
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
      protocol: (process.env.NODE_APP_SUB_BACKEND_URL || "http://localhost").indexOf("https") > -1 ? "https" : "http",
      issuer: process.env.NODE_APP_SUB_IDP_ISSUER || "sentinel-user-browser", 
      cert: process.env.NODE_APP_SUB_IDP_CERT || "dontputarealcerthere"
    }
  },

  //CORS configuration - allow traffic from the front-end
  cors: {
    origin: [process.env.NODE_APP_SUB_FRONTEND_URL || "http://localhost"],
    credentials:true,
    methods:['GET', 'PUT', 'POST', 'OPTIONS'],
    allowedHeaders:['Content-Type','Authorization','Access-Control-Allow-Origin'],
    preflightContinue: true
  }
};

export default config;