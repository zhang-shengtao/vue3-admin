<script setup>
  import PINIA_LAYOUT from "@/stores/layout";
  import PINIA_USER from "@/stores/user";
  const { isCollapse } = storeToRefs(PINIA_LAYOUT());
  const { logout, searchMenuRotuer } = PINIA_USER();
  const router = useRouter();
  const route = useRoute();
  function get_logout() {
    logout().then((res) => {
      ElMessage.success(res.data);
      router.replace("/login");
    });
  }
  const searchMenu = ref("");
  function querySearch(searchName, callback) {
    if (searchName) {
      callback(searchMenuRotuer.filter((item) => item.value.includes(searchName)));
    } else {
      callback([]);
    }
  }
  function handleSelect({ path }) {
    searchMenu.value = "";
    if (path.includes("http") && path.includes("://")) {
      window.open(path);
    } else {
      router.push({ path });
    }
  }
  const breadcrumb = computed(() => {
    const f = searchMenuRotuer.filter((item) => item.path == route.path)[0];
    return f.value.replaceAll(">", " / ");
  });
</script>

<template>
  <el-header style="display: flex; justify-content: space-between; align-items: center; box-shadow: var(--el-box-shadow-light)">
    <el-space>
      <Icon :name="isCollapse ? 'Expand' : 'Fold'" @click="isCollapse = !isCollapse" />
      <div style="font-size: 14px; color: #96989a">{{ breadcrumb }}</div>
    </el-space>
    <el-space wrap>
      <el-autocomplete v-model.trim="searchMenu" clearable :fetch-suggestions="querySearch" placeholder="请输入页面名称" @select="handleSelect" />
      <el-tooltip content="刷新" placement="bottom">
        <Icon name="Refresh" @click="router.go(0)" />
      </el-tooltip>
      <el-tooltip content="退出" placement="bottom">
        <Icon name="SwitchButton" @click="get_logout" />
      </el-tooltip>
      <img style="width: 40px" src="~@/assets/svg/home.svg" alt="" />
    </el-space>
  </el-header>
</template>

<style lang="scss" scoped></style>
