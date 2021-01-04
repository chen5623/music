<template>
  <div class="home">
    <van-pull-refresh
      v-model="isLoading"
      success-text="刷新成功"
      @refresh="onRefresh"
    >
      <van-loading
        v-if="bannerList.length == 0"
        size="40"
        class="loading"
        vertical
      >正在玩命加载中..</van-loading>

      <div
        v-else
        class="home-banner"
      >
        <van-swipe
          class="my-swipe"
          :autoplay="2500"
          indicator-color="red"
        >
          <van-swipe-item
            v-for="item in bannerList"
            :key="item.bannerId"
            @click="bannerPlay(item)"
          >
            <div class="banner-img">
              <img
                class="auto-img"
                :src="item.pic"
                alt=""
              />
            </div>
            <div
              class="banner-title"
              :style="{ backgroundColor: item.titleColor }"
            >
              <span>{{ item.typeTitle }}</span>
            </div>
          </van-swipe-item>
        </van-swipe>
      </div>

      <!-- 导航栏 -->
      <div class="find">
        <van-grid
          :column-num="3"
          :border="false"
          :gutter="10"
        >
          <van-grid-item
            v-for="(item, index) in dataList"
            :key="index"
            :icon="item.icon"
            :text="item.title"
            @click="back(item.name)"
          />
        </van-grid>
      </div>
      <!-- 推荐歌单 -->
      <div class="song-list">
        <div class="list-top">
          <div class="song-local">推荐歌单</div>
        </div>

        <van-loading
          v-if="classify.length == 0"
          size="40"
          class="loading"
          vertical
        >正在玩命加载中..</van-loading>

        <div
          class="song-box"
          v-else
        >
          <div
            class="box-item"
            v-for="(item, index) in classify"
            :key="index"
            @click="gotoDetail('Songdetail', item.id)"
          >
            <div class="item-img">
              <img
                class="auto-img"
                :src="item.coverImgUrl"
                alt=""
              />
            </div>
            <div class="item-txt">{{ item.copywriter }}</div>
            <div class="item-playCount">
              <i class="bg-img"></i>
              <span class="count">{{ item.playCount }}万</span>
            </div>
          </div>
        </div>
      </div>

      <div class="newSong">
        <div class="list-top">
          <div class="song-local">新歌速递</div>
        </div>
        <div>
          <van-tabs
            v-model="active"
            swipeable
            @change="getNewSonglist"
          >

            <van-tab
              :title="item.name"
              v-for="(item,index) in type"
              :key="index"
            >
              <van-loading
                v-if="!isNewSong"
                size="40"
                class="loading"
                vertical
              >正在玩命加载中..</van-loading>
              <div v-else>

                <div
                  class="newSong-list clear"
                  v-for="(v , i) in newSonglist"
                  :key="i"
                  @click="getMusic(v)"
                >
                  <div class="newSong-img fl">
                    <img
                      class="auto-img"
                      :src="v.album.picUrl"
                      alt=""
                    >
                  </div>
                  <div class="newSong-info fl">
                    <div class="info-name one-text">{{v.name}}</div>
                    <div class="info-author one-text">{{v.names}}</div>
                  </div>
                  <div class="song-play fl">
                    <van-icon
                      name="play-circle-o"
                      class="icon"
                    />
                  </div>
                </div>
              </div>
            </van-tab>

          </van-tabs>
        </div>
      </div>
    </van-pull-refresh>
  </div>
</template>

<script>
import "../assets/less/home.less";
import { mapState } from "vuex";
export default {
  name: "Home",

  computed: {
    // 音频元素
    ...mapState([
      "audioElement",
      "isPlaySong",
      "audioName",
      "addAudioImg",
      "bannerList",
      "classify",
    ]),
  },

  data() {
    return {
      // 轮播图数据
      bannerData: [],

      // 轮播图数据类型
      bannerType: "",

      // 下拉刷新
      isLoading: false,

      // 歌单数据
      songlist: [],

      // 推荐、排行榜、歌单
      dataList: [
        {
          title: "歌手榜",
          name: "Newest",
          icon: "user-o",
        },
        {
          title: "排行榜",
          name: "Rankings",
          icon: "bar-chart-o",
        },
        {
          title: "歌单",
          name: "Allsonglist",
          icon: "music-o",
        },
      ],

      type: [
        { name: "推荐", type: 0 },
        { name: "华语", type: 7 },
        { name: "欧美", type: 96 },
        { name: "日本", type: 8 },
        { name: "韩国", type: 16 },
      ],

      // 新歌索引
      active: 0,

      // 新歌列表
      newSonglist: [],
      // 用户收藏的歌单
      stationMusic:[],
      // 播放的歌曲图片
      audioImg: "",
      // 加载提示
      isNewSong: false,


    };
  },
  created() {
    this.$nextTick(() => {
      this.getBanner();
      // 歌单推荐
      this.classIfy();

      this.getNewSonglist();

      this.getMymusic(); 

    });
  },

  methods: {
    onRefresh() {
      setTimeout(() => {
        this.isLoading = false;

        this.classIfy();
      }, 1000);
    },

    back(name) {
      this.$router.push({ name });
    },

    // 跳转到歌单详情页
    gotoDetail(name, id) {
      this.$router.push({ name, params: { id } });
    },

    // 精品歌单推荐
    classIfy() {
      let list = [];

      if (JSON.parse(localStorage.getItem("_classList")).length != 0) {
        list = JSON.parse(localStorage.getItem("_classList"));
      } else {
        list = this.classify;
      }

      if (list.length != 0) {
        let index = parseInt(Math.random() * 50 - 3);
        this.songlist = list.slice(index, index + 3);
        this.$store.commit("classify", this.songlist);

      }
    },

    getBanner() {
      let data = JSON.parse(localStorage.getItem("_banner"));
      this.$store.commit("bannerList", data);
    },

    bannerPlay(item) {
      // 判断轮播图 是否可以播放
      if (item.song) {
        this.getMusic(item.song);
      } else {
        this.$toast("稍后完善");
      }
    },

    // 新歌速递
    getNewSonglist(index, title) {
      
      // 全部:0 华语:7 欧美:96 日本:8 韩国:16
      let arr = [0, 7, 96, 8, 16];

      let type = "";
      if (!index) {
        type = 0;
      } else {
        type = arr[index];
      }

      this.newSonglist = [];
      this.axios({
        method: "GET",
        url: "/top/song",
        params: {
          type,
        },
      })
        .then((result) => {
          //

          if (result.status == 200) {
            //
            // 裁切的位置
            let index = Math.floor(
              Math.random() * (result.data.data.length - 5)
            );

            let data = result.data.data.slice(index, index + 5);

            data.map((v) => {
              v.namelist = [];
              for (let i = 0; i < v.artists.length; i++) {
                v.namelist.push(v.artists[i].name);
              }
              v.names = v.namelist.join("--");
            });

            this.newSonglist = data;

            this.isNewSong = true;
          }
        })
        .catch((err) => {});
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
          if (result.data.success) {
            // 调用获取歌曲的url,不然会使有id但没有播放路径的歌曲没有提示播放不了
            this.getSongUrl(item);

            this.$store.commit("isShow", true);
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

          let url = null;

          if (result.data.code == 200) {
            // 有些歌曲有id但播放路径为空  切换歌曲时的不能播放提示
            if (songUrl == null) {
              this.$toast("亲爱的,暂无版权");
              return;
            }

            this.recentplay = [];
            // 获取播放记录
            this.recentplay = JSON.parse(localStorage.getItem("_play"));

            let playList = JSON.parse(localStorage.getItem("_playList"));

            let arr = [],
              arr1 = [];

            let hash = {},
              hash1 = {};

            if (this.recentplay.length == 0) {
              arr.push(item);
            } else {
              this.recentplay.push(item);
              arr = this.recentplay.reduce(function (item, next) {
                hash[next.name]
                  ? ""
                  : (hash[next.name] = true && item.push(next));

                return item;
              }, []);
            }

            if (playList.length == 0) {
              arr1.push(item);
            } else {
              playList.push(item);
              arr1 = playList.reduce(function (item, next) {
                hash1[next.name]
                  ? ""
                  : (hash1[next.name] = true && item.push(next));

                return item;
              }, []);
            }

            localStorage.setItem("_playList", JSON.stringify(arr1));
            localStorage.setItem("_play", JSON.stringify(arr));

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
      if (item.album) {
        this.audioImg = item.album.picUrl;
      } else if (item.al.picUrl) {
        this.audioImg = item.al.picUrl;
      }

      // // 歌曲图片
      this.$store.commit("addAudioImg", this.audioImg);

      // // // 存储到本地
      let obj = {
        name: item.name,
        id: item.id,
        url: this.url,
        img: this.audioImg,
        time: this.audioElement.duration,
      };
      localStorage.setExpire("_url", obj);
    },

    // 播放
    play() {
      this.audioElement.play();
    },

     // 获取我的音乐
    getMymusic() {
      // 获取token
      let idString = localStorage.getItem("__log");

      if (!idString) {
        this.$toast("请先登录");
        return;
      }
      this.axios({
        method: "GET",
        url: "/user/playlist",
        params: {
          uid: idString,
        },
      })
        .then((result) => {
          //
          if (result.data.code == 200) { 
            let arr = [];

            result.data.playlist.map((v) => {
              // 
              if (v.ordered) {
                  // 收藏歌单
                  this.stationMusic.push(v);
              } else {
                arr.push(v)
              }
            });


            arr.splice(0,1)

            let data = JSON.parse(localStorage.getItem('_songList'));
            

            if(data.length <= 4){
              
              localStorage.setItem("_songList", JSON.stringify(this.stationMusic));
            }

            localStorage.setItem('_createList',JSON.stringify(arr))

          }
        })
        .catch((err) => {});
    },
  },
};
</script>
