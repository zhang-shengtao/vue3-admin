<template>
  <div>
    <el-button
      type="primary"
      @click="
        dialogVisible = true;
        ruleForm.menutype = 1;
      "
      >新增一级目录</el-button
    >
    <el-table :data="tableData" border style="margin-top: 10px" stripe row-key="_id">
      <el-table-column prop="meta.name" label="菜单名称" />
      <el-table-column prop="path" label="菜单路径" />
      <el-table-column label="图标" width="100">
        <template #default="{ row }">
          <Icon :name="row.meta.icon" />
        </template>
      </el-table-column>
      <el-table-column label="数据接口">
        <template #default="{ row }">
          <el-button plain size="small" v-if="row.method">{{ row.method }}</el-button>
          <span>{{ row.api }}</span>
        </template>
      </el-table-column>
      <el-table-column label="按钮">
        <template #default="{ row }">
          <template v-if="!row.children?.length && row.meta?.btn?.length">
            <el-tag :type="item.name == '删除' ? 'danger' : item.name == '编辑' ? 'success' : ''" style="margin-right: 10px" v-for="(item, index) in row.meta.btn" :key="index">{{ item.name }}</el-tag>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="500">
        <template #default="{ row }">
          <el-button type="success" plain size="small" @click="edit(row)">编辑</el-button>
          <el-button size="small" plain v-if="row.menutype != '2' && !row.children" @click="addBnt(row)">添加按钮</el-button>
          <el-button type="warning" plain size="small" @click="addmenu(row)">添加子菜单</el-button>
          <el-button plain size="small" @click="details(row)" v-if="row.menutype != '2' && !row.children">详情</el-button>
          <!-- <el-button type="danger" plain size="small" @click="delmenulists(row._id, row.pid)">删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" draggable :title="title" width="40%" @close="close">
      <el-form ref="ruleFormRef" :model="ruleForm" label-width="80px" status-icon>
        <el-form-item :label="title == '添加按钮' ? '按钮名称' : '菜单名称'" prop="name">
          <el-input v-model="ruleForm.name" :placeholder="title == '添加按钮' ? '请输入按钮名称' : '请输入菜单名称'" />
        </el-form-item>
        <el-form-item :label="title == '添加按钮' ? '按钮标识' : '菜单路由'" prop="path">
          <el-input v-model="ruleForm.path" :placeholder="title == '添加按钮' ? '请输入按钮标识' : '请输入菜单路由'" />
        </el-form-item>
        <el-form-item label="数据接口" prop="icon">
          <el-input v-model="ruleForm.api" placeholder="请输入数据请求接口">
            <template #prepend>
              <el-select v-model="ruleForm.method" placeholder="请求方式" style="width: 115px">
                <el-option label="get" value="get" />
                <el-option label="post" value="post" />
                <el-option label="put" value="put" />
                <el-option label="delete" value="delete" />
              </el-select>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-input v-model="ruleForm.icon" placeholder="请输入图标" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 添加按钮的菜单详情 -->
    <el-dialog v-model="dialod" title="菜单详情" width="50%" @close="close">
      <el-table :data="detailRow" border stripe>
        <el-table-column prop="icon" label="图标" width="80"> </el-table-column>
        <el-table-column label="按钮名称" width="180">
          <template #default="{ row }">
            <span v-if="row.disabled">{{ row.name }}</span>
            <el-input v-else :disabled="row.disabled" v-model="ruleForm.name" placeholder="请输入菜单名称" />
          </template>
        </el-table-column>
        <el-table-column label="按钮标识" width="180">
          <template #default="{ row }">
            <span v-if="row.disabled">{{ row.path }}</span>
            <el-input v-else v-model="ruleForm.path" :disabled="row.disabled" placeholder="请输入菜单名称" />
          </template>
        </el-table-column>
        <el-table-column label="数据接口">
          <template #default="{ row }">
            <span v-if="row.disabled">
              <el-tag>{{ row.method }}</el-tag>
              {{ row.api }}
            </span>
            <el-input v-else v-model="ruleForm.api" :disabled="row.disabled" placeholder="请输入数据请求接口">
              <template #prepend>
                <el-select v-model="ruleForm.method" :disabled="row.disabled" placeholder="请求方式" style="width: 115px">
                  <el-option label="get" value="get" />
                  <el-option label="post" value="post" />
                  <el-option label="put" value="put" />
                  <el-option label="delete" value="delete" />
                </el-select>
              </template>
            </el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="{ row }">
            <el-button type="success" plain size="small" v-if="row.disabled === true" @click="rowBtnEdit(row)">编辑</el-button>
            <el-button type="primary" plain size="small" v-if="row.disabled === false" @click="submit">提交</el-button>
            <!-- <el-button type="danger" plain size="small">删除</el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script setup name="setting">
  import { addMenu, menulist, putmenulist, delmenulist } from "@/api/setting.js";
  const value = ref(true);
  const tableData = ref([]);
  const dialogVisible = ref(false);
  const dialod = ref(false);
  const detailRow = ref([]);

  const rowStatus = ref();

  const title = ref("新增菜单");
  const ruleForm = reactive({
    pid: "0",
    name: "",
    path: "",
    icon: "",
    menutype: "",
    api: "",
    method: "",
  });

  function edit(row) {
    ruleForm.pid = row.pid;
    ruleForm._id = row._id;
    ruleForm.name = row.meta.name;
    ruleForm.path = row.path;
    ruleForm.icon = row.meta.icon;
    ruleForm.menutype = row.menutype;
    ruleForm.api = row.api;
    ruleForm.method = row.method;
    dialogVisible.value = true;
    title.value = "编辑菜单";
  }
  function addBnt(row) {
    title.value = "添加按钮";
    ruleForm.pid = row._id;
    ruleForm.menutype = 2;
    dialogVisible.value = true;
  }
  function addmenu(row) {
    title.value = "新增子菜单";
    ruleForm.pid = row._id;
    ruleForm.menutype = 1;
    dialogVisible.value = true;
  }
  function details(row) {
    const btn = row.meta.btn || [];
    btn.forEach((item) => {
      item.disabled = true;
    });
    detailRow.value = btn;
    dialod.value = true;
  }
  function rowBtnEdit(row) {
    detailRow.value.forEach((item) => {
      item.disabled = true;
    });
    row.disabled = false;
    ruleForm.pid = row.pid;
    ruleForm._id = row._id;
    ruleForm.name = row.name;
    ruleForm.path = row.path;
    ruleForm.icon = row.icon;
    ruleForm.menutype = row.menutype;
    ruleForm.api = row.api;
    ruleForm.method = row.method;
    title.value = "编辑菜单";
    dialod.value = true;
  }

  function close() {
    ruleForm.pid = "0";
    ruleForm.name = "";
    ruleForm.path = "";
    ruleForm.icon = "";
    ruleForm.menutype = "";
    ruleForm.api = "";
    ruleForm.method = "";
    dialogVisible.value = false;
    dialod.value = false;
    detailRow.value = [];
    title.value = "新增菜单";
    delete ruleForm._id;
  }

  function submit() {
    if (title.value != "编辑菜单") {
      addMenu(ruleForm).then((res) => {
        dialogVisible.value = false;
        ElMessage({
          message: res.data,
          type: "success",
        });
        getMenulist();
        close();
      });
    } else {
      putmenulist(ruleForm).then((res) => {
        dialogVisible.value = false;
        ElMessage({
          message: res.data,
          type: "success",
        });
        getMenulist();
        close();
      });
    }
  }

  // 删除
  function delmenulists(_id, pid) {
    delmenulist({ _id, pid }).then((res) => {
      console.log(res.data);
    });
  }

  function getMenulist() {
    menulist().then((res) => {
      tableData.value = res.data;
    });
  }

  onBeforeMount(() => {
    getMenulist();
  });
</script>

<style lang="scss" scoped></style>
