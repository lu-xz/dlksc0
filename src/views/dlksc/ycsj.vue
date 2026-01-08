<template>
  <div class="power-dashboard">
    <!-- 主体内容区 -->
    <el-row :gutter="15" class="content-row">
      <!-- 第一行：三个图表 -->
      <el-col :span="8">
        <el-card class="content-card">
          <template slot="header">
            <div class="card-header-title">售电预测数精准度</div>
          </template>
          <div id="echart1" class="chart-container"></div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card class="content-card">
          <template slot="header">
            <div class="card-header-title">光伏发电预测精准度</div>
          </template>
          <div id="echart2" class="chart-container"></div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card class="content-card">
          <template slot="header">
            <div class="card-header-title">预测趋势分析</div>
          </template>
          <div id="echart3" class="chart-container"></div>
        </el-card>
      </el-col>

      <!-- 第二行：三个表格 -->
      <el-col :span="8" style="margin-top: 15px">
        <el-card class="content-card">
          <template slot="header">
            <div class="card-header-title">售电预测数据</div>
          </template>
          <el-table
            :data="electricitySalesData"
            :header-cell-style="tableHeaderStyle"
            class="content-table"
            border
          >
            <el-table-column
              label="日期"
              prop="date"
              align="center"
            ></el-table-column>
            <el-table-column
              label="预测电量"
              prop="predicted"
              align="center"
            ></el-table-column>
            <el-table-column
              label="售电量"
              prop="actual"
              align="center"
            ></el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <el-col :span="8" style="margin-top: 15px">
        <el-card class="content-card">
          <template slot="header">
            <div class="card-header-title">光伏预测数据</div>
          </template>
          <el-table
            :data="photovoltaicData"
            :header-cell-style="tableHeaderStyle"
            class="content-table"
            border
          >
            <el-table-column
              label="日期"
              prop="date"
              align="center"
            ></el-table-column>
            <el-table-column
              label="预测电量"
              prop="predicted"
              align="center"
            ></el-table-column>
            <el-table-column
              label="实际发电量"
              prop="actual"
              align="center"
            ></el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <el-col :span="8" style="margin-top: 15px">
        <el-card class="content-card">
          <template slot="header">
            <div class="card-header-title">煤炭预测数据</div>
          </template>
          <el-table
            :data="coalData"
            :header-cell-style="tableHeaderStyle"
            class="content-table"
            border
          >
            <el-table-column
              label="日期"
              prop="date"
              align="center"
            ></el-table-column>
            <el-table-column
              label="火电耗量"
              prop="thermalConsumption"
              align="center"
            ></el-table-column>
            <el-table-column
              label="耗煤量估算"
              prop="coalConsumption"
              align="center"
            ></el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "PowerPredictionDashboard",
  data() {
    return {
      // 表格表头样式
      tableHeaderStyle: {
        background: "none",
        color: "#FFFFFF",
        fontWeight: "500",
        fontSize: "13px",
        padding: "8px 0",
      },
      // 售电预测数据
      electricitySalesData: [
        { date: "2025-10-29", predicted: 2900, actual: 222 },
        { date: "2025-10-28", predicted: 500, actual: 233 },
        { date: "2025-10-27", predicted: 300, actual: 122 },
        { date: "2025-10-26", predicted: 300, actual: 122 },
        { date: "2025-10-25", predicted: 300, actual: 122 },
        { date: "2025-10-24", predicted: 300, actual: 122 },
        { date: "2025-10-26", predicted: 300, actual: 122 },
        { date: "2025-10-25", predicted: 300, actual: 122 },
        { date: "2025-10-24", predicted: 300, actual: 122 },
      ],
      // 光伏预测数据
      photovoltaicData: [
        { date: "2025-10-29", predicted: 2900, actual: 222 },
        { date: "2025-10-28", predicted: 500, actual: 233 },
        { date: "2025-10-27", predicted: 300, actual: 122 },
        { date: "2025-10-26", predicted: 300, actual: 122 },
        { date: "2025-10-25", predicted: 300, actual: 122 },
        { date: "2025-10-24", predicted: 300, actual: 122 },
      ],
      // 煤炭预测数据
      coalData: [
        { date: "2025-10-29", thermalConsumption: 2900, coalConsumption: 222 },
        { date: "2025-10-28", thermalConsumption: 500, coalConsumption: 233 },
        { date: "2025-10-27", thermalConsumption: 300, coalConsumption: 122 },
        { date: "2025-10-26", thermalConsumption: 300, coalConsumption: 122 },
        { date: "2025-10-25", thermalConsumption: 300, coalConsumption: 122 },
        { date: "2025-10-24", thermalConsumption: 300, coalConsumption: 122 },
      ],
    };
  },
  mounted() {
    this.initCharts();
  },
  methods: {
    initCharts() {
      this.initEchart1();
      this.initEchart2();
      this.initEchart3();
    },

    // 售电预测精准度环形图
    initEchart1() {
      const chartDom = document.getElementById("echart1");
      const myChart = echarts.init(chartDom);

      const option = {
        tooltip: {
          trigger: "item",
          backgroundColor: "#0A143A",
          borderColor: "rgba(64, 158, 255, 0.3)",
          borderWidth: 1,
          textStyle: { color: "#FFFFFF" },
        },
        series: [
          {
            name: "售电预测精准度",
            type: "pie",
            radius: ["40%", "80%"], // 环形图
            avoidLabelOverlap: false,
            // itemStyle: {
            //   borderRadius: 10,
            //   borderColor: "#0f2e63",
            //   borderWidth: 2,
            // },
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 16,
                fontWeight: "bold",
                color: "#FFFFFF",
              },
            },
            labelLine: {
              show: false,
            },
            data: [
              { value: 75, name: "精准", itemStyle: { color: "#409EFF" } },
              { value: 25, name: "偏差", itemStyle: { color: "#36CFC9" } },
            ],
          },
        ],
      };

      myChart.setOption(option);
      window.addEventListener("resize", () => myChart.resize());
    },

    // 光伏发电预测精准度环形图
    initEchart2() {
      const chartDom = document.getElementById("echart2");
      const myChart = echarts.init(chartDom);

      const option = {
        tooltip: {
          trigger: "item",
          backgroundColor: "#0A143A",
          borderColor: "rgba(64, 158, 255, 0.3)",
          borderWidth: 1,
          textStyle: { color: "#FFFFFF" },
        },
        series: [
          {
            name: "光伏发电预测精准度",
            type: "pie",
            radius: ["40%", "80%"], // 环形图
            avoidLabelOverlap: false,
            // itemStyle: {
            //   borderRadius: 10,
            //   borderColor: "#0f2e63",
            //   borderWidth: 2,
            // },
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 16,
                fontWeight: "bold",
                color: "#FFFFFF",
              },
            },
            labelLine: {
              show: false,
            },
            data: [
              { value: 80, name: "精准", itemStyle: { color: "#409EFF" } },
              { value: 20, name: "偏差", itemStyle: { color: "#36CFC9" } },
            ],
          },
        ],
      };

      myChart.setOption(option);
      window.addEventListener("resize", () => myChart.resize());
    },

    // 预测趋势分析图表
    initEchart3() {
      const chartDom = document.getElementById("echart3");
      const myChart = echarts.init(chartDom);
      const option = {
        // 添加标题配置，与图片左上角"标题名称"对应
        // title: {
        //   text: "标题名称",
        //   left: "10px",
        //   top: "10px",
        //   textStyle: {
        //     color: "#FFFFFF",
        //     fontSize: 16,
        //     fontWeight: "normal",
        //   },
        // },
        grid: { top: "15%", left: "5%", right: "15%", bottom: "15%" }, // 右侧预留更多空间给图例
        // 深色主题悬浮提示框配置
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
            shadowStyle: { color: "rgba(255, 255, 255, 0.05)" },
          },
          backgroundColor: "#0A143A",
          borderColor: "rgba(64, 158, 255, 0.3)",
          borderWidth: 1,
          borderRadius: 8,
          padding: [10, 12],
          textStyle: { color: "#FFFFFF", fontSize: 12 },
          formatter: function (params) {
            let content = `<div style="text-align: center; margin-bottom: 4px;">${params[0].axisValue}</div>`;
            const colorMap = {
              名称1: "#FF4D4F", // 红色
              名称2: "#38A1FF", // 浅蓝色
              名称3: "#409EFF", // 蓝色
            };
            params.forEach((item) => {
              content += `
            <div style="display: flex; align-items: center; margin: 3px 0;">
              <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: ${
                colorMap[item.seriesName]
              }; margin-right: 6px;"></span>
              <span style="flex: 1;">${item.seriesName}</span>
              <span style="font-weight: 500;">${item.value}</span>
            </div>
          `;
            });
            return content;
          },
        },
        // 图例配置 - 关键修改：设置在右上角
        legend: {
          data: ["名称1", "名称2", "名称3"], // 与图片中的三个"名称"对应
          top: "10px", // 顶部对齐
          right: "10px", // 右侧对齐
          textStyle: {
            color: "#FFFFFF", // 白色文字
            fontSize: 12,
          },
          icon: "circle", // 圆形图标，与图片一致
          itemWidth: 8, // 图标大小
          itemHeight: 8,
          itemGap: 15, // 项目间距
          orient: "horizontal", // 水平排列
        },
        xAxis: {
          type: "category",
          data: [
            "2025-05",
            "2025-06",
            "2025-07",
            "2025-08",
            "2025-09",
            "2025-10",
          ],
          axisLine: { lineStyle: { color: "#1D54A2" } },
          axisTick: { lineStyle: { color: "rgba(255, 255, 255, 0.2)" } },
          axisLabel: { color: "#FFFFFF", fontSize: 12 },
        },
        yAxis: {
          type: "value",
          name: "",
          nameTextStyle: {
            color: "#FFFFFF",
            fontSize: 12,
            padding: [0, 0, 10, -40],
          },
          splitLine: {
            lineStyle: { color: "rgba(255, 255, 255, 0.15)", type: "dotted" },
          },
          axisLine: { show: false },
          axisLabel: { color: "#FFFFFF", fontSize: 12, formatter: "{value}" },
          splitNumber: 4,
        },
        series: [
          {
            name: "名称1", // 红色系列
            type: "bar",
            data: [112, 47, 112, 186, 186, 186], // 匹配图片中红色柱子数据
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                { offset: 0, color: "#0b1353" },
                { offset: 1, color: "#FF4D4F" }, // 红色
              ]),
              borderRadius: [8, 8, 0, 0],
            },
            barWidth: 10,
            barGap: "60%",
            emphasis: {
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                  { offset: 0, color: "#0b1353" },
                  { offset: 1, color: "#FF6B6B" },
                ]),
              },
            },
          },
          {
            name: "名称2", // 浅蓝色系列
            type: "bar",
            data: [96, 88, 96, 203, 203, 203], // 匹配图片中浅蓝色柱子数据
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                { offset: 0, color: "#0b1353" },
                { offset: 1, color: "#38A1FF" }, // 浅蓝色
              ]),
              borderRadius: [8, 8, 0, 0],
            },
            barWidth: 10,
            barGap: "60%",
            emphasis: {
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                  { offset: 0, color: "#142066" },
                  { offset: 1, color: "#4FC3F7" },
                ]),
              },
            },
          },
          {
            name: "名称3", // 蓝色系列（折线）
            type: "line",
            data: [144, 112, 144, 222, 222, 222], // 匹配图片中蓝色折线数据
            itemStyle: { color: "#409EFF" }, // 蓝色
            lineStyle: { width: 2, color: "#409EFF" },
            symbolSize: 6,
            symbol: "circle",
            emphasis: {
              itemStyle: {
                color: "#FFFFFF",
                borderColor: "#409EFF",
                borderWidth: 2,
              },
              symbolSize: 9,
            },
          },
        ],
      };
      myChart.setOption(option);
      window.addEventListener("resize", () => myChart.resize());
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-card__body {
  padding-top: 0;
}
::v-deep .content-card {
  box-shadow: 0 0 18px #0f75e1 inset;

  .el-card__header {
    border: none !important;
  }
}

.content-row {
  padding: 0;
}

/* 内容卡片样式 */
.content-card {
  background-color: rgba(9, 10, 78, 0.5);
  border: none;
  margin-bottom: 15px;
  ::v-deep .el-card__header {
    background-color: transparent;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    padding: 12px 15px;
    color: #ffffff;
  }
}

.card-header-title {
  font-family: SourceHanSansCN, SourceHanSansCN;
  font-weight: bold;
  font-size: 24px;
  color: #ffffff;
}

/* 表格样式 */
.content-table {
  width: 100%;
  margin-top: 10px;
  ::v-deep .el-table {
    background-color: transparent;
    color: #ffffff;
    font-size: 13px;
  }
  ::v-deep .el-table__body-wrapper {
    background-color: transparent;
    overflow-y: auto;
    height: 310px;
  }
  ::v-deep .el-table th,
  ::v-deep .el-table td {
    border-color: rgba(255, 255, 255, 0.2);
    padding: 8px 0;
    text-align: center;
  }
  ::v-deep .el-table__row:hover > td {
    background-color: rgba(255, 255, 255, 0.08) !important;
  }
}

/* 图表容器样式 */
.chart-container {
  width: 100%;
  height: 240px;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}

::-webkit-scrollbar-thumb {
  background-color: #1875a7;
  border-radius: 2px;
}

/* Element UI样式覆盖 */
::v-deep .el-table {
  background-color: transparent !important;
}

::v-deep .el-table__body-wrapper {
  background-color: transparent !important;
}

::v-deep .el-table__row {
  background-color: transparent !important;
}

::v-deep .el-table__cell {
  background-color: transparent !important;
}

::v-deep .el-table__empty-block {
  background-color: transparent !important;
}

::v-deep .el-table tr {
  background: #103c72;
  border-radius: 2px;
  font-size: 14px;
  color: #dfeef3;
  line-height: 36px;
}

::v-deep .el-table th.el-table__cell.is-leaf,
::v-deep .el-table td.el-table__cell,
.el-table--group,
::v-deep .el-table--border {
  border: none !important;
}

::v-deep .el-table::before,
::v-deep .el-table--group::after,
::v-deep .el-table--border::after {
  display: none !important;
}
</style>
