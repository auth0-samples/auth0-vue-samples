<template>
  <div>
    <nav class="navbar navbar-default">
      <div class="container-fluid">
        <div class="navbar-header">
          <a class="navbar-brand" href="#">Auth0 - Vue</a>

          <router-link to="/"
            class="btn btn-primary btn-margin">
              Home
          </router-link>

          <router-link to="/profile"
            class="btn btn-primary btn-margin"
            v-if="authenticated">
              Profile
          </router-link>

          <router-link to="admin"
            class="btn btn-primary btn-margin"
            v-if="authenticated && admin">
              Admin Area
          </router-link>

          <router-link to="ping"
            class="btn btn-primary btn-margin">
              Ping
          </router-link>

          <button
            class="btn btn-primary btn-margin"
            id="qsLoginBtn"
            v-if="!authenticated"
            @click="login">
              Log In
          </button>

          <button
            class="btn btn-primary btn-margin"
            id="qsLogoutBtn"
            v-if="authenticated"
            @click="logout">
              Log Out
          </button>

        </div>
      </div>
    </nav>

    <div class="container">
      <router-view 
        :auth="auth" 
        :authenticated="authenticated" 
        :admin="admin">
      </router-view>
    </div>
  </div>
</template>

<script>
import auth from './auth/AuthService'

export default {
  name: 'app',
  data () {
    return {
      auth,
      authenticated: auth.authenticated,
      admin: auth.admin
    }
  },
  methods: {
    login () {
      auth.login()
    },
    logout () {
      auth.logout()
    }
  },
  created () {
    auth.authNotifier.on('authChange', authState => {
      this.authenticated = authState.authenticated
      this.admin = authState.admin
    })

    auth.renewSession()
  }
}
</script>

<style>
@import '../node_modules/bootstrap/dist/css/bootstrap.css';

.btn-margin {
  margin-top: 7px
}
</style>
