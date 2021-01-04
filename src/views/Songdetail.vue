<template>
  <div class="song-detail">
    <!-- 歌单详情 -->
    <van-nav-bar
      left-text="返回"
      left-arrow
      @click-left="goPage"
      title="歌单详情"
      fixed
    />

    <van-loading
      v-if="!musicSongData.name"
      size="80"
      class="loading"
      vertical
    >正在玩命加载中..</van-loading>

    <!-- 歌单信息 -->
    <div v-else>
      <div class="song-info">
        <div class="song-box clear">
          <div class="song-img fl">
            <img
              class="auto-img"
              :src="musicSongData.coverImgUrl"
              alt=""
            />
          </div>
          <div class="song-txt fl">
            <div class="song-name">{{ musicSongData.name }}</div>
            <div class="song-author">{{ musicName }}</div>
            <div class="song-count">
              <span>歌曲：<i>{{ musicSongData.trackCount }}</i></span>
              &nbsp;
              <span>播放：<i>{{ musicSongData.playCount }}</i></span>
            </div>
            <div class="descrip">
              简介：<span>{{ musicDescrip }}</span>
            </div>
          </div>
        </div>
      </div>

      <div
        class="song-list"
        id="song-list"
      >
        <div class="clear">
          <div class="song-all clear fl" @click="allPlay">
            <van-icon
              class="icon-all fl"
              name="play-circle-o"
            />
            <div class="all-txt fl">播放全部(共{{ songList.length }}首)</div>
          </div>
          <div class="like-song fl">
            <van-icon
              :name="islike ? 'like' : 'like-o'"
              :color="islike ? 'red' : '#444'"
              @click="likeSong"
            />
          </div>
        </div>
        <div
          v-if="songList.length == 0"
          class="loadings"
        >
          <van-loading
            size="40"
            vertical
          >正在加载歌曲</van-loading>
        </div>

        <div
          class="songs"
          v-else
        >
          <div
            class="box-item"
            v-for="(item, index) in songList"
            :key="index"
            @click="getMusic(item)"
          >
            <div class="item-index">{{ index + 1 }}、</div>
            <div class="item-info">
              <div class="item-name one-text">{{ item.name }}</div>
              <div class="item-author one-text">
                {{ item.ar[0].name }}&nbsp;-&nbsp;{{ item.al.name }}
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
    </div>

    <Controls></Controls>
  </div>
</template>

<script>
import "../assets/less/songdetail.less";
import Controls from "../components/Controls.vue";
import { mapState } from "vuex";
export default {
  name: "Songdetail",

  components: {
    Controls,
  },
  computed: {
    // 音频元素
    ...mapState(["audioElement", "isPlaySong", "audioName", "addAudioImg"]),
  },

  data() {
    return {
      // 歌单id
      id: "",

      // 获取歌单数据
      musicSongData: {},

      // 歌单名称
      musicName: "",

      // 歌单简介
      musicDescrip: "",

      // 歌单详情歌曲id
      songId: [],

      // 歌曲列表
      songList: [],

      loading: true,

      recentplay: [],

      url:null,

      islike:false
    };
  },
  created() {
    // 歌单id
    this.id = this.$route.params.id;

    // 调用获取歌单数据
    this.getSongData();
  },
  

  methods: {
    // 返回上一级
    goPage() {
      this.$router.go(-1);
    },

    // 获取歌单数据
    getSongData() {
      let data = JSON.parse(localStorage.getItem('_songList'));

      data.map(v => {
        
        if(v.id == this.id){
          this.islike = true
        }
      })
      // 调用接口获取数据
      this.axios({
        method: "GET",
        url: "/playlist/detail",
        params: {
          id: this.id,
        },
      })
        .then((result) => {
          if (result.data.code == 200) {

            
            // 歌单数据
            this.musicSongData = result.data.playlist;

            // 歌单名称
            this.musicName = this.musicSongData.creator.nickname;

            // 歌单简介
            this.musicDescrip = this.musicSongData.description
              ? this.musicSongData.description
              : "这作者很懒，啥也没留下";

            this.musicSongData.trackIds.map((v) => {
              this.songId.push(v.id);
            });
            this.loading = false;
            this.getSonglist();
          }
        })
        .catch((err) => {
          this.loading = false;
          
        });
    },

    // 获取歌单中的歌曲
    getSonglist() {
      this.axios({
        method: "GET",
        url: "/song/detail",
        params: {
          ids: this.songId.join(","),
        },
      })
        .then((result) => {
          // 

          if (result.data.code == 200) {
            this.songList = result.data.songs;
          }
        })
        .catch((err) => {
          
        });
    },

    // 播放全部
    allPlay(){
      let data = JSON.parse(localStorage.getItem('_play'));
      let datas = JSON.parse(localStorage.getItem('_playList'));

      this.songList.map(  v=> {
        data.push(v)
        datas.push(v)
      })

      localStorage.setItem('_play',JSON.stringify(data))
      localStorage.setItem('_playList',JSON.stringify(datas))

    },

    // 收藏歌单
    likeSong(){
      let arr = JSON.parse(localStorage.getItem('_songList'));
      if(this.islike){
        for(let i = 0 ; i<arr.length ; i++){
          if(arr[i].id == this.id){
            arr.splice(i,1);
          }
        }
        localStorage.setItem('_songList',JSON.stringify(arr));
        this.islike = false
        return
      }else {
        
        arr.push(this.musicSongData);
        
        localStorage.setItem('_songList',JSON.stringify(arr));
        this.islike = true
      }

    },

    // 获取音乐的版权
    getMusic(item) {
      this.$toast.loading({
        message: "加载中..",
        forbidClick: true,
        duration: 0,
      });
      
      
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
      this.audioImg = item.al.picUrl;

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

