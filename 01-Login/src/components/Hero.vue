<template>
<div class="container-main">
<h1>Hello there!</h1>
  <p>🎄 Days left until Christmas: <b>{{ daysUntilChristmas }}</b> 🎅</p>
</div>
</template>

<script lang="ts">
export default {
  name: "HomeContent",
  data() {
    return {
      today: new Date()
    };
  },
  computed: {
    daysUntilChristmas() {
      const currentYear = this.today.getFullYear();
      const christmasDate = new Date(currentYear, 11, 25); // December 25

      if (this.today > christmasDate) {
        christmasDate.setFullYear(currentYear + 1);
      }

      const timeDifference = christmasDate - this.today;
      const daysLeft = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
      return daysLeft;
    }
  }
};
</script>

<style scoped>
.container-main {
  margin-top: 25vh;
  text-align: center;
}

h1 {
  color: #26671d;
  font-size: 4rem;
}

p {
  margin-top: 2rem;
  font-size: 2rem;
}

b {
  color: #22863a;
}
</style>
