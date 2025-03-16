import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '@/store/user';
import { ElMessage } from 'element-plus';

//頁面
import AuthLayout from '@/views/AuthLayout.vue';
import HomePage from '@/views/HomePage.vue';
import ProductManagementPage from '@/views/ProductManagementPage.vue';
import OrderManagementPage from '@/views/OrderManagementPage.vue';
import AccountManagementPage from '@/views/AccountManagementPage.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import PageContainer from '@/layouts/PageContainer.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: DefaultLayout,
      children: [
        {
          path: '',
          component: PageContainer,
          children: [
            {
              path: 'home',
              component: HomePage,
            },
            {
              path: 'product',
              component: ProductManagementPage,
            },
            {
              path: 'account',
              component: AccountManagementPage,
            },
            {
              path: 'order',
              component: OrderManagementPage,
            },
          ],
        },
      ],
    },
    {
      path: '/auth',
      component: AuthLayout,
    },
  ],
});

//全局前置守衛
router.beforeEach(async (to, from, next) => {
  let user_state = useUserStore();

  let verify = await user_state.verify_uid();

  if (verify) {
    await user_state.get_user_data();
  }

  if (!verify && to.path !== '/auth') {
    ElMessage.error('請先登入');
    next('/auth'); // 未登入跳轉
  } else {
    next(); // 默認首頁
  }
});

export default router;
