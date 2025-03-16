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

        <el-main>
          <PageContainer />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import UserHeader from '@/layouts/UserHeader.vue';
import Sidebar from '@/layouts/Sidebar.vue';
import PageContainer from '@/layouts/PageContainer.vue';
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
</style>
