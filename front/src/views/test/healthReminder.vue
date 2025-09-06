<!-- eslint-disable -->
<template>
  <div class="app-container">
    <!-- 页面标题区域 -->
    <div class="page-header">
      <div class="header-title">
        <i class="el-icon-bell"></i>
        <h2>健康提醒管理</h2>
      </div>
      <div class="header-desc">管理您的健康提醒，不错过每一个健康时刻</div>
    </div>

    <!-- 过滤器区域 -->
    <div class="filter-container">
      <el-input
        v-model="searchModel.keyword"
        placeholder="搜索标题或内容"
        style="width: 220px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
        clearable
        prefix-icon="el-icon-search"
      >
      </el-input>
      <el-select v-model="searchModel.type" placeholder="提醒类型" clearable style="width: 150px" class="filter-item">
        <el-option label="全部" :value="null" />
        <el-option label="血压" value="血压">
          <i class="el-icon-first-aid-kit"></i> 血压
        </el-option>
        <el-option label="运动" value="运动">
          <i class="el-icon-stopwatch"></i> 运动
        </el-option>
        <el-option label="体检" value="体检">
          <i class="el-icon-user"></i> 体检
        </el-option>
        <el-option label="饮食" value="饮食">
          <i class="el-icon-dish"></i> 饮食
        </el-option>
        <el-option label="用药" value="用药">
          <i class="el-icon-medicine-box"></i> 用药
        </el-option>
        <el-option label="其他" value="其他">
          <i class="el-icon-more"></i> 其他
        </el-option>
      </el-select>
      <el-select v-model="searchModel.priority" placeholder="优先级" clearable style="width: 120px" class="filter-item">
        <el-option label="全部" :value="null" />
        <el-option label="高" value="high">
          <i class="el-icon-warning" style="color: #F56C6C;"></i> 高
        </el-option>
        <el-option label="中" value="normal">
          <i class="el-icon-info" style="color: #409EFF;"></i> 中
        </el-option>
        <el-option label="低" value="low">
          <i class="el-icon-info" style="color: #909399;"></i> 低
        </el-option>
      </el-select>
      <el-select v-model="searchModel.isRead" placeholder="是否已读" clearable style="width: 120px" class="filter-item">
        <el-option label="全部" :value="null" />
        <el-option label="已读" :value="true">
          <i class="el-icon-check"></i> 已读
        </el-option>
        <el-option label="未读" :value="false">
          <i class="el-icon-message"></i> 未读
        </el-option>
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" type="info" icon="el-icon-refresh" @click="resetSearch">
        重置
      </el-button>
      <el-button class="filter-item add-btn" type="success" icon="el-icon-plus" @click="handleCreate">
        添加提醒
      </el-button>
    </div>

    <!-- 添加加载状态 -->
    <div v-if="loading" class="loading-container">
      <i class="el-icon-loading" style="font-size: 30px;"></i>
      <p>正在加载健康提醒数据...</p>
    </div>
    
    <!-- 添加空状态 -->
    <div v-else-if="tableData.length === 0" class="empty-state">
      <i class="el-icon-bell"></i>
      <p>暂无健康提醒</p>
      <el-button type="primary" icon="el-icon-plus" @click="handleCreate">创建第一条提醒</el-button>
    </div>

    <!-- 提醒卡片视图 -->
    <div class="reminder-cards" v-if="!loading && tableData.length > 0 && viewMode === 'card'">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="item in tableData" :key="item.reminderId">
          <el-card 
            :class="['reminder-card', {'high-priority': item.priority === 'high', 'unread': !item.isRead}]"
            shadow="hover"
          >
            <div slot="header" class="clearfix">
              <span class="card-title">{{ item.title }}</span>
              <el-tag size="mini" :type="item.priority === 'high' ? 'danger' : item.priority === 'normal' ? 'primary' : 'info'" class="priority-tag">
                <i :class="item.priority === 'high' ? 'el-icon-warning' : item.priority === 'normal' ? 'el-icon-info' : 'el-icon-info'"></i>
                {{ item.priority === 'high' ? '高' : item.priority === 'normal' ? '中' : '低' }}
              </el-tag>
              <el-tag size="mini" :type="item.isRead ? 'info' : 'success'" class="status-tag">
                <i :class="item.isRead ? 'el-icon-check' : 'el-icon-message'"></i>
                {{ item.isRead ? '已读' : '未读' }}
              </el-tag>
            </div>
            <div class="card-content">
              <p class="content-text">{{ item.content }}</p>
              <p class="type-text">
                <i :class="{
                  'el-icon-first-aid-kit': item.type === '血压',
                  'el-icon-stopwatch': item.type === '运动',
                  'el-icon-user': item.type === '体检',
                  'el-icon-dish': item.type === '饮食',
                  'el-icon-medicine-box': item.type === '用药',
                  'el-icon-more': item.type === '其他'
                }"></i>
                {{ item.type }}
              </p>
              <p class="time-text"><i class="el-icon-time"></i> {{ formatDate(item.reminderTime) }}</p>
            </div>
            <div class="card-actions">
              <el-button v-if="!item.isRead" size="mini" type="success" icon="el-icon-check" @click="handleMarkAsRead(item)">已读</el-button>
              <el-button size="mini" type="primary" icon="el-icon-edit" @click="handleUpdate(item)">编辑</el-button>
              <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(item)">删除</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 表格视图 -->
    <div class="reminder-table" v-if="!loading && tableData.length > 0 && viewMode === 'table'">
      <el-table
        :data="tableData"
        style="width: 100%"
        border
        row-key="reminderId"
        :row-class-name="tableRowClassName"
      >
        <el-table-column
          type="index"
          label="序号"
          width="60"
          align="center"
        />
        <el-table-column
          prop="title"
          label="标题"
          min-width="180"
        />
        <el-table-column
          prop="content"
          label="内容"
          min-width="250"
          show-overflow-tooltip
        />
        <el-table-column
          prop="type"
          label="类型"
          width="100"
          align="center"
        >
          <template slot-scope="scope">
            <el-tag 
              :type="
                scope.row.type === '血压' ? 'danger' : 
                scope.row.type === '运动' ? 'success' : 
                scope.row.type === '体检' ? 'primary' : 
                scope.row.type === '饮食' ? 'warning' : 
                scope.row.type === '用药' ? 'info' : 'info'
              "
              size="small"
            >
              {{ scope.row.type }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="priority"
          label="优先级"
          width="100"
          align="center"
        >
          <template slot-scope="scope">
            <el-tag :type="scope.row.priority === 'high' ? 'danger' : scope.row.priority === 'normal' ? 'primary' : 'info'" size="small">
              {{ scope.row.priority === 'high' ? '高' : scope.row.priority === 'normal' ? '中' : '低' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="reminderTime"
          label="提醒时间"
          width="180"
          align="center"
        >
          <template slot-scope="scope">
            {{ formatDate(scope.row.reminderTime) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="isRead"
          label="状态"
          width="100"
          align="center"
        >
          <template slot-scope="scope">
            <el-tag :type="scope.row.isRead ? 'info' : 'success'" size="small">
              {{ scope.row.isRead ? '已读' : '未读' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="240"
          align="center"
          fixed="right"
        >
          <template slot-scope="scope">
            <div class="operation-buttons">
              <el-button
                v-if="!scope.row.isRead"
                size="mini"
                type="success"
                icon="el-icon-check"
                @click="handleMarkAsRead(scope.row)"
              >
                已读
              </el-button>
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
              >
                编辑
              </el-button>
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
              >
                删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 视图切换和分页 -->
    <div class="pagination-container" v-if="!loading && tableData.length > 0">
      <el-button-group class="view-toggle">
        <el-tooltip content="表格视图" placement="top">
          <el-button :type="viewMode === 'table' ? 'primary' : 'default'" icon="el-icon-menu" @click="viewMode = 'table'"></el-button>
        </el-tooltip>
        <el-tooltip content="卡片视图" placement="top">
          <el-button :type="viewMode === 'card' ? 'primary' : 'default'" icon="el-icon-s-grid" @click="viewMode = 'card'"></el-button>
        </el-tooltip>
      </el-button-group>
      
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="searchModel.pageNo"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="searchModel.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>

    <!-- 添加/编辑对话框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="500px" :close-on-click-modal="false" center>
      <el-form :model="temp" label-width="100px" label-position="right" ref="reminderForm" :rules="rules">
        <el-form-item label="标题" prop="title">
          <el-input v-model="temp.title" placeholder="请输入提醒标题"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input type="textarea" v-model="temp.content" :rows="4" placeholder="请输入提醒内容"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="temp.type" placeholder="请选择提醒类型" style="width: 100%">
            <el-option label="血压" value="血压">
              <i class="el-icon-first-aid-kit"></i> 血压
            </el-option>
            <el-option label="运动" value="运动">
              <i class="el-icon-stopwatch"></i> 运动
            </el-option>
            <el-option label="体检" value="体检">
              <i class="el-icon-user"></i> 体检
            </el-option>
            <el-option label="饮食" value="饮食">
              <i class="el-icon-dish"></i> 饮食
            </el-option>
            <el-option label="用药" value="用药">
              <i class="el-icon-medicine-box"></i> 用药
            </el-option>
            <el-option label="其他" value="其他">
              <i class="el-icon-more"></i> 其他
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="优先级" prop="priority">
          <el-radio-group v-model="temp.priority">
            <el-radio label="high">
              <i class="el-icon-warning" style="color: #F56C6C;"></i> 高
            </el-radio>
            <el-radio label="normal">
              <i class="el-icon-info" style="color: #409EFF;"></i> 中
            </el-radio>
            <el-radio label="low">
              <i class="el-icon-info" style="color: #909399;"></i> 低
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="提醒时间" prop="reminderTime">
          <el-date-picker
            v-model="temp.reminderTime"
            type="datetime"
            placeholder="选择日期时间"
            style="width: 100%"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveData">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import reminderManage from '@/api/reminderManage'

export default {
  name: 'HealthReminder',
  data() {
    return {
      tableData: [],
      total: 0,
      searchModel: {
        pageNo: 1,
        pageSize: 10,
        keyword: '',
        type: null,
        priority: null,
        isRead: null
      },
      dialogVisible: false,
      dialogTitle: '',
      temp: {
        reminderId: null,
        title: '',
        content: '',
        type: '',
        priority: 'normal',
        reminderTime: new Date(),
        isRead: false
      },
      viewMode: localStorage.getItem('healthReminderViewMode') || 'card',
      checkInterval: null,
      loading: false,
      rules: {
        title: [
          { required: true, message: '请输入提醒标题', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入提醒内容', trigger: 'blur' },
          { min: 2, max: 500, message: '长度在 2 到 500 个字符', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择提醒类型', trigger: 'change' }
        ],
        priority: [
          { required: true, message: '请选择优先级', trigger: 'change' }
        ],
        reminderTime: [
          { required: true, message: '请选择提醒时间', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.fetchData()
  },
  mounted() {
    this.fetchData()
    this.checkInterval = setInterval(() => {
      this.fetchData()
    }, 600000)
  },
  beforeDestroy() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval)
    }
  },
  methods: {
    tableRowClassName({row}) {
      if (row.priority === 'high' && !row.isRead) {
        return 'high-priority-unread-row'
      } else if (row.priority === 'high') {
        return 'high-priority-row'
      } else if (!row.isRead) {
        return 'unread-row'
      }
      return ''
    },
    fetchData() {
      this.loading = true;
      reminderManage.getReminderList(this.searchModel).then(response => {
        this.tableData = response.data.rows
        this.total = response.data.total
        this.loading = false;
        
        this.$nextTick(() => {
          this.checkDueReminders()
        })
      }).catch((error) => {
        this.loading = false;
        this.$message({
          message: '获取提醒列表失败，请稍后再试',
          type: 'error',
          duration: 3000
        })
        console.error('获取提醒列表失败:', error)
      })
    },
    handleFilter() {
      this.searchModel.pageNo = 1
      this.fetchData()
    },
    handleSizeChange(val) {
      this.searchModel.pageSize = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.searchModel.pageNo = val
      this.fetchData()
    },
    handleCreate() {
      this.resetTemp()
      this.dialogTitle = '添加健康提醒'
      this.dialogVisible = true
      this.$nextTick(() => {
        if (this.$refs.reminderForm) {
          this.$refs.reminderForm.clearValidate()
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row)
      this.dialogTitle = '编辑健康提醒'
      this.dialogVisible = true
      this.$nextTick(() => {
        if (this.$refs.reminderForm) {
          this.$refs.reminderForm.clearValidate()
        }
      })
    },
    handleMarkAsRead(row) {
      this.loading = true
      reminderManage.markAsRead(row.reminderId).then(() => {
        this.$message({
          message: '标记成功',
          type: 'success',
          duration: 1500
        })
        this.fetchData()
      }).catch((error) => {
        this.loading = false
        this.$message({
          message: '标记失败，请稍后再试',
          type: 'error',
          duration: 3000
        })
        console.error('标记失败:', error)
      })
    },
    handleDelete(row) {
      this.$confirm(`确认删除"${row.title}"提醒?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        reminderManage.deleteReminder(row.reminderId).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!',
            duration: 1500
          })
          this.fetchData()
        }).catch((error) => {
          this.loading = false
          this.$message({
            message: '删除失败，请稍后再试',
            type: 'error',
            duration: 3000
          })
          console.error('删除失败:', error)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除',
          duration: 1500
        })
      })
    },
    resetTemp() {
      this.temp = {
        reminderId: null,
        title: '',
        content: '',
        type: '',
        priority: 'normal',
        reminderTime: new Date(),
        isRead: false
      }
    },
    saveData() {
      this.$refs.reminderForm.validate((valid) => {
        if (!valid) {
          return false
        }
        
        this.loading = true
        if (this.temp.reminderId) {
          reminderManage.updateReminder(this.temp).then(() => {
            this.dialogVisible = false
            this.$message({
              message: '更新成功',
              type: 'success',
              duration: 1500
            })
            this.fetchData()
          }).catch((error) => {
            this.loading = false
            this.$message({
              message: '更新失败，请稍后再试',
              type: 'error',
              duration: 3000
            })
            console.error('更新失败:', error)
          })
        } else {
          reminderManage.addReminder(this.temp).then(() => {
            this.dialogVisible = false
            this.$message({
              message: '添加成功',
              type: 'success',
              duration: 1500
            })
            this.fetchData()
          }).catch((error) => {
            this.loading = false
            this.$message({
              message: '添加失败，请稍后再试',
              type: 'error',
              duration: 3000
            })
            console.error('添加失败:', error)
          })
        }
      })
    },
    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
    },
    checkDueReminders() {
      const now = new Date()
      const dueReminders = this.tableData.filter(item => {
        if (item.isRead) return false
        const reminderTime = new Date(item.reminderTime)
        return reminderTime <= now
      })
      
      if (dueReminders.length > 0) {
        this.$notify({
          title: '健康提醒',
          message: `您有 ${dueReminders.length} 条未读的健康提醒需要关注`,
          type: 'warning',
          duration: 5000,
          position: 'top-right'
        })
      }
    },
    resetSearch() {
      this.searchModel = {
        pageNo: 1,
        pageSize: 10,
        keyword: '',
        type: null,
        priority: null,
        isRead: null
      };
      this.fetchData();
    }
  },
  watch: {
    viewMode(val) {
      localStorage.setItem('healthReminderViewMode', val);
    }
  }
}
</script>

<style scoped>
/* 整体容器样式 */
.app-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 120px);
  border-radius: 8px;
}

/* 页面标题区域 */
.page-header {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
}

.header-title {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.header-title i {
  font-size: 24px;
  color: #409EFF;
  margin-right: 10px;
}

.header-title h2 {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

.header-desc {
  color: #909399;
  font-size: 14px;
  padding-left: 34px;
}

.add-btn {
  margin-left: auto !important;
}

/* 过滤器容器样式 */
.filter-container {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.filter-item {
  margin-right: 10px;
  margin-bottom: 10px;
}

/* 卡片视图样式 */
.reminder-cards {
  margin-bottom: 20px;
}

.reminder-card {
  height: 100%;
  margin-bottom: 20px;
  transition: all 0.3s;
  border-radius: 12px;
  overflow: hidden;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.reminder-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.high-priority {
  border-left: 4px solid #F56C6C;
}

.unread {
  background-color: #f8f8f8;
}

.card-title {
  font-weight: 600;
  font-size: 16px;
  margin-right: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 70%;
  display: inline-block;
  color: #303133;
}

.priority-tag, .status-tag {
  margin-left: 5px;
  float: right;
  border-radius: 12px;
  padding: 2px 8px;
}

.card-content {
  margin-bottom: 15px;
  padding: 5px 0;
}

.content-text {
  margin-bottom: 15px;
  line-height: 1.6;
  color: #606266;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.type-text, .time-text {
  color: #909399;
  font-size: 13px;
  margin: 8px 0;
  display: flex;
  align-items: center;
}

.type-text i, .time-text i {
  margin-right: 5px;
  font-size: 15px;
  color: #409EFF;
}

.card-actions {
  display: flex;
  justify-content: flex-end;
  flex-wrap: nowrap;
  border-top: 1px solid #f0f0f0;
  padding-top: 12px;
  margin-top: 5px;
}

.card-actions .el-button {
  margin: 0 3px;
  padding: 7px 10px;
  border-radius: 20px;
}

/* 表格样式优化 */
.reminder-table {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  padding: 20px;
  margin-bottom: 20px;
}

/deep/ .el-table {
  border-radius: 8px;
  overflow: hidden;
}

/deep/ .el-table th {
  background-color: #f5f7fa;
  color: #606266;
  font-weight: 600;
  padding: 12px 0;
}

/deep/ .high-priority-row {
  background-color: #FEF0F0;
}

/deep/ .unread-row {
  background-color: #F2F6FC;
}

/deep/ .high-priority-unread-row {
  background-color: #FDEAEA;
  font-weight: bold;
}

/* 操作按钮样式优化 */
.operation-buttons {
  display: flex;
  justify-content: center;
  flex-wrap: nowrap;
}

.operation-buttons .el-button {
  padding: 7px 12px;
  border-radius: 20px;
}

.operation-buttons .el-button + .el-button {
  margin-left: 8px;
}

/* 添加空状态样式 */
.empty-state {
  text-align: center;
  padding: 60px 0;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
  color: #909399;
}

.empty-state i {
  font-size: 80px;
  margin-bottom: 20px;
  color: #DCDFE6;
}

.empty-state p {
  font-size: 18px;
  margin-bottom: 20px;
  color: #606266;
}

.empty-state .el-button {
  padding: 10px 25px;
  border-radius: 20px;
}

/* 添加加载状态 */
.loading-container {
  text-align: center;
  padding: 60px 0;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
}

.loading-container p {
  margin-top: 15px;
  color: #606266;
}

/* 分页容器 */
.pagination-container {
  background-color: #fff;
  padding: 15px 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.view-toggle {
  margin-right: 20px;
}

.view-toggle .el-button {
  border-radius: 4px;
}

/deep/ .el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #409EFF;
  color: #fff;
}

/deep/ .el-pagination.is-background .el-pager li {
  margin: 0 3px;
  border-radius: 4px;
}

/* 对话框样式优化 */
/deep/ .el-dialog {
  border-radius: 8px;
  overflow: hidden;
}

/deep/ .el-dialog__header {
  background-color: #f5f7fa;
  padding: 15px 20px;
  border-bottom: 1px solid #EBEEF5;
}

/deep/ .el-dialog__title {
  font-weight: 600;
  color: #303133;
  font-size: 16px;
}

/deep/ .el-dialog__body {
  padding: 20px;
}

/deep/ .el-dialog__footer {
  border-top: 1px solid #EBEEF5;
  padding: 15px 20px;
}

/deep/ .el-form-item__label {
  font-weight: 500;
}

.dialog-footer {
  text-align: right;
}

.dialog-footer .el-button {
  padding: 9px 20px;
  border-radius: 4px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .filter-container {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-item {
    margin-right: 0;
    width: 100% !important;
  }
  
  .pagination-container {
    flex-direction: column;
    gap: 10px;
  }
  
  .view-toggle {
    margin-right: 0;
    margin-bottom: 10px;
  }
}
</style> 