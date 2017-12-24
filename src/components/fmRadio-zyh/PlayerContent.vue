<template>
  <div class="content">
    <div class="current_text">
      <div class="text"
         :style="{
	          'width': this.textlength +'px' ,
	          'animationDuration': this.animationDuration + 's',
	          'animationPlayState': this.animationPlayState,
	          'animationName': this.animationName
         }"
      >
        {{titleList[activeLineIndex]}}
      </div>
      <div class="text">
      </div>
    </div>
    <div class="controller_wrapper">
      <div class="timer">
        <strong class="current_time">
          {{filterCurrentTime}}
        </strong>
        <strong class="rest_time">
          {{filterDuration}}
        </strong>
      </div>
      <div class="progress_wrapper"
           ref="progressWrapper"
           @tap="changeProgress"
      >
        <p class="all_bar" ref="allBar"></p>
        <p
          class="current_bar"
          ref="currentBar"
          :style="{'width': this.currentBarLength + 'px'}"
        ></p>
        <p
          class="picker"
          ref="picker"
          :style="{'left': this.currentBarLength -8 + 'px'}"
        ></p>
      </div>
      <div class="btn_wrapper">
        <p class="left_muted"></p>
        <p
          class="pre_btn"
          :class="{disabled: canPrev? false : true }"
          @click="onPrev"
        ></p>
        <p
          class="play_btn"
          @click="AudioPlay"
          :class="!isPlaying? play : pause"
        ></p>
        <p
          class="next_btn "
          :class="{disabled: canNext? false : true }"
          @click="onNext"
        ></p>
        <p
          class="unmuted_btn"
          @click="isMuted"
          :class="this.muted? 'muted_btn' : 'unmuted_btn' "
        ></p>
      </div>

    </div>
    <audio
      :src="audioUrls[activeLineIndex]"
      ref="audio"
      style="display: none"
    >
    </audio>
  </div>
</template>
<script lang="ts">
  import Vue from 'vue'
  import {audioTime} from "../../filters/audioTime";
  import Event from './Event'
  interface Data {
    textContent: string;
    textlength: number;
    animationDuration: number;
    animationPlayState: string;
    animationName: string;
    audio: any;
    isPlaying: boolean,
    play: string,
    pause: string,
    currentTime: number,
    duration: number,
    currentBar: any,
    allBar: any,
    progressWrapper: any,
    currentBarLength: number,
    picker: any,
    muted: boolean,
    activeIndex: number,
    disx: number
  }
  export default Vue.extend({
    name: 'Content',
    data () {
      const initiaState: Data = {
        textContent: '--',
        textlength : 750,
        animationDuration : 3,
        animationPlayState : 'running',
        animationName : 'srolltext',
        audio: {},
        isPlaying: false,
        play: 'play',
        pause: 'pause',
        currentTime: 0,
        duration: 0,
        currentBar: 0,
        allBar: 0,
        progressWrapper: {},
        currentBarLength: 0,
        picker: {},
        muted: false,
        activeIndex: 0,
        disx: 0
      }
      return initiaState
    },
    props: {
      titleList: {
        type: Array,
        defalt: []
      },
      audioUrls: {
        type: Array,
        default: []
      },
      activeLineIndex: {
        type: Number,
        default: 0
      },
      canPrev: {
        type: Boolean,
        default: false
      },
      canNext: {
        type: Boolean,
        default: false
      }
    },
    computed: {
        //把播放时间变成分秒
      filterCurrentTime ():string {
        return audioTime(this.currentTime)
      },
        //总的时间变成分秒
      filterDuration ():string {
        return audioTime(this.duration)
      }
    },
    methods: {
        //取到从父组件传递的数据
      initData() {
        this.activeIndex = this.$props.activeLineIndex
      },
        //获取dom
      initDOM() {
        this.audio = this.$refs.audio
        this.currentBar = this.$refs.currentBar
        this.progressWrapper = this.$refs.progressWrapper
        this.allBar = this.$refs.allBar
        this.picker = this.$refs.picker
      },
        //播放
      AudioPlay() {
        this.isPlaying = !this.isPlaying
        if (this.isPlaying) {
          this.audio.play()
          this.timeUpdate()
          console.log('play')
        } else {
          this.audio.pause()
          this.timeUpdate()
          console.log('pause')
        }
      },
        //获取播放时间
      getCurrentTime() {
        this.currentTime = this.audio.currentTime;
        //console.log(this.currentTime)
      },
        //实时更新
      timeUpdate() {
        this.audio.addEventListener('timeupdate',() => {
            this.duration = this.audio.duration ? this.audio.duration : 0 ;
            this.getCurrentTime();
            this.changeProgress();
            this.movePicker()
        })
          //判定是否结束
        this.audio.addEventListener('ended',() => {
            this.isPlaying = false
            this.currentTime = 0
            console.log('ended')
        })
          //判断是否切换
        this.audio.addEventListener('emptied', () => {
            this.isPlaying = false
            this.currentTime = 0
            console.log('empty')
        })
      },
        //进度条滑动块 不可用
      movePicker() {
        this.picker.addEventListener('touchstart',(e: any) => {
          e.cancelBubble = true
          e.preventDefault()
          let disx:number = e.touches[0].clientX
          let disy:number = e.touches[0].clientY
           //console.log('disx',disx)
          //console.log(e.touches)
          let clientRect:number =this.picker.getBoundingClientRect().left
          if (disx>2&&disx<this.allBar.offsetWidth) {
            // this.isPlaying = false
            this.picker.ontouchmove = (e: any) => {
              e.cancelBubble = true
              let x: number = e.touches[0].clientX - 2
              x = Math.max(2,Math.min(x,this.allBar.offsetWidth))
              this.audio.currentTime = x / this.allBar.offsetWidth * this.duration
            }
            document.ontouchend = () => {
              // this.isPlaying = true
            }
          }
        })
      },
        //改变进度条
      changeProgress() {
          this.progressWrapper.addEventListener('click', (e: any) => {
              this.currentBarLength = e.clientX - 8;
              this.currentTime = this.currentBarLength / this.allBar.offsetWidth * this.duration
              this.audio.currentTime = this.currentTime
          })
      },
      //静音
      isMuted() {
          this.muted = !this.muted
          this.muted? this.audio.muted = true : this.audio.muted = false
      },
      //上一首
      onPrev() {
        if(this.$props.canPrev) {
          this.activeIndex--
          this.postActiveLineIndex()
          //console.log('prev')
        }
      },
      onNext() {
        if(this.$props.canNext) {
          this.activeIndex++
          this.postActiveLineIndex()
          //console.log('next')
        }
      },
        //组件之间传递参数
      postActiveLineIndex() {
        Event.$emit('postIndex',this.activeIndex)
      }
    },
    mounted() {
      this.initDOM()
      console.log(this.picker.getBoundingClientRect())
    },
    watch: {
        //监听播放时间
      currentTime() {
        this.currentBarLength = this.currentTime / this.duration * this.allBar.offsetWidth ;
        // console.log(this.currentBarLength)
      }
    }
  })
</script>
<style lang="less" scoped>
  .controller_wrapper{
    background: #26A8FF;
    width:100%;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding: 10px;
  }
  .current_text{
    width: 100%;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding: 10px;
    background: #26A8FF;
    text-align: left;
    white-space: nowrap;
    overflow-x: hidden;
    .text{
      width: 100%;
      color: #fff;
      display: inline-block;
      position: relative;
      overflow: hidden;
      animation-timing-function: linear;
      animation-iteration-count: infinite;
      animation-play-state: paused;
    }
  }
  .timer{
    width:100%;
    display: flex;
    justify-content: space-between;
    .current_time,.rest_time{
      color: #fff;
      font-weight: normal;
    }
  }
  .progress_wrapper{
    position: relative;
    width:100%;
    height: 16px;
    display:flex;
    align-items:center;
    .all_bar{
      width:100%;
      height: 2px;
      background: #fff;
      opacity: 0.6;
    }
    .current_bar{
      width: 0;
      position: absolute;
      height: 2px;
      background: #fff;
      z-index: 9;
    }
    .picker{
      width: 15px;
      height: 15px;
      border-radius: 50%;
      background: #fff;
      position: absolute;
      z-index: 99;
      left: 0px;
    }
  }
  .btn_wrapper{
    width: 100%;
    height: 80px;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    justify-content: space-between;
    padding:0 60px;
    .pre_btn,.play_btn,.next_btn{
      width: 30px;
      height: 30px;
      background: transparent;
    }
    .unmuted_btn,.left_muted{
      width: 16px;
      height: 16px;
    }
    .pre_btn{
      background: url("../../assets/images/icon_fm_qianyishou@2x.png");
      background-size: contain;
    }
    .play{
      background: url("../../assets/images/icon_fm_bofang@2x.png");
      background-size: contain;
    }
    .pause{
      background: url("../../assets/images/icon_fm_zanting@2x.png");
      background-size: contain;
    }
    .next_btn{
      background: url("../../assets/images/icon_fm_xiayishou@2x.png");
      background-size: contain;
    }
    .unmuted_btn{
      background: url("../../assets/images/unmuted (2).png");
      background-size: contain;
    }
    .muted_btn{
      background: url("../../assets/images/muted (2).png");
      background-size: contain;
    }
    .disabled{
      opacity: 0.6;
    }
  }
</style>
