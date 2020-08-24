<style lang="less" scoped>
.container{
    height:450px;
    padding-right:10px;
    padding-bottom:8px;
    .content{
        margin-top: 8px;
    }
}
.box {
  overflow: scroll;
}

/*滚动条整体样式*/
.box::-webkit-scrollbar {
  width: 8px;
  height: 1px;
}
/*滚动条滑块*/
.box::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.2);
  background: #409efe;
}
/*滚动条轨道*/
.box::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 1px #409efe;
  border-radius: 10px;
  background: #ccc;
}
</style>
<template>
  <div class="container box">
    <div class="content" v-for="item in popData" :key="item.id">
      <template>
        <h3 style="color:#409efe;margin-bottom:5px">{{ item.name }}</h3>
        <Table :columns="item.tableColumns" border stripe :data="item.tableData">
          <template slot-scope="{ row }" slot="plan">
              <a @click="lookWho('能源措施计划')">{{ row.plan }}</a>
          </template>
          <template slot-scope="{ row }" slot="rules">
              <a @click="lookWho('运行准则')">{{ row.rules }}</a>
          </template>
        </Table>
      </template>
    </div>
    <Modal
      class="preview-model"
      v-model="isMyShow"
      :title="cTitle"
      :width="960"
      :closable="true"
      :mask-closable="false">
      <div class="body">
          <RelationChildren :relationProp="relationProp"/>
      </div>
      <div slot="footer">
        <Button type="default" @click="doMyHide">{{ $t('Y20001') }}</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import RelationChildren from '../module/components/relation/components/relationChildren'
export default {
  data() {
    return {
      relationProp: '',
      // 子项弹出层标题
      cTitle: '关联展示信息配置',
      isMyShow: false,//关联子项
      popData: [
        {
          id:1,
          name: "对象属性",
          tableColumns: [
            {
              title: "属性名",
              key: "attribute",
              align: 'center',
              ellipsis: true,
              tooltip: true
            },
            {
              title: "图元名称",
              key: "name",
              align: 'center',
              ellipsis: true,
              tooltip: true
            },
            {
              title: "图元ID",
              key: "primitivesId",
              align: 'center',
              ellipsis: true,
              tooltip: true
            },
            {
              title: "用能类型",
              key: "type",
              align: 'center',
              ellipsis: true,
              tooltip: true
            },
            {
              title: "设备型号",
              key: "model",
              align: 'center',
              ellipsis: true,
              tooltip: true
            },
            {
              title: "进风量",
              key: "airIntake",
              align: 'center',
              ellipsis: true,
              tooltip: true
            },
            {
              title: "内部压力值",
              key: "pressureV",
              align: 'center',
              ellipsis: true,
              tooltip: true
            }
          ],
          tableData: [
            {
               id: 1,
               attribute: '值',
               name: '一车间发电机01',
               primitivesId: 'CJII--DHFJD',
               type: '风能',
               model: 'SJFKLSFA-67',
               airIntake: '1024P',
               pressureV: '1180HF'
            },
            {
               id: 2,
               attribute: '其它',
               name: '一车间发电机01',
               primitivesId: 'CJII--DHFJD',
               type: '风能',
               model: 'SJFKLSFA-67',
               airIntake: '1024P',
               pressureV: '1180HF'
            },
          ]
        },
       {
          id:2,
          name: "能源绩效参数",
          tableColumns: [
            {
              title: "能源绩效参数",
              key: "params",
              align: 'center',
              ellipsis: true,
              tooltip: true
            },
            {
              title: "助燃风温度",
              key: "temperature",
              align: 'center',
              ellipsis: true,
              tooltip: true
            },
            {
              title: "燃嘴的燃烧效率",
              key: "burningEfficiency",
              align: 'center',
              ellipsis: true,
              tooltip: true
            },
            {
              title: "设备运转率",
              key: "workEfficiency",
              align: 'center',
              ellipsis: true,
              tooltip: true
            }
          ],
          tableData: [
            {
               id: 1,
               params: '值',
               temperature: '120℃',
               burningEfficiency: '85%',
               workEfficiency: '95%'
            },
            {
               id: 2,
               params: '其它',
               temperature: '121℃',
               burningEfficiency: '85%',
               workEfficiency: '95%'
            },
          ]
        },
        {
          id:3,
          name: "关联信息展示",
          tableColumns: [
            {
              title: "关联信息",
              key: "relationMsg",
              align: 'center',
              ellipsis: true,
              tooltip: true
            },
            {
              title: "能源措施计划",
              key: "plan",
              align: 'center',
              ellipsis: true,
              tooltip: true,
              slot: 'plan'
            },
            {
              title: "运行准则",
              key: "rules",
              align: 'center',
              ellipsis: true,
              tooltip: true,
              slot: 'rules'
            }
          ],
          tableData: [
            {
               id: 1,
               relationMsg: '操作',
               plan: '查看',
               rules: '查看',
            },
            {
               id: 2,
               relationMsg: '其它',
               plan: '查看',
               rules: '查看',
            },
          ]
        },
      ]
    };
  },
  methods:{
    doMyHide(){
      this.isMyShow = false;
    },
    lookWho(who){
       this.relationProp = who;
       this.cTitle = who;
       this.isMyShow = true;
       this.$emit('closePop')
    }
  },
  components:{
    RelationChildren
  }
};
</script>
