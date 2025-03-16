import { defineStore } from 'pinia';
import { product_api as product_serve } from '@/api/firebase_db_api';

let product_api = product_serve();

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
      this.data.all.length = 0;
      let new_data = await product_api.get_all_product_data();
      this.data.all.splice(0, this.data.length, ...new_data);
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
