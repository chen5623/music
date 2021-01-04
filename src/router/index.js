import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/loginPhone',
    name: 'LoginPhone',
    component: () => import('../views/LoginPhone.vue')
  },
  {
    path: '/loginBank',
    name: 'LoginBank',
    component: () => import('../views/LoginBank.vue')
  },
  {
    path: '/main',
    name: 'Main',
    component: () => import('../views/Main.vue'),
    meta: {
      keepAlive: true
    },
    children: [
      {
        path: 'my',
        name: 'My',
        component: () => import('../views/My.vue'),
        meta: {
          keepAlive: true
        }
      },
      {
        path: 'home',
        name: 'Home',
        component: () => import('../views/Home.vue'),
        meta: {
          keepAlive: true
        }
      },
      {
        path: 'video',
        name: 'Video',
        component: () => import('../views/Video.vue')
      }
    ]
  },
  // 我喜欢的音乐
  {
    path: '/mylike',
    name: 'Mylike',
    component: () => import('../views/Mylike.vue'),

  },
  // 歌单信息
  {
    path: '/songInfo/:id',
    name: 'SongInfo',
    component: () => import('../views/SongInfo.vue')
  },
  // 歌单详情
  {
    path: '/songdetail/:id',
    name: 'Songdetail',
    component: () => import('../views/Songdetail.vue'),
    
  },

  // 改变歌单列表
  {
    path: '/changesonglist',
    name: 'Changesonglist',
    component: () => import('../views/Changesonglist.vue')
  },

  // 所有歌单
  {
    path: '/allsonglist',
    name: 'Allsonglist',
    component: () => import('../views/Allsonglist.vue'),
    meta: {
      keepAlive: true
    }
  },

  // 最近播放
  {
    path: '/recentplay',
    name: 'Recentplay',
    component: () => import('../views/Recentplay.vue')
  },
  // 推荐播放
  {
    path: '/localmusic',
    name: 'Localmusic',
    component: () => import('../views/Localmusic.vue'),
   
  },
  // 歌词
  {
    path: '/lyric',
    name: 'Lyric',
    component: () => import('../views/Lyric.vue'),
   
  },

  // 搜索
  {
    path: '/search',
    name: 'Search',
    component: () => import('../views/Search.vue'),
  },

  // 排行榜
  {
    path: '/rankings',
    name: 'Rankings',
    component: () => import('../views/Rankings.vue'),
  },

  // 最新
  {
    path: '/newest',
    name: 'Newest',
    component: () => import('../views/Newest.vue'),
    meta: {
      keepAlive: true
    }
  },

  // 歌手详情
  {
    path: '/singerdetail/:id',
    name: 'Singerdetail',
    component: () => import('../views/Singerdetail.vue'),
  },

  // 歌手详情
  {
    path: '/songdiscuss',
    name: 'Songdiscuss',
    component: () => import('../views/Songdiscuss.vue'),
  },

  {
    path: '/myinfo',
    name: 'Myinfo',
    component: () => import('../views/Myinfo.vue'),
  },

  // 重定向
  {
    path: '*',
    redirect: { name: 'Home' }
  }
]

const router = new VueRouter({
  routes
})

export default router
