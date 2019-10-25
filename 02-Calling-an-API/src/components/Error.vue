<template>
  <div class="alert alert-danger alert-dismissible" v-if="msg">
    {{msg}}
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
</template>

<script>
export default {
  name: "Error",
  computed: {
    msg() {
      return this.$auth.error;
    }
  }
};
</script>

