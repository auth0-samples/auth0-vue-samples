// Intercept responses and check for anything
// unauthorized. If there is an unauthorized response,
// dispatch an event to let the app handle it
Vue.http.interceptors.push(function(request, next) {
  let self = this;
  next((response) => {
    if (response.status === 401) {
      self.$dispatch('logout');
    }
  });
});

// The public route can be viewed at any time
var Public = {
  template: `<p>This is a public route</p>`
};

// The private route can only be viewed when
// the user is authenticated. The canActivate hook
// uses checkAuth to return true if the user is authenticated
// or false if not.
var Private = {
  template: `<p>This is a private route. If you are reading this, you are authenticated.</p>`,
  route: {
    beforeEnter() {
      return checkAuth();
    }
  }
};

var App = {
  template: `
  <div>
    <h1>Vue.js with Auth0</h1>
    <button @click="login()" v-show="!authenticated">Login</button>
    <button @click="logout()" v-show="authenticated">Logout</button>
    <hr>
    <router-link to="/public">Public Route</router-link>
    <router-link to="/private" v-show="authenticated">Private Route</router-link>
    <router-view></router-view>
  </div>
  `,
  data() {
    return {
      authenticated: false,
      secretThing: '',
      lock: new Auth0Lock(AUTH0_CLIENT_ID, AUTH0_DOMAIN,
        {
          autoclose: true,
          auth: {
            responseType: 'token id_token',
          }
        })
    }
  },
  events: {
    'logout': function() {
      this.logout();
    }
  },
  // Check the user's auth status when the app
  // loads to account for page refreshing
  mounted() {
    var self = this;
    Vue.nextTick(function() {
      self.authenticated = checkAuth();
      self.lock.on('authenticated', (authResult) => {
        console.log('authenticated');
        localStorage.setItem('id_token', authResult.idToken);
        self.lock.getUserInfo(authResult.accessToken, (error, profile) => {
          if (error) {
            // Handle error
            return;
          }
          // Set the token and user profile in local storage
          localStorage.setItem('profile', JSON.stringify(profile));

          self.authenticated = true;
        });
      });
      self.lock.on('authorization_error', (error) => {
        // handle error when authorizaton fails
      });
  });
  },
  methods: {
    login() {
      this.lock.show();
    },
    logout() {
      // To log out, we just need to remove the token and profile
      // from local storage
      localStorage.removeItem('id_token');
      localStorage.removeItem('profile');
      this.authenticated = false;
    }
  }
};

// Utility to check auth status
function checkAuth() {
  return !!localStorage.getItem('id_token');
}

var router = new VueRouter({
  mode: 'history',
  routes: [{
      path: '/public',
      component: Public
    },
    {
      path: '/private',
      component: Private
    }
  ]
});

new Vue({
  el: '#app',
  router,
  // replace the content of <div id="app"></div> with App
  render: h => h(App)
})
