<template>
  <div class="container">
    <transition name="fade">
      <div class="main" v-show="expand">
        <div class="bg"></div>
        <div class="left-menu"></div>
        <div class="right-menu">
          <div class="button-main">
            <Button type="primary" @click.native.prevent="openModule">导入能流模板</Button>
          </div>
          <div class="menu-canvas" @click="editAperture">
            <Icon type="md-aperture" />&nbsp;画布属性
          </div>
        </div>
      </div>
    </transition>
    <!--导入模板弹窗-->
    <Modal
      v-model="controllModule"
      :width="960"
      :closable="true"
      transfer
      :z-index="112"
      :mask-closable="false"
      title="选择能流模板"
    >
      <div class="content">
        <InsertModuleContent/>
      </div>
      <div slot="footer">
        <Button @click="cancelModule" type="default">{{ $t('L10210') }}</Button>
        <Button
          type="primary"
          @click.native.prevent="okModule"
          :loading="loadingM"
        >{{ $t('Y20002') }}</Button>
      </div>
    </Modal>
    <!--画布属性弹窗-->
    <Modal
      v-model="controllCanvas"
      :width="960"
      :closable="true"
      transfer
      :z-index="112"
      :mask-closable="false"
      title="画布属性"
    >
      <div class="content">
         <CanvasMenu/>
      </div>
      <div slot="footer">
        <Button @click="cancelCanvas" type="default">{{ $t('L10203') }}</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import InsertModuleContent from './components/actionMenu/InsertModuleContent'
import CanvasMenu from './components/canvasMenu'
export default {
  data() {
    return {
      cloneData: [],
      originData: [],
      dataSaveWarn: false,
      expand: true,
      controllModule: false,//导入模板弹窗控制
      controllCanvas: false,// 画布属性控制
      loadingM: false,
    };
  },
  methods: {
    /**
      cloneData 为克隆值，originData为表格实时data
     */
    dataSaveWarnFlag(cloneData, originData){
      if(cloneData != null) this.cloneData = cloneData;
      this.originData = originData;
    },  
    okModule() {
      this.controllModule = false;
    },
    cancelModule() {
      this.controllModule = false;
    },
    // 打开导入模板弹窗
    openModule() {
      this.controllModule = true;
    },
    doExpand(e) {
      this.expand = !e;
    },
    // 取消画布属性控制
    cancelCanvas(){
      // 取消导入模板弹窗
      // 检测用户是否有未保存的数据
      this.cloneData = this.cloneData.map(_ => {
        _.isEdit = true;// isEdit为操控编辑与保存按钮 不能加入比较
        return _;
      })
      this.originData = this.originData.map(_ => {
        _.isEdit = true;// isEdit为操控编辑与保存按钮 不能加入比较
        return _;
      })
      // 校验是否相等方式1---可不用区分对象在数组的位置
      const flag = this.originData.every(_i => {
        return this.cloneData.some(i => {
          return JSON.stringify(i) == JSON.stringify(_i)
        })
      })
      // 校验是否相等方式1
      if(!flag){
          console.log(this.cloneData, this.originData);
          this.$Modal.confirm({
              title: '关闭画布',
              content: '系统检测到"模型属性面板"有数据变动未做保存，确认关闭吗',
              onOk: () => {
                  this.controllCanvas = false;
              },
              onCancel: () => {
                  this.controllCanvas = true;
              }
          });
      }else{
        this.controllCanvas = false;
      }
    },
    // 进入画布属性弹窗
    editAperture(){
      this.controllCanvas = true;
    }
  },
  components: {
      InsertModuleContent,
      CanvasMenu
  },
  created() {
    let _t = this;
    _t.$X.utils.bus.$on("menu/actionMenu", _t.doExpand);
    // 用于获取attribute表格数据与克隆数据，用于比较值，提醒用户注意保存
    _t.$X.utils.bus.$on("menu/actionMenu/attribute", _t.dataSaveWarnFlag);
  }
};
</script>

<style lang="less" scoped>
.main {
  position: fixed;
  display: flex;
  top: 40px;
  width: 98.5%;
  z-index: 108;
  box-sizing: border-box;
  box-shadow: 4px 2px 6px #ccc;
  .bg {
    width: 100%;
    height: 50px;
    background: #000;
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0.2;
  }
  .right-menu {
    z-index: 1;
    flex-grow: 1;
    display: flex;
    .button-main {
      height: 50px;
      flex-grow: 1;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      box-sizing: border-box;
      padding-left: 10px;
    }
    .menu-canvas {
      height: 50px;
      width: 150px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 18px;
      color: #409efe;
      cursor: pointer;
      &:hover {
        color: #fffafa;
      }
    }
  }
  .left-menu {
    height: 50px;
    width: 270px;
    display: flex;
  }
}
</style>