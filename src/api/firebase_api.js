import * as firebase from './firebase_config';
import { ElMessage } from 'element-plus';
import { ElLoading } from 'element-plus';
let api = firebase.firestore_api; //官方api接口
let db = firebase.firestore_api.db; //指定資料庫

//請求響應攔截
async function intercepting_responses(promise) {
  const loadingInstance = ElLoading.service({
    lock: true,
    text: '等候響應中...',
    background: 'rgba(0, 0, 0, 0.7)',
  });

  try {
    let result = await promise;
    return result;
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  } finally {
    loadingInstance.close();
  }
}

//拿集合
async function get_all_data(path) {
  try {
    let dbRef = api.collection(db, path);
    let querySnapshot = await intercepting_responses(api.getDocs(dbRef));

    if (querySnapshot.empty) {
      console.error('該集合中沒有文件');
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

//拿單一
async function get_single_data(path, docid) {
  try {
    let dbRef = api.doc(db, path, docid);
    let doc = await intercepting_responses(api.getDoc(dbRef));

    return doc.data();
  } catch (error) {
    throw error;
  }
}

//新增'文件'
async function add_data(path, data, show = true) {
  try {
    let dbRef = api.doc(api.collection(db, path)); //配給唯一欄位key名稱

    await api.setDoc(dbRef, data);
    if (show) ElMessage.success('新增成功');
  } catch (error) {
    if (show) ElMessage.error('新增失敗');
    throw error;
  }
}
//新增'自定義名'
async function add_customId_data(path, data, id, show = true) {
  try {
    let dbRef = api.doc(db, path, id); //配給唯一欄位key名稱

    await api.setDoc(dbRef, data);
    if (show) ElMessage.success('新增成功');
  } catch (error) {
    if (show) ElMessage.error('新增失敗');
    throw error;
  }
}

async function delete_data(path, docid) {
  try {
    let dbRef = api.doc(db, path, docid);

    await intercepting_responses(api.deleteDoc(dbRef));
    ElMessage.success('刪除成功');
  } catch (error) {
    ElMessage.error('刪除失敗');
    console.error('刪除失敗');
    throw error;
  }
}

async function update_data(path, docid, data, show = true) {
  try {
    let dbRef = api.doc(db, path, docid);

    await intercepting_responses(api.updateDoc(dbRef, data));
    if (show) ElMessage.success('修改成功');
  } catch (error) {
    if (show) ElMessage.error('修改失敗');
    console.error('修改失敗');
    throw error;
  }
}

// 拿特定資料庫當前總資料數
async function get_total_count(path) {
  try {
    let data = await get_all_data(path);

    return data.length;
  } catch (error) {
    console.error('查詢總筆數錯誤' + error);
  }
}

export { get_all_data, get_single_data, get_total_count, add_data, add_customId_data, delete_data, update_data };
