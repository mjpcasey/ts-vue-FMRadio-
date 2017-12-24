<template>
    <div class="tab_item_wrap">
      <div
        class="tab_item"
        v-for="(item , index) in articleList"
        :key="index"
        @click="selectItem(index)"
        :class="{active: activeLineIndex === index}"
      >
        <h2 class="title">{{item.title}}</h2>
        <p class="datatime">{{item.otime | fromNow}}</p>
      </div>
    </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import {fromNow} from '../../utils/timeUtil'
  import Event from './Event'
  interface Data {
    activeLineIndex: number
  }
  export default Vue.extend({
    name: "tab-item",
    props: {
      articleList: {
        type: Array,
        default: [],
      }
    },
    data() {
      const initiaState: Data = {
        activeLineIndex: 0,
      }
      return initiaState
    },
    filters: {
      fromNow(time: string): string {
          return fromNow(parseInt(time))
      }
    },
    methods: {
      selectItem(index: number):void {
        this.activeLineIndex = index
        this.$emit('activeLineIndex',this.activeLineIndex)
      }
    },
    created() {
      Event.$on('postIndex',(index:number) => {
          this.activeLineIndex = index
      })
    },
    watch: {
      activeLineIndex() {
        this.selectItem(this.activeLineIndex)
      }
    }
  })
</script>

<style scoped lang="less">
  .tab_item_wrap{
    width: 100%;
    .tab_item{
      width: 100%;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      padding: 10px 0;
      border-bottom: 1px solid #eee;
      .title{
        font-size: 16px;
        font-weight: normal;
        text-align: left;
      }
      .datatime{
        height: 20px;
        width: 100%;
        font-size: 8px;
        text-align: left;
        line-height: 20px;
        color: #999;
        margin: 0;
        margin-top: 8px;
      }
    }
    .active{
      .title,.datatime{
        color: #26a2ff;
      }
    }
  }
</style>
