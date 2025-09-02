<template>
  <div :class="{'has-logo':showLogo}" class="sidebar-container">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <div class="sidebar-title-container" v-if="!isCollapse && !showLogo">
      <h2 class="sidebar-main-title">
        个人健康管理系统
      </h2>
    </div>
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="true"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
        class="custom-menu"
        router
      >
        <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters([
      'sidebar'

    ]),
    routes() {
      return this.$router.options.routes.concat(global.myRoutes);
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebar-container {
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.2);
  transition: width 0.28s;
  
  .sidebar-title-container {
    height: 60px;
    line-height: 60px;
    text-align: center;
    background: linear-gradient(to right, rgba(255,255,255,0.05), rgba(255,255,255,0.1), rgba(255,255,255,0.05));
    border-bottom: 1px solid rgba(255,255,255,0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    
    .sidebar-main-title {
      margin: 0;
      color: #ffffff;
      font-size: 16px;
      font-weight: 600;
      letter-spacing: 1px;
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      padding: 0 10px;
    }
  }
  
  .custom-menu {
    border-right: none;
    
    &::after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      width: 1px;
      height: 100%;
      background-color: rgba(255, 255, 255, 0.1);
    }
    
    // 增强菜单项的样式
    ::v-deep .el-menu-item {
      position: relative;
      transition: all 0.3s ease;
      
      &:hover {
        background-color: rgba(255, 255, 255, 0.1) !important;
      }
      
      &.is-active {
        background-color: rgba(255, 255, 255, 0.15) !important;
        color: #ffffff !important;
        font-weight: bold;
        
        &::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          width: 4px;
          background: #ffffff;
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
        }
      }
    }
  }
  
  .scrollbar-wrapper {
    overflow-x: hidden !important;
    
    // 自定义滚动条样式
    ::v-deep .el-scrollbar__bar.is-vertical {
      width: 6px;
      right: 0;
      
      .el-scrollbar__thumb {
        background-color: rgba(255, 255, 255, 0.3);
        border-radius: 3px;
      }
    }
  }
}
</style>
