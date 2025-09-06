<template>
  <div class="sport-detail-container">
    <!-- 顶部导航栏 -->
    <div class="header">
      <div class="back-button" @click="home">
        <i class="el-icon-arrow-left"></i>
        <span>返回运动列表</span>
      </div>
      <div class="sport-title">{{ detailInfo.sportType }}</div>
      <div class="placeholder"></div>
    </div>

    <!-- 主要内容区域 -->
    <div class="content-container">
      <!-- 运动信息卡片 -->
      <div class="info-card">
        <div class="sport-image-container">
          <el-image
            :src="getSportImage(detailInfo.sportType)"
            fit="cover"
            class="sport-image"
          >
            <div slot="error" class="image-placeholder">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
          <div class="sport-type-badge">{{ detailInfo.sportType }}</div>
        </div>

        <div class="sport-info">
          <h1 class="info-title">
            <i class="el-icon-data-analysis"></i>
            运动详情
          </h1>
          
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">
                <i class="el-icon-time"></i>
                适宜时间
              </div>
              <div class="info-value">{{ detailInfo.suitableTime }}</div>
            </div>
            
            <div class="info-item">
              <div class="info-label">
                <i class="el-icon-bangzhu"></i>
                运动心率
              </div>
              <div class="info-value">{{ detailInfo.suitableHeartRate }}</div>
            </div>
            
            <div class="info-item">
              <div class="info-label">
                <i class="el-icon-date"></i>
                适宜频率
              </div>
              <div class="info-value">{{ detailInfo.suitableFrequency }}</div>
            </div>
            
            <div class="info-item">
              <div class="info-label">
                <i class="el-icon-odometer"></i>
                推荐速度
              </div>
              <div class="info-value">{{ detailInfo.recommendedSpeed || '无' }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 详细信息选项卡 -->
      <div class="detail-tabs">
        <div class="tab-buttons">
          <button 
            class="tab-button" 
            :class="{ active: showForbiddenDiseases }" 
            @click="showBox('forbiddenDiseases')"
          >
            <i class="el-icon-warning-outline"></i>
            禁忌疾病
          </button>
          <button 
            class="tab-button" 
            :class="{ active: showMethodIntroduction }" 
            @click="showBox('methodIntroduction')"
          >
            <i class="el-icon-document"></i>
            方法介绍
          </button>
          <button 
            class="tab-button" 
            :class="{ active: showAttentionItems }" 
            @click="showBox('attentionItems')"
          >
            <i class="el-icon-info"></i>
            注意事项
          </button>
        </div>

        <div class="tab-content">
          <transition name="fade" mode="out-in">
            <div class="content-card" v-if="showForbiddenDiseases">
              <div class="content-header">
                <i class="el-icon-warning-outline"></i>
                {{ detailInfo.sportType }}禁忌疾病
              </div>
              <div class="content-body">{{ detailInfo.disease || '暂无相关禁忌疾病信息' }}</div>
            </div>

            <div class="content-card" v-else-if="showMethodIntroduction">
              <div class="content-header">
                <i class="el-icon-document"></i>
                {{ detailInfo.sportType }}方法介绍
              </div>
              <div class="content-body">{{ detailInfo.method || '暂无相关方法介绍' }}</div>
            </div>

            <div class="content-card" v-else-if="showAttentionItems">
              <div class="content-header">
                <i class="el-icon-info"></i>
                {{ detailInfo.sportType }}注意事项
              </div>
              <div class="content-body">{{ detailInfo.notes || '暂无相关注意事项' }}</div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      detailInfo: {},
      showForbiddenDiseases: true,
      showMethodIntroduction: false,
      showAttentionItems: false,
    };
  },
  mounted() {
    const detailInfo = this.$route.query;
    this.detailInfo = detailInfo;
  },
  methods: {
    getSportImage(sportType) {
      const imageMap = {
        '普拉提': 'https://qcloud.dpfile.com/pc/GnPE7h5vDQr7TSlsbxU6Mcm_tNXYQsm3GwZqLvsJ2tXDySTQFYKYTEfrlEqrDyDt.jpg',
        '跑步机爬坡': 'https://imgservice.suning.cn/uimg1/b2c/image/Wi7g22vz8PZEm-D1WDPDgQ.jpg_800w_800h_4e',
        '踢毽子': 'https://img2.baidu.com/it/u=1578950104,2862850241&fm=253&fmt=auto&app=138&f=JPEG?w=750&h=500',
        '足球': 'https://cdn.k618img.cn/news.k618.cn/shizheng/yw/202212/W020221215757143999892.jpeg',
        '慢跑': 'https://q3.itc.cn/images01/20240303/0f7191ddbd504cd58af2eff687fdd947.jpeg',
        '太极拳': 'https://img0.baidu.com/it/u=3710058184,1150652747&fm=253&fmt=auto&app=120&f=JPEG?w=948&h=711',
        '饭后慢走': 'https://pic.rmb.bdstatic.com/bjh/news/c711c5b1ea0052d4ef1d4193cb2288a43501.jpeg',
        '羽毛球': 'https://dingyue.ws.126.net/KDl0ByjLstLLrx3NJHNFWHWwWAPFmjJ9ZfWPGF6I1=6VH1534509561915compressflag.jpg',
        '爬山': 'https://p2.itc.cn/images01/20230518/4fd6d93983894110a0ad94924c936262.jpeg',
        '游泳': 'https://image.zsbtv.com.cn/images/2021/3/1/2021311614593116132_198.jpg',
        '网球': 'https://q1.itc.cn/q_70/images01/20240311/b72c7b15776b4c95a074e907183da594.jpeg',
        '抖空竹': 'https://img0.baidu.com/it/u=1866917310,2855531376&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
        '扔沙袋': 'https://img0.baidu.com/it/u=1665905460,2691433460&fm=253&fmt=auto&app=120&f=JPEG?w=884&h=500',
        '抽陀螺': 'https://img2.baidu.com/it/u=2676606477,859758739&fm=253&fmt=auto&app=120&f=JPEG?w=607&h=400',
        '跆拳道': 'https://img.wifiwx.com/material/news/img/2018/11/ecdc969d7d62b41b4ef79aa75cbb8b93.jpg',
        '拔河': 'https://img1.baidu.com/it/u=1391460378,1175215610&fm=253&fmt=auto&app=120&f=JPEG?w=750&h=500',
        '放风筝': 'https://img2.baidu.com/it/u=2786343211,2427483045&fm=253&fmt=auto&app=120&f=JPEG?w=750&h=500',
        '瑜伽': 'https://img0.baidu.com/it/u=1842809601,1348925751&fm=253&fmt=auto&app=120&f=JPEG?w=642&h=500',
        '跳绳': 'https://img2.baidu.com/it/u=2538064209,1984137071&fm=253&fmt=auto&app=120&f=JPEG?w=1200&h=800',
        '越野跑': 'https://p5.toutiaoimg.com/origin/pgc-image/09530a0e2471422f9854cc7436c4ad97?from=pc'
      };
      
      return imageMap[sportType] || 'https://p5.toutiaoimg.com/origin/pgc-image/09530a0e2471422f9854cc7436c4ad97?from=pc';
    },
    
    showBox(box) {
      this.showForbiddenDiseases = box === 'forbiddenDiseases';
      this.showMethodIntroduction = box === 'methodIntroduction';
      this.showAttentionItems = box === 'attentionItems';
    },

    home() {
      this.$router.push({ path: "/" });
    }
  }
};
</script>

<style scoped>
.sport-detail-container {
  min-height: 100vh;
  background-color: #f5f7fa;
  padding-bottom: 30px;
}

/* 顶部导航栏 */
.header {
  height: 60px;
  background: linear-gradient(135deg, #1976D2, #64B5F6);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 10;
}

.back-button {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.back-button:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.back-button i {
  margin-right: 8px;
  font-size: 18px;
}

.sport-title {
  font-size: 18px;
  font-weight: 600;
}

.placeholder {
  width: 100px;
}

/* 内容区域 */
.content-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* 运动信息卡片 */
.info-card {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  margin-bottom: 30px;
  display: flex;
  flex-direction: row;
}

.sport-image-container {
  width: 40%;
  position: relative;
}

.sport-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #f0f2f5;
  color: #909399;
}

.image-placeholder i {
  font-size: 48px;
}

.sport-type-badge {
  position: absolute;
  bottom: 20px;
  left: 20px;
  background-color: rgba(25, 118, 210, 0.9);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 500;
}

.sport-info {
  width: 60%;
  padding: 30px;
}

.info-title {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  margin-top: 0;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
}

.info-title i {
  margin-right: 10px;
  color: #1976D2;
  font-size: 28px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 25px;
}

.info-item {
  padding-bottom: 15px;
  border-bottom: 1px dashed #e0e0e0;
}

.info-label {
  display: flex;
  align-items: center;
  color: #606266;
  margin-bottom: 8px;
  font-size: 14px;
}

.info-label i {
  margin-right: 8px;
  color: #1976D2;
  font-size: 18px;
}

.info-value {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

/* 详细信息选项卡 */
.detail-tabs {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.tab-buttons {
  display: flex;
  border-bottom: 1px solid #e0e0e0;
  background-color: #f9fafc;
}

.tab-button {
  flex: 1;
  padding: 16px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  color: #606266;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tab-button i {
  margin-right: 8px;
  font-size: 18px;
}

.tab-button:hover {
  color: #1976D2;
  background-color: rgba(25, 118, 210, 0.05);
}

.tab-button.active {
  color: #1976D2;
  border-bottom: 3px solid #1976D2;
  background-color: white;
}

.tab-content {
  min-height: 300px;
}

.content-card {
  padding: 20px;
}

.content-header {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.content-header i {
  margin-right: 10px;
  color: #1976D2;
  font-size: 20px;
}

.content-body {
  font-size: 16px;
  line-height: 1.8;
  color: #606266;
  white-space: pre-wrap;
}

/* 动画效果 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .info-card {
    flex-direction: column;
  }
  
  .sport-image-container {
    width: 100%;
    height: 250px;
  }
  
  .sport-info {
    width: 100%;
    padding: 20px;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .tab-button {
    padding: 12px 8px;
    font-size: 14px;
  }
  
  .tab-button i {
    margin-right: 5px;
  }
  
  .content-header {
    font-size: 16px;
  }
  
  .content-body {
    font-size: 14px;
  }
}
</style>
