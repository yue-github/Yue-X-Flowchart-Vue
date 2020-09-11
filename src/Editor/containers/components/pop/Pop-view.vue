<template>
  <div class="main" :style="doMyMsg">
    <div
      class="bg-control"
      :style="{background: myMsg.data.bgColor, opacity: myMsg.data.bgOpacity, border: myMsg.data.boxBorder }"
    ></div>
    <div class="container">
      <div class="title">
        <span class="title-msg">{{ myMsg.data.title }}</span>
      </div>
      <div class="devide"></div>
      <div class="table-detail">
        <div class="table-bg">
          <div
            class="table-row-bg"
            v-for="(i, ind) in tableDataDo"
            :class="{ 'row-bg-head': ind == 0, 'row-bg-normal': ind != 0, 'odd': ind % 2 == 0, 'even': ind % 2 == 1 }"
            :style="{ '--myHeight': `${ columnHeight }px` }"
          ></div>
        </div>
        <div class="row" v-for="i in tableDataDo">
          <div class="row-container">
            <h5 class="table-title">{{ i.title }}</h5>
            <div
              class="column-item"
              :class="{ 'heightSet': WHactive }"
              v-for="column in i.items"
              :title="column"
            >
              <img
                :src="column"
                alt
                v-if="column.includes('.jpg') || column.includes('.png') || column.includes('.gif')"
                style="width:50px;height:20px"
              />
              <div
                v-else
                :class="{'imgSet': WHactive}"
                class="column-item-detail"
                :style="{ 'max-width': i.title == '备注' ? '150px' : '120px' }"
              >{{ column }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      columnHeight: 25
    };
  },
  props: {
    myMsg: {
      default: {},
      type: Object
    }
  },
  computed: {
    doMyMsg() {
      return {
        border: this.myMsg.data.boxBorder,
        left: !this.myMsg.isRight ? this.myMsg.x + "px" : "",
        right: this.myMsg.isRight ? this.myMsg.x + "px" : "",
        top: this.myMsg.y + "px",
        position: this.myMsg.posType, //位置类型
        "min-width": this.myMsg.minWidth ? this.myMsg.minWidth + "px" : "150px" // 最小宽度
      };
    },
    tableDataDo() {
      let renderData = [];
      for (let i in this.myMsg.data.titles) {
        let json = {
          title: this.myMsg.data.titles[i],
          items: this.myMsg.data.tableData.map(_ => _[i])
        };
        renderData.push(json);
      }
      console.log(renderData);
      return renderData;
    },
    WHactive() {
      return this.myMsg.data.tableData.some(_ =>
        Object.values(_).some(
          _ => _.includes(".jpg") || _.includes(".gif") || _.includes(".png")
        )
      );
    }
  },
  methods: {
    getStyle(obj, attr) {
      return obj.currentStyle
        ? obj.currentStyle[attr]
        : getComputedStyle(obj, null)[attr];
    }
  },
  watch: {
    // 深度监听---动态获取每一表格行高---动态设置
    myMsg: {
      handler(newV, oldV) {
        let _t = this;
        _t.$nextTick(() => {
          const columnItemDom = document.querySelector(".column-item");
          _t.columnHeight =
            parseFloat(_t.getStyle(columnItemDom, "height")) +
            parseFloat(_t.getStyle(columnItemDom, "margin-top"));
          console.log("------表格普通列高------", _t.columnHeight);
        });

        console.log();
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {
    this.myMsg = {
      // 静态表格弹层
      x: -80, // 距离左右位置
      y: 20, // 距离上面距离
      posType: "absolute", // 位置类型
      minWidth: 456, // 容器最小宽度
      data: {
        id: 0,
        title: "目标指标情况", // 标题
        bgColor: "#c5cdd8", // 盒子背景颜色
        bgOpacity: 1, // 盒子背景颜色透明度
        handleLogo: require("@/assets/images/bindAttr/green.png"), // 手柄logo
        boxBorder: "0.5px solid #c5cdd8", // box边框设置
        titles: {
          // 模拟表格标题---注意字段名例如row1...与具体数据的属性需要保持一致
          row1: "能源指标名称",
          row2: "单位",
          row3: "基准",
          row4: "指标值",
          row5: "备注"
        },
        tableData: [
          // 绑定属性表格数据
          {
            row1: "万元产值综合能耗",
            row2: "toc/万元",
            row3: `0.1${(Math.random() * 100) >>> 0}`,
            row4: `0.1${(Math.random() * 100) >>> 0}`,
            row5: "2020年目标及能源指标值与能源基准下调1%"
          },
          {
            row1: "原煤单位产品电耗",
            row2: "toc/万元",
            row3: `0.1${(Math.random() * 100) >>> 0}`,
            row4: `0.1${(Math.random() * 100) >>> 0}`,
            row5: "2020年目标及能源指标值与能源基准下调1%"
          },
          {
            row1: "原煤单位产品综合能耗",
            row2: "toc/万元",
            row3: `0.1${(Math.random() * 100) >>> 0}`,
            row4: `0.1${(Math.random() * 100) >>> 0}`,
            row5: "2020年目标及能源指标值与能源基准下调1%"
          },
          {
            row1: "选煤单位产品综合能耗",
            row2: "toc/万元",
            row3: `0.1${(Math.random() * 100) >>> 0}`,
            row4: `0.1${(Math.random() * 100) >>> 0}`,
            row5: "2020年目标及能源指标值与能源基准下调1%"
          },
          {
            row1: "选煤电气消耗",
            row2: "toc/万元",
            row3: `0.1${(Math.random() * 100) >>> 0}`,
            row4: `0.1${(Math.random() * 100) >>> 0}`,
            row5: "2020年目标及能源指标值与能源基准下调1%"
          }
        ]
      }
    };
  }
};
</script>

<style scoped lang="less" rel="stylesheet/less">
.main {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  box-shadow: 2px 2px 6px #c5cdd8;
  z-index: 114;
  overflow: hidden;
  opacity: 1;
  .bg-control {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
  }
  .container {
    position: relative;
    padding: 5px 0;
    .title {
      justify-content: flex-start;
      display: flex;
      align-items: center;
      padding-left: 8px;
      font-weight: 610;
    }
    .table-detail {
      display: flex;
      z-index: 1;
      position: relative;
      .table-bg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #fefcfd;
        z-index: -100;
        .table-row-bg {
          width: 100%;
          &.row-bg-head {
            height: 23px !important;
            background: #c5cdd8 !important;
          }
          &.row-bg-normal {
            height: var(--myHeight);
          }
          &.odd {
            background: #e8edf6;
          }
        }
      }
      .row {
        padding: 0 5px;
        margin-left: 5px;
        .row-container {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          position: relative;
          .table-title {
            padding-bottom: 3px;
          }
          .column-item {
            overflow: hidden;
            margin-top: 5px;
            font-size: 12px;
            .column-item-detail {
              max-width: 120px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            .imgSet {
              height: 20px;
              display: flex;
              align-items: center;
            }
            & {
              height: 20px;
            }
          }
        }
        &:first-child {
          margin-left: 0;
        }
      }
    }
  }
}
.devide {
  width: 100%;
  height: 2px;
  background: #fff;
  margin: 6px 0px;
  box-shadow: 0px 0px 1px 0px #fff;
}
</style>
