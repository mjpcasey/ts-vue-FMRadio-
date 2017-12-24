<template>
  <div class="headerline">
    <div class="goback">
      <i class="iconfont">&#xe66c;</i>
    </div>
    <div class="title">
      {{title}}
    </div>
    <div class="right"></div>
  </div>
</template>
<script lang="ts">
  export default {
      props: {
          title:{
              type: String,
              default: ''
          },
          showTitle: {
              type: Boolean,
              default: true
          }
      }
  }
</script>
<style lang="less" scoped>
  .headerline{
    position: fixed;
    height: 46px;
    color: #fff;
    font-size: 18px;
    width: 100%;
    left:0;
    top:0;
    z-index:9999;
    text-align: center;
    display: flex;
    align-items:center;
    background: #26A8FF;
    .goback{
      flex: 1;
    }
    .title{
      flex: 8;
    }
    .right{
      flex: 1;
    }
  }
</style>