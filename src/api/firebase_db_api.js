import * as firebase from './firebase_config';
import { serverTimestamp } from 'firebase/firestore';
import { ElMessage } from 'element-plus';
import { convert_firebase_timestamp_to_UTC8, delay_time } from '@/utils/utils.js';

let api = firebase.firestore_api; //官方api接口
let db = firebase.firestore_api.db; //指定資料庫

//響應錯誤攔截
async function intercepting_responses(promise) {
  try {
    return await promise;
  } catch (error) {
    console.log(error);
    return Promise.reject(error);
  }
}

//get 拿集合
async function get_all_data(path) {
  try {
    let dbRef = api.collection(db, path);
    let querySnapshot = await intercepting_responses(api.getDocs(dbRef));

    if (querySnapshot.empty) {
      console.log('該集合中沒有文件');
      return [];
    }

    let data = [];
    querySnapshot.forEach((docSnap) => {
      data.push(docSnap.data());
      data[data.length - 1].key = docSnap.id;
    });
    return data;
  } catch (error) {
    throw error;
  }
}

//get 拿單一
async function get_single_data(path, docid) {
  try {
    let dbRef = api.doc(db, path, docid);
    let doc = await intercepting_responses(api.getDoc(dbRef));

    return doc.data();
  } catch (error) {
    throw error;
  }
}

//add
async function add_data(path, data, show = true) {
  try {
    let dbRef = api.doc(api.collection(db, path)); //配給唯一欄位key名稱

    await api.setDoc(dbRef, data);
    if (show) ElMessage.success('新增操作成功');
  } catch (error) {
    if (show) ElMessage.success('新增操作失敗');
    throw error;
  }
}

//delete
async function delete_data(path, docid) {
  try {
    let dbRef = api.doc(db, path, docid);

    await intercepting_responses(api.deleteDoc(dbRef));
    ElMessage.success('刪除操作成功');
  } catch (error) {
    ElMessage.error('刪除操作失敗');
    console.log('刪除失敗');
    throw error;
  }
}

//update
async function update_data(path, docid, data, show = true) {
  try {
    let dbRef = api.doc(db, path, docid);

    await intercepting_responses(api.updateDoc(dbRef, data));
    if (show) ElMessage.success('修改操作成功');
  } catch (error) {
    if (show) ElMessage.error('修改操作失敗');
    console.log('修改失敗');
    throw error;
  }
}

let order_api = () => {
  let path = 'order_data';

  //輔助函數
  //建立新資料流程
  async function fill_basic_info(builder) {
    async function generate_index(order_log) {
      function string_date() {
        const today = new Date();
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const day = today.getDate().toString().padStart(2, '0');
        return `${year}${month}${day}`;
      }

      let now = string_date();
      if (now === order_log.date) {
        let i = order_log.index + 1;
        await update_data('config', 'order', { index: i });
        return `${now}-${i.toString().padStart(3, '0')}`;
      } else {
        await update_data('config', 'order', { date: now, index: 0 });
        return `${now}+${0}`;
      }
    }

    let data = {
      order_id: -1,
      builder: '',
      build_time: '',
    };

    try {
      let order_log = await get_single_data('config', 'order');

      let index = await generate_index(order_log);
      console.log(index);
      data.order_id = index;
      data.builder = builder;
      data.build_time = serverTimestamp();

      return data;
    } catch (error) {
      console.log('建立訂單基本資料失敗' + error);
      throw error;
    }
  }
  function init_schedule() {
    let data = {
      status: 'pending',
      time_line: {},
    };
    generate_state_log(data.time_line, 'pending');

    return data;
  }

  function generate_state_log(time_line, text) {
    if (text !== 'pending' && text !== 'processing' && text !== 'finish') {
      throw new Error('傳入狀態不合法');
    }
    let id = Date.now();
    time_line[id] = {
      state: text,
      time: serverTimestamp(),
    };
  }

  async function generate_product_content(arr) {
    let index = arr.map((item) => item.id);
    let processed_data = [];
    let product_data = [];
    try {
      product_data = await product_api().get_selected_product_data(index);
    } catch (error) {
      throw error;
    }

    arr.forEach((item) => {
      if (item.order_sum > 0) {
        let use_data = product_data.find((i) => {
          return i.key === item.id;
        });
        let product = {
          id: item.id,
          name: use_data.name,
          price: use_data.price,
          order_sum: item.order_sum,
        };
        product.subtotal = product.price * product.order_sum;

        processed_data.push(product);
      } else {
        throw new Error(`無效的購買數量: ${item.order_sum}`);
      }
    });

    return processed_data;
  }

  function compute_order_total_price(arr) {
    let total_price = 0;
    arr.forEach((item, index) => {
      if (isNaN(item.subtotal)) {
        throw new Error(`購買清單第${index + 1}項不存在小計`);
      }
      total_price += item.subtotal;
    });
    return total_price;
  }

  async function change_state(raw_state, new_state, id) {
    let data = await get_single_data(path, id);
    let schedule = data.order_details.schedule;

    if (schedule.status !== raw_state) {
      return;
    }
    generate_state_log(schedule.time_line, new_state);

    update_data(path, id, {
      'order_details.schedule': {
        status: new_state,
        time_line: schedule.time_line,
      },
    });
  }

  async function get_format_item(id) {
    let data = await get_single_data(path, id);
    let arr_data = format_data([data]);
    arr_data[0].key = id;
    return arr_data[0];
  }
  //格式化db回傳結構
  function format_data(data) {
    //轉換時間格式
    data.forEach((item) => {
      item.basic.build_time = convert_firebase_timestamp_to_UTC8(item.basic.build_time);

      let time_line = item.order_details.schedule.time_line;
      let new_format = [];

      for (let key in time_line) {
        if (time_line.hasOwnProperty(key)) {
          time_line[key].time = convert_firebase_timestamp_to_UTC8(time_line[key].time);
          new_format.push(time_line[key]);
        }
      }
      item.order_details.schedule.time_line = new_format;
    });
    return data;
  }

  return {
    add_order: async function (builder, order_data) {
      let new_data = {
        order_details: {},
      };

      try {
        new_data.basic = await fill_basic_info(builder);
        console.log(new_data);
        new_data.order_details.schedule = init_schedule();
        new_data.order_details.product_content = await generate_product_content(order_data);
        new_data.order_details.total_price = compute_order_total_price(new_data.order_details.product_content);

        await add_data(path, new_data);
      } catch (error) {
        console.log('建立訂單失敗' + error);
        throw error;
      }
    },

    get_all_order_data: async function () {
      try {
        let data = await get_all_data(path);
        return format_data(data);
      } catch (error) {
        console.log(error);
      }
    },

    get_order_data: async function (id) {
      let data = await get_single_data(path, id);

      return data;
    },
    order_verify: async function (id) {
      //待處理狀態->處理中
      await change_state('pending', 'processing', id);
      await delay_time(500);
      return await get_format_item(id);
    },

    order_fulfill: async function (id) {
      //處理中狀態->完成鎖定
      await change_state('processing', 'finish', id);
      await delay_time(500);
      return await get_format_item(id);
    },
  };
};

export { order_api };
