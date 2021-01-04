<template>
  <div class="my">

    <!-- 个人信息 -->

    <div
      v-if="!myInfo.nickname"
      class="my-box clear noMy-box"
      @click="back('Myinfo',false)"
    >
      <!-- 头像 -->
      <div class="my-img fl">
        
      </div>
      <div class="my-name fl">
        <!-- 昵称 -->
        <div
          class="name"
          v-if="!myInfo.nickname"
        >未登录</div>
      </div>
      <!-- 箭头 -->
      <div class="my-icon fr">
        <van-icon name="arrow" />
      </div>
    </div>

    <div
      v-else
      class="my-box clear"
      @click="back('Myinfo',false)"
    >
      <!-- 头像 -->
      <div class="my-img fl">
        <img
          class="auto-img"
          :src="myInfo.avatarUrl"
        />
      </div>
      <div class="my-name fl">
        <!-- 昵称 -->
        <div
          class="name"
          v-if="!myInfo.nickname"
        >没登录</div>
        <div
          class="name"
          v-else
        >{{ myInfo.nickname }}</div>
        <div class="level-box">
          <!-- 等级 -->
          <div
            class="my-level"
            v-if="myInfo.nickname"
          >
            <i>Lv.{{ level }}</i>
          </div>
        </div>
      </div>
      <!-- 箭头 -->
      <div class="my-icon fr">
        <van-icon name="arrow" />
      </div>
    </div>

    <!-- 分类内容 -->
    <div class="my-classify">
      <div class="classify-item">
        <van-grid
          square
          :border="false"
        >
          <van-grid-item
            v-for="(item, index) in classIfyData"
            :key="index"
            @click="back(item.name , false)"
          >
            <van-image :src="item.img" />
            {{ item.title }}
          </van-grid-item>
        </van-grid>
      </div>
    </div>

    <!-- 我喜欢的音乐 -->
    <div
      class="my-link clear"
      @click="back('Mylike',false)"
    >
      <div class="link-img fl">
        <van-icon name="like-o" />
      </div>
      <div class="link-name fl">
        <div class="title">我喜欢的音乐</div>
        <div class="count" v-show="myInfo.nickname">{{ myMusic.length }}首</div>
      </div>
    </div>

    <!-- 歌单内容盒子 -->
    <div class="song-box">
      <van-tabs
        v-model="activeTab"
        background="#f6f6f6"
        swipeable
      >
        <van-tab title="创建歌单">
          <div class="song-list">
            <div class="song-top clear">
              <div class="song-title fl">
                创建歌单({{ creatMusic.length }}个)
              </div>
              <div class="song-next fr">
                <div class="add">
                  <van-icon
                    name="plus"
                    @click="isMusicSet(1)"
                  />
                </div>
                <div class="ellipsis">
                  <van-icon
                    name="ellipsis"
                    @click="isAddmusic"
                  />
                </div>
              </div>
            </div>

           <div v-if="!myInfo.nickname"></div>

            <!-- 歌单内容列表 -->
            <div
              class="song-centent"
              v-else
            >
              <div
                class="centent-box clear"
                v-for="(item, index) in creatMusic"
                :key="index"
                @click="goSongDateil(item.id)"
              >
                <div class="box-img fl">
                  <img
                    class="auto-img"
                    :src="item.coverImgUrl"
                    alt=""
                  />
                </div>
                <div class="box-title fl">
                  <div class="title-item">
                    <div class="title-name one-text">{{ item.name }}</div>
                    <div class="music-count">{{ item.trackCount }}首</div>
                  </div>
                  <div
                    class="item-set fr"
                    @click.stop="isSongtxt(item)"
                  >
                    <van-icon name="ellipsis" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </van-tab>
        <van-tab title="收藏歌单">
          <div class="song-list">
            <div class="song-top clear">
              <div class="song-title song-txt fl">
                收藏歌单({{ stationMusic.length }}个)
              </div>
              <!-- <div class="song-next fr">
                  <div class="ellipsi"><van-icon name="ellipsis" /></div>
                </div> -->
            </div>

            <!-- 歌单内容 -->
            <div class="song-centent">
              <div
                class="centent-box clear"
                v-for="(item, index) in stationMusic"
                :key="index"
                @click="goSongDateil(item.id)"
              >
                <div class="box-img fl">
                  <img
                    class="auto-img"
                    :src="item.coverImgUrl"
                    alt=""
                  />
                </div>
                <div class="box-title fl">
                  <div class="title-item">
                    <div class="title-name name-size">{{ item.name }}</div>
                    <div class="music-count">{{ item.trackCount }}首</div>
                  </div>
                  <div
                    class="item-set fr"
                    @click.stop="isSongtxt(item)"
                  >
                    <van-icon name="ellipsis" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </van-tab>
      </van-tabs>
    </div>

    <van-popup
      v-model="isshow"
      position="bottom"
      :style="{ height: '30%' }"
      :round="true"
    >
      <div class="creat-box">
        <div class="box-item">
          <span>我创建的歌单 ({{ creatMusic.length }})</span>
        </div>
        <div
          class="Newsong"
          @click="isMusicSet"
        >
          <div class="icon"><span>+</span></div>
          <div class="creatSong">创建新歌单</div>
        </div>

        <div
          class="Newsong"
          @click="back('Changesonglist',false)"
        >
          <div class="admin">
            <van-icon name="notes-o" />
          </div>
          <div class="creatSong">歌单管理</div>
        </div>
      </div>
    </van-popup>

    <van-popup
      v-model="isSongset"
      position="bottom"
      :round="true"
      :style="{ height: '30%' }"
    >
      <div class="creat-box">
        <div class="box-item">
          <span>歌单 {{ isSongname }}</span>
        </div>

        <div
          class="Newsong"
          @click="removeSonglist"
        >
          <div class="admin">
            <van-icon name="delete" />
          </div>
          <div class="creatSong">删除</div>
        </div>
      </div>
    </van-popup>

    <!-- @touchmove.prevent 禁止触摸滑动 -->
    <!-- @mousewheel.prevent 禁止滚轮滑动 -->
    <div
      class="current-item"
      v-show="iscreat"
      @mousewheel.prevent
      @touchmove.prevent
    >
      <div
        class="currentMusic-box"
        @click.capture="isMusicSet"
      ></div>
      <div class="filed">
        <div class="currentMusic">
          <div class="currentMusic-title">新建歌单</div>
        </div>
        <div class="currentMusic-ipt">
          <input
            class="ipt"
            v-model="newSongName"
            type="text"
            placeholder="请输入歌单标题"
          />
        </div>
        <div class="box-check">
          <input
            type="checkbox"
            v-model="isSong"
          />设置为隐私歌单<span class="ipt-txt fr">0/40</span>
        </div>

        <div class="box-btn">
          <button @click.stop="isMusicSet">取消</button>
          <button
            type="submit"
            @click="newSonglist"
          >提交</button>
        </div>
      </div>
    </div>
  </div>

</template>



<script>
import "../assets/less/my.less";
export default {
  name: "My",

  data() {
    return {
      // 我的等级
      level: 0,
      // 我的信息
      myInfo: {},
      // 创建歌单标签
      iscreat: false,
      // 歌单设置
      isSongset: false,
      // 歌单设置
      isshow: false,
      // 导航栏切换下标
      activeTab: 0,

      item: "",
      // 歌单信息名称
      isSongname: "",
      // 歌单id
      isSongId: "",

      // 我喜欢的音乐
      myMusic: {},

      // 创建的歌单
      creatMusic: [],

      // 收藏的歌单
      stationMusic: [],

      // 分类数据
      classIfyData: [
        {
          title: "推荐音乐",
          name: "Localmusic",
          img: require("../assets/images/local-music.png"),
          //方法
        },
        {
          title: "最近播放",
          name: "Recentplay",
          img: require("../assets/images/pay.png"),
        },
        {
          title: "我的关注",
          img: require("../assets/images/collect.png"),
        },
        {
          title: "我的电台",
          img: require("../assets/images/station.png"),
        },
      ],

      // 新建歌单名称
      newSongName: "",

      isSong: false,
    };
  },

  created() {
    // 获取我的信息
    this.getMyInfo();
  },

  methods: {
    // 跳转
    back(name, flag) {
      //

      if (flag) {
        this.$router.push({ name, params: { id: this.isSongId } });
      } else {
        if (!localStorage.getItem("__log") && name != 'Localmusic' ) {
          return this.$router.push({ name: "Login" });
        }

        if(!name) {
         return this.$toast('稍后完善')
          
        }
        this.$router.push({ name });
      }
      this.isSongset = false;

      this.isshow = false;
    },

    // 跳转歌单详情页
    goSongDateil(id) {
      this.$router.push({ name: "Songdetail", params: { id } });
    },

    // 获取我的信息
    getMyInfo() {
      // 获取token
      let idString = localStorage.getItem("__log");
      let i = []
      if(!localStorage.getItem('_remove')){
        localStorage.setItem('_remove',i)
      }

      // 选择是否需要去登录
      if (!idString) {
        this.$dialog
          .confirm({
            title: "温馨提示",
            message: "您未登录，是否前往登录",
          })
          .then(() => {
            // on confirm
            this.$router.push({ name: "Login" });
          })
          .catch(() => {
            // on cancel
            this.$toast("未登录，无法查询信息");
          });
        return;
      }

      this.$toast.loading({
        message: "加载中..",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        method: "GET",
        url: "/user/detail",
        params: {
          uid: idString,
        },
      })
        .then((result) => {
          this.myInfo = result.data.profile;

          this.$toast.clear();

          this.level = result.data.level;
          localStorage.setItem("_my", JSON.stringify(this.myInfo));

          let arr = [];
          if(!localStorage.getItem('_remove')){

            localStorage.setItem('_remove',JSON.stringify(arr));
          }
          //
          // 获取我的音乐
          this.getMymusic();

          this.getMylike();
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },

    // 获取我的音乐
    getMymusic() {
      // 获取token
      let idString = localStorage.getItem("__log");

      if (!idString) {
        this.$toast("请先登录");
        return;
      }

      this.stationMusic = JSON.parse(localStorage.getItem('_songList'));

      this.creatMusic = JSON.parse(localStorage.getItem('_createList'))
    },
    

    // 显示创建歌单设置
    isAddmusic() {
      this.isshow = !this.isshow;
    },

    // 创建歌单标签
    isMusicSet() {
      this.iscreat = !this.iscreat;

      this.isshow = false;
    },

    // 显示歌单信息
    isSongtxt(item) {
      this.isSongset = !this.isSongset;

      this.item = item;
      this.isSongname = item.name;

      this.isSongId = item.id;
    },

    // 删除歌单
    removeSonglist() {
      this.$toast('接口原因，不能删除歌单')
      
      let arr = JSON.parse(localStorage.getItem('_remove'));

      arr.push(this.isSongname);

      localStorage.setItem('_remove',arr);
    },

    // 新建歌单
    newSonglist() {
      // 判断输入的是否为空或输入空格
      if (
        this.newSongName.length <= 0 ||
        new RegExp("^[ ]+$").test(this.newSongName)
      ) {
        this.$toast("歌单名称不能为空");
        return;
      }

      this.axios({
        method: "POST",

        url: "/playlist/create",

        data: {
          name: this.newSongName,
        },
      })
        .then((result) => {})
        .catch((err) => {});
    },

    // 我喜欢的音乐
    getMylike() {
      if (!JSON.parse(localStorage.getItem("_like"))) {
        let arr = [];
        localStorage.setItem("_like", JSON.stringify(arr));
      }
      if (!localStorage.getItem("__log")) {
        this.$toast("您还没登录，不能查看");
        return;
      }
      this.myMusic = JSON.parse(localStorage.getItem("_like"));
    },
  },
};
</script>

<style lang="less" scoped>
</style>