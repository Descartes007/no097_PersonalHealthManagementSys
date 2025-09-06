<!-- 搜索框和添加按钮，搜索框，以及用户名和手机号的输入框 -->
<template>
  <div class="body-manage-container">
    <!-- 页面标题区域 -->
    <div class="page-header">
      <div class="header-title">
        <i class="el-icon-data-board"></i>
        <h2>身体信息管理</h2>
      </div>
      <div class="header-actions">
        <el-button 
          type="primary" 
          icon="el-icon-refresh" 
          @click="getUserBodyList"
          size="small"
          class="refresh-button"
        >
          刷新数据
        </el-button>
      </div>
    </div>
    
    <!-- 数据表格卡片 -->
    <div class="data-card">
      <el-table 
        :data="bodyList" 
        stripe 
        border
        highlight-current-row
        style="width: 100%"
        :header-cell-style="{
          backgroundColor: '#f5f7fa',
          color: '#606266',
          fontWeight: 'bold',
          borderBottom: '2px solid #EBEEF5'
        }"
      >
        <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
        <el-table-column prop="date" label="上传时间" min-width="120" align="center" :formatter="formatDate"></el-table-column>
        <el-table-column prop="name" label="姓名" min-width="100" align="center"></el-table-column>
        <el-table-column prop="age" label="年龄" width="70" align="center"></el-table-column>
        <el-table-column prop="gender" label="性别" width="70" align="center"></el-table-column>
        <el-table-column prop="height" label="身高/cm" width="100" align="center"></el-table-column>
        <el-table-column prop="weight" label="体重/kg" width="100" align="center"></el-table-column>
        <el-table-column prop="bloodSugar" label="血糖" width="80" align="center"></el-table-column>
        <el-table-column prop="bloodPressure" label="血压" width="80" align="center"></el-table-column>
        <el-table-column prop="bloodLipid" label="血脂" width="80" align="center"></el-table-column>
        <el-table-column prop="heartRate" label="心率/分钟" width="100" align="center"></el-table-column>
        <el-table-column prop="vision" label="视力" width="80" align="center"></el-table-column>
        <el-table-column prop="sleepDuration" label="睡眠时长" width="100" align="center"></el-table-column>
        
        <el-table-column prop="sleepQuality" label="睡眠质量" width="100" align="center">
          <template slot-scope="scope">
            <el-tag :type="sleepQualityType(scope.row.sleepQuality)" size="small">
              {{ formatSleepQuality(scope.row.sleepQuality) }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column label="生活习惯" width="300" align="center">
          <template slot-scope="scope">
            <div class="habit-tags">
              <el-tag 
                :type="scope.row.smoking ? 'danger' : 'success'" 
                size="small" 
                effect="plain"
              >
                {{ scope.row.smoking ? '吸烟' : '不吸烟' }}
              </el-tag>
              <el-tag 
                :type="scope.row.drinking ? 'warning' : 'success'" 
                size="small"
                effect="plain"
              >
                {{ scope.row.drinking ? '饮酒' : '不饮酒' }}
              </el-tag>
              <el-tag 
                :type="scope.row.exercise ? 'success' : 'info'" 
                size="small"
                effect="plain"
              >
                {{ scope.row.exercise ? '有运动习惯' : '缺乏运动' }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column prop="foodTypes" label="喜好食物" width="100" align="center"></el-table-column>
        <el-table-column prop="waterConsumption" label="饮水量/ml" width="100" align="center"></el-table-column>
        
        <el-table-column label="操作" width="150" align="center" fixed="right">
          <template slot-scope="scope">
            <div class="table-actions">
              <el-tooltip content="编辑信息" placement="top" :open-delay="300">
                <el-button
                  @click="openEditUi(scope.row.notesid)"
                  type="primary"
                  icon="el-icon-edit"
                  circle
                  size="small"
                ></el-button>
              </el-tooltip>
              <el-tooltip content="删除信息" placement="top" :open-delay="300">
                <el-button
                  @click="deleteUserBody(scope.row)"
                  type="danger"
                  icon="el-icon-delete"
                  circle
                  size="small"
                ></el-button>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 空数据提示 -->
      <div class="empty-data" v-if="bodyList.length === 0">
        <i class="el-icon-warning-outline"></i>
        <p>暂无身体信息数据</p>
      </div>
      
      <!-- 分页控件 -->
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

    <!-- 编辑对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="dialogFormVisible"
      width="60%"
      :close-on-click-modal="false"
      @close="clearForm"
      center
    >
      <el-form :model="bodyForm" ref="bodyFormRef" :rules="rules" label-width="120px" class="form-container">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="bodyForm.name" placeholder="请输入姓名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="年龄" prop="age">
              <el-input-number v-model="bodyForm.age" :min="0" :max="150" controls-position="right" style="width: 100%"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="性别" prop="gender">
              <el-radio-group v-model="bodyForm.gender">
                <el-radio label="男">男</el-radio>
                <el-radio label="女">女</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身高/cm" prop="height">
              <el-input-number v-model="bodyForm.height" :min="0" :step="0.1" :precision="1" controls-position="right" style="width: 100%"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="体重/kg" prop="weight">
              <el-input-number v-model="bodyForm.weight" :min="0" :step="0.1" :precision="1" controls-position="right" style="width: 100%"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="血糖" prop="bloodSugar">
              <el-input-number v-model="bodyForm.bloodSugar" :min="0" :step="0.1" :precision="1" controls-position="right" style="width: 100%"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="血压" prop="bloodPressure">
              <el-input-number v-model="bodyForm.bloodPressure" :min="0" controls-position="right" style="width: 100%"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="血脂" prop="bloodLipid">
              <el-input-number v-model="bodyForm.bloodLipid" :min="0" :step="0.1" :precision="1" controls-position="right" style="width: 100%"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="心率/分钟" prop="heartRate">
              <el-input-number v-model="bodyForm.heartRate" :min="0" controls-position="right" style="width: 100%"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="视力" prop="vision">
              <el-input-number v-model="bodyForm.vision" :min="0" controls-position="right" style="width: 100%"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="睡眠时长/h" prop="sleepDuration">
              <el-input-number v-model="bodyForm.sleepDuration" :min="0" :step="0.5" :precision="1" controls-position="right" style="width: 100%"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="睡眠质量" prop="sleepQuality">
              <el-radio-group v-model="bodyForm.sleepQuality">
                <el-radio :label="'好'" class="quality-good">
                  <i class="el-icon-star-on"></i> 好
                </el-radio>
                <el-radio :label="'一般'" class="quality-normal">
                  <i class="el-icon-star-on"></i> 一般
                </el-radio>
                <el-radio :label="'差'" class="quality-bad">
                  <i class="el-icon-star-on"></i> 差
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-divider content-position="center">生活习惯</el-divider>
        
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="是否吸烟" prop="smoking">
              <el-switch
                v-model="bodyForm.smoking"
                active-color="#F56C6C"
                inactive-color="#67C23A"
                active-text="是"
                inactive-text="否"
              ></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否喝酒" prop="drinking">
              <el-switch
                v-model="bodyForm.drinking"
                active-color="#E6A23C"
                inactive-color="#67C23A"
                active-text="是"
                inactive-text="否"
              ></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否运动" prop="exercise">
              <el-switch
                v-model="bodyForm.exercise"
                active-color="#67C23A"
                inactive-color="#909399"
                active-text="是"
                inactive-text="否"
              ></el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="喜好食物" prop="foodTypes">
              <el-select
                v-model="bodyForm.foodTypes"
                placeholder="请选择喜好的食物种类"
                style="width: 100%"
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
          <el-col :span="12">
            <el-form-item label="饮水量/ml" prop="waterConsumption">
              <el-input-number
                v-model="bodyForm.waterConsumption"
                :min="0"
                :step="100"
                controls-position="right"
                style="width: 100%"
              ></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" size="medium">取 消</el-button>
        <el-button type="primary" @click="updateBody" size="medium">
          <i class="el-icon-check"></i> 确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import userApi from "@/api/userManage";
export default {
  data() {
    return {
      bodyForm: {}, // 初始化为一个空对象
      bodyList: [],
      formLabelWidth: "120px",
      dialogFormVisible: false,
      title: "",
      total: 0,
      searchModel: {
        pageNo: 1,
        pageSize: 10,
      },
      rules: {
        name: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          { min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "blur" }
        ],
        age: [
          { required: true, message: "请输入年龄", trigger: "blur" },
          { type: "number", message: "年龄必须为数字值" }
        ],
        gender: [
          { required: true, message: "请选择性别", trigger: "change" }
        ],
        height: [
          { required: true, message: "请输入身高", trigger: "blur" },
          { type: "number", message: "身高必须为数字值" }
        ],
        weight: [
          { required: true, message: "请输入体重", trigger: "blur" },
          { type: "number", message: "体重必须为数字值" }
        ],
        bloodSugar: [
          { required: true, message: "请输入血糖", trigger: "blur" }
        ],
        bloodPressure: [
          { required: true, message: "请输入血压", trigger: "blur" }
        ],
        bloodLipid: [
          { required: true, message: "请输入血脂", trigger: "blur" }
        ],
        heartRate: [
          { required: true, message: "请输入心率", trigger: "blur" }
        ],
        vision: [
          { required: true, message: "请输入视力", trigger: "blur" }
        ],
        sleepQuality: [
          { required: true, message: "请选择睡眠质量", trigger: "change" }
        ],
        foodTypes: [
          { required: true, message: "请选择喜好食物", trigger: "change" }
        ],
        waterConsumption: [
          { required: true, message: "请输入饮水量", trigger: "blur" }
        ]
      }
    };
  },

  methods: {
    // 根据睡眠质量返回标签类型
    sleepQualityType(quality) {
      if (quality === '好' || quality === 1) return 'success';
      if (quality === '一般' || quality === 2) return 'warning';
      if (quality === '差' || quality === 3) return 'danger';
      return 'info';
    },
    
    // 格式化睡眠质量
    formatSleepQuality(quality) {
      if (quality === 1) return '好';
      if (quality === 2) return '一般';
      if (quality === 3) return '差';
      return quality;
    },
    
    updateBody() {
      this.$refs.bodyFormRef.validate((valid) => {
        if (valid) {
          userApi.updateUserBody(this.bodyForm).then((response) => {
            this.$message({
              message: response.message,
              type: "success",
              duration: 1500
            });
            this.dialogFormVisible = false;
            this.getUserBodyList();
          }).catch(error => {
            this.$message({
              message: "更新失败，请稍后再试",
              type: "error",
              duration: 1500
            });
          });
        } else {
          return false;
        }
      });
    },

    clearForm() {
      this.bodyForm = {};
      this.$nextTick(() => {
        this.$refs.bodyFormRef && this.$refs.bodyFormRef.clearValidate();
      });
    },
    
    handleSizeChange(pageSize) {
      this.searchModel.pageSize = pageSize;
      this.getUserBodyList();
    },
    
    handleCurrentChange(pageNo) {
      this.searchModel.pageNo = pageNo;
      this.getUserBodyList();
    },

    getUserBodyList() {
      userApi.getUserBodyList(this.searchModel).then((response) => {
        this.bodyList = response.data.rows;
        this.total = response.data.total;
      }).catch(error => {
        this.$message({
          message: "获取数据失败，请稍后再试",
          type: "error",
          duration: 1500
        });
      });
    },

    openEditUi(notesid) {
      this.title = "修改身体信息";
      userApi.getUserBodyById(notesid).then((response) => {
        this.bodyForm = response.data;
        this.dialogFormVisible = true;
      }).catch(error => {
        this.$message({
          message: "获取信息失败，请稍后再试",
          type: "error",
          duration: 1500
        });
      });
    },

    deleteUserBody(body) {
      this.$confirm(`确认删除 ${body.name} 的身体信息吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          userApi.deleteUserBodyById(body.notesid).then((response) => {
            this.$message({
              type: "success",
              message: response.message,
              duration: 1500
            });
            this.getUserBodyList();
          }).catch(error => {
            this.$message({
              message: "删除失败，请稍后再试",
              type: "error",
              duration: 1500
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
            duration: 1500
          });
        });
    },

    formatDate(row, column, cellValue, index) {
      if (!cellValue) return '';
      const date = new Date(cellValue);
      return date.toLocaleDateString();
    }
  },

  created() {
    this.getUserBodyList();
  }
};
</script>

<style scoped>
.body-manage-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 120px);
}

/* 页面标题区域 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 15px 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.header-title {
  display: flex;
  align-items: center;
}

.header-title i {
  font-size: 24px;
  color: #409EFF;
  margin-right: 10px;
}

.header-title h2 {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

.refresh-button {
  transition: all 0.3s;
}

.refresh-button:hover {
  transform: rotate(90deg);
}

/* 数据卡片 */
.data-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  padding: 20px;
  margin-bottom: 20px;
}

/* 表格样式定制 */
.el-table {
  margin-bottom: 20px;
  border-radius: 6px;
  overflow: hidden;
}

.el-table >>> .el-table__row:hover {
  background-color: #f0f7ff !important;
}

.table-actions {
  display: flex;
  justify-content: center;
  gap: 10px;
}

/* 生活习惯标签 */
.habit-tags {
  display: flex;
  justify-content: center;
  gap: 8px;
}

/* 空数据提示 */
.empty-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  color: #909399;
}

.empty-data i {
  font-size: 48px;
  margin-bottom: 20px;
}

.empty-data p {
  font-size: 16px;
  margin: 0;
}

/* 分页容器 */
.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

/* 表单样式 */
.form-container {
  max-height: 60vh;
  overflow-y: auto;
  padding: 0 10px;
}

.form-container::-webkit-scrollbar {
  width: 6px;
}

.form-container::-webkit-scrollbar-thumb {
  background-color: #dcdfe6;
  border-radius: 3px;
}

.form-container::-webkit-scrollbar-track {
  background-color: #f5f7fa;
}

/* 睡眠质量单选按钮样式 */
.quality-good >>> .el-radio__label {
  color: #67C23A;
}

.quality-normal >>> .el-radio__label {
  color: #E6A23C;
}

.quality-bad >>> .el-radio__label {
  color: #F56C6C;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .header-actions {
    margin-top: 10px;
  }
}
</style>