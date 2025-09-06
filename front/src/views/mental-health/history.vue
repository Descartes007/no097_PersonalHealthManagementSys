<template>
  <div class="app-container">
    <el-card class="box-card" v-loading="loading" shadow="hover">
      <div slot="header" class="clearfix header">
        <div class="title-container">
          <i class="el-icon-time"></i>
          <span class="title">心理健康测试历史记录</span>
        </div>
        <el-button type="text" icon="el-icon-back" @click="$router.push('/mental-health/test')">返回测试</el-button>
      </div>
      
      <div v-if="testHistory && testHistory.length > 0" class="history-container">
        <div class="table-header">
          <div class="filter-container">
            <i class="el-icon-search"></i>
            <span>历史记录</span>
          </div>
        </div>
        
        <el-table
          :data="testHistory"
          style="width: 100%"
          border
          stripe
          :header-cell-style="{background:'#f5f7fa', color:'#606266'}"
          :row-class-name="tableRowClassName">
          <el-table-column
            prop="testDate"
            label="测试日期"
            width="180"
            align="center">
            <template slot-scope="scope">
              <div class="date-cell">
                <i class="el-icon-date"></i>
                <span>{{ formatDate(scope.row.testDate) }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="totalScore"
            label="总分"
            width="120"
            align="center">
            <template slot-scope="scope">
              <div class="score-badge">{{ scope.row.totalScore }}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="depressionLevel"
            label="抑郁程度"
            width="150"
            align="center">
            <template slot-scope="scope">
              <el-tag :type="getTagType(scope.row.depressionLevel)" effect="dark">
                {{ scope.row.depressionLevel }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="recommendation"
            label="建议"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <div class="recommendation-cell">
                <i class="el-icon-info-circle"></i>
                <span>{{ scope.row.recommendation }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="120"
            align="center">
            <template slot-scope="scope">
              <el-button 
                size="mini" 
                type="primary" 
                icon="el-icon-view" 
                circle
                @click="viewResult(scope.row)">
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        
        <div class="pagination-container">
          <el-pagination
            background
            layout="total, prev, pager, next"
            :total="testHistory.length"
            :page-size="10"
            @current-change="handleCurrentChange">
          </el-pagination>
          
          <el-button 
            type="primary" 
            size="small" 
            icon="el-icon-edit-outline"
            @click="$router.push('/mental-health/test')">
            新测试
          </el-button>
        </div>
      </div>
      
      <div v-else-if="!loading" class="empty-container">
        <el-empty description="暂无测试记录">
          <template slot="image">
            <i class="el-icon-files empty-icon"></i>
          </template>
          <el-button type="primary" icon="el-icon-edit-outline" @click="$router.push('/mental-health/test')">开始测试</el-button>
        </el-empty>
      </div>
    </el-card>
    
    <!-- 测试结果详情弹窗 -->
    <el-dialog 
      title="测试结果详情" 
      :visible.sync="dialogVisible" 
      width="60%" 
      top="5vh"
      :close-on-click-modal="false"
      :show-close="true">
      <div v-if="selectedResult" class="dialog-content">
        <div class="dialog-header">
          <div class="dialog-title">
            <i class="el-icon-data-line"></i>
            <span>测试详情</span>
          </div>
          <div class="dialog-date">{{ formatDate(selectedResult.testDate) }}</div>
        </div>
        
        <div class="result-summary">
          <div class="summary-card score-card">
            <div class="card-icon">
              <i class="el-icon-data-analysis"></i>
            </div>
            <div class="card-content">
              <div class="card-value">{{ selectedResult.totalScore }}</div>
              <div class="card-label">测试分数</div>
            </div>
          </div>
          
          <div class="summary-card level-card" :class="getLevelClass(selectedResult.depressionLevel)">
            <div class="card-icon">
              <i class="el-icon-rank"></i>
            </div>
            <div class="card-content">
              <div class="card-value">{{ selectedResult.depressionLevel }}</div>
              <div class="card-label">心理状态</div>
            </div>
          </div>
        </div>
        
        <div class="section-container">
          <div class="section-title">
            <i class="el-icon-guide"></i>
            <span>抑郁程度分级参考</span>
          </div>
          
          <div class="level-steps">
            <el-steps :active="getActiveStep(selectedResult.totalScore)" finish-status="success" align-center>
              <el-step title="无抑郁症状" description="50分以下">
                <i slot="icon" class="el-icon-emoji" :class="getActiveStep(selectedResult.totalScore) === 0 ? 'active-icon' : ''"></i>
              </el-step>
              <el-step title="轻度抑郁" description="50-59分">
                <i slot="icon" class="el-icon-partly-cloudy" :class="getActiveStep(selectedResult.totalScore) === 1 ? 'active-icon' : ''"></i>
              </el-step>
              <el-step title="中度抑郁" description="60-69分">
                <i slot="icon" class="el-icon-cloudy" :class="getActiveStep(selectedResult.totalScore) === 2 ? 'active-icon' : ''"></i>
              </el-step>
              <el-step title="重度抑郁" description="70分以上">
                <i slot="icon" class="el-icon-heavy-rain" :class="getActiveStep(selectedResult.totalScore) === 3 ? 'active-icon' : ''"></i>
              </el-step>
            </el-steps>
          </div>
        </div>
        
        <div class="section-container">
          <div class="section-title">
            <i class="el-icon-warning-outline"></i>
            <span>建议与指导</span>
          </div>
          
          <div class="recommendation-box">
            <p>{{ selectedResult.recommendation }}</p>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" icon="el-icon-check" @click="dialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import FunctionApi from '@/api/Function_Menu'
import userApi from '@/api/userManage'
import { getInfo } from '@/api/user'
import { getToken } from '@/utils/auth'

export default {
  name: 'MentalHealthHistory',
  data() {
    return {
      loading: true,
      testHistory: [],
      dialogVisible: false,
      selectedResult: null,
      currentPage: 1,
      pageSize: 10,
      userId: null
    }
  },
  created() {
    this.getUserId()
  },
  methods: {
    async getUserId() {
      try {
        // 先调用getInfo接口确保后端loginUser已设置
        const token = getToken()
        if (token) {
          const infoResponse = await getInfo(token)
          if (infoResponse.code === 20000 && infoResponse.data.id) {
            this.userId = infoResponse.data.id
            this.getTestHistory()
            return
          }
        }
        
        // 如果getInfo接口没有返回id，再尝试调用getUserId接口
        const response = await userApi.getUserId()
        if (response.code === 20000) {
          this.userId = response.data.userId
          this.getTestHistory()
        } else {
          this.$message.error('获取用户信息失败，请重新登录')
          this.loading = false
        }
      } catch (error) {
        console.error('获取用户信息错误:', error)
        this.$message.error('获取用户信息失败，请重新登录')
        this.loading = false
      }
    },
    async getTestHistory() {
      this.loading = true
      try {
        if (!this.userId) {
          this.$message.error('获取用户信息失败，请重新登录')
          this.loading = false
          return
        }
        
        const response = await FunctionApi.getMentalHealthHistory(this.userId)
        if (response.code === 20000) {
          this.testHistory = response.data
        } else {
          this.$message.error(response.msg || '获取历史记录失败')
        }
      } catch (error) {
        console.error('获取历史记录出错:', error)
        this.$message.error('获取历史记录失败，请稍后重试')
      } finally {
        this.loading = false
      }
    },
    viewResult(row) {
      this.selectedResult = row
      this.dialogVisible = true
    },
    handleCurrentChange(val) {
      this.currentPage = val
    },
    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    getLevelClass(level) {
      if (!level) return ''
      switch (level) {
        case '无抑郁症状': return 'level-normal'
        case '轻度抑郁': return 'level-mild'
        case '中度抑郁': return 'level-moderate'
        case '重度抑郁': return 'level-severe'
        default: return ''
      }
    },
    getTagType(level) {
      if (!level) return ''
      switch (level) {
        case '无抑郁症状': return 'success'
        case '轻度抑郁': return 'warning'
        case '中度抑郁': return 'danger'
        case '重度抑郁': return 'danger'
        default: return 'info'
      }
    },
    getActiveStep(score) {
      if (!score) return 0
      if (score < 50) return 0
      if (score < 60) return 1
      if (score < 70) return 2
      return 3
    },
    tableRowClassName({row}) {
      const score = row.totalScore;
      if (score >= 70) {
        return 'severe-row';
      } else if (score >= 60) {
        return 'moderate-row';
      } else if (score >= 50) {
        return 'mild-row';
      }
      return 'normal-row';
    }
  }
}
</script>

<style scoped>
.box-card {
  border-radius: 8px;
  margin-bottom: 20px;
  transition: all 0.3s;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-container {
  display: flex;
  align-items: center;
}

.title-container i {
  font-size: 20px;
  margin-right: 10px;
  color: #409EFF;
}

.title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.history-container {
  padding: 10px 0;
}

.table-header {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-container {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 500;
}

.filter-container i {
  color: #409EFF;
  margin-right: 8px;
}

.date-cell {
  display: flex;
  align-items: center;
  justify-content: center;
}

.date-cell i {
  margin-right: 5px;
  color: #409EFF;
}

.score-badge {
  background-color: #ecf5ff;
  color: #409EFF;
  padding: 6px 12px;
  border-radius: 15px;
  font-weight: bold;
  display: inline-block;
}

.recommendation-cell {
  display: flex;
  align-items: center;
  color: #606266;
}

.recommendation-cell i {
  margin-right: 5px;
  color: #909399;
}

.pagination-container {
  margin-top: 20px;
  padding: 10px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.empty-container {
  padding: 60px 0;
  text-align: center;
}

.empty-icon {
  font-size: 60px;
  color: #c0c4cc;
}

/* Dialog styles */
.dialog-content {
  padding: 10px;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #ebeef5;
}

.dialog-title {
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 600;
}

.dialog-title i {
  color: #409EFF;
  margin-right: 10px;
  font-size: 20px;
}

.dialog-date {
  color: #909399;
  font-size: 14px;
}

.result-summary {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
}

.summary-card {
  flex: 1;
  display: flex;
  align-items: center;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.summary-card .card-icon {
  font-size: 40px;
  margin-right: 15px;
}

.summary-card .card-content {
  display: flex;
  flex-direction: column;
}

.summary-card .card-value {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 5px;
}

.summary-card .card-label {
  font-size: 14px;
  color: #909399;
}

.score-card {
  background: linear-gradient(to right, #ecf5ff, #f2f6fc);
}

.score-card .card-icon {
  color: #409EFF;
}

.level-card {
  background: linear-gradient(to right, #f0f9eb, #f4f4f5);
}

.level-card.level-normal .card-icon,
.level-card.level-normal .card-value {
  color: #67c23a;
}

.level-card.level-mild {
  background: linear-gradient(to right, #fdf6ec, #f4f4f5);
}

.level-card.level-mild .card-icon,
.level-card.level-mild .card-value {
  color: #e6a23c;
}

.level-card.level-moderate {
  background: linear-gradient(to right, #fef0f0, #f4f4f5);
}

.level-card.level-moderate .card-icon,
.level-card.level-moderate .card-value {
  color: #f56c6c;
}

.level-card.level-severe {
  background: linear-gradient(to right, #fef0f0, #f4f4f5);
}

.level-card.level-severe .card-icon,
.level-card.level-severe .card-value {
  color: #f56c6c;
}

.section-container {
  margin-bottom: 30px;
}

.section-title {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 15px;
}

.section-title i {
  color: #409EFF;
  margin-right: 8px;
  font-size: 18px;
}

.level-steps {
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.active-icon {
  color: #409EFF;
  font-weight: bold;
  font-size: 20px;
}

.recommendation-box {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  line-height: 1.6;
  border-left: 4px solid #409EFF;
}

/* Table row styles */
::v-deep .normal-row {
  background-color: rgba(103, 194, 58, 0.05);
}

::v-deep .mild-row {
  background-color: rgba(230, 162, 60, 0.05);
}

::v-deep .moderate-row {
  background-color: rgba(245, 108, 108, 0.05);
}

::v-deep .severe-row {
  background-color: rgba(245, 108, 108, 0.1);
}

@media (max-width: 768px) {
  .result-summary {
    flex-direction: column;
  }
  
  .summary-card {
    margin-bottom: 15px;
  }
}
</style> 