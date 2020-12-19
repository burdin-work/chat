<template>
  <div>
    <div class="formWrap">
      <h2>Nuxt Chat</h2>
      <form @submit.prevent="submit">

        <button type="submit">Log in</button>
      </form>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import { generateName, generateAvatar } from './gen_user'
export default {
  name: 'index',
  head: {
    title: 'Добро пожаловать в Nuxt чат'
  },
  sockets: {
    connect: function() {
      console.log('socket connected')
    }
  },
  data: () => ({
    name: '',
    room: ''
  }),
  methods: {
    ...mapMutations(['setUser']),
    ...mapActions(['identUser']),
  },
  mounted() {
    console.log('mounted!')
    const user = {
      name:   generateName(),
      avatar: generateAvatar(),
      room: 'mainRoom'
    }
    this.$socket.emit('userJoined', user, (data) => {
      if (typeof data === 'string') {
        console.error(data)
      } else {
        this.identUser(user)
        this.$router.push('/chat')

      }
    })
  }
}
</script>

<style scoped>
.formWrap h2 {
  text-align: center;
}
.formWrap {
  width: 550px;
  border-radius: 15px;
  border: 1px solid rgba(204, 204, 204, 0.75);
  margin: 120px auto 0 auto;
  padding: 20px;
}

.formWrap form {
  width: 500px;
  margin: 0 auto 0 auto;
  display: flex;
  flex-direction: column;
  padding: 30px;
}

.formWrap button {
  padding: 12px 0;
  border-radius: 10px;
  cursor: pointer;
  background-color: #68c9ef;
  border: 1px solid rgb(204, 204, 204);
  font-weight: bold;
  font-size: 16px;
  transition: 0.1s;
}

.formWrap button:active {
  background-color: #72a6cb;
}

.formWrap input {
  border: 1px solid rgba(204, 204, 204, 0.75);
  border-radius: 10px;
  padding: 8px 12px;
  margin-bottom: 25px;
}
.formWrap input::placeholder {
  color: rgb(154, 154, 154);
}
.formWrap input:focus {
  border: 1px solid rgba(204, 204, 204, 1);
}
</style>
