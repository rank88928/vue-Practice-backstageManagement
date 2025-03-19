<template>
  <div class="panel-container">
    <DataPanel :data="plate_config"> </DataPanel>
  </div>

  <div class="list-container">
    <el-table highlight-current-row :data="user_data" style="width: 90%" border>
      <el-table-column type="index" width="50" />
      <el-table-column type="expand" prop="role" label="權限">
        <template #default="{ row }">
          <div m="4">
            <el-table :data="row.permissions" border style="width: 100%">
              <el-table-column prop="category" label="類別">
                <!--權限種類-->
                <template #default="scope">
                  {{ get_zh_TW_map('data_type_label', scope.row.category) }}
                </template>
              </el-table-column>
              <el-table-column v-for="perm in ['create', 'delete', 'update', 'read']" :key="perm" :prop="perm" :label="get_zh_TW_map('data_permission_label', perm)">
                <!--權限視覺化-->
                <template #default="scope">
                  <el-button :type="scope.row[perm] ? 'success' : 'danger'" plain disabled>
                    {{ scope.row[perm] ? '允許' : '禁止' }}
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </template>
      </el-table-column>

      <el-table-column sortable prop="role" label="權限級別" :filters="role_filters_options" :filter-method="filter_role">
        <template #default="scope">
          {{ get_zh_TW_map('permission_type', scope.row.role) }}
        </template>
      </el-table-column>

      <el-table-column sortable prop="email" label="用戶信箱" />
      <el-table-column sortable prop="name" label="用戶名" />
      <el-table-column sortable prop="login_time" label="最近登入" />
      <el-table-column sortable prop="register_time" label="註冊時間" />
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
import { user_api } from '@/api/firebase_user_api';
import { delay_time } from '@/utils/utils.js';
import { get_zh_TW_map } from '@/utils/dictionary.js';
let user_data = reactive([]);
let is_loading_skeleton = ref(true);
let plate_config = reactive({
  item: [
    {
      title: '全部用戶',
      icon: 'User',
      color: '#22c3e6',
      filter: () => true,
    },
    {
      title: '權限用戶(管理員)',
      icon: 'User',
      color: '#70cf42',
      filter: (item) => item.role === 'superAdmin' || item.role === 'admin',
    },
    {
      title: '普通用戶(註冊會員)',
      icon: 'User',
      color: '#f5c66f',
      filter: (item) => item.role === 'vipUser' || item.role === 'generalUser',
    },
  ],

  source: user_data,
});

//表單篩選
let role_filters_options = [
  { text: '超級管理員', value: 'superAdmin' },
  { text: '管理員', value: 'admin' },
  { text: '高級會員', value: 'vipUser' },
  { text: '普通會員', value: 'generalUser' },
];
function filter_role(value, row) {
  return row.role === value;
}

async function get_data() {
  try {
    let new_data = await user_api.get_all_user_data();
    //權限格式轉為數組供表單使用
    new_data.forEach((item) => {
      let arr = Object.entries(item.permissions).map(([key, value]) => ({
        category: key,
        ...value,
      }));

      item.permissions = arr;
    });

    await delay_time(500);
    Object.assign(user_data, new_data);
  } catch (error) {
    console.error(error);
  } finally {
    is_loading_skeleton.value = false;
  }
}

onMounted(async () => {
  get_data();
});
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
</style>
