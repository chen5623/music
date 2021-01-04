<template>
  <div class="song-list">
    <van-nav-bar
      :left-text="count"
      left-arrow
      @click-left="back"
    />
    <div class="list-box">
      <!-- 歌单列表 -->
      <div class="list-item clear" v-for="item in creatMusic" :key="item.id">
        <div class="item-left fl">
          <input type="checkbox" v-model="item.ischeck" @change="changeipt" />
        </div>
        <div class="item-content fl">
          <div class="item-img">
            <img class="auto-img" :src="item.coverImgUrl" />
          </div>
          <div class="item-txt">
            <div class="item-name">
              <span>{{ item.name }}</span>
            </div>
            <div class="item-count">{{ item.trackCount }}首</div>
            <div
              class="song-remove fr"
              v-show="item.ischeck"
              @click="removeSonglist(1, item.id)"
            >
              删除
            </div>
          </div>
        </div>
      </div>
      <van-button
        type="primary"
        block
        v-show="isAlllist"
        @click="removeSonglist(2)"
        >删除多个歌单</van-button
      >
    </div>
  </div>
</template>

<script>
export default {
  name: "Changesonglist",
  data() {
    return {
      // 我喜欢的音乐
      myMusic: {},
      // 创建的歌单
      creatMusic: [],

      // 收藏的歌单
      stationMusic: [],

      // 选择数量
      count: "已选择0项",

      // 是否删除多项
      isAlllist: false,
    };
  },

  created() {
    this.getMymusic();
  },

  methods: {
    // 返回上一级
    back() {
      this.$router.go(-1);
    },
    // 获取用户歌单数据
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
          timestamp:new Date().getTime()
        },
      })
        .then((result) => {
          // 
          if (result.data.code == 200) {
            this.myMusic = result.data.playlist[0];

            result.data.playlist.map((v) => {
              // 判断是否被选中
              v.ischeck = false;

              if (v.ordered) {
                // 收藏歌单
                this.stationMusic.push(v);
              } else {
                // 创建歌单
                this.creatMusic.push(v);
              }
            });

            // 除去我喜欢的音乐
            this.creatMusic.splice(0, 1);

            
          }
        })
        .catch((err) => {
          
        });
    },

    // 删除歌单
    removeSonglist(index, id) {
      if (index == 1) {
        id = id + "";
      } else if (index == 2) {
        let arr = [];
        this.creatMusic.map((v) => {
          if (v.ischeck) {
            arr.push(v.id);
          }
        });
        id = arr.join(",");
        // 
      }

      this.axios({
        method: "POST",

        url: "/playlist/delete",

        data: {
          id,
          timestamp:new Date().getTime()
        },
      })
        .then((result) => {
          
          
        })
        .catch((err) => {
          
        });
    },

    // 选择歌单
    changeipt() {
      let count = 0;
      this.creatMusic.map((v) => {
        if (v.ischeck) {
          count++;
        }
      });

      if (count >= 2) {
        this.isAlllist = true;
      } else {
        this.isAlllist = false;
      }

      this.count = `已选择${count}项`;
    },
  },
};
</script>

<style lang="less" scoped>
.song-list {
  /deep/ .van-nav-bar__text,
  /deep/ .van-nav-bar .van-icon {
    color: black;
  }
  .list-box {
    padding: 10px;
  }
  .list-item {
    padding: 10px 0;
    // height: 60px;
    border-bottom: 1px solid #e8e8e8;
  }
  .item-left {
    width: 30px;
    margin-top: 20px;
    margin-left: 10px;
  }
  .item-content {
    display: flex;
    width: calc(~"100% - 40px");
  }
  .item-img {
    flex: 2;
    margin-right: 10px;
  }
  .item-txt {
    flex: 7;
    margin-top: 16px;
    position: relative;
  }
  .item-name {
    margin-bottom: 6px;
  }
  .song-remove {
    width: 40px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    background-color: #e8e8e8;
    position: absolute;
    right: 0px;
    top: 0px;
  }
  /deep/ .van-button--primary {
    border-color: #dd1210;
    background-color: #dd1210;
    margin-top: 10px;
  }
}
</style>