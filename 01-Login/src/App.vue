<template>
  <img src="public/lights.gif" alt="christmas-lights" id="christmas-lights">
  <div id="app" class="d-flex flex-column h-100">
    <nav-bar />
    <div class="container flex-grow-1">
      <error />
      <div class="mt-5">
        <router-view />
      </div>
    </div>
    <footer class="text-center p-3">
<p>Made with ❤️ by team G.R.A.Y</p>
    </footer>
  </div>
</template>

<script lang="ts">
import NavBar from "./components/NavBar.vue";
import Error from "./components/Error.vue";

export default {
  components: {
    NavBar,
    Error
  }
};
</script>

<style scoped>
footer {
  background-color: #8e241a;
  color: white;
  position: absolute;
  width: 100%;
  bottom: 0;
}
 #christmas-lights {
   position: absolute;
   left: 18%;
   z-index: -10;
   top: 10vh;
 }
</style>
