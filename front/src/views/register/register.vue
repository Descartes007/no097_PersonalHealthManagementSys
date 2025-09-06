<template>
    <div class="register-form">
      <h1>用户注册</h1>
      <el-form :model="form" ref="form" :rules="rules" label-width="80px" class="form">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" type="password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="form.confirmPassword" type="password" placeholder="请确认密码"></el-input>
        </el-form-item>
        
        <!-- <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
        </el-form-item> -->
        <el-form-item>
          <el-button type="primary" @click="submitForm">注册</el-button>
        </el-form-item>
      </el-form>
    </div>
  </template>
  <script >
  
  import userApi from "@/api/userManage";
  
  export default {
    data() {
      return {
        form: {
          username: '',
          password: '',
          confirmPassword: '',
          email: ''
        },
        rules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
          ],
          confirmPassword: [
            { required: true, message: '请确认密码', trigger: 'blur' },
            { validator: this.validateConfirmPassword, trigger: 'blur' }
          ],
          // email: [
          //   { required: true, message: '请输入邮箱', trigger: 'blur' },
          //   { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
          // ],
        }
      }
    },
    methods: {
      submitForm() {
    this.$refs.form.validate(valid => {
      if (valid) {
        // 构造请求体
        const requestBody = {
          username: this.form.username,
          password: this.form.password,
          email: this.form.email
        };
          //提交验证给后台
          userApi.register(requestBody).then(response=> {
            //成功提示
            this.$message({
              message: response.message,
              type: "success"
            });
            this.$router.push('/login');

          });
      } else {
        return false;
      }
    });
  },
  
  
      validateConfirmPassword(rule, value, callback) {
        if (value !== this.form.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      }
    }
  }
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
  
  