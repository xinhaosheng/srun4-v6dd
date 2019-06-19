import VueI18n from "vue-i18n";
import Vue from "vue";
import store from '../store'
Vue.use(VueI18n);

export default new VueI18n({
    locale: store.state.currentLang,   // 语言标识
    messages: {
        zh: require('./language/zh-CN'),
        en: require('./language/en-US'),
    }
});
