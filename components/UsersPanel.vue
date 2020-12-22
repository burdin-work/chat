<template>
  <div class="listUsers">
    <div
      v-for="(u, i) in users"
      v-if="u._id !== user.id"
      :key="u._id"
      class="user"
      @click="joinRoom(u)"
    >
      <div class="imageWrap">
        <img :src="u.avatar" alt="avatar" />
        <div class="oval"></div>
      </div>
      <div class="userInfoWrap">
        <span class="userName">{{ u.name }}</span>
        <span class="lastMessage"
        >Lorem liy liudr werr liy liudr werr</span
        >
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState, mapMutations, mapActions } from 'vuex'
  export default {
    data: () => ({
      usersFilter: '',
      shownUsers: []
    }),
    computed: {
      ...mapState({
        user: 'user',
        users: 'users',
        messages: 'messages'
      })
    },
    methods: {
      ...mapMutations(['setInterlocutor', 'updateUserRoom']),
      ...mapActions(['joinDialog']),

      search() {
          let shownUsers =  this.users.filter(
          (o) => o.name.toLowerCase().indexOf(usersFilter.toLowerCase()) >= 0
        )
        console.log(shownUsers)
      },
    },
  }
</script>


<style scoped>

</style>
