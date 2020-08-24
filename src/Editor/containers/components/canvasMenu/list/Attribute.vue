 /**
* Created by WuTongYue on 2020/7/20---.
* Created by 玉旨旺 on 2019/10/15.
* 画布属性 canvas
*/
 <template>
  <div>
    <Button type="primary" size="small" style="margin:0 5px 10px 0" @click="add()">新增</Button>
    <Button type="error" size="small" style="margin:0 5px 10px 0" @click="delBatch">批量删除</Button>
    <template>
      <!--画布属性主表-->
      <Table
        border
        style="overflow:visible"
        ref="selection"
        stripe
        row-key="true"
        :columns="columns"
        :data="attributeDataDo"
        @on-selection-change="handleSelectChange"
      >
        <template slot-scope="{ row, index }" slot="name">
          <Input
            v-model="attributeData[index].name"
            clearable
            size="small"
            placeholder="请输入属性名"
            :disabled="!attributeDataDo[index].isEdit || attributeDataDo[index].source == 2 ? true : false"
          />
        </template>
        <template slot-scope="{ row, index }" slot="link">
          <Icon
            type="ios-link"
            @click.native.prevent="linkShowModal(index)"
            style="font-size:18px;color:#409efe;cursor:pointer"
            v-if="attributeDataDo[index].source == 2"
          />
          <span v-else>无</span>
        </template>
        <template slot-scope="{ row, index }" slot="source">
          <Select
            transfer
            v-model="attributeData[index].source"
            style="width:100px;text-align:center"
            :disabled="!attributeDataDo[index].isEdit"
          >
            <Option v-for="item in sourceList" :value="item.label" :key="item.id">{{ item.value }}</Option>
          </Select>
        </template>
        <template slot-scope="{ row, index }" slot="value">
          <Input
            v-model="attributeData[index].value"
            clearable
            size="small"
            placeholder="请输入值"
            :disabled="!attributeDataDo[index].isEdit || attributeDataDo[index].source == 2 ? true : false"
          />
        </template>
        <template slot-scope="{ row, index }" slot="action">
          <Button type="primary" size="small" style="margin-right: 5px" @click="show(index)">查看</Button>
          <Button
            type="primary"
            size="small"
            style="margin-right: 5px"
            @click="edit(row, index)"
          >{{ index | transformFont(attributeDataDo[index].isEdit) }}</Button>
          <Button type="error" size="small" @click="delConfirm(index)">删除</Button>
        </template>
      </Table>
    </template>
    <!--删除提示-->
    <Modal v-model="delToggle" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>删除确认</span>
      </p>
      <div style="text-align:center">
        <p>{{ warnContent }}</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long :loading="modal_loading" @click="remove(true)">删除</Button>
      </div>
    </Modal>
    <!--二层Modal-->
    <Modal
      v-model="editOrAddModel"
      :title="editOrAddFlag ? '编辑' : '新增'"
      @on-ok="editOrAddOk"
      :width="960"
      :closable="true"
      transfer
      :mask-closable="false"
      class-name="vertical-center-modal"
      @on-cancel="editOrAddCancel"
      :loading="editOrAddModelLoading"
    >
      <template>
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="110">
          <FormItem label="属性名" prop="name">
            <Input v-model="formValidate.name" placeholder="请输入属性名" :disabled="formValidate.source == 2 ? true : false"></Input>
          </FormItem>
          <FormItem label="值" prop="value">
            <Input v-model="formValidate.value" placeholder="请输入值，例如：一车间综合能流图" :disabled="formValidate.source == 2 ? true : false"></Input>
          </FormItem>
          <FormItem label="数据来源选择" prop="source">
            <Select
              transfer
              v-model="formValidate.source"
              @on-change="addSelectSourceChange"
              style="width:200px;text-align:center"
              placeholder="请选择数据来源"
            >
              <Option
                v-for="item in sourceList"
                :value="item.label"
                :key="item.id"
                style="text-align:center"
              >{{ item.value }}</Option>
            </Select>
          </FormItem>
        </Form>
      </template>
    </Modal>
    <!--外链弹窗dialog-->
    <Modal v-model="modalLink" :closable="true" transfer :mask-closable="false" title="数据源配置">
      <Form
        ref="formValidateLink"
        :model="formValidateLink"
        :rules="ruleValidateLink"
        :label-width="80"
      >
        <FormItem :label-width="0" prop="gender">
          <RadioGroup v-model="formValidateLink.gender" @on-change="handleChangeRadio">
          <div class="sensorID">
            <Radio label="1" border>传感器</Radio>
            <Select v-model="modelSensorID" filterable placeholder="请输入传感器ID" :disabled="inputDisabledFlag == 1 ? false : true">
                <Option v-for="item in modelSensorIDList" :value="item.id" :key="item.value">{{ item.label }}</Option>
            </Select>
          </div>
          <div class="sourceID">
            <Radio label="2" border>数据源URL</Radio>
            <Select v-model="modelSourceID" filterable placeholder="请输入数据源URL" :disabled="inputDisabledFlag == 2 ? false : true">
                <Option v-for="item in modelSourceIDList" :value="item.id" :key="item.value">{{ item.label }}</Option>
            </Select>
          </div>
          </RadioGroup>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="default" @click.native.prevent="cancelLinkModal">{{ $t('L10210') }}</Button>
        <Button type="primary" @click.native.prevent="okLinkModal">{{ $t('L10208') }}</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
export default {
  name: "Attribute",
  data() {
    return {
      // radio组选择变化时标识其右侧输入框是否可编辑
      inputDisabledFlag: 1,
      // 数据源URL绑定值
      modelSourceID: '',
      // 数据源URL选择列表
      modelSourceIDList: [
        {
         id: 1,
         label: '数据源ID1',
         value: '数据源ID1'
        },
        {
         id: 2,
         label: '数据源ID2',
         value: '数据源ID2'
        },
      ],
      // 传感器id绑定值
      modelSensorID: '',
      // 传感器id选择列表
      modelSensorIDList: [
        {
         id: 1,
         label: 'sentorID1',
         value: 'sentorID1'
        },
        {
         id: 2,
         label: 'sentorID2',
         value: 'sentorID2'
        },
      ],
      // 外链验证规则
      ruleValidateLink: {
        gender: [
          { required: true, message: "请选择数据源配置", trigger: "blur" }
        ]
      },
      // 外链验证对象
      formValidateLink: {
        gender: "1"
      },
      linkFlag: -1, // 标记点击了哪一行的外链
      modalLink: false, //外链控制布尔值
      sourceList: [
        {
          id: 1,
          label: 1,
          value: "手工填写"
        },
        {
          id: 2,
          label: 2,
          value: "外接数据"
        }
      ],
      delToggle: false, //删除提示
      modal_loading: false, //删除loading
      tempIndex: -1, // 表格删除临时标记索引
      warnContent: "您确认要删除此项吗",
      tableSelectItems: [], // 一层表格选中项
      editOrAddModel: false, // 一层表格的弹窗层控制参数
      editOrAddModelLoading: true, // 控制加载动画
      editOrAddFlag: true, // 标识是编辑还是添加
      editingId: -1, // 记录即将编辑的行数据的id
      formValidate: {
        //一层表格点击编辑数据
        name: "",
        source: 1,
        value: "",
        link: "",
        isEdit: false
      },
      ruleValidate: {
        //自定义验证规则
        name: [{ required: true, message: "属性名不能为空", trigger: "blur" }],
        value: [{ required: true, message: "值不能为空", trigger: "blur" }],
        source: [
          {
            required: true,
            type: "number",
            message: "请选择数据来源",
            trigger: "blur"
          }
        ]
      },
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "属性名",
          key: "name",
          align: "center",
          slot: "name"
        },
        {
          title: "值",
          key: "value",
          align: "center",
          slot: "value"
        },
        {
          title: "数据来源",
          key: "source",
          align: "center",
          slot: "source"
        },
        {
          title: "链接",
          key: "link",
          align: "center",
          slot: "link"
        },
        {
          title: "操作",
          slot: "action",
          width: 180,
          align: "center"
        }
      ],
      attributeData: [],
      // 克隆一份原本数据，用于取消保存操作
      cloneAttributeData: [],
    };
  },
  filters: {
    //若多地方用到可提取公用
    transformFont(i, isEdit) {
      return isEdit ? "保存" : "编辑";
    }
  },
  watch: {
     attributeData:{// 检测数据变动---保存数据到父组件--用于提醒用户数据变动了
       handler(newV, oldV){
         oldV = this.cloneAttributeData;
         if(Array.isArray(oldV) && newV.length !== oldV.length){
           // 取数组差集---过滤筛选
           if(newV.length > oldV.length){// 说明是增加的变动
              this.cloneAttributeData = this.cloneAttributeData.concat(newV.filter(_i => !oldV.some(i => i.id == _i.id)))
           }else{// 说明是删除的变动
              this.cloneAttributeData = this.cloneAttributeData.filter(_i_ => !oldV.filter(_i => !newV.some(i => i.id == _i.id)).some(i_ => i_.id == _i_.id))
           }
          //  刷新父组件预存用于比较的值
           this.$X.utils.bus.$emit('menu/actionMenu/attribute' ,this.clone(this.cloneAttributeData), this.clone(this.attributeData));
         }else if(Array.isArray(oldV) && newV.length === oldV.length){// 当新数据变动时，当长度未变动的情况处理
           this.$X.utils.bus.$emit('menu/actionMenu/attribute' , null, this.clone(this.attributeData));
           console.log(this.attributeData)
         }
       },
       deep: true,
       immediate: true
     }
  },
  computed: {
    attributeDataDo() {
      return this.attributeData;
    }
  },
  methods: {
    addSelectSourceChange(v){
      if(v == 2) this.modalLink = true;
    },
    // 外链radio选择改变时触发
    handleChangeRadio(v){
      this.inputDisabledFlag = v;
    },  
    // 确定操作
    okLinkModal() {
      // 定义选择了谁
      let chooseWho = this[`model${this.formValidateLink.gender == 2 ? 'Source' : 'Sensor'}ID`];
      // 获取最终的值对象
      let chooseOfValue = this[`model${this.formValidateLink.gender == 2 ? 'Source' : 'Sensor'}IDList`].find(_ => _.id == chooseWho)
      
      if(!chooseOfValue){
        this.$Message.warning("未选中值，请选择");
        return
      }
      if (this.linkFlag != -1 && this.editOrAddFlag) {
        console.log('选择的最终值对象 => ', chooseOfValue)
        // 将chooseOfValue值作为参数向后端发送请求获取数据---以下模拟
        let originObj = { ...this.attributeData[this.linkFlag] }
        originObj.name = new Date().toLocaleString('chinese', { hour12: false }) + '新数据';
        originObj.value = '新数据';
        this.attributeData.splice(this.linkFlag, 1, originObj)
        this.attributeData[this.linkFlag].isEdit = true;
        this.$Message.success('外链数据导入成功,请注意保存！');
      }
      // 新增弹出的外链操作
      if(!this.editOrAddFlag){
        this.formValidate = Object.assign({}, this.formValidate, { name: '测试值' + new Date().toLocaleString('chinese', { hour12: false }), value: '测试值' })
         console.log(chooseOfValue)
      }
      // 关闭弹窗
      this.modalLink = false;
    },
    // 取消链接弹窗
    cancelLinkModal() {
      this.modalLink = false;
    },
    // 展示外链弹窗
    linkShowModal(i) {
      this.linkFlag = i; //标记点击了哪一行的外链
      this.modalLink = true;
    },
    async getAttributeData() {
      // 模拟请求
      let res = await new Promise(resolve => {
        let data = [/**source值为2时是外链  1为为手工 */ 
          {
            id: 1,
            name: "模型名称",
            source: 2,
            value: "一车间综合能流图"
          },
          {
            id: 2,
            name: "模型ID1",
            source: 1,
            value: "CJ1-ZHNL01"
          },
           {
            id: 3,
            name: "模型ID2",
            source: 1,
            value: "CJ1-ZHNL01"
          },
           {
            id: 4,
            name: "模型ID3",
            source: 1,
            value: "CJ1-ZHNL01"
          }, {
            id: 5,
            name: "模型ID4",
            source: 1,
            value: "CJ1-ZHNL01"
          },
          {
            id: 6,
            name: "模型ID5",
            source: 1,
            value: "CJ1-ZHNL01"
          },
          {
            id: 7,
            name: "模型ID6",
            source: 1,
            value: "CJ1-ZHNL01"
          }
        ];
        data = data.map(i => {
          i.isEdit = false;
          return i;
        });
        resolve(data);
      });
      this.cloneAttributeData = this.clone(res);// 解决初次弹窗进入关闭弹窗时不监测问题
      this.attributeData = res;
      // 解决初次弹窗不改数据点关闭却提示问题---数据同步到父组件监测机制
      this.$X.utils.bus.$emit('menu/actionMenu/attribute' , this.clone(this.cloneAttributeData), this.clone(this.attributeData));
    },
    // 表格清除内容
    clearInput(i, who) {
      console.log(i);
      // this.attributeData[i][who] = '';
    },
    show(index) {
      let content = ""; // 智能点拼接字段属性
      for (let i in this.attributeData[index]) {
        if (
          Object.prototype.toString.call(this.attributeData[index][i]) ===
          "[object String]"
        ) {
          let c = this.columns.find(_ => _.key == i);
          content = `${content}${c.title}：${
            this.attributeData[index][c.key]
          }<br>`;
        }
      }
      this.$Modal.info({
        // 查看
        title: "模型属性",
        content: content
      });
    },
    // 克隆操作
    clone(OBJECT){
      return JSON.parse(JSON.stringify(OBJECT));
    },
    remove() {
      //正式删除---falg为true时是单个删除
      this.modal_loading = true;
      if (this.tempIndex != "batch") {
        setTimeout(() => {
          this.attributeData.splice(this.tempIndex, 1);
          this.modal_loading = false;
          this.delToggle = false;
          this.$Message.success("删除成功！");
          // 清空多选选中的项
          this.tableSelectItems =  [];
        }, 2000);
      } else {
        setTimeout(() => {
          // 模拟批量删除
          // 判断是否包含，取数组差集
          this.attributeData = this.attributeData.filter(item => {
            let flag = true;
            for (let i of this.tableSelectItems) {
              if (i.id === item.id) flag = false;
            }
            return flag;
          });
          this.modal_loading = false;
          this.delToggle = false;
          this.$Message.success("删除成功！");
        }, 2000);
      }
    },
    delConfirm(index) {
      // 删除确认
      this.warnContent = "您确认要删除此项吗";
      this.delToggle = true;
      this.tempIndex = index;
    },
    // 清空
    clearFormValidate() {
      let type;
      for (let i in this.formValidate) {
        type = Object.prototype.toString.call(this.formValidate[i]);
        switch (type) {
          case "[object Array]":
            this.formValidate[i] = [];
            break;
          case "[object Boolean]":
            this.formValidate[i] = false;
            break;
          default:
            this.formValidate[i] = "";
            break;
        }
      }
    },
    add() {
      // 添加
      // 清空默认值
      this.clearFormValidate();
      this.$refs["formValidate"].resetFields();
      this.editOrAddFlag = false; // 标识是编辑还是添加 true为编辑
      this.editOrAddModel = true; // 打开弹层
    },
    edit(row, index) {
      // 编辑
      this.attributeData[index].isEdit = !this.attributeData[index].isEdit;
      this.editingId = row.id;
      this.editOrAddFlag = true; // 标识是编辑还是添加
      if(!this.attributeData[index].isEdit){
        this.$Message.success('数据保存成功');
        this.cloneAttributeData[index] = { ...this.attributeData[index] }
        this.$X.utils.bus.$emit('menu/actionMenu/attribute' , this.clone(this.cloneAttributeData), this.clone(this.attributeData));
      }
      console.log(this.attributeData);
    },
    delBatch() {
      //批量删除
      this.tableSelectItems = this.tableSelectItems.filter(_ => {
        return this.attributeData.some(i => {
          // 意在解决多选后没删，被单选删了的问题
          return i.id == _.id;
        });
      });
      if (this.tableSelectItems.length === 0) {
        this.$Message.warning("您未选中项目");
        return;
      }
      this.tempIndex = "batch";
      this.warnContent = `您确认要删除选中的${this.tableSelectItems.length}项吗`;
      this.delToggle = true;
    },
    handleSelectChange(e) {
      // 选择触发
      this.tableSelectItems = e;
    },
    // 一层表格弹窗点击取消
    editOrAddCancel(name = "formValidate") {
      this.editOrAddModel = false;
    },
    // 一层表格弹窗点击确定
    editOrAddOk(name = "formValidate") {
      console.log(this.formValidate);
      // ---可优化，设计代码重用
      this.editOrAddModelLoading = true;
      if (this.editOrAddFlag == true) {
        // true表示是点击了编辑
        this.$refs[name].validate(valid => {
          if (valid) {
            setTimeout(() => {
              // 模拟更新
              this.$Message.success("成功更新一条数据!");
              this.attributeData = this.attributeData.map(_ =>
                _.id == this.editingId
                  ? Object.assign({}, _, this.formValidate)
                  : _
              );
              this.editOrAddModel = false;
              this.clearFormValidate();
              if (this.$refs["formValidate"])
                // 重置
                this.$refs["formValidate"].resetFields();
            }, 1300);
          } else {
            this.editOrAddModelLoading = false;
            setTimeout(() => {
              // 设置宏任务恢复loading状态，避免二次点击验证不通过关闭Modal
              this.editOrAddModelLoading = true;
            }, 0);
            this.$Message.error("更新数据失败!");
          }
        });
        return;
      }
      this.$refs[name].validate(valid => {
        if (valid) {
          setTimeout(() => {
            // 模拟添加
            this.$Message.success("成功添加一条数据!");
            this.attributeData.push({ ...this.formValidate });
            this.editOrAddModel = false;
            this.clearFormValidate();
            if (this.$refs["formValidate"])
              // 重置
              this.$refs["formValidate"].resetFields();
          }, 1300);
        } else {
          this.editOrAddModelLoading = false;
          setTimeout(() => {
            // 设置宏任务恢复loading状态，避免二次点击验证不通过关闭Modal
            this.editOrAddModelLoading = true;
          }, 0);
          this.$Message.error("添加数据失败!");
        }
      });
    }
  },
  created() {
    this.getAttributeData();
  },
  mounted() {
    console.log(this.attributeDataDo);
  }
};
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
.sensorID,.sourceID{
  display:flex;
}
.sourceID{
  margin-top: 16px;
}
</style>
