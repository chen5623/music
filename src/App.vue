<template>
  <div id="app">
    <audio :src="audioSrc" class="audio" preload="auto" :loop="orderIndex ? false:true" ref="audio"></audio>

    <router-view v-if="!$route.meta.keepAlive" />
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive" />
    </keep-alive>
  </div>
</template>
<script>
import { mapState , mapActions } from "vuex";
export default {
  name: "App",
  data(){
    return {
      audioImg:''
    }
  },
  created() {},
  computed: {
    ...mapState(["audioSrc", "audioElement", "isPlaySong","orderIndex","songListactive",'isEnd']),
  },

  created() {
    // 获取audio元素
    this.$nextTick(() => {
      this.changeAudio(this.$refs.audio);
      // 监听歌曲是否播放完成
      this.montierSong();
    });

  },
  methods: {
    // 获取音频元素
    changeAudio(audio) {
      // 
      this.$store.commit("addAudio", audio);
    },

    // 监听歌曲是否播放完成
    montierSong(){
      
      this.audioElement.addEventListener('ended',() => {
        // 获取播放记录
        let index = -1;
        let data = JSON.parse(localStorage.getItem("_play"));
        // 获取当前播放歌曲
        let song = JSON.parse(localStorage.getItem("_url")).data;
        if(data.length == 0){
          // 单曲循环
          this.$store.commit('orderIndex',false);
          
          return
        }

        // 播放列表长度不为0时
        this.$store.commit('orderIndex',true);
        for (let i = 0; i < data.length; i++) {
          if (data[i].id == song.id) {
            // 单曲循环
            if (this.orderIndex) {
              index = i + 1;
              if(index == data.length) {
                index = 0;
              }
              // 修改列表歌曲激活状态
              this.$store.commit('songListactive',index);
            
            }
          }
        }

        this.$store.commit('isEnd',true);
        this.getMusic(data[index])
      })
    },
      // 获取音乐的版权
    getMusic(item) {

      // 有些歌曲会出现403 用拼接字符串来代替播放路径
      this.url = `https://music.163.com/song/media/outer/url?id=${item.id}.mp3`;
      // 歌名
      this.$store.commit("audioName", item.name);
      // 歌曲图片
      this.$store.commit("addAudioImg", this.audioImg);

      this.$store.dispatch("addAudioSrc", this.url).then(() => {

        //更改src后需要重新加载音乐
        this.audioElement.load()
        
        // 显示播放
        this.$store.commit("isPlaySong", true);

        // 获取音频总时长
        this.audioElement.addEventListener("canplay", () => {
          // 调用获取音频图片
          this.getAudioImg(item);
          // 播放音乐
          this.audioElement.play();
        });
      });
    },

    // 获取音频照片
    getAudioImg(item) {

      // 获取音频图片
      if(item.soimg){
        this.audioImg = item.soimg;
      }else if(item.picUrl){
        this.audioImg = item.picUrl;
      }else if(item.album.picUrl) {
        this.audioImg = item.album.picUrl;
      }else if(item.al.picUrl){
        this.audioImg = item.al.picUrl;
      }
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

  },
};
</script>
<style lang="less">
.fl {
  float: left;
}
.fr {
  float: right;
}
.clear::after {
  content: "";
  display: block;
  clear: both;
}
.auto-img {
  width: 100%;
  display: block;
}
.one-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.icon {
  color: #dd1210;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  /deep/ .van-nav-bar__text,
  /deep/ .van-nav-bar .van-icon {
    color: #dd1210;
  }

  
}
</style>
