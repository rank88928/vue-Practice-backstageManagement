<template>
  <el-dialog v-model="props.dialog.show" title="操作提示" width="500" align-center :close-on-click-modal="false" :close-on-press-escape="false" :lock-scroll="true" :show-close="false" destroy-on-close>
    <span>{{ props.dialog.mes }}</span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="handleConfirm">確定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import emitter from '@/utils/emitter';
import { ElLoading } from 'element-plus';

let props = defineProps(['dialog']);

function handleConfirm() {
  // 顯示遮罩
  const loadingInstance = ElLoading.service({
    lock: true,
    text: '等候處理響應...',
    background: 'rgba(0, 0, 0, 0.7)',
  });

  Promise.resolve()
    .then(() => props.dialog.handleConfirm()) // 保證同步函數也能進入 Promise 流程
    .then(() => {
      setTimeout(() => {
        alert('操作成功');
      }, 1000);
    })
    .catch(() => {
      setTimeout(() => {
        alert('操作失敗');
      }, 1000);
    })
    .finally(() => {
      close(); //統一關閉
      setTimeout(() => {
        loadingInstance.close();
      }, 700);
    });
}

// 通知app關閉
function close() {
  emitter.emit('close-dialog', false);
}
</script>
