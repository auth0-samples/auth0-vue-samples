import App from "./App.vue";
import { createApp } from "vue";
import { createRouter } from "./router";
import { createAuth0 } from "@auth0/auth0-vue";
import hljs from "vue3-highlightjs";
import "highlight.js/styles/github.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faLink, faUser, faPowerOff } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import authConfig from "../auth_config.json";

const app = createApp(App);

library.add(faLink, faUser, faPowerOff);

app
  .use(hljs)
  .use(createRouter(app))
  .use(
    createAuth0({
      domain: authConfig.domain,
      client_id: authConfig.clientId,
      redirect_uri: window.location.origin,
      audience: authConfig.audience
    })
  )
  .component("font-awesome-icon", FontAwesomeIcon)
  .mount("#app");
