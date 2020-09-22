<template>
  <div
    class="main"
    :class="`${ ballMsg.direction } ${ ballMsg.mode }`"
    :style="{ '--myRight': ballMsg.myRight + 'px', '--myTop': ballMsg.myTop + 'px' }"
  >
    <slot name="ball" v-if="ballMsg.direction == 'left'"></slot>
    <div
      v-for="i in ballNodeList"
      :class="i.className"
      :style="{ width: i.width, height: i.height }"
    ></div>
    <slot name="ball" v-if="ballMsg.direction == 'right'"></slot>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  computed: {
    ballNodeList() {
      let _t = this;
      let _ballNodeList = [
        {
          className: "top",
          width: "8px",
          height: "3px"
        },
        {
          className: "center",
          width: "2px",
          height: "7px"
        },
        {
          className: "bottom",
          width: "6px",
          height: "3px"
        }
      ];
      // 处理宽高---水平情况
      if (_t.ballMsg.mode == "horizontal") {
        _ballNodeList.map(_ => {
          let _height = _.height;
          _.height = _.width;
          _.width = _height;
        });
      }
      // 处理方向---球相对柄子向左情况
      if (_t.ballMsg.direction == "left") {
        _ballNodeList = _ballNodeList.reverse();
      }
      return _ballNodeList;
    }
  },
  props: {
    ballMsg: {
      type: Object,
      default() {
        return {
          myRight: 10, // 距离右边的位置
          myTop: 200, // 距离顶部的距离
          mode: "horizontal", // 方向
          direction: "left" // 相对柄子---球的方向
        };
      }
    }
  }
};
</script>

<style scoped lang="less" rel="stylesheet/less">
.main {
  position: fixed;
  right: var(--myRight);
  top: var(--myTop);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 113;
  .top,
  .bottom,
  .center {
    background: #1d91f9;
  }
}
</style>