<template>
  <div class="navbar">
    <img class="logo" src="@/assets/logo/dwlogo.jpeg" />
    <!-- 面包屑 -->
    <breadcrumb
      id="breadcrumb-container"
      class="breadcrumb-container"
      v-if="!topNav"
    />
    <top-nav id="topmenu-container" class="topmenu-container" v-if="topNav" />
    <div class="right-menu">
      <template v-if="device !== 'mobile'">
        <!-- 搜索 -->
        <!-- <search id="header-search" class="right-menu-item" /> -->

        <!-- <el-tooltip content="源码地址" effect="dark" placement="bottom">
          <ruo-yi-git id="ruoyi-git" class="right-menu-item hover-effect" />
        </el-tooltip> -->

        <!-- <el-tooltip content="文档地址" effect="dark" placement="bottom">
          <ruo-yi-doc id="ruoyi-doc" class="right-menu-item hover-effect" />
        </el-tooltip> -->

        <!-- 全屏显示 -->
        <!-- <screenfull id="screenfull" class="right-menu-item hover-effect" /> -->

        <!-- <el-tooltip content="布局大小" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip> -->
      </template>

      <el-dropdown
        class="avatar-container right-menu-item hover-effect"
        trigger="hover"
      >
        <div class="avatar-wrapper">
          <img :src="avatar" class="user-avatar" />
          <!-- <i class="el-icon-caret-bottom" /> -->
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/user/profile">
            <el-dropdown-item>个人中心</el-dropdown-item>
          </router-link>
          <!-- <el-dropdown-item @click.native="setting = true">
            <span>布局设置</span>
          </el-dropdown-item> -->
          <el-dropdown-item divided @click.native="logout">
            <span>退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import TopNav from "@/components/TopNav";
import Hamburger from "@/components/Hamburger";
import Screenfull from "@/components/Screenfull";
// import SizeSelect from '@/components/SizeSelect'
// import Search from '@/components/HeaderSearch'
// import RuoYiGit from '@/components/RuoYi/Git'
// import RuoYiDoc from '@/components/RuoYi/Doc'

export default {
  components: {
    Breadcrumb,
    TopNav,
    Hamburger,
    Screenfull,
    // SizeSelect,
    // Search,
    // RuoYiGit,
    // RuoYiDoc
  },
  computed: {
    ...mapGetters(["sidebar", "avatar", "device"]),
    setting: {
      get() {
        return this.$store.state.settings.showSettings;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "showSettings",
          value: val,
        });
      },
    },
    topNav: {
      get() {
        return this.$store.state.settings.topNav;
      },
    },
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    async logout() {
      this.$confirm("确定注销并退出系统吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$store.dispatch("LogOut").then(() => {
            this.$router.push({ path: '/login' })
          });
        })
        .catch(() => {});
    },
  },
};
</script>

<style scoped>
.el-popper {
  margin-top: -22px !important;
}
::v-deep .el-menu {
  margin-top: 4px;
  background: none !important;
}
</style>
<style lang="scss" scoped>
::v-deep .el-menu--horizontal {
  ::v-deep .el-menu--popup-bottom-start {
    margin-top: 5px;
    background: none !important;
  }
}
::v-deep .el-submenu__icon-arrow {
  right:5px;
}
img.logo {
  float: left;
  width: 200px;
}
.navbar {
  height: 80px;
  padding: 0 20px;
  position: relative;
  background: #005337;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  z-index: 999;
  // text-decoration: none;
  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .topmenu-container {
    position: absolute;
    left: 240px;
    top: 8px;
    background: none;
    border: none;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 36px;
    padding-top: 15px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #fff;
      vertical-align: text-bottom;
      ::v-deep .svg-icon {
        margin-top: 16px;
      }
      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      // margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
