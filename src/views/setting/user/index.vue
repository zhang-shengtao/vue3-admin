<template>
  <div class="user">
    <el-button type="primary" @click="dialog = true" style="margin-bottom: 10px">新增用户</el-button>
    <!-- <el-button type="primary" @click="getXlsx" style="margin-bottom: 10px">导出</el-button> -->
    <Table :tableHeader="tableHeader" :tableData="tableData" />
    <el-dialog :title="formData._id ? '编辑用户' : '新增用户'" v-model="dialog" width="30%" @close="close">
      <el-form :model="formData" ref="form" label-width="80px">
        <el-form-item label="用户姓名" prop="nickname">
          <el-input v-model="formData.nickname" placeholder="请输入用户姓名" />
        </el-form-item>
        <el-form-item label="用户账号" prop="name">
          <el-input v-model="formData.name" placeholder="请输入用户账号" />
        </el-form-item>
        <el-form-item label="用户密码" v-if="!formData._id" prop="password">
          <el-input v-model="formData.password" placeholder="请输入用户密码" />
        </el-form-item>
        <el-form-item label="用户角色" prop="role">
          <el-select v-model="formData.role" placeholder="请选择用户角色(可多选)" multiple style="width: 100%">
            <el-option v-for="item in roleLise" :key="item._id" :label="item.name" :value="item._id"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否启用" prop="status">
          <el-switch v-model="formData.status" active-text="开" inactive-text="关" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script setup name="user">
  import Table from "@/components/Table/index.vue";
  import { getRoleList } from "@/api/setting.js";
  import { addUser, getUserList, putUser, delUser } from "@/api";
  const tableData = ref([]);
  const tableHeader = reactive([
    {
      label: "用户姓名",
      prop: (row) => row.nickname,
    },
    {
      label: "用户账号",
      prop: (row) => row.name,
    },
    {
      label: "角色",
      prop: (row) => row.role.reduce((a, b) => a + (a ? "/" : "") + b?.name, ""),
    },
    {
      label: "创建者",
      prop: (row) => row?.builder?.nickname,
    },
    {
      label: "是否启用",
      type: "switch",
      prop: "status",
      change: changeSwitch,
    },
    {
      type: "tag",
      label: "操作",
      tag: [
        {
          label: "编辑",
          callback: rowEdit,
        },
        {
          label: "删除",
          callback: rowDelete,
          type: "danger",
        },
      ],
    },
  ]);
  const dialog = ref(false);
  const roleLise = ref([]);
  const seacrh = reactive({
    page: 1,
    limit: 10,
  });
  const formData = reactive({
    name: "", // 用户账户
    password: "",
    nickname: "", // 用户名称
    role: [],
    status: true,
  });

  function close() {
    formData._id && delete formData._id;
    formData.pid && delete formData.pid;
    formData.name = "";
    formData.password = "";
    formData.nickname = "";
    formData.status = true;
    formData.role = [];
    dialog.value = false;
  }

  function onSubmit() {
    let promise = "";
    if (formData._id) {
      promise = putUser(formData);
    } else {
      promise = addUser(formData);
    }
    promise
      .then((res) => {
        ElMessage.success(res.data);
        close();
        getUserLists();
      })
      .catch((err) => {
        ElMessage.error(err);
      });
  }

  function getUserLists() {
    getUserList().then((res) => {
      tableData.value = res.data;
    });
  }

  function rowEdit(row) {
    row.role.forEach((item) => {
      formData.role.push(item._id);
    });
    formData.name = row.name;
    formData.nickname = row.nickname;
    formData.status = row.status;
    formData.pid = row.pid;
    formData._id = row._id;
    dialog.value = true;
  }
  function rowDelete(row) {
    delUser({ id: row._id, pid: row.pid }).then((res) => {});
  }
  function changeSwitch(val, row) {
    console.log(val, row);
  }
  // 角色列表
  function getRoleLists() {
    getRoleList().then((res) => {
      roleLise.value = res.data;
    });
  }

  onBeforeMount(() => {
    getRoleLists();
    getUserLists();
  });
</script>
<style lang="scss" scoped></style>
