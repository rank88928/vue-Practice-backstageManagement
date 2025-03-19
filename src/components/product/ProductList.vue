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
          <el-input v-model="show_data.name" :title="item.name" disabled />
        </div>

        <div class="column">
          <span>商品id:</span>
          <el-input v-model="show_data.id" disabled />
        </div>

        <div class="column">
          <span>類別:</span>
          <el-input v-model="show_data.type" disabled />
        </div>

        <div class="column">
          <span>單價:</span>
          <el-input v-model="show_data.price" disabled />
        </div>

        <div class="column">
          <span>庫存數量:</span>
          <el-input v-model="show_data.stock" disabled />
        </div>
      </div>
      <div class="description">
        <span>商品描述:</span>
        <el-input v-model="show_data.product_text" disabled type="textarea" :style="{ height: '80%' }" />
      </div>
    </div>
    <div class="btn-box">
      <el-button v-permission="['superAdmin', 'admin']" type="primary" size="large" :disabled="item.isListed" @click="revise_isListed('listed')">商品上架</el-button>

      <el-button v-permission="['superAdmin', 'admin']" type="primary" size="large" :disabled="!item.isListed" @click="revise_isListed('unlisted')">商品下架</el-button>

      <el-button v-permission="['superAdmin', 'admin']" type="warning" size="large" @click="check_status_before_revise(item.isListed)">修改資料</el-button>

      <el-button v-permission="['superAdmin', 'admin']" type="danger" size="large" @click="delete_product">刪除</el-button>
    </div>

    <ReviseProduct v-if="revise_module_show" @cancel="revise_module_show = false" :item="item" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import ReviseProduct from './ReviseProduct.vue';
import { product_api } from '@/api/firebase_product_api';
import emitter from '@/utils/emitter';
import { useProductStore } from '@/store/product';

let product_store = useProductStore();
let revise_module_show = ref(false);
let props = defineProps(['item']);

//刪除商品
function delete_product() {
  async function delete_data() {
    await product_api.delete_product(props.item.key);
    product_store.get_new_data();
  }

  //呼叫對話框
  emitter.emit('open-dialog', {
    mes: '確定刪除?',
    handleConfirm: delete_data,
  });
}

//修改上下架
function revise_isListed(action) {
  let state = props.item.isListed;

  async function revise_state() {
    try {
      await product_api.update_product(props.item.key, { isListed: state });
      product_store.get_new_data();
    } catch (error) {
      throw error;
    }
  }

  if ((action === 'listed' && state === false) || (action === 'unlisted' && state === true)) {
    //點擊上架且狀態為下架 或相反
    state = !state;

    emitter.emit('open-dialog', {
      mes: '確定修改?',
      handleConfirm: revise_state,
    });
  } else {
    alert('當前狀態相同');
  }
}

//全轉換成字串 el-input只接受字串格式 圖片不用
const show_data = computed(() => ({
  id: props.item?.id?.toString() ?? '',
  name: props.item?.name?.toString() ?? '',
  type: props.item?.type?.toString() ?? '',
  price: props.item?.price?.toString() ?? '',
  stock: props.item?.stock?.toString() ?? '',
  product_text: props.item?.product_text?.toString() ?? '',
}));
</script>

<style scoped>
.card {
  display: flex;
  background-color: #f5f5f596;
  margin: 16px 0;
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
