<template>
 <div>
    <div class="mb-5">
      <h1>External API</h1>
      <p>Ping an external API by clicking the button below. This will call the external API using an access token, and the API will validate it using
        the API's audience value.
      </p>

      <button class="btn btn-primary mt-5" @click="callApi">Ping</button>
    </div>

    <div v-if="apiMessage">
      <h2>Result</h2>
      <p>{{ apiMessage }}</p>
    </div>

 </div>
</template>

<script>
export default {
  name: "Api",
  data() {
    return {
      apiMessage: null
    };
  },
  methods: {
    async callApi() {
      const accessToken = await this.$auth.getAccessToken();

      try {
        const { data } = await this.$http.get("/api/external", {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });

        this.apiMessage = data.msg;
      } catch (e) {
        this.apiMessage = `Error: the server responded with '${
          e.response.status
        }: ${e.response.statusText}'`;
      }
    }
  }
};
</script>
