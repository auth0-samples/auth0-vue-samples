# Scenario #2 - Calling a Backend API

This scenario demonstrates calling a backend API using the ID token provided during the authenticated flow. In this scenario, an [Express](https://expressjs.com/) server is started when running the project using `npm run dev`, and provides an API endpoint.

The endpoint requires an ID token to be provided in the `Authorization` header to be successful. In this case, the token is validated with the audience set to the Client ID of the Auth0 application, and an API entity is not required to exist for this to work.

## Configuration

The project needs to be configured with your Auth0 domain and client ID in order for the authentication flow to work. Both the front end and the back end need to be configured.

To do this, first copy `src/auth/auth0-variables.sample.js` into a new file in the same folder called `auth0-variables.js`, and replace the values within with your own Auth0 application credentials.

```js
// src/auth/auth0-variables.js

export default {
  domain: process.env.AUTH0_DOMAIN || "<YOUR AUTH0 DOMAIN>",
  clientId: process.env.AUTH0_CLIENT_ID || "<YOUR AUTH0 CLIENTID>",
  callbackUrl: "http://localhost:3000/callback"
};
```

Next, copy `.env.sample` in the root of the project, and enter values for the `AUTH0_DOMAIN` and `AUTH0_CLIENTID` fields. These should be the same values that are used in the `auth0-variables.js` file:

```
AUTH0_DOMAIN=<YOUR AUTH0 DOMAIN>
AUTH0_CLIENTID=<YOUR AUTH0 CLIENT ID>
```

## Deployment

To build the Docker image, run `exec.sh`

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and serves the Vue app, and starts the backend API server on port 3001

```
npm run dev
```

### Compiles and minifies for production

```
npm run build
```

### Run your tests

```
npm run test
```

### Lints and fixes files

```
npm run lint
```

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
