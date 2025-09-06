<!-- 搜索框和添加按钮，搜索框，以及用户名和手机号的输入框 -->
<template>
  <div class="role-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <div class="search-header">
        <div class="search-title">
          <i class="el-icon-search"></i>
          <span>角色查询</span>
        </div>
      </div>
      <div class="search-content">
          <el-input
            v-model="searchModel.roleName"
          placeholder="请输入角色名称"
          prefix-icon="el-icon-user"
            clearable
          class="search-input"
          ></el-input>
          <el-button
            @click="getRoleList"
            type="primary"
            icon="el-icon-search"
          class="search-btn"
        >查询</el-button>
      </div>
    </div>

    <!-- 角色列表区域 -->
    <div class="table-container">
      <div class="table-header">
        <div class="table-title">
          <i class="el-icon-s-check"></i>
          <span>角色列表</span>
          <span class="table-count">共 {{ total }} 条记录</span>
        </div>
          <el-button
            @click="openEditUi(null)"
            type="primary"
            icon="el-icon-plus"
          class="add-btn"
        >新增角色</el-button>
      </div>
      <el-table 
        :data="roleList" 
        stripe 
        border
        highlight-current-row
        class="role-table"
      >
        <el-table-column 
          prop="roleId" 
          label="角色ID" 
          width="100"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="roleName"
          label="角色名称"
          width="150"
          align="center"
        >
          <template slot-scope="scope">
            <div class="role-name-cell">
              <i class="el-icon-s-custom"></i>
              <span>{{ scope.row.roleName }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column 
          prop="roleDesc" 
          label="角色描述"
          align="center"
        >
          <template slot-scope="scope">
            <div class="role-desc-cell">
              <i class="el-icon-document"></i>
              <span>{{ scope.row.roleDesc }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column 
          label="操作" 
          width="200"
          align="center"
        >
          <template slot-scope="scope">
            <div class="operation-cell">
              <el-button
                @click="openEditUi(scope.row.roleId)"
                type="primary"
                icon="el-icon-edit"
                size="small"
                class="edit-btn"
              >编辑</el-button>
              <el-button
                @click="deleteRole(scope.row)"
                type="danger"
                icon="el-icon-delete"
                size="small"
                class="delete-btn"
              >删除</el-button>
            </div>
        </template>
        </el-table-column>
      </el-table>

    <!-- 分页功能 -->
      <div class="pagination-container">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="searchModel.pageNo"
      :page-sizes="[5, 10, 20, 30]"
      :page-size="searchModel.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
          background
    >
    </el-pagination>
      </div>
    </div>

    <!-- 角色编辑信息弹出框 -->
    <el-dialog
      @close="clearForm" 
      :title="title" 
      :visible.sync="dialogFormVisible"
      width="600px"
      :close-on-click-modal="false"
      center
      class="role-dialog"
    >
      <div class="dialog-content">
        <el-form :model="roleForm" ref="roleFormRef" :rules="rules" label-width="100px">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="roleForm.roleName" placeholder="请输入角色名称">
              <i slot="prefix" class="el-icon-s-custom"></i>
            </el-input>
        </el-form-item>

          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="roleForm.roleDesc" placeholder="请输入角色描述">
              <i slot="prefix" class="el-icon-document"></i>
            </el-input>
        </el-form-item>

          <el-form-item label="权限设置" prop="menuIdList">
            <div class="tree-container">
              <el-tree 
                :data="menuList" 
                :props="menuProps" 
                show-checkbox 
                default-expand-all 
                node-key="menuId" 
                ref="menuRef"
                class="permission-tree"
              ></el-tree>
            </div>
        </el-form-item>
      </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" class="cancel-btn">取 消</el-button>
        <el-button type="primary" @click="saveRole" class="confirm-btn">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import roleApi from "@/api/roleManage";
import menuApi from "@/api/menuManage";
export default {
  data() {
    return {
      menuList:[],
      //左边宽度
      formLabelWidth: "135px",
      //设置默认值不可见
      dialogFormVisible: false,
      roleForm: {},
      title: "",
      total: 0,
      roleList: [],

      menuProps:{
          children: 'children',
          label: 'title'
      },

      searchModel: {
        pageNo: 1,
        // 默认显示数量
        pageSize: 10,
      },

      //表单规则配置
      rules: {
        roleName: [
          { required: true, message: "请输入角色名", trigger: "blur" },
          {
            min: 2,
            max: 20,
            message: "长度需要在 2 到18 个字符",
            trigger: "blur",
          },
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
          {
            min: 2,
            max: 20,
            message: "长度需要在 2 到 18 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },

  methods: {
    getAllMenu() {
      menuApi.getAllMenu().then((response) => {
        this.menuList = response.data;
        
      });
    },

    


saveRole() {
  let isOk = true;
  //触发表单的验证
  this.$refs.roleFormRef.validate((valid) => {
    //校验表单是否通过，如果校验失败，设置 isOk 为 false
    isOk = valid;
  });
  //如果表单验证通过
  if (isOk) {
    //获取选中的菜单节点和半选中的菜单节点
    let checkedKeys = this.$refs.menuRef.getCheckedKeys();
    let halfCheckedKeys = this.$refs.menuRef.getHalfCheckedKeys();
    
    //将选中的和半选中的菜单节点合并为一个数组
    this.roleForm.menuIdList = checkedKeys.concat(halfCheckedKeys);
    //提交验证给后台，保存角色
    roleApi.saveRole(this.roleForm).then(response=> {
      //保存成功提示
      this.$message({
        message: response.message,
        type: "success"
      });
      //关闭对话框
      this.dialogFormVisible = false;
      //刷新表格数据
      this.getRoleList();
    });
  } else {
    //表单验证不通过
    console.log("表单验证不通过");
    return false;
  }
},




    //清理表单数据
    clearForm() {
      this.roleForm = {};
      //清除表单校验的提示信息
      this.$refs.roleFormRef.clearValidate();
      this.$refs.menuRef.setCheckedKeys([]);
    },
    handleSizeChange(pageSize) {
      //数据更新
      this.searchModel.pageSize = pageSize;
      this.getRoleList();
    },
    handleCurrentChange(pageNo) {
      this.searchModel.pageNo = pageNo;
      this.getRoleList();
    },
    //查询用户列表
    getRoleList() {
      roleApi.getRoleList(this.searchModel).then((response) => {
        this.roleList = response.data.rows;
        this.total = response.data.total;
      });
    },

    openEditUi(id) {
      if(id == null){
        this.title = "新增角色";
      }else{
        this.title = "修改角色";
        //根据id查询角色数据
        roleApi.getRoleById(id).then(response =>{
          this.roleForm = response.data;
          this.$refs.menuRef.setCheckedKeys(response.data.menuIdList);
        });
      }
      this.dialogFormVisible = true;
    },

    deleteRole(role){
      this.$confirm(`确认删除 ${role.roleName} 这个角色吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          roleApi.deleteRoleById(role.roleId).then(response =>{
            this.$message({
              type:'success',
              message:response.message
            });
            this.getRoleList();
          });
          
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    }
  },

  //加载时就查询一次
  created() {
    this.getRoleList();
    this.getAllMenu();
  },
};
</script>
<style scoped>
.role-container {
  padding: 20px;
  min-height: calc(100vh - 120px);
  background-color: #f5f7fa;
}

/* 搜索区域样式 */
.search-container {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
  transition: all 0.3s;
}

.search-container:hover {
  box-shadow: 0 4px 15px 0 rgba(0, 0, 0, 0.15);
}

.search-header {
  margin-bottom: 20px;
}

.search-title {
  border-bottom: 2px solid #1976D2;
  padding-bottom: 10px;
  font-size: 16px;
  font-weight: bold;
  color: #303133;
  display: inline-block;
}

.search-title i {
  color: #1976D2;
  margin-right: 5px;
}

.search-content {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.search-input {
  width: 240px;
  margin-right: 15px;
  margin-bottom: 10px;
}

.search-input >>> .el-input__inner {
  border-radius: 20px;
}

.search-btn {
  border-radius: 20px;
  padding: 10px 25px;
  font-weight: 500;
}

/* 表格区域样式 */
.table-container {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
  transition: all 0.3s;
}

.table-container:hover {
  box-shadow: 0 4px 15px 0 rgba(0, 0, 0, 0.15);
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.table-title {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
  display: flex;
  align-items: center;
}

.table-title i {
  color: #1976D2;
  margin-right: 5px;
  font-size: 18px;
}

.table-count {
  font-size: 14px;
  color: #909399;
  font-weight: normal;
  margin-left: 10px;
}

.add-btn {
  border-radius: 20px;
  padding: 10px 20px;
}

.role-table {
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;
}

.role-table >>> .el-table__header-wrapper th {
  background-color: #f0f5ff !important;
  color: #1976D2;
  font-weight: 600;
  padding: 12px 0;
}

.role-table >>> .el-table__row {
  transition: all 0.3s;
}

.role-table >>> .el-table__row:hover {
  background-color: #f0f5ff !important;
}

.role-name-cell,
.role-desc-cell {
  display: flex;
  align-items: center;
  justify-content: center;
}

.role-name-cell i,
.role-desc-cell i {
  margin-right: 5px;
  color: #1976D2;
}

.operation-cell {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.edit-btn,
.delete-btn {
  padding: 6px 12px;
  border-radius: 4px;
}

/* 分页区域样式 */
.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.el-pagination >>> .el-pagination__total,
.el-pagination >>> .el-pagination__sizes,
.el-pagination >>> .el-pagination__jump {
  margin-right: 15px;
}

/* 对话框样式 */
.role-dialog >>> .el-dialog__header {
  background-color: #1976D2;
  padding: 15px 20px;
  border-radius: 8px 8px 0 0;
}

.role-dialog >>> .el-dialog__title {
  font-size: 18px;
  font-weight: bold;
  color: #ffffff;
}

.role-dialog >>> .el-dialog__headerbtn .el-dialog__close {
  color: #ffffff;
}

.dialog-content {
  padding: 20px 0;
}

.el-form-item >>> .el-input__inner {
  border-radius: 4px;
  padding-left: 35px;
}

.el-form-item >>> .el-input__prefix {
  left: 10px;
  color: #1976D2;
}

.tree-container {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  padding: 10px;
}

.permission-tree {
  background-color: #f9fafc;
}

.permission-tree >>> .el-tree-node__content {
  height: 32px;
}

.permission-tree >>> .el-tree-node__content:hover {
  background-color: #f0f5ff;
}

.permission-tree >>> .is-current .el-tree-node__content {
  background-color: #e6f1fc;
}

.dialog-footer {
  text-align: center;
}

.cancel-btn {
  border-radius: 20px;
  padding: 10px 25px;
}

.confirm-btn {
  border-radius: 20px;
  padding: 10px 25px;
}

/* 按钮样式 */
.el-button--primary {
  background-color: #1976D2;
  border-color: #1976D2;
  transition: all 0.3s;
}

.el-button--primary:hover,
.el-button--primary:focus {
  background-color: #1565C0;
  border-color: #1565C0;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.3);
}

.el-button--danger {
  background-color: #e74c3c;
  border-color: #e74c3c;
  transition: all 0.3s;
}

.el-button--danger:hover,
.el-button--danger:focus {
  background-color: #c0392b;
  border-color: #c0392b;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
}
</style>