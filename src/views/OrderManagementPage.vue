<template>
  <div class="panel-container">
    <DataPanel :data="plate_config">
      <template v-slot:btn>
        <el-button v-permission="['superAdmin', 'admin']" type="primary" @click="random_add_order()">建立隨機新訂單</el-button>
      </template>
    </DataPanel>
  </div>

  <div class="list-container">
    <el-table :data="order_data" :row-key="'key'" v-if="true" :expand-row-keys="expand_row" @expand-change="expand_log" style="width: 90%" border>
      <el-table-column type="index" width="50" />
      <el-table-column type="expand" prop="basic.order_id" label="訂單詳情">
        <template #default="{ row, $index }">
          <div class="details-container">
            <StepBar class="stepbar" :data="processed_state_data(row.order_details.schedule.time_line)" :step="current_step(row.order_details.schedule.status).step" :time="true" />

            <el-table :data="row.order_details.product_content" border style="width: 90%" class="details-table">
              {{ row.order_details }}
              <el-table-column prop="name" label="商品名稱" />
              <el-table-column prop="price" label="單價" />
              <el-table-column prop="order_sum" label="訂購數" />
              <el-table-column prop="subtotal" label="單項小計" />
            </el-table>
            <div class="btn-box">
              <el-button v-permission="['superAdmin', 'admin']" type="success" v-if="row.order_details.schedule.status === 'pending'" @click="verify_order(row.key, $index)">確認完成</el-button>
              <el-button v-permission="['superAdmin', 'admin']" type="primary" v-if="row.order_details.schedule.status === 'processing'" @click="fulfill_order(row.key, $index)">處理完成</el-button>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column sortable prop="basic.order_id" label="訂單序號" />
      <el-table-column sortable prop="basic.builder" label="建立者" />
      <el-table-column sortable prop="basic.build_time" label="建立時間" />
      <el-table-column sortable prop="order_details.schedule.status" label="訂單狀態" :filters="state_filters_options" :filter-method="filter_state">
        <template #default="scope">
          <el-button :type="current_step(scope.row.order_details.schedule.status).style" plain disabled>
            {{ get_zh_TW_map('order_status', scope.row.order_details.schedule.status) }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column sortable prop="order_details.total_price" label="訂單金額" />
      <!--骨架屏-->
      <template #empty v-if="is_loading_skeleton">
        <div class="skeleton">
          <el-skeleton :rows="2" animated />
        </div>
      </template>
    </el-table>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue';
import DataPanel from '@/components/DataPanel.vue';
import { order_api } from '@/api/firebase_order_api.js';
import { get_zh_TW_map, delay_time } from '@/utils/utils.js';
import StepBar from '@/components/StepBar.vue';
import { useUserStore } from '@/store/user.js';

let order_data = reactive([]);
let user_state = useUserStore();
let is_loading_skeleton = ref(true);
let plate_config = reactive({
  item: [
    {
      title: '全部訂單',
      icon: 'Coin',
      color: '#22c3e6',
      filter: () => true,
    },
    {
      title: '待審核訂單',
      icon: 'Coin',
      color: '#67c23a',
      filter: (item) => item.order_details.schedule.status === 'pending',
    },
    {
      title: '處理中訂單',
      icon: 'Coin',
      color: '#409eff',
      filter: (item) => item.order_details.schedule.status === 'processing',
    },
    {
      title: '已完成定單',
      icon: 'Coin',
      color: '#909399',
      filter: (item) => item.order_details.schedule.status === 'finish',
    },
  ],
  source: order_data,
});

let state_step = [
  {
    state: 'pending',
    title: '待確認',
    description: '訂單正在等候商家成立',
    style: 'success',
    step: 0,
  },
  {
    state: 'processing',
    title: '處理中',
    description: '訂單已成立 正在處理中',
    style: 'primary',
    step: 1,
  },
  {
    state: 'finish',
    title: '已完成',
    description: '訂單已被完成',
    style: 'info',
    step: 2,
  },
];

//修改訂單狀態
async function verify_order(id, index) {
  try {
    let new_data = await order_api.order_verify(id);
    order_data[index] = new_data;
  } catch (error) {
    throw new Error(error);
  }
}
async function fulfill_order(id, index) {
  try {
    let new_data = await order_api.order_fulfill(id);
    order_data[index] = new_data;
  } catch (error) {
    throw new Error(error);
  }
}

//表單篩選
let state_filters_options = [
  { text: '待確認', value: 'pending' },
  { text: '處理中', value: 'processing' },
  { text: '已完成', value: 'finish' },
];
function filter_state(value, row) {
  return row.order_details.schedule.status === value;
}

//表單展開
let expand_row = reactive([]);
//保持紀錄
function expand_log(row) {
  let index = expand_row.indexOf(row.key);
  if (index > -1) {
    expand_row.splice(index, 1);
  } else {
    expand_row.push(row.key);
  }
}

//表單格式化
function current_step(state) {
  return state_step.find((item) => {
    return item.state === state;
  });
}

//合併時間數組
function processed_state_data(time_line) {
  let data = state_step.map(({ state, title, description, step }) => {
    let i = time_line.find((item) => item.state === state);

    return { state, title, description, step, time: i?.time || '' };
  });

  return data;
}

//資料渲染
async function get_data() {
  try {
    let new_data = await order_api.get_all_order_data();
    await delay_time(500);
    Object.assign(order_data, new_data);
  } catch (error) {
    console.error(error);
  } finally {
    // is_loading_skeleton.value = false;
  }
}

onMounted(async () => {
  get_data();
});

function random_add_order() {
  function random(sum) {
    function rand(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    let id = ['27GlDBYCAKKMe99mpwJG', '5qo76klVthzNtGfOIAAp', 'FyY8sUOozIlDvUAuXhoS', 'GShgcCSYOvBbnZyoMzSB', 'NPc5bRGnDeLkZmpVv6jp', 'NRHZay7UHOj8ARKyDIkl', 'PObxVgzKSH82YckfL3gf', 'RUwgo80oJ5r4OsdyXdh9', 'alBSHO2NgZkGMgiATzuL'];

    let new_order = [];

    for (let i = 0; i < sum; i++) {
      let index = rand(0, id.length - 1);
      new_order.push({ id: id[index], order_sum: rand(1, 20) });
      id.splice(index, 1);
    }
    return new_order;
  }

  let order_data = random(4);

  order_api.add_order(user_state.uid, order_data);
}
</script>

<style scoped>
.panel-container {
  height: 100px;
}

.list-container {
  width: 100%;
  min-height: calc(100% - 120px);
  max-height: calc(100% - 120px);
  display: flex;
  justify-content: center;
  background-color: #ffffff;
  overflow: auto;
  padding-top: 20px;
}

::v-deep .el-table__expanded-cell {
  padding: 0 !important;
}

.details-container {
  background-color: #ebf5ff;
  padding: 8px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.stepbar {
  width: 90%;
  margin: 8px 0;
  padding: 8px 0;
  background-color: #ffffff;
}

.btn-box {
  width: 90%;
  padding: 8px 0;
  display: flex;
  justify-content: start;
}

.skeleton {
  width: 100%;
}

::v-deep .el-table__empty-text {
  width: 80%;
}
</style>
