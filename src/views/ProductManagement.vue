<template>
  <div class="item-container">
    <div class="data-container">
      <div class="data-panel">
        <div class="item">
          <el-icon :size="icon.size"><Tickets /></el-icon>
          <el-statistic title="已創建的商品數量" :value="outputValue" />
        </div>
        <div class="item">
          <el-icon :size="icon.size"><CircleCheck /></el-icon>
          <el-statistic title="目前上架數量" :value="outputValue" />
        </div>
        <div class="item">
          <el-icon :size="icon.size"><CircleClose /></el-icon>
          <el-statistic title="目前下架數量" :value="outputValue" />
        </div>
      </div>
      <div class="data-btn">
        <el-button type="primary" size="large">已上架商品列表</el-button>
        <el-button type="primary" size="large">下架商品列表</el-button>
        <el-button type="primary" size="large" plain @click="showModal = true">新增商品</el-button>
      </div>
    </div>

    <ul class="list-container">
      <li class="item" v-for="item in data" :key="item.key">
        <ProductLise :item="item" />
      </li>
      <!-- <li>
        <ProductLise :item="item" />
      </li> -->
    </ul>
  </div>
  <AddProduct v-if="showModal" @cancel="showModal = false" />
</template>

<script setup>
import { ref, reactive, watch } from 'vue';
import * as db_api from '@/api/firebase_db_api';
import AddProduct from '@/components/AddProduct.vue';
import ProductLise from '@/components/ProductLise.vue';

import { useTransition } from '@vueuse/core';

let data = reactive([]);
let showModal = ref(false);

let icon = {
  size: '40px',
};

let data_panel_all = ref(0);

const outputValue = useTransition(data_panel_all, {
  duration: 1500,
});

watch(data, (newValue) => {
  data_panel_all.value = newValue.length;
});

db_api
  .get_all_products_data()
  .then((value) => {
    console.log('讀取商品資料成功');
    value.forEach((item) => {
      data.push(item);
    });
  })
  .catch((error) => {
    console.error('讀取資料錯誤:', error);
    throw error;
  });
</script>

<style scoped>
.data-container {
  display: flex;
  height: 100px;
}

.data-panel,
.data-btn {
  display: flex;
  width: 50%;
}

.data-panel {
  align-items: center;
  justify-content: center;
}

.data-panel .item {
  display: flex;
  margin: 8px;
}

.item-container .data-panel .item:nth-child(1) .el-icon {
  color: #22c3e6;
}
.item-container .data-panel .item:nth-child(2) .el-icon {
  color: #70cf42;
}
.item-container .data-panel .item:nth-child(3) .el-icon {
  color: #df5620;
}
.item-container {
  margin-top: 80px;
  width: 100%;
  background-color: #f5f5f5;
  padding: 16px;
}
.list-container {
  width: 100%;
  min-height: 0;
  height: calc(100vh - 80px - 24px);
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  overflow: auto;
}

.list-container .item {
  display: flex;
  width: 100%;
}
</style>
