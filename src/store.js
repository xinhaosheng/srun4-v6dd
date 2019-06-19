import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
// 获取当前浏览器环境语言
const NavigatorLang = (navigator.language || navigatornavigator.userLanguage).substr(0, 2);
const state = {
    currentLang: localStorage.getItem('UserLang') || NavigatorLang,     // 当前语言
};
const mutations = {
    // 改变 语言
    updateLang(state, data) {
        state.currentLang = data;
        localStorage.setItem('UserLang', state.currentLang);
    },
}

export default new Vuex.Store({
    state,
    mutations,
    actions: {}
});
