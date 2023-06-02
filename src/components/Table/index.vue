<template>
  <el-table :data="tableData" border>
    <el-table-column align="center" v-for="(item, index) in tableHeader" :key="index" :width="item.width || 'auto'" :label="item.label">
      <template #default="{ row, $index }">
        <template v-if="item.type === 'index'">{{ $index + 1 }}</template>
        <template v-else-if="item.type === 'img'">
          <el-image class="elimage" :hide-on-click-modal="true" fit="cover" :z-index="10" :preview-src-list="[item.prop(row)]" :src="item.prop(row)" />
        </template>
        <template v-else-if="item.type === 'switch'">
          <el-switch v-model="row[item.prop]" @change="(val) => item.change(val, row)" active-text="开" inactive-text="关" />
        </template>
        <template v-else-if="item.type === 'tag'">
          <el-tag v-for="(tag, it) in item.tag" :class="{ margin: it % 2 === 1, eltag: true }" :key="it" @click="typeTags(tag.label, tag.callback, row)" :type="tag.type">{{ tag.label }}</el-tag>
        </template>
        <template v-else-if="item.type === 'slot'">
          <slot :row="row" :$index="$index" :name="item.slot"></slot>
        </template>
        <template v-else>
          {{ item.prop(row) }}
        </template>
      </template>
    </el-table-column>
  </el-table>
</template>
<script setup>
  const { tableData, tableHeader } = defineProps({
    tableData: {
      type: Array,
      default: [],
      required: true,
    },
    tableHeader: {
      type: Array,
      default: [],
      required: true,
    },
  });

  function typeTags(text, callback, row) {
    callback(row);
  }
  // 开关
  function beforeChange(row) {
    return new Promise((resolve) => {
      return resolve(true);
    });
  }
</script>
<style lang="scss" scoped>
  .margin {
    margin: 0 10px;
  }
  .eltag {
    cursor: pointer;
    user-select: none;
  }
  .elimage {
    width: 50px;
    height: 50px;
  }
</style>
