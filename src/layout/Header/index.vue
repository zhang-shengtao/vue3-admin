<script setup>
  import PINIA_LAYOUT from "@/stores/layout";
  const { isCollapse } = storeToRefs(PINIA_LAYOUT());
</script>

<template>
  <el-header>
    <el-button type="primary" size="default" @click="isCollapse = !isCollapse">合上</el-button>
  </el-header>
</template>

<style lang="scss" scoped></style>
