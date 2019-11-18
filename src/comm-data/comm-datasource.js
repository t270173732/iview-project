import customstore from 'devextreme/data/custom_store';
import {
    post,
    put,
    del,
    patch,
    get
} from '@/api/api';
import {
    Message
} from 'iview';
import dataquery from 'devextreme/data/query';
import {cacheAreaList} from '@/libs/util.js';
//Url
let resultRows = 'rows';
let resultData = 'data';
//地址全信息
let areaPathList_url = '/biz/bdArea/getAllPathList';
let bdArea_list_url = '/biz/bdArea/read/list';
let area_list_by_key_Url = '/biz/bdArea/read/detail';
//活动
let active_list_url = '/biz/bizActivity/read/list';
let active_list_byKey_url = '/biz/bizActivity/read/detail';
//资讯
let acticle_list_url = '/biz/bizArticle/read/list';
let acticle_list_byKey_url = '/biz/bizArticle/read/detail';
//父级分类
let class_byKey_url = '/biz/bdDrugClass/read/detail';
let parent_class_list_url = '/biz/bdDrugClass/read/drugClassListParentStart';

let Ds = {};
Ds.loadPage = function (loadOptions, url, loadFlag, params) {
    var deferred = $.Deferred(),
        params = params;
    // 分页大小
    params.pageSize = loadOptions.take || 10;
    // 分页偏移
    params.offset = loadOptions.skip || 0;

    if (loadOptions.sort) {
        params.orderBy = loadOptions.sort[0].selector;
        if (loadOptions.sort[0].desc) {
            params.sortAsc = 'N';
        } else {
            params.sortAsc = 'Y';
        }
    }
    // 传入过滤参数
    params.filter = loadOptions.searchData;
    // 按需加载
    if (!loadFlag) {
        deferred.resolve([], {
            totalCount: 0
        });
    } else {
        put(url, params).then(res => {
            if (res.code === '200') {
                if (loadOptions.filter) {
                    var result = dataquery(res.rows).filter(loadOptions.filter).toArray();
                    deferred.resolve(result, {
                        totalCount: result.length
                    });
                } else {
                    deferred.resolve(res.rows, {
                        totalCount: res.total
                    });
                }
            } else {
                // 提示信息
                Message.warning(res.msg);
                if (typeof (func) != 'undefined')
                    target.refresh();
            }
        }).catch(err => {
            deferred.resolve([], {
                totalCount: 0
            });
            let msg = getmsg(err);
            // console.error(msg);
            Message.error(msg);
        });
    }
    return deferred.promise();
};
Ds.loadList = function (url, params) {
    return _put(url, params, resultRows);

};
Ds.loadByKey = function (url, params) {
    return _put(url, params, resultData);
};
Ds.areaPathList = new customstore({
    key: 'id',
    loadMode: "raw",
    load: loadareaPathList,
});

Ds.areaListStore = new customstore({
    key: 'id',
    loadMode: "raw",
    load: () => {
        return _put(bdArea_list_url, {});
    },
    byKey: (key) => {
        return _put(area_list_by_key_Url, {
            id: key
        }, resultData);
    },
    onLoaded: (result) => {
        cacheAreaList(result);
    }
});
//父级分类
Ds.parentClassData = new customstore({
    key: "id",
    loadMode: "raw",
    byKey: (key) => {
        return _put(class_byKey_url, { id: key });
    },
    load: (e) => {
        return _put(parent_class_list_url);
    }
}),

//活动
Ds.activeListData = new customstore({
    key: 'id',
    loadMode: "raw",
    load: () => {
        return _put(active_list_url, {status:2,unEnd:true});
    },
    byKey: (key) => {
        return _put(active_list_byKey_url, {
            id: key
        }, resultData);
    }
});

//资讯
Ds.acticleListData = new customstore({
    key: 'id',
    loadMode: "raw",
    load: () => {
        return _put(acticle_list_url, {status:2});
    },
    byKey: (key) => {
        return _put(acticle_list_byKey_url, {
            id: key
        }, resultData);
    }
});

function loadareaPathList(loadOptions) {
    return _put(areaPathList_url, {});

}

function getmsg(e) {
    var msg = '';
    if (e.hasOwnProperty("message")) {
        msg = e.message;
    } else if (e.hasOwnProperty('data')) {
        msg = e.data.msg;
    } else if (e.hasOwnProperty('code') && e.hasOwnProperty('msg')) {
        if (e.code === '403')
            msg = '操作无对应权限\r\n' + e.msg;
        if (e.code === '207')
            msg = e.msg;
    } else
        msg = e;
    return msg;
}


function _put(url, params, resultType) {
    var deferred = $.Deferred(),
        params;
    put(url, params).then(res => {
        if (res.code == '200') {
            if (resultType === resultRows) {
                deferred.resolve(res.rows);
            } else if (resultType === resultData) {
                deferred.resolve(res.data);
            } else {
                deferred.resolve(res.rows);
            }
        } else {
            var msg = getmsg(res);
            //提示信息
            Message.warning(msg);
            console.warn(msg);
            deferred.resolve([], {
                totalCount: 0
            });
        }
    }).catch(err => {
        deferred.resolve([], {
            totalCount: 0
        });
        var msg = getmsg(err);
        console.error(msg);
        Message.error(msg);
    });
    return deferred.promise();
}



export default Ds;
