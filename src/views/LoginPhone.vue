<template>
  <div class="login">
    <van-nav-bar left-text="返回" left-arrow @click-left="goPage" />
    <div class="logo-box">
      <div class="logo">
        <img class="auto-img" src="../assets/images/music.png" alt="" />
      </div>
    </div>

    <div class="login-box">
      <van-form @submit="onSubmit">
        <van-field
          v-model="loginData.phone"
          name="手机号"
          label="手机号"
          placeholder="手机号"
          autocomplete="off"
        />
        <van-field
          v-model="loginData.password"
          :type="isLoginPassword ? 'password' : 'text'"
          name="密码"
          label="密码"
          placeholder="密码"
          :right-icon="isLoginPassword ? 'closed-eye' : 'eye-o'"
          @click-right-icon="toggleLoginPassword"
          autocomplete="off"
        />
        <div>
          <van-button round block type="info" native-type="submit">
            登录
          </van-button>
        </div>

        <div>
          <van-button
            class="btn"
            round
            block
            type="info"
            native-type="submit"
            @click="back('LoginBank')"
          >
            没有账号 ? 前往注册
          </van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
import { validForm } from "../assets/js/validForm";
export default {
  name: "LoginPhone",
  data() {
    return {
      isLoginPassword: true,
      loginData: {
        phone: "",
        password: "",
      },
    };
  },
  methods: {
    //
    goPage() {
      this.$router.go(-1);
    },
    // 密码显示
    toggleLoginPassword() {
      this.isLoginPassword = !this.isLoginPassword;
    },

    // 登录
    onSubmit() {

      this.$toast.loading({
        message: "加载中..",
        forbidClick: true,
        duration: 0,
      });

      let opt = {
        phone: {
          value: this.loginData.phone,
          errorMsg: "手机号格式不正确",
          reg: /^1[3-9]\d{9}$/,
        },
      };
      let flag = validForm.valid(opt);
      if (flag) {
        this.axios({
          method: "GET",

          url: "/login/cellphone",

          params: {
            phone: this.loginData.phone,
            password: this.loginData.password,
          },
        })
          .then((result) => {
            this.$toast.clear();
            
            if(result.data.code == 502) {
              this.$toast(result.data.msg);
            }else if(result.data.code == 200 ) {

              localStorage.setItem('__log',result.data.profile.userId);

              this.$router.push({name:'Home'})
            }
          })
          .catch((err) => {
            this.$toast.clear();
            
          });
      }
    },


    back(name) {
      this.$router.push({ name });
    },

    // 检验手机号是否被注册
    setPhone() {
      this.axios({
        method:'GET',
        url:'/cellphone/existence/check',
        params:{
          phone:this.loginData.phone
        }
      }).then(result => {
        
      }).catch(err => {
        
      })
    }
  },
};
</script>

<style lang="less" scoped>
.login {
  padding: 0 10px;
  .logo-box {
    width: 100%;
  }
  .logo {
    width: 60px;
    
    margin: 70px auto;
    z-index: 11;
    
  }
 
  .login-phone,
  .login-set {
    border: 1px solid #dd1210;
    padding: 14px;
    text-align: center;
    color: #dd1210;
    border-radius: 40px;
    margin: 20px 0;
  }
 
  .login-txt {
    font-size: 16px;
    text-align: center;
    // margin-top: 60px;
    color: #626262;
  }
  /deep/ .van-cell {
    font-size: 16px;
    // line-height: 120px;
  }
  /deep/ .van-button--info {
    background-color: #dd1210;
    border-color: #dd1210;
    margin-top: 40px;
  }
  .btn {
    background-color: #ddd;
    border-color: #ddd;
    color: #333;
  }
  /deep/ .van-field__label {
    width: 60px;
  }
  /deep/ .van-nav-bar__left {
    font-size: 16px;
    padding: 0;
  }
  /deep/ .van-nav-bar__text,
  /deep/.van-nav-bar .van-icon {
    color: #dd1210;
  }
}
</style>