<template>
  <div class="newest">
    <van-nav-bar
      left-text="返回"
      title="华语排行榜歌手"
      left-arrow
      @click-left="back"
      fixed
    />

    <div class="newest-box">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :immediate-check="false"
      >
        <div
          class="list-box clear"
          v-for="(item, index) in singerList"
          :key="index"
          @click="goSinger(item.id)"
        >
          <div
            class="list-count fl"
            :class="item.isTopthree ? 'active' : ''"
          >
            {{ index + 1 }}
          </div>
          <div class="list-img fl">
            <img
              class="auto-img"
              :src="item.img1v1Url"
              alt=""
            />
          </div>

          <div class="list-info fl">
            <div class="list-name">{{ item.name }}</div>
            <div class="score">热度:{{ item.score }}</div>
          </div>
        </div>
      </van-list>
    </div>
  </div>
</template>

<script>
export default {
  name: "Newest",

  data() {
    return {
      // 华语歌手排行榜
      singerList: [],

      loading: false,

      finished: false,

      // 全部数据
      allSingerList: [],

      // 裁切的个数
      sliceCount: 10,

      // 开始裁切的位置
      sliceIndex: 10,
    };
  },

  created() {
    this.getNewSong();
  },

  methods: {
    // 返回
    back() {
      this.$router.go(-1);
    },
    // 获取歌手榜
    getNewSong() {
      // 开启加载提示
      this.$toast.loading({
        message: "加载中..",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        method: "GET",
        url: "/toplist/artist",
      })
        .then((result) => {
          this.$toast.clear();
          // 
          // 前三名做标记
          if (result.data.code == 200) {
            for (let i = 0; i < 3; i++) {
              result.data.list.artists[i].isTopthree = true;
            }
          }
          // 赋值
          this.allSingerList = result.data.list.artists;

          this.singerList = this.allSingerList.slice(0, this.sliceCount);

          // 不加载
          this.loading = false;
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },

    onLoad() {
      setTimeout(() => {
        let data = this.allSingerList.slice(
          this.sliceIndex,
          this.sliceIndex + this.sliceCount
        );

        // 每次加裁切的个数
        this.sliceIndex += this.sliceCount;

        // 转成对象往数组后面插入
        this.singerList.push(...data);

        // 数据全部加载完成
        if (this.singerList.length >= this.allSingerList.length) {
          this.finished = true;
        } else {
          // 加载状态结束
          this.loading = false;
        }
      }, 1000);
    },

    // 歌手详情页
    goSinger(id) {
      this.$router.push({ name: "Singerdetail", params: { id } });
    },
  },
};
</script>

<style lang="less" scoped>
.newest {
  padding-top: 46px;
  .box-txt {
    padding: 0 10px;
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    font-weight: 600;
    margin: 10px 0;
  }
  .newest-box {
    padding: 10px;
    margin-top: 10px;
  }
  .list-box {
    margin-bottom: 10px;
  }
  .list-count {
    width: 30px;
    font-size: 16px;
    text-align: center;
    line-height: 81px;
    &.active {
      font-size: 22px;
      color: #dd1200;
    }
  }
  .list-img {
    width: 100px;
    margin: 0 10px;
  }
  .list-info {
    width: calc(~"100% - 150px");
    line-height: 40px;
  }
  .list-name {
    font-size: 16px;
    font-weight: 600;
  }
  .score {
    font-size: 14px;
    color: #555;
  }
}
</style>