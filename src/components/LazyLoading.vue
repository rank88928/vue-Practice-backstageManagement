<template>
  <div class="el-loading-spinner">
    <div v-if="state.logo_show">
      <svg class="circular" viewBox="-10, -10, 50, 50">
        <path class="path" d="M 30 15 L 28 17 M 25.61 25.61 A 15 15, 0, 0, 1, 15 30 A 15 15, 0, 1, 1, 27.99 7.5 L 15 15" style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"></path>
      </svg>
    </div>

    <p class="el-loading-text">{{ state.text }}</p>
  </div>
</template>

<script setup>
let props = defineProps(['state']);
</script>

<style scoped>
.el-loading-spinner {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
  padding: 0;
  top: 0;
  bottom: 0;
}
p {
  height: 60px;
  line-height: 60px;
}
</style>
