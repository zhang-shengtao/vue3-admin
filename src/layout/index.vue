<script setup name="layout">
  import zhCn from "element-plus/dist/locale/zh-cn.mjs";
  import Headers from "./Header/index.vue";
  import Menus from "./Menu/index.vue";
  import AppMain from "./AppMain/index.vue";
</script>

<template>
  <el-config-provider :locale="zhCn">
    <el-container class="container">
      <menus />
      <el-container class="is-vertical">
        <headers />
        <app-main />
      </el-container>
    </el-container>
  </el-config-provider>
</template>
<style lang="scss" scoped>
  .container {
    width: 100%;
    height: 100%;
  }
</style>
