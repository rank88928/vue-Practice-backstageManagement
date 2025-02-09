<template>
  <n-message-provider>
    <n-dialog-provider>
      <div id="root">
        <Loading v-if="loading.isloading" />
        <Sidebar />
        <PageContainer />
        <Dialog :dialog="dialog_config" />
      </div>
    </n-dialog-provider>
  </n-message-provider>
</template>

<script setup>
import { ref, reactive } from 'vue';
// import * as firebase from '../public/firebase_init';
import Sidebar from '@/components/Sidebar.vue';
import PageContainer from '@/components/PageContainer.vue';
import Dialog from '@/components/Dialog.vue';
import Loading from '@/components/Loading.vue';
import emitter from '@/utils/emitter';

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
  height: 100%;
  min-width: 1200px;
}
</style>
