<script setup>
  import Icons from "@/components/Icon/index.vue";
  import { Icon } from "@iconify/vue";
</script>

<template>
  <el-main>
    <!-- <router-view v-slot="{ Component, route }">
      <transition name="fade-transform" mode="out-in">
        <keep-alive :include="KEEPALIVE">
          <component :is="Component" :key="route.path" />
        </keep-alive>
      </transition>
    </router-view> -->
    <el-icon style="vertical-align: middle" size="22" color="red">
      <Icon icon="gg:arrow-bottom-left-o" />
    </el-icon>

    <svg aria-hidden="true">
      <use href="#my-logo" fill="red" />
    </svg>
    <Icons icon="Search" />
    <span>1213HA哈哈哈</span>
  </el-main>
</template>
<style lang="scss" scoped></style>
