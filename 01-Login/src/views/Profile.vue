<template>
  <div class="container">
    <div class="row align-items-center profile-header">
      <div class="col-md-2 mb-3">
        <img src="https://png.pngtree.com/png-clipart/20201209/original/pngtree-side-view-of-wearing-festive-short-haired-santa-hat-png-image_5663679.png" alt="santa hat" id="santa-hat">
        <img
          :src="user?.picture"
          alt="User's profile picture"
          class="rounded-circle img-fluid profile-picture"
        />
      </div>
      <div class="col-md text-center text-md-left">
        <h2>{{ user?.name }}</h2>
        <p class="lead text-muted">{{ user?.email }}</p>
      </div>
    </div>

    <div>
<!--      <highlightjs language="json" :code="JSON.stringify(user, null, 2)" />-->
      <p><b>Prénom</b> : {{user?.given_name}}</p>
      <p><b>Nom</b>: {{user?.family_name}}</p>
      <p><b>Nickname </b> : {{user?.nickname}}</p>
      <p><b>Name</b> : {{user?.name}}</p>
      <p><b>Email </b> : {{user?.email}}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { useAuth0 } from '@auth0/auth0-vue';

export default {
  name: "profile-view",
  setup() {
    const auth0 = useAuth0();
    
    return {
      user: auth0.user,
    }
  }
};
</script>

<style scoped>
.container {
  margin-top: 25vh;
}

b {
  color: #22863a;
}

p {
  font-size: 1.2rem;
}

#santa-hat {
  height: 100px;
  left: 20%;
  top: -40%;
  position: absolute;
}
</style>

