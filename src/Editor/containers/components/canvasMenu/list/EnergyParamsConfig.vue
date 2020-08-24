 /**
* Created by WuTongYue on 2020/7/20---.
* Created by 玉旨旺 on 2019/10/15.
* model 关联信息
*/
 <template>
  <div>
      <Button type="primary" size="small" style="margin:0 5px 10px 0" @click="add()">新增</Button>
      <Button type="error" size="small" style="margin:0 5px 10px 0" @click="delBatch">批量删除</Button>
      <template><!--关联信息主表-->
        <Table border 
          ref="selection" 
          :columns="columns" 
          :data="enesConfigData"
          @on-selection-change="handleSelectChange">
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
        class-params="vertical-center-modal"
        @on-cancel="editOrAddCancel"
        :loading="editOrAddModelLoading">
         <template>
          <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
              <FormItem label="能流图参数" prop="params">
                  <Input v-model="formValidate.params" placeholder="请输入能流图参数"></Input>
              </FormItem>
              <FormItem label="单位" prop="company">
                  <Input v-model="formValidate.company" placeholder="请输入单位"></Input>
              </FormItem>
              <FormItem label="值" prop="value">
                  <Input v-model="formValidate.value" placeholder="请输入值"></Input>
              </FormItem>
          </Form>
      </template>
    </Modal>
  </div>
</template>
<script>
export default {
  params: "RelationChildren",
  data() {
    return {
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
          params: '',
          value: '',
          company: ''
      },
      ruleValidate: {//自定义验证规则
          params: [
              { required: true, message: '属性名不能为空', trigger: 'blur' }
          ],
          company: [
              { required: true, message: '单位不能为空', trigger: 'blur' }
          ],
          value: [
              { required: true, message: '值不能为空', trigger: 'blur' }
          ],
      },
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center',
        },
        {
          title: "能流图参数",
          key: 'params',
          align: 'center',
          tooltip: true,
          ellipsis: true
        },
        {
          title: "单位",
          key: 'company',
          align: 'center',
          tooltip: true,
          ellipsis: true
        },
        {
          title: "值",
          key: 'value',
          align: 'center',
          tooltip: true,
          ellipsis: true
        },
        {
          title: "操作",
          slot: "action",
          width: 180,
          align: "center"
        }
      ],
      enesConfigData: [
        {
           id: 1,
           params: '能流图刷新频率',
           value: '300',
           company: '秒'
        },
        {
           id: 1,
           params: '能流图更新率',
           value: '300',
           company: '时'
        },
        {
           id: 1,
           params: '能流图保存频率',
           value: '800',
           company: '秒'
        },
        {
           id: 1,
           params: '能流图刷新频率',
           value: '300',
           company: '秒'
        },
        {
           id: 1,
           params: '能流图刷新频率',
           value: '300',
           company: '秒'
        },
        {
           id: 1,
           params: '能流图刷新频率',
           value: '300',
           company: '秒'
        },
        {
           id: 1,
           params: '能流图刷新频率',
           value: '300',
           company: '秒'
        }
      ]
    };
  },
  filters:{//若多地方用到可提取公用
      transfrom(e,v){

      }
  },
  watch:{
    relationProp(newV){
        console.log('从nodePop传过来的：',newV)
    }
  },
  methods: {
    show(index) {
      let content = '';// 智能点拼接字段属性
      for(let i in this.enesConfigData[index]){
        if(Object.prototype.toString.call(this.enesConfigData[index][i]) === '[object String]'){
          let c = this.columns.find(_ => _.key == i);
          content = `${content}${c.title}：${this.enesConfigData[index][c.key]}<br>`
        }
      }
      this.$Modal.info({// 查看
        title: "能流图参数配置",
        content: content
      });
    },
    remove() { //正式删除---falg为true时是单个删除
      this.modal_loading = true;
      if(this.tempIndex != 'batch'){
        setTimeout(() => {
            this.enesConfigData.splice(this.tempIndex, 1);
            this.modal_loading = false;
            this.delToggle = false;
            this.$Message.success('删除成功！');
            this.tableSelectItems = [];// 重置选中选中项的值，解决删除后ui选中重置但是点击批量删除还有选项的bug
        }, 2000);
      }else{
        setTimeout(() => {// 模拟批量删除
           // 判断是否包含，取数组差集
            this.enesConfigData = this.enesConfigData.filter(item => {
              let flag = true;
              for(let i of this.tableSelectItems){
                if(i.id === item.id) flag = false;
              }
              return flag;
            })
            this.modal_loading = false;
            this.delToggle = false;
            this.$Message.success('删除成功！');
        }, 2000); 
      }
    },
    delConfirm(index){// 删除确认
        this.warnContent = '您确认要删除此项吗';
        this.delToggle = true;
        this.tempIndex = index;
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
    add(){// 添加
      // 清空默认值
      this.clearFormValidate();
      this.editOrAddFlag = false;// 标识是编辑还是添加 true为编辑
      this.editOrAddModel = true;// 打开弹层
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
        return this.enesConfigData.some(i => {// 意在解决多选后没删，被单选删了的问题
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
    editOrAddCancel(params = 'formValidate'){
      this.editOrAddModel = false;
    },
    // 一层表格弹窗点击确定
    editOrAddOk(params = 'formValidate'){// ---可优化，设计代码重用
      this.editOrAddModelLoading = true;
      if(this.editOrAddFlag == true){// true表示是点击了编辑
          this.$refs[params].validate((valid) => {
            if (valid) {
              setTimeout(() => {// 模拟更新
                  this.$Message.success('成功更新一条数据!');
                  this.enesConfigData = this.enesConfigData.map(_ => _.id == this.editingId ? Object.assign({}, _, this.formValidate) : _);
                  this.editOrAddModel = false;
                  let type;
                  // 也可用重置更简单 this.$refs[params].resetFields();
                  this.clearFormValidate();
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
      this.$refs[params].validate((valid) => {
          if (valid) {
            setTimeout(() => {// 模拟添加
                this.$Message.success('成功添加一条数据!');
                this.enesConfigData.push({ ...this.formValidate });
                this.editOrAddModel = false;
                let type;
                 // 也可用重置更简单 this.$refs[params].resetFields();
                this.clearFormValidate();
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
  }
};
</script>
<style lang="less">
.vertical-center-modal{
    display: flex;
    align-items: center;
    justify-content: center;
    .ivu-modal{
        top: 0;
    }
}
</style>
