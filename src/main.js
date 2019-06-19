import Vue from "vue";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from "./App.vue";
import router from "./router";
import store from "./store";
import i18n from './lang';                            // i18n
import echarts from 'echarts';                        // echarts
import tools from './utils';                          // tools
import config from './config';                        // config
import axios from 'axios';
import './assets/iconfont/iconfont.js';

import VueI18n from 'vue-i18n'
Vue.use(ElementUI);

Vue.use(VueI18n)
Vue.config.productionTip = false;

Vue.prototype.axios = axios;
Vue.prototype.$echarts = echarts;
Vue.prototype.config = config;                       // 挂载 config
Vue.prototype.tools = tools;                         // 挂载 tools
new Vue({
    router,
    i18n,
    store,
    render: h => h(App)
}).$mount("#app");
