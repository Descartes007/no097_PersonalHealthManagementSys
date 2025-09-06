<template>
  <div class="health-assessment-container">
    <!-- 顶部统计卡片区域 -->
    <div class="statistics-cards">
      <div class="stat-card">
        <div class="stat-icon"><i class="el-icon-data-analysis"></i></div>
        <div class="stat-content">
          <div class="stat-title">健康评分</div>
          <div class="stat-value">{{ this.score }}</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon"><i class="el-icon-user"></i></div>
        <div class="stat-content">
          <div class="stat-title">BMI指数</div>
          <div class="stat-value">{{ this.bmiM }}</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon"><i class="el-icon-s-data"></i></div>
        <div class="stat-content">
          <div class="stat-title">基础代谢率</div>
          <div class="stat-value">{{ this.BMR }}%</div>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="assessment-content">
      <!-- 身体信息卡片 -->
      <div class="info-card body-info">
        <div class="card-header">
          <i class="el-icon-user"></i>
          <h2>身体信息</h2>
        </div>
        <div class="card-body">
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">体重</div>
              <div class="info-value">{{ bodyInfo.weight }}<span class="unit">kg</span></div>
            </div>
            <div class="info-item">
              <div class="info-label">身高</div>
              <div class="info-value">{{ bodyInfo.height }}<span class="unit">m</span></div>
            </div>
            <div class="info-item">
              <div class="info-label">BMI</div>
              <div class="info-value">{{ this.bmiM }}</div>
            </div>
            <div class="info-item">
              <div class="info-label">血糖</div>
              <div class="info-value">{{ bodyInfo.bloodSugar }}<span class="unit">mmol/L</span></div>
            </div>
            <div class="info-item">
              <div class="info-label">血压</div>
              <div class="info-value">{{ bodyInfo.bloodPressure }}<span class="unit">mmHg</span></div>
            </div>
            <div class="info-item">
              <div class="info-label">胆固醇</div>
              <div class="info-value">{{ bodyInfo.bloodLipid }}<span class="unit">mmol/l</span></div>
            </div>
            <div class="info-item">
              <div class="info-label">心率</div>
              <div class="info-value">{{ bodyInfo.heartRate }}<span class="unit">次/分钟</span></div>
            </div>
            <div class="info-item">
              <div class="info-label">视力</div>
              <div class="info-value">{{ bodyInfo.vision }}<span class="unit">度</span></div>
            </div>
          </div>
          <div class="info-image">
            <el-image :src="'https://img2.baidu.com/it/u=3739143803,1113922112&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500'" class="card-img"></el-image>
          </div>
        </div>
      </div>

      <!-- 健康状况分析区域 -->
      <div class="analysis-section">
        <!-- 生活习惯分析卡片 -->
        <div class="info-card lifestyle-analysis">
          <div class="card-header">
            <i class="el-icon-s-operation"></i>
            <h2>生活习惯分析</h2>
          </div>
          <div class="card-body">
            <div class="analysis-content">
              <div class="analysis-item">
                <div class="analysis-label">您的习惯如下</div>
                <div class="analysis-value habits-list">{{ this.habits }}</div>
              </div>
              <div class="analysis-item">
                <div class="analysis-label">建议</div>
                <div class="analysis-value">
                  阅读运动知识，更好地了解运动的正确姿势和方法，通过了解运动的原理和科学知识，我们可以更好地制定运动计划，减少运动中的风险和不适，避免受伤和疾病的发生。
                </div>
              </div>
            </div>
            <div class="analysis-image">
              <el-image :src="'https://img2.baidu.com/it/u=1105778939,2489899437&fm=253&fmt=auto&app=138&f=JPEG?w=304&h=420'" class="card-img"></el-image>
            </div>
          </div>
        </div>

        <!-- 能量消耗状况卡片 -->
        <div class="info-card energy-consumption">
          <div class="card-header">
            <i class="el-icon-data-line"></i>
            <h2>基础能量消耗状况</h2>
          </div>
          <div class="card-body chart-container">
            <div class="chart-item">
              <el-progress type="circle" :percentage="Number(this.Standard_hight)" :stroke-width="10" :width="150"></el-progress>
              <div class="chart-label">到达身体年龄的百分比</div>
            </div>
            <div class="chart-item">
              <el-progress type="circle" :percentage="Number(this.BMR)" color="#409EFF" :stroke-width="10" :width="150"></el-progress>
              <div class="chart-label">基本能量消耗</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 体型与疾病分析区域 -->
      <div class="analysis-section">
        <!-- 肥胖分析卡片 -->
        <div class="info-card obesity-analysis">
          <div class="card-header">
            <i class="el-icon-s-help"></i>
            <h2>肥胖分析</h2>
          </div>
          <div class="card-body">
            <div class="progress-container">
              <el-progress :percentage="percentage" :show-text="false" :stroke-width="15" class="custom-progress"></el-progress>
              <div class="progress-markers">
                <span>偏瘦</span>
                <span>正常</span>
                <span>超重</span>
                <span>肥胖</span>
              </div>
            </div>
            <div class="analysis-content">
              <div class="analysis-item">
                <div class="analysis-label">根据计算</div>
                <div class="analysis-value">{{ determineHealthRisk }}</div>
              </div>
              <div class="analysis-item">
                <div class="analysis-label">肥胖可能的风险</div>
                <div class="analysis-value">{{ Disease_risk }}</div>
              </div>
            </div>
            <div class="analysis-image">
              <el-image :src="'https://dingyue.ws.126.net/A=IQqxW4IOFs0I2qwUfGxXB0hasjYsYCn6bJTPbjF19rs1563354766400compressflag.jpg'" class="card-img"></el-image>
            </div>
          </div>
        </div>

        <!-- 疾病分析卡片 -->
        <div class="info-card disease-analysis">
          <div class="card-header">
            <i class="el-icon-warning-outline"></i>
            <h2>疾病分析</h2>
          </div>
          <div class="card-body">
            <div class="analysis-content">
              <div class="analysis-item">
                <div class="analysis-label">可能的疾病</div>
                <div class="analysis-value">{{ this.risk }}</div>
              </div>
              <div class="analysis-item">
                <div class="analysis-label warning">注意</div>
                <div class="analysis-value">
                  以上风险只是根据您上传的身体数据进行最基本的分析，并不能作为真正的结果，不管有没有风险，都需要保持运动，如有不舒服的地方请马上就医。
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 视力和体型分析区域 -->
      <div class="analysis-section">
        <!-- 视力分析卡片 -->
        <div class="info-card vision-analysis">
          <div class="card-header">
            <i class="el-icon-view"></i>
            <h2>视力分析</h2>
          </div>
          <div class="card-body">
            <div class="analysis-content">
              <div class="analysis-item">
                <div class="analysis-label">您的视力为</div>
                <div class="analysis-value">{{ bodyInfo.vision }}</div>
              </div>
              <div class="analysis-item">
                <div class="analysis-label">近视等级</div>
                <div class="analysis-value">{{ visionType }}</div>
              </div>
              <div class="analysis-item">
                <div class="analysis-label">建议</div>
                <div class="analysis-value">{{ visionSuggestion }}</div>
              </div>
            </div>
            <div class="analysis-image">
              <el-image :src="'https://img2.baidu.com/it/u=2632046057,3513146628&fm=253&fmt=auto&app=138&f=JPEG?w=667&h=500'" class="card-img"></el-image>
            </div>
          </div>
        </div>

        <!-- 体型判断卡片 -->
        <div class="info-card body-type">
          <div class="card-header">
            <i class="el-icon-user"></i>
            <h2>体型判断</h2>
          </div>
          <div class="card-body">
            <div class="analysis-content">
              <div class="analysis-item">
                <div class="analysis-label">您的体型属于</div>
                <div class="analysis-value">{{ bodyType }}</div>
              </div>
              <div class="analysis-item">
                <div class="analysis-label">建议</div>
                <div class="analysis-value">{{ bodyTypeSuggestion }}</div>
              </div>
            </div>
            <div class="analysis-image">
              <el-image :src="'https://image.16pic.com/00/27/09/16pic_2709384_s.jpg?imageView2/0/format/png'" class="card-img"></el-image>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import userApi from "@/api/userManage";
export default {
  data() {
    return {
      bodyInfo: "",
      bmi: null,
      risk: "",
      Standard_hight: null,
      metabolic_rate: null,
      BMR: null,
      habits: "",
      score: 100,
      habits_count: [],
    };
  },

  computed: {
    bmiM() {
      // 从bodyInfo中获取身高和体重的值，并转换为 Number 类型
      const weight = Number(this.bodyInfo.weight);
      // 计算BMI值
      const bmiValue = weight / (this.bodyInfo.height * this.bodyInfo.height);
      // 返回计算结果并保留两位小数
      this.bmi = bmiValue.toFixed(2);
      return bmiValue.toFixed(2);
    },

    percentage() {
      return Math.round((this.bmi / 35) * 100);
    },
    visionType() {
      const vision = this.bodyInfo.vision;
      if (vision >= 600) {
        return "高度近视";
      } else if (vision >= 300 && vision <= 600) {
        return "中度近视";
      } else if (vision > 0 && vision <= 300) {
        return "轻度近视";
      } else if (vision === 0) {
        return "没有近视";
      }
    },

    visionSuggestion() {
      const visionType = this.visionType;
      if (visionType === "高度近视") {
        return "积极治疗，建议就医";
      } else if (visionType === "中度近视") {
        return "注意保护眼睛，建议定期检查视力";
      } else if (visionType === "轻度近视") {
        return "加强锻炼，注意用眼卫生";
      } else if (visionType === "没有近视") {
        return "很好，保持生活习惯，注意保护眼睛";
      }
    },

    bodyType() {
      if (this.bmiM >= 28) {
        return "肥胖型";
      } else if (this.bmiM > 24 && this.bmiM <= 28) {
        return "超重体型";
      } else if (this.bmiM >= 0 && this.bmiM <= 24) {
        return "正常体型";
      }
    },

    determineHealthRisk() {
      if (this.bmiM >= 28) {
        return "您的体重太大了，请马上减肥";
      } else if (this.bmiM > 24 && this.bmiM <= 28) {
        return "您的体重过大，请及时减肥";
      } else if (this.bmiM >= 0 && this.bmiM <= 24) {
        return "您的体重正常，请保持健康生活";
      }
    },
    Disease_risk() {
      if (this.bmiM >= 28) {
        return "心脏病、中风、高血压和高胆固醇，增加心脏病，还有糖尿病、呼吸系统疾病、关节炎等风险";
      } else if (this.bmiM > 24 && this.bmiM <= 28) {
        return "容易导致高血压、高胆固醇、心脏病、中风、患糖尿病的风险，胰岛素分泌异常以及呼吸系统疾病";
      } else if (this.bmiM >= 0 && this.bmiM <= 24) {
        return "风险不大，但是要保证摄入足够的蛋白质、碳水化合物和脂肪";
      }
    },

    bodyTypeSuggestion() {
      if (this.bodyType === "肥胖型") {
        return "控制饮食，增加运动量，并寻求专业医师的指导。";
      } else if (this.bodyType === "超重体型") {
        return "注意饮食健康，控制摄入量，并加强有氧运动，提高身体代谢率。";
      } else if (this.bodyType === "正常体型") {
        return "保持良好的生活习惯，适当参加运动，均衡饮食，保持身体健康。";
      }
    },
  },

  methods: {
    async getBodyInfo() {
      try {
        // 使用解构赋值从 userApi.getBodyInfo() 返回的 Promise 对象中提取 data.bodyList 数组的第一个元素（即 bodyInfo 对象）
        const {
          data: {
            bodyList: [bodyInfo],
          },
        } = await userApi.getBodyInfo();
        this.bodyInfo = bodyInfo;
      } catch (error) {
        console.log("获取身体信息错误");
      }
    },

    habits_customs() {
      let habits = [];
      this.habits_count = habits;
      // 判断膳食习惯
      if (this.bodyInfo.foodTypes === "蔬菜") {
        habits.push("爱吃蔬菜");
      }
      if (this.bodyInfo.foodTypes === "水果") {
        habits.push("爱吃水果");
      }
      if (this.bodyInfo.foodTypes === "肉类") {
        habits.push("爱吃肉");
      }
      if (this.bodyInfo.foodTypes === "鱼类") {
        habits.push("爱吃鱼");
      }
      if (this.bodyInfo.foodTypes === "豆类") {
        habits.push("爱吃豆类");
      }
      if (this.bodyInfo.foodTypes === "谷物") {
        habits.push("爱吃五谷");
      }

      if (this.bodyInfo.bloodSugar > 7) {
        habits.push("摄入的糖分和生活习惯不好");
      } else {
        habits.push("血糖水平正常");
      }

      if (this.bodyInfo.bloodPressure > 5.2) {
        habits.push("高胆固醇饮食");
      } else {
        habits.push("低胆固醇饮食");
      }

      if (this.bodyInfo.heartRate > 100) {
        habits.push("经常紧张焦虑和压力");
      } else {
        habits.push("心情还不错");
      }

      if (this.bodyInfo.vision > 50) {
        habits.push("熬夜过多过度劳累");
      } else {
        habits.push("准时睡觉");
      }

      if (this.bodyInfo.sleepDuration < 8) {
        habits.push("睡眠不足");
      } else {
        habits.push("睡眠充足");
      }

      if (this.bodyInfo.sleepQuality === "好") {
        habits.push("熬夜过多过度劳累");
      } else if (this.bodyInfo.sleepQuality === "一般") {
        habits.push("需要注意睡眠质量");
      } else if (this.bodyInfo.sleepQuality === "差") {
        habits.push("需要改善睡眠质量");
      }
      if (this.bodyInfo.smoking === true) {
        habits.push("吸烟");
      } else {
        habits.push("不吸烟");
      }

      if (this.bodyInfo.drinking === true) {
        habits.push("饮酒");
      } else {
        habits.push("未饮酒");
      }
      if (this.bodyInfo.exercise === true) {
        habits.push("积极锻炼");
      } else {
        habits.push("缺乏运动");
      }

      if (this.bodyInfo.waterConsumption < 1000) {
        habits.push("饮水不足");
      } else {
        habits.push("饮水充足");
      }

      this.habits = habits.join("，");
    },

    // Drools规则示例
    diseaserisk() {
      if (this.bodyInfo.bloodPressure >= 90) {
        this.risk += "高血压，";
      }
      if (this.bodyInfo.bloodLipid > 3) {
        this.risk += "高血脂，";
      }
      if (this.bodyInfo.bloodSugar > 6.1) {
        this.risk += "糖尿病，";
      }
      if (this.bodyInfo.drinking > 3) {
        this.risk += "酗酒，";
      }
      if (this.bodyInfo.exercise < 3) {
        this.risk += "缺乏运动，";
      }
      if (this.bodyInfo.heartRate > 100) {
        this.risk += "心率过快，";
      }
      if (this.bodyInfo.sleepDuration < 7 || this.bodyInfo.sleepQuality < 3) {
        this.risk += "睡眠不足，";
      }
      if (this.bodyInfo.smoking > 0) {
        this.risk += "肺炎，";
      }
      if (this.bodyInfo.vision <= 300) {
        this.risk += "近视，";
      }
      if (this.bodyInfo.waterConsumption < 1500) {
        this.risk += "结石";
      }
    },

    compareAgeAndHeight() {
      const height = this.bodyInfo.height;
      const sex = this.bodyInfo.sex;
      let Standardhight = null;
      if (sex === "男") {
        Standardhight = (height - 80) * 0.7 + 160;
        this.Standard_hight = ((Standardhight / height) * 1).toFixed(2);
      } else {
        Standardhight = (height - 70) * 0.6 + 160;
        this.Standard_hight = ((Standardhight / height) * 1).toFixed(2);
      }
    },

    supersession() {
      const height = this.bodyInfo.height;
      const weight = this.bodyInfo.weight;
      const age = this.bodyInfo.age;
      const BMR1 = (88.36 + 13.4 * weight + 4.8 * height - 5.7 * age).toFixed(
        2
      );
      const reference = 1200; // 假设BMR的参考值为每天所需热量的1200卡路里

      this.BMR = Math.round((BMR1 / reference) * 100); // 计算BMR占参考值的百分比
    },

    scoreCom() {
      if (this.bodyInfo.vision > 30) {
        this.score = this.score - 25;
      }
      if ((this.risk.match(/,/g) || []).length > 6) {
        console.log((this.risk.match(/,/g) || []).length);
        this.score = this.score - 25;
      }

      if (this.bmi > 24) {
        this.score = this.score - 25;
      }
      if (this.Standard_hight < 80) {
        this.score = this.score - 25;
      }
    },
  },

  watch: {
    bodyInfo: {
      deep: true,
      handler() {
        this.diseaserisk();
        this.compareAgeAndHeight();
        this.supersession();
        this.habits_customs();
        this.scoreCom();
      },
    },
  },

  created() {
    this.getBodyInfo();
  },

  mounted() {},
};
</script>

<style scoped>
.health-assessment-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 120px);
}

/* 顶部统计卡片样式 */
.statistics-cards {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.stat-card {
  flex: 1;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #1976D2, #64B5F6);
  color: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.2);
  transition: transform 0.3s, box-shadow 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(25, 118, 210, 0.3);
}

.stat-icon {
  font-size: 40px;
  margin-right: 20px;
}

.stat-content {
  flex: 1;
}

.stat-title {
  font-size: 16px;
  opacity: 0.9;
  margin-bottom: 5px;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
}

/* 内容区域样式 */
.assessment-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.analysis-section {
  display: flex;
  gap: 20px;
  margin-bottom: 0;
}

/* 卡片通用样式 */
.info-card {
  flex: 1;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
}

.info-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.12);
}

.card-header {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  background-color: #1976D2;
  color: white;
}

.card-header i {
  font-size: 22px;
  margin-right: 10px;
}

.card-header h2 {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.card-body {
  padding: 20px;
  position: relative;
}

/* 信息网格样式 */
.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  width: 70%;
}

.info-item {
  display: flex;
  flex-direction: column;
}

.info-label {
  font-size: 14px;
  color: #606266;
  margin-bottom: 5px;
}

.info-value {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

.unit {
  font-size: 12px;
  color: #909399;
  margin-left: 3px;
}

/* 图片样式 */
.info-image {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  width: 25%;
  max-width: 120px;
}

.card-img {
  width: 100%;
  height: auto;
  border-radius: 5px;
}

/* 分析内容样式 */
.analysis-content {
  width: 100%;
}

.disease-analysis .analysis-content {
  width: 100%;
}

.analysis-item {
  margin-bottom: 15px;
}

.analysis-label {
  font-size: 14px;
  font-weight: 600;
  color: #606266;
  margin-bottom: 5px;
}

.analysis-label.warning {
  color: #F56C6C;
}

.analysis-value {
  font-size: 14px;
  line-height: 1.5;
  color: #303133;
}

.analysis-image {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  width: 25%;
  max-width: 120px;
}

/* 图表容器样式 */
.chart-container {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 20px 0;
}

.chart-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.chart-label {
  margin-top: 15px;
  font-size: 14px;
  color: #606266;
  text-align: center;
}

/* 进度条样式 */
.progress-container {
  margin-bottom: 20px;
}

.custom-progress {
  margin-bottom: 5px;
}

.progress-markers {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #909399;
}

/* 习惯列表样式 */
.habits-list {
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
  line-height: 1.6;
}

/* 响应式布局 */
@media (max-width: 1200px) {
  .statistics-cards {
    flex-direction: row;
    flex-wrap: wrap;
  }
  
  .stat-card {
    flex: 0 0 calc(33.333% - 14px);
  }
  
  .analysis-section {
    flex-direction: column;
  }
  
  .info-card {
    margin-bottom: 20px;
  }
}

@media (max-width: 768px) {
  .statistics-cards {
    flex-direction: column;
  }
  
  .stat-card {
    flex: 1 0 100%;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
    width: 100%;
  }
  
  .info-image,
  .analysis-image {
    position: static;
    width: 100%;
    max-width: none;
    margin-top: 20px;
    transform: none;
    text-align: center;
  }
  
  .card-img {
    max-width: 200px;
  }
  
  .analysis-content {
    width: 100%;
  }
  
  .chart-container {
    flex-direction: column;
    gap: 30px;
  }
}
</style>
