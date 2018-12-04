<template>
  <div class="panel panel-default profile-area">
  <div class="panel-heading"><h3>Profile</h3></div>
  <div class="panel-body">
    <img :src="profile.picture" class="avatar" alt="avatar">
    <div>
      <label><i class="glyphicon glyphicon-user"></i> Nickname</label>
      <h3 class="nickname">{{ profile.nickname }}</h3>
    </div>
    <div>
      <label><i class="glyphicon glyphicon-envelope"></i> Email</label>
      <h3 class="email">{{ profile.email }}</h3>
    </div>
    <pre class="full-profile">{{ profile }}</pre>
  </div>
</div>
</template>

<script>
export default {
  props: ['auth'],
  data () {
    return {
      profile: {}
    }
  },
  created () {
    if (this.auth.userProfile) {
      this.profile = this.auth.userProfile
    } else {
      this.auth.getProfile((err, profile) => {
        if (err) return console.log(err)
        this.profile = profile
      })
    }
  }
}
</script>

<style>
  .profile-area img {
    max-width: 150px;
    margin-bottom: 20px;
  }

  .panel-body h3 {
    margin-top: 0;
  }
</style>
