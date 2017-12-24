<template>
  <div class="audio">
    <header-bar
      :title="this.showTitle? '君弘FM' : '' "
      :showTitle="showTitle"
    />
    <content-line
      :audioUrls="audioUrls"
      :activeLineIndex="activeLineIndex"
      :titleList="titleList"
      :canPrev="canPrev"
      :canNext="canNext"
    />
    <div class="article_wrap">
      <div class="article_list">
        列表
      </div>
      <div class="article_detail">
        文稿详情
      </div>
    </div>
    <div class="article">
      <div class="tab-list">
        <ul class="tab_bar">
          <li
            class="tab_item"
            v-for="(item,index) in tabList"
            :key="index"
            @click="chooseArticleType(index)"
            :class="{active: activeIndex === index}"
          >
            {{item}}
          </li>
        </ul>
      </div>
      <tab-item
        :articleList="articleList"
        v-on:activeLineIndex="showActiveLineIndex"
      />
    </div>

  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import HeaderBar from '@/components/fmRadio-zyh/Header.vue'
  import ContentLine from '@/components/fmRadio-zyh/PlayerContent.vue'
  import TabBar from '@/components/fmRadio-zyh/TabBar.vue'
  import TabItem from '@/components/fmRadio-zyh/TabItem.vue';
  import { getArticles, getNewArticles, Article, getReadCount, readArticle, NewsCount, getNetworkStatus, getRealTimeArticles, getYanbaoArticles, getJiepanArticles, getZaobaoArticles, playAudioByNative, getAudioProgress } from '../../api'

  interface FMdata {
    showTitle: boolean;
    tabList: string[],
    articleList: any,
    audioUrls: any,
    pageNum: number,
    audio: any,
    activeIndex: number,
    active: boolean,
    activeLineIndex: number,
    titleList: any,
    canPrev: boolean,
    canNext: boolean,
  }
  export default Vue.extend({
    name: "f-m-audio",
    data() {
      const initiaState: FMdata = {
        showTitle: true,
        tabList: ['最新资讯','小军早报','实时资讯','小军解盘'],
        articleList: [],
        audioUrls: [],
        pageNum: 1,
        audio: '',
        activeIndex: 0,
        active: false,
        activeLineIndex: 0,
        titleList: [],
        canPrev: true,
        canNext: true
      }
      return initiaState
    },
    components: {
      HeaderBar,ContentLine,TabBar,TabItem
    },
    mounted() {
      this.chooseArticleType(0)
    },
    methods: {
      chooseArticleType (index: number):void {
        this.activeIndex = index
        this.isCanPrev()
        this.isCanNext()
        switch(index) {
          case 0:
            this.pageNum = 1
            getArticles(this.pageNum).then((resp:any) => {
                console.log(resp)
                this.setArticles(resp)
            })
            break;
          case 1:
            this.pageNum = 1
            getNewArticles(this.pageNum).then((resp:any) => {
                console.log(resp)
                this.setArticles(resp)
            })
            break;
          case 2:
            this.pageNum = 1
            getZaobaoArticles(this.pageNum).then((resp:any) => {
                console.log(resp)
                this.setArticles(resp)
            })
            break;
          case 3:
            this.pageNum = 1
            getRealTimeArticles(this.pageNum).then((resp:any) => {
                console.log(resp)
                this.setArticles(resp)
            })
            break;
          case 4:
            this.pageNum = 1
            getJiepanArticles(this.pageNum).then((resp:any) => {
                console.log(resp)
                this.setArticles(resp)
            })
            break;
          case 5:
            this.pageNum = 1
            getYanbaoArticles(this.pageNum).then((resp:any) => {
                console.log(resp)
                this.setArticles(resp)
            })
            break;
          default:
            break;
        }
      },
        //取到接口data中的数据
      setArticles (res:any, firstEnter: boolean = false) {
        this.articleList = res.data  //取到data数据
        //取到音频文件地址
        this.audioUrls = res.data.map((item:any) => {
            return item.yuyinUrl || 'http://114.141.165.129/news/attach/voice/1507620245493.mp3'
        })
        this.titleList = res.data.map((item:any) => {
            return item.title
        })
      },
        //tab中激活的item
      activeItem(index: number) {
        this.active = this.activeIndex === index? true : false
        //console.log(this.active)
      },
        //从tabItem子组件中取到activeLineIndex
      showActiveLineIndex(data: number) {
        this.activeLineIndex = data
        this.isCanNext()
        this.isCanPrev()
      },
        //能否播放前一首
      isCanPrev() {
        this.canPrev = this.activeLineIndex === 0? false : true
      },
      isCanNext() {
        this.canNext = this.activeLineIndex === (this.articleList.length - 1)? false : true
      }
    }
  })
</script>

<style scoped lang="less">
  .audio{
    width: 100%;
    height: auto;
  }
  .article_wrap{
    display: flex;
    background: #fff;
    width: 100%;
    height: 40px;
    border-bottom: 1px solid #eee;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    .article_list,.article_detail{
      width: 50%;
      text-align: center;
      line-height: 40px;
    }
  }
  .article{
    width:100%;
    box-sizing: border-box;
    padding: 0 20px;
  }
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
      justify-content: space-between;
      align-items:center;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      .tab_item{
        text-align: center;
        border: 1px solid #eee;
        font-size: 12px;
        height: 25px;
        line-height: 25px;
        width: 60px;
        border-radius: 5px;
      }
      /*li:first-child{
        background: #26a2ff;
        color: #fff;
      }*/
      .active{
        background: #26a2ff;
        color: #fff;
      }
    }
  }
</style>
