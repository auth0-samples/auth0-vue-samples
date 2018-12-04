<template>
  <div>
    <h1>Make a Call to the Server</h1>

    <p v-if="!authenticated">
      Log in to call a private (secured) server endpoint.
    </p>

    <button
      class="btn btn-primary" 
      @click="ping">
        Call Public
    </button>

    <button 
      class="btn btn-primary"
      @click="securedPing" 
      >
        Call Private
    </button>

    <button 
      class="btn btn-primary"
      @click="adminPing" 
      v-if="authenticated && admin">
        Call Admin
    </button>

    <h2>{{ message }}</h2>
  </div>
</template>

<script>
  export default {
    name: 'Ping',
    props: ['auth', 'authenticated', 'admin'],
    data () {
      return {
        message: ''
      }
    },
    computed: {
      headers () {
        const accessToken = this.auth.getAccessToken() || null
        return { Authorization: `Bearer ${accessToken}` }
      }
    },
    methods: {
      ping () {
        this.$http.get('http://localhost:3001/api/public')
          .then(response => {
            this.message = response.body.message
          }, error => {
            this.message = error.statusText
          })
      },
      securedPing () {
        this.$http.get('http://localhost:3001/api/private', { headers: this.headers })
          .then(response => {
            this.message = response.body.message
          }, error => {
            this.message = error.statusText
          })
      },
      adminPing () {
        this.$http.get('http://localhost:3001/api/private/admin', { headers: this.headers })
          .then(response => {
            this.message = response.body.message
          }, error => {
            this.message = error.statusText
          })
      }
    }
  
  }
</script>
