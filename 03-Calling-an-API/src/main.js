import Vue from "vue";
import App from "./App.vue";
import Axios from "./plugins/axios";
import router from "./router";
import AuthPlugin from "./plugins/auth";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

Vue.use(AuthPlugin);

Vue.config.productionTip = false;

Vue.use(Axios);
library.add(faUser);

Vue.component("font-awesome-icon", FontAwesomeIcon);

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
