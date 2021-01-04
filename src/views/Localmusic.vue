<template>
  <div class="local">
    <van-nav-bar
      left-text="返回"
      left-arrow
      @click-left="goPage"
      fixed
      title="推荐歌曲"
    />
    <div class="song-box">
      <!-- <div class="box-name">
        <span>歌曲&nbsp;{{ localMusic.length }}</span>
      </div> -->

      <van-loading v-if="localMusic.length == 0" size="80" class="loading" vertical >正在加载中</van-loading>

      <div class="song-list" v-else>
        <div
          class="song-item clear"
          v-for="(item, index) in localMusic"
          :key="index"
          @click="getMusic(item)"
        >
          <div class="song-img fl">
            <img class="auto-img" :src="item.picUrl" alt="" />
          </div>
          <div class="song-name fl">
            <span>{{ item.name }}</span>
          </div>
          <div class="song-author fl">
            <div>{{ item.song.artists[0].name }}</div>
            <div class="txt-over">--{{ item.song.name }}</div>
          </div>
          <div class="play-icon">
            <van-icon name="play-circle-o" class="icon" />
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
  name: "Localmusic",
  components: {
    Controls,
  },

  computed: {
    // 音频元素
    ...mapState(["audioElement"]),
  },

  data() {
    return {
      // 推荐音乐
      localMusic: [],

      recentplay:[]
    };
  },
  created() {
    this.getlocalMuisc();
  },

  methods: {
    // 返回上一级
    goPage() {
      this.$router.go(-1);
    },
    // 推荐音乐
    getlocalMuisc() {

      this.axios({
        method: "GET",
        url: "/personalized/newsong",
        params: {
          timestamp:new Date().getTime()
        },
      })
        .then((result) => {
          

          if (result.data.code == 200) {
            this.localMusic = result.data.result;
          }
        })
        .catch((err) => {
          
        });
    },

    // 获取音乐的版权
    getMusic(item) {
      this.$toast.loading({
        message: "加载中..",
        forbidClick: true,
        duration: 0,
      });
      // 
      
      this.axios({
        method: "GET",
        url: "/check/music",
        params: {
          id: item.id,
        },
      })
        .then((result) => {
          // 

          if (result.data.success) {

           
            // 调用获取歌曲的url,不然会使有id但没有播放路径的歌曲没有提示播放不了
            this.getSongUrl(item);

          } else if (!result.data.text.success) {
            // 第一次点击歌曲的时候提示歌曲无法播放
            this.$toast("亲爱的,暂无版权");
          }
        })
        .catch((err) => {
          this.$toast.clear();

          
        });
    },
    // 获取音乐的url
    getSongUrl(item) {
      // 
      
      this.axios({
        methdo: "GET",

        url: "/song/url",

        params: {
          id: item.id,
          tiem: new Date().getTime(),
        },
      })
        .then((result) => {
          
          // 播放路径
          let songUrl = result.data.data[0].url;

          let url = null

          if (result.data.code == 200) {
            // 有些歌曲有id但播放路径为空  切换歌曲时的不能播放提示
            if (songUrl == null) {
              this.$toast("亲爱的,暂无版权");
              return;
            }

            this.recentplay = [];
            // 获取播放记录
            this.recentplay = JSON.parse(localStorage.getItem("_play"));

            let playList = JSON.parse(localStorage.getItem('_playList'));
            
            let arr = [] , arr1 = [];

            let hash = {} , hash1 = {};

            if(this.recentplay.length == 0 ){
              arr.push(item);
            }else {
              this.recentplay.push(item)
              arr = this.recentplay.reduce(function (item,next) {
                hash[next.name] ? '':hash[next.name] = true && item.push(next);

                return item
              },[])
            }

            if(playList.length == 0 ){
              arr1.push(item);
            }else {
              playList.push(item)
              arr1 = playList.reduce(function (item,next) {
                hash1[next.name] ? '':hash1[next.name] = true && item.push(next);

                return item
              },[])
            }

            localStorage.setItem('_playList',JSON.stringify(arr1));
            localStorage.setItem('_play',JSON.stringify(arr));

            // 有些歌曲会出现403 用拼接字符串来代替播放路径
            this.url = `https://music.163.com/song/media/outer/url?id=${item.id}.mp3`;
             // 歌名
            this.$store.commit("audioName", item.name);

            this.$store.dispatch("addAudioSrc", this.url).then(() => {
              this.$toast.clear();
              // 播放音乐
              this.play();

              // 显示播放
              this.$store.commit("isPlaySong", true);

              // 获取音频总时长
              this.audioElement.addEventListener("canplay", () => {
                // 调用获取音频图片
                this.getAudioImg(item);
                
              });
            });
          }
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },

    // 获取音频照片
    getAudioImg(item) {
      // 获取音频图片
      this.audioImg = item.picUrl;

      // 歌曲图片
      this.$store.commit("addAudioImg", this.audioImg);
      
      // // 存储到本地
      let obj = {
        name: item.name,
        id: item.id,
        url:this.url,
        img: this.audioImg,
        time: this.audioElement.duration,
      };
      localStorage.setExpire("_url", obj);
    },
    // 播放
    play() {
      this.audioElement.play();
    },
  },
};
</script>

<style lang="less" scoped>
.local {
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
  .song-img {
    width: 50px;
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
    width: calc(~"100% - 80px");
    font-size: 14px;
    margin-left: 10px;
  }
  .txt-color {
    color: #b3b3b3;
  }
  .song-author {
    margin-top: 6px;
    color: #a1a1a1;
    margin-left: 10px;
    font-size: 12px;
  }
  .txt-over {
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
  }
  .loading {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>