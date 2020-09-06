/**
* Created by OXOYO on 2019/7/2.
*
* NodeElement 节点元素
*/

<style scoped lang="less" rel="stylesheet/less">
  .node-element {
    display: inline-block;
    margin: 2px;
    padding:3px;
    padding-right:5px;
    &:hover .content{
      border-color: #ccc;
      cursor: move;
    }
    .content {
      display: inline-block;
      border: 1px solid transparent;
      padding:5px;
      padding-right:6px;
      .icon {
        width: 32px;
        height: 30px;
        display: block;
        position: relative;
        overflow: hidden;
      }
      .content-liars{
        position: relative;
        .content-liars-child{
          width:100%;
          height:100%;
          position:absolute;
          top:0;
          left:0
        }
      }
    }
  }
 .icon-content{
   display:flex;
   justify-content: center;
   align-items: center;
   padding:0;
   margin:0;
   border-radius:100%;
 }
  .my-icon{
    color: var(--color);
    font-size: var(--size); 
    border-radius:100%;
  }
  .icon-node-element{
    display:flex;
    width:25%;
    justify-content: center;
    align-items: center;
    padding:0;
    margin:0;
    margin-top:1px;
    height:60px;
    &:hover .content{
       border-color:transparent;
    }
    &:hover .my-icon{
      box-shadow:0px 0px 20px 0px #409efe;
      cursor: move;
    }
  }
</style>

<template>
  <div
    class="node-element"
    @mousedown="handleMouseDown"
    :class="{'icon-node-element': info.type == 'iconfont' ? true : false}"
  >
    <div class="content" :class="{ iconContent: info.type == 'iconfont' }" :title="title">
      <div class="content-liars" v-if="info.type.includes('image')">
        <!--气！img标签好像会丢失事件-->
        <img :src="info.img" class="content-img" alt="" :style="{ 'width': info.width + 'px', 'height': info.height + 'px' }"></img>
        <div style="" class="content-liars-child"></div>
      </div>
      <svg class="icon" v-html="info.icon" v-show="isShow"></svg>
      <span class="iconfont my-icon" style="margin:0;padding:0" v-html="info.text" :style="{'--color': info.color, '--size': info.size + 'px'}" v-if="info.type == 'iconfont'"></span>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'NodeElement',
    props: {
      title: {
        type: String,
        required: true
      },
      info: {
        type: Object,
        required: true,
        default () {
          return {
            type: 'circle',
            label: 'circle',
            enable: true,
            width: 40,
            height: 40,
            anchorPoints: [ [0, 0], [0, 1], [1, 0], [1, 1] ],
            svg: ``
          }
        }
      },
      width: {
        type: Number,
        default: 40
      },
      height: {
        type: Number,
        default: 40
      }
    },
    computed: {
      isShow(){
        let _t = this;
        return !(_t.info.type == 'iconfont' || _t.info.type.includes('image'))
      },
      elementStyle () {
        const _t = this
        let style = {}
        if (_t.width) {
          style.width = _t.width + 'px'
        }
        if (_t.height) {
          style.height = _t.height + 'px'
        }
        return style
      }
    },
    methods: {
      handleMouseDown (event) {
        const _t = this
        _t.$X.utils.bus.$emit('editor/add/node', _t.info)
      }
    }
  }
</script>
