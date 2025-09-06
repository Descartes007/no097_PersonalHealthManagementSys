<!-- 搜索框和添加按钮，搜索框，以及用户名和手机号的输入框 -->
<template>
  <div class="sport-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <div class="search-header">
        <div class="search-title">
          <i class="el-icon-data-analysis"></i>
          <span>运动知识查询</span>
        </div>
      </div>
      <div class="search-content">
        <el-input
          v-model="searchModel.sportType"
          placeholder="请输入运动类型"
          prefix-icon="el-icon-bicycle"
          clearable
          class="search-input"
        ></el-input>
        <el-button
          @click="getSportList"
          type="primary"
          icon="el-icon-search"
          class="search-btn"
        >查询</el-button>
      </div>
    </div>

    <!-- 运动知识列表区域 -->
    <div class="table-container">
      <div class="table-header">
        <div class="table-title">
          <i class="el-icon-data-line"></i>
          <span>运动知识列表</span>
          <span class="table-count">共 {{ total }} 条记录</span>
        </div>
        <el-button
          @click="openEditUi(null)"
          type="primary"
          icon="el-icon-plus"
          class="add-btn"
        >新增运动</el-button>
      </div>
      <el-table 
        :data="sportList" 
        stripe 
        border
        highlight-current-row
        class="sport-table"
      >
        <el-table-column
          type="index"
          label="序号"
          width="70"
          align="center"
        ></el-table-column>
        <el-table-column 
          prop="id" 
          label="ID" 
          width="70"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="sportType"
          label="运动类型"
          min-width="120"
          align="center"
        >
          <template slot-scope="scope">
            <div class="sport-type-cell">
              <i class="el-icon-trophy"></i>
              <span>{{ scope.row.sportType }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="suitableFrequency"
          label="运动频率"
          min-width="120"
          align="center"
        >
          <template slot-scope="scope">
            <div class="frequency-cell">
              <i class="el-icon-date"></i>
              <span>{{ scope.row.suitableFrequency }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column 
          prop="suitableTime" 
          label="运动时间"
          min-width="120"
          align="center"
        >
          <template slot-scope="scope">
            <div class="time-cell">
              <i class="el-icon-timer"></i>
              <span>{{ scope.row.suitableTime }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column 
          prop="recommendedSpeed" 
          label="运动速度"
          min-width="120"
          align="center"
        >
          <template slot-scope="scope">
            <div class="speed-cell">
              <i class="el-icon-odometer"></i>
              <span>{{ scope.row.recommendedSpeed }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column 
          prop="suitableHeartRate" 
          label="运动心率"
          min-width="120"
          align="center"
        >
          <template slot-scope="scope">
            <div class="heart-rate-cell">
              <i class="el-icon-bangzhu"></i>
              <span>{{ scope.row.suitableHeartRate }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column 
          label="操作" 
          width="180"
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
                @click="deleteSport(scope.row)"
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

    <!-- 运动知识编辑信息弹出框 -->
    <el-dialog
      @close="clearForm" 
      :title="title" 
      :visible.sync="dialogFormVisible"
      width="550px"
      :close-on-click-modal="false"
      center
      class="sport-dialog"
    >
      <div class="dialog-content">
        <el-form :model="sportForm" ref="sportFormRef" label-width="100px">
          <el-form-item label="运动类型" prop="sportType">
            <el-input v-model="sportForm.sportType" placeholder="请输入运动类型">
              <i slot="prefix" class="el-icon-trophy"></i>
            </el-input>
        </el-form-item>

          <el-form-item label="运动频率" prop="suitableFrequency">
            <el-input v-model="sportForm.suitableFrequency" placeholder="请输入运动频率">
              <i slot="prefix" class="el-icon-date"></i>
            </el-input>
        </el-form-item>

          <el-form-item label="运动时间" prop="suitableTime">
            <el-input v-model="sportForm.suitableTime" placeholder="请输入运动时间">
              <i slot="prefix" class="el-icon-timer"></i>
            </el-input>
        </el-form-item>

          <el-form-item label="运动速度" prop="recommendedSpeed">
            <el-input v-model="sportForm.recommendedSpeed" placeholder="请输入运动速度">
              <i slot="prefix" class="el-icon-odometer"></i>
            </el-input>
        </el-form-item>

          <el-form-item label="运动心率" prop="suitableHeartRate">
            <el-input v-model="sportForm.suitableHeartRate" placeholder="请输入运动心率">
              <i slot="prefix" class="el-icon-bangzhu"></i>
            </el-input>
        </el-form-item>
      </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" class="cancel-btn">取 消</el-button>
        <el-button type="primary" @click="saveSport" class="confirm-btn">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import sportApi from "@/api/Function_Menu";
export default {
  data() {

    return {
      sportForm: {}, //初始化为一个空对象
      sportList: [],
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
        sportType: [
          { required: true, message: "请输入运动类型", trigger: "blur" }
        ]
      },
    };
  },

  methods: {
    saveSport() {
      let isOk = true;
      //触发表单的验证
      this.$refs.sportFormRef.validate((valid) => {
        // 这边只有校验失败的时候才会进来,在外面定义一个 isok,校验失败会将他改成 false
        isOk = valid;
      });

      if (isOk) {
        //提交验证给后台
        const newSportType = this.sportForm.sportType
        sportApi.saveSport({
          ...this.sportForm,
          oldSportType: this.oldSportType
        }).then((response) => {
          sportApi.getDetailList({
            sportType: this.oldSportType,
            pageNo: 1,
            pageSize: 10
          }).then((res) => {
            sportApi.updateDetail({
              ...res.data.rows[0],
              sportType: newSportType
            })
          })
          //成功提示
          this.$message({
            message: response.message,
            type: "success",
          });
          //关闭对话框
          this.dialogFormVisible = false;
          //刷新表格数据
          this.getSportList();
        });
      } else {
        console.log("error submit!!");
        return false;
      }
    },

    //清理表单数据
    clearForm() {
      this.sportForm = {
      };
      //清除表单校验的提示信息
      this.$refs.sportFormRef.clearValidate();
    },
    handleSizeChange(pageSize) {
      //数据更新
      this.searchModel.pageSize = pageSize;
      this.getSportList();
    },
    handleCurrentChange(pageNo) {
      this.searchModel.pageNo = pageNo;
      this.getSportList();
    },




    getSportList() {
      sportApi.getSportList(this.searchModel).then((response) => {
        console.log(response)
        // 将查询结果中的 rows 属性赋值给 sportList
        this.sportList = response.data.rows;
        // 将查询结果中的 total 属性赋值给 total
        this.total = response.data.total;
        console.log(this.sportList)
      });
    },



    openEditUi(id) {
      console.log(id)
      if (id == null) {
        this.title = "新增运动信息";
      } else {
        this.title = "修改运动信息";
        //根据id查询用户数据
        sportApi.getSportById(id).then((response) => {
          this.sportForm = response.data;
          console.log(this.sportForm)
        });
      }
      this.dialogFormVisible = true;
    },


    deleteSport(sport) {
      this.$confirm(`确认删除 ${sport.sportType} 这个运动信息吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          sportApi.deleteSportById(sport.id).then((response) => {
            this.$message({
              type: "success",
              message: response.message,
            });
            this.getSportList();
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
    this.getSportList();
  },
};
</script>
<style scoped>
.sport-container {
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

.add-btn {
  border-radius: 20px;
  padding: 10px 20px;
}

.sport-table {
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;
  width: 100%;
}

.sport-table >>> .el-table__header-wrapper th {
  background-color: #f0f5ff !important;
  color: #1976D2;
  font-weight: 600;
  padding: 12px 0;
}

.sport-table >>> .el-table__row {
  transition: all 0.3s;
}

.sport-table >>> .el-table__row:hover {
  background-color: #f0f5ff !important;
}

.sport-type-cell,
.frequency-cell,
.time-cell,
.speed-cell,
.heart-rate-cell {
  display: flex;
  align-items: center;
  justify-content: center;
}

.sport-type-cell i,
.frequency-cell i,
.time-cell i,
.speed-cell i,
.heart-rate-cell i {
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
.sport-dialog >>> .el-dialog__header {
  background-color: #1976D2;
  padding: 15px 20px;
  border-radius: 8px 8px 0 0;
}

.sport-dialog >>> .el-dialog__title {
  font-size: 18px;
  font-weight: bold;
  color: #ffffff;
}

.sport-dialog >>> .el-dialog__headerbtn .el-dialog__close {
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