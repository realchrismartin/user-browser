const config = {
  port: 8080,
  credentials: {
    tenantID: process.env.NODE_APP_SUB_TENANT_ID,
    clientID: process.env.NODE_APP_SUB_CLIENT_ID,
  },
  permissionConfig: {
    write: [process.env.REACT_APP_SUB_WRITE_SG_ID],
    admin: [process.env.REACT_APP_SUB_ADMIN_SG_ID]
  },
  metadata: {
    authority: "login.microsoftonline.com",
    discovery: ".well-known/openid-configuration",
    version: "v2.0",
  },
  settings: {
    validateIssuer: true,
    passReqToCallback: false,
    loggingLevel: "info",
  },
  protectedRoutes: {
    test: {
      endpoint: "/api",
      scopes: ["Test"],
    },
  },
  sqlConfig: {
    user: process.env.NODE_APP_SUB_SQL_USERNAME,
    password: process.env.NODE_APP_SUB_SQL_PASSWORD,
    database: process.env.NODE_APP_SUB_SQL_DATABASE,
    server: process.env.NODE_APP_SUB_SQL_HOSTNAME,
    usersQuery: "select * from dbo.users",
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000,
    },
    options: {
      encrypt: false,
      trustServerCertificate: false,
    },
  },
};

export default config;