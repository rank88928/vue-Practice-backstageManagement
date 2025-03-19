<template>
  <el-dialog v-model="dialog_store.show" :title="dialog_store.title" width="500" align-center :close-on-click-modal="false" :close-on-press-escape="false" :lock-scroll="true" :show-close="false" destroy-on-close>
    <span>{{ dialog_store.mes_text }}</span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialog_store.clear_dialog()">取消</el-button>
        <el-button type="primary" @click="dialog_store.click_confirm()">確定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { useDialogStore } from '@/store/dialog.js';
let dialog_store = useDialogStore();
</script>
