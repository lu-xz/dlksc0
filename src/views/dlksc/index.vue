<template>
  <div>
    <!-- <el-row>
      <el-col :span="6"
        ><div class="grid-content bg-purple">
          <div class="c1">
            <div class="title">铜山区村污站点发展趋势统计图</div>
            <div id="echart1" style="width: 100%; height: 340px"></div>
          </div>
          <div class="c2">
            <div class="title" @click="goToChart" style="cursor: pointer;">铜山区村污站点处理量、用电量统计图</div>
            <div id="echart2" style="width: 100%; height: 340px"></div>
          </div></div
      ></el-col>
      <el-col :span="12"
        ><div class="grid-content bg-purple" style="position: relative">
          <div class="c3 clearfix">
            <el-carousel indicator-position="none" :interval="interval" height="100px" :arrow="carousels.length > 1?'hover':'never'">
              <el-carousel-item v-for="(town,i) in carousels" :key="i">
                <ul>
                  <li v-for="(item, index) in town" :key="index" @click="handleSiteName(item)" style="cursor: pointer;">
                    <div :class="'num num' + (index + 4*i)">{{ item.num }}</div>
                    <div class="numTitle">{{ item.town }}村污站点数</div>
                  </li>
                </ul>
              </el-carousel-item>
            </el-carousel>
            <i
              :class="isAuto ? 'el-icon-video-pause':'el-icon-video-play'"
              @click="handleAutoPlay"
              :style="{
                position: 'absolute',
                top: '135px',
                left: '100px',
                color: isAuto ? 'yellow':'green',
                cursor: 'pointer',
                fontSize: '22px'
              }"
              :title="isAuto ? '暂停':'播放'"
            ></i>

            <i
              class="el-icon-refresh"
              @click="handleRefresh"
              style="
                position: absolute;
                top: 135px;
                left: 150px;
                color: greenyellow;
                cursor: pointer;
                font-size: 20px;
              "
              title="重置"
            ></i>
            
            <i
              class="el-icon-search"
              @click="showIcon"
              style="
                position: absolute;
                top: 135px;
                right: 150px;
                color: greenyellow;
                cursor: pointer;
                font-size: 20px;
              "
              title="展开/隐藏搜索框"
            ></i>
            <i
              class="el-icon-bell"
              @click="handleAbnormal"
              style="
                position: absolute;
                top: 135px;
                right: 100px;
                color: yellow;
                cursor: pointer;
                font-size: 20px;
              "
              title="查看异常数据分析"
            ></i>
            <div class="ts">
              <div v-show="!ssicon">
                <el-input
                  v-model="siteName"
                  placeholder="请输入镇/行政村/自然村"
                  style="width: 300px; padding-right: 8px;"
                  clearable
                ></el-input
                >
                <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
              </div>
            </div>
          </div>
          <div class="c4">
            <Tongshan :map-data="mapData" :center-data="center"/>
          </div></div
      ></el-col>
      <el-col :span="6"
        ><div class="grid-content bg-purple">
          <div class="c5">
            <div class="title">铜山区村污站点处理量率统计图</div>
            <div id="echart5" style="width: 100%; height: 340px"></div>
          </div>
          <div class="c6">
            <div class="title">铜山区村污站点污水处理单耗排名<span :style="{color: (isAsc?'#3AF3FF':'#F62D45'),fontWeight:'800'}">{{ isAsc ? '前':'后' }}10</span></div>
            <div class="px" @click="px" title="排序"><img src="../../assets/dlkcwImg/px.png"></div>
            <el-table
              :data="costList"
              ref="costTable"
              id="boxed"
              @cell-mouse-enter="mouseEnter"
              @cell-mouse-leave="mouseLeave"
              style="width: 100%"
              :header-cell-style="{
                padding: '16px',
                background: 'none',
                color: '#fff',
                fontWeight: '400',
                fontSize: '16px',
              }"
              height="360px"
              v-loading="loading"
              element-loading-text="拼命加载中"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0.8)"
            >
              <el-table-column
                prop="name"
                label="站点名称"
                align="center"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <span @click="gotoXq(scope.row)" style="cursor: pointer;">{{ scope.row.town + scope.row.administrativeVillage + scope.row.naturalVillage }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="dealCost"
                label="污水处理单耗(kW·h/m³)"
                align="center"
                show-overflow-tooltip
              >
              </el-table-column>
            </el-table>
          </div></div
      ></el-col>
    </el-row> -->
  </div>
</template>

<script>
import * as echarts from "echarts";
import Tongshan from "./tongshan.vue";
// 引入插件
import { loopShowTooltip } from '@/utils/tooltip-auto-show-vue'
import { map, getCwSiteCountByTown, getAllAbnormalList, getAllDealPowerList, getAllPowerList } from '@/api/dlkcw/index';
import PinyinMatch from 'pinyin-match';
export default {
  components: {
    Tongshan,
  },
  data() {
    return {
      townData: require("@/static/json/townData.json"),
      mapData: [],
      initMapData: require("@/static/json/mapData.json"),
      costList: require("@/static/json/mapData.json"),
      loading: false,
      timer: null,
      ssicon: true,
      siteName: '',
      back: false,
      trendsData: require("@/static/json/trends.json"),
      dealRateData: require("@/static/json/dealRate.json"),
      dealPowerData: require("@/static/json/dealPower.json"),
      abnormalList: require("@/static/json/abnormal.json"),
      dealPowerList: [],
      powerList: [],
      tootipTimer1: null,
      tootipTimer2: null,
      tootipTimer5: null,
      center: '',
      isAsc: true,
      isAuto: false,
      isPlay: false,
      createDate: null,
      carousels:[],
      interval: 8000
    };
  },
  created() {},
  mounted() {
    this.back = this.$route.params && this.$route.params.back;
    if(!this.back){
      localStorage.setItem('siteName','');
      localStorage.setItem('center','');
    }
    // 静态页面直接加载
    if(JSON.parse(process.env.VUE_APP_IS_STATIC)){
      let costList = this.initMapData.filter(item=> item.dealCost > 0.1);
      this.costList = costList.slice(0,10);
      this.filterMapData();
      this.groupedArr();
      this.echart1();
      this.echart2();
      this.echart5();
      setTimeout(() => {
        this.handScroll();
      }, 5000);
    }else{
      // 动态页面调用接口获取数据
      this.getTownData();
      this.getAbnormalList();
      this.getAllDealPowerList();
      this.getAllPowerList();
    }
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    if (this.tootipTimer1) {
      clearInterval(this.tootipTimer1);
      this.tootipTimer1 = null;
    }
    if (this.tootipTimer2) {
      clearInterval(this.tootipTimer2);
      this.tootipTimer2 = null;
    }
    if (this.tootipTimer5) {
      clearInterval(this.tootipTimer5);
      this.tootipTimer5 = null;
    }
  },
  methods: {
    groupedArr() {
      const result = [];
      for (let i = 0; i < this.townData.length; i += 4) {
        result.push(this.townData.slice(i, i + 4));
      }
      this.carousels = result;
    },
    getMapData(){
      map().then((res) => {
        const data = res.data;
        this.mapData = data.siteList;
        this.initMapData = data.siteList;
        let costList = this.initMapData.filter(item=> item.dealCost > 0.1);
        this.costList = costList.slice(0,10);
        this.trendsData = data.trendsData;
        this.dealRateData = data.dealRateData;
        this.dealPowerData = data.dealPowerData;
        this.filterMapData();
        this.echart1();
        this.echart2();
        this.echart5();
        setTimeout(() => {
          this.handScroll();
        }, 5000);
      })
    },
    filterMapData(){
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth();
      const lastMonthDate = new Date(currentYear, currentMonth - 1, 1);
      const lastMonth = lastMonthDate.getMonth() + 1;
      this.initMapData.forEach(item=>{
        item.abnormalCount = this.abnormalList.filter(a=> a.custNo === item.custNo && a.dataRange.indexOf(lastMonth + '月') > -1).length;
      })
      const siteName = localStorage.getItem('siteName');
      this.center = localStorage.getItem('center');
      if(this.back && siteName){
        this.siteName = siteName;
        this.ssicon = false;
      }
      this.handleQuery();
    },
    getTownData(){
      getCwSiteCountByTown().then((res) => {
        this.townData = res.data;
        this.groupedArr();
      })
    },
    getAbnormalList(){
      getAllAbnormalList().then((res) => {
        this.abnormalList = res.data;
        this.getMapData();
      })
    },
    getAllDealPowerList(){
      getAllDealPowerList().then((res) => {
        this.dealPowerList = res.data;
      })
    },
    getAllPowerList(){
      getAllPowerList().then((res) => {
        this.powerList = res.data;
      })
    },
    echart1() {
      var chartDom = document.getElementById("echart1");
      var myChart = echarts.init(chartDom);
      var option;
      let x = this.trendsData.xData;
      let y = this.trendsData.yData;
      const that = this;
      option = {
        color: ["#2880E1", "#3FA0F9"],
        title: {
          text: "村污站点数(个)",
          textStyle: {
            color: "#fff",
            fontSize: 16,
          },
          left: 0,
          top: 20,
        },
        tooltip: {
          show: true,
          trigger: "axis",
          textStyle: {
            fontSize: 14,
          },
          axisPointer: {
            lineStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,

                global: false,
              },
            },
          },
          borderColor: "rgba(18, 57, 60, .8)",
        },

        legend: {
          // icon: 'circle',
          // itemWidth: 10,
          show: false,
          itemGap: 4,
          x: "right",
          top: "3%",
          textStyle: {
            color: "#fff",
            fontSize: 14,
            // padding:[0, 6, 0, 50],
          },
        },
        grid: {
          top: "23%",
          left: "3%",
          right: "6%",
          bottom: "5%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            axisLine: {
              lineStyle: {
                color: "#fff",
              },
            },
            axisLabel: {
              fontSize: 14,
              color: "#fff",
            },
            splitLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            axisLine: {
              show: false,
            },
            boundaryGap: false,
            data: x,
          },
        ],

        yAxis: [
          {
            type: "value",
            splitNumber: 6,
            axisLine: {
              show: false,
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: "#1C2139",
                type: "dashed",
              },
            },
            axisLabel: {
              color: "#fff",
              fontSize: 14,
            },
            axisTick: {
              show: false,
            },
          },
        ],
        series: [
          {
            name: "村污站点数",
            type: "line",
            showSymbol: true,
            symbolSize: 8,
            smooth: true,
            lineStyle: {
              color: "#2880E1",
            },
            itemStyle: {
              color: "#2880E1",
              borderColor: "#2880E1",
              borderWidth: 2,
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                [
                  {
                    offset: 0,
                    color: "#2880E1",
                  },
                  {
                    offset: 1,
                    color: "#0C1939",
                  },
                ],
                false
              ),
            },
            data: y,
          },
        ],
      };
      option && myChart.setOption(option);
      // 调用方法
      this.tootipTimer1 && this.tootipTimer1.clearLoop();
      this.tootipTimer1 = null;
      this.tootipTimer1 = loopShowTooltip(myChart, option, {
        interval: 3000, // 轮播间隔时间
        loopSeries: true // 是否开启轮播循环
      },function(date,isAuto){
        that.createDate = date;
        that.isAuto = that.isPlay && isAuto;
        if(that.isAuto){
          that.handleQuery();
        }
      });
      // 添加 resize 事件监听
      window.addEventListener("resize", function() {
        // 重新计算图表容器大小
        myChart && myChart.resize();
      });
    },
    echart2() {
      var chartDom = document.getElementById("echart2");
      var myChart = echarts.init(chartDom);
      var option;
      let xData = this.dealPowerData.xData;
      let dealData = this.dealPowerData.dealData;
      let powerData = this.dealPowerData.powerData;
      option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999",
            },
          },
        },
        color: ["#098173"],
        title: {
          text: "",
          textStyle: {
            color: "#fff",
            fontSize: 16,
          },
          left: 0,
          top: 15,
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        grid: {
          top: "20%",
          left: "3%",
          right: "3%",
          bottom: "0%",
          containLabel: true,
        },
        legend: {
          data: ["处理量", "用电量"],
          textStyle: {
            color: '#fff', // 设置字体颜色为白色
            fontSize: '16'
          }
        },
        xAxis: [
          {
            type: "category",
            data: xData,
            axisLine: {
              lineStyle: {
                color: "#fff",
              },
            },
            axisLabel: {
              fontSize: 14,
              color: "#fff",
            },
            splitLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            axisLine: {
              show: false,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "",
            axisLabel: {
              formatter: "{value}",
            },

            splitLine: {
              show: true,
              lineStyle: {
                color: "#1C2139",
                type: "dashed",
              },
            },
            axisLabel: {
              color: "#fff",
              fontSize: 14,
            },
          },
          {
            type: "value",
            name: "",
            axisLabel: {
              formatter: "{value}",
            },

            splitLine: {
              show: true,
              lineStyle: {
                color: "#1C2139",
                type: "dashed",
              },
            },
            axisLabel: {
              color: "#fff",
              fontSize: 14,
            },
          },
        ],
        series: [
          {
            name: "处理量",
            type: "bar",
            tooltip: {
              valueFormatter: function (value) {
                return value + "";
              },
            },
            data: dealData,
            itemStyle: {
              color: {
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                type: "linear",
                global: false,
                colorStops: [
                  { offset: 1, color: "rgba(47, 160, 255, 1)" },
                  { offset: 0, color: "rgba(47, 160, 255, .1)" },
                ],
              },
              borderWidth: 1,
              borderColor: "rgba(47, 160, 255, 1)",
            },
            barWidth: "30%",
            showBackground: true,
          },
          {
            name: "用电量",
            type: "line",
            yAxisIndex: 1,
            tooltip: {
              valueFormatter: function (value) {
                return value + "";
              },
            },
            showSymbol: true,
            symbolSize: 8,
            // smooth: true,
            lineStyle: {
              color: "#F6B221",
            },
            itemStyle: {
              color: "#F6B221",
              borderColor: "#F6B221",
              borderWidth: 2,
            },
            data: powerData,
          },
        ],
      };
      option && myChart.setOption(option);
      // 调用方法
      this.tootipTimer2 && this.tootipTimer2.clearLoop();
      this.tootipTimer2 = null;
      this.tootipTimer2 = loopShowTooltip(myChart, option, {
        interval: 3000, // 轮播间隔时间
        loopSeries: true // 是否开启轮播循环
      });
      // 添加 resize 事件监听
      window.addEventListener("resize", function() {
        // 重新计算图表容器大小
        myChart && myChart.resize();
      });
    },
    echart5() {
      var chartDom = document.getElementById("echart5");
      var myChart = echarts.init(chartDom);
      var option;
      let x = this.dealRateData.xData;
      let y = this.dealRateData.yData;
      option = {
        color: ["#098173"],
        title: {
          text: "处理量率(%)",
          textStyle: {
            color: "#fff",
            fontSize: 16,
          },
          left: 0,
          top: 20,
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        grid: {
          top: "23%",
          left: "3%",
          right: "3%",
          bottom: "5%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: x,
            axisLine: {
              lineStyle: {
                color: "#fff",
              },
            },
            axisLabel: {
              fontSize: 14,
              color: "#fff",
            },
          },
        ],
        yAxis: {
          splitLine: {
            show: true,
            lineStyle: {
              color: "#1C2139",
              type: "dashed",
            },
          },
          axisLabel: {
            color: "#fff",
            fontSize: 14,
          },
        },
        series: [
          {
            name: "村污站点数",
            type: "bar",
            label: {
              show: true,
              color: '#fff',
              fontSize: 14,
              position: 'top',
              formatter: '{c}'
            },
            itemStyle: {
              color: {
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                type: "linear",
                global: false,
                colorStops: [
                  { offset: 1, color: "#0FC58B" },
                  { offset: 0, color: "#14171E" },
                ],
              },
              borderWidth: 1,
              borderColor: "#0FC58B",
            },
            barWidth: "30%",
            showBackground: true,
            data: y,
          },
        ],
      };
      option && myChart.setOption(option);
      // 调用方法
      this.tootipTimer5 && this.tootipTimer5.clearLoop();
      this.tootipTimer5 = null;
      this.tootipTimer5 = loopShowTooltip(myChart, option, {
        interval: 3000, // 轮播间隔时间
        loopSeries: true // 是否开启轮播循环
      });
      // 添加 resize 事件监听
      window.addEventListener("resize", function() {
        // 重新计算图表容器大小
        myChart && myChart.resize();
      });
    },
    mouseEnter() {
      clearInterval(this.timer);
      this.timer = null;
    },
    //鼠标移出
    mouseLeave() {
      this.handScroll();
    },
    // 表格滚动
    handScroll() {
      const table = this.$refs.costTable;
      if(!table){
        return;
      }
      const divData = table.bodyWrapper;
      this.timer = setInterval(() => {
        divData.scrollTop += 1;
        if (divData.clientHeight + divData.scrollTop == divData.scrollHeight) {
          divData.scrollTop = 0;
        }
      }, 60);
    },
    showIcon(){
      this.ssicon = !this.ssicon
    },
    handleQuery() {
      let mapData = this.initMapData;
      if(this.siteName){
        mapData = mapData.filter(item=> (item.town + item.administrativeVillage + item.naturalVillage).indexOf(this.siteName) > -1 
        || PinyinMatch.match((item.town + item.administrativeVillage + item.naturalVillage), this.siteName));
      }else{
        this.center = '';
      }
      if(this.isAuto && this.createDate){
        const dates = this.createDate.split('-');
        const year = parseInt(dates[0]);
        const month = parseInt(dates[1]);
        mapData = mapData.filter(item=>{
          const createDates = item.createDate.split('-');
          const createYear = parseInt(createDates[0]);
          const createMonth = parseInt(createDates[1]);
          return createYear < year || (createYear == year && createMonth <= month);
        })
      }
      this.mapData = mapData
      localStorage.setItem('siteName', this.siteName);
      localStorage.setItem('center', this.center);
    },
    handleAbnormal(){
      this.$router.push('/dlkcw/abnormal');
    },
    handleSiteName(item){
      this.siteName = item.town;
      this.center = item.center;
      this.ssicon = false;
      this.handleQuery();
    },
    px(){
      this.isAsc = !this.isAsc;
      let costList = this.initMapData.filter(item=> item.dealCost > 0);
      if(!this.isAsc){
        costList.reverse();
      }
      this.costList = costList.slice(0,10);
    },
    handleAutoPlay(){
      this.isPlay = !this.isPlay;
      this.isAuto = !this.isAuto;
      this.handleQuery();
    },
    handleRefresh(){
      this.siteName = '';
      this.ssicon = true;
      this.handleQuery();
    },
    gotoXq(row){
      this.$router.push({path: "/dlkcw/xq",query: { custNo: row.custNo }});
    },
    goToChart(){
      //this.$router.push('/dlkcw/chart');
    }
  },
};
</script>

<style lang="scss" scoped>
@import "./style.scss";
</style>
