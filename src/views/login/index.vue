<script setup name="login">
  import PINIA_USER from "@/stores/user";
  import { captcha } from "@/api";
  const { login } = PINIA_USER();
  const router = useRouter();
  const loading = ref(false);
  const formData = reactive({
    name: "",
    password: "",
    code: "",
  });
  const rules = reactive({
    name: { required: true, message: "请输入用户名" },
    password: { required: true, message: "请输入密码" },
    code: { required: true, message: "请输验证码" },
  });
  const images = ref("");
  function get_captcha() {
    captcha().then(({ data: { img } }) => {
      images.value = img;
    });
  }
  onBeforeMount(() => {
    get_captcha();
  });
  function post_login() {
    loading.value = true;
    login(formData)
      .then((message) => {
        router.replace("/");
        loading.value = false;
        ElMessage.success(message);
      })
      .catch((err) => {
        loading.value = false;
        ElMessage.error(err);
      });
  }
</script>

<template>
  <div class="login">
    <el-form :model="formData" :rules="rules" class="form">
      <el-form-item><div class="title">后台管理系统</div></el-form-item>
      <el-form-item prop="name">
        <el-input placeholder="请输入账号" v-model.trim="formData.name" style="height: 50px; font-size: 18px">
          <template #prefix>
            <Icon name="UserFilled" />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input show-password placeholder="请输入密码" v-model.trim="formData.password" style="height: 50px; font-size: 18px" type="password">
          <template #prefix>
            <Icon name="Lock" />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="code">
        <div style="width: 100%; display: flex; justify-content: space-between">
          <el-input placeholder="请输入验证码" v-model.trim="formData.code" style="height: 50px; font-size: 18px; width: calc(100% - 200px)"> </el-input>
          <span @click="get_captcha" style="display: flex; cursor: pointer" v-html="images"></span>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="loading" style="height: 50px; font-size: 18px; width: 100%" @click="post_login">登 录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<style lang="scss" scoped>
  .login {
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, #2291db, #b74f4f, #1b54ef);
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
