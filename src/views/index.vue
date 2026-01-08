<template>
  <div class="dashboard-editor-container" :style="{ height: height }">
    <div class="index-main justify" style="padding-top: 10%">
      <div class="index-wel">
        <span style="color: #3f51c9; font-size: 60px; font-weight: 100"
          >欢迎使用</span
        ><br />
        <span
          id="system_name"
          style="
            color: #2a3fca;
            font-size: 30px;
            font-weight: bolder;
            height: 50px;
            line-height: 50px;
          "
          >{{ systemName }}</span
        >
      </div>
      <div class="index-pic">
        <img :src="backgroundImg" />
      </div>
    </div>
  </div>
</template>

<script>
const defaultSettings = require('@/settings')
export default {
  data() {
    return {
      height: document.documentElement.clientHeight - 80 + 'px',
      backgroundImg: require('@/assets/images/welcom.png'),
      systemName: defaultSettings.title
    }
  },
  mounted() {
    window.onresize = () => {
      return (() => {
        this.height = document.documentElement.clientHeight - 80 + 'px'
      })();
    };
  },
  created() {
    this.query();
  },
  methods: {
    query() {},
  },
};
</script>

<style lang="scss" scoped>
.justify{
	position: relative;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: justify;
    -webkit-justify-content: space-between;
    justify-content: space-between;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
}
.index-main{
	min-height: 400px;
	padding: 0 20%;
}
.index {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-size: cover;
}
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>