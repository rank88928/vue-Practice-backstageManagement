<template>
  <div id="root">
    <Loading v-if="loading.isloading" />
    <Dialog />
    <div class="container">
      <RouterView></RouterView>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { RouterLink, RouterView } from 'vue-router';
import Dialog from '@/components/Dialog.vue';
import Loading from '@/components/Loading.vue';

let loading = reactive({
  isloading: false,
  txt: '',
});
</script>

<style>
#root {
  display: flex;
  width: 100%;
  min-width: 1200px;
  max-height: 100vh;
  height: 100vh;
}

.container {
  width: 100%;
  height: 100vh;
}
</style>
