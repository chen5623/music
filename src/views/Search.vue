<template>
  <div class="search">
    <!-- 搜索 -->
    <div class="search-box clear">
      <div
        class="box-left fl"
        @click="back"
      >
        <van-icon
          name="arrow-left"
          size="26px"
        />
      </div>
      <div class="box-right fl">
        <input
          ref="ipt"
          type="text"
          class="ipt"
          name=""
          id=""
          placeholder="请输入需要搜索的歌曲"
          v-model="name"
          @keydown.enter="searchSonglist(name)"
        />
        <van-icon
          v-show="searchList.length != 0"
          name="cross"
          class="icon"
          @click="removeSonglist"
        />
      </div>
    </div>

    <!-- 历史记录 -->
    <div
      class="past clear"
      v-if="searchList.length == 0"
    >
      <div class="past-list fl">
        <span>历史</span>
      </div>
      <div class="past-item fl">
        <div
          class="item-txt"
          v-for="(item, index) in setSearchlist"
          :key="index"
          @click="searchSonglist(item)"
        >
          {{ item }}
        </div>
      </div>
      <div
        class="dele fr"
        @click="clearSearchlist"
      >
        <van-icon name="delete" />
      </div>
    </div>

    <div
      class="songs"
      v-else
    >
      <div
        class="box-item"
        v-for="(item, index) in searchList"
        :key="index"
        @click="getMusic(item)"
      >
        <div class="item-index">{{ index + 1 }}</div>
        <div class="item-info">
          <div class="item-name one-text">{{ item.name }}</div>
          <div class="item-author one-text">
            {{ item.names }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Search",

  computed: {
    // 音频元素
    ...mapState(["audioElement", "addAudioSrc"]),
  },

  data() {
    return {
      // 搜索名称
      name: "",

      // 搜索列表
      searchList: [],

      // 历史搜索记录
      setSearchlist: [],

      // 音乐图片
      audioImg: "",
      recentplay: [],

      url: "",
    };
  },

  created() {
    // 获取input标签，自动聚焦
    this.$nextTick(() => {
      let ipt = this.$refs.ipt;

      ipt.focus();
    });

    this.setSearch();
  },

  methods: {
    // 返回上一级
    back() {
      this.$router.go(-1);
    },

    // 获取搜索记录
    setSearch() {
      if (!localStorage.getItem("_search")) {
        let arr = [];
        // 历史记录记载在本地存储
        localStorage.setItem("_search", JSON.stringify(arr));
        return;
      }

      this.setSearchlist = JSON.parse(localStorage.getItem("_search"));
    },

    // 搜索
    searchSonglist(name) {
      // 开启加载提示
      this.$toast.loading({
        message: "加载中..",
        forbidClick: true,
        duration: 0,
      });
      // 输入框显示点击历史记录时的歌名
      this.name = name;

      // 判断搜索框内容是否为空
      if (name.length == 0) {
        this.$toast("搜索内容不能为空");
        return;
      }

      // 插入历史记录
      this.setSearchlist.unshift(name);

      let arr1 = [];

      // 去掉重复的搜索记录
      for (var i = 0, len = this.setSearchlist.length; i < len; i++) {
        if (arr1.indexOf(this.setSearchlist[i]) === -1) {
          arr1.push(this.setSearchlist[i]);
        }
      }
      // 重新赋值
      this.setSearchlist = arr1;

      // 历史搜索记录超过8条时 删除数组的最后一条记录
      if (this.setSearchlist.length > 8) {
        this.setSearchlist.splice(-1, 1);
      }
      // 存储到本地存储
      localStorage.setItem("_search", JSON.stringify(this.setSearchlist));

      // 获取数据
      this.axios({
        method: "GET",
        url: "/search",
        params: {
          keywords: name,
          type: 1,
        },
      })
        .then((result) => {
          this.$toast.clear();

          if (result.data.code == 200) {
            

            let data = result.data.result.songs;

            data.map((v) => {
              v.namelist = [];
              v.names = "";
              for (let i = 0; i < v.artists.length; i++) {
                v.namelist.push(v.artists[i].name);
                v.names = v.namelist.join("--");
              }
            });
            
            this.searchList = data;
          }
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },

    // 清空历史记录
    clearSearchlist() {
      let arr = [];
      localStorage.setItem("_search", JSON.stringify(arr));

      this.setSearchlist = [];
    },

    // 获取音乐的版权
    getMusic(item) {

      // 开启加载提示
      this.$toast.loading({
        message: "加载中..",
        forbidClick: true,
        duration: 0,
      });
      // 有些歌曲会出现403 用拼接字符串来代替播放路径
      this.url = ` https://music.163.com/song/media/outer/url?id=${item.id}.mp3`;

      this.time = "";
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
          } else if (result.data.text.success == false) {
            // 第一次点击歌曲的时候提示歌曲无法播放
            this.$toast("亲爱的,暂无版权");
          }
        })
        .catch((err) => {
          
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
          items: new Date().getTime(),
        },
      })
        .then((result) => {
          

          // 播放路径
          let songUrl = result.data.data[0].url;

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

            // 播放列表
            if(this.recentplay.length == 0 ){
              arr.push(item);
            }else {
              this.recentplay.push(item)
              arr = this.recentplay.reduce(function (item,next) {
                hash[next.name] ? '':hash[next.name] = true && item.push(next);

                return item
              },[])
            }

            // 最近播放
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

            this.$store.commit("addAudioSrc", null);
            // 歌名
            this.$store.commit("audioName", item.name);

            // 获取音频路径后
            this.$store.dispatch("addAudioSrc", this.url).then(() => {
              this.$toast.clear();
              // 显示播放
              this.$store.commit("isPlaySong", true);

              // 获取音频总时长
              this.audioElement.addEventListener("canplay", () => {
                // // 播放音乐
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
      this.axios({
        mtehod: "GET",
        url: "/song/detail",
        params: {
          ids: item.id,
        },
      })
        .then((result) => {
          

          if (result.data.code == 200) {
            // 获取音频图片
            this.audioImg = result.data.songs[0].al.picUrl;
            // 歌曲图片
            this.$store.commit("addAudioImg", this.audioImg);

            let data = JSON.parse(localStorage.getItem('_play'));
            let data1 = JSON.parse(localStorage.getItem('_playList'));

            for(let i = 0 ; i < data.length ; i++){
              if(data[i].id == item.id){
                data[i].soimg = this.audioImg;
              }
            }
            for(let i = 0 ; i < data1.length ; i++){
              if(data1[i].id == item.id){
                data1[i].soimg = this.audioImg;
              }
            }

            localStorage.setItem('_play',JSON.stringify(data))
            localStorage.setItem('_playList',JSON.stringify(data1))

             // // 存储到本地
            let obj = {
              name: item.name,
              id: item.id,
              url: this.url,
              img: this.audioImg,
              time: this.audioElement.duration,
            };

            localStorage.setExpire("_url", obj);
          }
        })
        .catch((err) => {
          
        });
    },

    // 播放
    play() {
      this.audioElement.play();
    },

    // 清空搜索出来的歌曲
    removeSonglist() {
      this.searchList = [];

      this.name = "";
    },
  },
};
</script>

<style lang="less" scoped>
.search {
  padding: 46px 10px 0;
  .icon {
    left: 30px;
    top: 5px;
    font-size: 16px;
  }

  .search-box {
    padding: 0 10px;
    height: 46px;
    width: calc(~"100% - 20px");
    position: fixed;
    top: 0;
    left: 0;
    background-color: #fff;
  }
  .box-left {
    width: 40px;
    text-align: left;
    > i {
      line-height: 46px;
      font-weight: 400;
      color: #dd1200;
    }
  }
  .box-right {
    height: 100%;
    width: calc(~"100% - 40px");
    border-bottom: 1px solid #666;
  }
  input::-webkit-input-placeholder {
    /* placeholder颜色 */
    color: #aab2bd;
    /* placeholder字体大小 */
    font-size: 12px;
  }
  .ipt {
    margin: 0;
    padding: 0 !important;
    width: 80%;
    height: 45px;
    color: #444;
    font-size: 16px;
    border: none;
  }
  .past {
    margin-top: 10px;
  }
  .past-list {
    width: 40px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    font-size: 14px;
    color: #444;
    margin-right: 6px;
  }
  .past-item {
    width: calc(~"100% - 92px");
    display: flex;
    flex-wrap: wrap;
  }

  .item-txt {
    font-size: 14px;
    color: #444;
    padding: 4px 8px;
    background-color: #ececec;
    border-radius: 20px;
    margin-top: 6px;
    margin: 6px 4px 0;
    line-height: 24px;
  }
  .dele {
    width: 40px;
    height: 40px;
    text-align: center;
    font-size: 20px;
    line-height: 46px;
    color: #444;
    margin-left: 6px;
  }
  .songs {
    margin-top: 20px;
  }

  .box-item {
    width: calc(~"100% - 20px");
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
  .item-name {
    color: #444;
    font-size: 14px;
    margin-top: 10px;
    font-weight: 600;
  }
  .item-author {
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
}
</style>