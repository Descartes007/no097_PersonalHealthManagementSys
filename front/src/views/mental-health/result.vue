<template>
  <div class="app-container">
    <el-card class="box-card" v-loading="loading" shadow="hover">
      <div slot="header" class="clearfix header">
        <div class="title-container">
          <i class="el-icon-data-line"></i>
          <span class="title">心理健康检测结果</span>
        </div>
        <el-button type="text" icon="el-icon-time" @click="$router.push('/mental-health/history')">查看历史记录</el-button>
      </div>
      
      <div v-if="testResult" class="result-container">
        <div class="progress-container">
          <div class="progress-wrapper">
            <el-progress type="dashboard" 
              :percentage="getScorePercentage(testResult.totalScore)" 
              :color="getScoreColor(testResult.totalScore)"
              :stroke-width="15">
              <div class="progress-content">
                <div class="progress-score">{{ testResult.totalScore }}</div>
                <div class="progress-label">总分</div>
              </div>
            </el-progress>
          </div>
          
          <div class="status-wrapper">
            <div class="status-label">心理状态</div>
            <div class="status-value" :class="getLevelClass(testResult.depressionLevel)">
              {{ testResult.depressionLevel }}
            </div>
            <div class="test-date">
              测试时间: {{ formatDate(testResult.testDate) }}
            </div>
          </div>
        </div>
        
        <div class="visualization-container">
          <div class="section-header">
            <i class="el-icon-data-line"></i>
            <span>抑郁程度可视化</span>
          </div>
          
          <div class="level-visualization">
            <div class="level-indicator">
              <div class="level-bars">
                <div class="level-bar level-normal" :class="{'active': testResult.totalScore < 50}">
                  <div class="bar-content">正常</div>
                </div>
                <div class="level-bar level-mild" :class="{'active': testResult.totalScore >= 50 && testResult.totalScore < 60}">
                  <div class="bar-content">轻度</div>
                </div>
                <div class="level-bar level-moderate" :class="{'active': testResult.totalScore >= 60 && testResult.totalScore < 70}">
                  <div class="bar-content">中度</div>
                </div>
                <div class="level-bar level-severe" :class="{'active': testResult.totalScore >= 70}">
                  <div class="bar-content">重度</div>
                </div>
              </div>
              <div class="indicator-arrow" :style="getIndicatorPosition(testResult.totalScore)">
                <i class="el-icon-caret-bottom"></i>
              </div>
              <div class="level-scale">
                <div class="scale-mark">0</div>
                <div class="scale-mark">50</div>
                <div class="scale-mark">60</div>
                <div class="scale-mark">70</div>
                <div class="scale-mark">100</div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="content-section">
          <div class="left-section">
            <div class="result-card evaluation-card">
              <div class="card-header">
                <i class="el-icon-s-help"></i>
                <span>心理健康评估</span>
              </div>
              <div class="card-body">
                <el-tag :type="getTagType(testResult.depressionLevel)" effect="dark" size="medium">
                  {{ testResult.depressionLevel }}
                </el-tag>
                <p class="recommendation-text">{{ testResult.recommendation }}</p>
              </div>
            </div>
          </div>
          
          <div class="right-section">
            <div class="result-card steps-card">
              <div class="card-header">
                <i class="el-icon-guide"></i>
                <span>抑郁程度分级参考</span>
              </div>
              <div class="card-body">
                <div class="level-steps">
                  <el-steps :active="getActiveStep(testResult.totalScore)" finish-status="success" direction="vertical">
                    <el-step title="无抑郁症状" description="50分以下">
                      <i slot="icon" class="el-icon-emoji" :class="getActiveStep(testResult.totalScore) === 0 ? 'active-icon' : ''"></i>
                    </el-step>
                    <el-step title="轻度抑郁" description="50-59分">
                      <i slot="icon" class="el-icon-partly-cloudy" :class="getActiveStep(testResult.totalScore) === 1 ? 'active-icon' : ''"></i>
                    </el-step>
                    <el-step title="中度抑郁" description="60-69分">
                      <i slot="icon" class="el-icon-cloudy" :class="getActiveStep(testResult.totalScore) === 2 ? 'active-icon' : ''"></i>
                    </el-step>
                    <el-step title="重度抑郁" description="70分以上">
                      <i slot="icon" class="el-icon-heavy-rain" :class="getActiveStep(testResult.totalScore) === 3 ? 'active-icon' : ''"></i>
                    </el-step>
                  </el-steps>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="suggestion-section">
          <div class="result-card suggestion-card">
            <div class="card-header">
              <i class="el-icon-warning-outline"></i>
              <span>建议与指导</span>
            </div>
            <div class="card-body">
              <div class="suggestion-content">
                <div class="suggestion-icon">
                  <i class="el-icon-info" :class="getSuggestionIconClass(testResult.depressionLevel)"></i>
                </div>
                <div class="suggestion-text">
                  <p>{{ testResult.recommendation }}</p>
                </div>
              </div>
              
              <div v-if="testResult.totalScore >= 50" class="warning-box">
                <el-alert
                  title="注意事项"
                  type="warning"
                  description="心理健康测试仅供参考，不能替代专业医生的诊断。如果您有持续的心理困扰，建议咨询专业心理医生或精神科医生。"
                  show-icon
                  :closable="false">
                </el-alert>
              </div>
            </div>
          </div>
        </div>
        
        <div class="actions-container">
          <el-button type="primary" icon="el-icon-refresh-right" @click="$router.push('/mental-health/test')">再次测试</el-button>
          <el-button type="info" icon="el-icon-document" @click="$router.push('/mental-health/history')">查看历史</el-button>
          <el-button icon="el-icon-s-home" @click="$router.push('/dashboard')">返回首页</el-button>
        </div>
      </div>
      
      <div v-else-if="!loading" class="no-result">
        <el-empty description="未找到测试结果">
          <template slot="image">
            <i class="el-icon-document-delete empty-icon"></i>
          </template>
          <el-button type="primary" icon="el-icon-edit-outline" @click="$router.push('/mental-health/test')">开始测试</el-button>
        </el-empty>
      </div>
    </el-card>
  </div>
</template>

<script>
import FunctionApi from '@/api/Function_Menu'
import userApi from '@/api/userManage'
import { getInfo } from '@/api/user'
import { getToken } from '@/utils/auth'

export default {
  name: 'MentalHealthResult',
  data() {
    return {
      loading: true,
      testResult: null,
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
            this.getTestResult()
            return
          }
        }
        
        // 如果getInfo接口没有返回id，再尝试调用getUserId接口
        const response = await userApi.getUserId()
        if (response.code === 20000) {
          this.userId = response.data.userId
          this.getTestResult()
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
    async getTestResult() {
      this.loading = true
      try {
        const testId = this.$route.params.id
        if (testId && this.userId) {
          // 这里需要添加根据ID获取特定测试结果的API
          // 暂时使用获取最近结果的API
          const response = await FunctionApi.getLatestMentalHealthTest(this.userId)
          if (response.code === 20000) {
            this.testResult = response.data
          } else {
            this.$message.error(response.msg || '获取测试结果失败')
          }
        }
      } catch (error) {
        console.error('获取测试结果出错:', error)
        this.$message.error('获取测试结果失败，请稍后重试')
      } finally {
        this.loading = false
      }
    },
    getScorePercentage(score) {
      if (!score) return 0
      // 假设最高分是100
      return Math.min(Math.round(score), 100)
    },
    getScoreColor(score) {
      if (!score) return '#909399'
      if (score < 50) return '#67c23a'
      if (score < 60) return '#e6a23c'
      if (score < 70) return '#f56c6c'
      return '#ff4949'
    },
    getIndicatorPosition(score) {
      if (!score) return { left: '0%' }
      if (score < 50) {
        return { left: `${(score / 50) * 25}%` }
      } else if (score < 60) {
        return { left: `${25 + ((score - 50) / 10) * 25}%` }
      } else if (score < 70) {
        return { left: `${50 + ((score - 60) / 10) * 25}%` }
      } else {
        const percentage = Math.min(score, 100)
        return { left: `${75 + ((percentage - 70) / 30) * 25}%` }
      }
    },
    getSuggestionIconClass(level) {
      if (!level) return ''
      switch (level) {
        case '无抑郁症状': return 'suggestion-normal'
        case '轻度抑郁': return 'suggestion-mild'
        case '中度抑郁': return 'suggestion-moderate'
        case '重度抑郁': return 'suggestion-severe'
        default: return ''
      }
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
    }
  }
}
</script>

<style scoped>
.box-card {
  border-radius: 12px;
  margin-bottom: 20px;
  transition: all 0.3s;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
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
  font-size: 22px;
  margin-right: 12px;
  color: #409EFF;
}

.title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.result-container {
  padding: 10px 0;
}

/* 进度仪表盘 */
.progress-container {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  background: linear-gradient(to right, #f8f9fa, #ffffff);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.progress-wrapper {
  flex: 0 0 200px;
  text-align: center;
}

.progress-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.progress-score {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
}

.progress-label {
  font-size: 14px;
  color: #909399;
  margin-top: 5px;
}

.status-wrapper {
  flex: 1;
  margin-left: 40px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.status-label {
  font-size: 16px;
  color: #909399;
  margin-bottom: 10px;
}

.status-value {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 10px;
}

.level-normal {
  color: #67c23a;
}

.level-mild {
  color: #e6a23c;
}

.level-moderate {
  color: #f56c6c;
}

.level-severe {
  color: #ff4949;
}

.test-date {
  font-size: 14px;
  color: #909399;
}

/* 可视化部分 */
.visualization-container {
  margin-bottom: 30px;
  background-color: #ffffff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.section-header {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #303133;
}

.section-header i {
  font-size: 18px;
  margin-right: 8px;
  color: #409EFF;
}

.level-visualization {
  padding: 10px 0;
}

.level-indicator {
  position: relative;
  margin: 30px 0;
}

.level-bars {
  display: flex;
  height: 40px;
  border-radius: 6px;
  overflow: hidden;
}

.level-bar {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  transition: all 0.3s;
  opacity: 0.7;
}

.level-bar.active {
  opacity: 1;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.level-normal {
  background-color: #67c23a;
}

.level-mild {
  background-color: #e6a23c;
}

.level-moderate {
  background-color: #f56c6c;
}

.level-severe {
  background-color: #ff4949;
}

.indicator-arrow {
  position: absolute;
  top: -25px;
  transform: translateX(-50%);
  color: #409EFF;
  font-size: 24px;
  transition: left 0.3s ease-in-out;
}

.level-scale {
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
}

.scale-mark {
  font-size: 12px;
  color: #909399;
}

/* 内容区域 */
.content-section {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
}

.left-section, .right-section {
  flex: 1;
}

.result-card {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  height: 100%;
  transition: all 0.3s;
}

.result-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.card-header {
  background-color: #f5f7fa;
  padding: 15px;
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 16px;
}

.card-header i {
  color: #409EFF;
  margin-right: 8px;
  font-size: 18px;
}

.card-body {
  padding: 20px;
}

.recommendation-text {
  margin-top: 15px;
  line-height: 1.6;
  color: #606266;
}

.level-steps {
  padding: 10px;
}

.active-icon {
  color: #409EFF !important;
  font-weight: bold;
  font-size: 20px;
}

/* 建议部分 */
.suggestion-section {
  margin-bottom: 30px;
}

.suggestion-content {
  display: flex;
  margin-bottom: 20px;
}

.suggestion-icon {
  flex: 0 0 60px;
  font-size: 40px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.suggestion-normal {
  color: #67c23a;
}

.suggestion-mild {
  color: #e6a23c;
}

.suggestion-moderate {
  color: #f56c6c;
}

.suggestion-severe {
  color: #ff4949;
}

.suggestion-text {
  flex: 1;
  line-height: 1.6;
  color: #606266;
}

.warning-box {
  margin-top: 20px;
}

/* 按钮区域 */
.actions-container {
  display: flex;
  justify-content: center;
  margin-top: 40px;
  gap: 20px;
}

.no-result {
  padding: 60px 0;
  text-align: center;
}

.empty-icon {
  font-size: 60px;
  color: #c0c4cc;
}

@media (max-width: 992px) {
  .progress-container {
    flex-direction: column;
    align-items: center;
  }
  
  .status-wrapper {
    margin-left: 0;
    margin-top: 20px;
    align-items: center;
  }
  
  .content-section {
    flex-direction: column;
  }
  
  .left-section, .right-section {
    margin-bottom: 20px;
  }
}

@media (max-width: 768px) {
  .actions-container {
    flex-direction: column;
    gap: 10px;
  }
  
  .actions-container .el-button {
    width: 100%;
  }
}
</style> 