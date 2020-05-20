// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";
import store from "./store";
import "./base/rem";
import VueLazyload from "vue-lazyload";
// A Vue.js plugin for lazyload your Image or Component in your application.
import Toast from "./components/common/Toast.js";
import promise from "es6-promise";
//A polyfill for ES6-style Promises
import Img from "./assets/imgLoading.svg";
promise.polyfill();
Vue.use(Toast);
Vue.use(VueLazyload, {
  loading: Img,
});
Vue.config.productionTip = false;

//添加全局路由校验
router.beforeEach((to, from, next) => {

  if (to.meta.requireAuth) {
    // 判断该路由是否需要登录权限
    if (localStorage.token && localStorage.user) {
      // 获取当前的token是否存在
      console.log("token/user存在");
      next();
    } else {
      console.log("token/user不存在");
      Vue.prototype.$toast({
        icon: "fail",
        message: "您已退出登录，请重新登录！"
      });
      next({
        path: "/login", // 将跳转的路由path作为参数，登录成功后跳转到该路由
        query: { redirect: to.fullPath },
      });
    }
  } else {
    // 如果不需要权限校验，直接进入路由界面
    next();
  }
});

new Vue({
  el: "#app",
  router,
  store,
  template: "<App/>",
  components: { App },
});
