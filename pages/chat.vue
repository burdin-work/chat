<template>
  <div>
    <header><h1>Chat bots 2.0</h1></header>
    <div class="contentWrap">
      <div class="content">
        <div class="chat">
          <div class="chatUsers">
            <div class="panelUsers">
              <div class="usersTop">
                <div class="toogleStatus">
                  <button
                    class="online"
                    v-bind:class="[toogleStatus === 'online' && 'active']"
                    @click="toogleStatus = 'online'"
                  >
                    Online
                  </button>
                  <button
                    class="all"
                    v-bind:class="[toogleStatus === 'all' && 'active']"
                    @click="toogleStatus = 'all'"
                  >
                    All
                  </button>
                </div>

                <div class="listUsers layout-scrollbar sb_second">
                  <div
                    v-for="u in shownUsers"
                    v-if="u._id !== user.id"
                    :key="u._id"
                    class="user"
                    @click="joinRoom(u)"
                  >
                    <div class="imageWrap">
                      <img :src="u.avatar" alt="avatar" />
                      <div v-if="u.online" class="oval"></div>
                    </div>
                    <div class="userInfoWrap">
                      <span class="userName">{{ u.name }}</span>
                      <span class="lastMessage"
                        >Lorem liy liudr werr liy liudr werr liudr werr liy
                        liudr liudr werr liy</span
                      >
                    </div>
                  </div>
                </div>

                <div class="usersFooter">
                  <input
                    type="text"
                    class="usersFilter"
                    v-model="usersFilter"
                    placeholder="Search..."
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="chatMessages">
            <div class="messagesHeader">
              <div class="avatarWrap">
                <img :src="shownInterlocutor.avatar" alt="" />
              </div>
              <div class="messagesHeader__content">
                <h3>{{ shownInterlocutor.name }}</h3>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Commodi delectus dolorum ex laudantium pariatur reiciendis
                  veniam voluptate! Animi consectetur corporis, doloribus
                  facilis hic illo iure minima omnis rerum sequi suscipit?
                </p>
              </div>
            </div>
            <div class="messagesWrap layout-scrollbar" ref="chatWrap">
              <Message
                v-for="m in messages"
                v-if="m.room === user.room"
                :key="m._id"
                :senderId="m.senderId"
                :text="m.text"
                :owner="m.senderId === user.id"
                :time="m.time"
                :senderName="m.senderName"
              />
            </div>
            <NewMessageForm v-bind:user="this.user" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import Message from '../components/Message'
import NewMessageForm from '../components/NewMessageForm'

export default {
  components: { NewMessageForm, Message },
  head() {
    return {
      title: `Комната ${this.shownInterlocutor.name}`
    }
  },
  middleware: ['chat'],
  data: () => ({
    toogleStatus: 'online',
    usersFilter: '',
    status: ''
  }),
  computed: {
    ...mapState({
      user: 'user',
      users: 'users',
      messages: 'messages'
    }),

    shownUsers: function() {
      if (process.browser) {
        const filteredUsers = (uList) =>
          this.users.filter(
            (o) =>
              o.name.toLowerCase().indexOf(this.usersFilter.toLowerCase()) >= 0
          )

        let onlineUsers = this.users.filter((u) => u.online)
        let offlineUsers = this.users.filter((u) => !u.online)

        let selectedUsers =
          this.toogleStatus === 'online'
            ? onlineUsers
            : onlineUsers.concat(offlineUsers)

        return !this.usersFilter.length
          ? selectedUsers
          : selectedUsers.filter(
              (o) =>
                o.name.toLowerCase().indexOf(this.usersFilter.toLowerCase()) >=
                0
            )
      } else {
        return this.users.filter((u) => u.online)
      }
    },

    shownInterlocutor: function() {
      if (process.browser) {

        if (this.user.room !== 'mainRoom') {

          let interlocutorId = this.user.room
            .replace(this.user.id, '')
            .replace(/\_/g, '')
          if (interlocutorId.indexOf('Bot') >= 0) interlocutorId += '__'

          return this.users.find((u) => u.id === interlocutorId)
        } else {
          return this.users.find((u) => u.room === 'mainRoom')
        }
      }
    }
  },

  component: {
    Message,
    NewMessageForm
  },
  methods: {
    ...mapMutations(['setInterlocutor', 'SOCKET_updateUserRoom']),
    ...mapActions(['joinDialog']),

    async joinRoom(interlocutor) {
      let dialogRoom

      if (interlocutor.id === '5fe273f3f811c0237872441c') {
        dialogRoom = 'mainRoom'
      } else {
        const ownerId = this.$store.state.user.id
        const interlocutorId = interlocutor.id

        if (ownerId > interlocutorId) {
          dialogRoom = ownerId + '_' + interlocutorId
        } else {
          dialogRoom = interlocutorId + '_' + ownerId
        }
      }
      this.joinDialog({ dialogRoom, interlocutor })
      await this.$socket.emit('joinDialogRoom', dialogRoom, (data) => {
        if (typeof data === 'string') {
          console.error(data)
        }
      })
    }
  },
  updated() {
    const elem = this.$refs.chatWrap
    elem.scrollTop = elem.clientHeight * 100
  }
}
</script>

<style>
header {
  height: 8vh;
  padding: 0 40px;
}

header h1 {
  max-width: 1140px;
  height: 100%;
  display: flex;
  margin: 0 auto;
  line-height: 1;
  align-items: center;
  font-weight: 600;
  font-size: 32px;
}

.contentWrap {
  padding: 20px 40px;
  width: 100vw;
  height: 92vh;
  background-color: #586670;
}

.content {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  max-width: 1140px;
  background-color: #fff;
  border-radius: 5px;
  overflow: hidden;
}

.chat {
  display: grid;
  grid-template-areas: 'm u';
  grid-auto-columns: 75% 25%;
  grid-template-rows: 100%;
  height: 100%;
}

.panelUsers {
  grid-area: u;
  height: 100%;
  width: 100%;
  grid-auto-columns: 100%;
  grid-template-rows: 100%;
  height: 100%;
  position: relative;
}

.listUsers {
  overflow-y: auto;
  position: absolute;
  bottom: 70px;
  top: 50px;
  right: 0;
}

.usersTop {
  width: 100%;
}

.usersFooter {
  background-color: #fff;
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 4px 1rem 2rem 1rem;
  height: 60px;
}

.usersFooter input {
  width: 100%;
  display: block;
  height: 36px;
  padding-left: 12px;
  font-size: 14px;
  border-radius: 6px;
  border: 1px solid rgba(153, 153, 153, 0.5);
  box-shadow: 0 0 4px rgba(153, 153, 153, 0.5);
}

.usersFooter input::placeholder {
  color: #999;
}

.usersFooter input:focus,
.usersFooter input:active {
  border: 1px solid #74b9ef;
  box-shadow: 0 0 4px #74b9ef;
}

.toogleStatus {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.toogleStatus button {
  width: 50%;
  height: 45px;
  border: 1px solid rgba(221, 221, 221, 0.75);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  background-color: rgb(238, 238, 238);
  color: #777;
}

.toogleStatus button.active {
  background-color: #fff;
  border: none;
}

.chatMessages {
  grid-area: m;
  height: 100%;
  background-color: #d7dfe7;
  position: relative;
}

.messagesWrap {
  grid-area: bm;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 40px;
  padding: 1rem;
  overflow-y: auto;
  margin-top: 180px;
}

.messagesHeader {
  grid-area: hm;
  height: 180px;
  min-width: 180px !important;
  background-color: #becbd9;
  display: flex;
  justify-content: space-between;
  flex-wrap: nowrap;
  align-items: center;
  padding: 0 40px 40px 180px;
  color: #354149;
  overflow: hidden;
}

.avatarWrap {
  position: absolute;
  top: 0;
  left: 0;
  height: 180px;
  width: 180px;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}

.messagesHeader img {
  border-radius: 5px 0 0 0;
  height: 100%;
  width: 100%;
}
.messagesHeader h3 {
  font-size: 24px;
  font-weight: 600;
  width: 100%;
}
.messagesHeader p {
  font-size: 14px;
  font-weight: 600;
}

.messagesHeader__content {
  margin-top: 25px;
  margin-left: 25px;
  width: 100%;
}

.usersContentWrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  background-color: yellow;
  height: 100%;
}

.usersFilterWrap {
  background-color: red;
  width: 100%;
}

.usersFilterWrap input {
  font-size: 15px;
  width: 100%;
}

.user {
  height: 65px;
  margin-top: 12px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
}

.imageWrap {
  width: 75px;
  height: 100%;
  position: relative;
}

.imageWrap .oval {
  position: absolute;
  right: -3px;
  bottom: 2px;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background-color: #20d63e;
}

.user img {
  width: 60px;
  height: 60px;
  border-radius: 5px;
  margin-left: 10px;
}

.userInfoWrap {
  width: 100%;
  height: 100%;
  padding: 4px 9px 0 13px;
}

.user span.userName {
  display: block;
  font-size: 17px;
  font-weight: 700;
  color: #333;
  line-height: 1.1;
  margin-bottom: 3px;
}

.user .lastMessage {
  display: block;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.2;
  color: #999;
}

/* SCROLLBAR */
:root {
  --scrollbar-size: 0.65rem;
  --scrollbar-size_2: 0.45rem;
  --scrollbar-minlength: 1.5rem; /* Minimum length of scrollbar thumb (width of horizontal, height of vertical) */
  --scrollbar-ff-width: thin; /* FF-only accepts auto, thin, none */
  --scrollbar-track-color: #becbd9;
  --scrollbar-color: rgba(0, 0, 0, 0.2);
  --scrollbar-color-hover: rgba(0, 0, 0, 0.3);
  --scrollbar-color-active: rgb(0, 0, 0);
}

/* This class controls what elements have the new fancy scrollbar CSS */
.layout-scrollbar {
  scrollbar-color: var(--scrollbar-color) var(--scrollbar-track-color);
}

.layout-scrollbar::-webkit-scrollbar {
  height: var(--scrollbar-size);
  width: var(--scrollbar-size);
}
.layout-scrollbar.sb_second::-webkit-scrollbar {
  height: var(--scrollbar-size_2);
  width: var(--scrollbar-size_2);
}

.layout-scrollbar::-webkit-scrollbar-track {
  border-radius: 10px;
  margin-top: 15px;
  background-color: var(--scrollbar-track-color);
}

.layout-scrollbar::-webkit-scrollbar-thumb {
  background-color: var(--scrollbar-color);
  border-radius: 10px;
  height: 115px;
}

.layout-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: var(--scrollbar-color-hover);
}

.layout-scrollbar::-webkit-scrollbar-thumb:active {
  background-color: var(--scrollbar-color-active);
}

.layout-scrollbar::-webkit-scrollbar-thumb:vertical {
  min-height: var(--scrollbar-minlength);
}

.layout-scrollbar::-webkit-scrollbar-thumb:horizontal {
  min-width: var(--scrollbar-minlength);
}

@media (max-width: 900px) {
  .contentWrap {
    padding: 20px 5px;
  }

  .chat {
    grid-auto-columns: 60% 40%;
    grid-template-rows: 100%;
  }

  .messagesHeader {
    height: 100px;
    min-width: 100px;
    padding: 0 0 0 100px;
  }
  .messagesHeader__content {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
    margin: 0;
  }

  .avatarWrap {
    height: 100px;
    width: 100px;
  }

  .messagesHeader h3 {
    font-size: 18px;
    font-weight: 700;
    text-align: center;
  }
  .messagesHeader p {
    display: none;
  }
}

@media (max-width: 600px) {
  .messagesWrap {
    margin-top: 60px;
    bottom: 90px;
  }

  .chat {
    grid-auto-columns: 55% 45%;
  }
  .messagesHeader {
    height: 60px;
    min-width: 60px;
    padding: 0 0 0 60px;
  }

  .avatarWrap {
    height: 60px;
    width: 60px;
  }

  .messagesHeader h3 {
    font-size: 12px;
    font-weight: 700;
  }
}
</style>
