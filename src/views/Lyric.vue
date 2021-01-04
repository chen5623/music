<template>
  <div class="lyric">
    <div class="song-img">
      <img
        :src="song.img"
        alt=""
      />
      <div class="imgs"></div>
    </div>
    <div class="content">
      <van-nav-bar
        :left-text="song.name"
        left-arrow
        @click-left="back"
      />
      <div class="song-txt" v-if="isImg" >
        <div class="img" @click="toggleImgorlyric" :style="{transform: musicRotate}">
          <img class="auto-img" :src="song.img" alt="">
        </div>
      </div>

      <div class="song-txt" v-else  @click="toggleImgorlyric">
        <ul
          class="txt-box"
          v-if="lyricsObjArr.length == 0"
        >
          <li style="color:#fff">正在搜索歌词</li>
        </ul>
        <ul
          class="txt-box"
          ref="lyricUL"
          :style="{transform:`translateY(${170-32 * (lyricIndex + 1)}px)`}"
          v-else
        >
          <li
            class="song-lyric one-text"
            v-for="(item, index) in lyricsObjArr"
            :key="item.uid"
            :style="{ color: lyricIndex === index ? ' #fff' : '#333' }"
            :data-index="index"
            ref="lyric"
          >
            {{ item.lyric }}
          </li>
        </ul>
      </div>

      <div class="song-set">
        <div class="set-top">
          <van-icon
            :name="islike ? 'like' : 'like-o'"
            :color="islike ? 'red' : '#fff'"
            @click="likeSong"
          />
          <van-icon name="chat-o" @click="goPage" />
        </div>
        <div class="set-range">
          <div class="newtime fl">{{ audioTime }}</div>
          <div class="slide-box">
            <div
              class="slide"
              ref="slide"
            >
              <div
                class="progress"
                ref="progress"
                @touchstart="touchProgress"
                @touchend="touChend"
              >
                <div
                  class="progress-active"
                  :style="{ width: width + '%', backgroundColor: '#e4393c' }"
                ></div>
              </div>
              <div
                class="mask"
                ref="mask"
                :style="{ left: left + '%' }"
                @touchstart="touchMask"
                @touchmove="moveMask"
                @touchend="endMask"
              ></div>
            </div>
          </div>
          <div class="time fr">{{ song.time }}</div>
        </div>

        <div class="song-bottom">
          <div @click="toggleOrderIndex">
            <img :src="orderIndex ? require('../assets/images/play2.png') : require('../assets/images/play4.png')" />
          </div>
          <div @click="toggleList(true)">
            <img
              src="../assets/images/loast.png"
              alt=""
            />
          </div>
          <div @click="toggleSong">
            <img :src="isPlaySong ? ispauseImg : ispalyImg" />
          </div>
          <div @click="toggleList(false)">
            <img
              src="../assets/images/load.png"
              alt=""
            />
          </div>
          <div @click="toggleisSonglist">
            <img
              src="../assets/images/list.png"
              alt=""
            />
          </div>
        </div>
      </div>
    </div>

    <div
      class="bg"
      v-show="isSonglist"
    >
      <div
        class="bg-box"
        @click="toggleisSonglist"
      ></div>
      <div class="song-list">
        <div class="play-list clear">
          <div class="play-left fl">播放列表</div>
          <div class="play-right fl">
            <van-icon name="delete"  @click="removeAllList"/>
          </div>
        </div>
        <div class="list-box">
          <div class="list-top">
            <div
              class="box-item clear"
              v-for="(item,index) in playList"
              :key="item.id"
             
            >
              <div
                class="item-left fl"
                :class="{active: songListactive == index}"
              >
                <div class="item-name"  @click="getMusic(item)">{{item.name}}</div>
              </div>
              <div class="item-right fl" @click="removeSonglist(item.id)" >
                <van-icon name="cross" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/less/lyric.less";
import { mapState } from "vuex";
export default {
  name: "Lyric",

  computed: {
    ...mapState([
      "audioElement",
      "audioTime",
      "isPlaySong",
      "orderIndex",
      "songListactive",
      'isEnd'
    ]),
  },

  data() {
    return {
      
      // 歌曲信息
      song: {},

      url: "",

      // 当前播放歌曲id
      id: "",

      ispalyImg: require("../assets/images/play3.png"),

      ispauseImg: require("../assets/images/pause3.png"),

      //激活进度条的宽度
      width: 0,

      //slide偏移左边的距离
      slideOffsetLeft: 0,

      //记录开始点击滑块的坐标
      x: 0,

      //记录mask宽度
      maskWidth: 0,

      //记录progress的宽度
      progressWidth: 0,

      //mask移动的left
      left: 0,

      // 歌词数组
      lyricsObjArr: [],

      // 歌词激活类名
      lyricIndex: 0,

      // 点击喜欢歌曲
      islike: false,

      // 播放列表
      playList: [],

      // 是否显示播放列表
      isSonglist: false,

      // 当前播放的歌曲图片
      audioImg: "",

      // 定时器
      timeInters: null,

      // 显示歌曲图片
      isImg:true,

      // 角度初始值
      musicNum:0,

      // 旋转角度
      musicRotate:"rotate(" + 0 + "deg)",

      // 是否过渡
      isTransition:true,
    };
  },

  created() {
    // 歌词播放
    this.getcurrentSong(null,false);

    this.$nextTick(() => {
      //获取进度条的left值
      this.slideOffsetLeft = this.$refs.slide.offsetLeft;

      //获取进度条的宽度
      this.progressWidth = this.$refs.progress.clientWidth;

      //获取滑块的宽度
      this.maskWidth = this.$refs.mask.clientWidth;

      this.getSongLyric();

      // 播放列表
      this.getPlayList();

      // 歌曲信息
      this.getAudioUrl();

      // 播放歌曲实时时间
      this.getSongTime();

    });
  },

  methods: {

    // 返回上一级
    back() {
      clearInterval(this.timeInters);
      this.timeInters = null;
      this.$router.go(-1);
    },

    // 歌曲评论
    goPage(){
      this.$router.push({name:'Songdiscuss'})
    },
    // 获取当前播放的歌曲
    getcurrentSong(data,falg) {
      clearInterval(this.timeInters);
      this.timeInters = null;
      if(!falg){

        // 获取本地数据
        data = JSON.parse(localStorage.getItem("_url")).data;

        if(data.newTime != '' && parseInt(data.newTime == this.audioElement.currentTime)){

          this.audioElement.currentTime = data.newTime
        }
      }else {
        data = data;
      }

      let play = JSON.parse(localStorage.getItem('_play'));
      if(play.length <= 1 ){
        this.$store.commit('orderIndex',false);
      }else {
        this.$store.commit('orderIndex',true);
      }
      this.song = {}

      this.id = data.id;
      let times = data.time;

      // 歌曲时间初始化
      let t = parseInt(data.time / 60);

      let m = parseInt(data.time % 60);

      if (t < 10) {
        t = "0" + t;
      }

      if (m < 10) {
        m = "0" + m;
      }

      data.time = t + ":" + m;
      this.song = data;

      this.song.times = times;
      

      //判断是否收藏歌曲
      this.isLinkSong();
    },

    // 获取歌词
    getSongLyric() {

      // 获取本地数据
      let data = JSON.parse(localStorage.getItem("_url")).data;
      let id = data.id
      this.axios({
        method: "GET",
        url: "/lyric",
        params: {
          id,
          times: new Date().getTime(),
        },
      })
        .then((result) => {
          // 
          this.lyricsObjArr = []
          if (result.data.code == 200) {
            if (result.data.nolyric) {
              this.lyricsObjArr.push({ lyric: "暂无歌词" });
              return;
            }
            // 歌词对象
            let lyric = result.data.lrc.lyric;

            // 裁切歌词正则
            const regNewLine = /\n/;
            const regTime = /\[\d{2}:\d{2}.\d{2,3}\]/;

            // 每行歌词的数组
            const lineArr = lyric.split(regNewLine);
            
  
            lineArr.forEach((item) => {
              // 如果没有歌词 进行拦截
              if (item === "") {
                return;
              }
              let obj = {};

              let time = item.match(regTime);

              // 歌词文本
              obj.lyric =
                item.split("]")[1].trim() === ""
                  ? ""
                  : item.split("]")[1].trim();
              // 歌词时间
              obj.time = time
                ? this.formatLyricTime(time[0].slice(1, time[0].length - 1))
                : 0;
              // 歌词每句id
              obj.uid = Math.random().toString().slice(-6);

              if (obj.lyric === "") {
                return;
              }
              this.lyricsObjArr.push(obj);
            });
          }
        })
        .catch((err) => {
          
        });
    },

    // 格式化歌词的时间 转换成 ss.ms
    formatLyricTime(time) {
      const regMin = /.*:/;
      const regSec = /:.*\./;
      const regMs = /\./;

      const min = parseInt(time.match(regMin)[0].slice(0, 2));
      let sec = parseInt(time.match(regSec)[0].slice(1, 3));
      const ms = time.slice(
        time.match(regMs).index + 1,
        time.match(regMs).index + 3
      );
      if (min !== 0) {
        sec += min * 60;
      }
      return Number(sec + "." + ms);
    },

    // 歌词匹配
    SongLyric(time) {
      // 匹配歌词
      for (let i = 0; i < this.lyricsObjArr.length; i++) {
        // 判断当前播放的音频时间与歌词的匹配
        if (time > parseInt(this.lyricsObjArr[i].time)) {
          this.lyricIndex = i;
        }
      }
    },

    //点击进度条
    touchProgress(e) {
      this.$store.dispatch("isPlaySong", false).then(() => {
        if (!this.isPlaySong) {
          // 播放音频
          this.pause();
        }
      });
      // 
      let width = e.changedTouches[0].pageX - this.slideOffsetLeft;

      // 设置点击进度条，音频对应的播放进度
      this.audioElement.currentTime =
        (width / this.progressWidth) * this.song.times;

      // 进度条边界控制
      width = (width / this.progressWidth) * 100;
      width = width <= 0 ? 0 : width >= 100 ? 100 : width;

      this.width = width;

      this.left = width;
    },

    // 点击进度条松开
    touChend() {
      // 传入参数进行判断是否播放
      this.$store.dispatch("isPlaySong", true).then(() => {
        if (this.isPlaySong) {
          // 播放音频
          this.play();
        }
      });
    },

    //点击滑块
    touchMask(e) {
      this.x = e.changedTouches[0].pageX;
      this.$store.dispatch("isPlaySong", false).then(() => {
        if (!this.isPlaySong) {
          // 播放音频
          this.pause();
        }
      });
    },

    //移动滑块
    moveMask(e) {
      //获取移动后的坐标
      let x1 = e.changedTouches[0].pageX;

      //获取x1与this.x的差值
      let x0 = x1 - this.x;

      let index = e.changedTouches[0].pageX - this.slideOffsetLeft;

      // 设置点击进度条，音频对应的播放进度
      this.audioElement.currentTime =
        (index / this.progressWidth) * this.song.times;

      index = index <= 0 ? 0 : index >= 100 ? 100 : index;

      //设置激活进度的宽度
      let width = this.width + (x0 / this.progressWidth) * 100;

      //控制激活进度条最大的宽度和最小宽度
      width = width <= 0 ? 0 : width >= 100 ? 100 : width;

      this.width = width;
      //移动mask
      this.left = width;
      //重置this.x的初始化
      this.x = x1;
    },

    // 松开滑块
    endMask() {
      this.$store.dispatch("isPlaySong", true).then(() => {
        if (this.isPlaySong) {
          this.play();
        }
      });
    },

    // 获取音频文件
    getAudioUrl() {
      let obj = JSON.parse(localStorage.getItem("_url")).data;
      // 上次播放的音频
      this.$store.dispatch("addAudioSrc", obj.url).then(() => {
        this.$store.commit("audioName", obj.name);
        this.$store.commit("addAudioImg", obj.img);
      });
    },

    // 音频播放时间
    getSongTime() {
      // 播放的音频数据
      let data = JSON.parse(localStorage.getItem("_url"));
      clearInterval(this.timeInters);
      this.timeInters = null;

      if(this.isPlaySong){

        this.timeInters = setInterval(() => {
          // 当前播放时间
          let time = 0
          time = this.audioElement.currentTime;

          // 转成00:00时间格式
          let duration = parseInt(time);
          let minute = parseInt(duration / 60);
          let sec = (duration % 60) + "";
          let isM0 = ":";
          if (minute == 0) {
            minute = "00";
          } else if (minute < 10) {
            minute = "0" + minute;
          }
          if (sec.length == 1) {
            sec = "0" + sec;
          }
          let times = minute + isM0 + sec;
          this.$store.commit("audioTime", times);
          let num = 0
          num  = parseInt((time / data.data.time) * 100);
          
            // 进度条随着播放的时间增加（百分比）
          this.left = num;
          this.width = num;
          

          this.musicNum = this.musicNum + 3;

          if(this.musicNum > 360){
            this.musicNum = 0;
          }
 
          this.musicRotate = `rotate(${this.musicNum}deg)`
          this.SongLyric(time);
        }, 200);
      }

    },

    // 切换播放状态
    toggleSong() {
      this.isPlay = !this.isPlaySong;

      // 传递是否播放参数
      this.$store.commit("isPlaySong", this.isPlay);
      if (this.isPlay) {
        // 播放
        this.play();
        return;
      }
      // 暂停
      this.pause();
    },

    // 播放
    play() {
      this.audioElement.play();
      this.getSongTime();
      this.SongLyric();
      // 调用定时器
    },
    // 暂停
    pause() {
      this.audioElement.pause();
      // 停止定时器
      clearInterval(this.timeInters);
    },

    // 判断用户是否点击喜欢歌曲
    isLinkSong() {
      // 创建收藏歌曲的本地存储数据
      if (!JSON.parse(localStorage.getItem("_like"))) {
        let likes = [];
        localStorage.setItem("_like", JSON.stringify(likes));
      }
      // 获取本地存储的喜欢歌曲
      let like = JSON.parse(localStorage.getItem("_like"));

      let play = JSON.parse(localStorage.getItem('_url'));
      // 判断是否有收藏歌曲的数据
      if (like.length == 0) {
        this.islike = false;
      } else {
        this.islike = false;
        like.map((v) => {
          if (v.id == play.data.id) {
            // 通过收藏歌曲的数据中是否显示收藏
            this.islike = true;
          }
        });
      }
    },

    // 收藏歌曲
    likeSong() {
      // 获取登录id
      let userid = localStorage.getItem("__log");

      if (!userid) {
        this.$toast("您还没登录，不能收藏歌曲");
        return;
      }
      // 获取本地存储的喜欢歌曲
      let like = JSON.parse(localStorage.getItem("_like"));

      let url = JSON.parse(localStorage.getItem("_url"));

      // 判断本地存储是否有like的数据
      if (!this.islike) {
        let str = {};
        // 获取当前播放的音频数据
        str = url.data;
        // 添加下标来方便取消收藏
        str.index = like.length + 1;
        // 添加显示收藏标签的数据
        str.islike = true;
        // 存储喜欢的歌曲
        like.push(str);
        // 存储到本地
        localStorage.setItem("_like", JSON.stringify(like));
        // 显示收藏标签
        this.islike = true;

        return;
      }
      // 判断是否收藏，
      if (this.islike) {
        like.map((v) => {
          if (this.song.id == v.id) {
            // 删除收藏数组中的当前歌曲所在的位置
            like.splice(v.index - 1, 1);
            // 存储到本地
            localStorage.setItem("_like", JSON.stringify(like));
            // 显示取消收藏标志
            this.islike = false;
          }
        });
      }
    },

    // 获取播放列表
    getPlayList() {
      // 获取最近播放数据
      let data = JSON.parse(localStorage.getItem("_play"));
      data.map((v, i) => {
        // 播放列表激活状态索引
        v.index = i;
        // 判断播放列表的正在播放列表
        if (v.id == this.id) {
          // 当前播放歌曲在播放列表的激活索引
          this.$store.commit("songListactive", v.index);
        }
      });
      this.playList = data;
    },

    // 显示播放列表
    toggleisSonglist() {
      this.isSonglist = !this.isSonglist;
    },

    // 获取音乐的版权
    getMusic(item) {
      let i = JSON.parse(localStorage.getItem('_url'));
      
      if(item.id == i.data.id){
        // 点击相同歌曲
        
        
        this.audioElement.currentTime = 0
        this.$store.commit('audioTime','00:00');
      }
      this.musicNum = 0;
       // 停止定时器
      clearInterval(this.timeInters);
      // 开启加载提示
      this.$toast.loading({
        message: "加载中..",
        forbidClick: true,
        duration: 0,
      });

      // 有些歌曲会出现403 用拼接字符串来代替播放路径
      this.url = `https://music.163.com/song/media/outer/url?id=${item.id}.mp3`;
      // 歌名
      this.$store.commit("audioName", item.name);


      this.$store.commit('addAudioSrc',null);

      this.$store.dispatch("addAudioSrc", this.url).then(() => {
        this.$toast.clear();

        //更改src后需要重新加载音乐
        this.audioElement.load();

        // 显示播放
        this.$store.commit("isPlaySong", true);

        // 获取音频总时长
        this.audioElement.addEventListener("canplay", () => {
          // 调用获取音频图片

          this.getAudioImg(item);

          // // 播放音乐
          this.play();
        });
      });
    },

    // 获取音频照片
    getAudioImg(item) {
      if(item.soimg){
        this.audioImg = item.soimg;
      }else if(item.picUrl){
        this.audioImg = item.picUrl;
      }else if(item.album) {
        this.audioImg = item.album.picUrl;
      }else if(item.al){
        this.audioImg = item.al.picUrl;
      }else if (item.img){
        this.audioImg = item.img;
      }
      
      // // 存储到本地
      let obj = {
        name: item.name,
        id: item.id,
        url: this.url,
        img: this.audioImg,
        time: this.audioElement.duration,
      };
      localStorage.setExpire("_url", obj);
      // 歌曲图片
      this.$store.commit("addAudioImg", this.audioImg);
      this.getcurrentSong(obj , true);
      // 调用播放列表
      this.getPlayList();
      this.getSongLyric();
      // 获取播放时间
      this.getSongTime();

    },

    // 切换顺序播放或单曲播放
    toggleOrderIndex() {
      if (this.orderIndex) {
        this.$store.commit("orderIndex", false);
        this.$toast({
          message: "单曲播放",
          position: "bottom",
        });
        

        return;
      }
      this.$store.commit("orderIndex", true);
      this.$toast({
        message: "顺序播放",
        position: "bottom",
      });

      
    },

    // 上一首或者下一首
    toggleList(falg) {
      
      clearInterval(this.timeInters);
      this.timeInters = null;
      // 获取播放记录
      let index = -1;
      let data = JSON.parse(localStorage.getItem("_play"));
      // 获取当前播放歌曲
      let song = JSON.parse(localStorage.getItem("_url")).data;
      for (let i = 0; i < data.length; i++) {
        if (data[i].id == song.id) {
          // 单曲循环
          if (this.orderIndex) {
            if (falg) {
              index = i-1
              if (index < 0) {
                index = data.length-1;
              }
                // 
              this.$store.commit('songListactive',index);
            } else {
              index = i + 1;
                
              if(index == data.length) {
                index = 0;
              }
              this.$store.commit('songListactive',index);
            }

            this.getMusic(data[index]);
          }else {
            this.getMusic(song)
            this.$store.commit('songListactive',i);
          }
        }
      }
      
      this.isLinkSong();
    },

    // 切换歌词或图片
    toggleImgorlyric(){

      this.isImg = !this.isImg
    },

    // 删除播放列表
    removeSonglist(id) {

      let data = JSON.parse(localStorage.getItem('_play'));
      for(let i = 0 ; i < data.length ; i ++){
        if(data[i].id == id){
          // 
          // 删除播放列表
          data.splice(i,1);
          // 删除渲染出来的播放列表
          this.playList.splice(i,1)
        }
      }
      localStorage.setItem('_play',JSON.stringify(data))

    },

    // 清空播放列表
    removeAllList(){
      this.playList = [];
      localStorage.setItem('_play',JSON.stringify(this.playList));

      // 播放列表为空，将播放顺序修改为单曲播放
      this.$store.commit('orderIndex',false);
    }
  },

  beforeDestroy() {
    clearInterval(this.timeInters); //关闭
    this.timeInters = null;
  },

  watch: {
    isEnd:function(ne,ol){
      let data = JSON.parse(localStorage.getItem('_play'));
      if(ne){
        // 播放结束后播放下一首
        this.getMusic(data[this.songListactive]);

        // 修改判断是否播放结束的状态 ，不然会一直切换正在播放歌曲，无法播放
        this.$store.commit('isEnd',false);
      }
    }
  },
};
</script>

<style lang="less" scoped>
</style>