import Vue from "vue";
import App from "./App.vue";
import Axios from "./plugins/axios";
import router from "./router";
import AuthPlugin from "./plugins/auth";
import HighlightJs from "./directives/highlight";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

Vue.config.productionTip = false;

Vue.use(AuthPlugin);
Vue.use(Axios);
Vue.directive("highlightjs", HighlightJs);

library.add(faLink);

Vue.component("font-awesome-icon", FontAwesomeIcon);

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
