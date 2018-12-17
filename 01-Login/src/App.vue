<template>
  <div id="app">
    <nav-bar/>
    <div class="container mt-5">
      <router-view/>
    </div>
  </div>
</template>

<script>
import "jquery";
import "bootstrap";
import "bootstrap/scss/bootstrap.scss";

import NavBar from "./components/NavBar";

export default {
  components: {
    NavBar
  },
  async created() {
    try {
      if (this.$auth.isAuthenticated()) {
        await this.$auth.renewTokens();
      }
    } catch (e) {
      console.log(e);
    }
  }
};
</script>
