<script setup>
  import * as ElementPlusIconsVue from "@element-plus/icons-vue";
  // import svg from "./svg/index.vue";
  const { icon } = defineProps({
    icon: {
      type: String,
      required: true,
    },
  });

  const Icon = computed(() => {
    if (ElementPlusIconsVue[icon]) return ElementPlusIconsVue[icon];
  });
</script>

<template>
  <el-icon style="vertical-align: middle">
    <component :is="Icon" />
  </el-icon>
</template>

<style lang="scss" scoped></style>
