<template>
  <div class="calculator">
    <el-space wrap>
      <div class="calculator_div">
        <div class="content" contentEditable="true">{{ content.join("") }}</div>
        <div class="grid" @click="calculator">
          <div class="item" v-for="item in arrSign" :id="item" :key="item">
            <Icon name="Back" v-if="item == 'x'" />
            <span v-else :id="item">{{ item }}</span>
          </div>
        </div>
      </div>
      <div style="width: 500px">
        <el-button type="primary" size="default" v-file:[`.png,.jpg`]="files">上传文件</el-button>
        <el-input v-model="input2" placeholder="请输入要复制的内容">
          <template #append>
            <el-button type="primary" @click="myCopy" id="myInput">复制</el-button>
          </template>
        </el-input>
        <video ref="flv" class="video" />
        <el-input v-model="flvUrl" placeholder="请输入flv格式的流地址">
          <template #append>
            <el-button type="primary" @click="flvjsClick">播放</el-button>
          </template>
        </el-input>
        <div ref="m3u8" id="m3u8"></div>
        <el-input v-model="m3u8Url" placeholder="请输入m3u8格式的流地址">
          <template #append>
            <el-button type="primary" @click="m3u8Click">播放</el-button>
          </template>
        </el-input>
      </div>
      <div style="width: 500px"></div>
    </el-space>
  </div>
</template>

<script setup name="calculator">
  import Big from "big.js";
  import flvjs from "flv.js"; // 不兼容ios系统
  import HlsJsPlayer from "xgplayer-hls.js"; //http://v2.h5player.bytedance.com/plugins/#xgplayer-hls
  import { coyp, IsPC } from "@/utils/method";
  const content = reactive([]);
  const sign = ["×", "+", "÷", "-"];
  const arrSign = ["c", "%", "x", "÷", 7, 8, 9, "×", 4, 5, 6, "-", 1, 2, 3, "+", "00", 0, ".", "="];
  function calculator(targert) {
    const id = targert.target.id;
    if (!id) return;
    let end = content[content.length - 1];
    if (id == "c") return (content.length = 0);
    if (end && id == "x") {
      if (end.length == 1) {
        content.pop();
      } else {
        content[content.length - 1] = end.slice(0, -1);
      }
      return;
    }
    if ((!end && id * 1 >= 0) || (!end && id == "-")) content.push(id == "00" ? "0" : id);
    if ((end == "0" && id == "0") || (end == "0" && id == "00")) return;
    if (end && id * 1 >= 0) {
      if (end == "-" || (end == "-0" && id * 1 >= 1)) {
        if (content.length <= 1) {
          if (end == "-") assign(end + id * 1);
          if (end == "-0" && id * 1 >= 1) assign("-" + id);
        } else {
          content.push(id);
        }
      } else {
        if (end == "-0") return;
        if (sign.includes(end)) {
          content.push(id);
        } else {
          if (end == "0") {
            assign(id);
          } else {
            assign(end + id);
          }
        }
      }
    }
    if (end && id == "." && !end.includes(".") && isNumber(end.charAt(end.length - 1))) assign(end + id);
    if (end && sign.includes(id)) {
      if (end == "-" && content.length <= 1) return;
      if (end.charAt(end.length - 1) * 1 >= 0) content.push(id);
      if (sign.includes(end)) assign(id);
      if (end.charAt(end.length - 1) == ".") {
        assign(end.split(".")[0]);
        content.push(id);
      }
    }
    if (id == "=" && content.length >= 3) {
      if (end.charAt(end.length - 1) == ".") assign(end.split(".")[0]);
      if (sign.includes(end.charAt(end.length - 1))) content.pop();
      toNumber([...content]);
    }
  }
  function assign(val) {
    content[content.length - 1] = val;
  }
  function toNumber(arr) {
    let i;
    if (arr.includes("×") || arr.includes("÷")) {
      let x = arr.indexOf("×");
      let y = arr.indexOf("÷");
      x == -1 ? (i = y) : (i = x);
      y == -1 || (x != -1 && y != -1 && x < y) ? (i = x) : (i = y);
    } else {
      let x = arr.indexOf("+");
      let y = arr.indexOf("-");
      x == -1 ? (i = y) : (i = x);
      y == -1 || (x != -1 && y != -1 && x < y) ? (i = x) : (i = y);
    }
    let sign = arr[i];
    let startNum = new Big(arr[i - 1]);
    let endNum = arr[i + 1];
    if (sign == "×") arr.splice(i - 1, 3, String(startNum.times(endNum).toNumber()));
    if (sign == "÷") arr.splice(i - 1, 3, String(startNum.div(endNum).toNumber()));
    if (sign == "+") arr.splice(i - 1, 3, String(startNum.add(endNum).toNumber()));
    if (sign == "-") arr.splice(i - 1, 3, String(startNum.minus(endNum).toNumber()));
    if (arr.length != 1) {
      toNumber(arr);
    } else {
      content.splice(0, Infinity, arr[0]);
    }
  }
  // 判断受否为数字
  function isNumber(n) {
    return /^\d+$/.test(n);
  }

  function files(e) {}
  const input2 = ref("");
  function myCopy() {
    coyp({ txts: input2.value, imgs: "https://flw.zpzhmart.com/uploads/thumb_water/84998b7d0a991b35a06e595828ff6bbe.jpg" }, "#myInput").then(() => {
      ElMessage.success("复制成功");
    });
  }

  const flv = ref(null);
  const m3u8 = ref(null);
  const flvPlayer = ref("");
  const m3u8Url = ref("");
  const flvUrl = ref("");
  // 播放M3U8
  function m3u8Click() {
    let u = {
      id: "m3u8",
      url: m3u8Url.value,
      isLive: true,
      // 在安卓端开启hls.js解析功能(有这个选项在ios端会不能播放)
      useHls: navigator.userAgent.indexOf("Android") > -1,
      playsinline: true,
      whitelist: [""],
      autoplay: true,
      // fluid: true,// 宽高100%自适应
      width: "100%",
      height: 250,
      // volume: 0, // 静音才能pc端(win)自动播放
      controls: false,
      cssFullscreen: true, //网页样式全屏
      ignores: ["time", "progress", "play"],
      closeVideoClick: true,
      closeVideoTouch: true,
      disableProgress: true,
      enableVideoDbltouch: true,
      closeVideoPreventDefault: true,
      closeVideoStopPropagation: true,
    };
    if (IsPC()) {
      delete u.useHls;
      u.volume = 0;
    }
    let player = new HlsJsPlayer(u);
    m3u8.value = player;
  }
  function destroy() {
    // 参数 isDelDom: true 删除内部DOM元素 | false 保留内部DOM元素，默认为true
    m3u8.value.destroy(true);
  }
  function flvjsClick() {
    if (flvjs.isSupported()) {
      flvPlayer.value = flvjs.createPlayer({
        type: "flv",
        isLive: true,
        hasAudio: true,
        url: flvUrl.value,
      });
      flvPlayer.value.attachMediaElement(flv.value); // 挂载元素;
      flvPlayer.value.load(); // 加载流;
      flvPlayer.value.play(); // 播放流;
    }
  }
</script>

<style lang="scss" scoped>
  .calculator_div {
    width: 300px;
    height: 500px;
    background-color: #f4f3f3;
    border-radius: 10px;
    padding: 5px;
    box-sizing: border-box;
    .content {
      width: 100%;
      height: 100px;
      background-color: #fff;
      padding: 2px 10px;
      box-sizing: border-box;
    }
    .grid {
      width: 100%;
      height: calc(100% - 100px);
      padding: 10px 0;
      box-sizing: border-box;
      display: inline-grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      grid-gap: 10px 10px;
      .item {
        background-color: #fff;
        border-radius: 50%;
        font-size: 25px;
        display: flex;
        align-items: center;
        justify-content: center;
        user-select: none;
        cursor: pointer;
      }
      .item:hover {
        background-color: #f1eaea;
      }
    }
  }
  .video {
    width: 100%;
    height: 300px;
  }
</style>
