import Vue from "vue";

import App from "./App.vue";
import router from "./router";
import VueKonva from "vue-konva";

import "./assets/main.css";

Vue.use(VueKonva);

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
