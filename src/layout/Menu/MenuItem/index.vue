<template>
  <el-sub-menu :index="item.path" v-if="item.children?.length">
    <template #title>
      <Icon v-if="item.meta?.icon" :name="item.meta.icon" />
      <span>{{ item.meta?.title || "" }}</span>
    </template>
    <menu-item v-for="items in item.children" :key="items.path" :item="items" />
  </el-sub-menu>
  <AppLink :to="item.path" v-else>
    <el-menu-item :index="item.path">
      <Icon v-if="item.meta?.icon" :name="item.meta.icon" />
      <template #title>
        <span>{{ item.meta?.title || "" }}</span>
      </template>
    </el-menu-item>
  </AppLink>
</template>
<script setup name="MenuItem">
  import AppLink from "@/layout/AppLink/index.vue";
  const { item } = defineProps(["item"]);
</script>

<style lang="scss" scoped></style>
