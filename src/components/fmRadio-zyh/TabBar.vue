<template>
    <div class="tab-list">
      <ul class="tab_bar">
        <li class="tab_item" v-for="(item,index) in tabList" :key="index">
          {{item}}
        </li>
      </ul>
    </div>
</template>

<script lang="ts">
  import Vue from 'vue'
    export default Vue.extend({
        name: "TabBar",
        props: {
            tabList: {
                default: []
            }
        }
    })
</script>

<style scoped lang="less">
  .tab-list{
    width: 100%;
    height: 40px;
    border-bottom:1px solid #eee;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    .tab_bar{
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: space-evenly;
      align-items:center;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      padding: 0 5px;
      .tab_item{
        text-align: center;
        border: 1px solid #eee;
        font-size: 12px;
        height: 25px;
        line-height: 25px;
        width: 60px;
        border-radius: 5px;
      }
    }
  }
</style>
