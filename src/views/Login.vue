<template>
  <div class="login">
    <div class="logo-box">
      <div class="logo">
        <img class="auto-img" src="../assets/images/music.png" alt="">
      </div>
    </div>

    <div class="login-box">
      <div class="login-phone" @click="back('LoginPhone')">
        <span>登录</span>
      </div>
      <div class="login-set" @click="back('LoginBank')">
        <span>注册</span>
      </div>

      <div class="login-txt" @click="back('Home')">
        <span>游客使用 <van-icon name="arrow" /></span>
      </div>
    </div>

    
  </div>
</template>

<script>
import '../assets/less/login.less'
  export default {
    name:'Login',
    methods:{
      
      back(name) {
        this.$router.push({name})
      }
    }
  }
</script>

<style lang="less" scoped>

</style>