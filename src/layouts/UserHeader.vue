<template>
  <div class="header">
    <div class="item">當前時間:{{ time }}</div>
    <div class="item">
      <span>權限:{{ get_zh_TW_map('permission_type', user.data.role) }}</span>
      <span>用戶:{{ user.data.email }}</span>
      <div class="setting">
        <el-popover placement="top-start" title="設置" :width="200" trigger="hover">
          <template #default>
            <el-button @click="user.logout">登出</el-button>
          </template>
          <template #reference>
            <el-icon :size="24"><Setting /></el-icon>
          </template>
        </el-popover>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useUserStore } from '../store/user';
import { get_zh_TW_map } from '@/utils/dictionary.js';

let user = useUserStore();
let time = ref(new Date().toLocaleString());

setInterval(new_time, 1000);

function new_time() {
  let date = new Date();
  time.value = date.toLocaleString();
}
</script>

<style scoped>
.header {
  height: 100%;
  background-color: #d7ecff;
  display: flex;
  align-content: center;
  justify-content: space-between;
  font-size: 24px;
}
.item {
  margin: auto;
  display: flex;
}
span {
  padding: 0 8px;
}
.setting {
  margin: 0 16px;
}
.setting:hover svg {
  animation: rotate 5s linear infinite;
  color: #0015ff;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
