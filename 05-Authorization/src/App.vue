<template>
  <div>
    <nav class="navbar navbar-default">
      <div class="container-fluid">
        <div class="navbar-header">
          <a class="navbar-brand" href="#">Auth0 - Vue</a>

          <router-link :to="'/'"
            class="btn btn-primary btn-margin">
              Home
          </router-link>

          <router-link :to="'profile'"
            class="btn btn-primary btn-margin"
            v-if="authenticated">
              Profile
          </router-link>

          <router-link :to="'admin'"
            class="btn btn-primary btn-margin"
            v-if="authenticated">
              Admin Area
          </router-link>

          <router-link :to="'ping'"
            class="btn btn-primary btn-margin">
              Ping
          </router-link>

          <button
            class="btn btn-primary btn-margin"
            v-if="!authenticated"
            @click="login()">
              Log In
          </button>

          <button
            class="btn btn-primary btn-margin"
            v-if="authenticated"
            @click="logout()">
              Log Out
          </button>

        </div>
      </div>
    </nav>

    <div class="container">
      <router-view :auth="auth" :authenticated="authenticated"></router-view>
    </div>
  </div>
</template>

<script>

import AuthService from './auth/AuthService'

const auth = new AuthService()

const { login, logout, authenticated, authNotifier } = auth

export default {
  name: 'app',
  data () {
    authNotifier.on('authChange', authState => {
      this.authenticated = authState
    })
    return {
      auth,
      authenticated
    }
  },
  methods: {
    login,
    logout
  }
}
</script>

<style>
@import '../node_modules/bootstrap/dist/css/bootstrap.css';

.btn-margin {
  margin-top: 7px
}
</style>
