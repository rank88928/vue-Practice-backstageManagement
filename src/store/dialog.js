import { defineStore } from 'pinia';

export let useDialogStore = defineStore('dialog', {
  state: () => ({
    show: false,
    title: '操作提示',
    mes_text: '',
    handleConfirm: null,
  }),

  actions: {
    call_dialog(title, mes_text, handleConfirm) {
      this.show = true;
      this.title = title;
      this.mes_text = mes_text;
      this.handleConfirm = handleConfirm;
    },

    clear_dialog() {
      this.show = false;
      this.title = '操作提示';
      this.mes_text = '';
      this.handleConfirm = null;
    },
    click_confirm() {
      if (typeof this.handleConfirm === 'function') {
        this.handleConfirm();
      }
      this.clear_dialog();
    },
  },
});
