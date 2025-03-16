<template>
  <div class="mask">
    <div class="product-form">
      <div class="img-box">
        <UploadImg :img="revise_obj.img" @update="user_update_img" />
      </div>

      <div class="form-box">
        <el-form ref="form" :model="revise_obj" :rules="rules">
          <div class="input-box">
            <el-form-item label="識別id" prop="id">
              <el-input v-model="revise_obj.key" disabled />
            </el-form-item>

            <el-form-item label="商品名稱" prop="name">
              <el-input v-model="revise_obj.name" />
            </el-form-item>

            <el-form-item label="產品類別" prop="type">
              <el-select v-model="revise_obj.type" :placeholder="revise_obj.type" size="large">
                <el-option v-for="item in product_type" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>

            <el-form-item label="單價" prop="price">
              <el-input-number v-model="revise_obj.price" :min="0" :max="1000" controls-position="right">
                <template #suffix>
                  <span>元</span>
                </template>
              </el-input-number>
            </el-form-item>

            <el-form-item label="庫存數量" prop="stock">
              <el-input-number v-model="revise_obj.stock" :min="0" :max="1000" controls-position="right">
                <template #suffix>
                  <span>個</span>
                </template>
              </el-input-number>
            </el-form-item>

            <el-form-item label="商品描述" prop="product_text" id="text">
              <el-input v-model="revise_obj.product_text" type="textarea" :style="{ height: '100%' }" />
            </el-form-item>
          </div>
        </el-form>
        <div class="btn-box">
          <el-button type="success" @click.prevent="click_revise(revise_obj)">確定修改</el-button>
          <el-button type="danger" @click.prevent="$emit('cancel')">取消</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, defineEmits } from 'vue';
import emitter from '@/utils/emitter';
import { product_api as product_serve } from '@/api/firebase_db_api';
import UploadImg from '@/components/UploadImg.vue';
import { useProductStore } from '@/store/product';

let props = defineProps(['item']);
let revise_obj = reactive(JSON.parse(JSON.stringify(props.item))); //副本
let emit = defineEmits(['cancel']);
let product_api = product_serve();
let product_store = useProductStore();
//表單類別
let product_type = [
  {
    value: '主菜',
    label: '主菜',
  },
  {
    value: '前菜',
    label: '前菜',
  },
  {
    value: '甜點',
    label: '甜點',
  },
];

//驗證
const rules = reactive({
  id: [{ required: true, message: 'id索引不能為空', trigger: 'blur' }],
  name: [{ required: true, message: '商品名稱不能為空', trigger: 'blur' }],
  type: [{ required: true, message: '類別不能為空', trigger: 'blur' }],
  price: [
    {
      required: true,
      message: '數字不能為空',
      trigger: 'blur',
      type: 'number',
    },
  ],
  stock: [
    {
      required: true,
      message: '庫存數量不能為空',
      trigger: 'blur',
      type: 'number',
    },
  ],
  product_text: [
    {
      max: 1000,
      message: '商品描述不能超過1000字',
      trigger: 'blur',
    },
    {
      min: 5,
      message: '商品描述最少需要5字',
      trigger: 'blur',
    },
  ],
});

function user_update_img(e) {
  revise_obj.img = e;
}

//資料修改
function click_revise(obj) {
  async function revise_data() {
    let revise_data = find_differences(obj, props.item);
    emit('cancel'); //關閉對話框

    await product_api.update_product(props.item.key, revise_data);
    await product_store.get_new_data();
  }

  emitter.emit('open-dialog', {
    mes: '確定上傳?',
    handleConfirm: revise_data,
  });
}

//修改資料差異
function find_differences(new_Data, old_data) {
  let raw_new_data = JSON.parse(JSON.stringify(new_Data));
  let raw_old_data = JSON.parse(JSON.stringify(old_data));
  let differences = {}; //暫存

  // 遍歷屬性比對
  for (let key in raw_new_data) {
    if (raw_new_data.hasOwnProperty(key)) {
      // 只比較自有屬性 原型鍊上的略過
      if (raw_new_data[key] !== raw_old_data[key]) {
        //新舊不一時紀錄下來
        differences[key] = {
          newValue: raw_new_data[key], // 新值
          oldValue: raw_old_data[key], // 舊值
        };
      }
    }
  }

  function get_updated() {
    let differences_data = {};
    for (let key in differences) {
      if (differences.hasOwnProperty(key)) {
        differences_data[key] = differences[key].newValue;
      }
    }
    return differences_data;
  }

  return get_updated();
}
</script>

<style scoped>
.mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.product-form {
  display: flex;
  background: rgb(255, 255, 255);
  padding: 20px;
  border-radius: 8px;
  width: 60%;
  height: 60%;
}

.img-box {
  width: 50%;
}

.form-box {
  width: 50%;
  padding: 0 15px;
  display: flex;
  flex-wrap: wrap;
}

form {
  width: 100%;
  height: 90%;
  display: flex;
  flex-wrap: wrap;
}

.input-box {
  width: 100%;
  display: flex;
  flex-direction: column;
}
.el-form-item {
  width: 100%;
}

::v-deep .el-form-item__label {
  width: 25%;
  flex-shrink: 0;
}
.el-input {
  flex-grow: 1;
}

#text {
  width: 100%;
  display: flex;
  flex-grow: 1 !important;
  margin-bottom: 0;
}

.el-textarea {
  flex-grow: 1 !important;
}
</style>
