<template>
  <div class="formWrap">
    <form @submit.prevent="send">
      <input type="text" v-model="text" placeholder="введите сообщение">
      <button>Send message</button>
    </form>
  </div>
</template>

<script>
  export default {
    data: () => ({
      text: ''
    }),
    methods: {
      send() {
        this.$socket.emit('createMessage', {
          text: this.text,
          id: this.$store.state.user.id
        }, data => {
          if(typeof data === 'string') {
            console.error(data)
          } else {
            this.text = ""
          }
        })
      }
    }
  }
</script>

<style>
  .formWrap {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 1rem;
    height: 80px;
    background-color: #ccc;
  }
</style>
