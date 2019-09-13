# Scenario #1 - Logging In and Gated Content

This sample demonstrates:

- Logging in to Auth0 using Redirect Mode
- Accessing profile information that has been provided in the ID token
- Gated content. The `/profile` route is not accessible without having first logged in

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
  "clientId": "<YOUR AUTH0 CLIENT ID>"
}
```

### Compiles and hot-reloads for development

```bash
npm run serve
```

## Deployment

### Compiles and minifies for production

```bash
npm run build
```

### Docker build

To build and run the Docker image, run `exec.sh`, or `exec.ps1` on Windows.

### Run your tests

```bash
npm run test
```

### Lints and fixes files

```bash
npm run lint
```

## Tutorial

What follows is a tutorial which demonstrates how to create a VueJS application that uses `auth0-js` for authentication.

### Get Your Application Keys

When you signed up for Auth0, a new application was created for you, or you could have created a new one.

You will need some details about that application to communicate with Auth0. You can get these details from your SPA app configuration settings in the [Auth0 dashboard](https://manage.auth0.com/#/applications).

You need the following information:

- **Domain**
- **Client ID**

> **Note** If you download the sample from the top of this page these details are filled out for you.

If you have more than one application in your account, the sample comes with the values for your **Default App**.

![Auth0 Client Settings](../docs/client_settings.png)

### Configure Callback URLs

A callback URL is a URL in your application where Auth0 redirects the user after they have authenticated.

The callback URL for your app must be whitelisted in the **Allowed Callback URLs** field in your [Application Settings](https://manage.auth0.com/#/applications). If this field is not set, users will be unable to log in to the application and will get an error.

> **Note** If you are following along with the sample project you downloaded from the top of this page, you should set the **Allowed Callback URL** to `http://localhost:3000/callback`.

### Configure Logout URLs

A logout URL is a URL in your application that Auth0 can return to after the user has been logged out of the authorization server. This is specified in the `returnTo` query parameter.

The logout URL for your app must be whitelisted in the **Allowed Callback URLs** field in your [Application Settings](https://manage.auth0.com/#/applications). If this field is not set, users will be unable to log in to the application and will get an error.

> **Note** If you are following along with the sample project you downloaded from the top of this page, the logout URL you need to whitelist in the **Allowed Logout URLs** field is `http://localhost:3000`.

### Configure Allowed Web Origins

You need to whitelist the URL for your app in the **Allowed Web Origins** field in your [Application Settings](https://manage.auth0.com/#/applications). If you don't whitelist your application URL, the application will be unable to automatically refresh the authentication tokens and your users will be logged out the next time they visit the application, or refresh the page.

> **Note** If you are following along with the sample project you downloaded from the top of this page, you should set the **Allowed Web Origins** to `http://localhost:3000`.

## Integrate Auth0 in your Application

### Loading auth0.js

You need the auth0.js library to integrate Auth0 into your application. To do this, install the dependency into your project using `npm`:

```bash
npm install auth0-js
```

### Authenticate with Auth0

[Universal Login](/hosted-pages/login) is the easiest way to set up authentication in your application. We recommend using it for the best experience, best security and the fullest array of features. This guide will use it to provide a way for your users to log in to your \${library} application.

> **Note** You can also embed the login dialog directly in your application using the [Lock widget](/lock). If you use this method, some features, such as single sign-on, will not be accessible.

When a user logs in, Auth0 returns three items:

- `access_token`: to learn more, see the [Access Token documentation](/tokens/access-tokens)
- `id_token`: to learn more, see the [ID Token documentation](/tokens/id-tokens)
- `expires_in`: the number of seconds before the Access Token expires

You can use these items in your application to set up and manage authentication.

### Create an Authentication Service

The best way to manage and coordinate the tasks necessary for user authentication is to create a reusable service. With the service in place, you will be able to call its methods throughout your application. The name for it is at your discretion, but in these examples it will be called `AuthService` and the filename will be `authService.js`. An instance of the `WebAuth` object from **auth0.js** can be created in the service.

Create a service and instantiate `auth0.WebAuth`. Provide a method called `login` which calls the `authorize` method from auth0.js:

```js
// src/auth/authService.js

import auth0 from "auth0-js";
import EventEmitter from "events";
import authConfig from "../../auth_config.json";

const webAuth = new auth0.WebAuth({
  domain: authConfig.domain,
  redirectUri: `<%= "${window.location.origin}" %>/callback`,
  clientID: authConfig.clientId,
  responseType: "id_token",
  scope: "openid profile email"
});

class AuthService extends EventEmitter {
  // Starts the user login flow
  login(customState) {
    webAuth.authorize({
      appState: customState
    });
  }
}

export default new AuthService();
```

> **Note** The `login` method has been setup to support specifing custom state that will be returned to the application after authentication. This will come into play later when you start adding protected routes.

To provide the values for `clientID`, `callbackUrl`, and `domain`, create a new file `auth_config.json` in the root directory of the application alongside your `package.json` file, and populate it with your tenant values:

```json
{
  "domain": "<YOUR AUTH0 DOMAIN>",
  "clientId": "<YOUR AUTH0 CLIENT ID>"
}
```

> **Checkpoint:** Try calling the `login` method from somewhere in your application. This could be from a button click or in some lifecycle event; just something that will trigger the method so you can see the login page.

![hosted login](../docs/hosted-login.png)

## Handle Authentication Tokens

Add some additional methods to `AuthService` to fully handle authentication in the app:

```js
// src/auth/authService.js

// Other imports and WebAuth declaration..

const localStorageKey = "loggedIn";
const loginEvent = "loginEvent";

class AuthService extends EventEmitter {
  idToken = null;
  profile = null;
  tokenExpiry = null;

  // Starts the user login flow
  login(customState) {
    webAuth.authorize({
      appState: customState
    });
  }

  // Handles the callback request from Auth0
  handleAuthentication() {
    return new Promise((resolve, reject) => {
      webAuth.parseHash((err, authResult) => {
        if (err) {
          reject(err);
        } else {
          this.localLogin(authResult);
          resolve(authResult.idToken);
        }
      });
    });
  }

  localLogin(authResult) {
    this.idToken = authResult.idToken;
    this.profile = authResult.idTokenPayload;

    // Convert the JWT expiry time from seconds to milliseconds
    this.tokenExpiry = new Date(this.profile.exp * 1000);

    localStorage.setItem(localStorageKey, "true");

    this.emit(loginEvent, {
      loggedIn: true,
      profile: authResult.idTokenPayload,
      state: authResult.appState || {}
    });
  }

  renewTokens() {
    return new Promise((resolve, reject) => {
      if (localStorage.getItem(localStorageKey) !== "true") {
        return reject("Not logged in");
      }

      webAuth.checkSession({}, (err, authResult) => {
        if (err) {
          reject(err);
        } else {
          this.localLogin(authResult);
          resolve(authResult);
        }
      });
    });
  }

  logOut() {
    localStorage.removeItem(localStorageKey);

    this.idToken = null;
    this.tokenExpiry = null;
    this.profile = null;

    webAuth.logout({
      returnTo: window.location.origin
    });

    this.emit(loginEvent, { loggedIn: false });
  }

  isAuthenticated() {
    return (
      Date.now() < this.tokenExpiry &&
      localStorage.getItem(localStorageKey) === "true"
    );
  }
}

export default new AuthService();
```

The service now includes several other methods for handling authentication.

- `handleAuthentication` - looks for an authentication result in the URL hash and processes it with the `parseHash` method from auth0.js
- `localLogin` - sets the user's ID Token, and a time at which the ID Token will expire. The expiry time is converted to milliseconds so that the native JavaScript `Date` object can be used
- `renewTokens` - uses the `checkSession` method from auth0.js to renew the user's authentication status, and calls `localLogin` if the login session is still valid
- `logout` - removes the user's tokens from memory. It also calls `webAuth.logout` to log the user out at the authorization server
- `isAuthenticated` - checks whether the local storage flag is present and equals "true", and that the expiry time for the ID Token has passed

### About the Authentication Service

When you set up the `AuthService` service, you create an instance of the `auth0.WebAuth` object. In that instance, you can define the following:

- Configuration for your application and domain
- Response type, to show that you need a user's ID Token after authentication
- The URL where you want to redirect your users after authentication.

> **Note** In this tutorial, the route is `/callback`, which is implemented in the [Add a Callback Component](#add-a-callback-component) step.

Your users authenticate via Universal Login, at the login page. They are then redirected back to your application. Their redirect URLs contain hash fragments with the user's ID token.

You can get the tokens from the URL using the `parseHash` method in the auth0.js library. You can then set up the login session using the `localLogin` method. The `localLogin` method uses the `exp` value from the ID Token payload to calculate when the user's ID Token expires.

Authentication using JSON Web Tokens is stateless. This means that when you use it, no information about the user's session is stored on your server.

To set up a session for the user on the client side, save the `id_token` value into memory, and write a flag to local storage to indicate that the user is logged in.

To log the user out, remove the `id_token` value from memory and remove the flag from local storage.

You need to provide a way for your application to recognize if the user is authenticated. To do that, use the `isAuthenticated` method to check if the user's ID Token has expired. The user is no longer authenticated when the expiry time of their ID Token passes.

### Create a Vue Plugin

So that the authentication service may be passed around easily to each component, create a Vue.js plugin that will inject the service into everywhere that needs it:

```js
// src/plugins/auth.js

import authService from "../auth/authService";

export default {
  install(Vue) {
    Vue.prototype.$auth = authService;

    Vue.mixin({
      created() {
        if (this.handleLoginEvent) {
          authService.addListener("loginEvent", this.handleLoginEvent);
        }
      },

      destroyed() {
        if (this.handleLoginEvent) {
          authService.removeListener("loginEvent", this.handleLoginEvent);
        }
      }
    });
  }
};
```

This plugin provides access to the `AuthService` class from each component, through the `this.$auth` property. It also provides a mechanism for when the login state changes, for components that implement a `handleLoginEvent` method.

Open `main.js` and install the plugin:

```js
// src/main.js

import Vue from "vue";
import App from "./App.vue";

// Import the plugin here
import AuthPlugin from "./plugins/auth";

// Install the authentication plugin here
Vue.use(AuthPlugin);

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
```

### Provide a Login Control

Provide a component with controls for the user to log in and log out.

> **Note** This example was created from a [Vue CLI](https://cli.vuejs.org/) template and uses Single-File Components.

```js
// src/App.vue

<template>
  <div>
    <nav>
      <div>
        <a href="#">Auth0 - Vue</a>
      </div>

      <ul>
        <li>
          <router-link to="/">Home</router-link>
        </li>
        <li v-if="!isAuthenticated">
          <a href="#" @click.prevent="login">Login</a>
        </li>
        <li v-if="isAuthenticated">
          <a href="#" @click.prevent="logout">Log out</a>
        </li>
      </ul>
  </nav>

    <div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {
      isAuthenticated: false
    };
  },
  async created() {
    try {
      await this.$auth.renewTokens();
    } catch (e) {
      console.log(e);
    }
  },
  methods: {
    login() {
      this.$auth.login();
    },
    logout() {
      this.$auth.logOut();
    },
    handleLoginEvent(data) {
      this.isAuthenticated = data.loggedIn;
      this.profile = data.profile;
    }
  }
};
</script>
```

The `@click` events on the **Log In** and **Log Out** buttons make the appropriate calls to the `AuthService` to allow the user to log in and log out. Notice that these buttons are conditionally hidden and shown depending on whether or not the user is currently authenticated.

Also notice the use of `this.$auth` to access the `AuthService` instance. Login events can be handled by providing a `handleLoginEvent` method on any component.

When the **Log In** button is clicked, the user will be redirected to login page.

> **Note** The login page uses the Lock widget. To learn more about Universal Login and the login page, see the [Universal Login documentation](https://auth0.com/docs/hosted-pages/login). To customize the look and feel of the Lock widget, see the [Lock customization options documentation](https://auth0.com/docs/libraries/lock/v10/customization).

When the application first starts up, a call to `renewTokens` is made that tries to reinitialize the user's login session, if it is detected that they should already be logged in. This would be the case, for example, if the user logged in and then refreshed the browser window.

### Add a Callback Component

Using Universal Login means that users are taken away from your application to a login page hosted by Auth0. After they successfully authenticate, they are returned to your application where a client-side session is set for them.

You can select any URL in your application for your users to return to. We recommend creating a dedicated callback route.
If you create a single callback route:

- You don't have to whitelist many, sometimes unknown, callback URLs.
- You can display a loading indicator while the application sets up a client-side session.

When a user authenticates at the login page and is then redirected back to your application, their authentication information will be contained in a URL hash fragment. The `handleAuthentication` method in the `AuthService` is responsible for processing the hash.

Install `vue-router` to allow callbacks to be routed properly to the `Callback` component:

```bash
npm install vue-router
```

Create a component named `Callback` and populate it with a loading indicator. The component should also call `handleAuthentication` from the `AuthService`.

```js
<!-- src/components/Callback.vue -->

<template>
  <div>
    <p>Loading...</p>
  </div>
</template>

<script>
export default {
  methods: {
    handleLoginEvent(data) {
      this.$router.push(data.state.target || "/");
    }
  },
  created() {
    this.$auth.handleAuthentication();
  }
};
</script>
```

Add a new file `router.js` inside the `src` folder with the following content:

```js
// src/router.js

import Vue from "vue";
import Router from "vue-router";
import Callback from "./components/Callback";

Vue.use(Router);

const routes = [
  {
    path: "/callback",
    name: "callback",
    component: Callback
  }
];

const router = new Router({
  mode: "history",
  routes
});

export default router;
```

> **Note** This example relies on using path-based routing with `mode: 'history'`. If you are using hash-based routing, you won't be able to specify a dedicated callback route because the URL hash will be used to hold the user's authentication information.

Updated `main.js` to register the router:

```js
// src/main.js

import Vue from "vue";
import App from "./App.vue";
import AuthPlugin from "./plugins/auth";

// NEW - import the router
import router from "./router";

Vue.use(AuthPlugin);

Vue.config.productionTip = false;

new Vue({
  router, // NEW - register the routes with the application
  render: h => h(App)
}).$mount("#app");
```

After authentication, users will be taken to the `/callback` route for a brief time where they will be shown a loading indicator. Their client-side session will be set during this time, after which they will be redirected to the `/` route.

## Display the User's Profile

The `AuthService` has already extracted the user's profile information and stored it in memory, and can be accessed using `this.$auth.profile` from inside a Vue component.

To display the profile information, create a new component `Profile` in the `views` folder:

```js
<!-- src/views/Profile.vue -->

<template>
  <div v-if="profile">
    <div>
      <div>
        <img :src="profile.picture">
      </div>
      <div>
        <h2>{{ profile.name }}</h2>
        <p>{{ profile.email }}</p>
      </div>
    </div>

    <div>
      <pre>{{ JSON.stringify(profile, null, 2) }}</pre>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      profile: this.$auth.profile
    };
  },
  methods: {
    handleLoginEvent(data) {
      this.profile = data.profile;
    }
  }
};
</script>
```

Import the `Profile` component into `router.js` and then modify the routes list so that the `Profile` component is mapped to `/profile`:

```js
// src/router.js

//.. other imports
import Profile from "./views/Profile.vue";

const routes = [
  {
    path: "/callback",
    name: "callback",
    component: Callback
  },

  // NEW - add the route to the /profile component
  {
    path: "/profile",
    name: "profile",
    component: Profile
  }
];

// Unchanged code
const router = new VueRouter({
  mode: "history",
  routes
});

export default router;
```

Then add the `/profile` route to your navigation bar by inserting a new `<li>` element into the navigation bar structure:

```html
<li>
  <router-link to="/">Home</router-link>
</li>
<li v-if="!isAuthenticated">
  <a href="#" @click.prevent="login">Login</a>
</li>

<!-- new link to /profile - only show if authenticated -->
<li v-if="isAuthenticated">
  <router-link to="/profile">Profile</router-link>
</li>
<!-- /profile -->

<li v-if="isAuthenticated">
  <a href="#" @click.prevent="logout">Log out</a>
</li>
```

### Securing the profile route

Even though the `/profile` route is only shown if the user is authenticated, the user could still manually type the URL into the browser and access the page if they have not logged in — although there will be nothing to see.

A catch-all rule can be added to the router so that access is only permitted if the user is logged in. If they are not logged in, they will be prompted to log in before being redirected to the location they tried to access in the first place.

Open `router.js` and add a rule that exhibits this behavior:

```js
// src/router.js

// .. other imports
import auth from "./auth/authService";

// .. routes list

// Existing router declaration
const router = new Router({
  mode: "history",
  routes
});

// NEW - add a `beforeEach` handler to each route
router.beforeEach((to, from, next) => {
  if (to.path === "/" || to.path === "/callback" || auth.isAuthenticated()) {
    return next();
  }

  // Specify the current path as the customState parameter, meaning it
  // will be returned to the application after auth
  auth.login({ target: to.path });
});

// Existing export
export default router;
```

Given this, any page that is not either the home page or the callback URL will cause the application to show the login prompt if the user is not authenticated.

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
