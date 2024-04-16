<div align="center">

  <h1>User Browser</h1>
  
  <p>
  A web application that provides an interface for managing users (a.k.a. "people") 
  </p>

</div>

![screenshot](preview.png)

# Table of Contents

- [About the Project](#about-the-project)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Usage](#usage)

## About the Project

The intended purpose of this project was to provide a proof-of-concept for a replacement of a specific enterprise software component whose purpose was to provide interactive IAM services to administrator users of a larger system. Administrator users needed to be able to manage permissions and metadata for a large number of principals/users/people in a helpful user interface.

This project was also an excuse to explore React Hooks as an alternative to Redux for front-end state management. Moreover, it provided a convenient avenue to play with pagination concepts and SAML claims-based authentication!

Not all of the functionality in this project is completed. Specifically, writing data to individual user records remains unimplemented, and functionality related to "group" management is nonfunctional.

### Tech Stack

<img src="https://img.shields.io/badge/Typescript" alt="language" />
<img src="https://img.shields.io/badge/React.js" alt="library" />
<img src="https://img.shields.io/badge/Node.js" alt="library" />
<img src="https://img.shields.io/badge/Passport.js" alt="library" />

### Features

- Log in using any SAML IDP (identity provider)
- View and review the properties of individual users
- Search among all users in the system to find those users with specific properties

### Usage 
This project is packaged using `docker-compose`. A few minor modifications are required prior to running it:

* Create a SAML Identity Provider configuration. This has been tested using Azure Entra ID and Atlassian Crowd, but any provider should work. Specifically, set:

* * `Entity ID` to some value. This will be used as the IDP_ISSUER below.
* * `Assertion Consumer Service URL` to `http://localhost:8080/saml/consume`

* Copy the `Identity provider single sign-on URL` value for use below as the IDP_LOGIN_URL.

* Copy the `certificate` value, remove all line endings and the ===BEGIN=== and ===END=== tags. This will be used as the IDP_CERT below.

* Update `compose.yml` to specify the following env variable values if not already set:

`NODE_APP_SUB_FRONTEND_URL` to "http://localhost"

`NODE_APP_SUB_BACKEND_URL` to "http://localhost:8080"

`NODE_APP_SUB_INSECURE_COOKIES` to "true". This setting should be "false" if deploying using SSL.

`NODE_APP_SUB_IDP_LOGIN_URL` to the `Identity provider single sign-on URL` copied above.

`NODE_APP_SUB_IDP_LOGOUT_URL` the logout URL noted in the IDP configuration.

`NODE_APP_SUB_CREATE_DATA` to "yes" to create fake/synthetic data for testing purposes, or "no" to not create data.

`NODE_APP_SUB_IDP_ISSUER` to the Entity ID specified above.

`NODE_APP_SUB_IDP_CERT` to the certificate value specified above.

* Run the application components in Compose: `docker compose up`
