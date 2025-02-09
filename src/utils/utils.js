import emitter from './emitter';

//進行promise操作時 啟用loading遮罩
function executeLoading(promise) {
  emitter.emit('loading', promise);
}

export { executeLoading };
