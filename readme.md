# Sentinel User Browser

# Running the development environment
* Create a Crowd (or other IDP) configuration and set:

* * `Entity ID` to some value. This will be used as the IDP_ISSUER below.
* * `Assertion Consumer Service URL` to `http://localhost:8080/saml/consume`

* Copy the `Identity provider single sign-on URL` value for use below as the IDP_LOGIN_URL.

* Copy the `certificate` value, remove all line endings and the ===BEGIN=== and ===END=== tags. This will be used as the IDP_CERT below.

* Update `compose.yml` to specify the following env variable values if not already set:

`NODE_APP_SUB_FRONTEND_URL` to "http://localhost"

`NODE_APP_SUB_BACKEND_URL` to "http://localhost:8080"

`NODE_APP_SUB_INSECURE_COOKIES` to "false" 

`NODE_APP_SUB_IDP_LOGIN_URL` to the `Identity provider single sign-on URL` copied above.

`NODE_APP_SUB_IDP_LOGOUT_URL` the logout URL for the IDP. For Crowd, this ends in `logoff.action`

`NODE_APP_SUB_CREATE_DATA` to "yes"

`NODE_APP_SUB_IDP_ISSUER` to the Entity ID specified above

`NODE_APP_SUB_IDP_CERT` to the certificate value specified above.

* `docker compose up --build` to fully rebuild and run. Note that you may need to stop the process and rerun when making API changes (rerunning this command should work OK for now)