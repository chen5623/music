<template>
  <div class="controls" @click.stop="goSong" v-show="isShow">
    <div class="audio-music">
      <div class="music-img">
        <img class="auto-img" :src="SongImg" />
      </div>
      <div class="music-box">
        <div class="music-name">{{ audioName }}</div>
        <div class="music-time"></div>
      </div>
      <div class="play-music" @click.stop="toggleAudio">

        <div class="play-img">
          <img
            class="auto-img"
            :src="
              this.isPlaySong
                ? require('../assets/images/music-play.png')
                : require('../assets/images/music-pause.png')
            "
            alt=""
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Controls",
  data() {
    return {
      // 播放的进度
      circle: 0,

      // 音频是否暂停
      isAudio: false,

      musicImg: "",
      // 播放列表
      playList: true,

      setTime: null,


    };
  },
  computed: {
    // //音频元素
    ...mapState([
      "audioElement",
      "SongImg",
      "isPlaySong",
      "audioName",
      "audioSumT",
      "audioTime",
      'isShow'
    ]),
  },

  created() {
    this.getAudioUrl();

  },

  methods: {
    // 歌曲页（歌词）
    goSong(){
      if(!localStorage.getItem('_url')){
        return this.$toast('您还没听歌！！')
      }
      this.$router.push({name:'Lyric'})
    },

    toggleAudio() {
      // 根据vuex的是否播放状态取反
      this.isAudio = !this.isPlaySong;

      // 传递是否播放参数
      this.$store.commit("isPlaySong", this.isAudio);

      
      if (this.isAudio) {
        // 播放
        this.play();

        return;
      }
      // 暂停
      this.pause();
    },
    // 播放
    play() {
      this.audioElement.play();
     
      this.getAudioTime();
    },
    // 暂停
    pause() {
      this.audioElement.pause();
      clearInterval(this.setTime);
      this.setTime = null;
    },

    // 获取音频文件
    getAudioUrl() {
      if(!JSON.parse(localStorage.getItem("_url")) || !JSON.parse(localStorage.getItem('_url')) == '{}'){
        this.$store.commit('isShow',false);
        
        return
      }
      this.$store.commit('isShow',true);
      let obj = JSON.parse(localStorage.getItem("_url")).data;
      // 上次播放的音频
      this.$store.dispatch("addAudioSrc", obj.url).then(() => {
        this.$store.commit("audioName", obj.name);
        this.$store.commit("addAudioImg", obj.img);
      });
    },
    

    // 获取音频实时时间
    getAudioTime(){
      this.setTime = setInterval(() => {
        let time = this.audioElement.currentTime;
        var duration = parseInt(time);
        var minute = parseInt(duration/60);
        var sec = duration%60+'';
        var isM0 = ':';
        if(minute == 0){
            minute = '00';
        }else if(minute < 10 ){
            minute = '0'+minute;
        }
        if(sec.length == 1){
            sec = '0'+sec;
        }
        let times = minute+isM0+sec;

        this.$store.commit('audioTime',times)
      },1000)
    }
  },
};
</script>

<style lang="less" scoped>
.controls {
  position: relative;
  .play-music {
    width: 60px;
    text-align: center;
    position: relative;
    // margin-right: 10px;
    margin: 0px auto 0;
    .music-item {
      width: 40px;
    }
  }

  .plan {
    // margin-top: 2px;
    width: 100%;
    height: 100%;
    z-index: 10;
  }
  .toggle-icon {
    font-size: 44px;
    margin-left: -1px;
    position: absolute;
    top: 0;
    left: -1px;
    z-index: -10;
    color: #9c9c9c;
  }
  .play-img {
    width: 22px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  svg {
    border: 1px solid black;
  }
  .audio-music {
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    display: flex;
    border-top: 1px solid #e8e8e8;
    z-index: 100;
    background-color: white;
  }
  .music-img {
    flex: 1.2;
    width: 50px;
    margin: 5px 10px;
    border-radius: 50%;
    overflow: hidden;
  }
  .music-box {
    flex: 5;
  }
  .music-name {
    width: 223px;
    font-size: 14px;
    font-weight: 600;
    line-height: 60px;
    text-indent: 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .music-item {
    margin-right: 6px;
    margin-left: 6px;
  }
  .item-img {
    width: 100%;
    margin: 20px auto 0;
    > img {
      width: 26px;
    }
  }
}
</style>