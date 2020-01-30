import Vue from 'vue'
import vSelect from 'vue-select'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import App from './App'
import store from './store'
import '@leanix/reporting'
import '@/assets/css/tailwind.css'
import 'vue-select/dist/vue-select.css'

/* global lx */
Vue.prototype.$lx = lx

library.add(faChevronRight)

Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.component('v-select', vSelect)

Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
