// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ViewUI from 'view-design';
import App from './App'
import router from './router'
import store from './store'
import iView from 'iview'
import i18n from '@/locale'
import config from '@/config'
import Cookies from 'js-cookie'
import importDirective from '@/directive'
import 'iview/dist/styles/iview.css'
import './index.less'
import '@/assets/icons/iconfont.css'
import 'devextreme/dist/css/dx.common.css';
import '@/styles/index.less'

// 引入echarts
import echarts from 'echarts'
Vue.prototype.echarts = echarts;
import '../node_modules/echarts/map/js/province/chongqing.js'
// import '../node_modules/echarts/map/js/province/beijing.js'

// import 'devextreme/dist/css/dx.light.compact.css';
import 'devextreme/dist/css/dx.light.css';
import 'devextreme/integration/jquery';
import 'layui-src/dist/css/layui.css';
import 'layui-src/dist/layui.js'
import '@/filter/filter'  //全局filter
import Print from '@/libs/print.js'
import $ from 'jquery'

window.$ = $


/**********devextreme UI***************/
import 'devextreme/ui/button';
import 'devextreme/ui/data_grid';
import 'devextreme/ui/form';
import 'devextreme/ui/tree_list';
import 'devextreme/ui/text_area';
import 'devextreme/ui/drop_down_box';
import 'devextreme/ui/tree_view';
import 'devextreme/ui/slider';
import 'devextreme/ui/list';
import 'devextreme/ui/lookup';
import 'devextreme/ui/gallery';
import 'devextreme/ui/switch';
import 'devextreme/ui/context_menu';
import 'devextreme/ui/nav_bar';
import 'devextreme/ui/number_box';
import 'devextreme/ui/radio_group';
import 'devextreme/ui/scroll_view';
import 'devextreme/ui/toolbar';
import 'devextreme/ui/filter_builder';
import 'devextreme/ui/validator';


/**********devextreme Data***************/
import dataquery from 'devextreme/data/query';
import 'devextreme/data/errors';
import 'devextreme/data/local_store';
import 'devextreme/data/data_source';
import 'devextreme/data/array_query';
import 'devextreme/data/store_helper';
import 'devextreme/data/endpoint_selector';
import 'devextreme/data/utils';
import 'devextreme/data/query_adapters';
import customstore from 'devextreme/data/custom_store';

/**********devextreme Theme***************/
// import '@/assets/devextreme/css/generic.light-compact.custom.css';
import '@/assets/devextreme/js/dx.messages.cn.js';
import '@/styles/common.less';

import Enum from '@/comm-data/enum.js'
import Searchpanel from '@/view/my-components/search-panel'
import CommDataSource from '@/comm-data/comm-datasource.js'
import msgHandler from '@/comm-msg/msg-handler.js'
import {post, put, del, patch, get} from '@/api/api'
import DateRange from '@/view/my-components/date-range'
import BadgeStatus from '@/view/my-components/badge-status'
import CommandBtns from '@/view/my-components/command-btns'
import OpCol from '@/view/my-components/opcol'
import DateTimePicker from '@/view/my-components/datetime-picker';
import AreaCascade from '@/view/my-components/area-cascade';
import OpBtn from '@/view/my-components/opbtn'
// import '@/mock'
// 实际打包时应该不引入mock
/* eslint-disable */
if (process.env.NODE_ENV !== 'production') require('@/mock');

Vue.use(iView, {
    i18n: (key, value) => i18n.t(key, value)
});
// Vue.use(ViewUI);
//统一错误处理
Vue.use(msgHandler);
Vue.config.productionTip = false;
//浏览器打印
Vue.use(Print);
/**
 * @description 全局注册应用配置
 */
Vue.component('Searchpanel', Searchpanel);
Vue.component('DateRange', DateRange);
Vue.component('BadgeStatus', BadgeStatus);
Vue.component('CommandBtns', CommandBtns);
Vue.component('OpCol', OpCol);
Vue.component('OpBtn',OpBtn);
Vue.component('DateTimePicker', DateTimePicker);
Vue.component('AreaCascade', AreaCascade);
Vue.prototype.$config = config;
//Restful API 定义
Vue.prototype.$post = post;
Vue.prototype.$put = put;
Vue.prototype.$del = del;
Vue.prototype.$patch = patch;
Vue.prototype.$get = get;
//公用数据源
Vue.prototype.CommDs = CommDataSource;
//dx自定义数据源
Vue.prototype.customstore = customstore;
Vue.prototype.dataQuery = dataquery;
//公用枚举源
Vue.prototype.enum = Enum;
/**
 * 注册指令
 */
importDirective(Vue);

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    i18n,
    store,
    render: h => h(App),
    data: {
        userName:''
    },
    mounted() {
        this.$store.commit('setTitle');
        // 权限菜单过滤相关
        this.$store.commit('updateMenulist');
        if(localStorage.userOrgs){
            this.userName = '(' + Cookies.get('user') + ')' + JSON.parse(localStorage.userOrgs).name
        }else{
            this.userName = Cookies.get('user')
        }
        this.$store.commit('setUserName',this.userName);
    },
});
