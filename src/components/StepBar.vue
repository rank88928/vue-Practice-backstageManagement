<template>
  <el-steps :active="props.step" align-center finish-status="success" process-status="finish">
    <el-step v-for="(item, index) in data" :key="item.title" :title="item.title" :class="{ 'current-step': index === props.step }">
      <template v-slot:description
        >{{ item.description }}
        <div v-if="time">
          {{ data[index].time }}
        </div>
      </template>
    </el-step>
  </el-steps>
</template>

<script setup>
let props = defineProps(['data', 'step', 'time']);
</script>

<style scoped>
::v-deep(.current-step .el-step__icon) {
  animation: breathing 3s infinite ease-in-out;
}

@keyframes breathing {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.3);
    opacity: 0.9;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
