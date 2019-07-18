import { createAuthService } from "../auth";

export default {
  install(Vue, options) {
    Vue.prototype.$auth = createAuthService(options);
  }
};
