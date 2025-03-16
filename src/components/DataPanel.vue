<template>
  <div class="container">
    <div class="panel-box">
      <div class="item" v-for="(item, index) in data.item" :key="item.title">
        <el-icon :style="{ color: item.color }" :size="40"> <component :is="item.icon" /></el-icon>
        <el-statistic :title="item.title" :value="anim_values[index]" />
      </div>
    </div>
    <div class="btn-box">
      <slot name="btn"></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useTransition } from '@vueuse/core';

let props = defineProps(['data']);

//根據傳入項目數設定 動態效果的數字數量
let init_value = ref(Array(props.data.item.length).fill(0));
//動態效果 數組當中每個數字都會由0逐漸增加到最終值
const anim_values = useTransition(init_value, { duration: 1000 });

watch(
  () => props.data.source,
  () => {
    props.data.item.forEach((item, index) => {
      init_value.value[index] = props.data.source.filter(item.filter).length;
    });
  },
  { deep: true }
);
</script>

<style scoped>
.container {
  display: flex;
  height: 100%;
  background-color: #d7ecff;
}

.panel-box,
.btn-box {
  display: flex;
  width: 50%;
}

.panel-box {
  align-items: center;
  justify-content: center;
}
.panel-box .item {
  display: flex;
  margin: 8px;
}

.btn-box {
  align-items: center;
}
</style>
