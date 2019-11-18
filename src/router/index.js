import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
import store from '@/store'
import iView from 'iview'
import Cookies from 'js-cookie';
import {getToken, canTurnTo, getRouterObjByName, openNewPage, toDefaultPage} from '@/libs/util'

Vue.use(Router)
const router = new Router({
    routes,
    mode: 'history'
})
const LOGIN_PAGE_NAME = 'login'

router.beforeEach((to, from, next) => {
    iView.LoadingBar.start()
    const token = getToken()
    if(to.name == 'regist-type'){
        next()
    }else if(to.name == 'store-regist') {
        next()
    }else if(to.name == 'regist-success'){
        next()
    }else{
        if (!Cookies.get('user') && to.name !== LOGIN_PAGE_NAME) {
            // 未登录且要跳转的页面不是登录页
            next({
                name: LOGIN_PAGE_NAME // 跳转到登录页
            })
        } else if (Cookies.get('user') && to.name === LOGIN_PAGE_NAME) {
            // 已登录且要跳转的页面是登录页
            next({
                name: 'home' // 跳转到home页
            })
        } else {
            toDefaultPage(routes, to.name, router, next)
        }
    }

    // else {
    //   store.dispatch('getUserInfo').then(user => {
    //     // 拉取用户信息，通过用户权限和跳转的页面的name来判断是否有权限访问;access必须是一个数组，如：['super_admin'] ['super_admin', 'admin']
    //     if (canTurnTo(to.name, user.access, routes)) next() // 有权限，可访问
    //     else next({ replace: true, name: 'error_401' }) // 无权限，重定向到401页面
    //   })
    // }
})

router.afterEach(to => {
    //判断是否有索引页，replace
    const curRouterObj = getRouterObjByName(routes, to.name);
    //如果有子节点，并且为index
    if (curRouterObj && curRouterObj.children) {
        let len = curRouterObj.children.length;
        let i = 0;
        //打开索引页
        while (i < len) {
            if (curRouterObj.children[i].meta && curRouterObj.children[i].meta.index) {
                router.replace({
                    name: curRouterObj.children[i].name,
                    //path :curRouterObj.children[i].path
                });
                break;
            }
            i++;
        }
    }
    openNewPage(router.app, to.name, to.params, to.query,to.path);
    iView.LoadingBar.finish()
    window.scrollTo(0, 0)
})

export default router
