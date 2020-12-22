<template>
  <div class="formWrap">
    <form @submit.prevent="send">
      <input type="text" v-model="text" placeholder="Start chatting!">
      <button>Send message</button>
    </form>
  </div>
</template>


<script>
  import { mapActions } from 'vuex'
  import moment from 'moment'
  export default {
    data: () => ({
      text: ''
    }),
    props: ['user'],
    mounted() {
    },
    methods: {
      ...mapActions(['sendMessage']),

      async send() {

        const message = {
          room: this.user.room,
          text: this.text,
          time: moment().format('LT'),
          senderId: this.$store.state.user.id,
          senderName: this.$store.state.user.name,
        }

        if (!message.text.replace(/\s/g, '')) {
          return console.error('The text field must not be empty.')
        }

        await this.sendMessage(message)

        await this.$socket.emit('createMessage', {
          ...message,
          _id: this.$store.state.messageInfo._id
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
  .formWrap form{
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 1rem 1rem 2rem 1rem;
    height: 60px;
    background-color: #d7dfe7;
    display: flex;
    justify-content: space-between;
    flex-wrap: nowrap;
    align-items: center;
  }
  .formWrap input{
    display: block;
    flex-grow: 7;
    margin-right: 10px;
    height: 36px;
    padding-left: 12px;
    font-size: 14px;
    border-radius: 6px;
    border: 1px solid rgba(153,153,153,.5);
    box-shadow: 0 0 4px rgba(153,153,153,.5);
  }
  .formWrap::placeholder{
    color: #999;
  }
  .formWrap input:focus,
  .formWrap input:active{
    border: 1px solid #74b9ef;
    box-shadow: 0 0 4px #74b9ef;
  }
  .formWrap button {
    cursor: pointer;
    display: block;
    background-color: #428bca;
    color: #fff;
    font-size: 13px;
    padding: 8px 50px;
    border: 1px solid #357ebc;
    border-radius: 10px;
    flex-grow: 1;
    max-width: 195px;
  }

  .formWrap button:active{
    background-color: #4f708d;
  }

  @media (max-width: 900px) {
    .formWrap button {
      padding: 8px 20px;
    }
    .formWrap input{
      flex-grow: 2;
      margin-right: 0;
    }
  }

  @media (max-width: 600px) {
    .formWrap form{
      height: 100px;
      flex-direction: column;
      justify-content: center;
    }
    .formWrap button {
      padding: 8px 40px;
      margin-top: 10px;
      width: 100%;
    }
    .formWrap input{
      padding: 12px 12px;
      flex-grow: 1;
      width: 100%;
    }
  }
</style>
