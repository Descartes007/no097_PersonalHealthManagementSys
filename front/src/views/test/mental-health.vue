<template>
  <div class="app-container">
    <el-card class="box-card" shadow="hover">
      <div slot="header" class="clearfix header">
        <div class="title-container">
          <i class="el-icon-data-analysis"></i>
          <span class="title">抑郁自评量表（SDS）测试</span>
        </div>
        <el-button type="text" @click="resetTest" icon="el-icon-refresh-right">重置</el-button>
      </div>

      <div class="test-intro" v-if="currentStep === 0">
        <div class="intro-card">
          <div class="intro-header">
            <i class="el-icon-info-circle"></i>
            <span>测试说明</span>
          </div>
          <div class="intro-content">
            <p>以下是抑郁自评量表（SDS，Self-Rating Depression Scale）的国际标准题目，共20题，采用4级评分法。</p>
            <p>请根据最近一周内的实际感受进行选择。测试结果仅供参考，不作为医疗诊断依据。</p>
            <div class="intro-note">
              <i class="el-icon-warning-outline"></i>
              <span>如有持续的情绪困扰，请咨询专业的心理医生或精神科医生。</span>
            </div>
          </div>
        </div>

        <div class="criteria-card">
          <div class="criteria-header">
            <i class="el-icon-medal"></i>
            <span>评分标准</span>
          </div>
          <div class="criteria-content">
            <div class="criteria-grid">
              <div class="criteria-item">
                <div class="criteria-badge score-1">1分</div>
                <div class="criteria-text">没有或很少时间（＜1天）</div>
              </div>
              <div class="criteria-item">
                <div class="criteria-badge score-2">2分</div>
                <div class="criteria-text">小部分时间（1-2天）</div>
              </div>
              <div class="criteria-item">
                <div class="criteria-badge score-3">3分</div>
                <div class="criteria-text">相当多时间（3-4天）</div>
              </div>
              <div class="criteria-item">
                <div class="criteria-badge score-4">4分</div>
                <div class="criteria-text">绝大部分或全部时间（5-7天）</div>
              </div>
            </div>
          </div>
        </div>

        <div class="action-container">
          <el-button type="primary" size="large" @click="startTest" icon="el-icon-caret-right">开始测试</el-button>
        </div>
      </div>

      <div v-else-if="currentStep > 0 && currentStep <= questions.length" class="test-content">
        <div class="progress-bar-container">
          <div class="progress-bar-wrapper">
            <el-progress
              :percentage="progressPercentage"
              :color="progressColor"
              :stroke-width="15"
              :format="progressFormat">
            </el-progress>
          </div>
          <div class="progress-info">
            <span class="current-question">第 {{ currentStep }} 题</span>
            <span class="total-questions">共 {{ questions.length }} 题</span>
          </div>
        </div>

        <el-carousel
          ref="questionCarousel"
          :autoplay="false"
          indicator-position="none"
          :initial-index="currentStep-1"
          @change="handleCarouselChange"
          :loop="false">
          <el-carousel-item v-for="(question, index) in questions" :key="index">
            <div class="question-card" :class="{'answered': testForm.answers[index] !== null}">
              <div class="question-header">
                <div class="question-number">{{ index + 1 }}</div>
                <div class="question-text">{{ question.text }}</div>
              </div>

              <div class="options-container">
                <div
                  v-for="score in 4"
                  :key="score"
                  class="option-item"
                  :class="[
                    `option-score-${score}`,
                    testForm.answers[index] === score ? 'option-selected' : ''
                  ]"
                  @click="selectAnswer(index, score)"
                >
                  <div :class="['criteria-badge', `score-${score}`]">{{ score }}分</div>
                  <div class="criteria-text">
                    <template v-if="score === 1">没有或很少时间（＜1天）</template>
                    <template v-else-if="score === 2">小部分时间（1-2天）</template>
                    <template v-else-if="score === 3">相当多时间（3-4天）</template>
                    <template v-else>绝大部分或全部时间（5-7天）</template>
                  </div>
                  <div class="check-icon" v-if="testForm.answers[index] === score">
                    <i class="el-icon-check"></i>
                  </div>
                </div>
              </div>
              
              <div class="question-footer">
                <div class="question-type" v-if="question.isReverse">
                  <el-tag type="info" size="small">反向计分题</el-tag>
                </div>
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>

        <div class="navigation-buttons">
          <el-button
            icon="el-icon-arrow-left"
            @click="prevQuestion"
            :disabled="currentStep <= 1">
            上一题
          </el-button>

          <div class="center-info">
            <div class="nav-page-info">{{ currentStep }} / {{ questions.length }}</div>
          </div>

          <el-button
            v-if="currentStep < questions.length"
            type="primary"
            @click="nextQuestion"
            :disabled="testForm.answers[currentStep-1] === null"
            icon="el-icon-arrow-right"
            iconPosition="right">
            下一题
          </el-button>

          <el-button
            v-else
            type="success"
            @click="submitTest"
            :loading="loading"
            icon="el-icon-check">
            提交测试
          </el-button>
        </div>
      </div>

      <div v-else-if="currentStep === questions.length + 1" class="test-summary">
        <div class="summary-header">
          <i class="el-icon-circle-check"></i>
          <span>测试完成</span>
        </div>

        <div class="summary-content">
          <div class="completion-icon">
            <i class="el-icon-finished"></i>
          </div>
          <div class="completion-text">
            <h3>您已回答完所有问题</h3>
            <p>点击下方按钮提交测试结果并查看分析</p>
          </div>

          <div class="summary-stats">
            <div class="stat-item">
              <div class="stat-label">总题数</div>
              <div class="stat-value">{{ questions.length }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">已回答</div>
              <div class="stat-value">{{ answeredQuestions }}</div>
            </div>
          </div>

          <div class="review-hint">
            <i class="el-icon-info-circle"></i>
            <span>您可以使用上一题按钮回顾并修改您的回答</span>
          </div>
          
          <div class="privacy-note">
            <i class="el-icon-lock"></i>
            <span>您的测试结果将严格保密，仅用于为您提供健康建议</span>
          </div>
        </div>

        <div class="action-container">
          <el-button icon="el-icon-arrow-left" @click="prevQuestion">回顾上一题</el-button>
          <el-button type="success" @click="submitTest" :loading="loading" icon="el-icon-check">提交测试</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import FunctionApi from '@/api/Function_Menu'
import userApi from "@/api/userManage"
import { getInfo } from '@/api/user'
import { getToken } from '@/utils/auth'

export default {
  name: 'MentalHealthTest',
  data() {
    return {
      loading: false,
      userId: null,
      currentStep: 0, // 0: intro, 1-20: questions, 21: summary
      testForm: {
        answers: new Array(20).fill(null),
      },
      questions: [
        { text: '我感到情绪沮丧，闷闷不乐', isReverse: false },
        { text: '我感到早晨心情最好', isReverse: true },
        { text: '我要哭或想哭', isReverse: false },
        { text: '我夜间睡眠不好', isReverse: false },
        { text: '我吃饭像平时一样多', isReverse: true },
        { text: '我的性功能正常', isReverse: true },
        { text: '我感到体重减轻', isReverse: false },
        { text: '我为便秘烦恼', isReverse: false },
        { text: '我的心跳比平时快', isReverse: false },
        { text: '我无故感到疲劳', isReverse: false },
        { text: '我的头脑像往常一样清楚', isReverse: true },
        { text: '我做事情像平时一样不感到困难', isReverse: true },
        { text: '我坐卧不安，难以保持平静', isReverse: false },
        { text: '我对未来感到有希望', isReverse: true },
        { text: '我比平时更容易激怒', isReverse: false },
        { text: '我觉得决定什么事很容易', isReverse: true },
        { text: '我感到自己是有用的和不可缺少的人', isReverse: true },
        { text: '我的生活很有意义', isReverse: true },
        { text: '假若我死了别人会过得更好', isReverse: false },
        { text: '我仍旧喜爱自己平时喜爱的东西', isReverse: true }
      ]
    }
  },
  computed: {
    answeredQuestions() {
      return this.testForm.answers.filter(answer => answer !== null).length
    },
    progressPercentage() {
      return Math.floor((this.currentStep / this.questions.length) * 100)
    },
    progressColor() {
      if (this.progressPercentage < 30) return '#909399'
      if (this.progressPercentage < 70) return '#e6a23c'
      if (this.progressPercentage < 100) return '#409EFF'
      return '#67c23a'
    }
  },
  watch: {
    currentStep(newVal) {
      if (newVal > 0 && newVal <= this.questions.length) {
        this.$nextTick(() => {
          if (this.$refs.questionCarousel) {
            this.$refs.questionCarousel.setActiveItem(newVal - 1)
          }
        })
      }
    }
  },
  created() {
    this.getUserId()
  },
  methods: {
    progressFormat() {
      return `${this.progressPercentage}%`
    },
    startTest() {
      this.currentStep = 1
    },
    selectAnswer(index, score) {
      this.$set(this.testForm.answers, index, score)

      // 如果用户已经回答，且不是最后一题，自动前进到下一题
      if (this.currentStep < this.questions.length) {
        setTimeout(() => {
          this.nextQuestion()
        }, 300)
      }
    },
    nextQuestion() {
      if (this.currentStep < this.questions.length + 1) {
        this.currentStep++
      }
    },
    prevQuestion() {
      if (this.currentStep > 1) {
        this.currentStep--
      }
    },
    handleCarouselChange(index) {
      this.currentStep = index + 1
    },
    async getUserId() {
      try {
        // 先调用getInfo接口确保后端loginUser已设置
        const token = getToken()
        if (token) {
          const infoResponse = await getInfo(token)
          if (infoResponse.code === 20000 && infoResponse.data.id) {
            this.userId = infoResponse.data.id
            return
          }
        }

        // 如果getInfo接口没有返回id，再尝试调用getUserId接口
        const response = await userApi.getUserId()
        if (response.code === 20000) {
          this.userId = response.data.userId
        } else {
          this.$message.error('获取用户信息失败，请重新登录')
        }
      } catch (error) {
        console.error('获取用户信息错误:', error)
        this.$message.error('获取用户信息失败，请重新登录')
      }
    },
    calculateScore() {
      let totalScore = 0

      this.testForm.answers.forEach((answer, index) => {
        if (answer === null) return

        // 处理反向计分题
        if (this.questions[index].isReverse) {
          totalScore += 5 - answer // 反向计分：1->4, 2->3, 3->2, 4->1
        } else {
          totalScore += answer
        }
      })

      // 根据SDS计算方法，总分乘以1.25
      return Math.floor(totalScore * 1.25)
    },

    submitTest() {
      // 检查是否有未回答的问题
      if (this.answeredQuestions < this.questions.length) {
        const unansweredCount = this.questions.length - this.answeredQuestions
        this.$message.warning(`还有 ${unansweredCount} 题未回答，请完成所有问题再提交`)
        return
      }

      this.loading = true

      this.submitTestData()
    },

    async submitTestData() {
      try {
        // 检查用户ID
        if (!this.userId) {
          await this.getUserId()
          if (!this.userId) {
            this.$message.error('获取用户信息失败，请重新登录')
            this.loading = false
            return
          }
        }

        // 计算得分
        const totalScore = this.calculateScore()

        // 准备提交的数据
        const testData = {
          userId: this.userId,
          totalScore: totalScore,
          answers: JSON.stringify(this.testForm.answers)
        }

        // 提交测试结果
        const response = await FunctionApi.saveMentalHealthTest(testData)

        if (response.code === 20000) {
          this.$message.success('测试完成')
          // 跳转到结果页面
          this.$router.push(`/mental-health/result/${response.data.id}`)
        } else {
          this.$message.error(response.msg || '提交失败')
        }
      } catch (error) {
        console.error('提交测试出错:', error)
        this.$message.error('提交失败，请稍后重试')
      } finally {
        this.loading = false
      }
    },

    resetTest() {
      this.testForm.answers = new Array(20).fill(null)
      this.currentStep = 0
    }
  }
}
</script>

<style scoped>
.app-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 120px);
}

.box-card {
  border-radius: 16px;
  margin-bottom: 20px;
  transition: all 0.3s;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  border: none;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: linear-gradient(135deg, #3a8ee6, #53a8ff);
  color: white;
}

.title-container {
  display: flex;
  align-items: center;
}

.title-container i {
  font-size: 24px;
  margin-right: 12px;
  color: white;
}

.title {
  font-size: 20px;
  font-weight: 600;
  color: white;
}

.header .el-button--text {
  color: white;
  font-weight: 500;
}

/* 测试介绍页 */
.test-intro {
  padding: 30px;
  max-width: 900px;
  margin: 0 auto;
}

.intro-card, .criteria-card {
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
  margin-bottom: 30px;
  overflow: hidden;
  border: none;
  transition: all 0.3s;
}

.intro-card:hover, .criteria-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
}

.intro-header, .criteria-header {
  background-color: #f5f7fa;
  padding: 20px;
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 18px;
  color: #303133;
  border-bottom: 1px solid #ebeef5;
}

.intro-header i, .criteria-header i {
  color: #409EFF;
  margin-right: 12px;
  font-size: 22px;
}

.intro-content, .criteria-content {
  padding: 25px;
}

.intro-content p {
  margin: 0 0 16px;
  line-height: 1.8;
  color: #606266;
  font-size: 16px;
}

.intro-content p:last-child {
  margin-bottom: 0;
}

.criteria-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.criteria-item {
  display: flex;
  align-items: center;
  padding: 18px;
  border-radius: 12px;
  background-color: #f8f9fa;
  transition: all 0.3s;
  border: 1px solid #ebeef5;
}

.criteria-item:hover {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  transform: translateY(-5px);
}

.criteria-badge {
  padding: 8px 16px;
  border-radius: 30px;
  font-weight: bold;
  font-size: 16px;
  margin-right: 16px;
  min-width: 50px;
  text-align: center;
  flex-shrink: 0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.criteria-text {
  font-size: 16px;
  color: #606266;
  flex: 1;
}

.score-1 {
  background-color: #e1f3d8;
  color: #67c23a;
}

.score-2 {
  background-color: #fdf6ec;
  color: #e6a23c;
}

.score-3 {
  background-color: #fef0f0;
  color: #f56c6c;
}

.score-4 {
  background-color: #f0f2f5;
  color: #606266;
}

.action-container {
  display: flex;
  justify-content: center;
  padding-top: 30px;
}

.action-container .el-button {
  padding: 15px 40px;
  font-size: 16px;
  border-radius: 50px;
  box-shadow: 0 8px 15px rgba(64, 158, 255, 0.2);
  transition: all 0.3s;
}

.action-container .el-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 20px rgba(64, 158, 255, 0.3);
}

/* 测试内容页 */
.test-content {
  padding: 30px;
  max-width: 1000px;
  margin: 0 auto;
}

.progress-bar-container {
  margin-bottom: 30px;
}

.progress-bar-wrapper {
  margin-bottom: 15px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #909399;
}

.current-question {
  font-weight: 600;
  color: #409EFF;
}

.total-questions {
  color: #909399;
}

/* 轮播样式 */
.el-carousel {
  margin-bottom: 30px;
}

.el-carousel__container {
  height: auto !important;
  min-height: 600px;
}

.question-card {
  position: relative;
  background-color: white;
  border-radius: 16px;
  padding: 35px 30px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  border-left: 6px solid #dcdfe6;
  overflow-y: auto;
  height: 100%;
}

.question-card.answered {
  border-left-color: #409EFF;
}

.question-header {
  display: flex;
  align-items: center;
  margin-bottom: 40px;
}

.question-number {
  width: 55px;
  height: 55px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3a8ee6, #53a8ff);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 22px;
  box-shadow: 0 8px 15px rgba(64, 158, 255, 0.3);
  margin-right: 20px;
  flex-shrink: 0;
}

.question-text {
  font-size: 20px;
  font-weight: 500;
  color: #303133;
  line-height: 1.5;
}

.options-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 25px;
  margin-top: 30px;
  width: 100%;
  margin-bottom: 30px;
}

.option-item {
  display: flex;
  align-items: center;
  padding: 20px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  background-color: #f8f9fa;
  border: 1px solid #ebeef5;
}

.option-item:hover {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  transform: translateY(-5px);
}

.option-selected {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid #409EFF;
}

.option-selected.option-score-1 {
  background-color: rgba(103, 194, 58, 0.15);
}

.option-selected.option-score-2 {
  background-color: rgba(230, 162, 60, 0.15);
}

.option-selected.option-score-3 {
  background-color: rgba(245, 108, 108, 0.15);
}

.option-selected.option-score-4 {
  background-color: rgba(144, 147, 153, 0.15);
}

.check-icon {
  color: #409EFF;
  font-size: 20px;
  margin-left: auto;
}

.navigation-buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  margin-top: 20px;
}

.navigation-buttons .el-button {
  padding: 12px 25px;
  border-radius: 50px;
  transition: all 0.3s;
}

.navigation-buttons .el-button:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
}

.center-info {
  text-align: center;
}

.nav-page-info {
  font-size: 16px;
  font-weight: 600;
  color: #606266;
  padding: 8px 20px;
  background-color: #f5f7fa;
  border-radius: 30px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

/* 测试总结页 */
.test-summary {
  padding: 40px 30px;
  max-width: 700px;
  margin: 0 auto;
}

.summary-header {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  font-weight: 600;
  color: #67c23a;
  margin-bottom: 40px;
}

.summary-header i {
  font-size: 30px;
  margin-right: 12px;
}

.summary-content {
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  padding: 40px 30px;
  text-align: center;
  margin-bottom: 40px;
}

.completion-icon {
  font-size: 70px;
  color: #67c23a;
  margin-bottom: 30px;
}

.completion-text h3 {
  font-size: 24px;
  color: #303133;
  margin-bottom: 15px;
}

.completion-text p {
  font-size: 18px;
  color: #606266;
  margin-bottom: 40px;
}

.summary-stats {
  display: flex;
  justify-content: center;
  gap: 60px;
  margin-bottom: 40px;
}

.stat-item {
  text-align: center;
  background-color: #f5f7fa;
  padding: 20px 30px;
  border-radius: 12px;
  min-width: 120px;
  transition: all 0.3s;
}

.stat-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.stat-label {
  font-size: 16px;
  color: #909399;
  margin-bottom: 10px;
}

.stat-value {
  font-size: 30px;
  font-weight: bold;
  color: #409EFF;
}

.review-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #e6a23c;
  font-size: 16px;
  background-color: rgba(230, 162, 60, 0.1);
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 20px;
}

.review-hint i {
  margin-right: 10px;
  font-size: 18px;
}

.intro-note {
  background-color: #f2f6fc;
  border-left: 4px solid #409EFF;
  padding: 15px;
  border-radius: 8px;
  margin-top: 20px;
  display: flex;
  align-items: center;
}

.intro-note i {
  color: #409EFF;
  font-size: 20px;
  margin-right: 10px;
}

.intro-note span {
  color: #606266;
  font-size: 15px;
  line-height: 1.5;
}

.question-footer {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.privacy-note {
  background-color: #f0f9eb;
  border-left: 4px solid #67c23a;
  padding: 15px;
  border-radius: 8px;
  margin-top: 20px;
  display: flex;
  align-items: center;
}

.privacy-note i {
  color: #67c23a;
  font-size: 20px;
  margin-right: 10px;
}

.privacy-note span {
  color: #606266;
  font-size: 15px;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .test-intro, .test-content, .test-summary {
    padding: 20px 15px;
  }
  
  .criteria-grid {
    grid-template-columns: 1fr;
  }

  .options-container {
    grid-template-columns: 1fr;
  }

  .question-card {
    padding: 25px 20px;
  }

  .question-text {
    font-size: 18px;
  }

  .navigation-buttons {
    flex-direction: column;
    gap: 15px;
  }

  .navigation-buttons .el-button {
    width: 100%;
  }

  .center-info {
    order: -1;
    margin-bottom: 15px;
  }

  .action-container {
    flex-direction: column;
    gap: 15px;
  }

  .action-container .el-button {
    width: 100%;
  }

  .summary-stats {
    gap: 20px;
    flex-direction: column;
  }
  
  .stat-item {
    width: 100%;
  }
}
</style>
