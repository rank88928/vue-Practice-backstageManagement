import * as firebase from './firebase_config';
import { serverTimestamp } from 'firebase/firestore';
import { ElMessage } from 'element-plus';
import { convert_firebase_timestamp_to_UTC8, delay_time } from '@/utils/utils.js';

import data from '@/assets/sightseeing_data/新北-景點.json';

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

let filteredData;

//景點資料格式化
function travel_format() {
  let new_attractions_data;

  new_attractions_data = data.map((item) => {
    return {
      name: item.ScenicSpotName,
      address: item.Address,
      description: item.Description,
      picture_url: item.Picture.PictureUrl1,
    };
  });

  filteredData = new_attractions_data.filter((item) => item.address && item.description && item.picture_url);
}
//上傳
async function travel_upload() {
  const docRef = api.doc(db, 'sightseeing', 'NewTaipei'); // 指定 NewTaipei 文件

  try {
    await api.setDoc(docRef, {
      attractions: api.arrayUnion(...filteredData), // 追加多筆資料
    });

    ElMessage.success('資料成功推送！');
  } catch (error) {
    ElMessage.error('推送失敗');
    console.error(error);
  }
}

function travel_api() {
  let path = 'sightseeing';

  return {
    get_all_travel_data: async function () {
      try {
        let data = await get_all_data(path);

        return {
          attractions: data[0].attractions,
          key: data[0].key,
        };
      } catch (error) {
        console.error(error);
      }
    },
  };
}

export { travel_format, travel_upload, travel_api };
