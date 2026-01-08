<template>
  <div class="appLayout">
    <el-container>
      <el-header>
        <div class="head">
          <div class="title">
            <div class="titleSty">
              <img
                src="../../assets/images/logo.png"
                style="position: relative; top: 5px"
              />电力看生产运营数据分析
            </div>
          </div>
          <el-menu
            :default-active="$route.path"
            class="el-menu-demo"
            mode="horizontal"
            text-color="#fff"
            background-color="#113870"
            active-text-color="#2CF6FF"
            router
          >
            <template v-for="(item, index) in menusList">
              <!-- 没有二级菜单 -->
              <el-menu-item
                :index="item.url"
                :key="index"
                v-if="!item.children"
              >
                <div style="padding: 0 10px">
                  <!-- {{ activeId }} -->
                  <img
                    :src="item.url == activeId ? item.activeimg : item.img"
                    style="margin-right: 4px"
                  />
                  <span>{{ item.text }}</span>
                  <div v-if="item.url == activeId">
                    <!-- <img
                      src="@/assets/images/sanjiao.png"
                      :class="[
                        item.url == activeId && item.text === '故障核查'
                          ? 'homeImg2'
                          : item.url == activeId &&
                            item.text === '多系统模型整理映射'
                          ? 'homeImg3'
                          : 'homeImg',
                      ]"
                    /> -->
                    <!-- <img src="@/assets/gzfx/sanjiao.png" class="homeImg" /> -->
                  </div>
                </div>
              </el-menu-item>
              <!-- 有二级菜单 -->
              <el-submenu v-else :key="item.url" :index="item.url">
                <template slot="title">
                  <img
                    :src="item.url == activeId ? item.activeimg : item.img"
                  />
                  {{ item.text }}
                  <!-- <div v-show="item.url == activeId">
                    <img src="@/assets/images/sanjiao.png" class="ingsty" />
                  </div> -->
                </template>
                <el-menu-item
                  v-for="(menu, key) in item.children"
                  :index="menu.url"
                  :key="key"
                  @click="getUrl(menu.url)"
                >
                  <span style="font-size: 16px">{{ menu.text }}</span>
                </el-menu-item>
              </el-submenu>
            </template>
          </el-menu>
        </div>
      </el-header>
      <el-main>
        <!-- 主内容 -->
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      weekDay: "",
      time: "",
      nowTime: "",
      menusList: [
        {
          text: "首 页",
          url: "/dlksc/index",
          //   img: require("@/assets/cdbhImg/sy2.png"),
          //   activeimg: require("@/assets/cdbhImg/sy1.png"),
        },
        {
          text: "电量预测",
          url: "/dlkxzscl/xq",
          //   img: require("@/assets/cdbhImg/mx2.png"),
          //   activeimg: require("@/assets/cdbhImg/mx1.png"),
          children: [
            {
              text: "售电量预测模型",
              url: "/dlksc/xq",
            },
            {
              text: "售电量预测数据清单",
              url: "/dlksc/ycsj",
            },
            {
              text: "光伏数据清单",
              url: "/dllxzscl/xq",
            },
            {
              text: "光伏预测精准度分析",
              url: "/dllxzscl/xq",
            },
            {
              text: "火力数据清单",
              url: "/dllxzscl/xq",
            },
            {
              text: "火力发电煤炭预储备分析",
              url: "/dllxzscl/xq",
            },
          ],
        },
        {
          text: "线损分析",
          url: "/dlksc/xq",
          //   img: require("@/assets/cdbhImg/mx2.png"),
          //   activeimg: require("@/assets/cdbhImg/mx1.png"),
          children: [
            {
              text: "台区台账",
              url: "/dlksc/xssjqd2",
            },
            {
              text: "线损数据清单",
              url: "/dlksc/xssjqd",
            },
            {
              text: "同期线损分析",
              url: "/dlksc/xsfx",
            },
          ],
        },
        {
          text: "工单统计",
          url: "/dlksc/gdtj",
        },
      ],
    };
  },
  watch: {
    $route: {
      handler(val, oldval) {
        const paths = val.path.split("/");
        if (paths.length > 3) {
          // 当前活动路由
          this.activeId = paths[0] + "/" + paths[1] + "/" + paths[2] + "/index";
        } else {
          this.activeId = val.path;
        }
      },
      // 深度观察监听
      deep: true,
    },
  },
  created() {
    this.nowTimes();
    const paths = this.$route.path.split("/");
    if (paths.length > 3) {
      // 当前活动路由
      this.activeId = paths[0] + "/" + paths[1] + "/" + paths[2] + "/index";
    } else {
      this.activeId = this.$route.path;
    }
  },
  methods: {
    timeFormate(timeStamp) {
      let year = new Date(timeStamp).getFullYear();
      let month =
        new Date(timeStamp).getMonth() + 1 < 10
          ? "0" + (new Date(timeStamp).getMonth() + 1)
          : new Date(timeStamp).getMonth() + 1;
      let date =
        new Date(timeStamp).getDate() < 10
          ? "0" + new Date(timeStamp).getDate()
          : new Date(timeStamp).getDate();
      let hh =
        new Date(timeStamp).getHours() < 10
          ? "0" + new Date(timeStamp).getHours()
          : new Date(timeStamp).getHours();
      let mm =
        new Date(timeStamp).getMinutes() < 10
          ? "0" + new Date(timeStamp).getMinutes()
          : new Date(timeStamp).getMinutes();
      let ss =
        new Date(timeStamp).getSeconds() < 10
          ? "0" + new Date(timeStamp).getSeconds()
          : new Date(timeStamp).getSeconds();
      // let week = new Date(timeStamp).getDay();
      // let weeks = ['日', '一', '二', '三', '四', '五', '六'];
      // let getWeek = '星期' + weeks[week];
      this.nowTime = year + "-" + month + "-" + date;
      this.time = hh + ":" + mm + ":" + ss;
    },
    nowTimes() {
      this.timeFormate(new Date());
      setInterval(this.nowTimes, 1000);
      this.clear();
    },
    clear() {
      clearInterval(this.nowTimes);
      this.nowTimes = null;
    },
    getUrl(path, name) {
      // 重复点击报错  在跳转时，判断是否跳转路由和当前路由是否一致，避免重复跳转产生问题。
      if (this.$route.path !== path) {
        this.$router.push({ path: path }).catch((err) => {
          console.log(err);
        });
      }
    },
  },
};
</script>
<style scoped>
.titleSty {
  font-family: Source Han Sans, Source Han Sans;
  font-weight: bold;
  font-size: 40px;
  line-height: 50px;
  text-align: center;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-image: linear-gradient(#ffffff 30%, #6cc4f4 98%);
}
.title {
  float: left;
  padding-left: 40px;
  padding-top: 20px;
}
.appLayout {
  background: url(~@/assets/dlkxzsclImg/bg.png) 100% 100%;
  min-height: 100%;
}
.head {
  background: url(~@/assets/images/bg.png) no-repeat;
  height: 102px;
  /* display: flex;
  width: 100%;
  justify-content: center; */
}
.el-header {
  padding: 0;
}
.week {
  /* float: right; */
  font-size: 16px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #ffffff;
  padding-right: 10px;
  padding-top: 23px;
  justify-content: right;
}
.time {
  /* float: right; */
  font-size: 16px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #ffffff;
  padding-right: 30px;
  padding-top: 23px;
  justify-content: right;
}
.el-main {
  padding-top: 20px;
  padding-bottom: 20px;
}
.el-menu {
  float: left;
  background: none !important;
  margin: 35px 0 0 249px;
}
li.el-menu-item {
  background: none !important;
  border: none !important;
}
li.el-submenu.is-opened,
::v-deep .el-submenu__title {
  background: none !important;
  border: none !important;
}
::v-deep .el-menu--horizontal > ::v-deep .el-menu-item:not(.is-disabled):hover,
::v-deep .el-menu--horizontal > ::v-deep .el-menu-item:not(.is-disabled):focus {
  background: none !important;
  border: none !important;
}
::v-deep .el-menu--horizontal > .el-submenu .el-submenu__title:hover {
  background: none !important;
  border: none !important;
}
::v-deep .el-menu.el-menu--horizontal {
  border-bottom: none;
}
::v-deep .el-header {
  height: auto !important;
}
.el-menu-item,
::v-deep .el-submenu__title {
  font-size: 18px !important;
  padding: 0 50px;
}
</style>
