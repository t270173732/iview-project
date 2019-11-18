import {
    getBreadCrumbList,
    setTagNavListInLocalstorage,
    getMenuByRouter,
    getTagNavListFromLocalstorage,
    getHomeRoute,
    routeHasExist,
    parsJson
} from '@/libs/util'
import {post, put, del, patch, get} from '@/api/api';
import routers from '@/router/routers'
import Config from '@/config';
import Cookies from 'js-cookie';
import {
    Message
} from 'iview';

export default {
    state: {
        title:'处方云共享平台',
        userName: '',
        userType:0,
        rightsMenus: [],
        userOrgs: [],
        breadCrumbList: [],
        tagNavList: [],
        homeRoute: getHomeRoute(routers),
        local: '',
        menuList: [],
        routers: routers,
    },
    getters: {
        menuList: (state, getters, rootState) => getMenuByRouter(routers, rootState.user.access)
    },
    mutations: {
        setUserType(state,type){
            state.userType = type
        },
        setTitle(state){
            if (localStorage.userOrgs) {
                let userType = JSON.parse(localStorage.userOrgs).type;
                this.commit('setUserType',userType);
                if(userType == 1){
                    state.title = '处方云共享平台（平台端）'
                }else if(userType == 2){
                    state.title = '处方云共享平台（医疗机构端）'
                }else if(userType == 3){
                    state.title = '处方云共享平台（供应商端）'
                }else if(userType == 4){
                    state.title = '处方云共享平台（监管机构端）'
                }else if(userType == 5){
                    state.title = '处方云共享平台（药店端）'
                }
            }
            document.title = state.title
        },
        setUserName(state, userName) {
            state.userName = userName
        },
        // 获取服务器权限菜单
        setUserModuleList(state) {
            // 获取权限
            put('/sys/func/list').then(res => {
                if (res.code == '200') {
                    // 获取菜单权限，并放入store
                    // 保存到store.app下的Menus属性
                    state.rightsMenus = res.rows;
                    localStorage.rightsMenus = JSON.stringify(state.rightsMenus);
                    this.commit('updateMenulist');
                }
                else {
                    Message.warn(res.data.msg);
                }
            }).catch(err => {
                Message.error(err.data.msg);
            });
        },
        updateMenulist(state) {
            if (localStorage.rightsMenus) {
                state.rightsMenus = JSON.parse(localStorage.rightsMenus);
            }
            let menuList = [];
            // 临时全取,不校验权限
            if (!Config.checkPermission) {
                state.menuList = routers.filter((item) => {
                    return !item.meta.hideInMenu
                })
            }
            else {
                routers.forEach((router,index)=>{
                    let item1 = router;
                    let ret1 = state.rightsMenus.find((value, index, arr) => {
                        return value.path == item1.name;
                    });
                    if(ret1){
                        let routerMenu = $.extend(true, {}, item1);
                        routerMenu.children = [];
                        routerMenu.icon = routerMenu.meta.icon;
                        if(item1.children){
                            for (let ii in item1.children){
                                let item2 = item1.children[ii];
                                let ret2 = state.rightsMenus.find((value, index, arr) => {
                                    return value.path == item2.name;
                                });
                                if (ret2) {
                                    let sonMenu = $.extend(true, {}, item2);
                                    // sonMenu.children = [];
                                    sonMenu.icon = sonMenu.meta.icon;
                                    routerMenu.children.push(sonMenu);
                                    // if (item2.children) {
                                    //     for (let iii in item2.children) {
                                    //         let item3 = item2.children[iii];
                                    //         var ret3 = state.rightsMenus.find((value, index, arr) => {
                                    //             return value.path == item3.name;
                                    //         });
                                    //         if (ret3) {
                                    //             let sonMenu1 = $.extend(true, {}, item3);
                                    //             sonMenu1.children = [];
                                    //             sonMenu1.icon = sonMenu1.meta.icon;
                                    //             sonMenu.children.push(sonMenu1);
                                    //         }
                                    //     }
                                    // }
                                }
                            }
                        }
                        menuList.push(routerMenu);
                    }
                });
                state.menuList = menuList;
            }
        },
        // 获取当前用户的组织机构等信息
        setUserInfo(state, account) {
            put('/sys/sysUser/getUserByAccount', {account: account}).then(res => {
                if (res.code == '200') {
                    //获取菜单权限，并放入store
                    //保存到store.app下的属性
                    // console.log(res.data,"获取当前用户的组织机构等信息");
                    state.userOrgs = res.data;
                    state.userName = '(' + Cookies.get('user') + ')' + res.data.name;
                    localStorage.userOrgs = JSON.stringify(state.userOrgs);
                    this.commit('setTitle');
                }
                else {
                    Message.warn(res.msg);
                }
            }).catch(err => {
                Message.error(err);
            });
        },
        setBreadCrumb(state, routeMetched) {
            state.breadCrumbList = getBreadCrumbList(routeMetched, state.homeRoute)
        },
        setTagNavList(state, list) {
            if (list) {
                state.tagNavList = [...list]
                setTagNavListInLocalstorage([...list])
            } else state.tagNavList = getTagNavListFromLocalstorage()
        },
        addTag(state, {route, type = 'unshift'}) {
            if (!routeHasExist(state.tagNavList, route)) {
                if (type === 'push') state.tagNavList.push(route)
                else {
                    if (route.name === 'home') state.tagNavList.unshift(route)
                    else state.tagNavList.splice(1, 0, route)
                }
                setTagNavListInLocalstorage([...state.tagNavList])
            }
        },
        setLocal(state, lang) {
            state.local = lang
        },
        clearAllTags(state) {
            state.tagNavList.splice(1)
            // state.cachePage.length = 0;
            localStorage.tagNaveList = JSON.stringify(state.tagNavList)
        },
        clearOtherTags(state, vm) {
            let currentName = vm.$route.name
            let currentIndex = 0
            state.tagNavList.forEach((item, index) => {
                if (item.name === currentName) {
                    currentIndex = index
                }
            })
            if (currentIndex === 0) {
                state.tagNavList.splice(1)
            } else {
                state.tagNavList.splice(currentIndex + 1)
                state.tagNavList.splice(1, currentIndex - 1)
            }
            // let newCachepage = state.cachePage.filter(item => {
            //   return item === currentName;
            // });
            // state.cachePage = newCachepage;
            localStorage.tagNaveList = JSON.stringify(state.tagNavList)
        },
        pageOpenedList(state, get) {
            let openedPage = state.tagNavList[get.index]
            if (get.argu) {
                openedPage.argu = get.argu
            }
            if (get.query) {
                openedPage.query = get.query
            }
            state.tagNavList.splice(get.index, 1, openedPage)
            localStorage.tagNaveList = JSON.stringify(state.tagNavList)
        }
    }
}
