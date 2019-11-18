import {login, logout, getUserInfo} from '@/api/user'
import {setToken, getToken} from '@/libs/util'
import Cookies from 'js-cookie'
import { post,put,del,patch,get } from '@/api/api'
import { Message } from 'iview';

export default {
    state: {
        userName: '',
        userId: '',
        avatorImgPath: '',
        token: getToken(),
        access: ''
    },
    mutations: {
        setAvator(state, avatorPath) {
            state.avatorImgPath = avatorPath
        },
        setUserId(state, id) {
            state.userId = id
        },
        setUserName(state, name) {
            state.userName = name
        },
        setAccess(state, access) {
            state.access = access
        },
        setToken(state, token) {
            state.token = token
            setToken(token)
        },
        logout(state, vm) {
            Cookies.remove('user');
            Cookies.remove('regist-user');

            // if (Cookies.get('rememberme') == 'false') {
            //     Cookies.remove('lastlogin');
            //     Cookies.remove('rememberme');
            // }
            const params = {};
            //调用服务器退出登录方法
            post('/sys/logout', params).then(res => {
                if (res.code != '200') {
                    Message.error('退出登录错误！');

                }
            }).catch(err => {
                Message.error(err);
            });
            // 恢复默认样式
            let theme = '';
            if (localStorage.theme) {
                theme = localStorage.theme;
            }
            let user = '';
            if (localStorage.user) {
                user = localStorage.user;
            }
            localStorage.clear();
            if (theme) {
                localStorage.theme = theme;
            }
            if (user) {
                localStorage.user = user;
            }
        }
    },
    actions: {
        // 登录
        handleLogin({commit}, {userName, password}) {
            userName = userName.trim()
            return new Promise((resolve, reject) => {
                login({
                    userName,
                    password
                }).then(res => {
                    const data = res.data
                    commit('setToken', data.token)
                    resolve()
                }).catch(err => {
                    reject(err)
                })
            })
        },
        // 退出登录
        handleLogOut({state, commit}) {
            return new Promise((resolve, reject) => {
                logout(state.token).then(() => {
                    commit('setToken', '')
                    commit('setAccess', [])
                    resolve()
                }).catch(err => {
                    reject(err)
                })
                // 如果你的退出登录无需请求接口，则可以直接使用下面三行代码而无需使用logout调用接口
                // commit('setToken', '')
                // commit('setAccess', [])
                // resolve()
            })
        },
        // 获取用户相关信息
        getUserInfo({state, commit}) {
            return new Promise((resolve, reject) => {
                getUserInfo(state.token).then(res => {
                    const data = res.data
                    commit('setAvator', data.avator)
                    commit('setUserName', data.user_name)
                    commit('setUserId', data.user_id)
                    commit('setAccess', data.access)
                    resolve(data)
                }).catch(err => {
                    reject(err)
                })
            })
        }
    }
}
