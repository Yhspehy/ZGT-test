import Vue from "vue";

import App from "./App.vue";
import router from "./router";

// 由于antd-vue的按需引用问题，避免报错Failed to resolve directive: ant-portal
// https://github.com/vueComponent/ant-design-vue/issues/2261
import { Modal } from "ant-design-vue";
import "ant-design-vue/lib/modal/style/css";

import "./assets/main.css";

import { defaultData } from "./utils/mock";

Vue.use(Modal);

const areaList = localStorage.getItem("areaList");
if (!areaList) {
  localStorage.setItem("areaList", JSON.stringify(defaultData));
}

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
