<template>
  <div
    :class="classObj"
    class="app-wrapper"
    :style="{ '--current-color': theme }"
  >
    <div
      v-if="device === 'mobile' && sidebar.opened"
      class="drawer-bg"
      @click="handleClickOutside"
    />
    <sidebar class="sidebar-container" />
    <div :class="{ hasTagsView: needTagsView }" class="container">
      <div :class="{ 'fixed-header': fixedHeader }">
        <navbar />
        <!-- <tags-view v-if="needTagsView" /> -->
      </div>
      <!-- 首页组件 -->
      <app-main />
      <right-panel>
        <settings />
        
      </right-panel>

      <!-- 占位测试 -->
      <!-- <div style="height: 2000px">占位测试回到顶部</div> -->
      <!-- <el-backtop target=".el-main" :bottom="100">
          <div
            .
            style="
              height: 100%;
              width: 100%;
              background-color: #f2f5f6;
              box-shadow: 0 0 6px rgba(0, 0, 0, 0.12);
              text-align: center;
              line-height: 40px;
              color: #1989fa;
            "
          >
            UP
          </div>
        </el-backtop> -->
    </div>
  </div>
</template>

<script>
import RightPanel from '@/components/RightPanel';
import { AppMain, Navbar, Settings, Sidebar, TagsView } from './components';
import ResizeMixin from './mixin/ResizeHandler';
import { mapState } from 'vuex';
import variables from '@/assets/styles/variables.scss';

export default {
  name: 'Layout',
  components: {
    AppMain,
    Navbar,
    RightPanel,
    Settings,
    Sidebar,
    TagsView
  },
  mixins: [ResizeMixin],
  computed: {
    ...mapState({
      theme: (state) => state.settings.theme,
      sideTheme: (state) => state.settings.sideTheme,
      sidebar: (state) => state.app.sidebar,
      device: (state) => state.app.device,
      needTagsView: (state) => state.settings.tagsView,
      fixedHeader: (state) => state.settings.fixedHeader
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      };
    },
    variables() {
      return variables;
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false });
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~@/assets/styles/mixin.scss';
@import '~@/assets/styles/variables.scss';

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$base-sidebar-width});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}
// 头部固定  app-mian高度溢出时产生滚动条
.app-main{
  height: calc(100vh - 80px);
  overflow-y: auto;
  // padding: 0 50px;
}
</style>
