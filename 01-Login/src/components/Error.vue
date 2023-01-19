<template>
  <div class="alert alert-danger alert-dismissible" v-if="msg">
    {{msg}}
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
</template>

<script lang="ts">
export default {
  name: "ErrorMessage",
  computed: {
    msg() {
      return this.$auth0.error.value;
    }
  }
};
</script>

