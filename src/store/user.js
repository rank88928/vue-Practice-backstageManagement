import { defineStore } from 'pinia';
import { user_api } from '@/api/firebase_user_api';
import { auth, signInWithEmailAndPassword } from '@/api/firebase_config';

export let useUserStore = defineStore('user', {
  state: () => ({
    uid: localStorage.getItem('uid') || '',

    data: {
      email: '',
      role: '',
    },
  }),

  actions: {
    //完整登入流程
    login_process: async function (email, password) {
      try {
        //firebase auth
        let auth_user = await signInWithEmailAndPassword(auth, email, password);
        this.set_uid(auth_user.user.uid);
        await user_api.latest_login_time(auth_user.user.uid);
        await this.get_user_data();
      } catch (error) {
        throw error;
      }
    },

    //本地保存uid
    set_uid(uid) {
      this.uid = uid;
      localStorage.setItem('uid', uid);
    },
    //用戶登出 清除uid紀錄
    logout() {
      this.uid = '';
      localStorage.removeItem('uid');
      window.location.reload();
    },

    //合法uid驗證
    verify_uid: async function () {
      let user_data = await user_api.verify_uid(this.uid);

      if (user_data) {
        this.data.email = user_data.email;
        this.data.role = user_data.role;
        return true;
      } else {
        return false;
      }
    },

    //取得用戶資料
    async get_user_data() {
      let data = await user_api.get_user_data(this.uid);
      this.data.email = data.email;
      this.data.role = data.role;
    },
  },
});
