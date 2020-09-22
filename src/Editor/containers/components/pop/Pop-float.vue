<template>
  <div class="main" style="position:absolute;right:20px;top:-10px">
    <div class="bg"></div>
    <div class="msg">
      <div class="msg-detail" v-for="i in msg" :key="i.key">
        <img :src="i.url" :alt="i.label">
        <span>{{ i.label }}</span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {}
    },
    props: {
      msg: {
        default: [],
        type: Array
      }
    },
    methods: {}
  }
</script>

<style scoped lang="less" rel="stylesheet/less">
  .main {
    min-width: 120px;
    padding: 3px 10px 8px 5px;
    border-radius: 13px;
    box-shadow: 4px 2px 6px #ccc;
    overflow: hidden;
    display: flex;
    border-bottom: 2px solid #ccc;
    .bg {
      width: 100%;
      height: 100%;
      background: #fefcfd;
      position: absolute;
      left: 0;
      top: 0;
    }

    .msg {
      z-index: 1;
      display: flex;
      flex-direction: column;

      .msg-detail {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-top: 6.5px;
        margin-left: 5px;

        img {
          width: 18px;
          margin-right: 8px;
        }

        span {
          color: #97999d;
          font-size: 12px;
        }
      }
    }
  }
</style>
