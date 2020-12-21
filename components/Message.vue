<template>
  <div>
    <div v-if="senderId === 'system'" class="system">
      <p class="systemText">User <b>{{text}}</b> has joined the room.</p>
      <hr>
    </div>

    <div v-else class="wrap">
      <div class="message" v-bind:class="[owner ? 'owner' : 'companion']">
        <div class="userInfo">
          <div class="userName">{{senderName}}</div>
          <div class="time">{{time}}</div>
        </div>
        <div class="text">{{text}}</div>
      </div>
    </div>

  </div>
</template>

<script>
  export default {
    props: {
      senderId: String,
      senderName: String,
      text: String,
      time: String,
      owner: {
        type: Boolean,
        default: false
      }
    }
  }
</script>

<style scoped>
  .system {
    margin-bottom: 1rem;
  }

  .system p {
    margin-bottom: 1rem;
  }

  .wrap {
    display: flex;
    flex-direction: column;
    border-radius: 6px;
  }


  .message {
    width: 60%;
    margin: 0 1rem 1rem 1rem;
    background: #fff;
    position: relative;
    border-radius: 6px;
    box-shadow:
      1px 0px rgba(171,171,171, .1), 3px 3px rgba(171,171,171, .3),
      2px 1px rgba(170,170,170, .2), 4px 4px rgba(170,170,170, .2),
      3px 2px rgba(169,169,169, .2), 5px 5px rgba(169,169,169, .1);
  }
  .message.owner {
    align-self: flex-end;
  }

  .companion.message:before {
    content: '';
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 10px 9px 10px 0;
    border-color: transparent rgba(171,171,171, .2) transparent transparent;
    position: absolute;
    bottom: 8px;
    left: -9px;
  }
  .companion.message:after {
    content: '';
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 9px 9px 9px 0;
    border-color: transparent #fff transparent transparent;
    position: absolute;
    bottom: 11px;
    left: -8px;
  }



  .owner.message:before {
    content: '';
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 10px 0 10px 9px;
    border-color: transparent transparent transparent rgba(171,171,171, .6);
    position: absolute;
    bottom: 9px;
    right: -11px;
  }
  .owner.message:after {
    content: '';
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 9px 0 9px 9px;
    border-color: transparent transparent transparent #ffffff;
    position: absolute;
    bottom: 11px;
    right: -8px;
  }

  .userInfo {
    display: flex;
    background-color: #becbd9;
    justify-content: space-between;
    align-items: center;
    font-weight: 600;
    height: 36px;
    padding: 0 16px;

  }
  .owner .userInfo {
    background-color: #f0cbb3;
  }

  .userInfo .userName {
    color: #203245;
    font-size: 14px;
  }
  .owner .userInfo .userName {
    color: #703a18;
  }
  .userInfo .time {
    color: #9aa8b7;
    font-size: 13px;
  }
  .owner .userInfo .time {
    color: #bfa390;
  }
  .text {
    min-height: 35px;
    display: flex;
    align-items: center;
    padding: 12px 16px 12px 16px;
    color: #4a4d52;
    font-weight: 700;
    font-size: 14px;
  }

  .systemText {
    color: #4a4d52;
    margin-left: 5px;
    font-style: italic;
    font-weight: 600;
    font-size: 14px;
  }

  .message p {
    margin-bottom: 0;
  }

  @media (max-width: 900px) {
    .message {
      align-self: center;
    }
    .message.owner {
      align-self: center;
    }
  }

  @media (max-width: 600px) {

    .message {
      width: 100%;
      min-width: 170px;
    }
  }
</style>
