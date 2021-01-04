<template>
  <div class="play-box">
    <van-nav-bar
      left-text="最近播放"
      left-arrow
      @click-left="goPage"
      fixed
    />
    <div class="song-box">
      <div class="box-name">
        <span>歌曲&nbsp;{{ playSongData.length }}</span>
      </div>

      <div class="no-list" v-if="playSongData.length == 0">
        <div class="no-title">没有播放记录</div>
      </div>

      <div
        class="song-list"
        v-else
      >
        <div
          class="song-item"
          v-for="(item, index) in playSongData"
          :key="index"
          @click="getMusic(item)"
        >
          <div class="song-name">
            <span>{{ item.name }}</span>
          </div>
          <div class="song-author">
            <span>{{ item.names }}</span>
          </div>
          <div class="play-icon">
            <van-icon
              name="play-circle-o"
              class="icon"
            />
          </div>
        </div>
      </div>
    </div>
    <Controls></Controls>
  </div>
</template>

<script>
import Controls from "../components/Controls.vue";

import { mapState } from "vuex";
export default {
  name: "Recentplay",

  components: {
    Controls,
  },

  computed: {
    // 音频元素
    ...mapState(["audioElement","isPlaySong","audioName","addAudioImg"]),
  },

  created() {
    // 获取最近播放
    this.getPlay();
  },

  data() {
    return {
      // 最近播放数据
      playSongData: [],

      // 音频图片
      audioImg: "",

      url:''
    };
  },

  methods: {
    // 返回上一级
    goPage() {
      this.$router.go(-1);
    },
    // 获取最近播放
    getPlay() {
      // 获取token
      let idString = localStorage.getItem("__log");

      if (!idString) {
        this.$toast("请先登录");
        return;
      }

      // 获取最近播放数据
      let data = JSON.parse(localStorage.getItem("_playList"));
      // 
      data.map((v) => {
        // 伪装数据
        v.namelist = [];
        v.names = "";

        // 筛选数据中的歌曲作者名称
        if(v.artists){
          let len = v.artists.length;
          for (let i = 0; i <len ; i++) {
            v.namelist.push(v.artists[i].name);
            v.names = v.namelist.join("--");
          }
        }else if(v.ar){
          let len = v.ar.length;
          for (let i = 0; i <len ; i++) {
            v.namelist.push(v.ar[i].name);
            v.names = v.namelist.join("--");
          }
        }else if(v.song.artists){
          let len = v.song.artists.length;
          for (let i = 0; i <len ; i++) {
            v.namelist.push(v.song.artists[i].name);
            v.names = v.namelist.join("--");
          }
        }
      });
      this.playSongData = data;
    },

    // 获取音乐的版权
    getMusic(item) {
         
      // 有些歌曲会出现403 用拼接字符串来代替播放路径
      this.url = ` https://music.163.com/song/media/outer/url?id=${item.id}.mp3`;

      this.$store.dispatch("addAudioSrc", this.url).then(() => {

        this.$toast.clear();
        // 显示播放
        this.$store.commit("isPlaySong", true);

        // 歌名
        this.$store.commit("audioName", item.name);

        // 获取音频总时长
        this.audioElement.addEventListener("canplay", () => {
          // // 播放音乐
          this.play();

          this.getAudioImg(item);
        });
      });
    },

    // 获取音频照片
    getAudioImg(item) {

      

      if(item.soimg){
        this.audioImg = item.soimg;
      }else if(item.picUrl){
        this.audioImg = item.picUrl;
      }else if(item.al.picUrl){
        this.audioImg = item.al.picUrl;
      }
      // 存储到本地
      let obj = {
        name: item.name,
        id: item.id,
        url:this.url,
        img: this.audioImg,
        time: this.audioElement.duration,
      };

      localStorage.setExpire("_url", obj);

      // 歌曲图片
      this.$store.commit("addAudioImg", this.audioImg);

    },

    // 播放
    play() {
      this.audioElement.play();
    },
  },
};
</script>

<style lang="less" scoped>
.play-box {
  padding-top: 46px;
  padding-bottom: 60px;
  /deep/ .van-nav-bar__text,
  /deep/ .van-nav-bar .van-icon {
    color: black;
  }
  .box-name {
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    font-weight: 600;
    text-indent: 20px;
    color: #dd1200;
    border-bottom: 1px solid #e8e8e8;
  }
  .song-list {
    margin-top: 6px;
    position: relative;
  }
  .song-item {
    padding: 12px 10px 10px 16px;
    position: relative;
  }
  .song-name {
    width: 80%;
    text-indent: 10px;
  }
  .txt-color {
    color: #b3b3b3;
  }
  .song-author {
    margin-top: 6px;
    color: #a1a1a1;
    text-indent: 10px;

  }
  .play-icon {
    position: absolute;
    right: 14px;
    top: 18px;
  }
  /deep/.icon {
    font-size: 22px;
    // transform: rotateZ(90deg);
    color: #b1b1b1;
  }
  .loading {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .no-title {
    width: 100px;
    font-size: 14px;
    padding: 6px 10px;
    margin: 50% ;
    text-align: center;
    background-color: #dd1200;
    color: #fff;
    border-radius: 10px;
    transform: translate(-50%,-50%);
  }
}
</style>