<template>
  <div class="login-container">
    <div class="login-box" style="width: 25%; height: 50%; display: flex; background-color: white; border-radius: 2px; box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15); overflow: hidden;">
      <div style="flex: 1;width: 50%; height: 100%; padding: 40px;display: flex;flex-direction: column;justify-content: center;" >
        <div style="text-align: center; font-size: 28px; margin-bottom: 50px; color: #333; font-weight: 600;">个人健康管理系统</div>
        <el-form
          ref="loginForm"
          :model="loginForm"
          :rules="loginRules"
          auto-complete="on"
          label-position="left"
        >

          <el-form-item prop="username" style="margin-bottom: 40px">
            <el-input
              ref="username"
              v-model="loginForm.username"
              placeholder="用户名"
              name="username"
              type="text"
              tabindex="1"
              auto-complete="on"
              prefix-icon="el-icon-user"
            />
          </el-form-item>

          <el-form-item prop="password" style="margin-bottom: 50px">
            <el-input
              :key="passwordType"
              ref="password"
              v-model="loginForm.password"
              :type="passwordType"
              placeholder="密码"
              name="password"
              tabindex="2"
              auto-complete="on"
              prefix-icon="el-icon-lock"
              @keyup.enter.native="handleLogin"
            />
          </el-form-item>
          <el-form-item prop="password" >

            <div style="display: flex;width: 100%">

              <div style="flex: 1;margin-right: 10px" >
                <el-button :loading="loading" type="primary" @click.native.prevent="handleLogin" style="width: 100%; border-radius: 2px;">登 陆</el-button>
              </div>
              <div style="flex: 1">
                <el-button type="" @click.native.prevent="showRegisterDialog" style="width: 100%;background-color: #4caf50;color: #ffffff; border-radius: 2px;">注 册</el-button>
              </div>

            </div>

          </el-form-item>

        </el-form>

      </div>

    </div>

    <!-- 注册对话框 -->
    <el-dialog
      title="用户注册"
      :visible.sync="registerDialogVisible"
      width="500px"
      @close="resetRegisterForm"
      center
    >
      <el-form :model="registerForm" ref="registerForm" :rules="registerRules" label-width="80px" class="register-form">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="registerForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="registerForm.password" type="password" placeholder="请输入密码" show-password></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="registerForm.confirmPassword" type="password" placeholder="请确认密码" show-password></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="registerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitRegisterForm" :loading="registerLoading">注 册</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { validUsername } from "@/utils/validate";
import userApi from "@/api/userManage";

export default {
  name: "Login",
  data() {
    // 定义验证用户名函数
    const validateUsername = (rule, value, callback) => {
      // 调用 validUsername 函数判断用户名是否合法
      if (!validUsername(value)) {
        // 如果不合法则返回错误信息
        callback(new Error("请输入正确的用户名"));
      } else {
        // 合法则调用 callback() 函数返回验证成功信息
        callback();
      }
    };
    // 定义验证密码函数
    const validatePassword = (rule, value, callback) => {
      // 判断密码是否小于6位
      if (value.length < 6) {
        // 如果小于6位则返回错误信息
        callback(new Error("输入的密码不能少于6位"));
      } else {
        // 合法则调用 callback() 函数返回验证成功信息
        callback();
      }
    };

    // 定义验证确认密码函数
    const validateConfirmPassword = (rule, value, callback) => {
      if (value !== this.registerForm.password) {
        callback(new Error('两次输入的密码不一致'));
      } else {
        callback();
      }
    };

    return {
      // 定义表单数据对象
      loginForm: {
        username: "",
        password: "",
      },
      // 定义表单验证规则
      loginRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername },
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword },
        ],
      },
      // 定义 loading 状态
      loading: false,
      // 定义密码输入框类型，初始为密码框
      passwordType: "password",
      // 定义重定向路径，初始为 undefined
      redirect: undefined,

      // 注册对话框相关数据
      registerDialogVisible: false,
      registerLoading: false,
      registerForm: {
        username: '',
        password: '',
        confirmPassword: '',
        email: ''
      },
      registerRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请确认密码', trigger: 'blur' },
          { validator: validateConfirmPassword, trigger: 'blur' }
        ]
      }
    };
  },

  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },

  methods: {
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },

    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true; // 显示 loading 状态圈
          this.$store
            .dispatch("user/login", this.loginForm)
            .then(() => {
              // 登录成功，跳转到目标路由
              this.$router.push({ path: this.redirect || "/" });
              this.loading = false; // 隐藏 loading 状态
            })
            .catch(() => {
              this.loading = false; // 隐藏 loading 状态
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    showRegisterDialog() {
      this.registerDialogVisible = true;
    },

    submitRegisterForm() {
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          this.registerLoading = true;
          // 构造请求体
          const requestBody = {
            username: this.registerForm.username,
            password: this.registerForm.password,
            email: this.registerForm.email
          };
          // 提交验证给后台
          userApi.register(requestBody).then(response => {
            // 成功提示
            this.$message({
              message: response.message || '注册成功',
              type: "success"
            });
            this.registerDialogVisible = false;
            this.resetRegisterForm();
            this.registerLoading = false;

            // 自动填充登录表单
            this.loginForm.username = this.registerForm.username;
            this.loginForm.password = '';
          }).catch(error => {
            this.$message({
              message: error.response?.data?.message || '注册失败',
              type: "error"
            });
            this.registerLoading = false;
          });
        } else {
          return false;
        }
      });
    },

    resetRegisterForm() {
      if (this.$refs.registerForm) {
        this.$refs.registerForm.resetFields();
      }
      this.registerForm = {
        username: '',
        password: '',
        confirmPassword: '',
        email: ''
      };
      this.registerLoading = false;
    }
  },
};
</script>

<style lang="scss">
.login-container {
  min-height: 100vh;
  height: 1%;
  width: 100%;
  //height: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  //background-color: #3e8e41;
  background-image: url("../../assets/1.png");
  background-size: 100% 100%;
}

.login-box {
  animation: fadeIn 0.8s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.register-form {
  margin: 10px 0;
}

.el-input__inner {
  border-radius: 2px;
}

.el-dialog {
  border-radius: 2px;
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
