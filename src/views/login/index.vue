<script setup name="login">
  const loading = ref(false);
  const formData = reactive({
    name: "",
    password: "",
    code: "",
  });
  const rules = reactive({});
</script>

<template>
  <div class="login">
    <el-form :model="formData" :rules="rules" class="form">
      <el-form-item><div class="title">后台管理系统</div></el-form-item>
      <el-form-item prop="name">
        <el-input placeholder="请输入账号" v-model.trim="formData.name" style="height: 50px; font-size: 18px" />
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          show-password
          placeholder="请输入密码"
          v-model.trim="formData.password"
          style="height: 50px; font-size: 18px"
          type="password"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="loading" style="height: 50px; font-size: 18px; width: 100%"
          >登 录</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>
<style lang="scss" scoped>
  .login {
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, #22db7f, #b74f4f, #1b54ef);
    padding-top: 25vh;
    box-sizing: border-box;
    .title {
      font-size: 30px;
      font-weight: 600;
      margin: 0 auto;
    }
    .form {
      width: 35%;
      background-color: #fff;
      padding: 20px;
      border-radius: 10px;
      margin: 0 auto;
    }
  }
</style>
