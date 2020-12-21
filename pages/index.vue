<template>
  <div></div>
</template>

<script>
import { generateAvatar, generateName } from '../plugins/gen_user'
import { mapMutations, mapActions } from 'vuex'
export default {
  name: 'Authorization',
  methods: {
    ...mapMutations({
      setUser : 'setUser'
    }),
    ...mapActions({
      getUsers: 'getUsers',
      createUser: 'createUser',
      getMessages: 'getMessages'
    }),
  },
  sockets: {
    connect: function() {
      console.log('socket connected')
    }
  },
  async mounted() {
    console.log('mounted!')
    await this.getUsers()

    let user
    if (process.browser) {
      if (
        localStorage.id &&
        localStorage.name &&
        localStorage.avatar &&
        localStorage.room
      ) {
        console.log('Indentification is good! Hello, ' + localStorage.name)

        user = {
          id: localStorage.id,
          name: localStorage.name,
          avatar: localStorage.avatar,
          room: localStorage.room,
          online: true
        }
        await this.setUser(user)
      } else {
        user = {
          name: generateName(),
          avatar: generateAvatar(),
          room: 'mainRoom'
        }
        await this.createUser(user)
      }

      await this.$socket.emit('userJoined', { user , users: this.$store.state.users }, (data) => {
        if (typeof data === 'string') {
          console.error(data)
        }
      })

      if (user) {
        this.getMessages(user.room)
        this.$router.push('/chat')
      }
    }
  }
}
</script>
