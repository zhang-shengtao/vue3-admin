<script setup></script>

<template>
  <el-main style="background-color: #dfdbdb57; padding: 15px; overflow: hidden">
    <router-view v-slot="{ Component, route }">
      <transition name="fade-transform" mode="out-in">
        <el-scrollbar :key="route.path" style="background-color: #fff; padding: 15px; box-sizing: border-box">
          <keep-alive>
            <component :is="Component" :key="route.path" />
          </keep-alive>
        </el-scrollbar>
      </transition>
    </router-view>
  </el-main>
</template>

<style lang="scss" scoped>
  .elmain {
    padding: 0;
  }

  .section {
    width: 100%;
    height: 100%;
  }

  .scrollbar {
    padding: 15px;
    box-sizing: border-box;
  }

  .fade-transform-leave-active,
  .fade-transform-enter-active {
    transition: all 0.5s;
  }

  .fade-transform-enter {
    opacity: 0;
    transform: translateX(-30px);
  }

  .fade-transform-leave-to {
    opacity: 0;
    transform: translateX(30px);
  }
</style>
