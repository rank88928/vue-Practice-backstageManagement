<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="200px">
        <Sidebar />
      </el-aside>
      <el-container>
        <el-header>
          <UserHeader />
        </el-header>

        <el-main :class="{ 'home-bkimg': route.name === 'home' }">
          <PageContainer />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import UserHeader from '@/layouts/UserHeader.vue';
import Sidebar from '@/layouts/Sidebar.vue';
import PageContainer from '@/layouts/PageContainer.vue';
const route = useRoute();
</script>

<style>
.el-container {
  max-height: 100vh;
  overflow: hidden;
}

.el-header {
  --el-header-padding: 0px;
  --el-header-height: 60px;
}

.el-main {
  --el-main-padding: 0px;
  margin-top: 16px;
  height: calc(100vh - 60px);
}
.home-bkimg {
  position: relative;
  margin-top: 0;
}
/* .home-bkimg::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-image: url('@/assets/img/0005.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  opacity: 0.5;
  z-index: -1;
} */
</style>
