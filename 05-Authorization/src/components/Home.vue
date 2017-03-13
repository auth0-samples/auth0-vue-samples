<template>
  <div>
    <h4 v-if="authenticated">
        You are logged in!
        <span v-if="admin">
          You can now view your <router-link :to="'admin'">admin area</router-link>.
        </span>
    </h4>
    <h4 v-if="!authenticated">
      You are not logged in! Please <a @click="auth.login()">Log In</a> to continue.
    </h4>
  </div>
</template>

<script>
  export default {
    name: 'home',
    props: ['auth', 'authenticated', 'admin']
  }
</script>

<style>
  a {
    cursor: pointer;
  }
</style>

