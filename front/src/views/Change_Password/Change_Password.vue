<template>
  <div class="register-form">
    <h1>修改密码</h1>
    <el-form
      :model="form"
      ref="form"
      :rules="rules"
      label-width="80px"
      class="form"
    >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="当前密码" prop="password">
        <el-input
          v-model="form.password"
          type="password"
          placeholder="请输入当前密码"
        ></el-input>
      </el-form-item>
      <el-form-item label="新的密码" prop="newPassword">
        <el-input
          v-model="form.newPassword"
          type="password"
          placeholder="请输入新的密码"
        ></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmNewPassword">
        <el-input
          v-model="form.confirmNewPassword"
          type="password"
          placeholder="请再次输入新的密码"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import userApi from "@/api/userManage";

export default {
  data() {
    return {
      form: {
        username: "",
        password: "",
        newPassword: "",
        confirmNewPassword: "",
        id: null,
      },
      rules: {
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
          { validator: this.validateConfirmNewPassword, trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // 构造请求体
          const requestBody = {
            id: this.id,
            username: this.form.username,
            password: this.form.password,
            newPassword: this.form.newPassword,
          };
          //提交验证给后台
          userApi
            .changePassword(requestBody)
            .then((response) => {
              //成功提示
              this.$message({
                message: response.message,
                type: "success",
              });
              this.$router.replace('/login');
            })
            
            .catch((error) => {
              //错误提示
              this.$message({
                message: error.response.data.message,
                type: "error",
              });
            });
        } else {
          //表单校验不通过
          return false;
        }
      });
    },
    validateConfirmNewPassword(rule, value, callback) {
      if (value !== this.form.newPassword) {
        callback(new Error("两次输入的密码不一致"));
      } else {
        callback();
      }
    },

     getUserId() {
      userApi
        .getUserId()
        .then((response) => {
          console.log(response)
          // 成功获取用户ID
          this.id = response.data.userId;
          // 其他逻辑
        })
        .catch((error) => {
          // 处理错误情况
        });
    },


    
  },

  created(){
    this.getUserId();
  }
};
</script> 
  <style scoped>
.register-form {
  margin: 50px auto;
  max-width: 500px;
  padding: 20px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  font-family: Arial, sans-serif;
}

.register-form h1 {
  margin-top: 0;
  text-align: center;
  font-size: 28px;
  font-weight: 500;
}

.form {
  margin-top: 30px;
}
</style>
  
  