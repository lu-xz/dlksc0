<template>
  <div class="power-dashboard">
    <!-- 主体内容区 -->
    <el-row :gutter="15" class="content-row">
      <!-- 左侧列：线损告警表格（占8格） -->
      <el-col :span="8">
        <el-card class="content-card">
          <template slot="header">
            <div class="card-header-title">线损告警</div>
          </template>
          <el-table
            :data="lineLossAlarmData"
            :header-cell-style="tableHeaderStyle"
            class="content-table"
            border
          >
            <el-table-column
              label="排名"
              prop="rank"
              align="center"
              width="100"
            >
              <template slot-scope="scope">
                <div class="rank-item">
                  <span :class="getRankIcon(scope.row.rank)"></span>
                  <span>{{ scope.row.rank }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="台区名称"
              prop="areaName"
              align="center"
            ></el-table-column>
            <el-table-column
              label="线损率"
              prop="lossRate"
              align="center"
            ></el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <!-- 右侧列：包含两个卡片（占16格） -->
      <el-col :span="16">
        <!-- 上：线损趋势图 -->
        <el-card class="content-card top-card">
          <template slot="header">
            <div class="card-header-title">标题名称</div>
          </template>
          <div id="lineLossTrendChart" class="chart-container"></div>
        </el-card>

        <!-- 下：线损电量数据 -->
        <el-card class="content-card bottom-card">
          <template slot="header">
            <div class="card-header-title">标题名称</div>
          </template>
          <el-table
            :data="lineLossData"
            :header-cell-style="tableHeaderStyle"
            class="content-table"
            border
          >
            <el-table-column
              label="台区名称"
              prop="areaName"
              align="center"
            ></el-table-column>
            <el-table-column
              label="发电量"
              prop="generation"
              align="center"
            ></el-table-column>
            <el-table-column
              label="售电量"
              prop="sales"
              align="center"
            ></el-table-column>
            <el-table-column
              label="线损电量"
              prop="loss"
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
  name: "LineLossDashboard",
  data() {
    return {
      // 表格表头样式
      tableHeaderStyle: {
        background: "#103C72",
        color: "#FFFFFF",
        fontWeight: "500",
        fontSize: "13px",
        padding: "8px 0",
      },
      // 线损告警数据（14条）
      lineLossAlarmData: Array.from({ length: 14 }, (_, i) => ({
        rank: `TOP${i + 1}`,
        areaName: `台区名称${"称".repeat(i + 3)}`, // 统一较长的台区名称
        lossRate: "20%",
      })),
      // 线损数据（3条）
      lineLossData: [
        {
          areaName: "台区名称称称称称称",
          generation: 30000,
          sales: 30000,
          loss: 30000,
        },
        {
          areaName: "台区名称称称称称",
          generation: 20000,
          sales: 20000,
          loss: 20000,
        },
        {
          areaName: "台区名称称称称",
          generation: 20000,
          sales: 20000,
          loss: 20000,
        },
      ],
    };
  },
  mounted() {
    this.initCharts();
  },
  methods: {
    initCharts() {
      this.initLineLossTrendChart();
    },

    // 获取排名图标样式（奖牌样式）
    getRankIcon(rank) {
      const icons = {
        TOP1: "icon-top1",
        TOP2: "icon-top2",
        TOP3: "icon-top3",
        TOP4: "icon-top4",
      };
      return icons[rank] || "icon-default";
    },

    // 线损趋势分析图表（更新为UI图样式）
    initLineLossTrendChart() {
      const chartDom = document.getElementById("lineLossTrendChart");
      const myChart = echarts.init(chartDom);

      const option = {
        title: {
          text: "单位",
          left: "10px",
          top: "10px",
          textStyle: {
            color: "#FFFFFF",
            fontSize: 16,
            fontWeight: "normal",
          },
        },
        grid: { top: "15%", left: "5%", right: "5%", bottom: "15%" },
        tooltip: {
          trigger: "axis",
          backgroundColor: "#0A143A",
          borderColor: "rgba(64, 158, 255, 0.3)",
          borderWidth: 1,
          textStyle: { color: "#FFFFFF" },
        },
        xAxis: {
          type: "category",
          data: ["11-01", "11-02", "11-03", "11-04", "11-05", "11-06", "11-07"],
          axisLine: { lineStyle: { color: "#1D54A2" } },
          axisTick: { lineStyle: { color: "rgba(255, 255, 255, 0.2)" } },
          axisLabel: { color: "#FFFFFF", fontSize: 12 },
        },
        yAxis: {
          type: "value",
          max: 50,
          splitLine: {
            lineStyle: { color: "rgba(255, 255, 255, 0.15)", type: "dotted" },
          },
          axisLine: { show: false },
          axisLabel: { color: "#FFFFFF", fontSize: 12 },
          // 添加水平参考线
          boundaryGap: ["20%", "20%"],
        },
        series: [
          {
            name: "线损率",
            type: "line",
            data: [15, 22, 28, 33, 29, 32, 28], // 调整数据更接近UI图
            itemStyle: { color: "#00FF94" }, // 绿色线条，匹配UI图
            lineStyle: { width: 2, color: "#00FF94" },
            symbolSize: 6,
            smooth: true, // 平滑曲线
            // 移除区域填充效果
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
.content-row {
  padding: 0;
}

/* 内容卡片样式 */
.content-card {
  background-color: rgba(17, 34, 88, 0.7); /* 调整卡片背景色 */
  border: 1px solid rgba(64, 158, 255, 0.2); /* 添加边框 */
  margin-bottom: 15px;

  ::v-deep .el-card__header {
   
    border-bottom: 0px solid rgba(64, 158, 255, 0.2);
    padding: 12px 15px;
    color: #ffffff;
  }
}

// 右侧上下卡片的间距
.top-card {
  margin-bottom: 15px;
}

.bottom-card {
  margin-top: 15px;
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
    max-height: 650px; // 增加高度以显示更多行
  }

  ::v-deep .el-table th,
  ::v-deep .el-table td {
    border-color: rgba(64, 158, 255, 0.15);
    padding: 12px 0;
    text-align: center;
  }

  ::v-deep .el-table__row {
    background-color: rgba(25, 45, 105, 0.3);
    margin-bottom: 2px;
  }

  ::v-deep .el-table__row:hover > td {
    background-color: rgba(64, 158, 255, 0.1) !important;
  }
}

/* 排名样式（奖牌样式） */
.rank-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;

  .icon-top1 {
    display: inline-block;
    width: 18px;
    height: 18px;
    background-color: #ffd700;
    border-radius: 50%;
    position: relative;

    &::after {
      content: "1";
      position: absolute;
      color: #000;
      font-size: 12px;
      font-weight: bold;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }

  .icon-top2 {
    display: inline-block;
    width: 18px;
    height: 18px;
    background-color: #c0c0c0;
    border-radius: 50%;
    position: relative;

    &::after {
      content: "2";
      position: absolute;
      color: #000;
      font-size: 12px;
      font-weight: bold;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }

  .icon-top3 {
    display: inline-block;
    width: 18px;
    height: 18px;
    background-color: #cd7f32;
    border-radius: 50%;
    position: relative;

    &::after {
      content: "3";
      position: absolute;
      color: #000;
      font-size: 12px;
      font-weight: bold;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }

  .icon-top4 {
    display: inline-block;
    width: 18px;
    height: 18px;
    background-color: #409eff;
    border-radius: 50%;
    position: relative;

    &::after {
      content: "4";
      position: absolute;
      color: #fff;
      font-size: 12px;
      font-weight: bold;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }

  .icon-default {
    display: inline-block;
    width: 18px;
    height: 18px;
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
  }
}

/* 图表容器样式 */
.chart-container {
  width: 100%;
  height: 400px; /* 调整图表高度 */
  margin-top: 10px;
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
  background: #103C72;
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
::v-deep .content-card {
  -webkit-box-shadow: 0 0 18px #0f75e1 inset;
  box-shadow: 0 0 18px #0f75e1 inset;
}
</style>
