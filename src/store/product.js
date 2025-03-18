import { defineStore } from 'pinia';
import { product_api } from '@/api/firebase_product_api';

export let useProductStore = defineStore('product', {
  state: () => ({
    data: {
      all: [],
      listed: [],
      unlisted: [],
    },
  }),

  actions: {
    get_new_data: async function () {
      let new_data = await product_api.get_all_data();
      this.data.all.length = 0;
      this.data.all.splice(0, 0, ...new_data);
      this.data_filter();
    },

    data_filter: function () {
      this.data.listed.length = 0;
      this.data.unlisted.length = 0;

      this.data.all.forEach((item) => {
        if (item.isListed === true) {
          this.data.listed.push(item);
        } else {
          this.data.unlisted.push(item);
        }
      });
    },
  },
});
