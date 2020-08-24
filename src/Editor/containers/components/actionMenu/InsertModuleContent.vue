<template>
  <div>
    <Form
      ref="formValidate"
      style="margin-top:13px;"
      inline
      :model="formValidate"
      :rules="ruleValidate"
      :label-width="80"
      :height="40"
    >
      <div class="item-container">
        <div class="condition">
          <FormItem label="模板名称" prop="name" :label-width="70">
            <Input v-model="formValidate.name" placeholder="请输入模板名称"></Input>
          </FormItem>
          <FormItem label="层级" prop="hierarchy" :label-width="40">
            <Select v-model="formValidate.hierarchy" placeholder="请选择层级">
              <Option
                style="text-align:center"
                :value="item.label"
                v-for="item in hierarchy"
                :key="item.id"
              >{{ item.name }}</Option>
            </Select>
          </FormItem>
        </div>
        <div class="line-v"></div>
        <div class="action-button">
          <FormItem :label-width="10">
            <Button type="primary" @click="handleSubmit('formValidate')">查询</Button>
            <Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
          </FormItem>
        </div>
      </div>
    </Form>
    <Divider type="horizontal" />
    <div class="hierarchy-item-container">
      <div class="item-detail" v-if="Array.isArray(modulesDataDo) && modulesDataDo.length > 0">
        <div class="hierarchy-item" v-for="(item, index) in modulesDataDo">
          <div class="h-item" :class="isShadow == index ? 'render-shadow' : ''" @click="chooseH(index)">
            <div class="h-item-title">
              <h2>{{ item.name }}</h2>
              <Tag checkable color="blue" style="margin-top:5px" v-if="item.label == 1">{{ item.label | changeLabel }}</Tag>
              <Tag checkable color="green" style="margin-top:5px" v-if="item.label == 2">{{ item.label | changeLabel }}</Tag>
              <Tag checkable color="red" style="margin-top:5px" v-if="item.label == 0">{{ item.label | changeLabel }}</Tag>
            </div>
            <img :src="item.img" :alt="item.name">
          </div>
        </div>
      </div>
      <!--无数据时提示-->
      <div class="no-msg" v-else>
        <Icon type="md-cloud" />&nbsp;暂无数据
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isShadow: -1,
      modulesData: [
        
      ],
      hierarchy: [
        {
          id: 1,
          name: "设备级",
          label:2
        },
        {
          id: 2,
          name: "车间级",
          label: 1
        },
        {
          id: 3,
          name: "公司级",
          label: 0
        }
      ],
      formValidate: {
        name: "",
        hierarchy: ""
      },
      ruleValidate: {}
    };
  },
  filters:{
    // 层级名称转换
    changeLabel(label){
      switch(label){
        case 0:
        return '公司级';
        case 1:
        return '车间级';
        case 2:
        return '设备级';
      }
    }
  },
  computed: {
    modulesDataDo(){
      return this.modulesData;
    }
  },
  methods: {
    async getModulesData(formValidate){
      // 模拟后端请求
      let res = await new Promise(resolve => {
        let modulesData = [
          {
            id: 1,
            label: 0,
            name: "天然气能流模板",
            img: require("@/assets/images/test/module.jpg")
          },
          {
            id: 2,
            label: 1,
            name: "风能能流模板",
            img: require("@/assets/images/test/module.jpg")
          },
          {
            id: 3,
            label: 2,
            name: "发电能流模板",
            img: require("@/assets/images/test/module.jpg")
          },
          {
            id: 1,
            label: 0,
            name: "天然气能流模板",
            img: require("@/assets/images/test/module.jpg")
          },
          {
            id: 2,
            label: 1,
            name: "核武器能流模板",
            img: require("@/assets/images/test/module.jpg")
          },
          {
            id: 3,
            label: 2,
            name: "发电能流模板",
            img: require("@/assets/images/test/module.jpg")
          }
        ]
        console.log(formValidate)
        resolve(formValidate ? modulesData.filter(i => ((formValidate.hierarchy || (formValidate.hierarchy === 0)) ? i.label == formValidate.hierarchy : true) && (i.name.includes(formValidate.name))) : modulesData)
      })
      this.modulesData = res;
      this.$nextTick(() => {
          this.$Message.destroy();
      })
    },
    chooseH(i){
      this.isShadow = i;
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.$Message.loading({
            top: 50,
            duration: 0,
            content: '拼命搜索中...'
          })
          this.getModulesData(this.formValidate) 
        } else {
          this.$Message.error("Fail!");
        }
      });
    },
    handleReset(name) {
      this.$refs[name].resetFields();
      this.getModulesData();
    }
  },
  created(){
    this.getModulesData();
    let that = this;
    document.onkeypress = function(e) {
      var keycode = document.all ? event.keyCode : e.which;
      if (keycode == 13) {
        that.handleSubmit('formValidate');// 登录方法名
         return false;
      }
    }
  }
};
</script>
 
 <style lang="less" scoped>
.item-container {
  display: flex;
  .condition {
    flex: 1;
    height: 40px;
    text-align: right;
  }
  .action-button {
    flex: 1;
    height: 40px;
  }
  .line-v {
    height: 25px;
    border: 1px dashed #ccc;
    margin: 5px 10px 0px;
  }
}
.hierarchy-item-container {
  display: flex;
  box-sizing: border-box;
  justify-content: center;
  background: #f0f0f0;
  padding: 8px;
  padding-left: 9px;
  border-radius: 5px;
  .no-msg{
    display:flex;
    width:200px;
    height:100px;
    margin: 10px;
    border-radius: 10px;
    justify-content: center;
    align-items: center;
    background:#fff;
    color: #ccc;
    font-size: 18px;
  }
  .item-detail {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    .hierarchy-item {
      width: 33.3%;
      background: #f0f0f0;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      padding: 8px;
      .h-item {
        background: #fff;
        border-radius: 3px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding:8px;
        box-sizing:border-box;
        cursor: pointer;
        border: 1px dashed transparent;
        box-shadow: 2px 1px 4px #fff;
        .h-item-title{
          display:flex;
          padding-bottom:3px;
          h2{
            margin-right: 3px;
            white-space:nowrap;
            text-overflow:ellipsis;
            overflow:hidden;
          }
        }
        &.render-shadow{
          box-shadow: 0px 0px 10px red;
          color: #409efe;
        }
        &:hover{
          color: #409efe;
          border-color: #409efe;
        }
        &:hover img{
          transform: scale(1.02);
        }
        img{
          width:100%;
          transition: transform .5s ease;
        }
      }
    }
  }
}
</style>