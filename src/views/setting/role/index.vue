<template>
  <div class="role">
    <el-button type="primary" @click="dialog = true" style="margin-bottom: 10px">新增角色</el-button>
    <el-dialog :title="formData._id ? '编辑角色' : '新增角色'" v-model="dialog" draggable width="40%" @close="close">
      <el-form :model="formData" ref="form" :rules="rules" label-width="120px">
        <el-form-item label="角色名称">
          <el-input v-model="formData.name" placeholder="请输入角色名称 "></el-input>
        </el-form-item>
        <el-form-item label="权限是否开启">
          <el-switch v-model="formData.status" active-text="开" inactive-text="关" />
        </el-form-item>
        <el-form-item label="授权角色权限">
          <el-table :data="tabelDataDialog" border row-key="_id" size="small" :indent="10">
            <el-table-column align="center" width="100">
              <template #header><el-checkbox @change="all" :indeterminate="isIndeterminate" :model-value="isCheckedTotal" /> </template>
              <template #default="{ row }">
                <el-checkbox :model-value="every(row)" :indeterminate="some(row)" :checked="formData.role.includes(row._id)" @change="(val) => checkboxChange(val, row)" />
              </template>
            </el-table-column>
            <el-table-column prop="meta.name" label="目录名称" width="200" />
            <el-table-column label="按钮权限">
              <template #default="{ row }">
                <el-checkbox-group v-model="formData.role" @change="(val) => btn(val, row)">
                  <el-checkbox :label="item._id" v-for="item in row.meta.btn" :key="item._id">
                    {{ item.name }}
                  </el-checkbox>
                </el-checkbox-group>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <Table :tableData="tabelData" :tableHeader="tableHeader">
      <template #default="{ row, $index }">
        <div style="text-align: left" v-for="(item, index) in rows(row.role)" :key="index">{{ item }}</div>
      </template>
    </Table>
  </div>
</template>
<script setup name="role">
  import Table from "@/components/Table/index.vue";
  import { menulist, postRole, getRole, putRole, putRoleBtn, delRole } from "@/api/setting";

  const tabelData = ref([]);
  const tableHeader = reactive([
    {
      label: "角色名称",
      prop: (row) => row.name,
    },
    {
      label: "角色权限是否开启",
      type: "switch",
      prop: "status",
      change: changeRow,
    },
    {
      label: "权限列表",
      type: "slot",
      slot: "default",
    },
    {
      label: "角色创建者",
      prop: (row) => row.builder,
    },
    {
      type: "tag",
      label: "操作",
      tag: [
        {
          label: "编辑",
          callback: rowEdit,
        },
        // {
        //   label: "删除",
        //   callback: rowDelete,
        //   type: "danger",
        // },
      ],
    },
  ]);
  const formData = reactive({
    name: "",
    status: true,
    role: [],
  });
  const rules = [];
  const dialog = ref(false);
  const tabelDataDialog = ref([]);
  const checkedTotal = []; // 所有权限的总数
  const isIndeterminate = computed(() => {
    return !!formData.role.length && formData.role.length != checkedTotal.length;
  });
  const isCheckedTotal = computed(() => {
    return !!formData.role.length && formData.role.length === checkedTotal.length;
  });

  function close() {
    formData._id && delete formData._id;
    formData.pid && delete formData.pid;
    formData.name = "";
    formData.role.length = 0;
    dialog.value = false;
  }
  function submit() {
    let promise;
    if (formData._id) {
      promise = putRole(formData);
    } else {
      promise = postRole(formData);
    }
    promise
      .then((res) => {
        ElMessage.success(res.data);
        close();
        getRoles();
      })
      .catch((err) => {
        ElMessage.error(err.msg);
      });
  }
  // 编辑
  function rowEdit(row) {
    formData.role = [...row.root];
    formData._id = row._id;
    formData.pid = row.pid;
    formData.status = row.status;
    formData.name = row.name;
    dialog.value = true;
  }
  // 添加时找父级是否有添加
  function parent(id, arr = tabelDataDialog.value) {
    arr.forEach((item) => {
      if (item._id == id && !formData.role.includes(id)) {
        formData.role.push(id);
        if (item.pid != "0" && !formData.role.includes(item.pid)) parent(item.pid);
      } else if (item.children?.length) {
        parent(id, item.children);
      }
    });
  }
  // 删除时找父级
  function delParent(id, arr = tabelDataDialog.value) {
    arr.forEach((item) => {
      if (item._id == id && formData.role.includes(id)) {
        let i = 0;
        item.root.forEach((root_item) => {
          if (formData.role.includes(root_item)) i += 1;
        });
        if (i <= 1) formData.role = formData.role.filter((items) => items != item._id);
        if (item.pid != "0" && formData.role.includes(item.pid)) delParent(item.pid);
      } else if (item.children?.length) {
        delParent(id, item.children);
      }
    });
  }
  function checkboxChange(val, row) {
    const root = [...row.root, row._id];
    if (val) {
      const arr = [...new Set([...root, ...formData.role])];
      formData.role = arr;
      if (row.pid != "0" && !formData.role.includes(row.pid)) {
        parent(row.pid);
      }
    } else {
      let arr = [...formData.role];
      root.forEach((item) => {
        arr = arr.filter((i) => i != item);
      });
      formData.role = arr;
      if (row.pid != "0" && formData.role.includes(row.pid)) delParent(row.pid);
    }
  }
  function btn(val, row) {
    if (!formData.role.includes(row._id)) {
      formData.role.push(row._id);
      parent(row._id);
    }
  }
  function all() {
    if (isCheckedTotal.value) {
      formData.role = [];
    } else {
      formData.role = [...checkedTotal];
    }
  }
  function every(row) {
    if (!row.children?.length) return formData.role.includes(row._id);
    return row.root.every((item) => {
      return formData.role.includes(item);
    });
  }
  function some(row) {
    let i = 0;
    row.root.forEach((item) => {
      if (formData.role.includes(item)) {
        i += 1;
      }
    });
    if (i == 0) return false;
    if (i > 0 && i < row.root.length) return true;
  }

  // 删除角色
  function rowDelete(row) {
    delRole({ _id: row._id })
      .then((res) => {
        ElMessage.success(res.data);
        getRoles();
      })
      .catch((err) => {
        ElMessage.error(err.msg);
      });
  }
  // 身份是否开启
  function changeRow(status, row) {
    putRoleBtn({ status, _id: row._id })
      .then((res) => {
        ElMessage.success(res.data);
      })
      .catch((err) => {
        ElMessage.error(err.msg);
      });
  }
  // 处理表格显示的目录文字
  function rows(arr) {
    function rowText(arr, name = null) {
      let tests = [];
      arr.forEach((item) => {
        if (item.children && item.children.length) {
          let n = name ? name + ">" + item.meta.name : item.meta.name;
          const rr = rowText(item.children, n);
          tests = tests.concat(rr);
        } else {
          let n = name ? name + ">" + item.meta.name : item.meta.name;
          if (item.meta?.btn?.length) {
            let b = "";
            (item.meta?.btn || []).forEach((item) => {
              b = b ? `${b} ${item.name}` : item.name;
            });
            n = n + ` | ${b}`;
          }
          tests.push(n);
        }
      });
      return tests;
    }
    if (arr) {
      return rowText(arr);
    }
    return "";
  }
  // 路由信息
  function getMenuList() {
    menulist().then((res) => {
      tabelDataDialog.value = res.data;
      res.data.forEach((item) => {
        checkedTotal.push(item._id, ...item.root);
      });
    });
  }
  // 表格数据
  function getRoles() {
    getRole().then((res) => {
      tabelData.value = res.data;
    });
  }
  getRoles();
  getMenuList();
</script>
<style lang="scss" scoped></style>
