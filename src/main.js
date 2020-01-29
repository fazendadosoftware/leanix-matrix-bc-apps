import Vue from 'vue'
import App from './App.vue'
import store from './store'
import '@leanix/reporting'
import '@/assets/css/tailwind.css'

/* global lx */
Vue.prototype.$lx = lx

Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
