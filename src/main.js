import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Antd from 'ant-design-vue';
import zh_CN from 'ant-design-vue/lib/locale-provider/zh_CN';

import './utils/css/init.css'
import 'ant-design-vue/dist/antd.less'; // 引入官方提供的 less 样式入口文件
import './utils/iconfont/iconfont.css'

// 公共方法
import * as COM from './utils/js/common'

// lodash
import cloneDeep from "lodash/cloneDeep"; // 克隆数据(深拷贝)
import debounce from "lodash/debounce"; // 创建防抖函数
import isNil from "lodash/isNil"; // 判断是否为undefined/null ==> 是返回true, 否则返回false
import isEqual from "lodash/isEqual"; // 执行深比较两者是否相等
import difference from "lodash/difference"; // 判断一个数组中的值是否在另一个数组中, 排除共有的值, 返回独有的值组成新的数组
import isEmpty from 'lodash/isEmpty'

import moment from 'moment'

import baseForm from '@components/common/baseForm'
import baseTable from '@components/common/baseTable'

Vue.config.productionTip = false
Vue.use(Antd)
Vue.prototype.zh_CN = zh_CN
Vue.prototype.COM = COM
Vue.prototype.vm = new Vue()
Vue.prototype.$besicUrl = '/static/pdf/web/viewer.html?path='

Vue.prototype.$lodash = {
  cloneDeep,
  debounce,
  isNil,
  isEqual,
  difference,
  isEmpty
}

Vue.prototype.$moment = moment
Vue.component('baseForm', baseForm)
Vue.component('baseTable', baseTable)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
