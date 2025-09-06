<template>
  <div class="dashboard-container">
    <div class="dashboard-header">
      <div class="header-text">个人健康管理系统 - 实时监测您的健康数据</div>
      <div class="header-tips">坚持健康生活，定期检查身体状况</div>
    </div>

    <el-row class="info-cards" :gutter="20">
      <el-col :span="6">
        <div class="info-card">
          <div class="info-card-content">
            <div class="info-card-title">身高</div>
            <div class="info-card-value">
              {{ this.bodyInfo.height }}<span class="unit">/m</span>
            </div>
          </div>
          <div class="info-card-icon">
            <i class="el-icon-user-solid"></i>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="info-card">
          <div class="info-card-content">
            <div class="info-card-title">体重</div>
            <div class="info-card-value">
              {{ this.bodyInfo.weight }}<span class="unit">/kg</span>
            </div>
          </div>
          <div class="info-card-icon">
            <i class="el-icon-odometer"></i>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="info-card">
          <div class="info-card-content">
            <div class="info-card-title">BMI</div>
            <div class="info-card-value">{{ this.bmi }}</div>
          </div>
          <div class="info-card-icon">
            <i class="el-icon-date"></i>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="info-card">
          <div class="info-card-content">
            <div class="info-card-title">年龄</div>
            <div class="info-card-value">{{ this.bodyInfo.age }}</div>
          </div>
          <div class="info-card-icon">
            <i class="el-icon-s-data"></i>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row class="chart-row" :gutter="20">
      <el-col :span="8">
        <div class="chart-card">
          <div class="chart-container" ref="myChart"></div>
    </div>
      </el-col>

      <el-col :span="8">
        <div class="chart-card">
          <div id="chart-container" class="chart-container"></div>
      </div>
      </el-col>

      <el-col :span="8">
        <div class="chart-card">
          <div id="chart-containerLine" class="chart-container"></div>
      </div>
      </el-col>
    </el-row>
  </div>
</template>



<script>
import * as echarts from "echarts";

import userApi from "@/api/userManage";
import FunctionApi from "@/api/Function_Menu";
export default {
  data() {
    return {
      charts: "",
      bodyInfo: "",
      bmi: null,
      score: null,
      BodyNotesInfo: "",

      vision: [],
      waterConsumption: [],
      bloodSugar: [],
      bloodPressure: [],
      date: [],
      heartRate: [],
    };
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


    async getBodyNotes() {
      try {
  
        const response = await FunctionApi.getBodyNotes(this.bodyInfo.id);

        // 从返回结果中获取 BodyNotesInfo，并赋值给组件的 BodyNotesInfo 属性
        this.BodyNotesInfo = response.data;

        // 遍历 BodyNotesInfo 数组中的每一个元素，将其各个属性值分别添加到对应的数组中,note包含每一条数据的对象
        this.BodyNotesInfo.forEach((note) => {
          this.vision.push(note.vision);
          this.waterConsumption.push(note.waterConsumption);
          this.bloodSugar.push(note.bloodSugar);
          this.bloodPressure.push(note.bloodPressure);
          this.heartRate.push(note.heartRate);
          const formattedDate = new Date(note.date).toLocaleString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          });
          this.date.push(formattedDate);
        });
      } catch (error) {
        console.log("获取身体信息错误");
      }
    },

    bmiM() {
      // 从bodyInfo中获取身高和体重的值，并转换为 Number 类型
      const weight = Number(this.bodyInfo.weight);
      // 计算BMI值
      const bmiValue = weight / (this.bodyInfo.height * this.bodyInfo.height);
      // 返回计算结果并保留两位小数
      this.bmi = bmiValue.toFixed(2);
      return bmiValue.toFixed(2);
    },

    BarChart() {
      const chartDom = document.getElementById("chart-container");
      const myChart = echarts.init(chartDom);

      const option = {
        color: ["#4e9eff"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "5%",
          top: "15%",
          containLabel: true,
        },
        title: {
          text: "视力变化趋势图",
          textStyle: {
            fontWeight: "normal",
            fontSize: 18,
            color: "#333",
          },
          left: "center",
          top: 15,
          padding: [10, 10, 0, 10],
        },
        xAxis: [
          {
            type: "category",
            data: this.date,
            axisTick: {
              alignWithLabel: true,
            },
            axisLabel: {
              interval: 1, //设置X轴文字显示间隔
              rotate: 45, //设置X轴文字旋转角度
              textStyle: {
                fontSize: 12, //设置X轴文字样式
              },
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            axisLabel: {
              textStyle: {
                fontSize: 12, //设置Y轴文字样式
              },
            },
          },
        ],
        series: [
          {
            name: "视力",
            type: "bar",
            barWidth: "60%",
            data: this.vision,
            itemStyle: {
              // 渐变色
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#83bff6' },
                { offset: 0.5, color: '#4e9eff' },
                { offset: 1, color: '#188df0' }
              ]),
              // 阴影的大小
              shadowBlur: 10,
              // 阴影水平方向上的偏移
              shadowOffsetX: 0,
              // 阴影垂直方向上的偏移
              shadowOffsetY: 5,
              // 阴影颜色
              shadowColor: "rgba(0, 0, 0, 0.2)",
              // 柱状图圆角
              barBorderRadius: [4, 4, 0, 0],
            },
          },
        ],
      };

      myChart.setOption(option);
    },
    area() {
      const chartDom = document.getElementById("chart-containerLine");
      const myChart = echarts.init(chartDom);

      const option = {
        title: {
          text: "血压血糖变化趋势图",
          textStyle: {
            fontWeight: "normal",
            fontSize: 18,
            color: "#333",
          },
          left: "center",
          top: 15,
          padding: [10, 10, 0, 10],
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: ["血压", "血糖"],
          bottom: 10,
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '15%',
          top: '15%',
          containLabel: true
        },
        xAxis: {
          type: "category",
          data: this.date,
          axisLabel: {
            interval: 1, //设置X轴文字显示间隔
            textStyle: {
              fontSize: 12, //设置X轴文字样式
            },
          },
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: "血压",
            data: this.bloodPressure,
            type: "line",
            smooth: true,
            symbol: 'circle',
            symbolSize: 8,
            lineStyle: {
              width: 3,
              color: '#3498db'
            },
            itemStyle: {
              color: '#3498db',
              borderColor: '#fff',
              borderWidth: 2
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgba(52, 152, 219, 0.5)'
                },
                {
                  offset: 1,
                  color: 'rgba(52, 152, 219, 0.1)'
                }
              ])
            },
          },
          {
            name: "血糖",
            data: this.bloodSugar,
            type: "line",
            smooth: true,
            symbol: 'circle',
            symbolSize: 8,
            lineStyle: {
              width: 3,
              color: '#2ecc71'
            },
            itemStyle: {
              color: '#2ecc71',
              borderColor: '#fff',
              borderWidth: 2
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgba(46, 204, 113, 0.5)'
                },
                {
                  offset: 1,
                  color: 'rgba(46, 204, 113, 0.1)'
                }
              ])
            },
          },
        ],
      };

      myChart.setOption(option);
    },
  },

  watch: {
    bodyInfo: {
      deep: true, //监听对象内部属性的变化
      async handler() {
        this.bmiM(); // 计算BMI值
        await this.getBodyNotes(); // 获取身体数据信息
        this.BarChart();
        this.area();
        const chartDom = this.$refs.myChart;
        const myChart = echarts.init(chartDom);

        const option = {
          title: {
            text: "心率变化趋势图",
            textStyle: {
              fontWeight: "normal",
              fontSize: 18,
              color: "#333",
            },
            left: "center",
            top: 15,
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top: '15%',
            containLabel: true
          },
          xAxis: {
            type: "category",
            data: this.date,
            axisLabel: {
              fontSize: 12,
              interval: 2,
            },
            axisTick: {
              show: false,
            },
          },
          yAxis: {
            type: "value",
            axisLine: {
              show: false,
            },
            splitLine: {
              lineStyle: {
                type: "dashed",
                color: "#ddd",
              },
            },
            axisTick: {
              show: false,
            },
          },
          tooltip: {
            trigger: "axis",
            formatter: function (params) {
              return params[0].name + "：" + params[0].value;
            },
          },
          series: [
            {
              data: this.heartRate,
              type: "line",
              smooth: true,
              lineStyle: {
                width: 3,
                color: "#e74c3c",
              },
              symbol: "circle",
              symbolSize: 8,
              itemStyle: {
                color: "#e74c3c",
                borderColor: "#fff",
                borderWidth: 2,
              },
              areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: 'rgba(231, 76, 60, 0.5)'
                  },
                  {
                    offset: 1,
                    color: 'rgba(231, 76, 60, 0.1)'
                  }
                ])
              },
              markLine: {
                data: [
                  {
                    type: "average",
                    name: "平均值",
                  },
                ],
                label: {
                  position: "insideEndBottom",
                  formatter: "{b}：{c}",
                },
                lineStyle: {
                  type: "dashed",
                  color: "green",
                  width: 2,
                },
                symbol: "none",
              },
              animation: true,
              animationDuration: 3000,
              animationEasing: "cubicInOut",
            },
          ],
        };

        myChart.setOption(option);
      },
    },
  },

  created() {
    this.getBodyInfo();
  },

  async mounted() {},
};
</script>
<style scoped>
.dashboard-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 120px);
  display: flex;
  flex-direction: column;
}

.dashboard-header {
  margin-bottom: 20px;
  padding: 20px;
  background: linear-gradient(120deg, #1976d2, #4e9eff);
  text-align: center;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.12);
  color: #ffffff;
}

.header-text {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 10px;
}

.header-tips {
  font-size: 16px;
  opacity: 0.9;
}

/* 信息卡片样式 */
.info-cards {
  margin-bottom: 30px;
}

.info-card {
  height: 140px;
  background: linear-gradient(120deg, #ffffff, #f9f9f9);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.info-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.info-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 6px;
  height: 100%;
  background: linear-gradient(to bottom, #4e9eff, #1976d2);
}

.info-card-content {
  display: flex;
  flex-direction: column;
}

.info-card-title {
  font-size: 18px;
  font-weight: 600;
  color: #606266;
  margin-bottom: 15px;
}

.info-card-value {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
}

.info-card-icon {
  font-size: 60px;
  color: rgba(78, 158, 255, 0.8);
  margin-right: 10px;
}

.unit {
  font-size: 18px;
  font-weight: normal;
  margin-left: 5px;
  color: #909399;
}

/* 图表卡片样式 */
.chart-row {
  margin-top: 30px;
  flex: 1;
  display: flex;
  align-items: stretch;
}

.chart-card {
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  padding: 20px;
  height: 450px;
  transition: all 0.3s ease;
  margin-bottom: 30px;
}

.chart-card:hover {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.chart-container {
  width: 100%;
  height: 100%;
}

/* 响应式调整 */
@media (max-height: 900px) {
  .chart-card {
    height: 400px;
}
}

@media (min-height: 1000px) {
  .chart-card {
    height: 500px;
  }
}
</style>