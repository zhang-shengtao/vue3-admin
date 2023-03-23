<script setup>
  import PINIA_LAYOUT from "@/stores/layout";
  const { menuBg, isCollapse, width } = storeToRefs(PINIA_LAYOUT());
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
        <el-sub-menu index="1">
          <template #title>
            <span>Navigator One</span>
          </template>
          <el-menu-item index="1212">
            <template #title>Navigator Two</template>
          </el-menu-item>
        </el-sub-menu>
        <el-menu-item index="2">
          <template #title>Navigator Two</template>
        </el-menu-item>
        <el-menu-item index="3">
          <template #title>Navigator Three</template>
        </el-menu-item>
        <el-menu-item index="4">
          <template #title>Navigator Four</template>
        </el-menu-item>
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
