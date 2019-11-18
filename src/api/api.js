//restful 统一入口
import axios from 'axios';
import {
    Message
} from 'iview';
import store from '../store';
import router from '../router/index';

let base = '/api';
import Config from '@/config';
import Cookies from 'js-cookie';

const baseUrl = process.env.NODE_ENV === 'development' ? Config.baseUrl.dev : Config.baseUrl.pro

axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';
axios.defaults.headers.delete['Content-Type'] = 'application/json;charset=UTF-8';
axios.defaults.headers.put['Content-Type'] = 'application/json;charset=UTF-8';
axios.defaults.headers.patch['Content-Type'] = 'application/json;charset=UTF-8';
//重试4次
axios.defaults.retry = 5;
axios.defaults.shouldRetry = false;
//1，3,5,10秒
const RETRY_TIMEOUTS = [1, 3, 5, 10];

var that = this;
const instance = axios.create({
    // 基础url前缀
    baseURL: baseUrl,
    // 请求头信息
    headers: {
        'X-Requested-With': 'XMLHttpRequest'
    },
    //设置超时时间
    timeout: 100000,
    withCredentials: true,
    //返回数据类型
    responseType: 'json', // default
});

instance.interceptors.request.use(
    config => {
        // 在发送请求之前做某件事
        if (
            config.method === "post" || config.method === 'delete'
        ) {
            // 序列化
            config.data = JSON.stringify(config.data, function (key, value) {
                if (typeof value === "boolean") {
                    if (value)
                        return 1
                    else
                        return 0
                }
                return value;
            });
        }

        // 若是有做鉴权token , 就给头部带上token
        if (localStorage.token) {
            config.headers.Authorization = localStorage.token;
        }
        return config;
    },
    error => {
        console.log(error);
        return Promise.reject(error.message);
    }
);

function errHandler(error) {
    if (typeof (error.response) == "undefined" || error.message === 'Network Error') {
        var msg = '网络连接超时错误，请联系系统管理员!';
        Message.error(msg);
        error.message = msg;

        return Promise.reject(error);
    }
    if (error.response.status === 401) {

        Message.error(error.message);
    }
    if (error.response.status === 403) {
        Message.error(error.message);
    }
    if (error.response.status === 500) {
        Message.error(error.message);
    }
    if (error.response.status === 502) {
        Message.error(error.message);
    }
    if (error.response.status === 404) {
        Message.error(error.message);
    }
    if (error.response.status === 303) {
        Message.error(error.message);
    }
}


//结果拦截器
instance.interceptors.response.use(
    res => {
        if ($.trim(res.data).length <= 0)
            return Promise.reject(res);
        const data = res.data;
        switch (data.code) {
            case '401': {
                Message.error({
                    content: res.data.msg,
                    duration: 0.5, //1秒延迟
                    onClose: () => {
                        Cookies.remove('user');

                        if (Cookies.get('rememberme') == 'false') {
                            Cookies.remove('lastlogin');
                            Cookies.remove('rememberme');
                        }
                        // store.commit('clearOpenedSubmenu');
                        router.replace({
                            path: 'login',
                            // query: {
                            //   redirect: router.currentRoute.fullPath
                            // }
                        });
                    }
                });
                return Promise.reject(res);
            }
            case '500': {
                return Promise.reject(res);
            }
        }
        return res;
    },
    err => {
        var config = err.config;

        // 判断是否配置了重试
        if (!config || !config.retry) return Promise.reject(err);

        if (!config.shouldRetry || typeof config.shouldRetry != 'function') {
            errHandler(err);
            return Promise.reject(err);
        }

        //判断是否满足重试条件
        if (!config.shouldRetry(err)) {
            errHandler(err);
            return Promise.reject(err);
        }

        // 设置重置次数，默认为0
        config.__retryCount = config.__retryCount || 0;

        const retryDelay = RETRY_TIMEOUTS[config.__retryCount] * 1000;
        // 判断是否超过了重试次数
        if (config.__retryCount >= config.retry) {
            errHandler(err);
            return Promise.reject(err);
        }

        //重试次数自增
        config.__retryCount += 1;

        var backoff = new Promise(resolve => {
            setTimeout(resolve(), retryDelay || 1);
        });

        //重新发起axios请求
        return backoff.then(() => {
            return instance.request(err.config);
        });
    },
);


export const post = (url, data = {}) => {
    return new Promise((resolve, reject) => {
        instance.post(url, data)
            .then(response => {
                resolve(response.data);
            }, err => {
                // if (typeof(err.response) != "undefined")
                reject(err);
            })
    })
};
export const put = (url, data = {}) => {
    return new Promise((resolve, reject) => {
        instance.put(url, data)
            .then(response => {
                resolve(response.data);
            }, err => {
                // if (typeof(err.response) != "undefined")
                reject(err);
            })
    })
};
export const del = (url, data = {}) => {
    return new Promise((resolve, reject) => {
        instance.delete(url, data)
            .then(response => {
                resolve(response.data);
            }, err => {
                //   if (typeof(err.response) != "undefined")
                reject(err);
            })
    })
};


export const patch = (url, data = {}) => {
    return new Promise((resolve, reject) => {
        instance.patch(url, data)
            .then(response => {
                resolve(response.data);
            }, err => {
                //  if (typeof(err.response) != "undefined")
                reject(err);
            })
    })
};

export const get = (url, data) => {
    return new Promise((resolve, reject) => {
        instance.get(url, data)
            .then(response => {
                resolve(response.data);
            }, err => {
                //  if (typeof(err.response) != "undefined")
                reject(err);
            })
    })
};
