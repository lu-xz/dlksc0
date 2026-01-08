<template>
  <div class="main">
    <div>
      <el-form
        :inline="true"
        ref="queryParams"
        :model="queryParams"
        class="demo-form-inline"
        id="demo-form"
        label-width="90px"
      >
        <div style="float: left">
          <el-form-item label="台区名称" prop="sshy">
            <el-input
              v-model="companyName"
              placeholder="请输入"
              style="width: 300px; padding-right: 8px"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="台区编号" prop="sshy">
            <el-select
              v-model="queryParams.sshy"
              clearable
              placeholder="请选择"
              :popper-append-to-body="false"
            >
              <el-option
                v-for="item in optionsshy"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="日期" prop="qylx">
            <el-date-picker v-model="value1" type="date" placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button
              class="bluebtn"
              @click="handleQuery"
              icon="el-icon-search"
              >查询</el-button
            >
          </el-form-item>
        </div>
        <div style="float: right">
          <el-form-item>
            <el-button
              class="sbluebtn"
              @click="handleAdd"
              icon="el-icon-plus"
              style="float: right"
              >新增</el-button
            >
          </el-form-item>
        </div>
      </el-form>
      <el-table
        :data="tableData"
        style="width: 100%"
        highlight-current-row
        :header-cell-style="{
          padding: '14px',
          background: 'none',
          color: '#fff',
          fontWeight: '600',
          fontSize: '16px',
        }"
      >
        <el-table-column type="index" width="80" label="序号" align="center">
        </el-table-column>
        <el-table-column
          prop="name"
          label="台区名称"
          align="center"
          width="200"
        >
        </el-table-column>
        <el-table-column
          prop="name"
          label="台区编号"
          align="center"
          width="200"
        >
        </el-table-column>
        <el-table-column prop="date" label="台区地址" align="center">
        </el-table-column>
        <el-table-column
          prop="name"
          label="台区名称"
          align="center"
          width="200"
        >
        </el-table-column>
        <el-table-column
          prop="name"
          label="台区地址"
          align="center"
          width="200"
        >
        </el-table-column>
        <el-table-column prop="date" label="台区地址" align="center">
        </el-table-column>
        <el-table-column prop="name" label="日期" align="center" width="200">
        </el-table-column>
        <el-table-column prop="name" label="发电量" align="center" width="200">
        </el-table-column>
        <el-table-column prop="date" label="售电量" align="center">
        </el-table-column>
        <el-table-column prop="date" label="线损电量" align="center">
        </el-table-column>
        <el-table-column prop="date" label="线损率" align="center">
        </el-table-column>
      </el-table>
      <div style="display: flex; justify-content: center">
        <el-pagination background lay out="prev, pager, next" :total="1000">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import {
  getCwSite,
  getAbnormalList,
  getDealPower,
  getPower,
} from "@/api/dlkxzscl/index";
export default {
  data() {
    return {
      optionsshy: [],
      title: "新增",
      dialogVisible: false,
      abnormalParams: {
        pageNum: 1,
        pageSize: 10,
        companyName: null,
        abnormalType: null,
        total: 0,
        list: [],
        data: require("@/static/json/abnormal.json"),
      },
      abnormalTypeOptions: [
        {
          value: "0",
          label: "在业或存续经营但低（零）用电量",
        },
        {
          value: "1",
          label: "注销或吊销但有用电量",
        },
        {
          value: "2",
          label: "在业或存续经营但高用电量",
        },
      ],
      optionqylx: [
        {
          value: "选项1",
          label: "黄金糕",
        },
        {
          value: "选项2",
          label: "双皮奶",
        },
        {
          value: "选项3",
          label: "蚵仔煎",
        },
        {
          value: "选项4",
          label: "龙须面",
        },
        {
          value: "选项5",
          label: "北京烤鸭",
        },
      ],
      optionqyzt: [],
      queryParams: {
        pageSize: 10,
        pageNum: 1,
        name: "",
        qylx: "",
        sshy: "",
        qyzt: "",
      },
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          type: "1",
          status: "存续",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          type: "2",
          status: "在业",
          address: "上海市普陀区金沙江路 1517 弄",
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          status: "吊销",
          address: "上海市普陀区金沙江路 1519 弄",
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          status: "注销",
          address: "上海市普陀区金沙江路 1516 弄",
        },
      ],
      // abnormalList: [],
      loading: false,
      abnormalParams: {
        pageNum: 1,
        pageSize: 3,
        total: 0,
        list: [],
        data: require("@/static/json/abnormal.json"),
      },
      custNo: "",
      cwSite: {
        town: "",
        administrativeVillage: "",
        naturalVillage: "",
        dealNum: "",
        custNo: "",
        createDate: "",
        dealRate: "",
        dealCost: "",
      },
      mapData: require("@/static/json/mapData.json"),
      dealPowerList: require("@/static/json/dealPowerList.json"),
      dealPower: {},
      powerList: require("@/static/json/power.json"),
      power: {},
      value1: "",
    };
  },
  created() {},
  mounted() {},
  methods: {
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.dialogVisible = true;
      this.title = "添加任务";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.dialogVisible = true;
      this.title = "修改任务";
      const jobId = row.jobId || this.ids;
      //   getJob(jobId).then((response) => {
      //     this.form = response.data;
      //     this.dialogVisible = true;
      //     this.title = "修改任务";
      //   });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.jobId != undefined) {
            updateJob(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.dialogVisible = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addJob(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.dialogVisible = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          }
        }
      });
    },
    resetAbnormalQuery() {
      this.dialogVisible = false;
    },
    handleDelete(row) {
      const id = row.id || this.ids;
      this.$modal
        .confirm("是否确认删除此数据项？")
        .then(function () {
          return delSubstation(id);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./style.scss";
::v-deep .el-dialog__body .el-form-item__label {
  color: #fff !important;
}
.bluebtn {
  background: #2596ff;
  border: none;
  color: #fff;
}
.bluebtn:hover {
  background: #0669c5;
  border: none;
  color: #d4d4d4;
}
.sbluebtn {
  background: #004d8c;
  border: none;
  color: #fff;
}
.sbluebtn:hover {
  background: #012e53;
  border: none;
  color: #b2b2b2;
}
.el-row {
  margin-bottom: 20px;
}
.lv {
  background: rgba(44, 220, 252, 0.16);
  color: #2cdcfc;
  border: none;
}
.huang {
  background: rgba(252, 224, 87, 0.2);
  color: #fce057;
  border: none;
}
.lan {
  background: rgba(37, 150, 255, 0.17);
  color: #2596ff;
  border: none;
}
.hong {
  background: rgba(251, 64, 65, 0.13);
  color: #fc4141;
  border: none;
}

::v-deep .el-select,
::v-deep .el-input,
::v-deep .el-input__inner {
  background: #011b46;
  color: #fff;
  border-radius: 0px;
  border-color: #1875a7;
  text-align: center;
}

//修改的是el-input上下的小图标的颜色
::v-deep .el-select .el-input .el-select__caret {
  color: #fff;
}
//修改总体选项的样式 最外层
::v-deep .el-select-dropdown {
  background: #011b46;
  //margin: 0px;
  border: 0px;
}

//修改单个的选项的样式
::v-deep .el-select-dropdown__item {
  background-color: transparent;
  color: #fff;
}

//item选项的hover样式
::v-deep .el-select-dropdown__item.hover,
::v-deep .el-select-dropdown__item:hover {
  color: #fff;
  background: rgba(57, 70, 103, 0.3);
}

//修改的是下拉框选项内容上方的尖角
::v-deep .el-popper .popper__arrow,
.el-popper .popper__arrow::after {
  display: none;
}

::v-deep .el-select-dropdown {
  position: absolute;
  top: 36px;
  left: 0 !important;
}
//el-input聚焦的时候 外层的border会有一个样式
::v-deep .el-select .el-input__inner:focus {
  border-color: #1875a7;
}

//分页
::v-deep .el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #2596ff !important;
  color: #ffffff;
}
::v-deep .el-dialog__header {
  background-color: #07083a;
  background-size: 100% 100%;
  background-repeat: no-repeat;

  // background: url(~@/assets/dlkwzImg/biaoti.png) no-repeat;
  .el-dialog__title {
    color: #fff;
    font-size: 30;
    font-weight: 900;
    padding-left: 40px;
  }
}

::v-deep .el-dialog__body {
  background: #07083a;
  color: #fff;
}

::v-deep .el-dialog__headerbtn .el-dialog__close {
  color: #fff;
}
::v-deep .dialogTable .el-form--inline .el-form-item {
  display: block !important;
}
</style>
