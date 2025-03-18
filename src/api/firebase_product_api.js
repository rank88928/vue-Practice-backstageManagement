import { get_all_data, get_total_count, add_data, delete_data, update_data } from '@/api/firebase_api';

const path = 'product';

let product_api = {
  get_all_data: async () => {
    try {
      return await get_all_data(path);
    } catch (error) {
      console.error(error);
    }
  },

  get_all_count: async function () {
    try {
      let length = await get_total_count(path);
      return length;
    } catch (error) {
      throw error;
    }
  },
  //新增商品項
  add_product: async function (data) {
    try {
      let id = await this.get_all_count();
      data.id = id + 1;

      await add_data(path, data);
    } catch (error) {
      throw error;
    }
  },

  //修改指定商品資料
  update_product: async (docid, data) => {
    try {
      await update_data(path, docid, data);
      update_ui();
    } catch (error) {
      throw error;
    }
  },

  //刪除指定商品項
  delete_product: async (docid) => {
    try {
      await delete_data(path, docid);
      update_ui();
    } catch (error) {
      throw error;
    }
  },
  //根據索引數組返回對應資料數組
  get_indexArr_product_data: async function (arr) {
    let data = await this.get_all_data();
    let hash = new Set(arr);

    let selected_data = data.filter((item) => hash.has(item.key));

    //總數不相符
    if (selected_data.length !== arr.length) {
      throw new Error('部分商品資料未找到，請確認id是否正確');
    }

    return selected_data;
  },
};

export { product_api };
