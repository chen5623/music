<template>
  <div class="info-box">
    <van-nav-bar
      left-arrow
      @click-left="back"
      fixed
    />
    <div class="box">
      <div class="box-bg">
        <img class="auto-img" :src="userInfo.backgroundUrl" alt="">
      </div>
      <div class="user-info">
        <div class="info-img">
          <img class="auto-img" :src="userInfo.avatarUrl" alt="">
        </div>
        <div class="info-name">{{userInfo.nickname}}</div>
      </div>
      <div class="info-home">
        <van-tabs v-model="active" :swipeable="true">
          <van-tab title="主页">
            <div class="my_like clear" @click="goPage('Mylike','',true)" >
              <div class="like-img fl">
                <img class="auto-img" src="../assets/images/like.png" alt="">
              </div>
              <div class="like-name fl">
                <div class="like-text">我喜欢的音乐</div>
                <div class="like-count">{{likeList.length}}首</div>
              </div>
            </div>

            <div class="song-title">创建的歌单</div>
            <div class="my_like clear" v-for="item in createSong " :key="item.id" @click="goPage('Songdetail',item.id,false)">
              <div class="create-img fl">
                <img class="auto-img" :src="item.coverImgUrl" alt="">
              </div>
              <div class="like-name fl">
                <div class="like-text">{{item.name}}</div>
                <div class="like-count">{{ item.trackCount }}首</div>
              </div>
            </div>

            <div class="song-title">收藏的歌单</div>
            <div class="my_like clear" v-for="item in stationMusic " :key="item.id" @click="goPage('Songdetail',item.id,false)">
              <div class="create-img fl">
                <img class="auto-img" :src="item.coverImgUrl" alt="">
              </div>
              <div class="like-name fl">
                <div class="like-text one-text">{{item.name}}</div>
                <div class="like-count">{{ item.trackCount }}首</div>
              </div>
            </div>

          </van-tab>
          <van-tab title="动态">内容 2</van-tab>
         
        </van-tabs>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name:'Myinfo',

    data(){
      return {
        // 用户信息
        userInfo:{},

        // 索引
        active:0,

        // 喜欢的音乐
        likeList:[],

        // 创建的歌单
        createSong:[],

        stationMusic:[]
      }
    },
    created(){
      // 获取用户数据
      this.getUserInfo();
    },

    methods:{
      back(){
        this.$router.go(-1);
      },

      goPage(name,id,falg){
        
        if(falg){

          this.$router.push({name})
        }else {
          this.$router.push({name,params:{id}})
        }
      },

      // 获取用户数据
      getUserInfo(){
        // 用户信息
        this.userInfo = JSON.parse(localStorage.getItem('_my'));
        // 喜欢的歌曲
        this.likeList = JSON.parse(localStorage.getItem('_like'));
        // 创建的歌单
        this.createSong = JSON.parse(localStorage.getItem('_songList'));
        // 收藏的歌单
        this.stationMusic = JSON.parse(localStorage.getItem('_List'));
        
      }
    }
  }
</script>

<style lang="less" scoped>
.info-box {
  /deep/ .van-nav-bar {
    background-color: rgba(199, 199, 199, 0.2);
  }
  .box {
    position: relative;
  }
  .box-bg {
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    height: 280px;
    overflow: hidden;
    z-index: -100;
    &::after {
      content: '';
      clear: both;
      display: block;
      width: 100%;
      height: 280px;
      position: absolute;
      top: 0;
      left: 0;
      background-color: rgba(31, 30, 30, 0.2);
    }
  }
  /deep/ .van-hairline--bottom::after {
    border: none;
  }
  .user-info {
    padding-top:160px ;
    width: 100%;
  }
  .info-img {
    width: 60px;
    border-radius: 50%;
    overflow: hidden;
    margin-left: 40px;
  }
  .info-name {
    color: #fff;
    font-size: 14px;
    font-weight: 600px;
    margin-top: 10px;
    text-indent: 26px;
  }
  .info-home {
    width: 100%;
    height: 100px;
    background-color: #fff;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    margin-top: 18px;
  }
  .my_like {
    margin-top: 8px;
    width: 100%;
    
  }
  .like-img {
    width: 60px;
    height: 60px;
    margin: 0 10px;
    background-color: #e8e8e8;
    border-radius: 10px;
    overflow: hidden;
    >img {
      width: 20px;
      margin: 30% auto;
    }
  }
  .like-name {
    width: calc(~"100% - 80px");
    >div {

      height: 30px;
      line-height: 30px;
    }
  }
  .song-title {
    height: 30px;
    line-height: 30px;
    margin: 20px 10px 10px;
  }
  .create-img {
    width: 60px;
    margin: 0 10px;
  }
  /deep/ .van-tabs__content {
    padding: 10px;
  }
}
</style>