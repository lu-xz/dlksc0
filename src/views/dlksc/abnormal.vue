<template>
    <div class="main">
      <el-row>
        <el-col :span="24">
          <div class="back" @click="back">返回</div>
        </el-col>
        <el-col :span="24">
          <div class="cc4">
            <div class="title4">异常数据分析列表</div>
            <el-form :model="abnormalParams" ref="queryForm" :inline="true" label-width="88px">
                <el-form-item label="镇" prop="town">
                    <el-select
                    v-model="abnormalParams.town"
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
                    v-model="abnormalParams.siteName"
                    placeholder="请输入站点名称"
                    clearable
                    size="small"
                    style="width: 240px"
                    @keyup.enter.native="handleQuery"
                    />
                </el-form-item>
            
                <el-form-item label="异常类型" prop="abnormalType">
                    <el-select
                    v-model="abnormalParams.abnormalType"
                    placeholder="全部"
                    clearable
                    size="small"
                    style="width: 240px"
                    @change="changeAbnormalType"
                    >
                    <el-option
                        v-for="dict in abnormalOptions"
                        :key="dict.dictValue"
                        :label="dict.dictLabel"
                        :value="dict.dictValue"
                    />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery(1)">搜索</el-button>
                    <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                    <el-button type="warning" icon="el-icon-download" size="mini" @click="exportToExcel">导出</el-button>
                </el-form-item>
            </el-form>
            <div v-if="reason" class="reason">
              <!-- <span class="suggest">{{ abnormalParams.abnormalType === '7' ? '建议:':'异常原因分析:'}}</span> -->
              <span class="suggest">异常原因分析:</span>
              {{ abnormalParams.abnormalType === '7'?'':'可能与'}}
              <span class="reason-content">{{ reason }}</span>
              {{ abnormalParams.abnormalType === '7'?'':'等有关'}}
            </div>
            <el-table
              :data="abnormalList"
              style="width: 100%"
              :header-cell-style="{
                padding: '12px',
                background: 'none',
                color: '#fff',
                fontWeight: '600',
                fontSize: '16px',
              }"
              v-loading="loading"
              element-loading-text="拼命加载中"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0.8)"
            >
              <el-table-column
                prop="siteName"
                label="站点名称"
                align="center"
                width="300"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <span @click="gotoXq(scope.row)" style="cursor: pointer;">{{scope.row.siteName}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="abnormalType"
                label="异常类型"
                align="center"
                width="300"
                :formatter="abnormalTypeFormat"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                prop="dataRange"
                label="数据范围"
                align="center"
                width="200"
                show-overflow-tooltip
              >
              </el-table-column>
              <!-- <el-table-column
                prop="dealNum"
                label="处理量"
                align="center"
                width="200"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                prop="totalNum"
                label="用电量"
                align="center"
                width="200"
                show-overflow-tooltip
              >
              </el-table-column> -->
              <el-table-column
                prop="msg"
                label="异常说明"
                align="center"
                show-overflow-tooltip
              >
              </el-table-column>
            </el-table>
            <pagination
              v-show="abnormalParams.total > 0"
              :total="abnormalParams.total"
              :page.sync="abnormalParams.pageNum"
              :limit.sync="abnormalParams.pageSize"
              @pagination="(page) => {pageChange(page,'abnormal');}"
            />
          </div>
        </el-col>
      </el-row>
    </div>
  </template>
  <script>
  import { getAllAbnormalList, getTownList, exportData } from '@/api/dlkcw/index';
  import PinyinMatch from 'pinyin-match';
  export default {
    data() {
      return {
        abnormalList: [],
        loading: false,
        abnormalParams: {
          pageNum: 1,
          pageSize: 10,
          total: 0,
          siteName: undefined,
          abnormalType: undefined,
          town: undefined,
          list: [],
          data: require("@/static/json/abnormal.json")
        },
        abnormalOptions:[{
          dictLabel:'有处理量但低（零）用电量',dictValue:'1',reason:'现场处理设备未启动或未完全启动、流量采集有问题、提供的户号数据有误、负荷未经过电能表'
        },{
          dictLabel:'有处理量但高用电量',dictValue:'2',reason:'现场处理设备异常启动、外部施工借电'
        },{
          dictLabel:'高处理量但低用电量',dictValue:'3',reason:'现场处理设备未启动或未完全启动、流量采集有问题、负荷未经过电能表'
        },{
          dictLabel:'处理量类似但用电量变化大',dictValue:'4',reason:'现场处理设备未按照流量需求进行启动、自动化控制策略过于激进'
        },{
          dictLabel:'处理量减少但用电量增加',dictValue:'5',reason:'现场处理设备未按照流量需求进行启动、自动化控制策略过于激进'
        },{
          dictLabel:'处理量增加但用电量减少',dictValue:'6',reason:'现场处理设备未按照流量需求进行启动、自动化控制策略过于激进'
        },{
          dictLabel:'处理量满负荷或超90%',dictValue:'7',reason:'需进行扩容改造'
        }],
        townData: require("@/static/json/townData.json"),
        townOptions:[],
        initTownOptions: [],
        reason: ''
      };
    },
    created() {
    
    },
    mounted() {
      this.abnormalParams.town = localStorage.getItem('siteName');
      this.getAbnormalList();
      this.getTownList();
    },
    methods: {
      getTownList(){
        if(this.justIsStatic()){
          this.townOptions = this.townData.map(item=>{
            let json = {town: item.town}
            return json;
          });
          this.initTownOptions = Object.assign(this.townOptions,{});
        }else{
          getTownList().then((res) => {
            this.townOptions = res.data;
            this.initTownOptions = Object.assign(this.townOptions,{});
          })
        }
      },
      justIsStatic(){
        return JSON.parse(process.env.VUE_APP_IS_STATIC);
      },
      getAbnormalList(){
        let pageNum = localStorage.getItem('pageNum');
        pageNum = pageNum ? parseInt(pageNum) : 1;
        localStorage.setItem('pageNum','');
        if(this.justIsStatic()){
          this.handleQuery(pageNum);
        }else{
          getAllAbnormalList().then((res) => {
            this.abnormalParams.data = res.data;
            this.handleQuery(pageNum);
          })
        }
      },
      pageChange(page, key) {
        const pageNum = page.page;
        this.dealData(pageNum, key);
      },
      dealData(pageNum, key) {
        const data = this[key + "Params"].list;
        const pageSize = this[key + "Params"].pageSize;
        this[key + "List"] = data.slice((pageNum - 1) * pageSize, pageNum * pageSize);
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
      abnormalTypeFormat(row){
        return this.selectDictLabel(this.abnormalOptions,row.abnormalType);
      },
      /** 搜索按钮操作 */
      handleQuery(pageNum) {
        this.abnormalParams.pageNum = pageNum ? pageNum : 1;
        let list = this.abnormalParams.data.filter(item=>{
            if(!this.abnormalParams.siteName){
                return true;
            }
            return item.siteName.indexOf(this.abnormalParams.siteName) > -1 || PinyinMatch.match(item.siteName, this.abnormalParams.siteName);
        })
        list = list.filter(item=>{
            if(!this.abnormalParams.town){
                return true;
            }
            return item.siteName.indexOf(this.abnormalParams.town) > -1
        })
        this.abnormalParams.list = list.filter(item=>{
            if(!this.abnormalParams.abnormalType){
                return true;
            }
            return item.abnormalType === this.abnormalParams.abnormalType;
        })
        this.abnormalParams.total = this.abnormalParams.list.length;
        this.dealData(pageNum,'abnormal');
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.dateRange = [];
        this.resetForm("queryForm");
        this.handleQuery();
      },
      back(){
        this.$router.push({name: "Index",params: { back: true }});
      },
      changeAbnormalType(){
        if(this.abnormalParams.abnormalType){
          let list = this.abnormalOptions.filter(item=> item.dictValue === this.abnormalParams.abnormalType)
          this.reason = list[0].reason;
        }else{
          this.reason = ''
        }
      },
      gotoXq(row){
        localStorage.setItem('custNo', row.custNo);
        localStorage.setItem('pageNum', this.abnormalParams.pageNum);
        localStorage.setItem('abnormal', true);
        this.$router.push({path: "/dlkcw/xq",query: { custNo: row.custNo }});
      },
      exportToExcel() {
        const headers = ['站点名称', '异常类型', '数据范围', '异常说明']
        const data = this.abnormalParams.list.map(item => [item.siteName, this.abnormalTypeFormat(item), item.dataRange,item.msg])
        exportData(headers,data,'异常数据列表','异常数据');
      }
    },
  };
  </script>
  
  <style lang="scss" scoped>
  @import "./style.scss";
  </style>