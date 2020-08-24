 /**
* Created by WuTongYue on 2020/7/20---.
* Created by 玉旨旺 on 2019/10/15.
* model 行业模型
*/
 <template>
  <div>
      <template><!--行业模型主表-->
        <Table border 
          :columns="columns" 
          :data="attributeData">
          <template slot-scope="{ row, index }" slot="hide">
                <Checkbox v-model="attributeData[index].hide" disabled></Checkbox>
          </template><template slot-scope="{ row, index }" slot="readOnly">
                <Checkbox v-model="attributeData[index].readOnly" disabled></Checkbox>
          </template>
          <template slot-scope="{ row, index }" slot="required">
                <Checkbox v-model="attributeData[index].required" disabled></Checkbox>
          </template>
          <template slot-scope="{ row, index }" slot="action">
              <Button type="primary" size="small" style="margin-right: 5px" @click="show(index)">查看</Button>
          </template>
        </Table>
      </template>
  </div>
</template>
<script>
export default {
  name: "Attribute",
  data() {
    return {
      styles: {
      },
      columns: [
        {
          title: "属性名",
          key: 'attribute',
          align: 'center'
        },
        {
          title: "字段名",
          key: "field",
          align: 'center'
        },
        {
          title: "值类型",
          key: "valueType",
          align: 'center'
        },
         {
          title: "默认值",
          key: "defaultV",
          align: 'center'
        },
         {
          title: "隐藏",
          key: "hide",
          align: 'center',
          slot: 'hide'
        },
         {
          title: "只读",
          key: "readOnly",
          slot: "readOnly",
          align: 'center'
        },
         {
          title: "必填",
          key: "required",
          slot: "required",
          align: 'center'
        },
        {
          title: "操作",
          slot: "action",
          width: 120,
          align: "center"
        }
      ],
      attributeData: [
        {
           id: 1,
           attribute: '图元名称1',
           field: 'MixKEid',
           valueType: 'TEXT',
           defaultV: '自动生成',
           hide: true,
           readOnly: true,
           required: true,
        },
         {
           id: 2,
           attribute: '图元名称2',
           field: 'MixKEid',
           valueType: 'TEXT',
           defaultV: '自动生成',
           hide: true,
           readOnly: true,
           required: true,
        },
         {
           id: 3,
           attribute: '图元名称3',
           field: 'MixKEid',
           valueType: 'TEXT',
           defaultV: '自动生成',
           hide: true,
           readOnly: true,
           required: true,
        },
         {
           id: 4,
           attribute: '图元名称4',
           field: 'MixKEid',
           valueType: 'TEXT',
           defaultV: '自动生成',
           hide: true,
           readOnly: true,
           required: false,
        },
         {
           id: 5,
           attribute: '图元名称5',
           field: 'MixKEid',
           valueType: 'TEXT',
           defaultV: '自动生成',
           hide: true,
           readOnly: false,
           required: true,
        },
         {
           id: 6,
           attribute: '图元名称6',
           field: 'MixKEid',
           valueType: 'TEXT',
           defaultV: '自动生成',
           hide: true,
           readOnly: true,
           required: true,
        },
      ]
    };
  },
  filters:{//若多地方用到可提取公用
      transfrom(e,v){

      }
  },
  methods: {
    show(index) {
      let content = '';// 智能点拼接字段属性
      for(let i in this.attributeData[index]){
        if(Object.prototype.toString.call(this.attributeData[index][i]) === '[object String]'){
          let c = this.columns.find(_ => _.key == i);
          content = `${content}${c.title}：${this.attributeData[index][c.key]}<br>`
        }
      }
      this.$Modal.info({// 查看
        title: "对象属性",
        content: `${content}
        ${this.attributeData[index].hide ? '【隐藏】' : '【出现】'}
        <br>${this.attributeData[index].readOnly ? '【只读】' : '【非只读】'}
        <br>${this.attributeData[index].required ? '【必填】' : '【非必填】'}`
      });
    },
  }
};
</script>
<style lang="less" scoped>
</style>
