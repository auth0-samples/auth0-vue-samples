# Auth0 - Vue.js

This repo shows how to implement Auth0 in a single page Vue.js application. It relies on [Vue components](http://vuejs.org/guide/components.html) so that **vue-router** can be used. The [Auth0 NodeJS API seed](https://github.com/auth0/node-auth0/tree/master/examples/nodejs-api) is used as a simple backend.

For an example of authentication in a modularized build system for Vue.js apps, which includes ES2015, Webpack, and vue-loader, see the [Vue JWT Authentication sample](https://github.com/auth0/vue-jwt-authentication).

## Installation

Clone the repo, then install the dependencies:

```bash
# Install dependencies
npm install
```

## Use Your Auth0 Account

If you haven't yet, create a [free Auth0 account](https://auth0.com/signup).

Enter your `AUTH0_CLIENT_ID` and `AUTH0_DOMAIN` when instantiating **Auth0Lock**.

```js
// app.js

var lock = new Auth0Lock('AUTH0_CLIENT_ID', 'AUTH0_DOMAIN');
```

Serve the app:

```bash
npm start
```

The app will be served at `localhost:8080`.

## Important Notes

This sample uses several ES2015 features like **template strings** and **arrow functions** without transpiling to ES5. These features are supported by modern browsers, but for full browser support in a production application, you will need to use a transpiler such as [Babel](https://babeljs.io/).

## What is Auth0?

Auth0 helps you to:

* Add authentication with [multiple authentication sources](https://docs.auth0.com/identityproviders), either social like **Google, Facebook, Microsoft Account, LinkedIn, GitHub, Twitter, Box, Salesforce, amont others**, or enterprise identity systems like **Windows Azure AD, Google Apps, Active Directory, ADFS or any SAML Identity Provider**.
* Add authentication through more traditional **[username/password databases](https://docs.auth0.com/mysql-connection-tutorial)**.
* Add support for **[linking different user accounts](https://docs.auth0.com/link-accounts)** with the same user.
* Support for generating signed [Json Web Tokens](https://docs.auth0.com/jwt) to call your APIs and **flow the user identity** securely.
* Analytics of how, when and where users are logging in.
* Pull data from other sources and add it to the user profile, through [JavaScript rules](https://docs.auth0.com/rules).

## Create a free Auth0 account

1. Go to [Auth0](https://auth0.com/signup) and click Sign Up.
2. Use Google, GitHub or Microsoft Account to login.

## Issue Reporting

If you have found a bug or if you have a feature request, please report them at this repository issues section. Please do not report security vulnerabilities on the public GitHub issue tracker. The [Responsible Disclosure Program](https://auth0.com/whitehat) details the procedure for disclosing security issues.

## Author

[Auth0](auth0.com)

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more info.
