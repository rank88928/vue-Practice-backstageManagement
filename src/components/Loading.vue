<template>
  <div class="loading-container">
    <n-space>
      <n-spin size="large" class="loading" description="請求處理中" />
    </n-space>
  </div>
</template>

<script></script>

<style scoped>
.loading-container {
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: #4546464a;
  z-index: 9999;
}
.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 50px;
  background-color: #ffffff;
  border-radius: 20px;
}
</style>
