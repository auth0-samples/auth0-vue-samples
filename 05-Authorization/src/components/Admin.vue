<template>
  <div>
    <h2>You are an Admin!</h2>
    <p>Only users who have a 
    <code>role</code> of <code>admin</code> 
    in their <code>id_token</code> 
    can see this area.</p>
  </div>
</template>

<script>
  export default {
    props: ['auth']
  }
</script>
