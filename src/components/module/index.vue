/**
* Created by WuTongYue on 2020/7/20---.
* Created by 玉旨旺 on 2019/10/15.
* model 能流模板
*/

<style scoped lang="less" rel="stylesheet/less">

</style>

<template>
  <div class="module-main">
     <template>
        <Tabs>
            <!--对象属性-->
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
        </Tabs>
    </template>
  </div>
</template>

<script>
import Attribute from './components/attribute';// 对象属性
import Params from './components/params/index';
import Relation from './components/relation/index';
export default {
  name: "Module",// 较多组件类似，后面抽离成组件复用优化
  data() {
    return {
      // 对象属性
      attribute: (h) => {
          return h('div', [
            h('icon', {
                props: {
                    custom:'iconfont i-attribute',
                    color: '#409efe',
                },
                style:{
                  lineHeight: '12px'
                }
            }),
            h('span', '对象属性')

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
                  lineHeight: '12px'
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
                  lineHeight: '12px'
                }
            }),
            h('span', '关联展示信息配置')

          ])
      }
    };
  },
  components:{
    Attribute,
    Params,
    Relation
  },
  computed: {

  },
  methods: {

  },
  created() {

  }
};
</script>
