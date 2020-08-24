/**
* Created by WuTongYue on 2020/7/20.
* Created by 玉旨旺 on 2020/7/25.
* model 行业模型 图元编辑窗口
*/
<template>
  <div>
    <template><!--行业模型主表-->
      <Tabs size="small">
        <TabPane label="对象属性">
          <Table border
                 ref="selection"
                 :columns="general.columns"
                 :data="general.modelData">
            <template slot-scope="{ row, index }" slot="fixedAttrCheckbox">
              <CheckboxGroup v-model="general.modelData[index].operation">
                <Checkbox :label="$t('L10214')" disabled></Checkbox>
                <Checkbox :label="$t('L10215')" disabled></Checkbox>
                <Checkbox :label="$t('L10216')" disabled></Checkbox>
              </CheckboxGroup>
            </template>
          </Table>
        </TabPane>
      </Tabs>
      <br>
      <Tabs size="small">
        <TabPane label="自定义属性">
          <Button type="primary" style="margin:0 5px 10px 0" @click="add(modelData.length)">新增属性</Button>
          <Table border :columns="columns" :data="modelData">
            <template slot-scope="{ row, index }" slot="itemText">
              <Input type="text" v-model="edit.itemText" placeholder="请输入属性名" v-if="edit.index === index"/>
              <span v-else>{{ row.itemText }}</span>
            </template>

            <template slot-scope="{ row, index }" slot="itemValue">
              <Input type="text" v-model="edit.itemValue" placeholder="请输入字段名" v-if="edit.index === index"/>
              <span v-else>{{ row.itemValue }}</span>
            </template>

            <template slot-scope="{ row, index }" slot="valueType">
              <Select v-model="edit.valueType" placeholder="请选择值类型" v-if="edit.index === index">
                <Option :value="valueType" v-for="valueType in valueTypeItems">{{ valueType }}</Option>
              </Select>
              <span v-else>{{ row.valueType }}</span>
            </template>

            <template slot-scope="{ row, index }" slot="defaultValue">
              <Input type="text" v-model="edit.defaultValue" placeholder="请输入默认值" v-if="edit.index === index"/>
              <span v-else>{{ row.defaultValue }}</span>
            </template>
            <template slot-scope="{ row, index }" slot="dynamicAttrCheckbox">
              <CheckboxGroup v-model="modelData[index].operation">
                <Checkbox :label="$t('L10214')" :disabled="edit.index === index ? false : true"></Checkbox>
                <Checkbox :label="$t('L10215')" :disabled="edit.index === index ? false : true"></Checkbox>
                <Checkbox :label="$t('L10216')" :disabled="edit.index === index ? false : true"></Checkbox>
              </CheckboxGroup>
            </template>
            <template slot-scope="{ row, index }" slot="action">
              <div v-if="edit.index === index">
                <Button @click="handleSave(index)">{{ $t('L10211') }}</Button>&nbsp;
                <Button @click="handleCancel(index)">{{ $t('L10210') }}</Button>
              </div>
              <div v-else>
                <Button @click="handleEdit(row, index)">{{ $t('L10023') }}</Button>&nbsp;
                <Button @click="delConfirm(index)">{{ $t('L10212') }}</Button>
              </div>
            </template>
          </Table>
        </TabPane>
      </Tabs>
    </template>
    <!--删除提示-->
    <Modal v-model="delToggle" width="360">
      <p slot="header">
        <span>{{ $t('L10200') }}</span>
      </p>
      <div style="">
        <p>{{ warnContent }}</p>
      </div>
      <div slot="footer">
        <Button type="primary" @click="remove">{{ $t('L10208') }}</Button>
        <Button @click="delToggle=false">{{ $t('L10210') }}</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import config from '../../config'

  export default {
    name: 'Model',
    props: {
      entityData: {
        type: Object,
        required: false
      }
    },
    data () {
      return {
        delToggle: false,
        tempIndex: -1,
        warnContent: '确定要删除此项吗？',
        general: {
          modelData: [],
          columns: [{
            title: '属性名',
            key: 'itemText',
            align: 'center'
          }, {
            title: '字段名',
            key: 'itemValue',
            align: 'center'
          }, {
            title: '值类型',
            key: 'valueType',
            align: 'center'
          }, {
            title: '默认值',
            key: 'defaultValue',
            align: 'center'
          }, {
            width: 250,
            title: '使用方式',
            key: 'fixedAttrCheckbox',
            align: 'center',
            slot: 'fixedAttrCheckbox'
          }]
        },
        edit: {
          itemText: '',
          itemValue: '',
          valueType: '',
          defaultValue: '',
          operation: [],
          index: -1
        },
        row: {},
        valueTypeItems: ['text', 'string', 'int'],
        columns: [{
          title: '属性名',
          key: 'itemText',
          align: 'center',
          slot: 'itemText'
        }, {
          title: '字段名',
          key: 'itemValue',
          align: 'center',
          slot: 'itemValue'
        }, {
          title: '值类型',
          key: 'valueType',
          align: 'center',
          width: 120,
          slot: 'valueType'
        }, {
          title: '默认值',
          key: 'defaultValue',
          align: 'center',
          slot: 'defaultValue'
        }, {
          width: 230,
          title: '使用方式',
          key: 'dynamicAttrCheckbox',
          align: 'center',
          slot: 'dynamicAttrCheckbox'
        }, {
          title: '操作',
          slot: 'action',
          width: 190,
          align: 'center'
        }],
        modelData: []
      }
    },
    mounted () {
    },
    methods: {
      handleEdit (row, index) {
        this.edit.itemText = row.itemText
        this.edit.itemValue = row.itemValue
        this.edit.valueType = row.valueType
        this.edit.defaultValue = row.defaultValue
        // 当前不是预览状态时回退复选框到上一次状态
        if (this.edit.index !== -1) {
          this.modelData[this.edit.index].operation = this.edit.operation
        }
        this.row = row
        this.edit.index = index
        this.edit.operation = this.modelData[index].operation
      },
      handleSave (index) {
        this.modelData[index].itemText = this.edit.itemText
        this.modelData[index].itemValue = this.edit.itemValue
        this.modelData[index].valueType = this.edit.valueType
        this.modelData[index].defaultValue = this.edit.defaultValue
        this.edit.index = -1
      },
      handleCancel (index) {
        this.edit.itemText = this.row.itemText
        this.edit.itemValue = this.row.itemValue
        this.edit.valueType = this.row.valueType
        this.edit.defaultValue = this.row.defaultValue
        this.modelData[index].operation = this.edit.operation
        this.edit.index = -1
      },
      remove () {
        this.edit.index = -1
        this.modelData.splice(this.tempIndex, 1)
        this.delToggle = false
      },
      delConfirm (index) {
        this.tempIndex = index
        this.delToggle = true
      },
      add (index) {
        // 添加属性时初始化为空
        this.modelData.push({
          itemText: '',
          itemValue: '',
          valueType: '',
          defaultValue: '',
          operation: []
        })
        // 当前不是预览状态时回退复选框到上一次状态
        if (this.edit.index !== -1) {
          this.modelData[this.edit.index].operation = this.edit.operation
        }
        this.edit.itemText = ''
        this.edit.itemValue = ''
        this.edit.valueType = ''
        this.edit.defaultValue = ''
        this.edit.operation = []
        this.edit.index = index
      }
    }
  }
</script>
<style lang="less" scoped>
  .vertical-center-modal {
    display: flex;
    align-items: center;
    justify-content: center;

    .ivu-modal {
      top: 0;
    }
  }
</style>
