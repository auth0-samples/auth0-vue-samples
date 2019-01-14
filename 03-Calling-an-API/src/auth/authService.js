import auth0 from "auth0-js";
import { EventEmitter } from "events";
import { AUTH_CONFIG } from "./auth0-variables";

const webAuth = new auth0.WebAuth({
  domain: AUTH_CONFIG.domain,
  redirectUri: AUTH_CONFIG.callbackUrl,
  clientID: AUTH_CONFIG.clientId,
  responseType: "token id_token",
  scope: "openid profile email",
  audience: AUTH_CONFIG.audience
});

const localStorageKey = "loggedIn";
const loginEvent = "loginEvent";

/*
 * Generates a secure string using the Cryptography API
 */
const generateSecureString = () => {
  const validChars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  let array = new Uint8Array(40);

  window.crypto.getRandomValues(array);
  array = array.map(x => validChars.charCodeAt(x % validChars.length));

  return String.fromCharCode.apply(null, array);
};

/*
 * Encodes the specified custom state along with a secure string,
 * then base64-encodes the result.
 */
const encodeState = customState => {
  const state = {
    secureString: generateSecureString(),
    customState: customState || {}
  };

  return btoa(JSON.stringify(state));
};

/*
 * Decodes the state variable from the authentication result, then
 * returns the custom state within
 */
const decodeState = authResult => {
  let parsedState = {};

  try {
    parsedState = JSON.parse(atob(authResult.state));
  } catch (e) {
    parsedState = {};
  }

  return parsedState.customState;
};

class AuthService extends EventEmitter {
  idToken = null;
  accessToken = null;
  profile = null;
  tokenExpiry = null;
  accessTokenExpiry = null;

  login(customState) {
    webAuth.authorize({
      state: encodeState(customState)
    });
  }

  logOut() {
    localStorage.removeItem(localStorageKey);

    this.idToken = null;
    this.accessToken = null;
    this.tokenExpiry = null;
    this.profile = null;
    this.accessTokenExpiry = null;

    webAuth.logout({
      returnTo: `${window.location.origin}`
    });

    this.emit(loginEvent, { loggedIn: false });
  }

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

  isAuthenticated() {
    return (
      new Date().getTime() < this.tokenExpiry &&
      localStorage.getItem(localStorageKey) === "true"
    );
  }

  isIdTokenValid() {
    return this.idToken && this.tokenExpiry && this.tokenExpiry > Date.now();
  }

  isAccessTokenValid() {
    return (
      this.accessToken &&
      this.accessTokenExpiry &&
      this.accessTokenExpiry > Date.now()
    );
  }

  getIdToken() {
    return new Promise((resolve, reject) => {
      if (this.isIdTokenValid()) {
        resolve(this.idToken);
      } else if (this.isAuthenticated()) {
        this.renewTokens().then(authResult => {
          resolve(authResult.idToken);
        }, reject("Unable to renew authentication"));
      } else {
        resolve();
      }
    });
  }

  getAccessToken() {
    return new Promise((resolve, reject) => {
      if (!this.isAccessTokenValid()) {
        resolve(this.accessToken);
      } else {
        this.renewTokens().then(authResult => {
          resolve(authResult.accessToken);
        }, reject);
      }
    });
  }

  localLogin(authResult) {
    this.idToken = authResult.idToken;
    this.accessToken = authResult.accessToken;
    this.profile = authResult.idTokenPayload;
    this.tokenExpiry = new Date(this.profile.exp * 1000);
    this.accessTokenExpiry = new Date(Date.now() + authResult.expiresIn * 1000);

    localStorage.setItem(localStorageKey, "true");

    this.emit(loginEvent, {
      loggedIn: true,
      profile: authResult.idTokenPayload,
      state: authResult.state,
      stateJson: decodeState(authResult) || {}
    });
  }

  renewTokens() {
    return new Promise((resolve, reject) => {
      if (localStorage.getItem(localStorageKey) === "true") {
        webAuth.checkSession({}, (err, authResult) => {
          if (err) {
            reject(err);
          } else {
            this.localLogin(authResult);
            resolve(authResult);
          }
        });
      } else {
        reject("Not logged in");
      }
    });
  }
}

const service = new AuthService();
service.setMaxListeners(5);

export default service;
