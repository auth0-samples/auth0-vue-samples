<template>
  <div class="next-steps">
    <h2 class="my-5 text-center">What can I do next?</h2>

    <div class="row">
      <div class="col-md-5 mb-4">
        <h6 class="mb-3">
          <a href="https://auth0.com/docs/connections">
            <font-awesome-icon icon="link" class="mr-2" />Configure other identity providers
          </a>
        </h6>
        <p>Auth0 supports social providers as Facebook, Twitter, Instagram and 100+, Enterprise providers as Microsoft Office 365, Google Apps, Azure, and more. You can also use any OAuth2 Authorization Server.</p>
      </div>

      <div class="col-md"></div>

      <div class="col-md-5 mb-4">
        <h6 class="mb-3">
          <a href="https://auth0.com/docs/multifactor-authentication">
            <font-awesome-icon icon="link" class="mr-2" />Enable Multifactor Authentication
          </a>
        </h6>
        <p>Add an extra layer of security by enabling Multi-factor Authentication, requiring your users to provide more than one piece of identifying information. Push notifications, authenticator apps, SMS, and DUO Security are supported.</p>
      </div>
    </div>

    <div class="row">
      <div class="col-md-5 mb-4">
        <h6 class="mb-3">
          <a href="https://auth0.com/docs/anomaly-detection">
            <font-awesome-icon icon="link" class="mr-2" />Anomaly Detection
          </a>
        </h6>
        <p>Auth0 can detect anomalies and stop malicious attempts to access your application. Anomaly detection can alert you and your users of suspicious activity, as well as block further login attempts.</p>
      </div>

      <div class="col-md"></div>

      <div class="col-md-5 mb-4">
        <h6 class="mb-3">
          <a href="https://auth0.com/docs/rules">
            <font-awesome-icon icon="link" class="mr-2" />Learn About Rules
          </a>
        </h6>
        <p>Rules are JavaScript functions that execute when a user authenticates to your application. They run once the authentication process is complete, and you can use them to customize and extend Auth0's capabilities.</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "HomeContent"
};
</script>
