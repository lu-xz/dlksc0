<template>
  <div class="power-dashboard">
    <!-- 主体内容区（调整间距，贴合文件3紧凑布局） -->
    <el-row :gutter="15" class="content-row">
      <!-- 第一行：故障抢修 + 非抢工单（紧凑表格样式） -->
      <el-col :span="12">
        <el-card class="content-card">
          <template slot="header">
            <div class="card-header-title">故障抢修</div>
          </template>
          <el-table
            :data="faultRepairData"
            :header-cell-style="tableHeaderStyle"
            class="content-table"
          >
            <el-table-column
              label="工单数量"
              prop="type"
              align="center"
            ></el-table-column>
            <el-table-column
              label="工单数"
              prop="count"
              align="center"
            ></el-table-column>
            <!-- 修正笔误：平静抵达时长 → 平均抵达时长 -->
            <el-table-column
              label="平均抵达时长"
              prop="arriveTime"
              align="center"
            ></el-table-column>
            <el-table-column
              label="平均修复时长"
              prop="repairTime"
              align="center"
            ></el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card class="content-card">
          <template slot="header">
            <div class="card-header-title">非抢工单</div>
          </template>
          <el-table
            :data="nonFaultOrderData"
            :header-cell-style="tableHeaderStyle"
            class="content-table"
            border
          >
            <el-table-column
              label="工单数量"
              prop="type"
              align="center"
            ></el-table-column>
            <el-table-column
              label="意见"
              prop="opinion"
              align="center"
            ></el-table-column>
            <el-table-column
              label="业务申请"
              prop="apply"
              align="center"
            ></el-table-column>
            <el-table-column
              label="12398"
              prop="call12398"
              align="center"
            ></el-table-column>
            <el-table-column
              label="是否联系"
              prop="isContact"
              align="center"
            ></el-table-column>
            <el-table-column
              label="满意度情况"
              prop="satisfaction"
              align="center"
            ></el-table-column>
            <el-table-column
              label="是否报备"
              prop="isBackup"
              align="center"
            ></el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <!-- 第二行：抢修工单分布 + 非抢修工单分布（匹配UI图Y轴刻度） -->
      <el-col :span="8">
        <el-card class="content-card">
          <template slot="header">
            <div class="card-header-title">抢修工单分布</div>
          </template>
          <div id="faultOrderChart" class="chart-container"></div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card class="content-card">
          <template slot="header">
            <div class="card-header-title">非抢修工单分布</div>
          </template>
          <div id="nonFaultOrderChart" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="content-card">
          <template slot="header">
            <div class="card-header-title flex justify-between items-center">
              <span>重点指标管理</span>
              <el-date-picker
                v-model="indicatorYear"
                type="year"
                placeholder="选择年份"
                style="width: 100px"
                value-format="yyyy"
                class="year-picker"
              ></el-date-picker>
            </div>
          </template>
          <div
            id="keyIndicatorChart"
            class="chart-container key-indicator-chart"
          ></div> </el-card
      ></el-col>
      <!-- 第三行：重点指标管理（优化日期选择器样式） -->

      <!-- 第四行：抢修/非抢修实时工单池（优化Tab样式，确保切换生效） -->
      <el-col :span="12">
        <el-card class="content-card">
          <template slot="header">
            <div class="card-header-title flex justify-between items-center">
              <span>抢修实时工单池</span>
              <el-tabs v-model="faultTabActive" class="tab-group">
                <el-tab-pane label="待接单" name="waitAccept"></el-tab-pane>
                <el-tab-pane label="待派单" name="waitDispatch"></el-tab-pane>
                <el-tab-pane label="已接单" name="accepted"></el-tab-pane>
                <el-tab-pane label="已到达" name="arrived"></el-tab-pane>
                <el-tab-pane label="已修复" name="repaired"></el-tab-pane>
              </el-tabs>
            </div>
          </template>
          <el-table
            :data="currentFaultPoolData"
            :header-cell-style="tableHeaderStyle"
            class="content-table"
            border
          >
            <el-table-column
              label="工单编号"
              prop="orderNo"
              align="center"
            ></el-table-column>
            <el-table-column
              label="所属单位"
              prop="unit"
              align="center"
            ></el-table-column>
            <el-table-column
              label="片区负责人"
              prop="manager"
              align="center"
            ></el-table-column>
            <el-table-column
              label="工单状态"
              prop="status"
              align="center"
            ></el-table-column>
            <el-table-column
              label="现场照片"
              prop="photo"
              align="center"
            ></el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card class="content-card">
          <template slot="header">
            <div class="card-header-title flex justify-between items-center">
              <span>非抢修实时工单池</span>
              <el-tabs v-model="nonFaultTabActive" class="tab-group">
                <el-tab-pane label="待接单" name="waitAccept"></el-tab-pane>
                <el-tab-pane label="待派单" name="waitDispatch"></el-tab-pane>
                <el-tab-pane label="已接单" name="accepted"></el-tab-pane>
                <el-tab-pane label="已到达" name="arrived"></el-tab-pane>
                <el-tab-pane label="已修复" name="repaired"></el-tab-pane>
              </el-tabs>
            </div>
          </template>
          <el-table
            :data="currentNonFaultPoolData"
            :header-cell-style="tableHeaderStyle"
            class="content-table"
            border
          >
            <el-table-column
              label="工单编号"
              prop="orderNo"
              align="center"
            ></el-table-column>
            <el-table-column
              label="所属单位"
              prop="unit"
              align="center"
            ></el-table-column>
            <el-table-column
              label="片区负责人"
              prop="manager"
              align="center"
            ></el-table-column>
            <el-table-column
              label="工单状态"
              prop="status"
              align="center"
            ></el-table-column>
            <el-table-column
              label="现场照片"
              prop="photo"
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
  name: "PowerWorkOrderAnalysis",
  data() {
    return {
      activeMenuIndex: "4",
      indicatorYear: "2024",
      faultTabActive: "waitAccept",
      nonFaultTabActive: "waitAccept",
      // 故障抢修数据（匹配文件2 UI：9/7/6 + 50min）
      faultRepairData: [
        { type: "今日", count: 9, arriveTime: "50min", repairTime: "50min" },
        { type: "本月", count: 7, arriveTime: "50min", repairTime: "50min" },
        { type: "本年", count: 6, arriveTime: "50min", repairTime: "50min" },
      ],
      // 非抢工单数据（匹配文件2：本年"是否报备"为空）
      nonFaultOrderData: [
        {
          type: "今日",
          opinion: 9,
          apply: 9,
          call12398: 9,
          isContact: "否",
          satisfaction: "满意",
          isBackup: "否",
        },
        {
          type: "本月",
          opinion: 7,
          apply: 7,
          call12398: 7,
          isContact: "是",
          satisfaction: "满意",
          isBackup: "是",
        },
        {
          type: "本年",
          opinion: 6,
          apply: 6,
          call12398: 6,
          isContact: "是",
          satisfaction: "满意",
          isBackup: "",
        },
      ],
      // 抢修工单池数据（匹配文件3：部分字段为空）
      faultPoolData: {
        waitAccept: [
          {
            orderNo: "390800900",
            unit: "某某",
            manager: "张三",
            status: "待接单",
            photo: "-",
          },
          {
            orderNo: "390800900",
            unit: "某某",
            manager: "李四",
            status: "待接单",
            photo: "-",
          },
          {
            orderNo: "390800900",
            unit: "",
            manager: "王二",
            status: "待接单",
            photo: "-",
          },
        ],
        waitDispatch: [
          {
            orderNo: "390800901",
            unit: "某某",
            manager: "赵五",
            status: "待派单",
            photo: "-",
          },
          {
            orderNo: "390800902",
            unit: "某某",
            manager: "钱六",
            status: "待派单",
            photo: "-",
          },
        ],
        accepted: [],
        arrived: [],
        repaired: [],
      },
      // 非抢修工单池数据（匹配文件3：部分字段为空）
      nonFaultPoolData: {
        waitAccept: [
          {
            orderNo: "390800900",
            unit: "某某",
            manager: "张三",
            status: "待接单",
            photo: "-",
          },
          {
            orderNo: "390800900",
            unit: "",
            manager: "李四",
            status: "待接单",
            photo: "-",
          },
          {
            orderNo: "390800900",
            unit: "某某",
            manager: "王二",
            status: "待接单",
            photo: "-",
          },
        ],
        waitDispatch: [
          {
            orderNo: "390800901",
            unit: "某某",
            manager: "赵五",
            status: "待派单",
            photo: "-",
          },
          {
            orderNo: "390800902",
            unit: "某某",
            manager: "钱六",
            status: "待派单",
            photo: "-",
          },
        ],
        accepted: [],
        arrived: [],
        repaired: [],
      },
      // 表格表头样式（优化字体大小和权重）
      tableHeaderStyle: {
        background: "none",
        color: "#FFFFFF",
        fontWeight: "500",
        fontSize: "13px",
        padding: "8px 0",
      },
    };
  },
  computed: {
    currentFaultPoolData() {
      return this.faultPoolData[this.faultTabActive] || [];
    },
    currentNonFaultPoolData() {
      return this.nonFaultPoolData[this.nonFaultTabActive] || [];
    },
  },
  mounted() {
    this.initCharts();
    // 确保日期选择器初始化后样式生效
    this.$nextTick(() => {
      this.adjustDatePickerStyle();
    });
  },
  methods: {
    initCharts() {
      this.initFaultOrderChart();
      this.initNonFaultOrderChart();
      this.initKeyIndicatorChart();
    },
    // 抢修工单分布图表（匹配文件2 Y轴刻度：0/50/100/150/200）
    initFaultOrderChart() {
      const chartDom = document.getElementById("faultOrderChart");
      const myChart = echarts.init(chartDom);
      const option = {
        grid: { top: "15%", left: "5%", right: "5%", bottom: "15%" },
        // 新增：深色主题悬浮提示框配置
        tooltip: {
          trigger: "axis", // 按坐标轴触发，显示当前X轴所有系列数据
          axisPointer: {
            type: "shadow",
            shadowStyle: { color: "rgba(255, 255, 255, 0.05)" }, // 半透明阴影，不破坏深色背景
          },
          backgroundColor: "#0A143A", // 深色背景，贴合图表主题
          borderColor: "rgba(64, 158, 255, 0.3)", // 浅蓝边框，匹配折线颜色
          borderWidth: 1,
          borderRadius: 8, // 圆角与柱子风格统一
          padding: [10, 12], // 内边距优化可读性
          textStyle: { color: "#FFFFFF", fontSize: 12 },
          // 自定义提示框内容：日期+颜色标识+系列名+数值
          formatter: function (params) {
            let content = `<div style="text-align: center; margin-bottom: 4px;">${params[0].axisValue}</div>`;
            // 系列颜色映射（与图表系列一一对应）
            const colorMap = {
              工单趋势: "#409EFF",
              工单数量1: "#FFE540",
              实际工单: "#38A1FF",
            };
            params.forEach((item) => {
              content += `
            <div style="display: flex; align-items: center; margin: 3px 0;">
              <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: ${
                colorMap[item.seriesName]
              }; margin-right: 6px;"></span>
              <span style="flex: 1;">${item.seriesName}</span>
              <span style="font-weight: 500;">${item.value} 单</span>
            </div>
          `;
            });
            return content;
          },
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
          axisTick: { lineStyle: { color: "rgba(255, 255, 255, 0.2)" } }, // 优化刻度线颜色
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
            name: "工单趋势",
            type: "line",
            data: [144, 112, 144, 180, 180, 180],
            itemStyle: { color: "#409EFF" },
            lineStyle: { width: 2, color: "#409EFF" },
            symbolSize: 5,
            // 修正：折线下方半透明填充（原color配置无效，改用areaStyle）
            areaStyle: {
              color: "rgba(64, 158, 255, 0)",
            },
            // 新增：折线点悬浮效果
            emphasis: {
              itemStyle: {
                color: "#FFFFFF",
                borderColor: "#409EFF",
                borderWidth: 2,
              },
              symbolSize: 8, // 悬浮放大，更醒目
            },
          },
          {
            name: "工单数量1",
            type: "bar",
            data: [112, 47, 112, 150, 150, 150],
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                { offset: 0, color: "#0b1353" },
                { offset: 1, color: "#FFE540" },
              ]),
              borderRadius: [8, 8, 0, 0],
            },
            barWidth: 8,
            barGap: "60%",
            // 新增：柱状图悬浮效果
            emphasis: {
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                  { offset: 0, color: "#142066" }, // 深色加深
                  { offset: 1, color: "#FFF066" }, // 浅色加亮
                ]),
              },
            },
          },
          {
            name: "实际工单",
            type: "bar",
            data: [96, 88, 96, 165, 165, 165],
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                { offset: 0, color: "#0b1353" },
                { offset: 1, color: "#38A1FF" },
              ]),
              borderRadius: [8, 8, 0, 0],
            },
            barWidth: 8,
            barGap: "60%",
            // 新增：柱状图悬浮效果
            emphasis: {
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                  { offset: 0, color: "#142066" }, // 深色加深
                  { offset: 1, color: "#4FC3F7" }, // 浅色加亮
                ]),
              },
            },
          },
        ],
      };
      myChart.setOption(option);
      window.addEventListener("resize", () => myChart.resize());
    },
    // 非抢修工单分布图表（匹配UI图数据）
    initNonFaultOrderChart() {
      const chartDom = document.getElementById("nonFaultOrderChart");
      const myChart = echarts.init(chartDom);
      const option = {
        grid: { top: "15%", left: "5%", right: "5%", bottom: "15%" },
        // 新增：深色主题悬浮提示框配置
        tooltip: {
          trigger: "axis", // 按坐标轴触发，显示当前X轴所有系列数据
          axisPointer: {
            type: "shadow",
            shadowStyle: { color: "rgba(255, 255, 255, 0.05)" }, // 半透明阴影，不破坏深色背景
          },
          backgroundColor: "#0A143A", // 深色背景，贴合图表主题
          borderColor: "rgba(64, 158, 255, 0.3)", // 浅蓝边框，匹配折线颜色
          borderWidth: 1,
          borderRadius: 8, // 圆角与柱子风格统一
          padding: [10, 12], // 内边距优化可读性
          textStyle: { color: "#FFFFFF", fontSize: 12 },
          // 自定义提示框内容：日期+颜色标识+系列名+数值
          formatter: function (params) {
            let content = `<div style="text-align: center; margin-bottom: 4px;">${params[0].axisValue}</div>`;
            // 系列颜色映射（与图表系列一一对应）
            const colorMap = {
              工单趋势: "#409EFF",
              工单数量1: "#FFE540",
              实际工单: "#38A1FF",
            };
            params.forEach((item) => {
              content += `
            <div style="display: flex; align-items: center; margin: 3px 0;">
              <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: ${
                colorMap[item.seriesName]
              }; margin-right: 6px;"></span>
              <span style="flex: 1;">${item.seriesName}</span>
              <span style="font-weight: 500;">${item.value} 单</span>
            </div>
          `;
            });
            return content;
          },
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
          axisTick: { lineStyle: { color: "rgba(255, 255, 255, 0.2)" } }, // 优化刻度线颜色
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
            name: "工单趋势",
            type: "line",
            data: [144, 112, 144, 180, 180, 180],
            itemStyle: { color: "#409EFF" },
            lineStyle: { width: 2, color: "#409EFF" },
            symbolSize: 5,
            // 修正：折线下方半透明填充（原color配置无效，改用areaStyle）
            areaStyle: {
              color: "rgba(64, 158, 255, 0)",
            },
            // 新增：折线点悬浮效果
            emphasis: {
              itemStyle: {
                color: "#FFFFFF",
                borderColor: "#409EFF",
                borderWidth: 2,
              },
              symbolSize: 8, // 悬浮放大，更醒目
            },
          },
          {
            name: "工单数量1",
            type: "bar",
            data: [112, 47, 112, 150, 150, 150],
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                { offset: 0, color: "#0b1353" },
                { offset: 1, color: "#C43B3B" },
              ]),
              borderRadius: [8, 8, 0, 0],
            },
            barWidth: 8,
            barGap: "60%",
            // 新增：柱状图悬浮效果
            emphasis: {
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                  { offset: 0, color: "#0b1353" }, // 深色加深
                  { offset: 1, color: "#4EBCFF" }, // 浅色加亮
                ]),
              },
            },
          },
          {
            name: "实际工单",
            type: "bar",
            data: [96, 88, 96, 165, 165, 165],
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                { offset: 0, color: "#0b1353" },
                { offset: 1, color: "#38A1FF" },
              ]),
              borderRadius: [8, 8, 0, 0],
            },
            barWidth: 8,
            barGap: "60%",
            // 新增：柱状图悬浮效果
            emphasis: {
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                  { offset: 0, color: "#142066" }, // 深色加深
                  { offset: 1, color: "#4FC3F7" }, // 浅色加亮
                ]),
              },
            },
          },
        ],
      };
      myChart.setOption(option);
      window.addEventListener("resize", () => myChart.resize());
    },
    // 重点指标管理图表（匹配文件2 Y轴标签顺序）
    initKeyIndicatorChart() {
      const chartDom = document.getElementById("keyIndicatorChart");
      const myChart = echarts.init(chartDom);
      const option = {
        // 调整网格布局，减少左侧留白，增加顶部空间匹配图片比例
        grid: {
          top: "0%",
          left: "5%",
          right: "5%",
          bottom: "5%",
          containLabel: true,
        },
        xAxis: {
          type: "value",
          max: 100,
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: {
            color: "#FFFFFF",
            fontSize: 12,
            formatter: (value) => `${value}`,
            margin: 10, // 增加距离避免重叠，比right更稳定
          },
          // 调整分割线颜色为更贴近图片的亮青色半透明
          splitLine: {
            lineStyle: {
              color: "rgba(46, 213, 213, 0.4)",
              type: "dotted",
              width: 1,
            },
          },
        },
        yAxis: {
          type: "category",
          data: [
            "网格化电话推广占比",
            "问题压降同比",
            "满意度指标",
            "供电服务问题数",
          ],
          inverse: true,
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: {
            color: "#FFFFFF",
            fontSize: 13,
            padding: [0, 0, 0, -5], // 精准左移，贴近图表
            fontWeight: 500,
          },
        },
        series: [
          {
            type: "bar",
            data: [72, 88, 92, 95],
            barWidth: 6, // 微调宽度更匹配图片
            // 增加右侧圆角，增强视觉效果
            itemStyle: {
              borderRadius: [0, 6, 6, 0],
              // 修正渐变色，匹配图片中各指标的实际颜色过渡
              color: ({ name }) => {
                const gradients = {
                  网格化电话推广占比: new echarts.graphic.LinearGradient(
                    0,
                    0,
                    1,
                    0,
                    [
                      { offset: 0, color: "#1DD1A1" }, // 更亮的浅青起点
                      { offset: 1, color: "#BFFAF8" },
                    ]
                  ),
                  问题压降同比: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                    { offset: 0, color: "#1DD1A1" }, // 更亮的浅青起点
                    { offset: 1, color: "#BFFAF8" }, // 调整为青绿色终点
                  ]),
                  满意度指标: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                    { offset: 0, color: "#1DD1A1" }, // 更亮的浅青起点
                    { offset: 1, color: "#BFFAF8" },
                  ]),
                  供电服务问题数: new echarts.graphic.LinearGradient(
                    0,
                    0,
                    1,
                    0,
                    [
                      { offset: 0, color: "#1DD1A1" }, // 更亮的浅青起点
                      { offset: 1, color: "#BFFAF8" },
                    ]
                  ),
                };
                return gradients[name];
              },
            },
            formatter: (value) => `${value}%`,
            label: {
              show: true,
              position: "right",
              color: "#FFFFFF",
              fontSize: 13,
              // 恢复百分号显示，匹配图片指标格式
              distance: 8, // 调整与柱子的距离
              fontWeight: 500,
            },
          },
        ],
      };
      myChart.setOption(option);
      window.addEventListener("resize", () => myChart.resize());
    },
    // 调整日期选择器样式（解决深色主题下默认白色问题）
    adjustDatePickerStyle() {
      const picker = document.querySelector(".year-picker");
      if (picker) {
        // 强制刷新样式（避免Vue异步渲染延迟）
        picker.classList.add("force-refresh");
      }
    },
  },
};
</script>

<style lang="scss" scoped>


/* 顶部导航容器（新增标题样式） */
.nav-container {
  display: flex;
  align-items: center;
  padding: 0 20px;
  background-color: #165dff;
  height: 60px;
}

.dashboard-title {
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
  margin-right: 40px;
  white-space: nowrap;
}

.nav-row {
  margin-bottom: 15px; // 缩小导航与内容间距
}

/* 顶部导航菜单样式优化 */
::v-deep .top-nav {
  flex: 1;
  height: 100%;
  .el-menu-item {
    font-size: 14px;
    padding: 0 20px; // 缩小菜单间距
    height: 100%;
    line-height: 60px; // 垂直居中
    &.is-active {
      background-color: #0c3167 !important;
    }
  }
  .el-menu--horizontal {
    border-bottom: none;
  }
}

/* 内容卡片样式（紧凑布局） */
.content-card {
  background-color: rgba(9, 10, 78, 0.5);
  border: none;
  margin-bottom: 15px; // 缩小卡片间距
  ::v-deep .el-card__header {
    background-color: transparent;
    border-bottom: 0px solid rgba(255, 255, 255, 0.2); // 加深边框
    padding: 12px 15px; // 缩小内边距
    color: #ffffff;
  }
}

.card-header-title {
  font-family: SourceHanSansCN, SourceHanSansCN;
  font-weight: bold;
  font-size: 24px;
  color: #ffffff;
}

/* 表格样式（匹配文件3紧凑效果） */
.content-table {
  width: 100%;
  margin-top: 10px; // 缩小表格与表头间距
  ::v-deep .el-table {
    background-color: transparent;
    color: #ffffff;
    font-size: 13px; // 缩小表格字体
  }
  ::v-deep .el-table__body-wrapper {
    background-color: transparent;
  }
  ::v-deep .el-table th,
  ::v-deep .el-table td {
    border-color: rgba(255, 255, 255, 0.2); // 加深表格边框
    padding: 8px 0; // 缩小单元格内边距
    text-align: center;
  }
  ::v-deep .el-table__row:hover > td {
    background-color: rgba(255, 255, 255, 0.08) !important;
  }
  // 解决表格无数据时的空白样式
  ::v-deep .el-table__empty-block {
    background-color: transparent;
    color: #ffffff;
  }
}
::v-deep .el-table {
  background-color: transparent !important;
}
/* 图表容器样式（匹配UI图大小） */
.chart-container {
  width: 100%;
  height: 250px; // 缩小图表高度
  margin-top: 10px;
}

.key-indicator-chart {
  height: 250px; // 重点指标图表稍高
}
::v-deep .el-tabs__nav-wrap::after {
  display: none;
}
/* 工单池Tab样式（确保切换生效，匹配UI图） */
::v-deep .tab-group {
  .el-tabs__nav {
    border-bottom: none !important;
    // height: 30px; // 缩小Tab高度
  }
  .el-tabs__item {
    background-color: #011b46 !important;
    border: 1px solid #1875a7 !important;
    color: #ffffff !important;
    padding: 0 8px !important; // 缩小Tab内边距
    margin-right: 4px !important; // 缩小Tab间距
    font-size: 12px !important; // 缩小Tab字体
    height: 30px !important;
    line-height: 28px !important;
    border-radius: 4px !important;
  }
  .el-tabs__item.is-active {
    background-color: #165dff !important;
    border-color: #165dff !important;
  }
  .el-tabs__active-bar {
    display: none !important; // 隐藏默认下划线
  }
}

/* 年份选择器样式（深色主题适配） */
::v-deep .year-picker {
  .el-input__inner {
    background-color: #011b46 !important;
    border-color: #1875a7 !important;
    color: #ffffff !important;
    font-size: 12px !important;
    height: 30px !important;
  }
  .el-input__icon {
    color: #ffffff !important;
  }
  // 解决placeholder颜色问题
  .el-input__inner::placeholder {
    color: #cccccc !important;
  }
}

/* 强制刷新样式（解决日期选择器异步渲染问题） */
.force-refresh {
  animation: refresh 0.01s;
}

@keyframes refresh {
  from {
    opacity: 0.99;
  }
  to {
    opacity: 1;
  }
}

/* 工具类 */
.flex {
  display: flex;
}

.justify-between {
  justify-content: space-between;
}

.items-center {
  align-items: center;
}

/* 滚动条样式（匹配整体风格） */
::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}

::-webkit-scrollbar-thumb {
  background-color: #1875a7;
  border-radius: 2px;
}

/* 解决Element UI全局样式冲突 */
::v-deep .el-popover {
  background-color: #011b46 !important;
  border-color: #1875a7 !important;
  color: #ffffff !important;
}

::v-deep .el-calendar {
  background-color: #011b46 !important;
  border-color: #1875a7 !important;
}

::v-deep .el-calendar-header {
  color: #ffffff !important;
}

::v-deep .el-calendar-table td {
  color: #ffffff !important;
}

::v-deep .el-calendar-table .el-calendar-day {
  color: #ffffff !important;
}

::v-deep .el-calendar-table .el-calendar-day.is-selected {
  background-color: #165dff !important;
}
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

/* 解决表格无数据时的空白区域背景色 */
::v-deep .el-table__empty-block {
  background-color: transparent !important;
}
::v-deep .el-table tr {
  background: #103c72;
  border-radius: 2px 2px 2px 2px;
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
::v-deep .el-card__body {
    padding-top: 0;
}
</style>
