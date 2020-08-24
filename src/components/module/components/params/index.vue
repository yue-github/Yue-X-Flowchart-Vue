 /**
* Created by WuTongYue on 2020/7/20---.
* Created by 玉旨旺 on 2019/10/15.
* model 行业模型
*/
<style lang="less" scoped>
.vertical-center-modal {
  // 无用可删除，先留着---Modal居中用
  display: flex;
  align-items: center;
  justify-content: center;
  .ivu-modal {
    top: 0;
  }
}
.form-container {
  display: flex;
  align-items: center;
  justify-content: center;
  .form-left {
    box-sizing:border-box;
    width:40%;
    height:100%;
    padding: 0 20px;
  }
  .form-middle{
    width:1px;
    height:350px;
    border-left:1px dashed #ccc;
  }
  .form-right {
    box-sizing:border-box;
    width:60%;
    padding:20px;
  }
}
.ivu-table .table-info-cell-header td{
        background-color: #187;
        color: #fff;
    }
</style>
 <template>
  <div>
    <Button type="primary" size="small" style="margin:0 5px 10px 0" @click="add()">新增</Button>
    <Button type="error" size="small" style="margin:0 5px 10px 0" @click="delBatch">批量删除</Button>
    <template>
      <!--行业模型主表-->
      <Table
        border
        ref="selection"
        :columns="columns"
        :data="paramsData"
        @mouseenter.native="tableHover"
        @on-row-dblclick="dblclick"
        @on-selection-change="handleSelectChange"
      >
        <template slot-scope="{ row, index }" slot="hide">
          <Checkbox v-model="paramsData[index].hide" disabled></Checkbox>
        </template>
        <template slot-scope="{ row, index }" slot="readOnly">
          <Checkbox v-model="paramsData[index].readOnly" disabled></Checkbox>
        </template>
        <template slot-scope="{ row, index }" slot="required">
          <Checkbox v-model="paramsData[index].required" disabled></Checkbox>
        </template>
        <template slot-scope="{ row, index }" slot="action">
          <Button type="primary" size="small" style="margin-right: 5px" @click="show(index)">查看</Button>
          <Button type="primary" size="small" style="margin-right: 5px" @click="edit(row)">编辑</Button>
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
      :title="editOrAddFlag ? `能源绩效参数：${cTitle}` : '新增'"
      :width="1200"
      :style="styles"
      :closable="true"
      transfer
      :mask-closable="false"
      class-name="vertical-center-modal"
    >
      <template>
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="150">
          <div v-if="false">
            <FormItem label="能源绩效参数" prop="paramsName" v-show="!editOrAddFlag">
              <Input v-model="formValidate.paramsName" placeholder="请输入能源绩效参数"></Input>
            </FormItem>
            <FormItem label="单位" prop="company" v-if="false">
              <Input v-model="formValidate.company" placeholder="请输入单位"></Input>
            </FormItem>
            <FormItem label="计算脚本" prop="calculation">
              <Input v-model="formValidate.calculation" placeholder="请输入计算脚本"></Input>
            </FormItem>

            <FormItem label="关联因子" prop="correlationFactorId">
              <Input v-model="formValidate.correlationFactorId" placeholder="请选择关联因子id"></Input>
            </FormItem>
            <FormItem label="是否隐藏" prop="hide" v-if="false">
              <Checkbox v-model="formValidate.hide"></Checkbox>
            </FormItem>
            <FormItem label="是否只读" prop="readOnly" v-if="false">
              <Checkbox v-model="formValidate.readOnly"></Checkbox>
            </FormItem>
            <FormItem label="是否必填" prop="required" v-if="false">
              <Checkbox v-model="formValidate.required"></Checkbox>
            </FormItem>
          </div>
          <div class="form-container">
            <div class="form-left">
              <div class="relation-form" style="margin-top:-20px">
                <!--关联因子-->
                <FormItem
                  prop="correlationFactorId"
                  class="form-item"
                  label="关联因子"
                  :label-width="70"
                >
                  <Select
                    v-model="relationSelectDef"
                    filterable
                    remote
                    clearable
                    :disabled="editOrAddFlag"
                    ref="relationSelect"
                    @click.native="relationQueryClick"
                    @on-query-change="relationQueryChange"
                    @on-change="relationChangeSel"
                    placeholder="请输入选择"
                    :remote-method="remoteMethodSel"
                    :loading="loadingSelect"
                  >
                    <Option
                      v-for="(option, index) in optionsSel"
                      :value="option.value"
                      :key="index"
                    >{{option.label}}</Option>
                  </Select>
                </FormItem>
              </div>
              <div class="relation-table">
                  <Table :columns="columnsRelation" height="333" stripe border :row-class-name="rowClassName" :data="dataRelation"></Table>
              </div>
            </div>
            <div class="form-middle"></div>
            <div class="form-right">
              <div class="form-introduce">
                <FormItem prop="CFIntroduce" :label-width="0">
                    <div><span style="color:red;margin-right:4px;font-size:15px" v-html="'*'"/>计算公司说明</div>
                    <Input v-model="formValidate.CFIntroduce" type="textarea" :autosize="{minRows: 4,maxRows: 4}" placeholder="请输入计算公司说明"></Input>
                </FormItem>
              </div>
              <div class="form-cumputed">
                <FormItem prop="calculation" :label-width="0">
                  <div><span style="color:red;margin-right:4px;font-size:15px" v-html="'*'"/>计算脚本</div>
                  <Input v-model="formValidate.calculation" type="textarea" :autosize="{minRows: 9.5,maxRows: 9.5}" placeholder="请输入计算脚本"></Input>
                </FormItem>
              </div>
            </div>
          </div>
        </Form>
      </template>
      <div slot="footer">
        <Button
          type="default"
          @click.native.prevent="editOrAddCancel('formValidate')"
        >{{ $t('L10210') }}</Button>
        <Button
          type="primary"
          @click="editOrAddOk('formValidate')"
          :loading="editOrAddModelLoading"
        >{{ $t('L10209') }}</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import paramsChildren from "./components/paramsChildren";
export default {
  name: "Params",
  data() {
    return {
      relationSelectIntV: '',//关联因子搜索键入的值---用于点击搜框无值时显示默认值
      relationSearchT: null,//关联搜索防抖 ---顺便解决搜索框backSpace过快导致搜索默认下拉框值不呈现bug
      columnsRelation: [
        {
          title: "属性名称",
          key: "name",
          align:'center'
        },
        {
          title: "属性ID",
          key: "paramsId",
          align:'center'
        }
      ],
      dataRelation: [
        {
          name: "John Brown",
          paramsId: 18,
          address: "New York No. 1 Lake Park",
          date: "2016-10-03"
        },
        {
          name: "Jim Green",
          paramsId: 24,
          address: "London No. 1 Lake Park",
          date: "2016-10-01"
        },
        {
          name: "Joe Black",
          paramsId: 30,
          address: "Sydney No. 1 Lake Park",
          date: "2016-10-02"
        },
        {
          name: "Jon Snow",
          paramsId: 26,
          address: "Ottawa No. 2 Lake Park",
          date: "2016-10-04"
        },
        {
          name: "Jon Snow",
          paramsId: 266,
          address: "Ottawa No. 2 Lake Park",
          date: "2016-10-04"
        },
        {
          name: "Jon Snow",
          paramsId: 267,
          address: "Ottawa No. 2 Lake Park",
          date: "2016-10-04"
        }
      ],
      relationSelectDef: '',// 关联因子选择默认值
      optionsSel: [],
      listSel: [
        "对象名称-ID1",
        "对象名称-ID2",
        "对象名称-ID3",
        "对象名称-ID4",
        "对象名称-ID5",
        "对象名称-ID6",
        "对象名称-ID7",
        "对象名称-ID8"
      ],
      loadingSelect: false, //关联因子选择加载动画
      // 子项弹出层标题
      cTitle: "能源绩效参数",
      mouseEnterTimer: null, //防抖用于提示
      valueTypeItems: ["TEXT", "STRING", "INT"], // 值类型选择
      delToggle: false, //删除提示
      modal_loading: false, //删除loading
      tempIndex: -1, // 表格删除临时标记索引
      warnContent: "您确认要删除此项吗",
      tableSelectItems: [], // 一层表格选中项
      editOrAddModel: false, // 一层表格的弹窗层控制参数
      editOrAddModelLoading: false, // 控制加载动画
      editOrAddFlag: true, // 标识是编辑还是添加
      editingId: -1, // 记录即将编辑的行数据的id
      styles: {},
      formValidate: {
        //一层表格点击编辑数据
        paramsName: "",
        company: "",
        calculation: "",
        CFIntroduce: "",
        correlationFactorId: "", //关联因子id
        hide: false,
        readOnly: false,
        required: false
      },
      ruleValidate: {
        //自定义验证规则
        paramsName: [
          { required: true, message: "属性名不能为空", trigger: "blur" }
        ],
        company: [{ required: true, message: "单位不能为空", trigger: "blur" }],
        calculation: [
          { required: true, message: "计算脚本不能为空", trigger: "blur" }
        ],
        CFIntroduce: [
          { required: true, message: "计算公司说明不能为空", trigger: "blur" }
        ],
        correlationFactorId: [
          { required: true, message: "关联因子不能为空", trigger: "blur" }
        ]
      },
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "能源绩效参数",
          key: "paramsName",
          align: "center",
          tooltip: true,
          width: 120
        },
        {
          title: "计算公式说明",
          key: "CFIntroduce",
          align: "center",
          tooltip: true,
          width: 120
        },
        {
          title: "单位",
          key: "company",
          align: "center",
          tooltip: true
        },
        {
          title: "计算脚本",
          key: "calculation",
          align: "center",
          tooltip: true,
          width: 100
        },
        {
          title: "关联因子",
          key: "correlationFactorId",
          align: "center",
          tooltip: true,
          width: 100
        },
        {
          title: "隐藏",
          key: "hide",
          align: "center",
          slot: "hide"
        },
        {
          title: "只读",
          key: "readOnly",
          slot: "readOnly",
          align: "center"
        },
        {
          title: "必填",
          key: "required",
          slot: "required",
          align: "center"
        },
        {
          title: "操作",
          slot: "action",
          width: 180,
          align: "center"
        }
      ],
      paramsData: [
        {
          id: 1,
          paramsName: "助燃风温度",
          CFIntroduce: "计算公式说明",
          company: "℃",
          calculation: "php artisan swoole >>>&0",
          correlationFactorId: "对象名称-ID1",
          hide: true,
          readOnly: true,
          required: true
        },
        {
          id: 2,
          paramsName: "燃嘴的燃烧效率",
          CFIntroduce: "计算公式说明",
          company: "℃",
          calculation: "php artisan swoole >>>&0",
          correlationFactorId: "对象名称-ID5",
          hide: true,
          readOnly: true,
          required: true
        },
        {
          id: 3,
          paramsName: "设备运转率",
          CFIntroduce: "计算公式说明",
          company: "℃",
          calculation: "php artisan swoole >>>&0",
          correlationFactorId: "对象名称-ID2",
          hide: true,
          readOnly: true,
          required: true
        },
        {
          id: 4,
          paramsName: "助燃风温度1",
          CFIntroduce: "计算公式说明",
          company: "℃",
          calculation: "php artisan swoole >>>&0",
          correlationFactorId: "对象名称-ID3",
          hide: true,
          readOnly: true,
          required: true
        },
        {
          id: 5,
          paramsName: "助燃风温度2",
          CFIntroduce: "计算公式说明",
          company: "℃",
          calculation: "php artisan swoole >>>&0",
          correlationFactorId: "对象名称-ID4",
          hide: true,
          readOnly: true,
          required: true
        }
      ]
    };
  },
  filters: {
    //若多地方用到可提取公用
    transfrom(e, v) {}
  },
  methods: {
    relationQueryClick(){// 点击显示默认值
      if(this.relationSelectIntV.replace(/^\s|\s$/g,'') == ''){
          this.optionsSel = this.getOptionsSelDef();
      }
    },
    relationQueryChange(e){
      let newE = this.relationSelectIntV = e;
      clearTimeout(this.relationSearchT)
      this.relationSearchT = setTimeout(() => {
        if(newE.replace(/^\s|\s$/g,'') == '') {//为空时 恢复下拉默认值选项
            this.optionsSel = this.getOptionsSelDef();
        }
      },300)
    },
    relationChangeSel(v){
        if(v) this.formValidate.correlationFactorId = v;
    },
    rowClassName (row, index) {//给指定行设置样式
        if (index === 0) {
            return 'table-info-cell-header';
        }
        return '';
    },
    getOptionsSelDef(){
      return this.listSel.map(item => {
          return {
            value: item,
            label: item
          };
      });
    },
    remoteMethodSel(query) {
      // 关联因子远程搜索
      query = query.replace(/^\s|\s$/g, '');
      if (query !== "") {
        this.loadingSelect = true;
        setTimeout(() => {
          this.loadingSelect = false;
          this.optionsSel = this.getOptionsSelDef().filter(
            item => item.label.toLowerCase().indexOf(query.toLowerCase()) > -1
          );
        }, 200);
      } else {
        this.optionsSel = this.getOptionsSelDef();
      }
    },
    //行双击事件
    dblclick(row, index) {
      this.edit(row);
    },
    tableHover() {
      // 表格移入触发事件
      clearTimeout(this.mouseEnterTimer);
      this.mouseEnterTimer = setTimeout(() => {
        this.$Message.info("温馨提示：可双击进行编辑");
      }, 2500);
    },
    show(index) {
      let content = ""; // 智能点拼接字段属性
      for (let i in this.paramsData[index]) {
        if (
          Object.prototype.toString.call(this.paramsData[index][i]) ===
          "[object String]"
        ) {
          let c = this.columns.find(_ => _.key == i);
          content = `${content}${c.title}：${
            this.paramsData[index][c.key]
          }<br>`;
        }
      }
      this.$Modal.info({
        // 查看
        title: "关联展示信息配置",
        content: `${content}
        ${this.paramsData[index].hide ? "【隐藏】" : "【出现】"}
        <br>${this.paramsData[index].readOnly ? "【只读】" : "【非只读】"}
        <br>${this.paramsData[index].required ? "【必填】" : "【非必填】"}`
      });
    },
    remove() {
      //正式删除---falg为true时是单个删除
      this.modal_loading = true;
      if (this.tempIndex != "batch") {
        setTimeout(() => {
          this.paramsData.splice(this.tempIndex, 1);
          this.modal_loading = false;
          this.delToggle = false;
          this.$Message.success("删除成功！");
        }, 2000);
      } else {
        setTimeout(() => {
          // 模拟批量删除
          // 判断是否包含，取数组差集
          this.paramsData = this.paramsData.filter(item => {
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
    add() {
      // 添加
      this.editOrAddFlag = false; // 标识是编辑还是添加 true为编辑
      this.editOrAddModel = true; // 打开弹层
      this.clearFormValidate();
      // 重置---用于关联因子默认展示
      this.relationSelectDef = '';
      this.relationSelectIntV = '';
      this.$refs.relationSelect.setQuery(' ');
    },
    edit(row) { // 编辑
      // 设置标题
      this.cTitle = row.paramsName;
      this.editingId = row.id;
      for (let i in row) {
        this.formValidate[i] = row[i]; //赋值
      }
      this.relationSelectDef = row.correlationFactorId;// 解决选择框数据双向绑定无效 没有监听到问题(原因远程)
      this.editOrAddFlag = true; // 标识是编辑还是添加
      this.editOrAddModel = true; // 打开弹层
    },
    delBatch() {
      //批量删除
      this.tableSelectItems = this.tableSelectItems.filter(_ => {
        return this.paramsData.some(i => {
          // 意在解决多选后没删，被单选删了的问题
          return i.id == _.id;
        });
      });
      if (this.tableSelectItems.length === 0) {
        this.$Message.warning("您未选中项目");
        return;
      }
      this.tempIndex = "batch";
      this.warnContent = `您确认要删除选中的${this.tableSelectItems.length}吗`;
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
    // 一层表格弹窗点击确定
    editOrAddOk(name = "formValidate") {
      // ---可优化，设计代码重用
      if (this.editOrAddFlag == true) {
        // true表示是点击了编辑
        this.$refs[name].validate(valid => {
          if (valid) {
            this.editOrAddModelLoading = true;
            setTimeout(() => {
              // 模拟更新
              this.$Message.success("成功更新一条数据!");
              this.paramsData = this.paramsData.map(_ =>
                _.id == this.editingId
                  ? Object.assign({}, _, this.formValidate)
                  : _
              );
              this.editOrAddModel = false;
              let type;
              // 也可用重置更简单 this.$refs[name].resetFields();
              this.clearFormValidate();
              this.editOrAddModelLoading = false;
              if (this.$refs["formValidate"])
                // 重置
                this.$refs["formValidate"].resetFields();
            }, 1300);
          } else {
            this.editOrAddModelLoading = false;
            this.$Message.error("更新数据失败!");
          }
        });
        return;
      }
      this.$refs[name].validate(valid => {
        if (valid) {
          this.editOrAddModelLoading = true;
          setTimeout(() => {
            // 模拟添加
            this.$Message.success("成功添加一条数据!");
            this.paramsData.push({ ...this.formValidate });
            this.editOrAddModel = false;
            let type;
            // 也可用重置更简单 this.$refs[name].resetFields();
            this.clearFormValidate();
            this.editOrAddModelLoading = false;
            if (this.$refs["formValidate"])
              // 重置
              this.$refs["formValidate"].resetFields();
          }, 1300);
        } else {
          this.editOrAddModelLoading = false;
          this.$Message.error("添加数据失败!");
        }
      });
    }
  },
  computed:{
  },
  watch:{
    relationSelectDef(newV,oldV){
      if(newV == undefined){
        this.relationSelectDef = oldV// 解决选框默认值没按预期走奇怪的东西
      }
    }
  },
  components: {
    paramsChildren
  }
};
</script>

