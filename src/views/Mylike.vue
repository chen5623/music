<template>
  <div class="my-like">
    <div class="like-nav">
      <van-nav-bar
        left-text="歌曲"
        left-arrow
        @click-left="back"
        style="color:#fff"
      />
    </div>

    <div class="song-box">
      <div class="box-name">
        <span>歌曲&nbsp;{{ MylistList.length }}</span>
      </div>

      <div class="all-no" v-if="MylistList.length == 0" @click="goPage">
        去添加歌曲
      </div>
      <div
        class="song-list"
        v-else
      >
        <div
          class="song-item"
          v-for="(item, index) in MylistList"
          :key="index"
          @click="getMusic(item)"
        >
          <div class="song-name">
            <span>{{ item.name }}</span>
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
  name: "Mylike",
  components: {
    Controls,
  },
  computed: {
    // 音频元素
    ...mapState(["audioElement", "isPlaySong", "audioName", "addAudioImg"]),
  },

  data() {
    return {
      // 喜欢的 信息
      song: [],

      // 喜欢的歌曲列表
      MylistList: [],

      audioImg:''
    };
  },

  created() {
    // 获取喜欢的歌曲
    this.getMylikeList();
  },

  methods: {
    // 返回上一级
    back() {
      this.$router.go(-1);
    },

    // 跳转
    goPage(){
      this.$router.push({name:'Search'})
    },

    // 获取喜欢的歌曲
    getMylikeList() {
      // 获取token
      let idString = localStorage.getItem("__log");

      if (!idString) {
        this.$toast("请先登录");
        return;
      }
      // 获取最近播放数据
      let data = JSON.parse(localStorage.getItem("_like"));
      this.MylistList = data;
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

      this.audioImg = item.img
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
.my-like {
  padding-top: 46px;
  .like-nav {
    background-color: #b9b9b9;
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
  }
 

  .like-box {
    width: 100%;
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
    width: 90%;
    margin: 0 auto 10px;
    padding: 12px 10px 10px 16px;
    position: relative;
    height: 30px;
    line-height: 30px;
    background-color: #f3f3f3;
    border-radius: 10px;
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
    top: 14px;
  }
  /deep/.icon {
    font-size: 22px;
    // transform: rotateZ(90deg);
    color: #dd1200;
  }
  .loading {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .all-no {
    width: 90px;
    color: #fff;
    padding: 8px;
    font-size: 16px;
    text-align: center;
    background-color: #dd1200;
    border-radius: 10px;
    position: fixed;
    top: 40%;
    left: 50%;
    transform: translate(-50%,-50%);
  }
}
</style>