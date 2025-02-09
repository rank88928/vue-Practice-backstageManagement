import { da } from 'element-plus/es/locales.mjs';
import * as firebase from './firebase_init';

let api = firebase.firestore_api; //官方api接口
let db = firebase.firestore_api.db; //指定資料庫

//get dbRef參照
function get_all_firebase_api(path) {
  let dbRef = api.collection(db, path);

  return api.getDocs(dbRef);
}

//delete dbRef參照
function delete_api(path, key) {
  let dbRef = api.doc(db, path, key);

  return api.deleteDoc(dbRef);
}

//update dbRef參照
function update_api(path, key, data) {
  let dbRef = api.doc(db, path, key);

  return api.updateDoc(dbRef, data);
}

//應用層封裝

//拿取全部商品資料
function get_all_products_data() {
  let path = 'product';

  return get_all_firebase_api(path)
    .then((querySnapshot) => {
      if (querySnapshot.empty) {
        console.log('集合中沒有文件');
        return [];
      } else {
        let data = [];
        querySnapshot.forEach((docSnap) => {
          data.push(docSnap.data());
          data[data.length - 1].key = docSnap.id;
        });
        return data;
      }
    })
    .catch((error) => {
      console.error('讀取資料錯誤:', error);
      throw error;
    });
}

//拿取全部商品資料的總筆數
function get_all_products_count() {
  let path = 'product';
  return get_all_firebase_api(path)
    .then((querySnapshot) => {
      if (querySnapshot.empty) {
        console.log('集合中沒有文件');
        return 0;
      } else {
        return querySnapshot.docs.length;
      }
    })
    .catch((error) => {
      console.error('讀取資料錯誤:', error);
      throw error;
    });
}

// function get_all_product() {
//   let product_data = api.doc(db, 'product', 'product1'); //目標路徑
//   let promise = api.getDoc(product_data); //返回promise

//   return promise
//     .then((docSnap) => {
//       if (docSnap.exists()) {
//         // console.log(docSnap.data());
//         // return docSnap.data(); // 返回數據
//       } else {
//         console.log('文件不存在');
//         return [];
//       }
//     })
//     .catch((error) => {
//       console.error('讀取資料錯誤:', error);
//       throw error;
//     });
// }

//新增單一商品
function add_product_to_database(product) {
  let dbRef = api.doc(api.collection(db, 'product')); //配給唯一欄位key名稱

  return get_all_products_count().then((value) => {
    product.id = value + 1;
    return api
      .setDoc(dbRef, product)
      .then(() => {
        console.log('產品已成功添加到資料庫');
      })
      .catch((error) => {
        console.error('新增產品失敗: ', error);
      });
  });
}

//修改指定商品資料
function update_product(key, data) {
  let path = 'product';

  return update_api(path, key, data);
}

//刪除單項商品資料
function delete_product(key) {
  let path = 'product';

  return delete_api(path, key)
    .then(() => {
      console.log(`商品: ${key} 刪除成功`);
    })
    .catch((error) => {
      console.error('刪除商品失敗:', error);
    });
}

export { add_product_to_database, get_all_products_data, get_all_products_count, delete_product };
