import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 音频src
    audioSrc:'',

    // 音频播放元素
    audioElement:'',

    // 当前音频播放时间
    audioTime:"00:00",

    // 音频总时间
    audioSumT:0,

    // 音频图片
    SongImg:'',

    // 音频是否播放
    isPlaySong:false,

    // 音频名称
    audioName:'',

    // 音频播放顺序
    orderIndex:true,

    // 播放列表激活索引
    songListactive:0,

    // 播放是否结束
    isEnd:false,

    // 显示播放器
    isShow:false,

    //轮播图数据
    bannerList:[],

    // 首页分类
    classify:[],
  },
  mutations: {

    classify(state,data){
      state.classify = data
    },

    bannerList(state,data){
      state.bannerList = data
    },
    isShow(state , data) {
      state.isShow = data
    },

    isEnd(state , data){
      state.isEnd = data
    },
    // 激活歌曲
    songListactive(state  , index){
      state.songListactive  = index;
    },

    // 音频播放顺序
    orderIndex(state ,data){
      state.orderIndex = data;
    },

    // 音频标签元素
    addAudio(state , audio) {
      state.audioElement = audio;
    },

    // 音频路径
    addAudioSrc(state,audioSrc) {
      state.audioSrc = audioSrc;
    },

    // 是否播放
    isPlaySong(state , flag) {

      state.isPlaySong = flag;
    },

    // // 当前音频播放时间
    audioTime(state,time){
      state.audioTime = time;
    },

    // 音频总时间
    audioSumT(state , sumT){
      state.audioSumT = sumT
    },

    // 音频名称
    audioName(state,name) {
      state.audioName = name;
    },

    // 音频图片
    addAudioImg(state , Img){
      state.SongImg = Img;
    }
  },
  actions: {
    isPlaySong({commit},flag) {
      commit('isPlaySong',flag)
    },

    addAudioSrc({commit} ,data) {

      commit('addAudioSrc',data)
    },

    timeInters({commit},data){
      commit('timeInters',data)
    }

  },
  modules: {
  }
})
