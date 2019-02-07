<template>
  <div>
    <div class="text-center hero">
      <img class="mb-3 app-logo" src="/logo.png" alt="Vue.js logo">
      <h1 class="mb-4">Vue.js Sample Project</h1>
      <p class="lead">
        This is a sample application that demonstrates an authentication flow for an SPA, using
        <a
          href="https://vuejs.org"
        >Vue.js</a>
      </p>
    </div>

    <hr>

    <div class="next-steps">
      <h2 class="mt-5 text-center">What can I do next?</h2>

      <div class="row">
        <div class="col-md-5">
          <h6 class="mb-3">
            <a href="#">
              <font-awesome-icon icon="link"/>Configure other identity providers
            </a>
          </h6>
          <p>Auth0 supports social providers as Facebook, Twitter, Instagram and 100+, Enterprise providers as Microsoft Office 365, Google Apps, Azure, and more. You can also use any OAuth2 Authorization Server.</p>
        </div>

        <div class="col-md"></div>

        <div class="col-md-5">
          <h6 class="mb-3">
            <a href="#">
              <font-awesome-icon icon="link"/>Enable Multifactor Authentication
            </a>
          </h6>
          <p>Auth0 supports social providers as Facebook, Twitter, Instagram and 100+, Enterprise providers as Microsoft Office 365, Google Apps, Azure, and more. You can also use any OAuth2 Authorization Server.</p>
        </div>
      </div>

      <div class="row">
        <div class="col-md-5">
          <h6 class="mb-3">
            <a href="#">
              <font-awesome-icon icon="link"/>Anomaly Detection
            </a>
          </h6>
          <p>Auth0 supports social providers as Facebook, Twitter, Instagram and 100+, Enterprise providers as Microsoft Office 365, Google Apps, Azure, and more. You can also use any OAuth2 Authorization Server.</p>
        </div>

        <div class="col-md"></div>

        <div class="col-md-5">
          <h6 class="mb-3">
            <a href="#">
              <font-awesome-icon icon="link"/>Learn About Rules
            </a>
          </h6>
          <p>Auth0 supports social providers as Facebook, Twitter, Instagram and 100+, Enterprise providers as Microsoft Office 365, Google Apps, Azure, and more. You can also use any OAuth2 Authorization Server.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "home"
};
</script>

<style lang="scss" scoped>
.next-steps {
  .fa-link {
    margin-right: 5px;
  }
}
</style>
