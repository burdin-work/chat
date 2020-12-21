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


              <div class="listUsers">
                <div
                  v-for="(u, i) in users"
                  v-if="u._id !== user.id"
                  :key="u._id"
                  class="user"
                  @click="setInterlocutor(u)"
                >
                  <div class="imageWrap">
                    <img :src="u.avatar" alt="avatar">
                    <div class="oval"></div>
                  </div>
                  <div class="userInfoWrap">
                    <span class="userName">{{ u.name }}</span>
                    <span class="lastMessage">Lorem liy liudr werr liy liudr werr</span>
                  </div>
                </div>
              </div>

                <div class="usersFooter">
                  <input type="text" class="usersFilter" v-model="usersFilter" placeholder="Search...">
              </div>
            </div>
            </div>

          </div>
          <div class="chatMessages">
            <div class="messagesWrap layout-scrollbar" ref="chatWrap">
              <Message
                v-for="(m, i) in messages"
                :key="m._id"
                :senderId="m.senderId"
                :text="m.text"
                :owner="m.senderId === user.id"
                :time="m.time"
                :senderName="m.senderName"
              />
            </div>
            <NewMessageForm v-bind:user="this.user"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState, mapMutations, mapActions, mapGetters } from 'vuex'
  import Message from '../components/Message'
  import NewMessageForm from '../components/NewMessageForm'

  export default {
    components: { NewMessageForm, Message },
    head() {
      return {
        title: `Комната ${this.user.room}`
      }
    },
    middleware: 'chat',
    sockets: {
      connect: function() {
        console.log('socket connected')
      }
    },
    data: () => ({
      toogleStatus: 'online',
      usersFilter: ''
    }),
    component: {
      Message,
      NewMessageForm
    },
    methods: {
      ...mapMutations(['setInterlocutor'])
    },
    middleware: ['chat'],
    computed: {
      ...mapState({
        user: 'user',
        users: 'users',
        messages: 'messages'
      })
    },
    updated() {
      const elem = this.$refs.chatWrap
      console.log(elem)
      console.log(elem.clientHeight)
      elem.scrollTop = elem.clientHeight * 10
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
    overflow-y: auto;
    grid-auto-columns: 100%;
    grid-template-rows: 100%;
    height: 100%;
    position: relative;
  }

  .usersTop {
    width: 100%;
  }
  .usersFooter {
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
    border: 1px solid rgba(153,153,153,.5);
    box-shadow: 0 0 4px rgba(153,153,153,.5);
  }

  .usersFooter input::placeholder{
    color: #999;
  }

  .usersFooter input:focus,
  .usersFooter input:active{
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
    border: 1px solid rgba(221, 221, 221, .75);
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
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 40px;
    padding: 1rem;
    overflow-y: auto;
    overscroll-behavior: contain;
    -webkit-overflow-scrolling: touch;
    -ms-overflow-style: -ms-autohiding-scrollbar;
    scrollbar-width: var(--scrollbar-ff-width);
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
    --scrollbar-size: 0.375rem;
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
    margin-top: 15px;
  }

  .layout-scrollbar::-webkit-scrollbar {
    height: var(--scrollbar-size);
    width: var(--scrollbar-size);
  }

  .layout-scrollbar::-webkit-scrollbar-track {
    border-radius: 10px;
    margin-top: 15px;
    background-color: var(--scrollbar-track-color);
  }

  .layout-scrollbar::-webkit-scrollbar-thumb {
    background-color: var(--scrollbar-color);
    border-radius: 3px;
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
  }

  @media (max-width: 600px) {
    .messagesWrap {
      bottom: 90px;
    }
    .chat {
      grid-auto-columns: 55% 45%;
    }
  }


</style>
