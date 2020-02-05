import Vue from 'vue'
import vSelect from 'vue-select'
import VTooltip from 'v-tooltip'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faChevronRight, faChevronDown, faSync } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import App from './App'
import store from './store'
import '@leanix/reporting'
import '@/assets/css/tailwind.css'
import 'vue-select/dist/vue-select.css'
import '@/assets/css/tooltip.css'
/* global lx */
Vue.prototype.$lx = lx

library.add(faChevronRight, faChevronDown, faSync)

Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.component('v-select', vSelect)
Vue.use(VTooltip)

Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
