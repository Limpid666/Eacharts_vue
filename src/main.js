import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
// 引入字体的样式
import './assets/font/iconfont.css'
// 引入全局样式
import './assets/css/global.scss'
import SocketService from './utils/socket_service'
SocketService.Instance.connect()
// 其他的组件
Vue.prototype.$socket = SocketService.Instance

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/'
Vue.prototype.$http = axios
Vue.prototype.$echarts = window.echarts
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
