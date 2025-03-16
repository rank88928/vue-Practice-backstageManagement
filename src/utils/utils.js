import emitter from './emitter';

//進行promise操作時 啟用loading遮罩
function executeLoading(promise) {
  emitter.emit('loading', promise);
}

//firebase時間戳記轉為UTC+8
function convert_firebase_timestamp_to_UTC8(timestamp) {
  let error_text = '無';

  if (typeof timestamp !== 'object' || timestamp === null) {
    return error_text;
  }
  if (typeof timestamp.seconds !== 'number' || typeof timestamp.nanoseconds !== 'number') {
    return error_text;
  }

  try {
    // 轉換為毫秒級時間戳
    const milliseconds = timestamp.seconds * 1000 + Math.floor(timestamp.nanoseconds / 1e6);

    // 轉換為 UTC+8 時區的時間
    const date = new Date(milliseconds);
    const options = {
      timeZone: 'Asia/Taipei',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
    };

    let formatted_date = new Intl.DateTimeFormat('zh-TW', options).format(date);

    return formatted_date;
  } catch (error) {
    console.log(error + '時間戳格式解析異常');
    return error_text;
  }
}

//映射字典
const dictionary = {
  permission_type: {
    superAdmin: '超級管理員',
    generalUser: '普通會員',
  },

  data_type_label: {
    order: '訂單管理',
    account: '帳號管理',
    product: '商品管理',
  },

  data_permission_label: {
    create: '新增資料',
    delete: '刪除資料',
    update: '修改資料',
    read: '查詢資料',
  },

  order_status: {
    pending: '待確認',
    processing: '處理中',
    finish: '已完成',
  },
  isListed: {
    true: '正在上架',
    false: '已下架',
  },
};

/**
 *
 * @param {string} category 給定字典中的查找種類名稱
 * @param {string} key 比對值
 * @param {string} defaultValue 失敗默認返回'未知'
 * @returns
 */
function get_zh_TW_map(category, key, defaultValue = '未知') {
  return dictionary[category]?.[key] ?? defaultValue;
}

async function delay_time(ms) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

export { executeLoading, convert_firebase_timestamp_to_UTC8, get_zh_TW_map, delay_time };
