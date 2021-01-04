import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import axios from 'axios'
import VueAxios from 'vue-axios'

import 'lib-flexible/flexible'

import { 
  Button,
  Icon,
  Form,
  Field,
  Toast,
  NavBar,
  Tabbar, 
  TabbarItem,
  Swipe,
  SwipeItem,
  Grid,
  GridItem,
  Image,
  Tab,
  Tabs,
  Circle,
  Popup,
  Dialog,
  Uploader,
  Loading,
  Progress,
  Lazyload,
  Skeleton,
  PullRefresh,
  List,
  Cell,
  CellGroup
} from 'vant';



Vue
  .use(Button)
  .use(Icon)
  .use(Form)
  .use(Field)
  .use(Toast)
  .use(NavBar)
  .use(Tabbar)
  .use(TabbarItem)
  .use(Swipe)
  .use(SwipeItem)
  .use(Grid)
  .use(GridItem)
  .use(Image)
  .use(Tab)
  .use(Tabs)
  .use(Circle)
  .use(Popup)
  .use(Dialog)
  .use(Uploader)
  .use(Loading)
  .use(Progress)
  .use(Lazyload)
  .use(Skeleton)
  .use(PullRefresh)
  .use(List)
  .use(Cell)
  .use(CellGroup)

// http://api.kele8.cn/agent/
axios.defaults.baseURL ='http://api.kele8.cn/agent/http://music.eleuu.com';


// 拦截器
axios.interceptors.request.use(config => {
  // 
  if(config.method == 'post') {
    let paramsString ='';

    for(let key in config.data) {
      paramsString += `${key}=${config.data[key]}&`;
    }

    config.data = paramsString.slice(0,-1);
  }

  return config
})

// 存储数据到本地
Storage.prototype.setExpire=(key, value, expire) =>{
  let obj={
      data:value,
      times:Date.now(),
      expire:expire
  };
  localStorage.setItem(key,JSON.stringify(obj));
}

// 检查数据是否过期
Storage.prototype.getExpire= key =>{
  let val =localStorage.getItem(key);
  if(!val){
      return val;
  }
  val =JSON.parse(val);
  if(Date.now()-val.time>val.expire){
      localStorage.removeItem(key);
      return null;
  }
  return val.data;
}


Vue.config.productionTip = false

Vue.use(VueAxios, axios)


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
