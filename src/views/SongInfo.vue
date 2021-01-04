<template>
  <div class="song-info">
    <div class="song-nav">
      <van-nav-bar left-text="编辑歌单信息" left-arrow @click-left="goPage" />
    </div>
    <div class="next"></div>
    <div class="info-box">
      <div class="box-item clear">
        <div class="item-txt fl"><span> 更换封面 </span></div>
        <div class="item-img fr">
          <img
            class="auto-img"
            :src="songData.coverImgUrl"
          />
          <van-uploader />
        </div>
      </div>

      <div class="box-item clear">
        <van-field
          v-model="userName"
          label="名称"
          input-align="right"
          @blur="changeSongName"
        />
      </div>

      <div class="box-item clear">
        <van-field
          v-model="tags"
          label="标签"
          placeholder="推荐华语、学习等类似标签名"
          input-align="right"
          @blur="changeSongtags"
        />
      </div>

      <div class="box-item clear">
        <van-field
          v-model="description"
          label="描述"
          placeholder="暂无描述"
          input-align="right"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SongInfo",

  created() {
    this.songId = this.$route.params.id;

    this.getSongInfo();
  },
  data() {
    return {
      // 歌单id
      songId: "",
      // 歌单名称 方便修改
      userName:'',

      // 歌单简介
      description:'',
      // 歌单标签
      tags:'',

      // 歌单信息
      songData:{}
    };
  },
  methods: {
    // 返回上一级
    goPage() {
      this.$router.go(-1);
    },
    // 获取歌单详细信息
    getSongInfo() {

      this.axios({
        method:'GET',

        url:'/playlist/detail',
        params:{
          id:this.songId
        }
      }).then(result => {

        

        if(result.data.code == 200){

          // 歌单信息
          this.songData = result.data.playlist;

          this.userName = this.songData.name;

          this.description = this.songData.description;

          this.tags= this.songData.tags.join(' ');
        }

      }).catch(err => {

        
      })
    },

    // 修改歌单名称
    changeSongName() {

       // 获取token
      let idString = localStorage.getItem("__log");

      if (!idString) {
        this.$toast("请先登录,才能修改");
        return;
      }

      this.axios({
        method:'POST',
        url:`/playlist/name/update`,
        data:{
          id:this.songId,
          name:this.userName
        }
      }).then(result => {
        
        
      }).catch(err => {
        
      })
    },

    // 修改歌单标签
    changeSongtags() {
        // 获取token
      let idString = localStorage.getItem("__log");

      if (!idString) {
        this.$toast("请先登录,才能修改");
        return;
      }

      this.axios({
        method:'POST',
        url:'/playlist/tags/update',
        data:{
          id:this.songId,
          tags:this.tags
        }
      }).then(result =>{
        
      }).catch(err => {
        
      })
    }
  },
};
</script>

<style lang="less" scoped>
.song-info {
  .song-nav {
    width: 100%;
  }
  /deep/ .van-nav-bar__text,
  /deep/ .van-nav-bar .van-icon {
    color: #424242;
  }
  .next {
    height: 10px;
    background-color: #f0eeee;
  }
  .info-box {
    padding: 10px;
  }
  .box-item {
    width: 100%;
    // height: 80px;
    // padding-top: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid #e8e8e8;
    &:last-child {
      border: none;
    }
  }
  .item-txt {
    line-height: 70px;
    font-size: 16px;
  }
  .item-img {
    width: 60px;
    margin-top: 10px;
    position: relative;
  }
  /deep/ .van-uploader {
    width: 100%;
    height: 100%;

    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
  }
  /deep/ .van-uploader__wrapper,
  /deep/ .van-uploader__upload {
    width: 100%;
    height: 100%;
    margin: 0;
  }
  /deep/ .van-cell {
    padding: 0;
    line-height: 60px;
  }
}
</style>