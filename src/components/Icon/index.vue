<script setup>
  import * as ElementPlusIconsVue from "@element-plus/icons-vue";
  import { Icon } from "@iconify/vue";
  defineProps({
    name: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      default: 18,
    },
    color: {
      type: String,
    },
  });
</script>

<template>
  <el-icon :size="size" :color="color" class="icon">
    <component v-if="ElementPlusIconsVue[name]" :is="ElementPlusIconsVue[name]" />
    <Icon v-else-if="name.includes(':')" :color="color" :size="size" :icon="name" />
    <svg v-else aria-hidden="true">
      <use :href="'#my-' + name" fill="red" />
    </svg>
  </el-icon>
</template>

<style lang="scss" scoped>
  .icon {
    cursor: pointer;
    vertical-align: middle;
  }
  .icon:hover {
    color: #349ef6;
  }
</style>
