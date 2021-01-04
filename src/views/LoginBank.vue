<template>
  <div class="loginBank">
    <van-nav-bar left-text="返回" left-arrow @click-left="goPage" />
    <div class="logo-box">
      <div class="logo">
        <img class="auto-img" src="../assets/images/music.png" alt="" />
      </div>
    </div>

    <div class="login-box">
      <van-form>
        <van-field
          v-model="loginData.phone"
          name="手机号"
          label="手机号"
          placeholder="请输入手机号"
          autocomplete="off"
          @blur="checkPhone"
        />
        <van-field
          v-model="loginData.captcha"
          center
          clearable
          label="验证码"
          placeholder="请输入短信验证码"
        >
          <template #button>
            <van-button size="small" type="primary" :disabled="isSend" @click="getCaptcha">{{
              text
            }}</van-button>
          </template>
        </van-field>
        <van-field
          v-model="loginData.password"
          :type="isLoginPassword ? 'password' : 'text'"
          name="密码"
          label="密码"
          placeholder="至少包含 数字和英文，长度6-20"
          :right-icon="isLoginPassword ? 'closed-eye' : 'eye-o'"
          @click-right-icon="toggleLoginPassword"
          autocomplete="off"
        />
        <van-field
          v-model="loginData.nickname"
          name="昵称"
          label="昵称"
          placeholder="没有新手机号，无法测试注册接口"
          autocomplete="off"
        />
        <div>
          <van-button
            round
            block
            type="info"
            native-type="submit"
            @click="onSubmit"
          >
            注册
          </van-button>
        </div>

        <div>
          <van-button
            class="btn"
            @click="back('LoginPhone')"
            round
            block
            type="info"
            native-type="submit"
          >
            已有账号 ? 前往登录
          </van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
import { validForm } from "../assets/js/validForm";
export default {
  name: "LoginBank",
  data() {
    return {
      isSend:false,
      // 密码显示
      isLoginPassword: true,

      // 注册信息
      loginData: {
        captcha: "",
        phone: "",
        password: "",
        nickname: "",
      },

      // 验证码
      text: "发送验证码",

      // 手机号是否已经被注册
      isPhone: "",
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

    // 表单验证
    onSubmit() {
      // 检查注册的选项格式是否正确
      let opt = {
        phone: {
          value: this.loginData.phone,
          errorMsg: "手机号格式不正确",
          reg: /^1[3-9]\d{9}$/,
        },
        captcha: {
          value: this.loginData.captcha,
          errorMsg: "验证码格式错误",
          reg: /^\d{4}$/,
        },
        password: {
          value: this.loginData.password,
          errorMsg: "密码格式错误",
          reg: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/,
        },
      };

      let flag = validForm.valid(opt);
      if (flag) {
        this.axios({
          method: "POST",
          url: "/register/cellphone",
          data: {
            phone: this.loginData.phone,
            captcha: this.loginData.captcha,
            password: this.loginData.password,
            nickname: this.loginData.nickname,
            timestamp:new Date().getTime()
          },
        })
          .then((result) => {
            
          })
          .catch((err) => {
            
          });
      }
    },

    // 跳转页面
    back(name) {
      this.$router.push({ name });
    },

    // 获取验证码
    getCaptcha() {
      this.axios({
        method: "GET",
        url: "/captcha/sent",
        params: {
          phone: this.loginData.phone,
          timestamp:new Date().getTime()
        },
      })
        .then((result) => {
          

          let time = 60;

          this.isSend = true;
          this.text = `${time}秒后重新发送`;

          let timer = setInterval(() => {
            if (time <= 0) {
              clearInterval(timer);
              timer = null;
              time = 10;
              this.isSend = false;
              this.text = '发送验证码'
            } else {
              time--;
              this.text = `${time}秒后重新发送`;
            }
          }, 1000);
        })
        .catch((err) => {
          
        });
    },

    // 检验手机号是否被注册
    checkPhone() {
      // 检查手机号格式是否正确
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
          url: "/cellphone/existence/check",
          params: {
            phone: this.loginData.phone,
            timestamp:new Date().getTime()
          },
        })
          .then((result) => {
            this.$toast.clear();
            
            if (result.data.code == 400) {
              this.$toast("手机号不能为空");
            } else if (result.data.hasPassword) {
              this.$toast("手机号已被注册");
            } else {
              this.$toast("手机号没被注册");
            }
            // this.isPhone = result.data.hasPassword;
          })
          .catch((err) => {
            
          });
      }
    },
  },
};
</script>

<style lang="less" scoped>
.loginBank {
  // padding: 20px;
  .logo-box {
    width: 100%;
  }
 .logo {
    width: 60px;
    
    margin: 70px auto;
    z-index: 11;
    
  }
  .login-box {
    // margin-top: 120px;
    padding: 10px 20px;
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
    font-size: 14px;
    padding: 10px 0; 
  }
  /deep/ .van-button--info {
    margin: 30px auto 0;
    height: 44px;
    background-color: #dd1210;
    border-color: #dd1210;
  }
  
  /deep/.van-button--small {
    background-color: #dd1210;
    border-color: #dd1210;
    border-radius: 10px;
  }
 
  /deep/.van-field__right-icon .van-icon {
    font-size: 16px;
  }
  /deep/ .van-field__label {
    width: 60px;
  }
  .btn {
    background-color: #ddd;
    border-color: #ddd;
    color: #333;
  }
  /deep/ .van-nav-bar__text,
  /deep/.van-nav-bar .van-icon {
    color: #dd1210;
  }
}
</style>