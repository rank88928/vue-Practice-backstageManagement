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

async function delay_time(ms) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

export { executeLoading, convert_firebase_timestamp_to_UTC8, delay_time };
