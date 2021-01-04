<template>
  <div class="ranking">
    <van-nav-bar left-text="排行榜" left-arrow @click-left="back" fixed />
    <div class="ranking-box">
      <!-- 榜单推荐 -->
      <div class="ranking-local">
        <div class="local-text">榜单推荐</div>
        <div class="local-list">
          <div
            class="list-item"
            v-for="item in this.loaclRankingList"
            :key="item.id"
            @click="goSongDateil(item.id)"
          >
            <div class="item-img">
              <div class="item-time">{{item.updateFrequency}}</div>
              <img
                class="auto-img"
                :src="item.coverImgUrl"
                alt=""
              />
            </div>
            <div class="item-txt">{{item.name}}</div>
          </div>
        </div>
      </div>

      <!-- 官方榜单 -->
      <div class="ranking-official">
        <div class="official">全部榜单</div>
        <div class="official-list">

          <div class="item-box" v-for="item in officialList" :key="item.id" @click="goSongDateil(item.id)">

            <div class="img-box">
              <div class="item-time">{{item.updateFrequency}}</div>
              <img class="auto-img" :src="item.coverImgUrl">
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: "Rankings",

  data() {
    return {
      // 榜单推荐
      loaclRankingList: [],

      // 官方榜
      officialList: [],
    };
  },

  created() {
    // 排行榜数据
    this.getRankingList();
  },

  methods: {
    back() {
      this.$router.go(-1);
    },

    // 获取排行榜榜单
    getRankingList() {
      // 开启加载提示
      this.$toast.loading({
        message: "加载中..",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        method: "GET",
        url: "/toplist",
        params: {
          // items: new Date().getTime(),
        },
      })
        .then((result) => {
          this.$toast.clear();
          

          if (result.data.code == 200) {
            let list = result.data.list;

            // 官方榜
            this.officialList = list;

            list.map((v) => {
              // 所有的榜id

              // 推荐榜
              if (
                v.name == "云音乐古风榜" ||
                v.name == "云音乐民谣榜" ||
                v.name == "网易原创歌曲榜"
              ) {
                this.loaclRankingList.push(v);
              }
            });
          }
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },
    // 跳转歌单详情页
    goSongDateil(id) {
      this.$router.push({ name: "Songdetail", params: { id } });
    },
  },
};
</script>

<style lang="less" scoped>
.ranking {
  padding-top: 46px;
  .ranking-box {
    padding: 10px;
  }
  .local-text {
    font-size: 16px;
    color: #444;
    margin-bottom: 10px;
    font-weight: 600;
  }
  .local-list {
    display: flex;
    > div {
      margin-right: 10px;
      flex: 1;
      &:last-child {
        margin-right: 0px;
      }
    }
  }
  .item-img {
    border-radius: 6px;
    overflow: hidden;
    position: relative;
  }
  .item-time {
    position: absolute;
    font-size: 12px;
    bottom: 4px;
    left: 6px;
    color: #fff;
  }
  .item-txt {
    font-size: 12px;
    color: #444;
    width: 100%;
    margin-top: 6px;
  }

  .ranking-official {
    margin-top: 40px;
  }
  .official {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 10px;
  }
  .official-list {
    display: flex;
    flex-wrap: wrap;
  }
  .item-box {
    width: calc(~"33.3333% - 7px");
    margin-bottom: 10px;
    margin-right: 10px;
    &:nth-child(3n) {
      margin-right: 0;
    }
  }
  .img-box {
    position: relative;
    border-radius: 6px;
    overflow: hidden;
  }
}
</style>