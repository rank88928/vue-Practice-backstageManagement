<template>
  <div class="card">
    <div class="img-box">
      <span>圖片:</span>
      <img :src="item.img" />
    </div>
    <div class="data-box">
      <div class="product-attributes">
        <div class="column">
          <span>商品名稱:</span>
          <el-tooltip :content="item.name" placement="top">
            <el-input v-model="item.name" :title="item.name" disabled />
          </el-tooltip>
        </div>
        <div class="column">
          <span>商品id:</span>
          <el-tooltip :content="item.id" placement="top">
            <el-input-number v-model="item.id" disabled />
          </el-tooltip>
        </div>
        <div class="column">
          <span>類別:</span>
          <el-tooltip :content="item.type" placement="top">
            <el-input v-model="item.type" disabled />
          </el-tooltip>
        </div>
        <div class="column">
          <span>單價:</span>
          <el-tooltip :content="item.price" placement="top">
            <el-input-number v-model="item.price" disabled />
          </el-tooltip>
        </div>
        <div class="column">
          <span>庫存數量:</span>
          <el-tooltip :content="item.stock" placement="top">
            <el-input-number v-model="item.stock" disabled />
          </el-tooltip>
        </div>
      </div>
      <div class="description">
        <span>商品描述:</span>
        <el-input v-model="item.product_text" disabled type="textarea" :style="{ height: '80%' }" />
      </div>
    </div>
    <div class="btn-box">
      <el-button type="primary" size="large">商品上架</el-button>
      <el-button type="primary" size="large">商品下架</el-button>
      <el-button type="warning" size="large" @click="revise_product_module = true">修改資料</el-button>
      <el-button type="danger" size="large" @click="delete_product">刪除</el-button>
    </div>

    <ReviseProduct v-if="revise_product_module" @cancel="revise_product_module = false" :item="item" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ReviseProduct from './ReviseProduct.vue';
import { delete_product as delete_api } from '@/api/firebase_db_api';
import emitter from '@/utils/emitter';
let props = defineProps(['item']);

let revise_product_module = ref(false);

function delete_product() {
  function delete_data() {
    return delete_api(props.item.key);
  }

  //呼叫對話框
  emitter.emit('open-dialog', {
    mes: '確定刪除?',
    handleConfirm: delete_data,
  });
}
// isted/ unlisted
function isListed() {}

//全轉換成字串 el-input只接受字串格式 圖片不用
// const product = computed(() => ({
//   id: props.item?.id?.toString() ?? '',
//   name: props.item?.name.toString() ?? '',
//   type: props.item?.type.toString() ?? '',
//   price: props.item?.price?.toString() ?? '',
//   stock: props.item?.stock?.toString() ?? '',
// }));
</script>

<style scoped>
.card {
  display: flex;
  background-color: #f5f5f5;
  margin: 16px 16px 0 16px;
  width: 100%;
  height: 200px;
  padding: 8px;
  border-radius: 15px;
}

.img-box {
  width: 30%;
  display: flex;
  flex-wrap: wrap;
}
.img-box span {
  width: 100%;
}
.img-box img {
  width: 85%;
  height: 85%;
  border: 1px solid #636363;
  border-radius: 15px;
  object-fit: contain;
}

.data-box {
  width: 50%;
  display: flex;
  flex-wrap: wrap;
}

.product-attributes {
  display: flex;
  flex-wrap: wrap;
  width: 40%;
}
.product-attributes .column {
  display: flex;
  width: 100%;
  margin: 2px 0;
}
.product-attributes .column span {
  flex-shrink: 0;
  line-height: 32px;
}
.description {
  width: 55%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding-left: 8px;
}
.description span {
  height: 20px;
}
::v-deep(.el-textarea__inner) {
  resize: none;
  height: 100%;
}
.el-input {
  margin-left: 8px;
  flex-grow: 1;
}

.btn-box {
  display: flex;
  flex-wrap: wrap;
  width: 20%;
}

.btn-box button {
  font-size: 16px !important;
  justify-content: space-evenly;
  margin: 0;
  width: 90px;
}
</style>
