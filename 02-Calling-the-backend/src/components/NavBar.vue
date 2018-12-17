<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <router-link to="/" class="navbar-brand">Auth0 - Vue.js</router-link>
    <button
      class="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarNav"
      aria-controls="navbarNav"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item">
          <router-link to="/" tag="button" class="btn btn-primary btn-margin">Home</router-link>
        </li>
        <li class="nav-item" v-if="isAuthenticated">
          <router-link to="/profile" tag="button" class="btn btn-primary btn-margin">Profile</router-link>
        </li>
        <li class="nav-item" v-if="isAuthenticated">
          <router-link to="/backend-api" tag="button" class="btn btn-primary btn-margin">Backend API</router-link>
        </li>
        <li v-if="!isAuthenticated" class="nav-item">
          <button id="qsLoginBtn" class="btn btn-primary btn-margin" @click.prevent="login">Login</button>
        </li>
        <li v-if="isAuthenticated" class="nav-item">
          <button
            @click.prevent="logout"
            class="btn btn-primary btn-margin"
            id="qsLogoutBtn"
          >Log Out</button>
        </li>
      </ul>
    </div>
  </nav>
</template>
<script>
export default {
  name: "NavBar",
  methods: {
    login() {
      this.$auth.login();
    },
    logout() {
      this.$auth.logOut();
      this.$router.push({ path: "/" });
    },
    handleLoginEvent(data) {
      this.isAuthenticated = data.loggedIn;
      this.profile = data.profile;
    }
  },
  data() {
    return {
      isAuthenticated: false,
      profile: {}
    };
  }
};
</script>

<style>
img.thumb {
  width: 28px;
  height: 28px;
  margin-right: 5px;
}

.nav-link {
  display: inline-block !important;
}

.profile-name {
  color: #fff;
}

.btn-margin {
  margin: 7px 5px;
}
</style>
