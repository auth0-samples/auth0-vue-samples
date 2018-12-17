<template>
  <div v-if="profile" class="profile-area">
    <h1>{{ profile.name }}</h1>

    <div class="card">
      <div class="card-header">Profile</div>
      <div class="card-body">
        <img :src="profile.picture" alt="profile">

        <div class="mb-3">
          <label class="control-label my-2">
            <font-awesome-icon icon="user"/>
            Nickname
          </label>
          <h3>{{ profile.nickname }}</h3>
        </div>

        <pre class="bg-light p-2 border">
          {{ JSON.stringify(profile, null, 2) }}
        </pre>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      profile: this.$auth.profile
    };
  },
  methods: {
    handleLoginEvent(data) {
      this.profile = data.profile;
    }
  }
};
</script>

<style lang="scss">
.profile-lg {
  width: 200px;
  height: 200px;
}

.display-4 {
  font-weight: 100;
}

.profile-area {
  img {
    max-width: 150px;
  }
}
</style>
