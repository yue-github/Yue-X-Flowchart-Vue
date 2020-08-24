 /**
* Created by WuTongYue on 2020/7/20---.
* Created by 玉旨旺 on 2019/10/15.
* model 行业模型
*/
 <template>
  <div>
      <Button type="primary" size="small" style="margin:0 5px 10px 0" @click="add()">新增</Button>
      <Button type="error" size="small" style="margin:0 5px 10px 0" @click="delBatch">批量删除</Button>
      <template><!--行业模型主表-->
        <Table border 
          ref="selection" 
          :columns="columns" 
          :data="relationData"
          @mouseenter.native="tableHover"
          @on-row-dblclick="dblclick"
          @on-selection-change="handleSelectChange">
          <template slot-scope="{ row, index }" slot="hide">
                <Checkbox v-model="relationData[index].hide" disabled></Checkbox>
          </template><template slot-scope="{ row, index }" slot="readOnly">
                <Checkbox v-model="relationData[index].readOnly" disabled></Checkbox>
          </template>
          <template slot-scope="{ row, index }" slot="required">
                <Checkbox v-model="relationData[index].required" disabled></Checkbox>
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
        :title="editOrAddFlag ? '编辑' : '新增'"
        @on-ok="editOrAddOk"
        :width="960"
        :style="styles"
        :closable="true"
        transfer
        :mask-closable="false"
        class-name="vertical-center-modal"
        @on-cancel="editOrAddCancel"
        :loading="editOrAddModelLoading">
         <template>
          <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="150">
              <FormItem label="关联信息" prop="relationMsg">
                  <Input v-model="formValidate.relationMsg" placeholder="请输入关联信息"></Input>
              </FormItem>
              <FormItem label="数据源" prop="source">
                  <Input v-model="formValidate.source" placeholder="请输入数据源"></Input>
              </FormItem>
              <FormItem label="是否隐藏" prop="hide">
                  <Checkbox v-model="formValidate.hide"></Checkbox>
              </FormItem>
              <FormItem label="是否只读" prop="readOnly">
                  <Checkbox v-model="formValidate.readOnly"></Checkbox>
              </FormItem>
              <FormItem label="是否必填" prop="required">
                  <Checkbox v-model="formValidate.required"></Checkbox>
              </FormItem>
          </Form>
      </template>
    </Modal>
      <Modal
        class="preview-model"
        v-model="isShow"
        :title="cTitle"
        :width="960"
        :closable="true"
        :mask-closable="false"
      >
        <div class="body">
           <RelationChildren/>
        </div>
        <div slot="footer">
          <Button type="default" @click="doHide">{{ $t('Y20001') }}</Button>
        </div>
      </Modal>
  </div>
</template>
<script>
import RelationChildren from './components/RelationChildren'
export default {
  name: "Relation",
  data() {
    return {
      // 子项弹出层标题
      cTitle: '关联展示信息配置',
      isShow: false,//关联子项
      mouseEnterTimer: null,//防抖用于提示
      valueTypeItems: ['TEXT', 'STRING', 'INT'],// 值类型选择
      delToggle: false,//删除提示
      modal_loading: false,//删除loading
      tempIndex: -1,// 表格删除临时标记索引
      warnContent: '您确认要删除此项吗',
      tableSelectItems: [],// 一层表格选中项
      editOrAddModel: false,// 一层表格的弹窗层控制参数
      editOrAddModelLoading: true,// 控制加载动画
      editOrAddFlag: true,// 标识是编辑还是添加
      editingId: -1,// 记录即将编辑的行数据的id
      styles: {
           
      },
      formValidate: {//一层表格点击编辑数据
          relationMsg: '',
          source: '',
          hide: false,
          readOnly: false,
          required: false,
      },
      ruleValidate: {//自定义验证规则
          relationMsg: [
              { required: true, message: '属性名不能为空', trigger: 'blur' }
          ],
          source: [
              { required: true, message: '属性名不能为空', trigger: 'blur' }
          ],
      },
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: "关联信息",
          key: 'relationMsg',
          align: 'center'
        },
        {
          title: "数据源",
          key: 'source',
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
          width: 180,
          align: "center"
        }
      ],
      relationData: [
        {
           id: 1,
           relationMsg: '能源措施计划1',
           source: '数据源',
           hide: true,
           readOnly: true,
           required: true,
        },
         {
           id: 2,
           relationMsg: '运行准则',
           source: '数据源',
           hide: true,
           readOnly: true,
           required: true,
        },
         {
           id: 3,
           relationMsg: '能源措施计划3',
           source: '数据源',
           hide: true,
           readOnly: true,
           required: true,
        },
         {
           id: 4,
           relationMsg: '能源措施计划4',
           source: '数据源',
           hide: true,
           readOnly: true,
           required: true,
        },
         {
           id: 5,
           relationMsg: '能源措施计划5',
           source: '数据源',
           hide: true,
           readOnly: true,
           required: true,
        },
         {
           id: 6,
           relationMsg: '能源措施计划6',
           source: '数据源',
           hide: true,
           readOnly: true,
           required: true,
        },
         {
           id: 7,
           relationMsg: '能源措施计划7',
           source: '数据源',
           hide: true,
           readOnly: true,
           required: true,
        }
      ]
    };
  },
  filters:{//若多地方用到可提取公用
      transfrom(e,v){

      }
  },
  methods: {
    // 退出子项内容弹层
    doHide(){
      this.isShow = false;
    },
    //行双击击事件
    dblclick(row,index){
      this.isShow = true;
      this.cTitle = row.relationMsg;
      console.log(row, index)
    },
    tableHover(){
      // 表格移入触发事件
      clearTimeout(this.mouseEnterTimer)
      this.mouseEnterTimer = setTimeout(() => {
        this.$Message.info('温馨提示：可双击进行编辑')
      },2000)
    },
    show(index) {
      let content = '';// 智能点拼接字段属性
      for(let i in this.relationData[index]){
        if(Object.prototype.toString.call(this.relationData[index][i]) === '[object String]'){
          let c = this.columns.find(_ => _.key == i);
          content = `${content}${c.title}：${this.relationData[index][c.key]}<br>`
        }
      }
      this.$Modal.info({// 查看
        title: "关联展示信息配置",
        content: `${content}
        ${this.relationData[index].hide ? '【隐藏】' : '【出现】'}
        <br>${this.relationData[index].readOnly ? '【只读】' : '【非只读】'}
        <br>${this.relationData[index].required ? '【必填】' : '【非必填】'}`
      });
      console.log(this.relationData)
    },
    remove() { //正式删除---falg为true时是单个删除
      this.modal_loading = true;
      if(this.tempIndex != 'batch'){
        setTimeout(() => {
            this.relationData.splice(this.tempIndex, 1);
            this.modal_loading = false;
            this.delToggle = false;
            this.$Message.success('删除成功！');
        }, 2000);
      }else{
        setTimeout(() => {// 模拟批量删除
           // 判断是否包含，取数组差集
            this.relationData = this.relationData.filter(item => {
              let flag = true;
              for(let i of this.tableSelectItems){
                if(i.id === item.id) flag = false;
              }
              return flag;
            })
            this.modal_loading = false;
            this.delToggle = false;
            this.$Message.success('删除成功！');
        }, 4000); 
      }
    },
    delConfirm(index){// 删除确认
        this.warnContent = '您确认要删除此项吗';
        this.delToggle = true;
        this.tempIndex = index;
    },
    add(){// 添加
      this.editOrAddFlag = false;// 标识是编辑还是添加 true为编辑
      this.editOrAddModel = true;// 打开弹层
      this.clearFormValidate()
    },
    edit(row){// 编辑
      this.editingId = row.id;
      for(let i in row){
        this.formValidate[i] = row[i] //赋值
      }
      this.editOrAddFlag = true;// 标识是编辑还是添加
      this.editOrAddModel = true;// 打开弹层
    },
    delBatch(){ //批量删除
      this.tableSelectItems = this.tableSelectItems.filter(_ => {
        return this.relationData.some(i => {// 意在解决多选后没删，被单选删了的问题
          return i.id == _.id;
        })
      })
      if(this.tableSelectItems.length === 0){
        this.$Message.warning('您未选中项目');
        return
      }
      this.tempIndex = 'batch';
      this.warnContent = `您确认要删除选中的${this.tableSelectItems.length}吗`
      this.delToggle = true;
    },
    handleSelectChange(e){// 选择触发
       this.tableSelectItems = e;
    },
    // 一层表格弹窗点击取消
    editOrAddCancel(name = 'formValidate'){
      this.editOrAddModel = false;
    },
     // 清空
    clearFormValidate(){
      let type;
      for(let i in this.formValidate){
        type = Object.prototype.toString.call(this.formValidate[i]);
        switch(type){
          case '[object Array]':
            this.formValidate[i] = [];
          break;
          case '[object Boolean]':
            this.formValidate[i] = false;
          break;
          default:
            this.formValidate[i] = '';
          break;
        }
      }
    },
    // 一层表格弹窗点击确定
    editOrAddOk(name = 'formValidate'){// ---可优化，设计代码重用
      console.log(this.formValidate)
      this.editOrAddModelLoading = true;
      if(this.editOrAddFlag == true){// true表示是点击了编辑
          this.$refs[name].validate((valid) => {
            if (valid) {
              setTimeout(() => {// 模拟更新
                  this.$Message.success('成功更新一条数据!');
                  this.relationData = this.relationData.map(_ => _.id == this.editingId ? Object.assign({}, _, this.formValidate) : _);
                  this.editOrAddModel = false;
                  let type;
                  // 也可用重置更简单 this.$refs[name].resetFields();
                   this.clearFormValidate()
                  if(this.$refs['formValidate'])// 重置
                    this.$refs['formValidate'].resetFields();
              },1300)
            } else {
              this.editOrAddModelLoading = false
              setTimeout(() => {// 设置宏任务恢复loading状态，避免二次点击验证不通过关闭Modal
                this.editOrAddModelLoading = true;
              },0)
              this.$Message.error('更新数据失败!');
            }
        })
        return
      } 
      this.$refs[name].validate((valid) => {
          if (valid) {
            setTimeout(() => {// 模拟添加
                this.$Message.success('成功添加一条数据!');
                this.relationData.push({ ...this.formValidate });
                this.editOrAddModel = false;
                let type;
                 // 也可用重置更简单 this.$refs[name].resetFields();
                this.clearFormValidate()
                if(this.$refs['formValidate'])// 重置
                    this.$refs['formValidate'].resetFields();
            },1300)
          } else {
            this.editOrAddModelLoading = false
            setTimeout(() => {// 设置宏任务恢复loading状态，避免二次点击验证不通过关闭Modal
              this.editOrAddModelLoading = true;
            },0)
              this.$Message.error('添加数据失败!');
          }
      })
    }
  },
  components:{
    RelationChildren
  }
};
</script>
<style lang="less" scoped>
.vertical-center-modal{
    display: flex;
    align-items: center;
    justify-content: center;
    .ivu-modal{
        top: 0;
    }
}
</style>
