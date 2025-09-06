<template>
  <div class="body-info-upload">
    <div class="upload-container">
      <div class="header-section">
        <div class="title-container">
          <i class="el-icon-upload2"></i>
          <h1 class="title">身体信息上传</h1>
        </div>
        <p class="subtitle">请填写您的身体健康信息，帮助我们为您提供更好的健康管理服务</p>
      </div>
      
      <el-form
        :model="form"
        :rules="rules"
        ref="form"
        label-width="110px"
        class="form"
        size="medium"
      >
        <div class="form-section">
          <div class="section-title">
            <i class="el-icon-user"></i>
            <span>基本信息</span>
          </div>
          <el-row :gutter="20">
            <el-col :xs="24" :sm="12">
              <el-form-item label="姓名" prop="name">
                <el-input
                  v-model="form.name"
                  placeholder="请输入姓名"
                  prefix-icon="el-icon-user"
                ></el-input>
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="12">
              <el-form-item label="年龄" prop="age">
                <el-input-number 
                  v-model="form.age" 
                  :min="0" 
                  controls-position="right"
                  class="custom-input-number"
                ></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :xs="24" :sm="12">
              <el-form-item label="性别" prop="gender">
                <el-radio-group v-model="form.gender">
                  <el-radio label="男">
                    <i class="el-icon-male"></i> 男
                  </el-radio>
                  <el-radio label="女">
                    <i class="el-icon-female"></i> 女
                  </el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="12">
              <el-form-item label="身高/m" prop="height">
                <el-input-number 
                  v-model="form.height" 
                  :min="0" 
                  :step="0.01" 
                  :precision="2"
                  controls-position="right"
                  class="custom-input-number"
                >
                </el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <div class="form-section">
          <div class="section-title">
            <i class="el-icon-data-analysis"></i>
            <span>身体指标</span>
          </div>
          <el-row :gutter="20">
            <el-col :xs="24" :sm="12">
              <el-form-item label="体重/kg" prop="weight">
                <el-input-number 
                  v-model="form.weight" 
                  :min="0" 
                  :step="0.1" 
                  :precision="1"
                  controls-position="right"
                  class="custom-input-number"
                ></el-input-number>
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="12">
              <el-form-item label="血糖" prop="bloodSugar">
                <el-input-number
                  v-model="form.bloodSugar"
                  :min="0"
                  :step="0.1"
                  :precision="1"
                  controls-position="right"
                  class="custom-input-number"
                ></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :xs="24" :sm="12">
              <el-form-item label="血压" prop="bloodPressure">
                <el-input-number
                  v-model="form.bloodPressure"
                  :min="0"
                  :step="0.1"
                  :precision="1"
                  controls-position="right"
                  class="custom-input-number"
                ></el-input-number>
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="12">
              <el-form-item label="胆固醇" prop="bloodLipid">
                <el-input-number
                  v-model="form.bloodLipid"
                  :min="0"
                  :step="0.1"
                  :precision="1"
                  controls-position="right"
                  class="custom-input-number"
                ></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :xs="24" :sm="12">
              <el-form-item label="心率/BPM" prop="heartRate">
                <el-input-number
                  v-model="form.heartRate"
                  :min="0"
                  controls-position="right"
                  class="custom-input-number"
                ></el-input-number>
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="12">
              <el-form-item label="视力/d" prop="vision">
                <el-input-number 
                  v-model="form.vision" 
                  :min="0" 
                  :step="0.1"
                  :precision="1"
                  controls-position="right"
                  class="custom-input-number"
                ></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <div class="form-section">
          <div class="section-title">
            <i class="el-icon-moon"></i>
            <span>睡眠信息</span>
          </div>
          <el-row :gutter="20">
            <el-col :xs="24" :sm="12">
              <el-form-item label="睡眠时长/h" prop="sleepDuration">
                <el-input-number
                  v-model="form.sleepDuration"
                  :min="0"
                  :step="0.5"
                  :precision="1"
                  controls-position="right"
                  class="custom-input-number"
                ></el-input-number>
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="12">
              <el-form-item label="睡眠质量" prop="sleepQuality">
                <el-radio-group v-model="form.sleepQuality" class="sleep-quality-group">
                  <el-radio :label="'好'" class="quality-radio quality-good">
                    <i class="el-icon-star-on"></i> 好
                  </el-radio>
                  <el-radio :label="'一般'" class="quality-radio quality-normal">
                    <i class="el-icon-star-on"></i> 一般
                  </el-radio>
                  <el-radio :label="'差'" class="quality-radio quality-bad">
                    <i class="el-icon-star-on"></i> 差
                  </el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <div class="form-section">
          <div class="section-title">
            <i class="el-icon-s-help"></i>
            <span>生活习惯</span>
          </div>
          <el-row :gutter="20">
            <el-col :xs="24" :sm="8">
              <el-form-item label="是否吸烟" prop="smoking" class="habit-item">
                <el-switch
                  v-model="form.smoking"
                  active-color="#ff4949"
                  inactive-color="#13ce66"
                  active-text="是"
                  inactive-text="否"
                ></el-switch>
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="8">
              <el-form-item label="是否饮酒" prop="drinking" class="habit-item">
                <el-switch
                  v-model="form.drinking"
                  active-color="#ff4949"
                  inactive-color="#13ce66"
                  active-text="是"
                  inactive-text="否"
                ></el-switch>
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="8">
              <el-form-item label="是否运动" prop="exercise" class="habit-item">
                <el-switch
                  v-model="form.exercise"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  active-text="是"
                  inactive-text="否"
                ></el-switch>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :xs="24" :sm="12">
              <el-form-item label="喜好的食物" prop="foodTypes">
                <el-select 
                  v-model="form.foodTypes" 
                  placeholder="请选择喜好的食物种类"
                  class="custom-select"
                >
                  <el-option label="蔬菜" value="蔬菜">
                    <i class="el-icon-food"></i> 蔬菜
                  </el-option>
                  <el-option label="水果" value="水果">
                    <i class="el-icon-food"></i> 水果
                  </el-option>
                  <el-option label="肉类" value="肉类">
                    <i class="el-icon-food"></i> 肉类
                  </el-option>
                  <el-option label="鱼类" value="鱼类">
                    <i class="el-icon-food"></i> 鱼类
                  </el-option>
                  <el-option label="豆类" value="豆类">
                    <i class="el-icon-food"></i> 豆类
                  </el-option>
                  <el-option label="谷物" value="谷物">
                    <i class="el-icon-food"></i> 谷物
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="12">
              <el-form-item label="饮水量/ml" prop="waterConsumption">
                <el-input-number
                  v-model="form.waterConsumption"
                  :min="0"
                  :step="100"
                  controls-position="right"
                  class="custom-input-number"
                ></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <div class="form-actions">
          <el-button type="primary" @click="submitForm()" class="submit-btn">
            <i class="el-icon-upload"></i> 提交信息
          </el-button>
          <el-button @click="resetForm('form')" class="reset-btn">
            <i class="el-icon-refresh-right"></i> 重置表单
          </el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>
  
<script>
import FunctionApi from "@/api/Function_Menu";
import AvatarUpload from "@/components/HeadImage/AvatarUpload";
import userApi from "@/api/userManage";

export default {
  name: "InfoUpload",
  components: {
    AvatarUpload,
  },
  data() {
    return {
      form: {
        id: null,
        name: "",
        age: null,
        gender: "",
        height: "",
        weight: "",
        bloodSugar: "",
        bloodPressure: "",
        bloodLipid: "",
        heartRate: null,
        vision: null,
        sleepDuration: null,
        sleepQuality: "",
        smoking: null,
        drinking: null,
        exercise: null,
        foodTypes: "",
        waterConsumption: null,
      },

      rules: {
        name: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "长度在 2 到 10 个字符",
            trigger: "blur",
          },
        ],
        age: [
          { required: true, message: "请输入年龄", trigger: "blur" },
          { type: "number", message: "年龄必须为数字值" },
        ],
        gender: [{ required: true, message: "请选择性别", trigger: "change" }],
        height: [
          { required: true, message: "请输入身高", trigger: "blur" },
          { type: "number", message: "身高必须为数字值" },
        ],
        weight: [
          { required: true, message: "请输入体重", trigger: "blur" },
          { type: "number", message: "体重必须为数字值" },
        ],
        bloodSugar: [
          { required: true, message: "请输入血糖", trigger: "blur" },
          { type: "number", message: "血糖必须为数字值" },
        ],
        bloodPressure: [
          { required: true, message: "请输入血压", trigger: "blur" },
          { type: "number", message: "血压必须为数字值" },
        ],
        bloodLipid: [
          { required: true, message: "请输入血脂", trigger: "blur" },
          { type: "number", message: "血脂必须为数字值" },
        ],

        heartRate: [
          { required: true, message: "请输入心率", trigger: "blur" },
          { type: "number", message: "心率必须为数字值" },
        ],
        vision: [
          { required: true, message: "请输入视力", trigger: "blur" },
          { type: "number", message: "视力必须为数字值" },
        ],
        sleepQuality: [
          {
            required: true,
            message: "请选择睡眠质量",
            trigger: "change",
          },
        ],
        smoking: [
          { required: true, message: "请选择是否吸烟", trigger: "change" },
        ],
        drinking: [
          { required: true, message: "请选择是否饮酒", trigger: "change" },
        ],
        exercise: [
          { required: true, message: "请选择是否运动", trigger: "change" },
        ],
        foodTypes: [
          { required: true, message: "请选择摄入较多的食物种类", trigger: "blur" },
        ],
        waterConsumption: [
          { required: true, message: "请输入饮水量", trigger: "blur" },
          { type: "number", message: "饮水量必须为数字值" },
        ],
      },
    };
  },

  methods: {
    submitForm() {
      // 如果表单数据中没有 id 属性，则将组件的 id 属性赋值给表单数据的 id 属性
      if (!this.form.id) {
        this.form.id = this.id;
      }

      this.$refs.form.validate((valid) => {
        if (valid) {
          FunctionApi.BodyInformation(this.form)
            .then((response) => {
              this.$message({
                type: "success",
                message: response.message,
                duration: 2000,
                showClose: true,
              });
            })
            .catch((error) => {
              this.$message({
                type: "error",
                message: "提交失败，请稍后重试",
                duration: 2000,
                showClose: true,
              });
            });
            
          FunctionApi.BodyInformationNotes(this.form)
            .then((response) => {})
            .catch((error) => {});
        } else {
          this.$message({
            type: "warning",
            message: "请填写完整的表单信息",
            duration: 2000,
            showClose: true,
          });
          return false;
        }
      });
    },

    // 重置表单数据的方法
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.$message({
        message: "表单已重置",
        type: "info",
        duration: 2000,
        showClose: true,
      });
    },

    async getUserId() {
      await userApi.getUserId().then((response) => {
        // 如果请求成功并且返回的数据包含 id 属性，则将其转换为整数并赋值给组件的 id 属性
        if (response && response.data) {
          this.id = parseInt(response.data.id);
        }
      });
    },
  },

  created() {
    this.getUserId();
  },
};
</script>
  
<style scoped>
.body-info-upload {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 120px);
  background-color: #f5f7fa;
  padding: 20px;
}

.upload-container {
  width: 100%;
  max-width: 1000px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 30px;
  transition: all 0.3s ease;
}

.upload-container:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.header-section {
  text-align: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #ebeef5;
}

.title-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
}

.title-container i {
  font-size: 32px;
  color: #1976D2;
  margin-right: 10px;
}

.title {
  font-size: 28px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

.subtitle {
  font-size: 16px;
  color: #909399;
  margin: 10px 0 0;
}

.form {
  margin-top: 20px;
}

.form-section {
  background-color: #f9fafc;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 25px;
  border: 1px solid #ebeef5;
  transition: all 0.3s ease;
}

.form-section:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transform: translateY(-2px);
}

.section-title {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #1976D2;
  width: fit-content;
}

.section-title i {
  font-size: 20px;
  color: #1976D2;
  margin-right: 8px;
}

.section-title span {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.el-row {
  margin-bottom: 15px;
}

.el-form-item {
  margin-bottom: 22px;
}

.el-form-item__label {
  font-weight: 500;
  color: #606266;
}

.custom-input-number {
  width: 100%;
}

.custom-input-number >>> .el-input__inner {
  border-radius: 4px;
}

.custom-select {
  width: 100%;
}

.sleep-quality-group {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  height: 40px;
}

.quality-radio {
  display: flex;
  align-items: center;
  margin-right: 20px;
}

.quality-radio >>> .el-radio__input {
  display: flex;
  align-items: center;
}

.quality-radio >>> .el-radio__label {
  display: flex;
  align-items: center;
  line-height: 1;
}

.quality-good >>> .el-radio__label {
  color: #67C23A;
}

.quality-normal >>> .el-radio__label {
  color: #E6A23C;
}

.quality-bad >>> .el-radio__label {
  color: #F56C6C;
}

.habit-item {
  display: flex;
  align-items: center;
}

.habit-item >>> .el-form-item__content {
  margin-left: 0 !important;
  display: flex;
  justify-content: center;
}

.form-actions {
  display: flex;
  justify-content: center;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
}

.submit-btn {
  background: linear-gradient(135deg, #1976D2, #42A5F5);
  border-color: #1976D2;
  padding: 12px 25px;
  font-size: 16px;
  border-radius: 25px;
  margin-right: 15px;
  transition: all 0.3s ease;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(25, 118, 210, 0.3);
  background: linear-gradient(135deg, #1565C0, #1976D2);
}

.reset-btn {
  padding: 12px 25px;
  font-size: 16px;
  border-radius: 25px;
  transition: all 0.3s ease;
}

.reset-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .upload-container {
    padding: 20px;
  }
  
  .form-section {
    padding: 15px;
  }
  
  .title {
    font-size: 24px;
  }
  
  .subtitle {
    font-size: 14px;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .submit-btn, .reset-btn {
    width: 100%;
    margin-right: 0;
  }
  
  .submit-btn {
    margin-bottom: 10px;
  }
}
</style>

  