<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
// 处理笔记本系统默认系统比例为150% 125%带来的布局影响
// import DevicePixelRatio from '@/utils/devicePixelRatio.js';
export default {
  name: 'App',
  metaInfo() {
    return {
      title:
        this.$store.state.settings.dynamicTitle &&
        this.$store.state.settings.title,
      titleTemplate: (title) => {
        return title
          ? `${title} - ${process.env.VUE_APP_TITLE}`
          : process.env.VUE_APP_TITLE;
      }
    };
  },
  //在vue生命周期created中添加    处理笔记本系统默认系统比例为150% 125%带来的布局影响
  // created() {
  //   new DevicePixelRatio().init();
  // }
};
</script>
<style>

/*全局滚动条样式*/
::-webkit-scrollbar {
  width: 8px;
  height: 14px;
}
/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
  background-color: #b6b6b6;
  border-radius: 4px;
}
</style>
