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
  data() {
    return {
      show: false,
      msg: ""
    };
  },
  methods: {
    handleLoginEvent(data) {
      if (data.error) {
        this.show = true;
        this.msg = data.error.errorDescription;
      } else {
        this.show = false;
        this.msg = "";
      }
    }
  }
};
</script>

