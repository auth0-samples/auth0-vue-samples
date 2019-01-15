import auth0 from "auth0-js";
import { EventEmitter } from "events";
import { AUTH_CONFIG } from "./auth0-variables";
import state from "./state";

const webAuth = new auth0.WebAuth({
  domain: AUTH_CONFIG.domain,
  redirectUri: AUTH_CONFIG.callbackUrl,
  clientID: AUTH_CONFIG.clientId,
  responseType: "id_token",
  scope: "openid profile email"
});

const localStorageKey = "loggedIn";
const loginEvent = "loginEvent";

class AuthService extends EventEmitter {
  idToken = null;
  profile = null;
  tokenExpiry = null;

  login(customState) {
    webAuth.authorize({
      state: state.encodeState(customState)
    });
  }

  logOut() {
    localStorage.removeItem(localStorageKey);

    this.idToken = null;
    this.tokenExpiry = null;
    this.profile = null;

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

  getIdToken() {
    return new Promise((resolve, reject) => {
      if (this.isIdTokenValid()) {
        resolve(this.idToken);
      } else if (this.isAuthenticated()) {
        this.renewTokens().then(authResult => {
          resolve(authResult.idToken);
        }, reject);
      } else {
        resolve();
      }
    });
  }

  localLogin(authResult) {
    this.idToken = authResult.idToken;
    this.profile = authResult.idTokenPayload;
    this.tokenExpiry = new Date(this.profile.exp * 1000);

    localStorage.setItem(localStorageKey, "true");

    this.emit(loginEvent, {
      loggedIn: true,
      profile: authResult.idTokenPayload,
      state: authResult.state,
      stateJson: state.decodeState(authResult) || {}
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
