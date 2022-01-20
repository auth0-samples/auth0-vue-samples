import { watchEffect } from 'vue';

export const createAuthGuard = (app) => {
  return (to, from, next) => {
    const auth0 = app.config.globalProperties.$auth0;
    const fn = () => {
      if (auth0.isAuthenticated.value) {
        return next();
      }
  
      auth0.loginWithRedirect({ appState: { targetUrl: to.fullPath } });
      
      return next(false);
    };
  
    if (!auth0.isLoading.value) {
      return fn();
    }
  
    watchEffect((stop) => {
      if (!auth0.isLoading.value) {
        stop();
        return fn();
      }
    });
  };
}
