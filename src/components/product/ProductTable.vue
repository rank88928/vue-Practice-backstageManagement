<template>
  <el-table :data="data" :row-key="'key'" v-if="true" style="width: 90%" border>
    {{ data }}
    <el-table-column type="index" width="50" />
    <el-table-column sortable prop="id" label="商品建立序號" />
    <el-table-column sortable prop="name" label="商品名" />
    <el-table-column sortable prop="type" label="類別" :filters="filters_options.type" :filter-method="filter_type" />
    <el-table-column sortable prop="isListed" label="上架狀態" :filters="filters_options.isListed" :filter-method="filter_isListed">
      <template #default="scope">
        <el-button :type="scope.row.isListed ? 'success' : 'danger'" plain disabled class="is-listed">
          {{ get_zh_TW_map('isListed', scope.row.isListed) }}
        </el-button>
      </template>
    </el-table-column>
    <el-table-column sortable prop="price" label="售價" :filters="filters_options.price" :filter-method="filter_price" />
    <el-table-column sortable prop="stock" label="存量" :filters="filters_options.stock" :filter-method="filter_stock" />

    <!-- 骨架屏-->
    <template #empty v-if="is_loading_skeleton">
      <div class="skeleton">
        <el-skeleton :rows="2" animated />
      </div>
    </template>
  </el-table>
</template>

<script setup>
import { ref } from 'vue';
import { get_zh_TW_map } from '@/utils/dictionary.js';
let props = defineProps(['data']);
//表單插槽好像會自動替換掉 暫時留存測試
let is_loading_skeleton = ref(true);

//表單篩選
let filters_options = {
  type: [
    { text: '主菜', value: '主菜' },
    { text: '甜點', value: '甜點' },
    { text: '前菜', value: '前菜' },
  ],
  isListed: [
    { text: '上架', value: true },
    { text: '下架', value: false },
  ],
  price: [
    { text: '<100', value: 'lt_100' },
    { text: '100~500', value: '100_500' },
    { text: '501~1000', value: '501_1000' },
    { text: '>1000', value: 'gt_1000' },
  ],
  stock: [
    { text: '<50', value: 'lt_50' },
    { text: '50~100', value: '50_100' },
    { text: '>100', value: 'gt_100' },
  ],
};
function filter_isListed(value, row) {
  return row.isListed === value;
}
function filter_type(value, row) {
  return row.type === value;
}
function filter_price(value, row) {
  switch (value) {
    case 'lt_100':
      return row.price < 100;
    case '100_500':
      return row.price >= 100 && row.price <= 500;
    case '501_1000':
      return row.price >= 501 && row.price <= 1000;
    case 'gt_1000':
      return row.price > 1000;
    default:
      return true;
  }
}
function filter_stock(value, row) {
  switch (value) {
    case 'lt_50':
      return row.stock < 50;
    case '50_100':
      return row.stock >= 50 && row.price <= 100;
    case 'gt_100':
      return row.price > 100;
    default:
      return true;
  }
}
</script>

<style scoped>
.is-listed {
  width: 100px;
}
</style>
