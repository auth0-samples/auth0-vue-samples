<template>
  <div class="alert alert-danger alert-dismissible" v-if="show">
    {{msg}}
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
</template>

<script>
export default {
  name: "Error",
  methods: {
    msg() {
      return this.$auth.error;
    }
  },
  computed: {
    show() {
      return this.$auth.error !== null;
    }
  }
};
</script>

