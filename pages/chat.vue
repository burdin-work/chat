<template>
  <div>
    <header><h1>Chat bots 2.0</h1></header>
    <div class="contentWrap">
      <div class="content">
        <div class="chat">
          <div class="chatUsers">
            <h2>Список пользователей:</h2>
            <ul class="listUsers">
              <li v-for="u in users" :key="u.id" class="user" @click.prevent>
                <span>{{ u.name }}</span>
              </li>
            </ul>
          </div>
          <div class="chatMessages">
            <div class="messagesWrap">
              <Message
                v-for="m in messages"
                :key="m.text"
                :name="m.name"
                :text="m.text"
                :owner="m.id === user.id"
              />

              <NewMessageForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState} from 'vuex'
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

<style scoped>
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
  background-color: green;
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
  height: 100%;
}

li.user {
  display: block;
  height: 50px;
  background-color: blue;
  margin-bottom: 5px;
  cursor: pointer;
}
</style>
