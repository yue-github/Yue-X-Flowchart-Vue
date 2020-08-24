/**
* Created by WuTongYue on 2020/7/20---.
* Created by 玉旨旺 on 2019/10/15.
* canvas 画布
*/

<style scoped lang="less" rel="stylesheet/less">
  
</style>

<template>
  <div class="canvas-main">
     <template>
        <Tabs>
            <!--模型属性-->
            <TabPane :label="attribute">
               <Attribute/>
            </TabPane>
            <!--能源绩效参数-->
            <TabPane :label="params">
              <Params/>
            </TabPane>
            <!--关联信息展示信息配置-->
            <TabPane :label="msgSet">
              <Relation/>
            </TabPane>
             <!--能流图参数配置-->
            <TabPane :label="EnergyParamsConfig">
              <EnergyParamsConfig/>
            </TabPane>
        </Tabs>
    </template>
  </div>
</template>

<script>
import Attribute from './list/Attribute'
import Params from './list/params';
import Relation from './list/relation';
import EnergyParamsConfig from './list/EnergyParamsConfig'
export default {
  name: "Module",// 较多组件类似，后面抽离成组件复用优化
  data() {
    return {
      // 模型属性
      attribute: (h) => {
          return h('div', [
            h('icon', {
                props: {
                    custom:'iconfont i-attribute',
                    color: '#409efe',
                },
                style:{
                  lineHeight:'12px',
                }
            }),
            h('span', {
              style:{}
            },'模型属性')
              
          ])
      },
      // 能源绩效参数
      params: (h) => {
          return h('div', [
            h('icon', {
                props: {
                    custom:'iconfont i-params',
                },
                style:{
                  color:'#409efe',
                  lineHeight:'12px'
                }
            }),
            h('span', '能源绩效参数')
              
          ])
      },
      // 关联展示信息配置
      msgSet: (h) => {
          return h('div', [
            h('icon', {
                props: {
                    custom:'iconfont i-relation',
                    color: '#409efe',
                },
                style:{
                  lineHeight:'12px'
                }
            }),
            h('span', '关联展示信息配置')
              
          ])
      },
      // 能流图参数配置
      EnergyParamsConfig: (h) => {
          return h('div', [
              h('icon', {
                props: {
                    custom:'iconfont i-energyParamsConfig',
                    color: '#409efe',
                },
                style:{
                  lineHeight:'12px',
                  fontSize: '12px',
                  marginRight: '12px',
                }
            }),
            h('span', '能流图参数配置')
          ])
      }
    };
  },
  components:{
    Params,
    Relation,
    Attribute,
    EnergyParamsConfig
  },
  computed: {
     
  },
  methods: {
     
  },
  created() {
       
  }
};
</script>
