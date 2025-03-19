import { get_all_data, get_total_count, add_data, delete_data, update_data } from '@/api/firebase_api';
import { ElMessage } from 'element-plus';
const path = 'product';

function id_prohibited_update(id) {
  let id_arr = [
    '27GlDBYCAKKMe99mpwJG',
    '5qo76klVthzNtGfOIAAp',
    'FyY8sUOozIlDvUAuXhoS',
    'GShgcCSYOvBbnZyoMzSB',
    'NPc5bRGnDeLkZmpVv6jp',
    'NRHZay7UHOj8ARKyDIkl',
    'PObxVgzKSH82YckfL3gf',
    'RUwgo80oJ5r4OsdyXdh9',
    'WmcG8Lsnyb6Llxa9FUfX',
    'alBSHO2NgZkGMgiATzuL',
    'bgOBIZTW473Gg7PEuHiD',
    'qN4Q3R79JLAl4hzeqPAS',
    'yPZ6Nig12l8Cdu6REoY1',
    'yz1hRVJ9ea0fcP3ajBsQ',
    // 'yuabuZMsvJF2F0rbtCBo',
  ];
  if (id_arr.includes(id)) {
    ElMessage.error('該商品為限制項 沒有權限修改 請使用自訂新增項目測試');
    return true;
  } else {
    return false;
  }
}

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
    if (id_prohibited_update(docid)) {
      return;
    }
    try {
      await update_data(path, docid, data);
    } catch (error) {
      throw error;
    }
  },

  //刪除指定商品項
  delete_product: async (docid) => {
    if (id_prohibited_update(docid)) {
      return;
    }
    try {
      await delete_data(path, docid);
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
