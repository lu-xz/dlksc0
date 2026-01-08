<!-- <template>
  <div class="hello">
    <div style="position: absolute; top: 0">
      <input style="font-size: 16px" type="file" @change="uploadExcel" />
    </div>

    <div
      id="luckysheet"
      style="
        margin: 0px;
        padding: 0px;
        position: absolute;
        width: 100%;
        left: 0px;
        top: 30px;
        bottom: 0px;
      "
    ></div>

    <div
      v-show="isMaskShow"
      style="
        position: absolute;
        z-index: 1000000;
        left: 0px;
        top: 0px;
        bottom: 0px;
        right: 0px;
        background: rgba(255, 255, 255, 0.8);
        text-align: center;
        font-size: 40px;
        align-items: center;
        justify-content: center;
        display: flex;
      "
    >
      Downloading
    </div>
  </div>
</template>

<script>
import LuckyExcel from "luckyexcel";
export default {
  name: "ExcelView",
  props: {
    msg: String,
  },
  data() {
    return {
      isMaskShow: false,
      options: {
        container: 'luckysheet', //容器id名
        title: 'Luckysheet', // 表头名
        lang: 'zh', // 中文
        showtoolbar: true, // 是否显示工具栏
        showinfobar: false, // 是否显示顶部信息栏
        showsheetbar: true // 是否显示底部sheet按钮
      }
    };
  },
  mounted() {
    //luckysheet.create(this.options);
  },
  methods: {
    uploadExcel(evt) {
      const files = evt.target.files;
      if (files == null || files.length == 0) {
        alert("No files wait for import");
        return;
      }

      let name = files[0].name;
      let suffixArr = name.split("."),
        suffix = suffixArr[suffixArr.length - 1];
      if (suffix != "xlsx") {
        alert("Currently only supports the import of xlsx files");
        return;
      }
      LuckyExcel.transformExcelToLucky(
        files[0],
        function (exportJson, luckysheetfile) {
          console.log(exportJson.sheets)
          if (exportJson.sheets == null || exportJson.sheets.length == 0) {
            alert(
              "Failed to read the content of the excel file, currently does not support xls files!"
            );
            return;
          }
          window.luckysheet.destroy();

          window.luckysheet.create({
            container: "luckysheet", //luckysheet is the container id
            showinfobar: false,
            data: exportJson.sheets,
            title: exportJson.info.name,
            userInfo: exportJson.info.name.creator,
          });
        }
      );
    },
  },
};
</script>

<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style> -->

<template>
  <iframe id="excel" :src="`/excel/index.html?filePath=${excelUrl}&fileName=${excelName}&baseApi=${baseApi}`" style="border:none"></iframe>
</template>
<script>
export default {
  props: {
    excelUrl: {
      type: String,
      default: '',
      required: true
    },
    excelName: {
      type: String,
      default: '',
      required: true
    },
    baseApi: {
      type:String,
      default:''
    }
  },
  methods: {

  },
}
</script>
