<template>
  <div
    :class="{ 'has-logo': showLogo }"
    :style="{
      backgroundColor:
        settings.sideTheme === 'theme-dark'
          ? variables.menuBackground
          : variables.menuLightBackground
    }"
  >
    <!-- <logo v-if="showLogo" :collapse="isCollapse" /> -->
    <el-scrollbar :class="settings.sideTheme" wrap-class="scrollbar-wrapper" id="cc">
      <el-menu
        class="submenu_fu"
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="
          settings.sideTheme === 'theme-dark'
            ? variables.menuBackground
            : variables.menuLightBackground
        "
        :text-color="
          settings.sideTheme === 'theme-dark'
            ? variables.menuColor
            : variables.menuLightColor
        "
        :unique-opened="true"
        :active-text-color="settings.theme"
        :collapse-transition="false"
        mode="horizontal"
      >

        <sidebar-item
          v-for="(route, index) in sidebarRouters"
          :key="route.path + index"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import SidebarItem from './SidebarItem';
import variables from '@/assets/styles/variables.scss';

export default {
  components: { SidebarItem },
  computed: {
    ...mapState(['settings']),
    ...mapGetters(['sidebarRouters', 'sidebar']),
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo;
    },
    variables() {
      return variables;
    },
    isCollapse() {
      return false;
    }
  },
  methods: {

  }
};
</script>
<style scoped>
@media screen and (min-width: 1920px) {
    ul.submenu_fu.el-menu div {
      float: left;
      min-width: 220px;
      text-align: center;
    }
    ul.submenu_fu.el-menu div:nth-child(4) {
      float: left;
      min-width: 230px;
      margin:0 10px;
      text-align: center;
    }
    .el-menu--horizontal ul:nth-child(4){
      min-width: 240px;
    }
}
@media screen and (max-width: 1920px) {
    ul.submenu_fu.el-menu div {
      float: left;
      min-width: 200px;
      text-align: center;
    }
}

@media screen and (max-width: 1900px) {
    ul.submenu_fu.el-menu div:nth-child(4) {
      float: left;
      min-width: 230px;
      margin:0 10px;
      text-align: center;
    }
    .el-menu--horizontal ul:nth-child(4){
      min-width: 240px;
    }
  
}
ul.submenu_fu.el-menu div:first-child {
  min-width: 100px;
}
/* ul.submenu_fu.el-menu:first-child div {
  min-width: 100px;
} */
.el-menu,.navbar .topmenu-container,.el-menu-item,.el-submenu__title{
    background: none !important;border: none !important;
}
.el-scrollbar__wrap {
    overflow: hidden !important;}
::v-deep .el-scrollbar__bar{display: none !important;}
::v-deep .el-submenu.is-opened,::v-deep .el-submenu__title ,::v-deep .el-menu--popup-bottom-start{
    background: #86ab8d;
}
::v-deep .el-submenu__title i {
    color: #fff;
}
::v-deep .el-menu {
    background: none !important;
}
::v-deep .el-menu--popup-bottom-start {
    background: none !important;
}
::v-deep #cc .el-menu-item {
    background: none !important;
}
</style>

<style lang="scss" scoped>
::v-deep .el-menu-item,::v-deep .nest-menu .el-submenu__title,::v-deep .el-menu {
    background: #30743c85 !important;
    color: #fff !important;
}
::v-deep .el-menu--popup-bottom-start {
    margin-top: 5px;
    background: none !important;
}
.sidebar-container.has-logo {
    display: none;
}
</style>