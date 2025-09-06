<template>
  <div class="sport-knowledge-container">
    <!-- 页面标题区域 -->
    <div class="page-header">
      <div class="header-content">
        <div class="title-container">
          <i class="el-icon-data-analysis"></i>
          <h1>运动知识库</h1>
        </div>
        <p class="subtitle">探索各类运动知识，培养健康生活方式</p>
      </div>
      <div class="search-container">
        <el-input
          placeholder="搜索运动项目..."
          v-model="searchText"
          class="search-input"
          prefix-icon="el-icon-search"
          @keyup.enter.native="Search"
          clearable
        >
          <el-button slot="append" icon="el-icon-search" @click="Search"></el-button>
        </el-input>
      </div>
    </div>

    <!-- 运动卡片展示区域 -->
    <div class="sport-cards-container">
      <el-row :gutter="24">
        <el-col :xs="24" :sm="12" :md="8" v-for="(sportInfo, index) in sportInfos" :key="index">
          <div class="sport-card" :class="`sport-card-${index % 5}`">
            <div class="card-header">
              <h2>{{ sportInfo.sportType }}</h2>
              <div class="sport-icon">
                <i :class="getSportIcon(sportInfo.sportType)"></i>
              </div>
            </div>
            <div class="card-content">
              <div class="info-item">
                <div class="info-label"><i class="el-icon-time"></i> 适宜时间</div>
                <div class="info-value">{{ sportInfo.suitableTime }}</div>
              </div>
              <div class="info-item">
                <div class="info-label"><i class="el-icon-bangzhu"></i> 适宜心率</div>
                <div class="info-value">{{ sportInfo.suitableHeartRate }}</div>
              </div>
              <div class="info-item">
                <div class="info-label"><i class="el-icon-date"></i> 适宜频率</div>
                <div class="info-value">{{ sportInfo.suitableFrequency }}</div>
              </div>
              <div class="info-item">
                <div class="info-label"><i class="el-icon-odometer"></i> 推荐速度</div>
                <div class="info-value">{{ sportInfo.recommendedSpeed || '无' }}</div>
              </div>
            </div>
            <div class="card-footer">
              <el-button 
                type="primary" 
                class="detail-button"
                @click="goToDetail(sportInfo.sportType, sportInfo)"
              >
                <i class="el-icon-view"></i> 查看详情
              </el-button>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 无数据提示 -->
    <div class="empty-state" v-if="sportInfos.length === 0">
      <i class="el-icon-warning-outline"></i>
      <p>暂无相关运动知识，请尝试其他搜索关键词</p>
      <el-button type="primary" @click="showSearch">重新加载</el-button>
    </div>

    <!-- 搜索对话框 -->
    <el-dialog 
      title="搜索健康知识" 
      :visible.sync="showDialog" 
      width="30%" 
      center
      custom-class="search-dialog"
    >
      <el-input
        placeholder="请输入运动名称关键词"
        v-model="searchText"
        prefix-icon="el-icon-search"
        clearable
      ></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="Search">搜索</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import sportApi from "@/api/Function_Menu";

export default {
  data() {
    return {
      showDialog: false,
      searchText: "",
      sportInfos: [],
      DetailInfo: [],
    };
  },

  async created() {
    await this.showSearch();
  },

  methods: {
    getSportIcon(sportType) {
      // 根据运动类型返回对应的图标
      const iconMap = {
        '越野跑': 'el-icon-position',
        '瑜伽': 'el-icon-sunny',
        '羽毛球': 'el-icon-baseball',
        '慢跑': 'el-icon-s-promotion',
        '跑步': 'el-icon-s-flag',
        '太极拳': 'el-icon-s-cooperation',
        '游泳': 'el-icon-ship',
        '篮球': 'el-icon-basketball',
        '足球': 'el-icon-football'
      };
      
      return iconMap[sportType] || 'el-icon-data-analysis';
    },

    goToDetail(sportName, sportInfo) {
      sportApi
        .DetailInfo(sportName)
        .then((response) => {
          const detailInfo = response.data;
          // 将this.DetailInfo与sportInfo合并
          const mergedInfo = { ...detailInfo, ...sportInfo };
          // 传递参数并跳转
          this.$router.push({ path: "/detail", query: mergedInfo });
        })
        .catch((error) => {
          console.error(error);
          this.$message({
            message: "获取详情失败，请稍后再试",
            type: "error"
          });
        });
    },

    closeDialog() {
      this.showDialog = false;
    },

    showSearchBox() {
      this.searchText = ""; // 重置搜索框
      this.showDialog = true;
    },

    async showSearch() {
      try {
        const response = await sportApi.getAllSportInfo();
        // 取得运动信息数组
        const sportInfoData = response.data.sportInfos;
        const sportInfos = sportInfoData.slice();
        // 重构每条运动信息的数据格式
        this.sportInfos = sportInfos.map((info) => ({
          id: info.id,
          sportType: info.sportType,
          suitableTime: info.suitableTime,
          suitableHeartRate: info.suitableHeartRate,
          suitableFrequency: info.suitableFrequency,
          recommendedSpeed: info.recommendedSpeed,
        }));
        this.$message({
          message: "加载成功",
          type: "success",
          duration: 1500
        });
      } catch (error) {
        console.log(error);
        this.$message({
          message: "加载失败，请稍后再试",
          type: "error"
        });
      }
    },

    async Search() {
      try {
        if (!this.searchText.trim()) {
          await this.showSearch();
          this.showDialog = false;
          return;
        }

        const response = await sportApi.getAllSportInfo();
        const sportInfoData = response.data.sportInfos;
        // 根据输入的搜索内容进行过滤
        const filteredSportInfoData = sportInfoData.filter((info) => {
          return info.sportType.includes(this.searchText);
        });
        // 重构每条运动信息的数据格式
        const sportInfos = filteredSportInfoData.map((info) => ({
          id: info.id,
          sportType: info.sportType,
          suitableTime: info.suitableTime,
          suitableHeartRate: info.suitableHeartRate,
          suitableFrequency: info.suitableFrequency,
          recommendedSpeed: info.recommendedSpeed,
        }));
        // 更新运动信息列表
        this.sportInfos = sportInfos;
        // 隐藏搜索框
        this.showDialog = false;
        
        if (sportInfos.length > 0) {
          this.$message({
            message: `找到 ${sportInfos.length} 条相关运动知识`,
            type: "success",
            duration: 1500
          });
        } else {
          this.$message({
            message: "未找到相关运动知识",
            type: "warning",
            duration: 1500
          });
        }
      } catch (error) {
        console.log(error);
        this.$message({
          message: "搜索失败，请稍后再试",
          type: "error"
        });
      }
    },
  },
};
</script>

<style scoped>
.sport-knowledge-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 120px);
}

/* 页面标题区域 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  background-color: #fff;
  border-radius: 10px;
  padding: 20px 30px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.title-container {
  display: flex;
  align-items: center;
}

.title-container i {
  font-size: 32px;
  color: #1976D2;
  margin-right: 15px;
}

.title-container h1 {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

.subtitle {
  color: #606266;
  margin: 5px 0 0 47px;
  font-size: 14px;
}

.search-container {
  width: 300px;
}

.search-input {
  border-radius: 20px;
}

/* 运动卡片样式 */
.sport-cards-container {
  margin-bottom: 30px;
}

.sport-card {
  height: 100%;
  background-color: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  border-top: 4px solid #1976D2;
}

.sport-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

/* 不同类型运动卡片的顶部边框颜色 */
.sport-card-0 { border-top-color: #1976D2; } /* 蓝色 */
.sport-card-1 { border-top-color: #4CAF50; } /* 绿色 */
.sport-card-2 { border-top-color: #FF9800; } /* 橙色 */
.sport-card-3 { border-top-color: #9C27B0; } /* 紫色 */
.sport-card-4 { border-top-color: #F44336; } /* 红色 */

.card-header {
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;
}

.card-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #303133;
}

.sport-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: #f5f7fa;
}

.sport-icon i {
  font-size: 22px;
  color: #1976D2;
}

.sport-card-0 .sport-icon i { color: #1976D2; }
.sport-card-1 .sport-icon i { color: #4CAF50; }
.sport-card-2 .sport-icon i { color: #FF9800; }
.sport-card-3 .sport-icon i { color: #9C27B0; }
.sport-card-4 .sport-icon i { color: #F44336; }

.card-content {
  padding: 20px;
  flex-grow: 1;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px dashed #f0f0f0;
}

.info-item:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.info-label {
  display: flex;
  align-items: center;
  color: #606266;
  font-size: 14px;
}

.info-label i {
  margin-right: 5px;
  font-size: 16px;
}

.info-value {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
}

.card-footer {
  padding: 15px 20px;
  background-color: #f9fafc;
  text-align: center;
}

.detail-button {
  width: 100%;
  border-radius: 20px;
  background: linear-gradient(135deg, #1976D2, #64B5F6);
  border: none;
  transition: all 0.3s ease;
}

.detail-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(25, 118, 210, 0.3);
  background: linear-gradient(135deg, #1565C0, #1976D2);
}

.sport-card-0 .detail-button { background: linear-gradient(135deg, #1976D2, #64B5F6); }
.sport-card-0 .detail-button:hover { background: linear-gradient(135deg, #1565C0, #1976D2); }

.sport-card-1 .detail-button { background: linear-gradient(135deg, #4CAF50, #8BC34A); }
.sport-card-1 .detail-button:hover { background: linear-gradient(135deg, #388E3C, #4CAF50); }

.sport-card-2 .detail-button { background: linear-gradient(135deg, #FF9800, #FFCA28); }
.sport-card-2 .detail-button:hover { background: linear-gradient(135deg, #F57C00, #FF9800); }

.sport-card-3 .detail-button { background: linear-gradient(135deg, #9C27B0, #BA68C8); }
.sport-card-3 .detail-button:hover { background: linear-gradient(135deg, #7B1FA2, #9C27B0); }

.sport-card-4 .detail-button { background: linear-gradient(135deg, #F44336, #FF7043); }
.sport-card-4 .detail-button:hover { background: linear-gradient(135deg, #D32F2F, #F44336); }

/* 无数据状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 0;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.empty-state i {
  font-size: 60px;
  color: #909399;
  margin-bottom: 20px;
}

.empty-state p {
  color: #606266;
  margin-bottom: 20px;
  font-size: 16px;
}

/* 搜索对话框 */
.search-dialog >>> .el-dialog__header {
  padding: 20px;
  background-color: #1976D2;
  color: white;
}

.search-dialog >>> .el-dialog__title {
  color: white;
  font-weight: 500;
}

.search-dialog >>> .el-dialog__body {
  padding: 30px;
}

.search-dialog >>> .el-dialog__footer {
  padding: 15px 20px 20px;
  text-align: center;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .search-container {
    width: 100%;
    margin-top: 20px;
  }
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .sport-icon {
    margin-top: 10px;
  }
  
  .info-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .info-value {
    margin-top: 5px;
  }
}
</style>