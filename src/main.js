import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import './assets/css/global.css'

Vue.config.productionTip = false
axios.defaults.baseURL = 'http://192.168.51.60:8001/'
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  console.log(config)
  return config
})
Vue.prototype.$http = axios

new Vue({
  router,
  render: function (h) { return h(App) }
}).$mount('#app')
