<template>
  <div class="song-discuss">
    <div class="fixed-box">
      <van-nav-bar
        left-text="评论"
        left-arrow
        @click-left="back"
        style="color:#fff"
      />
      <div class="song-info clear">
        <div class="song-img fl">
          <img
            class="auto-img"
            :src="songInfo.img"
            alt=""
          >
        </div>
        <div class="song-name fl one-text">{{songInfo.name}}</div>
      </div>
    </div>

    <div class="song-text">
      <div class="song-title">评论区</div>

      <van-loading
        v-if="hostDiscuss.length == 0"
        size="40"
        class="loading"
        vertical
      >正在为客官拼命加载中
      </van-loading>

      <div v-else>

        <div class="song-title">精彩评论</div>
        <div
          class="discuss-list clear"
          v-for="item in hostDiscuss"
          :key="item.commentId"
        >
          <div class="list-left fl">
            <img
              class="auto-img"
              :src="item.user.avatarUrl"
              alt=""
            >
          </div>
          <div class="list-right fl">
            <div class="list-name">
              <div class="name-info fl">{{item.user.nickname}}</div>
              <div class="like fr">
                {{item.likedCount}}
                <van-icon name="like-o" />
              </div>
            </div>
            <div class="list-centent">{{item.content}}</div>
          </div>
        </div>
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="我可是有底线的"
          @load="onLoad"
        >
          <div class="song-title new-list">最新评论</div>
          <div
            class="discuss-list clear"
            v-for="item in newDiscuss"
            :key="item.commentId"
          >
            <div class="list-left fl">
              <img
                class="auto-img"
                :src="item.user.avatarUrl"
                alt=""
              >
            </div>
            <div class="list-right fl">
              <div class="list-name clear">
                <div class="name-info fl">{{item.user.nickname}}</div>
                <div class="like fr">
                  {{item.likedCount}}
                  <van-icon name="like-o" />
                </div>
              </div>
              <div class="list-centent">{{item.content}}</div>
            </div>
          </div>
        </van-list>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: "Songdiscuss",

  data() {
    return {
      // 歌曲信息
      songInfo: {},

      // 精彩评论
      hostDiscuss: [],
      // 最新评论
      newDiscuss: [],

      loading: false,
      finished: false,

      // 开始截取的位置
      orderIndex: 10,

      // 截取的条数
      indexSun: 10,

      // 截取的部分条数
      listSum: [],
    };
  },

  created() {
    // 获取歌曲信息
    this.getSong();
  },

  methods: {
    // 返回
    back() {
      this.$router.go(-1);
    },

    // 获取歌曲信息
    getSong() {
      // 歌曲信息
      let data = JSON.parse(localStorage.getItem("_url"));
      this.songInfo = data.data;

      // 获取歌曲评论

      this.axios({
        method: "GET",
        url: "/comment/music",
        params: {
          id: this.songInfo.id,
          limit: 100,
        },
      })
        .then((result) => {
          

          if (result.status == 200) {
            let list = result.data;
            // 获取精彩评论
            this.hostDiscuss = list.hotComments;

            // 获取最新评论
            this.listSum = list.comments;

            this.newDiscuss = this.listSum.slice(0, this.indexSun);

            this.loading = false;
          }
        })
        .catch((err) => {
          
        });
    },

    onLoad() {
      // 异步更新数据
      setTimeout(() => {
        let data = this.listSum.slice(
          this.orderIndex,
          this.orderIndex + this.indexSun
        );

        this.orderIndex += this.indexSun;

        this.newDiscuss.push(...data);

        // 数据全部加载完成
        if (this.newDiscuss.length >= this.listSum.length) {
          this.finished = true;
        } else {
          // 加载状态结束
          this.loading = false;
        }
        
      }, 1000);
    },
  },
};
</script>

<style lang="less" scoped>
.song-discuss {
  padding-top: 134px;
  .fixed-box {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 11;
  }
  .song-info {
    padding: 10px;
    margin-bottom: 8px;
    background-color: #fff;
  }
  .song-img {
    margin-right: 10px;
    width: 60px;
    border-radius: 6px;
    overflow: hidden;
  }
  .song-name {
    width: calc(~"100% - 70px");
    line-height: 60px;
  }
  .song-text {
    padding: 10px;
  }
  .song-title {
    font-size: 12px;
    color: #444;
    height: 30px;
    line-height: 30px;
    font-weight: 600;
  }
  .new-list {
    margin-top: 10px;
  }
  .list-left {
    width: 40px;
    margin-right: 10px;
    margin-top: 10px;
    border-radius: 50%;
    overflow: hidden;
    border: 1px solid #dd1200;
  }
  .list-right {
    width: calc(~"100% - 78px");
    border-bottom: 1px solid #e8e8e8;
    padding: 10px;
  }
  .list-name {
    height: 26px;
    line-height: 26px;
    font-size: 12px;
    margin-bottom: 10px;
  }
  .name-info {
    width: 80%;
    height: 100%;
  }
  .like {
    width: 20%;
    text-align: right;
    line-height: 26px;
    > i {
      font-size: 14px;
      height: 100%;
      line-height: 26px;
    }
  }
  .list-centent {
    width: 100%;
    line-height: 22px;
  }
  .loading {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>