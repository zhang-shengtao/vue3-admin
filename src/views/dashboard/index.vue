<template>
  <div class="cube">
    <div class="side front"></div>
    <div class="side back"></div>
    <div class="side top"></div>
    <div class="side bottom"></div>
    <div class="side left"></div>
    <div class="side right"></div>
  </div>
  <div class="heart"></div>
</template>
<script setup name="dashboard"></script>

<style lang="scss" scoped>
  .cube {
    width: 100px;
    height: 100px;
    position: relative;
    transform-style: preserve-3d;
    animation: spin 3s infinite linear; /* 定义旋转动画 */
    top: 100px;
    left: 200px;
  }

  .side {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0.8;
    border: 1px solid #ccc;
    box-sizing: border-box;
  }

  .front {
    transform: translateZ(50px);
    background-color: #f00;
  }

  .back {
    transform: translateZ(-50px) rotateY(180deg);
    background-color: #0f0;
  }

  .top {
    transform: rotateX(90deg) translateZ(-50px);
    background-color: #00f;
  }

  .bottom {
    transform: rotateX(-90deg) translateZ(-50px);
    background-color: #ff0;
  }

  .left {
    transform: rotateY(-90deg) translateZ(-50px);
    background-color: #f0f;
  }

  .right {
    transform: rotateY(90deg) translateZ(-50px);
    background-color: #0ff;
  }

  @keyframes spin {
    0% {
      transform: rotateX(0) rotateY(0) rotateZ(0);
    }

    100% {
      transform: rotateX(360deg) rotateY(360deg) rotateZ(360deg);
    }
  }
</style>
