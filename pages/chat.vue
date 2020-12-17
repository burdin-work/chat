<template>
  <div>
    <header><h1>Chat bots 2.0</h1></header>
    <div class="contentWrap">
      <div class="content">
        <div class="chat">
          <div class="chatUsers">
            <h2>Список пользователей:</h2>
            <div class="listUsers">
              <div
                v-for="u in users"
                v-if="u.id !== user.id"
                :key="u.id"
                class="user"
                @click.prevent
              >
                <span>{{ u.name }}</span>
              </div>
            </div>
          </div>
          <div class="chatMessages">
            <div class="messagesWrap layout-scrollbar">
              <Message
                v-for="m in messages"
                :key="m.text"
                :name="m.name"
                :text="m.text"
                :owner="m.id === user.id"
              />
            </div>
            <NewMessageForm />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Message from '../components/Message'
import NewMessageForm from '../components/NewMessageForm'

export default {
  components: { NewMessageForm, Message },
  head() {
    return {
      title: `Комната ${this.user.room}`
    }
  },
  component: {
    Message,
    NewMessageForm
  },
  middleware: ['chat'],
  computed: mapState(['user', 'messages', 'users'])
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
}

.chat {
  display: grid;
  grid-template-areas: 'm u';
  grid-auto-columns: 75% 25%;
  grid-template-rows: 100%;

  height: 100%;
}

.chatUsers {
  grid-area: u;
  background-color: red;
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
  bottom: 80px;
  padding: 1rem;
  overflow-y: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  -ms-overflow-style: -ms-autohiding-scrollbar;
  scrollbar-width: var(--scrollbar-ff-width);
}

.user {
  display: block;
  height: 50px;
  background-color: blue;
  margin-bottom: 5px;
  cursor: pointer;
}
/* SCROLLBAR */
/*::-webkit-scrollbar-track {background: #becbd9; border-radius: 10px;
  margin-top: 15px;}
::-webkit-scrollbar {width: 10px;height: 12px;}
::-webkit-scrollbar-track-piece {background:rgba(0,0,0,0);}
::-webkit-scrollbar-thumb:vertical {height:10px;background:#272c35; border-radius: 10px;}
::-webkit-scrollbar-thumb:vertical:hover {background: #6f716e;}
::-webkit-scrollbar-thumb:horizontal {width:10px;background:#272c35;}
::-webkit-scrollbar-thumb:horizontal:hover {background: #959191;}*/
/* Variables */
:root {
  --scrollbar-size: .375rem;
  --scrollbar-minlength: 1.5rem; /* Minimum length of scrollbar thumb (width of horizontal, height of vertical) */
  --scrollbar-ff-width: thin; /* FF-only accepts auto, thin, none */
  --scrollbar-track-color: #becbd9;
  --scrollbar-color: rgba(0,0,0,.2);
  --scrollbar-color-hover: rgba(0,0,0,.3);
  --scrollbar-color-active: rgb(0,0,0);
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
</style>
