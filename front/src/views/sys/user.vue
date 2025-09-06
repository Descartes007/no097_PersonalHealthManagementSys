<!-- 搜索框和添加按钮，搜索框，以及用户名和手机号的输入框 -->
<template>
  <div class="user-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <div class="search-header">
        <div class="search-title">
          <i class="el-icon-search"></i>
          <span>用户查询</span>
        </div>
      </div>
      <div class="search-content">
          <el-input
            v-model="searchModel.username"
          placeholder="请输入用户名"
          prefix-icon="el-icon-user"
            clearable
          class="search-input"
          ></el-input>
          <el-input
            v-model="searchModel.phone"
          placeholder="请输入手机号"
          prefix-icon="el-icon-mobile-phone"
            clearable
          class="search-input"
          ></el-input>
          <el-button
            @click="getUserList"
            type="primary"
            icon="el-icon-search"
          class="search-btn"
        >查询</el-button>
      </div>
    </div>

    <!-- 用户列表区域 -->
    <div class="table-container">
      <div class="table-header">
        <div class="table-title">
          <i class="el-icon-user"></i>
          <span>用户列表</span>
          <span class="table-count">共 {{ total }} 条记录</span>
        </div>
          <el-button
            @click="openEditUi(null)"
            type="primary"
            icon="el-icon-plus"
          class="add-btn"
        >新增用户</el-button>
      </div>
      <el-table 
        :data="userList" 
        stripe 
        border
        highlight-current-row
        class="user-table"
      >
        <el-table-column
          type="index"
          label="序号"
          width="80"
          align="center"
        ></el-table-column>
        <el-table-column 
          prop="id" 
          label="用户ID" 
          width="100"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="username"
          label="用户名"
          width="150"
          align="center"
        >
          <template slot-scope="scope">
            <div class="username-cell">
              <i class="el-icon-user-solid"></i>
              <span>{{ scope.row.username }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="phone"
          label="电话"
          width="150"
          align="center"
        >
          <template slot-scope="scope">
            <div class="phone-cell">
              <i class="el-icon-phone"></i>
              <span>{{ scope.row.phone }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column 
          prop="email" 
          label="电子邮件"
          align="center"
        >
          <template slot-scope="scope">
            <div class="email-cell">
              <i class="el-icon-message"></i>
              <span>{{ scope.row.email }}</span>
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
              @click="openEditUi(scope.row.id)"
              type="primary"
              icon="el-icon-edit"
                size="small"
                class="edit-btn"
              >编辑</el-button>
            <el-button
              @click="deleteUser(scope.row)"
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

    <!-- 用户编辑信息弹出框 -->
    <el-dialog
      @close="clearForm"
      :title="title"
      :visible.sync="dialogFormVisible"
      width="500px"
      :close-on-click-modal="false"
      center
      class="user-dialog"
    >
      <div class="dialog-content">
        <el-form :model="userForm" ref="userFormRef" :rules="rules" label-width="100px">
        <el-form-item
          label="用户名"
          prop="username"
        >
            <el-input v-model="userForm.username" placeholder="请输入用户名">
              <i slot="prefix" class="el-icon-user"></i>
            </el-input>
        </el-form-item>

        <el-form-item
          v-if="userForm.id == null || userForm.id == undefined"
          label="密码"
          prop="password"
        >
          <el-input
            type="password"
            v-model="userForm.password"
              placeholder="请输入密码"
              show-password
            >
              <i slot="prefix" class="el-icon-lock"></i>
            </el-input>
        </el-form-item>

          <el-form-item label="联系电话">
            <el-input v-model="userForm.phone" placeholder="请输入联系电话">
              <i slot="prefix" class="el-icon-phone"></i>
            </el-input>
        </el-form-item>

        <el-form-item
          label="电子邮件"
          prop="email"
        >
            <el-input v-model="userForm.email" placeholder="请输入电子邮件">
              <i slot="prefix" class="el-icon-message"></i>
            </el-input>
        </el-form-item>

          <el-form-item label="用户角色">
            <el-checkbox-group v-model="userForm.roleIdList" :max="1" class="role-checkbox-group">
            <el-checkbox
              v-for="role in roleList"
              :label="role.roleId"
              :key="role.roleId"
                class="role-checkbox"
              >{{ role.roleDesc }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" class="cancel-btn">取 消</el-button>
        <el-button type="primary" @click="saveUser" class="confirm-btn">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import userApi from "@/api/userManage";
import roleApi from "@/api/roleManage";
export default {
  data() {
    //自定义表单验证规则
    var checkEmail = (rule, value, callback) => {
      var reg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
      if (!reg.test(value)) {
        return callback(new Error("输入的邮箱格式错误"));
      }
      callback();
    };

    return {
      //左边宽度
      formLabelWidth: "135px",
      //设置默认值不可见
      dialogFormVisible: false,
      userForm: {
        roleIdList: [],
      },
      title: "",
      total: 0,
      roleList: [],
      searchModel: {
        pageNo: 1,
        // 默认显示数量
        pageSize: 10,
      },
      userList: [],
      //表单规则配置

      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 2,
            max: 20,
            message: "长度需要在 2 到 20 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 20,
            message: "长度需要在 6 到 20 个字符",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入电子邮件", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
      },
    };
  },

  methods: {
    getAllRoleList() {
      roleApi.getAllRoleList().then((response) => {
        this.roleList = response.data;
      });
    },

    saveUser() {
      let isOk = true;
      //触发表单的验证
      this.$refs.userFormRef.validate((valid) => {
        // 这边只有校验失败的时候才会进来
        isOk = valid;
      });
      if (isOk) {
        //提交验证给后台
        userApi.saveUser(this.userForm).then((response) => {
          this.$message({
            message: response.message,
            type: "success",
          });
          //关闭对话框
          this.dialogFormVisible = false;
          //刷新表格数据
          this.getUserList();
        });
      } else {
        console.log("error submit!!");
        return false;
      }
    },


    clearForm() {
      this.userForm = {
        roleIdList: [],
      };
      //清除表单校验的提示信息
      this.$refs.userFormRef.clearValidate();
    },
    handleSizeChange(pageSize) {
      //数据更新
      this.searchModel.pageSize = pageSize;
      this.getUserList();
    },
    handleCurrentChange(pageNo) {
      this.searchModel.pageNo = pageNo;
      this.getUserList();
    },

    getUserList() {
      userApi.getUserList(this.searchModel).then((response) => {
        this.userList = response.data.rows;
        this.total = response.data.total;
      });
    },
    openEditUi(id) {
      if (id == null) {
        this.title = "新增用户";
      } else {
        this.title = "修改用户";
        //根据id查询用户数据
        userApi.getUserById(id).then((response) => {
          this.userForm = response.data;
        });
      }
      this.dialogFormVisible = true;
    },

    deleteUser(user) {
      this.$confirm(`确认删除 ${user.username} 这个账户吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          userApi.deleteUserById(user.id).then((response) => {
            this.$message({
              type: "success",
              message: response.message,
            });
            this.getUserList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },


  created() {
    this.getUserList();
    this.getAllRoleList();
  },
};
</script>
<style scoped>
.user-container {
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

.user-table {
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;
}

.user-table >>> .el-table__header-wrapper th {
  background-color: #f0f5ff !important;
  color: #1976D2;
  font-weight: 600;
  padding: 12px 0;
}

.user-table >>> .el-table__row {
  transition: all 0.3s;
}

.user-table >>> .el-table__row:hover {
  background-color: #f0f5ff !important;
}

.username-cell,
.phone-cell,
.email-cell {
  display: flex;
  align-items: center;
  justify-content: center;
}

.username-cell i,
.phone-cell i,
.email-cell i {
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
.user-dialog >>> .el-dialog__header {
  background-color: #1976D2;
  padding: 15px 20px;
  border-radius: 8px 8px 0 0;
}

.user-dialog >>> .el-dialog__title {
  font-size: 18px;
  font-weight: bold;
  color: #ffffff;
}

.user-dialog >>> .el-dialog__headerbtn .el-dialog__close {
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

.role-checkbox-group {
  display: flex;
  flex-wrap: wrap;
}

.role-checkbox {
  margin-right: 15px;
  margin-bottom: 10px;
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