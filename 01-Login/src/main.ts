import { createApp } from 'vue'
import { createPinia } from 'pinia'
/* highlight-start auth0-provider */
import { createAuth0 } from '@auth0/auth0-vue'
/* highlight-end auth0-provider */

import App from "./App.vue"


const app = createApp(App)

app.use(
    /* highlight-start auth0-provider */
    createAuth0({
        domain: import.meta.env.VITE_AUTH0_DOMAIN,
        clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
        authorizationParams: {
            redirect_uri: window.location.origin
        }
    })
    /*highlight-end auth0-provider */
)

app.use(createPinia())

app.mount('#app')
