<template>
    <div
      :id="id"
      style="width: 100%; height: 250px"
      v-loading="loading"
      element-loading-background="rgba(0, 0, 0, 0.6)"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
    ></div>
</template>
<script>
    import * as echarts from "echarts";
    export default {
      name: "PowerChart",
      props: {
        id: {
          type: String,
        },
        dealPower:{
          type: Object,
          default: {xData:[],dealData:[],powerData:[]}
        }
      },
      data() {
        return {
          loading: false,
          myChart: null,
        };
      },
      watch: {
        dealPower: {
          handler: function (val, oldVal) {
            this.updateChart();
          },
        },
      },
      mounted() {
        this.initChart();
      },
      beforeDestroy() {
        if(this.myChart){
          this.myChart.dispose();
          this.myChart = null;
        }
      },
      computed: {
        getOption() {
          let option = {
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
                data: this.dealPower.xData,
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
                    fontSize: 16,
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
                    fontSize: 16,
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
                data: this.dealPower.dealData,
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
                data: this.dealPower.powerData,
            }],
          };
          return option;
        }
      },
      methods: {
        initChart() {
          this.loading = true;
          if(!this.myChart){
            var chartDom = document.getElementById(this.id);
            this.myChart = echarts.init(chartDom);
          }
          this.myChart.setOption(this.getOption);
          this.loading = false;
        },
        updateChart() {
          // 绘制折线图
          this.myChart.setOption(this.getOption);
        },
      },
    };
    </script>
    <style lang="scss" scoped></style>