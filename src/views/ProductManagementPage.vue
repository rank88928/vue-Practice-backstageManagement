<template>
  <div class="panel-container">
    <DataPanel :data="plate_config">
      <template v-slot:btn>
        <el-button type="primary" size="large" @click="category = 'all'">全部商品列表</el-button>
        <el-button type="primary" size="large" @click="category = 'listed'">已上架列表</el-button>
        <el-button type="primary" size="large" @click="category = 'unlisted'">下架列表</el-button>
        <el-button type="primary" size="large" plain @click="add_modal_show = true">新增商品</el-button>
      </template>
    </DataPanel>
  </div>

  <div class="data-container">
    <div class="btn-box">
      <el-button type="warning" plain @click="display_model('detailed-imge')">詳細資料</el-button>
      <el-button type="warning" plain @click="display_model('table')">表單資料</el-button>
    </div>
    <div class="list-container" v-show="!is_show_table">
      <div class="item" v-for="item in lazy_loading_data" :key="item.key">
        <ProductList :item="item" />
      </div>
      <!-- 骨架屏 -->
      <div class="skeleton" v-if="is_loading_skeleton">
        <div class="skeleton-item">
          <el-skeleton-item variant="image" class="skeleton-image" style="width: 200px; height: 200px" />
          <el-skeleton :rows="4" animated />
        </div>
      </div>
      <!-- 懶加載標記 -->
      <div class="loading" ref="loading_div">
        <LazyLoading :state="loading" />
      </div>
    </div>
    <div class="table-list-container" v-show="is_show_table">
      <ProductTable :data="product_store.data.all" />
    </div>
  </div>

  <AddProduct v-if="add_modal_show" @cancel="add_modal_show = false" />
</template>

<script setup>
import { ref, reactive, watch, onMounted, nextTick } from 'vue';
import DataPanel from '@/components/DataPanel.vue';
import AddProduct from '@/components/product/AddProduct.vue';
import ProductList from '@/components/product/ProductList.vue';
import LazyLoading from '../components/LazyLoading.vue';
import { useProductStore } from '@/store/product';
import { delay_time } from '@/utils/utils.js';
import ProductTable from '@/components/product/ProductTable.vue';
let product_store = useProductStore();
let category = ref('all'); //預設顯示全部
let add_modal_show = ref(false);
let lazy_loading_data = reactive([]);
let is_loading_skeleton = ref(true);
let is_show_table = ref(false);
let plate_config = reactive({
  item: [
    {
      title: '創建的商品數量',
      icon: 'Tickets',
      color: '#22c3e6',
      filter: () => true,
    },
    {
      title: '目前上架數量',
      icon: 'CircleCheck',
      color: '#70cf42',
      filter: (item) => item.isListed === true,
    },
    {
      title: '目前下架數量',
      icon: 'CircleClose',
      color: '#df5620',
      filter: (item) => item.isListed === false,
    },
  ],
  source: product_store.data.all,
});

let loading = reactive({
  logo_show: true,
  text: '加載中...',
});

//展示模式
function display_model(value) {
  if (value === 'table') {
    is_show_table.value = true;
  } else if ('detailed-imge') {
    is_show_table.value = false;
  }
}

//展示選擇類別
watch(category, async () => {
  observer.unobserve(loading_div.value);
  loading.logo_show = true;
  loading.text = '加載中...';
  lazy_loading_data.length = 0;
  observer.observe(loading_div.value);
});

// 監視log出現 進行懶加載
let loading_div = ref(null);
let observer = new IntersectionObserver(
  () => {
    if (category.value === 'all') {
      observer_callback(product_store.data.all);
    } else if (category.value === 'listed') {
      observer_callback(product_store.data.listed);
    } else if (category.value === 'unlisted') {
      observer_callback(product_store.data.unlisted);
    }
  },
  {
    root: null, // 預設為視口
    rootMargin: '0px', // 沒有額外邊界
    threshold: 1.0, // 只要目標元素出現 1px 就觸發
  }
);
function init_loading(sum) {
  lazy_loading_data.length = 0;
  let new_data = product_store.data.all.slice(0, sum);
  lazy_loading_data.splice(0, 0, ...new_data);
}

async function observer_callback(data) {
  let display_data = lazy_loading_data;
  let new_data;
  if (data.length === display_data.length) {
    loading.logo_show = false;
    loading.text = '已無更多資料';
  } else {
    await delay_time(500);
    new_data = data.slice(display_data.length, display_data.length + 3);
    display_data.splice(display_data.length, 0, ...new_data);
  }
}

//初次資料渲染
async function init() {
  try {
    await product_store.get_new_data();
    await delay_time(500);
    init_loading(3);
    observer.observe(loading_div.value);
  } catch (error) {
    console.error(error);
  } finally {
    is_loading_skeleton.value = false;
  }
}

onMounted(async () => {
  init();
});
</script>

<style scoped>
.panel-container {
  height: 100px;
}

.data-container {
  padding-top: 16px;
  overflow: auto;
  min-height: calc(100% - 120px);
  max-height: calc(100% - 120px);
}
.btn-box {
  width: 90%;
  margin: auto;
  margin-left: 66px;
  justify-content: flex-start;
  padding: 0;
}
.list-container {
  width: 100%;
  min-height: calc(100% - 120px);
  max-height: calc(100% - 120px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: #ffffff;
  overflow: auto;
  padding-top: 10px;
}

.table-list-container {
  width: 100%;
  min-height: calc(100% - 120px);
  max-height: calc(100% - 120px);
  display: flex;
  background-color: #ffffff;
  overflow: auto;
  justify-content: center;
  padding-top: 10px;
}

.list-container .item {
  display: flex;
  width: 90%;
  margin: auto;
}

.loading {
  width: 100%;
}

.skeleton {
  padding: 30px;
}
.skeleton-item {
  display: flex;
  border: 1px solid #f0f2f5;
  padding: 8px;
  justify-content: space-around;
  align-items: center;
}
.skeleton-image {
  background-color: #f0f2f5;
}
.el-skeleton {
  width: 60%;
  height: 80%;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}
::v-deep .el-table__empty-text {
  width: 80%;
}
</style>
