<template>
  <div>
    <div>
      <button @click="message">NEW MESSAGE</button>
    </div>
  </div>
</template>

<script>
export default {
  sockets: {
    connect() {
      console.log('socket connected')
    }
  },
  methods: {
    message() {
      this.$socket.emit('createMessage', {
        text: 'FROM CLIENT'
      })
    }
  }
}
</script>
