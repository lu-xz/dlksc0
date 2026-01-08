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
        power:{
          type: Object,
          default: {xData:[],yData:[]}
        }
      },
      data() {
        return {
          loading: false,
          myChart: null,
        };
      },
      watch: {
        power: {
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
            xAxis: [
                {
                    type: "category",
                    data: this.power.xData,
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
            yAxis: {
                type: "value",
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
            series: [
                {
                    name: "",
                    type: "line",
                    showSymbol: true,
                    symbolSize: 5,
                    // smooth: true,
                    lineStyle: {
                        color: "#F6B221",
                    },
                    itemStyle: {
                        color: "#F6B221",
                        borderColor: "#F6B221",
                        borderWidth: 2,
                    },
                    data: this.power.yData,
                },
            ],
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