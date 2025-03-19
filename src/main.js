import { createApp } from 'vue';

import ElementPlus from 'element-plus';
import zhtw from 'element-plus/es/locale/lang/zh-tw';
import 'element-plus/dist/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';

import './reset.css';
import './style.css';
import '@/base.css';
import router from '@/router';
import App from './App.vue';
import { createPinia } from 'pinia';
import permission from '@/directives/permission.js';

const app = createApp(App);
const pinia = createPinia();

app.use(ElementPlus, {
  locale: zhtw,
});
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.use(pinia);
app.use(router);
app.directive('permission', permission);
app.mount('#app');
