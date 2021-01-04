<template>
  <div class="singerdetail">
    <van-nav-bar
      left-text="返回"
      :title="singerData.name"
      left-arrow
      @click-left="back"
      fixed
    />

     <van-loading v-if="!singerData.name" size="80" class="loading" vertical>正在玩命加载中..</van-loading>

    <div class="singer-box" v-else>
      <div class="singer-img">
        <img
          class="auto-img"
          :src="singerData.picUrl"
        >
      </div>
      <div class="singer-text">
        <div class="singer-intro clear">
          <div class="fl">歌手简介</div>
          <div
            class="fr"
            @click="toggleShow"
          >
            <van-icon :name="isshow ? 'arrow-down' : 'arrow'" />
          </div>
        </div>
        <div
          class="intro-box"
          :class="isshow ? '' : 'active'"
        >
          {{singerData.briefDesc}}
        </div>
      </div>

      <div
        class="songs"
      >
        <div
          class="box-item"
          v-for="(item,index) in singerSongList"
          :key="index"
          @click="getMusic(item)"
        >
          <div class="item-index"> {{index + 1 }}</div>
          <div class="item-info">
            <div class="item-name one-text"> {{item.name}} </div>
            <div class="item-author one-text">
               {{item.names}} - {{item.al.name}} 
            </div>
          </div>
          <div class="item-play">
            <van-icon
              name="play-circle-o"
              class="icon"
            />
          </div>
          <div class="item-set"></div>
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
  name: "Singerdetail",

   computed: {
    // 音频元素
    ...mapState(["audioElement"]),
  },
  components: {
    Controls,
  },

  data() {
    return {
      // 歌手id
      id: "",

      // 歌手信息
      singerData: "",

      //歌手歌曲
      singerSongList: [],

      // 展示歌手简介
      isshow: false,

      // 播放列表
      recentplay:[],

      // 歌曲路径
      url:''
    };
  },

  created() {
    // 歌手id
    this.id = this.$route.params.id;

    // 获取歌手信息
    this.getSingerInfo();
  },

  methods: {
    back() {
      this.$router.go(-1);
    },

    // 获取歌手信息
    getSingerInfo() {
      this.axios({
        method: "GET",
        url: "/artists",
        params: {
          id: this.id,
        },
      })
        .then((result) => {

          

          if (result.status == 200) {
            // 歌手信息
            this.singerData = result.data.artist;
            // 歌曲的作者做调整
            let data = result.data.hotSongs;
            let names = []
            data.map(v => {
              v.namelist = [];
              v.names = ''
              for(let i = 0 ; i < v.ar.length ; i++){
                v.namelist.push(v.ar[i].name);
                v.names = v.namelist.join('/');
              }
            })

            // 歌手歌曲
            this.singerSongList = data;

          }
        })
        .catch((err) => {
          
        });
    },
    // 切换歌手简介
    toggleShow() {
      this.isshow = !this.isshow;
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

              // 显示播放
              this.$store.commit("isPlaySong", true);
              // 获取音频总时长
              this.audioElement.addEventListener("canplay", () => {
                // 播放音乐
                this.play();
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
      let audioImg = item.al.picUrl;

      // 歌曲图片
      this.$store.commit("addAudioImg", audioImg);
      
      // // 存储到本地
      let obj = {
        name: item.name,
        id: item.id,
        url:this.url,
        img: audioImg,
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
.singerdetail {
  padding-top: 46px;
  padding-bottom: 60px;
  /deep/ .van-nav-bar__title {
    font-weight: 600;
  }
  .singer-box {
    padding: 0 10px 1px;
    background-color: #f0f0f0;

  }
  .singer-text {
    width: 90%;
    padding: 10px;
    margin: 0px auto 0;
    background-color: rgba(255, 255, 255, 0.8);
    transform: translateY(-40px);
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
  }
  .singer-intro {
    font-size: 14px;
    height: 30px;
    line-height: 30px;
    color: #000;
    text-indent: 10px;
  }
  .intro-box {
    font-size: 14px;
    text-indent: 28px;
    line-height: 22px;
    text-align: justify;
    &.active {
      // height: 40px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      transition: height 0.5s;
    }
  }
  .songs{
    background-color: #fff;
    border-radius: 6px;
  }
  .box-item {
    display: flex;
    height: 60px;
    font-size: 16px;
    margin-bottom: 10px;
  }
  .item-index {
    flex: 1;
    font-size: 14px;
    line-height: 60px;
    text-align: center;
    color: #707070;
  }
  .item-info {
    flex: 6;
    overflow: hidden;
  }
  .item-name{
    color: #444;
    font-size: 14px;
    margin-top: 10px;
    font-weight: 600;
  }
  .item-author{
    color: #8a8a8a;
    font-size: 12px;
    margin-top: 10px;
    
  }
  .item-play {
    flex: 1;
    line-height: 70px;
    text-align: right;
    font-size: 20px;
    color: #8d8d8d;
  }
  .item-set {
    flex: 1;
    line-height: 60px;

  }
  /deep/ .van-loading {
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>