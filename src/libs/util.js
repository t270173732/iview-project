import Cookies from 'js-cookie'
// cookie保存的天数
import config from '@/config'
import {forEach, hasOneOf, objEqual} from '@/libs/tools'
import routers from '@/router/routers'
import PinYin from '@/libs/pinyin';
import WuBi from '@/libs/wubi';

export const TOKEN_KEY = 'user';

export const setToken = (token) => {
    Cookies.set(TOKEN_KEY, token, {expires: config.cookieExpires || 1})
};

export const getToken = () => {
    const token = Cookies.get(TOKEN_KEY);
    if (token) return token;
    else return false
};

export const hasChild = (item) => {
    return item.children && item.children.length !== 0
};

const showThisMenuEle = (item, access) => {
    if (item.meta && item.meta.access && item.meta.access.length) {
        if (hasOneOf(item.meta.access, access)) return true;
        else return false
    } else return true
};
/**
 * @param {Array} list 通过路由列表得到菜单列表
 * @returns {Array}
 */
export const getMenuByRouter = (list, access) => {
    let res = [];
    forEach(list, item => {
        if (!item.meta || (item.meta && !item.meta.hideInMenu)) {
            let obj = {
                icon: (item.meta && item.meta.icon) || '',
                name: item.name,
                meta: item.meta
            };
            if ((hasChild(item) || (item.meta && item.meta.showAlways)) && showThisMenuEle(item, access)) {
                obj.children = getMenuByRouter(item.children, access)
            }
            if (item.meta && item.meta.href) obj.href = item.meta.href;
            if (showThisMenuEle(item, access)) res.push(obj)
        }
    })
    return res
}

/**
 * @param {Array} routeMetched 当前路由metched
 * @returns {Array}
 */
export const getBreadCrumbList = (routeMetched, homeRoute) => {
    let res = routeMetched.filter(item => {
        return item.meta === undefined || !item.meta.hide
    }).map(item => {
        let obj = {
            icon: (item.meta && item.meta.icon) || '',
            name: item.name,
            meta: item.meta
        };
        return obj
    });
    res = res.filter(item => {
        return !item.meta.hideInMenu
    });
    return [Object.assign(homeRoute, {to: homeRoute.path}), ...res]
};

export const showTitle = (item, vm) => vm.$config.useI18n ? vm.$t(item.name) : ((item.meta && item.meta.title) || item.name);

/**
 * @description 本地存储和获取标签导航列表
 */
export const setTagNavListInLocalstorage = list => {
    localStorage.tagNaveList = JSON.stringify(list)
};
/**
 * @returns {Array} 其中的每个元素只包含路由原信息中的name, path, meta三项
 */
export const getTagNavListFromLocalstorage = () => {
    const list = localStorage.tagNaveList;
    return list ? JSON.parse(list) : []
}

/**
 * @param {Array} routers 路由列表数组
 * @description 用于找到路由列表中name为home的对象
 */
export const getHomeRoute = routers => {
    let i = -1;
    let len = routers.length;
    let homeRoute = {};
    while (++i < len) {
        let item = routers[i];
        if (item.children && item.children.length) {
            let res = getHomeRoute(item.children);
            if (res.name) return res
        } else {
            if (item.name === 'home') homeRoute = item
        }
    }
    return homeRoute
}

/**
 * @param {*} list 现有标签导航列表
 * @param {*} newRoute 新添加的路由原信息对象
 * @description 如果该newRoute已经存在则不再添加
 */
export const getNewTagList = (list, newRoute) => {
    const {name, path, meta, argu, params, query} = newRoute;
    let newList = [...list];
    if (newList.findIndex(item => item.name === name) >= 0) return newList;
    else newList.push({name, path, meta});
    return newList
}

/**
 * @param {*} access 用户权限数组，如 ['super_admin', 'admin']
 * @param {*} route 路由列表
 */
const hasAccess = (access, route) => {
    if (route.meta && route.meta.access) return hasOneOf(access, route.meta.access);
    else return true
};

/**
 * 权鉴
 * @param {*} name 即将跳转的路由name
 * @param {*} access 用户权限数组
 * @param {*} routes 路由列表
 * @description 用户是否可跳转到该页
 */
export const canTurnTo = (name, access, routes) => {
    const routePermissionJudge = (list) => {
        return list.some(item => {
            if (item.children && item.children.length) {
                return routePermissionJudge(item.children)
            } else if (item.name === name) {
                return hasAccess(access, item)
            }
        })
    };

    return routePermissionJudge(routes)
};

/**
 * @param {String} url
 * @description 从URL中解析参数
 */
export const getParams = url => {
    const keyValueArr = url.split('?')[1].split('&');
    let paramObj = {};
    keyValueArr.forEach(item => {
        const keyValue = item.split('=');
        paramObj[keyValue[0]] = keyValue[1]
    })
    return paramObj
}

/**
 * @param {Array} list 标签列表
 * @param {String} name 当前关闭的标签的name
 */
export const getNextRoute = (list, route) => {
    let res = {};
    if (list.length === 2) {
        res = getHomeRoute(list)
    } else {
        const index = list.findIndex(item => routeEqual(item, route));
        if (index === list.length - 1) res = list[list.length - 2];
        else res = list[index + 1]
    }
    return res
}

/**
 * @param {Number} times 回调函数需要执行的次数
 * @param {Function} callback 回调函数
 */
export const doCustomTimes = (times, callback) => {
    let i = -1;
    while (++i < times) {
        callback(i)
    }
};

/**
 * @param {Object} file 从上传组件得到的文件对象
 * @returns {Promise} resolve参数是解析后的二维数组
 * @description 从Csv文件中解析出表格，解析成二维数组
 */
export const getArrayFromFile = (file) => {
    let nameSplit = file.name.split('.');
    let format = nameSplit[nameSplit.length - 1];
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.readAsText(file); // 以文本格式读取
        let arr = []
        reader.onload = function (evt) {
            let data = evt.target.result ;// 读到的数据
            let pasteData = data.trim();
            arr = pasteData.split((/[\n\u0085\u2028\u2029]|\r\n?/g)).map(row => {
                return row.split('\t')
            }).map(item => {
                return item[0].split(',')
            });
            if (format === 'csv') resolve(arr);
            else reject(new Error('[Format Error]:你上传的不是Csv文件'))
        }
    })
}

/**
 * @param {Array} array 表格数据二维数组
 * @returns {Object} { columns, tableData }
 * @description 从二维数组中获取表头和表格数据，将第一行作为表头，用于在iView的表格中展示数据
 */
export const getTableDataFromArray = (array) => {
    let columns = [];
    let tableData = [];
    if (array.length > 1) {
        let titles = array.shift();
        columns = titles.map(item => {
            return {
                title: item,
                key: item
            }
        });
        tableData = array.map(item => {
            let res = {};
            item.forEach((col, i) => {
                res[titles[i]] = col
            });
            return res
        })
    }
    return {
        columns,
        tableData
    }
};

export const findNodeUpper = (ele, tag) => {
    if (ele.parentNode) {
        if (ele.parentNode.tagName === tag.toUpperCase()) {
            return ele.parentNode
        } else {
            return findNodeUpper(ele.parentNode, tag)
        }
    }
};

export const findNodeDownward = (ele, tag) => {
    const tagName = tag.toUpperCase();
    if (ele.childNodes.length) {
        let i = -1
        let len = ele.childNodes.length;
        while (++i < len) {
            let child = ele.childNodes[i];
            if (child.tagName === tagName) return child;
            else return findNodeDownward(child, tag)
        }
    }
}

export const showByAccess = (access, canViewAccess) => {
    return hasOneOf(canViewAccess, access)
};

/**
 * @description 根据name/params/query判断两个路由对象是否相等
 * @param {*} route1 路由对象
 * @param {*} route2 路由对象
 */
export const routeEqual = (route1, route2) => {
    const params1 = route1.params || {};
    const params2 = route2.params || {};
    const query1 = route1.query || {};
    const query2 = route2.query || {};
    return (route1.name === route2.name) && objEqual(params1, params2) && objEqual(query1, query2)
};

/**
 * 判断打开的标签列表里是否已存在这个新添加的路由对象
 */
export const routeHasExist = (tagNavList, routeItem) => {
    let len = tagNavList.length;
    let res = false;
    doCustomTimes(len, (index) => {
        if (routeEqual(tagNavList[index], routeItem)) res = true
    });
    return res
}


export const parsJson = (str) => {
    return new Promise((resolve, reject) => {
        let res = JSON.parse(str);
        resolve(res);
    })
};

export const getRouterObjByName = (routers, name) => {
    if (!name || !routers || !routers.length) {
        return null;
    }
    // debugger;
    let routerObj = null;
    for (let item of routers) {
        if (item.name === name) {
            return item;
        }
        routerObj = getRouterObjByName(item.children, name);
        if (routerObj) {
            return routerObj;
        }
    }
    return null;
};

export const getParentRouterObjByName = function (routers, name, parent) {
    if (!name || !routers || !routers.length) {
        return null;
    }
    // debugger;
    let routerObj = null;
    for (let item of routers) {
        if (item.name === name) {
            return parent;
        }
        routerObj = getParentRouterObjByName(item.children, name, item);
        if (routerObj) {
            return routerObj;
        }
    }
    return null;
};

export const toDefaultPage = function (routers, name, route, next) {
    let len = routers.length;
    let i = 0;
    let notHandle = true;
    while (i < len) {
        if (routers[i].name === name && routers[i].children && routers[i].redirect === undefined) {
            route.replace({
                name: routers[i].children[0].name
            });
            notHandle = false;
            next();
            break;
        }
        i++;
    }
    if (notHandle) {
        next();
    }
};

export const openNewPage = function (vm, name, argu, query,path) {
    let pageOpenedList = vm.$store.state.app.tagNavList;
    let openedPageLen = pageOpenedList.length;
    let i = 0;
    let tagHasOpened = false;
    //检查已打开页面，替换原来的页面
    while (i < openedPageLen) {
        //获取父级
        let parentRoute = getParentRouterObjByName(vm.$store.state.app.routers, name);
        let parentRoute2 = getParentRouterObjByName(vm.$store.state.app.routers, pageOpenedList[i].name);
        let route = getRouterObjByName(vm.$store.state.app.routers, name);
        //如果是同一个父级则替换pageOpenedList
        if (parentRoute === parentRoute2 && route && route.meta && (route.meta.index || route.meta.detail)) {
            vm.$store.commit('pageOpenedList', {
                index: i,
                argu: argu,
                query: query,
                name: name,
                meta: route ? route.meta : '',
                path: route?route.path:path
            });
            tagHasOpened = true;
            break;
        }
        if (name === pageOpenedList[i].name) { //||(parentRoute&&parentRoute2&&parentRoute.name === parentRoute2.name)) { // 页面已经打开
            //更新详细页面
            vm.$store.commit('pageOpenedList', {
                index: i,
                argu: argu,
                query: query,
                name: name,
                meta: route ? route.meta : '',
                path: route?route.path:path
            });
            tagHasOpened = true;
            break;
        }
        i++;
    }
    // if (!tagHasOpened) {
    //   let tag = vm.$store.state.app.tagsList.filter((item) => {
    //     if (item.children) {
    //       return name === item.children[0].name;
    //     } else {
    //       return name === item.name;
    //     }
    //   });
    //   tag = tag[0];
    //   if (tag) {
    //     tag = tag.children ? tag.children[0] : tag;
    //     if (argu) {
    //       tag.argu = argu;
    //     }
    //     if (query) {
    //       tag.query = query;
    //     }
    //     vm.$store.commit('increateTag', tag);
    //   }
    // }
    // vm.$store.commit('setCurrentPageName', name);
};
//缓存区域
export const cacheAreaList = function (result) {
    if (result.length <= 0) return;
    localStorage.areaList = JSON.stringify(result);
};

export const codefans_net_CC2PY = function (l1) {
    let l2 = l1.length;
    let I1 = "";
    let reg = new RegExp('[a-zA-Z0-9\- ]');
    for (let i=0;i<l2;i++) {
        let val = l1.substr(i,1);
        let name = arraySearch(val,PinYin);
        if(reg.test(val)) {
            I1 += val;
        } else if (name!==false) {
            I1 += name;
        }

    }
    I1 = I1.replace(/ /g,'-');
    while (I1.indexOf('--')>0) {
        I1 = I1.replace('--','-');
    }
    return I1;
};

export const arraySearch = function (l1,l2){
    for (let name in PinYin){
        if (PinYin[name].indexOf(l1)!=-1) {
            return ucfirst(name); break;
        }
    }
    return false;
};

export const ucfirst = function (l1){
    if (l1.length>0) {
        let first = l1.substr(0,1).toUpperCase();
        // let spare = l1.substr(1,l1.length);
        return first;
    }
};

//五笔简码
export const word_wubi = function (l1) {
    let l2 = l1.length;
    let I1 = "";
    let reg = new RegExp('[a-zA-Z0-9\- ]');
    for (let i=0;i<l2;i++) {
        let val = l1.substr(i,1);
        let name = wubiSearch(val,WuBi);
        if(reg.test(val)) {
            I1 += val;
        } else if (name!==false) {
            I1 += name;
        }

    }
    I1 = I1.replace(/ /g,'-');
    while (I1.indexOf('--')>0) {
        I1 = I1.replace('--','-');
    }
    return I1;
};

export const wubiSearch = function (l1,l2){
    for (let name in l2){
        if (l2[name].indexOf(l1)!=-1) {
            return name; break;
        }
    }
    return false;
};