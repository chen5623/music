<template>
  <div class="all-song">
    <van-nav-bar
      left-text="返回"
      left-arrow
      @click-left="goPage"
      title="歌单"
      fixed
    />
    <van-tabs :sticky="true" @change="changeSongClassify" v-model="tabIndex" swipeable>
      <van-tab
        :title="item.name"
        v-for="(item, index) in songClassify"
        :key="index"
      >
        <van-loading size="24px" vertical v-if="songLists.length == 0"
          >加载中...</van-loading
        >

        <div class="song-box" v-else>
          <div
            class="box-item"
            v-for="(item, index) in songLists"
            :key="index"
            @click="gotoDetail('Songdetail', item.id)"
          >
            <div class="item-img">
              <img class="auto-img" :src="item.coverImgUrl" alt="" />
            </div>
            <div class="item-txt">{{ item.copywriter }}</div>
            <div class="item-playCount">
              <i class="bg-img"></i>
              <span class="count">{{ item.playCount }}万</span>
            </div>
          </div>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import "../assets/less/allsonglist.less";
export default {
  name: "Allsonglist",
  created() {
    // 获取歌单分类列表
    this.getSongClassify();

    //
    this.getHuayu();
  },

  data() {
    return {
      // 歌单分类
      songClassify: [],

      // tab下标
      tabIndex: 0,

      // 歌单列表
      songLists: [],
    };
  },
  methods: {
    goPage() {
      this.$router.go(-1);
    },

    // 获取歌单分类
    getSongClassify() {
      this.axios({
        method: "GET",
        url: "/playlist/hot",
        params:{
          timestamp:new Date().getTime()
        }
      })
        .then((result) => {
          
          if (result.data.code == 200) {
            result.data.tags.map(v => {
              if(v.name == '综艺'){
                v.name = '学习'
              }
            })
            this.songClassify = result.data.tags;
          }
          
        })
        .catch((err) => {
          
        });
    },

    // 跳转到歌单详情页
    gotoDetail(name, id) {
      this.$router.push({ name, params: { id } });
    },

    // 一进来就获取华语歌单
    getHuayu() {
      this.axios({
        method: "GET",
        url: "/top/playlist/highquality",
        params: {
          cat: "华语",
          limit: 20,
          timestamp:new Date().getTime()
        },
      })
        .then((result) => {
          // 

          if (result.data.code == 200) {
            result.data.playlists.map((v) => {
              v.playCount = parseInt(v.playCount / 10000);
            });

            this.songLists = result.data.playlists;
          }
        })
        .catch((err) => {
          
        });
    },

    // 切换歌单类型
    changeSongClassify(name, title) {
      this.songLists = []
      this.axios({
        method: "GET",
        url: "/top/playlist/highquality",
        params: {
          cat: title,
          limit: 20,
          timestamp:new Date().getTime()
        },
      })
        .then((result) => {
          // 
          if (result.data.code == 200) {
            result.data.playlists.map((v) => {
              v.playCount = parseInt(v.playCount / 10000);
            });

            this.songLists = result.data.playlists;
          }
        })
        .catch((err) => {
          
        });
    },
  },
};
</script>

<style lang="less" scoped>
</style>