<template>
    <div>
      <el-row style="margin-top:25px;">
        <el-col :span="24">
          <el-form :model="chartParams" ref="queryForm" :inline="true" label-width="88px">
            <div class="back" @click="back">返回</div>
            <el-form-item label="镇" prop="town">
                <el-select
                v-model="chartParams.town"
                placeholder="全部"
                clearable
                filterable
                :filter-method="handleFilter"
                size="small"
                style="width: 180px"
                @change="changTown"
                >
                <el-option
                    v-for="dict in townOptions"
                    :key="dict.town"
                    :label="dict.town"
                    :value="dict.town"
                />
                </el-select>
            </el-form-item>
            <el-form-item label="站点名称" prop="siteName">
              <el-input
                v-model="chartParams.siteName"
                placeholder="请输入站点名称"
                clearable
                size="small"
                style="width: 240px"
                @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery" :disabled="loading">搜索</el-button>
            </el-form-item>
        </el-form>
        </el-col>
      </el-row>
      <div class="chartMain">
        <el-row v-for="(item,index) in mapData" :key="index">
          <el-col :span="24" style="padding: 20px 0">
              <el-row :gutter="20">
                <el-col :span="14">
                  <div class="yy">
                    <div class="title3">{{ item.town + item.administrativeVillage + item.naturalVillage }} 日用电量曲线图</div>
                    <PowerChart :id="'power'+ index" :power="item.power"></PowerChart>
                  </div
                ></el-col>
                <el-col :span="10">
                  <div class="yy">
                    <div class="title3">{{ item.town + item.administrativeVillage + item.naturalVillage }} 处理量、用电量统计图</div>
                    <DealPowerChart :id="'dealPower'+ index" :dealPower="item.dealPower"></DealPowerChart>
                  </div
                ></el-col> </el-row
            ></el-col>
        </el-row>
      </div>
    </div>
  </template>
  <script>
  import { getCwSiteList, getAllDealPowerList, getAllPowerList, getTownList } from '@/api/dlkcw/index';
  import PinyinMatch from 'pinyin-match';
  import PowerChart from "./powerChart.vue";
  import DealPowerChart from "./dealPowerChart.vue";
  export default {
    components: {
       PowerChart, DealPowerChart
    },
    data() {
      return {
        mapData: [],
        finalMapData: [],
        initMapData: require("@/static/json/cwSite.json"),
        initDealPowerList: require("@/static/json/dealPowerList.json"),
        initPowerList: require("@/static/json/power.json"),
        chartParams:{
          siteName: undefined,
          town: undefined,
        },
        townData: require("@/static/json/townData.json"),
        townOptions:[],
        initTownOptions: [],
        waiting: null,
        loading: false,
        hasPower: false,
        hasDealPower: false
      };
    },
    created() {},
    mounted() {
      // 静态页面直接加载
      if(JSON.parse(process.env.VUE_APP_IS_STATIC)){
        this.initMapData.forEach(item=>{
           item.dealPower = this.initDealPowerList.find(d=> item.custNo === d.custNo) || {xData:[],dealData:[],powerData:[]}
           item.power = this.initPowerList.find(d=> item.custNo === d.custNo) || {xData:[],yData:[]};
        })
        this.finalMapData = this.initMapData;
        this.lazyLoad(this.finalMapData);
        this.townOptions = this.townData.map(item=>{
            let json = {town: item.town}
            return json;
          });
        this.initTownOptions = Object.assign(this.townOptions);
      }else{
        const waiting = this.$loading({
          lock: true,
          text: '数据加载中，请稍后',
          spinner: 'el-icon-loading',
          background: 'rgba(0,0,0, 0.1)'
        });
        this.getMapData();
        getTownList().then((res) => {
          this.townOptions = res.data;
          this.initTownOptions = Object.assign(this.townOptions);
        })
        let timer = setInterval(() => {
          if(this.hasDealPower && this.hasPower){
            waiting.close();
            this.lazyLoad(this.finalMapData);
            clearInterval(timer);
          }
        },50)
      }
      
    },
    methods: {
      back(){
        this.$router.push({name: "Index",params: { back: true }});
      },
      getMapData(){
        getCwSiteList().then((res) => {
            const siteList = res.data;
            let list = []
            siteList.forEach(item=>{
                item.dealPower = {xData:[],dealData:[],powerData:[]};
                item.power = {xData:[],yData:[]};
                let json = {"properties":{"adcode":3203120001,"value":"1","level":"country","center":[item.lng,item.lat],"name":item.naturalVillage,"address":item.town + item.administrativeVillage + item.naturalVillage,"dealNum":item.dealNum,"custNo":item.custNo}
                }
                list.push(json)
            })
            console.log(list)
            this.finalMapData = siteList;
            this.getAllDealPowerList();
            this.getAllPowerList();
        })
      },
      getAllDealPowerList(){
        getAllDealPowerList().then((res) => {
          const initDealPowerList = res.data;
          this.finalMapData.forEach(item=>{
            item.dealPower = initDealPowerList.find(d=> item.custNo === d.custNo) || {xData:[],dealData:[],powerData:[]};
          })
          this.hasDealPower = true;
        })
      },
      getAllPowerList(){
        getAllPowerList().then((res) => {
          const initPowerList = res.data;
          this.finalMapData.forEach(item=>{
            item.power = initPowerList.find(d=> item.custNo === d.custNo) || {xData:[],yData:[]};
          })
          this.hasPower = true;
        })
      },
      changTown(){
        this.townOptions = this.initTownOptions;
      },
      handleFilter(val) {
        // 对绑定数据赋值
        if (val) {
          this.townOptions = this.initTownOptions.filter((item) => {
            // 如果直接包含输入值直接返回true
            if (item.town) {
              if (
                item.town.toUpperCase().indexOf(val.toUpperCase()) != -1
              ) {
                return true;
              }
              // 输入值拼音d
              return PinyinMatch.match(item.town, val);
            }
          });
        } else {
          this.townOptions = this.initTownOptions;
        }
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.mapData = [];
        this.loading = true;
        let list = this.finalMapData.filter(item=>{
            if(!this.chartParams.siteName){
                return true;
            }
            item.siteName = item.town + item.administrativeVillage + item.naturalVillage;
            return item.siteName.indexOf(this.chartParams.siteName) > -1 || PinyinMatch.match(item.siteName, this.chartParams.siteName);
        })
        list = list.filter(item=>{
            if(!this.chartParams.town){
                return true;
            }
            return item.town === this.chartParams.town;
        })
        this.lazyLoad(list);
      },
      lazyLoad(list){
        let count = 0;
        this.loading = list.length > 0;
        list.forEach(item=>{
          setTimeout(() => {
            count ++;
            this.mapData.push(item);
            this.loading = count < list.length;
          }, 50);
        })
      }
    },
  };
  </script>
  
  <style lang="scss" scoped>
  @import "./style.scss";
  </style>