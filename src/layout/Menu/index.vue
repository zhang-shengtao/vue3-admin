<script setup>
  import PINIA_LAYOUT from "@/stores/layout";
  import PINIA_USER from "@/stores/user";
  import MenuItem from "./MenuItem/index.vue";
  const { menuBg, isCollapse, width } = storeToRefs(PINIA_LAYOUT());
  const { menuRotuer } = PINIA_USER();
  const route = useRoute();
  const menu = reactive({
    "background-color": menuBg,
    "text-color": "#fff",
    "unique-opened": true,
    collapse: isCollapse,
    "default-active": route.path,
    "default-openeds": [route.path],
  });
</script>

<template>
  <el-aside width="auto">
    <el-scrollbar height="100%" :style="{ background: menuBg }">
      <el-menu v-bind="menu" class="el-menu-vertical-demo">
        <MenuItem v-for="item in menuRotuer" :key="item.path" :item="item"/>
      </el-menu>
    </el-scrollbar>
  </el-aside>
</template>

<style lang="scss" scoped>
  .el-menu-vertical-demo {
    border: none;
  }

  ::v-deep(.el-menu-vertical-demo:not(.el-menu--collapse)) {
    width: v-bind(width);
    border: none;
  }
</style>
