<template>
  <div class="mask">
    <div class="auth-box">
      <div class="login" :class="[{ 'fade-out': !switch_box }]">
        <span class="title">登入</span>

        <el-form class="form" ref="loginForm" :model="user.login_form" :rules="rules">
          <el-form-item prop="email">
            <el-input v-model="user.login_form.email" placeholder="請輸入電子郵件" type="email">
              <template #prefix>
                <el-icon><Message /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item prop="password">
            <el-input v-model="user.login_form.password" placeholder="請輸入密碼" show-password>
              <template #prefix>
                <el-icon><Lock /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-button type="primary" @click.prevent="login_user">登入</el-button>
        </el-form>
      </div>

      <div class="signup" :class="[{ 'fade-out': switch_box }]">
        <span class="title">註冊</span>
        <el-form class="form" ref="signupForm" :model="user.signup_form" :rules="rules">
          <el-form-item prop="email">
            <el-input v-model="user.signup_form.email" placeholder="請輸入申請電子郵件" type="email">
              <template #prefix>
                <el-icon><Message /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item prop="password">
            <el-input v-model="user.signup_form.password" placeholder="請輸入申請密碼" show-password>
              <template #prefix>
                <el-icon><Lock /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-button type="primary" @click.prevent="register_user">註冊</el-button>
        </el-form>
      </div>

      <div class="switch" :class="[{ 'switch-login': !switch_box, 'switch-register': switch_box }]">
        <el-button type="primary" @click="switch_box = true">登入</el-button>
        <el-button type="primary" @click="switch_box = false">註冊</el-button>
        <div class="point">
          <samp>測試管理員</samp>
          <samp>帳號:zxc123456@gmail.com</samp>
          <samp>密碼:zxc123456</samp>
          <samp>一般帳號可隨意註冊登入但權限受限</samp>
        </div>
      </div>
    </div>
    <Background />
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import Background from '@/components/background/index.vue';
import { Lock } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@/api/firebase_config';
import { user_api } from '@/api/firebase_user_api';
import { useUserStore } from '@/store/user';
import { useRouter } from 'vue-router';

let switch_box = ref(); //切換登入註冊狀態
let router = useRouter();
//用戶資料
let user = reactive({
  login_form: {
    email: '',
    password: '',
  },
  signup_form: {
    email: '',
    password: '',
  },
});

let signupForm = ref(null);
let loginForm = ref(null);

// 表單驗證規則
const rules = reactive({
  email: [
    { required: true, message: '電子信箱不能為空', trigger: 'blur' },
    {
      pattern: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
      message: '請輸入有效的電子信箱',
      trigger: 'blur',
    },
  ],
  password: [
    { required: true, message: '密碼不能為空', trigger: 'blur' },
    { pattern: /^[A-Za-z]/, message: '密碼必須以英文字母開頭', trigger: 'blur' },
    { min: 6, max: 12, message: '密碼長度應為6到12個字', trigger: 'blur' },
  ],
});
//表單驗證
async function form_verify(validate, call_backs) {
  try {
    const valid = await validate();
    if (valid) {
      ElMessage({
        message: '輸入驗證成功',
        type: 'success',
      });
      call_backs();
    } else {
      ElMessage.error('輸入驗證異常！');
    }
  } catch (error) {
    ElMessage.error('輸入驗證不合法！');
  }
}

//信箱註冊驗證
async function register_user() {
  async function firebase_register() {
    try {
      let new_user = await createUserWithEmailAndPassword(auth, user.signup_form.email, user.signup_form.password);

      let user_data = {
        uid: new_user.user.uid,
        email: String(user.signup_form.email),
      };

      await user_api.add_user(user_data); //新增使用者
      ElMessage.success('註冊成功~~請進行登入');
    } catch (error) {
      console.error('Firebase 註冊錯誤:', error);
      if (error.code === 'auth/email-already-in-use') {
        ElMessage.error('此信箱已被註冊，請使用其他信箱！');
      } else if (error.code === 'auth/invalid-email') {
        ElMessage.error('請輸入有效的電子郵件地址！');
      } else if (error.code === 'auth/weak-password') {
        ElMessage.error('密碼強度不足，請使用更強的密碼！');
      } else {
        ElMessage.error('註冊時發生錯誤，請稍後再試！');
      }
    }
  }
  //驗證成功後註冊
  form_verify(signupForm.value.validate, firebase_register);
}
//還沒開啟驗證

//登入驗證
function login_user() {
  async function firebase_login() {
    try {
      let user_state = useUserStore();
      await user_state.login_process(user.login_form.email, user.login_form.password);

      ElMessage.success('登入成功~~即將跳轉');

      setTimeout(() => {
        router.push('/home');
      }, 500);
    } catch (error) {
      ElMessage.error('登入失敗! 請確認帳號或密碼是否正確');
      console.error(error);
    }
  }

  form_verify(loginForm.value.validate, firebase_login);
}
</script>

<style scoped>
.mask {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: radial-gradient(ellipse at bottom, #0d1d31 0%, #0c0d13 100%);
  overflow: hidden;
}
.auth-box {
  width: 40%;
  height: 50%;
  background-color: #ffffff45;
  display: flex;
  position: relative;
  z-index: 1;
}

.login,
.signup,
.switch {
  width: 50%;
  height: 100%;
  transition: all 0.5s ease;
}

.fade-out {
  opacity: 0;
}

.switch {
  position: absolute;
  top: 0;
  background-color: #ffffff00;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-content: center;
  transition: all 0.5s ease;
}

.switch-login {
  left: 0;
}
.switch-register {
  left: 50%;
}

.switch .el-button {
  margin: 20px 0;
  max-width: 60%;
}

.form {
  display: flex;
  flex-wrap: wrap;
  width: 80%;
  margin: auto;
  justify-content: center;
}

.title {
  display: block;
  width: 100%;
  text-align: center;
  font-size: 40px;
  color: #44a0ff;
  margin: 20px 0;
}
.el-form-item {
  width: 100%;
}

.el-input {
  width: 100%;
  margin: 8px 0;
}

.el-button {
  width: 100%;
  margin-top: 20px;
}

.point {
  color: #8f0e0e;
  display: flex;
  flex-direction: column;
  width: 70%;
}
.point samp {
  font-size: 16px;
}
</style>
