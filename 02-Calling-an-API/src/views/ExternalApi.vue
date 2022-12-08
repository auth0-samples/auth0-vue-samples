<template>
  <div>
    <div class="mb-5">
      <h1>External API</h1>
      <p>
        Call an external API by clicking the button below. This will call the
        external API using an access token, and the API will validate it using
        the API's audience value.
      </p>

      <button class="btn btn-primary mt-5" @click="callApi">Call API</button>
    </div>

    <div class="result-block-container">
      <div :class="['result-block', apiMessage ? 'show' : '']">
        <h6 class="muted">Result</h6>
        <highlightjs language="json" :code="JSON.stringify(apiMessage, null, 2) || ''" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useAuth0 } from "@auth0/auth0-vue";
import { ref } from "vue";

export default {
  name: "api-view",
  setup() {
    const auth0 = useAuth0();
    const apiMessage = ref();
    return {
      apiMessage,
      async callApi() {
        const accessToken = await auth0.getAccessTokenSilently();
        try {
          const response = await fetch("/api/external", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          const data = await response.json();
          apiMessage.value = data;
        } catch (e: any) {
          apiMessage.value = `Error: the server responded with '${e.response.status}: ${e.response.statusText}'`;
        }
      },
    };
  },
};
</script>