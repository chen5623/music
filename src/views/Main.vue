<template>
  <div class="main">
    <div class="main-nav">
      <van-nav-bar fixed>
        <template #left>
          <van-icon name="apps-o" @click="toggleSet"/>
        </template>
        <template #title>
          <van-tabbar route :fixed="false" active-color="#dd1210">
            <van-tabbar-item
              class="main-title"
              replace
              :to="item.path"
              v-for="(item, index) in mainData"
              :key="index"
              @click="toggleTab(index)"
            >
              {{ item.title }}
            </van-tabbar-item>
          </van-tabbar>
        </template>
        <template #right>
          <van-icon name="search" @click="goPage('Search')" />
        </template>
      </van-nav-bar>
    </div>
    <Controls></Controls>
    <!-- 二级路由 -->
    <div>
      <router-view></router-view>
    </div>

    <div class="box-set" :style="`left:${left}%`" @mousewheel.prevent @touchmove.prevent>
      <div class="bg-box" @click="toggleSet"></div>
      <div class="set-list">
        <div class="set">设置</div>
        <div class="set-item">
          <van-cell :title="item.title" is-link v-for="(item,index) in setList" :key="index" @click="Fn(item.method)" />
        </div>
        <div class="bottom">
          <div @click="exit">
            <div class="out fr">退出</div>
            <div class="bottom-img fr">
              <img class="auto-img" src="../assets/images/out.png" alt="">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Controls from "../components/Controls.vue";
import { mapState , mapActions } from "vuex";

export default {
  name: "Main",
  components: {
    Controls,
  },
  computed:{
    ...mapState(["audioSrc", "audioElement", "isPlaySong","orderIndex","songListactive","classify"]),
  },

  data() {
    return {
      // 导航下标
      activeIndex: 0,
      // 播放列表
      playList: true,

      // tab数据
      mainData: [
        {
          title: "我的",
          name: "My",
          path: "/main/my",
        },
        {
          title: "发现",
          name: "Home",
          path: "/main/home",
        },
        // {
        //   title: "视频",
        //   name: "Video",
        //   path: "/main/video",
        // },
      ],

      // 偏移量
      left: -100,

      setList:[
        {title:'个人中心',method:'goPage'},
        {title:'账号设置',method:'set'},
      ],

      bannerType:'',

    };
  },

  created(){
    this.createList();
    this.getBanner();
    this.classIfy();
  },

  methods: {

     // for循环的方法
    Fn(method) {
      this[method]();
    },

     // 获取轮播图数据
    getBanner() {
      
      // 监听手机端类型
      let u = navigator.userAgent;
      let isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1; //android终端
      let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      let isipad = u.indexOf("iPad");
      // 轮播图的数据根据设置类型来获取
      this.bannerType = isAndroid ? 1 : isiOS ? 2 : isipad > -1 ? 3 : 0;
      let arr = []
      if(!localStorage.getItem('_banner')){
        localStorage.setItem('_banner',JSON.stringify(arr));
      }else {
        arr = JSON.parse(localStorage.getItem('_banner'));
      }
      // 0 pc端
      // 1 安卓
      // 2 iPhone
      // 3 ipad
      this.axios({
        method: "GET",
        url: "/banner",
        params: {
          type: this.bannerType,
          timestamp: new Date().getTime(),
        },
      })
        .then((result) => {
          
           
          // 获取数据
          let banner = result.data.banners;
          if(arr.length != 0){
            for(let i = 0 ; i < arr.length ; i++){
              if(arr[i].bannerId == banner[i].bannerId) return
            }
          }
          this.$store.commit("bannerList" ,banner);
          localStorage.setItem('_banner',JSON.stringify(banner));

          
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },

    // 精品歌单推荐
    classIfy() {
      this.axios({
        method: "GET",
        url: "/top/playlist/highquality",
        params: {
          timestamp: new Date().getTime(),
        },
      })
        .then((result) => {
          

          if (result.data.code == 200) {
            

            let list = result.data.playlists;
            list.map((v) => {
              v.playCount = parseInt(v.playCount / 10000);
            });

            localStorage.setItem('_classList',JSON.stringify(list));
            let index = parseInt(
              Math.random() * list.length - 3
            );

            list = list.slice(index , index + 3);

            this.$store.commit('classify',list);

          }
        })
        .catch((err) => {
          
        });
    },

    set(){
      this.$toast('接口原因，稍后完善')
    },

    // tab切换
    toggleTab(index) {
      if (this.activeIndex == index) {
        return;
      }
      this.activeIndex = index;
    },

    goPage(name){
      if(!name){
        name = 'Myinfo'
      }
      this.$router.push({name});
    },

    // 播放列表和最近播放列表
    createList(){
      let arr = []
      if(!localStorage.getItem('_play')){
        localStorage.setItem('_play',JSON.stringify(arr))
      }

      if(!localStorage.getItem('_playList')){
        localStorage.setItem('_playList',JSON.stringify(arr))
      }

      if(!localStorage.getItem('_banner')){
        localStorage.setItem('_banner',JSON.stringify(arr));
      }

      if(!localStorage.getItem('_List')){
        localStorage.setItem('_List',JSON.stringify(arr))
      }

      if(!localStorage.getItem('_songList')){
        localStorage.setItem('_songList',JSON.stringify(arr))
      }

       if(!localStorage.getItem('_createList')){
        localStorage.setItem('_createList',JSON.stringify(arr))
      }


    },

   

    // 显示设置
    toggleSet(){
      if(this.left == -100){
        // 
        this.left = 0
      }else if(this.left == 0) {
        this.left = -100
      }
    },

    // 退出登录
    exit(){
      let arr = '';
      localStorage.setItem('__log',arr);
      this.$router.push({name:'Login'})

      this.left = -100;
    }
  },
};
</script>

<style lang="less" scoped>
.main {
  padding: 46px 0px 60px;

  .main-title {
    width: 60px;
    font-size: 16px;
    font-family: "华文";
    font-weight: 500;
  }
  /deep/ .van-nav-bar .van-icon {
    font-size: 20px;
    color: black;
  }
  .main-nav {
    overflow: hidden;
  }
  .audio-music {
    width: 100%;
    height: 60px;
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
    margin-top: 10px;
    font-size: 14px;
    font-weight: 600;
  }
  .music-item {
    margin-right: 6px;
    margin-left: 6px;
  }
  .item-img {
    width: 100%;
    margin: 14px auto 0;
  }
  /deep/ .van-nav-bar__content {
    overflow: hidden;
  }
  .box-set {
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
    transition: left .2s;
  }
  .bg-box {
    position: absolute;
    top: 0;
    left: 0;
    width:100% ;
    height: 100%;
    background-color: rgba(83, 83, 83, 0.1);
  }
  .set-list {
    position: absolute;
    top: 0;
    left: 0;
    width: 90%;
    height: calc(~"100% - 20px");
    background-color: #fff;
    z-index: 10;
    border-right: 1px solid #e8e8e8;
    padding: 10px;
  }
  .bottom {
    position: absolute;
    bottom: 4px;
    right: 0px;
    width: calc(~"100% - 16px");
    border-top: 1px solid #e8e8e8;
    padding: 4px 8px;
    background-color: #fff;
  }
  .bottom-img {
    width: 30px;
  }
  .out {
    line-height: 30px;
  }
  .set{
    font-size: 16px;
    color: #444;
    height: 30px;
    line-height: 30px;
    margin-bottom: 10px;
    border-bottom: 1px solid #e8e8e8;
  }
  /deep/ .van-cell {
    padding: 10px 0;
    height: 50px;
    border-bottom: 1px solid #e8e8e8;
    margin-bottom: 10px;
    
  }

}
</style>