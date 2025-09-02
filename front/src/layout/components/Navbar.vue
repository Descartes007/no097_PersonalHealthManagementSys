<template>
  <div class="navbar">
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar + '?imageView2/1/w/80/h/80'" class="user-avatar" />
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <el-dropdown-item @click.native="showChangePasswordDialog"> 
            <i class="el-icon-key" style="margin-right: 8px;"></i>
            修改密码 
          </el-dropdown-item>
          <a target="_blank" href="wwww.baidu.com">
            <el-dropdown-item>
              <i class="el-icon-s-home" style="margin-right: 8px;"></i>
              主页
            </el-dropdown-item>
          </a>
          <el-dropdown-item divided @click.native="logout">
            <i class="el-icon-switch-button" style="margin-right: 8px;"></i>
            <span style="display: inline-block">退出账户</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <!-- 修改密码对话框 -->
    <el-dialog
      title="修改密码"
      :visible.sync="dialogVisible"
      width="500px"
      @close="resetForm"
      center
    >
      <el-form
        :model="passwordForm"
        ref="passwordForm"
        :rules="passwordRules"
        label-width="100px"
        class="password-form"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="passwordForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="当前密码" prop="password">
          <el-input
            v-model="passwordForm.password"
            type="password"
            placeholder="请输入当前密码"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item label="新的密码" prop="newPassword">
          <el-input
            v-model="passwordForm.newPassword"
            type="password"
            placeholder="请输入新的密码"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmNewPassword">
          <el-input
            v-model="passwordForm.confirmNewPassword"
            type="password"
            placeholder="请再次输入新的密码"
            show-password
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitPasswordForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import userApi from "@/api/userManage";

export default {
  components: {
    Breadcrumb,
    Hamburger,
  },
  data() {
    const validateConfirmPassword = (rule, value, callback) => {
      if (value !== this.passwordForm.newPassword) {
        callback(new Error("两次输入的密码不一致"));
      } else {
        callback();
      }
    };
    
    return {
      dialogVisible: false,
      userId: null,
      passwordForm: {
        username: "",
        password: "",
        newPassword: "",
        confirmNewPassword: "",
      },
      passwordRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入当前密码", trigger: "blur" },
          { min: 6, message: "密码长度不能少于6位", trigger: "blur" },
        ],
        newPassword: [
          { required: true, message: "请输入新的密码", trigger: "blur" },
          { min: 6, message: "密码长度不能少于6位", trigger: "blur" },
        ],
        confirmNewPassword: [
          { required: true, message: "确认密码", trigger: "blur" },
          { validator: validateConfirmPassword, trigger: "blur" },
        ],
      }
    };
  },
  computed: {
    ...mapGetters(["sidebar", "avatar"]),
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    async logout() {
      await this.$store.dispatch("user/logout");
      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
      // 注销时删除所有tagview
      await this.$store.dispatch("tagsView/delAllViews");
      sessionStorage.removeItem("tabViews");
    },
    showChangePasswordDialog() {
      this.dialogVisible = true;
      // 获取当前用户ID
      this.getUserId();
    },
    getUserId() {
      userApi
        .getUserId()
        .then((response) => {
          this.userId = response.data.userId;
        })
        .catch((error) => {
          this.$message.error("获取用户信息失败");
        });
    },
    submitPasswordForm() {
      this.$refs.passwordForm.validate((valid) => {
        if (valid) {
          // 构造请求体
          const requestBody = {
            id: this.userId,
            username: this.passwordForm.username,
            password: this.passwordForm.password,
            newPassword: this.passwordForm.newPassword,
          };
          
          // 提交验证给后台
          userApi
            .changePassword(requestBody)
            .then((response) => {
              // 成功提示
              this.$message({
                message: "密码修改成功",
                type: "success",
              });
              this.dialogVisible = false;
              this.resetForm();
            })
            .catch((error) => {
              // 错误提示
              this.$message({
                message: error.response?.data?.message || "密码修改失败",
                type: "error",
              });
            });
        }
      });
    },
    resetForm() {
      if (this.$refs.passwordForm) {
        this.$refs.passwordForm.resetFields();
      }
      this.passwordForm = {
        username: "",
        password: "",
        newPassword: "",
        confirmNewPassword: "",
      };
    }
  },
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 60px;
  overflow: hidden;
  position: relative;
  background: linear-gradient(90deg, #0d47a1, #1565c0);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);

  .hamburger-container {
    line-height: 60px;
    height: 100%;
    float: left;
    padding: 0 15px;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }
  }

  .breadcrumb-container {
    float: left;
    line-height: 60px;
    padding-left: 10px;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 60px;
    margin-right: 10px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #ffffff;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      }
    }

    .avatar-container {
      margin-right: 20px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
          transition: all 0.3s;
          
          &:hover {
            transform: scale(1.1);
          }
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
          color: #ffffff;
        }
      }
    }
  }
}

.password-form {
  margin: 20px 0;
  
  .el-input {
    width: 100%;
  }
}

::v-deep .el-dialog {
  border-radius: 8px;
  overflow: hidden;
  
  .el-dialog__header {
    background: linear-gradient(90deg, #0d47a1, #1565c0);
    padding: 15px 20px;
    
    .el-dialog__title {
      color: #ffffff;
      font-size: 18px;
      font-weight: 600;
    }
    
    .el-dialog__headerbtn .el-dialog__close {
      color: #ffffff;
    }
  }
  
  .el-dialog__body {
    padding: 30px 25px;
  }
  
  .el-dialog__footer {
    border-top: 1px solid #eee;
    padding: 15px 20px;
  }
}
</style>
