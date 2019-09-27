# Scenario #2 - Calling an External API

For this scenario, an API endpoint `/api/external` has been included in the Express server that requires a bearer token to be supplied as a bearer token in the `Authorization` header (as provided during the authentication flow). This uses the [`express-jwt`](https://github.com/auth0/express-jwt) middleware to validate the token against the identifier of your API as set up in the Auth0 dashboard, as well as checking that the signature is valid.

## Project setup

```bash
npm install
```

### Configuration

The project needs to be configured with your Auth0 domain and client ID in order for the authentication flow to work.

To do this, first copy `auth_config.sample.json` into a new file in the same folder called `auth_config.json`, and replace the values within with your own Auth0 application credentials:

```json
{
  "domain": "<YOUR AUTH0 DOMAIN>",
  "audience": "<YOUR AUTH0 API IDENTIFIER>",
  "clientId": "<YOUR AUTH0 CLIENT ID>"
}
```

### Running in development

This compiles and serves the Vue app, and starts the backend API server on port 3001:

```bash
npm run dev
```

## Deployment

### Compiles and minifies for production

```bash
npm run build
```

### Docker build

To build the Docker image run `exec.sh`, or `exec.ps1` on Windows.

### Run your tests

```bash
npm run test
```

### Lints and fixes files

```bash
npm run lint
```

## Tutorial

Most single-page apps use resources from data APIs. You may want to restrict access to those resources, so that only authenticated users with sufficient privileges can access them. Auth0 lets you manage access to these resources using [API Authorization](/api-auth).

This tutorial shows you how to create a simple API using [Express](https://expressjs.com) that validates incoming JSON Web Tokens. You will then see how to call this API using an Access Token granted by the Auth0 authorization server.

### Create an API

In the [APIs section](https://manage.auth0.com/#/apis) of the Auth0 dashboard, click **Create API**. Provide a name and an identifier for your API.
You will use the identifier later when you're configuring your Javascript Auth0 application instance.
For **Signing Algorithm**, select **RS256**.

![Create API](../docs/create-api.png)

### Create the Backend API

For this example, you'll create an [Express](https://expressjs.com/) server that acts as the backend API. This API will expose an endpoint to validate incoming ID Tokens before returning a response.

Start by installing the following packages:

```bash
npm install express express-jwt jwks-rsa npm-run-all
```

- [`express`](https://github.com/expressjs/express) - a lightweight web server for Node
- [`express-jwt`](https://www.npmjs.com/package/express-jwt) - middleware to validate JsonWebTokens
- [`jwks-rsa`](https://www.npmjs.com/package/jwks-rsa) - retrieves RSA signing keys from a JWKS endpoint
- [`npm-run-all`](https://www.npmjs.com/package/npm-run-all) - a helper to run the SPA and backend API concurrently

Next, create a new file `server.js` with the following code:

```js
const express = require("express");
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");

// Create a new Express app
const app = express();

// Set up Auth0 configuration
const authConfig = {
  domain: "<YOUR AUTH0 DOMAIN>",
  audience: "<YOUR AUTH0 API IDENTIFIER>"
};

// Define middleware that validates incoming bearer tokens
// using JWKS
const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`
  }),

  audience: authConfig.audience,
  issuer: `https://${authConfig.domain}"/`,
  algorithm: ["RS256"]
});

// Define an endpoint that must be called with an access token
app.get("/api/external", checkJwt, (req, res) => {
  res.send({
    msg: "Your Access Token was successfully validated!"
  });
});

// Start the app
app.listen(3001, () => console.log("API listening on 3001"));
```

The above API has one available endpoint, `/api/external`, that returns a JSON response to the caller. This endpoint uses the `checkJwt` middleware to validate the supplied bearer token using your tenant's [JSON Web Key Set](https://auth0.com/docs/jwks). If the token is valid, the request is allowed to continue. Otherwise, the server returns a 401 Unauthorized response.

### Set up a proxy to the backend API

In order to call the API from the frontend application, the development server must be configured to proxy requests through to the backend API. To do this, add a `vue.config.js` file to the root of the project and populate it with the following code:

```js
// vue.config.js

module.exports = {
  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:3001"
      }
    }
  }
};
```

> **Note** This assumes that your project was created using [Vue CLI 3](https://cli.vuejs.org/guide/). If your project was not created in the same way, the above should be included as part of your Webpack configuration.

With this in place, the frontend application can make a request to `/api/external` and it will be correctly proxied through to the backend API at `http://localhost:3001/api/external`.

### Modify the AuthService Class

To start, open `authService.js` and make the necessary changes to the class to support retrieving an Access Token from the authorization server and exposing that token from a method.

First of all, open `auth_config.json` in the root of the project and make sure that a value for `audience` is exported along with the other settings:

```json
{
  "domain": "<YOUR AUTH0 DOMAIN>",
  "clientId": "<YOUR AUTH0 CLIENT ID>",
  "audience": "<YOUR AUTH0 API IDENTIFIER>"
}
```

Then, modify the `webAuth` creation to include `token` in the response type and add in the API identifier as the `audience` value:

```js
// src/auth/authService.js

const webAuth = new auth0.WebAuth({
  domain: authConfig.domain,
  redirectUri: `${window.location.origin}/callback`,
  clientID: authConfig.clientId,
  audience: authConfig.audience, // add the audience
  responseType: "token id_token", // request 'token' as well as 'id_token'
  scope: "openid profile email"
});
```

> **Note** Setting the `responseType` field to "token id_token" will cause the authorization server to return both the Access Token and the ID Token in a URL fragment.

Next, modify the `AuthService` class to include fields to store the Access Token and the time that the Access Token will expire:

```js
// src/auth/authService.js

class AuthService extends EventEmitter {
  idToken = null;
  profile = null;
  tokenExpiry = null;

  // Add fields here to store the Access Token and the expiry time
  accessToken = null;
  accessTokenExpiry = null;

  // .. other fields and methods
}
```

Modify the `localLogin` function to record the Access Token and Access Token expiry:

```js
localLogin(authResult) {
    this.idToken = authResult.idToken;
    this.profile = authResult.idTokenPayload;
    this.tokenExpiry = new Date(this.profile.exp * 1000);

    // NEW - Save the Access Token and expiry time in memory
    this.accessToken = authResult.accessToken;

    // Convert expiresIn to milliseconds and add the current time
    // (expiresIn is a relative timestamp, but an absolute time is desired)
    this.accessTokenExpiry = new Date(Date.now() + authResult.expiresIn * 1000);

    localStorage.setItem(localStorageKey, 'true');

    this.emit(loginEvent, {
      loggedIn: true,
      profile: authResult.idTokenPayload,
      state: authResult.appState
    });
  }
```

Finally, add two methods to the class that validate the Access Token and provide access to the token itself:

```js
// src/auth/authService.js

class AuthService extends EventEmitter {
  // ... other methods

  isAccessTokenValid() {
    return (
      this.accessToken &&
      this.accessTokenExpiry &&
      Date.now() < this.accessTokenExpiry
    );
  }

  getAccessToken() {
    return new Promise((resolve, reject) => {
      if (this.isAccessTokenValid()) {
        resolve(this.accessToken);
      } else {
        this.renewTokens().then(authResult => {
          resolve(authResult.accessToken);
        }, reject);
      }
    });
  }
}
```

> **Note** If `getAccessToken` is called and the Access Token is no longer valid, a new token will be retrieved automatically by calling `renewTokens`.

### Call the API Using an Access Token

The frontend Vue.js application should be modified to include a page that calls the API using an Access Token. Similar to the previous tutorial, this includes modifying the Vue router and adding a new view with a button that calls the API.

### Add a new page

First, install the [`axios`](https://www.npmjs.com/package/axios) HTTP library, which will allow us to make HTTP calls out to the backend API:

```bash
npm install --save-dev axios
```

Next, create a new file `ExternalApi.vue` inside the `views` folder, with the following content:

```js
<!-- src/views/ExternalApi.vue -->
<template>
 <div>
    <div>
      <h1>External API</h1>
      <p>Ping an external API by clicking the button below. This will call the external API using an access token, and the API will validate it using
        the API's audience value.
      </p>

      <button @click="callApi">Ping</button>
    </div>

    <div v-if="apiMessage">
      <h2>Result</h2>
      <p>{{ apiMessage }}</p>
    </div>

 </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "Api",
  data() {
    return {
      apiMessage: null
    };
  },
  methods: {
    async callApi() {
      const accessToken = await this.$auth.getAccessToken();

      try {
        const { data } = await axios.get("/api/external", {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });

        this.apiMessage = data.msg;
      } catch (e) {
        this.apiMessage = `Error: the server responded with '${ e.response.status }: ${e.response.statusText}'`; }
    }
  }
};
</script>
```

Modify the Vue router to include a route to this new page whenever the `/external-api` URL is accessed:

```js
// src/router.js

// .. other imports

// NEW - import the view for calling the API
import ExternalApiView from "./views/ExternalApi.vue";

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    // ... other routes,

    // NEW - add a new route for the new page
    {
      path: "/external-api",
      name: "external-api",
      component: ExternalApiView
    }
  ]
});
```

Finally, modify the navigation bar to include a link to the new page:

```html
<!-- src/App.vue -->

<ul>
  <li>
    <router-link to="/">Home</router-link>
  </li>
  <li v-if="!isAuthenticated">
    <a href="#" @click.prevent="login">Login</a>
  </li>
  <li v-if="isAuthenticated">
    <router-link to="/profile">Profile</router-link>
  </li>

  <!-- new link to /external-api - only show if authenticated -->
  <li v-if="isAuthenticated">
    <router-link to="/external-api">External API</router-link>
  </li>
  <!-- /external-api -->

  <li v-if="isAuthenticated">
    <a href="#" @click.prevent="logout">Log out</a>
  </li>
</ul>
```

Now you will be able to run the application, browse to the "External API" page and press the "Ping" button. The application will make a call to the external API endpoint and produce a message on the screen that says "Your Access Token was successfully validated!".

## What is Auth0?

Auth0 helps you to:

- Add authentication with [multiple authentication sources](https://docs.auth0.com/identityproviders), either social like **Google, Facebook, Microsoft Account, LinkedIn, GitHub, Twitter, Box, Salesforce, among others**, or enterprise identity systems like **Windows Azure AD, Google Apps, Active Directory, ADFS or any SAML Identity Provider**.
- Add authentication through more traditional **[username/password databases](https://docs.auth0.com/mysql-connection-tutorial)**.
- Add support for **[linking different user accounts](https://docs.auth0.com/link-accounts)** with the same user.
- Support for generating signed [Json Web Tokens](https://docs.auth0.com/jwt) to call your APIs and **flow the user identity** securely.
- Analytics of how, when and where users are logging in.
- Pull data from other sources and add it to the user profile, through [JavaScript rules](https://docs.auth0.com/rules).

## Create a Free Auth0 Account

1. Go to [Auth0](https://auth0.com/signup) and click Sign Up.
2. Use Google, GitHub or Microsoft Account to login.

## Issue Reporting

If you have found a bug or if you have a feature request, please report them at this repository issues section. Please do not report security vulnerabilities on the public GitHub issue tracker. The [Responsible Disclosure Program](https://auth0.com/whitehat) details the procedure for disclosing security issues.

## Author

[Auth0](https://auth0.com)

## License

This project is licensed under the MIT license. See the [LICENSE](../LICENSE) file for more info.
