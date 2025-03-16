<template>
  <div id="root">
    <Loading v-if="loading.isloading" />
    <Dialog :dialog="dialog_config" />
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
import emitter from '@/utils/emitter';
import { ElMessage } from 'element-plus';

let loading = reactive({
  isloading: false,
  txt: '',
});

//對話框配置
let dialog_config = reactive({
  show: false,
  mes: '',
  handleConfirm: () => {},
});

emitter.on('open-dialog', (e) => {
  dialog_config.show = true;
  dialog_config.mes = e.mes;
  dialog_config.handleConfirm = e.handleConfirm;
});

emitter.on('close-dialog', (e) => {
  dialog_config.show = false;
});

emitter.on('loading', (promise) => {
  loading.isloading = true;
  loading.txt = promise.title;

  setTimeout(() => {
    promise.item
      .then(() => {
        alert(promise.success);
      })
      .catch(() => {
        alert(promise.error);
      })
      .finally(() => {
        loading.isloading = false;
      });
  }, 2000);
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
