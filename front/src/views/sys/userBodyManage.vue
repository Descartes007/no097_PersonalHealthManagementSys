<!-- 搜索框和添加按钮，搜索框，以及用户名和手机号的输入框 -->
<template>
  <div class="body-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <div class="search-header">
        <div class="search-title">
          <i class="el-icon-user"></i>
          <span>用户身体信息查询</span>
        </div>
      </div>
      <div class="search-content">
          <el-input
            v-model="searchModel.name"
            placeholder="请输入昵称"
          prefix-icon="el-icon-user"
            clearable
          class="search-input"
          ></el-input>
          <el-input
            v-model="searchModel.id"
            placeholder="请输入ID"
          prefix-icon="el-icon-tickets"
            clearable
          class="search-input"
          ></el-input>
          <el-button
            @click="getBodyList"
            type="primary"
            icon="el-icon-search"
          class="search-btn"
        >查询</el-button>
      </div>
    </div>

    <!-- 用户身体信息列表区域 -->
    <div class="table-container">
      <div class="table-header">
        <div class="table-title">
          <i class="el-icon-data-analysis"></i>
          <span>用户身体信息列表</span>
          <span class="table-count">共 {{ total }} 条记录</span>
        </div>
      </div>
      
      <div class="table-scroll-container">
        <el-table 
          :data="bodyList" 
          stripe 
          border
          highlight-current-row
          class="body-table"
        >
          <el-table-column
            type="index"
            label="序号"
            width="60"
            align="center"
            fixed="left"
          ></el-table-column>
          <el-table-column 
            prop="id" 
            label="ID" 
            width="60"
            align="center"
            fixed="left"
          ></el-table-column>
          <el-table-column
            prop="name"
            label="昵称"
            width="100"
            align="center"
            fixed="left"
          >
            <template slot-scope="scope">
              <div class="name-cell">
                <i class="el-icon-user-solid"></i>
                <span>{{ scope.row.name }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column 
            prop="age" 
            label="年龄" 
            width="70"
            align="center"
          >
            <template slot-scope="scope">
              <div class="age-cell">
                <i class="el-icon-time"></i>
                <span>{{ scope.row.age }}</span>
              </div>
            </template>
          </el-table-column>
        <el-table-column
          prop="gender"
          label="性别"
            width="70"
            align="center"
          >
            <template slot-scope="scope">
              <div class="gender-cell">
                <i :class="scope.row.gender === '男' ? 'el-icon-male' : 'el-icon-female'"></i>
                <span>{{ scope.row.gender }}</span>
              </div>
            </template>
          </el-table-column>
        <el-table-column
          prop="height"
          label="身高/cm"
            width="90"
            align="center"
          >
            <template slot-scope="scope">
              <div class="height-cell">
                <i class="el-icon-top"></i>
                <span>{{ scope.row.height }}</span>
              </div>
            </template>
          </el-table-column>
        <el-table-column
          prop="weight"
          label="体重/kg"
            width="90"
            align="center"
          >
            <template slot-scope="scope">
              <div class="weight-cell">
                <i class="el-icon-bottom"></i>
                <span>{{ scope.row.weight }}</span>
              </div>
            </template>
          </el-table-column>
        <el-table-column
          prop="bloodSugar"
          label="血糖"
          width="80"
            align="center"
          >
            <template slot-scope="scope">
              <div class="blood-cell">
                <i class="el-icon-sugar"></i>
                <span>{{ scope.row.bloodSugar }}</span>
              </div>
            </template>
          </el-table-column>
        <el-table-column
          prop="bloodPressure"
          label="血压"
          width="80"
            align="center"
          >
            <template slot-scope="scope">
              <div class="blood-cell">
                <i class="el-icon-warning-outline"></i>
                <span>{{ scope.row.bloodPressure }}</span>
              </div>
            </template>
          </el-table-column>
        <el-table-column
          prop="bloodLipid"
          label="血脂"
          width="80"
            align="center"
          >
            <template slot-scope="scope">
              <div class="blood-cell">
                <i class="el-icon-warning-outline"></i>
                <span>{{ scope.row.bloodLipid }}</span>
              </div>
            </template>
          </el-table-column>
        <el-table-column
          prop="heartRate"
          label="心率/分钟"
            width="100"
            align="center"
          >
            <template slot-scope="scope">
              <div class="heart-cell">
                <i class="el-icon-bangzhu"></i>
                <span>{{ scope.row.heartRate }}</span>
              </div>
            </template>
          </el-table-column>
        <el-table-column
          prop="vision"
          label="视力"
          width="80"
            align="center"
          >
            <template slot-scope="scope">
              <div class="vision-cell">
                <i class="el-icon-view"></i>
                <span>{{ scope.row.vision }}</span>
              </div>
            </template>
          </el-table-column>
        <el-table-column
          prop="sleepDuration"
          label="睡眠时长"
            width="100"
            align="center"
          >
            <template slot-scope="scope">
              <div class="sleep-cell">
                <i class="el-icon-moon"></i>
                <span>{{ scope.row.sleepDuration }}</span>
              </div>
            </template>
          </el-table-column>
        <el-table-column
          prop="sleepQuality"
          label="睡眠质量"
            width="100"
            align="center"
          >
            <template slot-scope="scope">
              <div class="sleep-cell">
                <i class="el-icon-star-on"></i>
                <span>{{ scope.row.sleepQuality }}</span>
              </div>
            </template>
          </el-table-column>
        <el-table-column
            prop="smoking" 
            label="是否抽烟" 
            width="100"
            align="center"
          >
            <template slot-scope="scope">
              <el-tag :type="scope.row.smoking ? 'danger' : 'success'" size="small">
                {{ scope.row.smoking ? '是' : '否' }}
              </el-tag>
            </template>
          </el-table-column>
        <el-table-column
            prop="drinking" 
            label="是否喝酒" 
            width="100"
            align="center"
          >
          <template slot-scope="scope">
              <el-tag :type="scope.row.drinking ? 'warning' : 'success'" size="small">
                {{ scope.row.drinking ? '是' : '否' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column 
            prop="exercise" 
            label="是否运动" 
            width="100"
            align="center"
          >
          <template slot-scope="scope">
              <el-tag :type="scope.row.exercise ? 'success' : 'info'" size="small">
                {{ scope.row.exercise ? '是' : '否' }}
              </el-tag>
            </template>
          </el-table-column>
        <el-table-column
          prop="foodTypes"
          label="喜好食物"
            width="100"
            align="center"
          >
            <template slot-scope="scope">
              <div class="food-cell">
                <i class="el-icon-food"></i>
                <span>{{ scope.row.foodTypes }}</span>
              </div>
            </template>
          </el-table-column>
        <el-table-column
          prop="waterConsumption"
          label="饮水量"
            width="100"
            align="center"
          >
            <template slot-scope="scope">
              <div class="water-cell">
                <i class="el-icon-goblet-full"></i>
                <span>{{ scope.row.waterConsumption }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column 
            label="操作" 
            width="200"
            align="center"
            fixed="right"
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
              @click="deleteBody(scope.row)"
              type="danger"
              icon="el-icon-delete"
                  size="small"
                  class="delete-btn"
                >删除</el-button>
              </div>
          </template>
        </el-table-column>
      </el-table>
      </div>

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

    <!-- 用户身体信息编辑弹出框 -->
    <el-dialog
      @close="clearForm"
      :title="title"
      :visible.sync="dialogFormVisible"
      width="700px"
      :close-on-click-modal="false"
      center
      class="body-dialog"
    >
      <div class="dialog-content">
        <el-form :model="bodyForm" ref="bodyFormRef" label-width="100px">
          <div class="form-row">
            <el-form-item label="昵称" prop="name">
              <el-input v-model="bodyForm.name" placeholder="请输入昵称">
                <i slot="prefix" class="el-icon-user"></i>
              </el-input>
        </el-form-item>

            <el-form-item label="年龄" prop="age">
              <el-input v-model="bodyForm.age" placeholder="请输入年龄">
                <i slot="prefix" class="el-icon-time"></i>
              </el-input>
        </el-form-item>
          </div>

          <div class="form-row">
            <el-form-item label="性别" prop="gender">
              <el-radio-group v-model="bodyForm.gender">
                <el-radio label="男">男</el-radio>
                <el-radio label="女">女</el-radio>
              </el-radio-group>
        </el-form-item>

            <el-form-item label="身高/cm" prop="height">
              <el-input v-model="bodyForm.height" placeholder="请输入身高">
                <i slot="prefix" class="el-icon-top"></i>
              </el-input>
        </el-form-item>
          </div>

          <div class="form-row">
            <el-form-item label="体重/kg" prop="weight">
              <el-input v-model="bodyForm.weight" placeholder="请输入体重">
                <i slot="prefix" class="el-icon-bottom"></i>
              </el-input>
        </el-form-item>

            <el-form-item label="血糖" prop="bloodSugar">
              <el-input v-model="bodyForm.bloodSugar" placeholder="请输入血糖">
                <i slot="prefix" class="el-icon-warning-outline"></i>
              </el-input>
        </el-form-item>
          </div>

          <div class="form-row">
            <el-form-item label="血压" prop="bloodPressure">
              <el-input v-model="bodyForm.bloodPressure" placeholder="请输入血压">
                <i slot="prefix" class="el-icon-warning-outline"></i>
              </el-input>
        </el-form-item>

            <el-form-item label="血脂" prop="bloodLipid">
              <el-input v-model="bodyForm.bloodLipid" placeholder="请输入血脂">
                <i slot="prefix" class="el-icon-warning-outline"></i>
              </el-input>
        </el-form-item>
          </div>

          <div class="form-row">
            <el-form-item label="心率/分钟" prop="heartRate">
              <el-input v-model="bodyForm.heartRate" placeholder="请输入心率">
                <i slot="prefix" class="el-icon-bangzhu"></i>
              </el-input>
        </el-form-item>

            <el-form-item label="视力" prop="vision">
              <el-input v-model="bodyForm.vision" placeholder="请输入视力">
                <i slot="prefix" class="el-icon-view"></i>
              </el-input>
        </el-form-item>
          </div>

          <div class="form-row">
            <el-form-item label="睡眠时长/h" prop="sleepDuration">
              <el-input v-model="bodyForm.sleepDuration" placeholder="请输入睡眠时长">
                <i slot="prefix" class="el-icon-moon"></i>
              </el-input>
        </el-form-item>

            <el-form-item label="睡眠质量" prop="sleepQuality">
          <el-radio-group v-model="bodyForm.sleepQuality">
                <el-radio label="好">好</el-radio>
                <el-radio label="一般">一般</el-radio>
                <el-radio label="差">差</el-radio>
          </el-radio-group>
        </el-form-item>
          </div>

          <div class="form-row">
            <el-form-item label="是否吸烟" prop="smoking">
              <el-switch v-model="bodyForm.smoking"></el-switch>
        </el-form-item>

            <el-form-item label="是否喝酒" prop="drinking">
              <el-switch v-model="bodyForm.drinking"></el-switch>
        </el-form-item>
          </div>

          <div class="form-row">
            <el-form-item label="是否运动" prop="exercise">
          <el-switch v-model="bodyForm.exercise"></el-switch>
        </el-form-item>

            <el-form-item label="喜好食物" prop="foodTypes">
              <el-select v-model="bodyForm.foodTypes" placeholder="请选择摄入较多的食物种类">
            <el-option label="蔬菜" value="蔬菜"></el-option>
            <el-option label="水果" value="水果"></el-option>
            <el-option label="肉类" value="肉类"></el-option>
            <el-option label="鱼类" value="鱼类"></el-option>
            <el-option label="豆类" value="豆类"></el-option>
            <el-option label="谷物" value="谷物"></el-option>
          </el-select>
        </el-form-item>
          </div>

          <div class="form-row">
            <el-form-item label="饮水量/ml" prop="waterConsumption">
              <el-input v-model="bodyForm.waterConsumption" placeholder="请输入饮水量">
                <i slot="prefix" class="el-icon-goblet-full"></i>
              </el-input>
        </el-form-item>
          </div>
      </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" class="cancel-btn">取 消</el-button>
        <el-button type="primary" @click="updateBody" class="confirm-btn">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import userApi from "@/api/userManage";
export default {
  data() {
    return {
      bodyForm: {}, //初始化为一个空对象
      bodyList: [],
      //左边宽度
      formLabelWidth: "135px",
      //设置默认值不可见
      dialogFormVisible: false,
      title: "",
      total: 0,
      searchModel: {
        pageNo: 1,
        // 默认显示数量
        pageSize: 10,
      },
      //表单规则配置

      rules: {
        bodyType: [
          { required: true, message: "请输入运动类型", trigger: "blur" },
        ],
      },
    };
  },

  methods: {
    updateBody() {
      let isOk = true;
      //触发表单的验证
      this.$refs.bodyFormRef.validate((valid) => {
        // 这边只有校验失败的时候才会进来,在外面定义一个 isok,校验失败会将他改成 false
        isOk = valid;
      });

      if (isOk) {
        //提交验证给后台
        userApi.updateBody(this.bodyForm).then((response) => {
          //成功提示
          this.$message({
            message: response.message,
            type: "success",
          });
          //关闭对话框
          this.dialogFormVisible = false;
          //刷新表格数据
          this.getBodyList();
        });
      } else {
        console.log("error submit!!");
        return false;
      }
    },

    //清理表单数据
    clearForm() {
      this.bodyForm = {};
      //清除表单校验的提示信息
      this.$refs.bodyFormRef.clearValidate();
    },
    handleSizeChange(pageSize) {
      //数据更新
      this.searchModel.pageSize = pageSize;
      this.getBodyList();
    },
    handleCurrentChange(pageNo) {
      this.searchModel.pageNo = pageNo;
      this.getBodyList();
    },

    //用于查询用户列表
    getBodyList() {
      userApi.getBodyList(this.searchModel).then((response) => {
        console.log(response);

        this.bodyList = response.data.rows;
        // 将查询结果中的 total 属性赋值给 total
        this.total = response.data.total;
        console.log(this.bodyList);
      });
    },

    openEditUi(id) {
      this.title = "修改身体信息";
      //根据id查询用户数据
      userApi.getBodyById(id).then((response) => {
        this.bodyForm = response.data;
      });

      this.dialogFormVisible = true;
    },

    deleteBody(body) {
      this.$confirm(`确认删除 ${body.name} 这个身体信息吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          userApi.deleteBodyById(body.id).then((response) => {
            this.$message({
              type: "success",
              message: response.message,
            });
            this.getBodyList();
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

  //加载时就查询一次
  created() {
    this.getBodyList();
    console.log(this.bodyList);
  },
};
</script>
<style scoped>
.body-container {
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
  width: 100%;
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
  width: 100%;
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

.table-scroll-container {
  width: 100%;
  overflow-x: auto;
}

.body-table {
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;
  min-width: 100%;
}

.body-table >>> .el-table__header-wrapper th {
  background-color: #f0f5ff !important;
  color: #1976D2;
  font-weight: 600;
  padding: 12px 0;
}

.body-table >>> .el-table__row {
  transition: all 0.3s;
}

.body-table >>> .el-table__row:hover {
  background-color: #f0f5ff !important;
}

.name-cell,
.age-cell,
.gender-cell,
.height-cell,
.weight-cell,
.blood-cell,
.heart-cell,
.vision-cell,
.sleep-cell,
.food-cell,
.water-cell {
  display: flex;
  align-items: center;
  justify-content: center;
}

.name-cell i,
.age-cell i,
.gender-cell i,
.height-cell i,
.weight-cell i,
.blood-cell i,
.heart-cell i,
.vision-cell i,
.sleep-cell i,
.food-cell i,
.water-cell i {
  margin-right: 5px;
  color: #1976D2;
}

.gender-cell i.el-icon-male {
  color: #409EFF;
}

.gender-cell i.el-icon-female {
  color: #F56C6C;
}

.blood-cell i {
  color: #F56C6C;
}

.heart-cell i {
  color: #E6A23C;
}

.operation-cell {
  display: flex;
  justify-content: space-around;
  gap: 15px;
}

.edit-btn,
.delete-btn {
  padding: 6px 15px;
  border-radius: 4px;
  min-width: 80px;
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
.body-dialog >>> .el-dialog__header {
  background-color: #1976D2;
  padding: 15px 20px;
  border-radius: 8px 8px 0 0;
}

.body-dialog >>> .el-dialog__title {
  font-size: 18px;
  font-weight: bold;
  color: #ffffff;
}

.body-dialog >>> .el-dialog__headerbtn .el-dialog__close {
  color: #ffffff;
}

.dialog-content {
  padding: 20px 0;
}

.form-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.form-row .el-form-item {
  width: 48%;
  margin-right: 0;
}

.el-form-item >>> .el-input__inner {
  border-radius: 4px;
  padding-left: 35px;
}

.el-form-item >>> .el-input__prefix {
  left: 10px;
  color: #1976D2;
}

.el-form-item >>> .el-select {
  width: 100%;
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