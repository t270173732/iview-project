//插件构造函数
var PrinWebPlugin = function (options) {
    // 判断是用函数创建的还是用new创建的。
    //这样我们就可以通过MaskShare("dom") 或 new MaskShare("dom")来使用这个插件了
    if (!(this instanceof PrinWebPlugin)) return new PrinWebPlugin(options);

    // 参数合并
    this.options = {
        wsaddress: 'ws://127.0.0.1:8080/',//WS地址
        isDubug: true,//是否开启调试模式
        deferredExecution : 1000,//延迟重连间隔时间
        callback: null//回掉函数
    };
    if (options.wsaddress !== undefined) { this.options.wsaddress = options.wsaddress; }
    if (options.isDubug !== undefined) { this.options.isDubug = options.isDubug; }
    if (options.callback !== undefined) { this.options.callback = options.callback; }

    //参数定义
    this.webSocket = null;
    this.readyState = false;
    this.PrintList = [];
    this.timeoutId = null;

    // 初始化
    this.init();
};
PrinWebPlugin.prototype = {
    init: function () {
        var _this = this;
        _this.consoleLog("初始化WS连接。。。。。。");
        _this.webSocket = new WebSocket(_this.options.wsaddress);
        _this.webSocket.onopen = function () {
            _this.onopen();
        };
        _this.webSocket.onmessage = function (evt) {
            _this.onmessage(evt);
        };
        _this.webSocket.onerror = function (evt) {
            _this.onerror(evt);
        };
        _this.webSocket.onclose = function () {
            _this.onclose();
        };
    },

    onopen: function () {
        var _this = this;
        _this.send(1);//获取打印机列表
        //设置本地连接状态
        _this.readyState = true;
        _this.consoleLog("服务器连接成功:" + _this.options.wsaddress);
    },
    onmessage: function (evt) {
        var _this = this;
        _this.consoleLog("数据", evt.data);
        //业务调用回掉
        _this.options.callback && _this.options.callback(evt.data);
        try {
            var data = JSON.parse(evt.data);
            switch (data.MessageType) {
                case 1:
                    _this.PrintList = data.Bodey;
                    break;
                case 2:
                    _this.consoleLog("服务器异常", data.Bodey);
                    break;
                case 3:
                    _this.consoleLog("打印成功", evt);
                    //alert(data.Bodey);
                    break;
                default: /* 可选的 */
                    _this.consoleLog("无法解析协议类型", data.MessageType);
                    break;
            }

        } catch (e) {
            _this.consoleLog("协议解析错误", evt);
            //_this.consoleLog("协议解析错误:", e);
        }
    },
    onerror: function (evt) {
        var _this = this;
        _this.consoleLog("服务器连接异常:" + _this.options.wsaddress, evt);
    },
    onclose: function () {
        var _this = this;
        _this.readyState = false;
        _this.consoleLog("服务器连接关闭:" + _this.options.wsaddress);
        //关闭直接退出
        if (_this.webSocket == null) { return;}
        _this.timeoutId= setTimeout(function () {
            //延迟自动从新上线
            _this.consoleLog("延迟自动从新上线");
            _this.init();
        }, _this.options.deferredExecution);
    },
    //发送消息
    send: function (messageType, bodey) {
        var _this = this;
        var msg = { MessageType: messageType, Bodey: bodey };
        //接口打开自动去获取打印机猎豹
        if (_this.webSocket.readyState == WebSocket.OPEN) {
            _this.webSocket.send(JSON.stringify(msg));
        } else {
            _this.consoleLog("连接异常", _this.webSocket.readyState);
        }
    },
    //PrintName 参数名称
    //ReportId 报表ID
    //parametersList 参数数组 [1,2,3,4]
    //IsPreview 是否预览 1 是 其他否
    //IsReturnReceipt 是否需要回执ִ  1 是 其他否
    PrintSend: function (PrintName, ReportId, parametersList, IsPreview, IsReturnReceipt) {
        var _this = this;
        var body = {};
        body.PrintName = PrintName;
        body.ReportId = ReportId;
        body.IsPreview = IsPreview;//是否预览
        body.IsReturnReceipt = IsReturnReceipt;//是否回执
        body.parametersList = parametersList;
        _this.send(2, JSON.stringify(body));//获取打印机列表
    },
    close: function () {
        var _this = this;
        _this.consoleLog("准备关闭WS服务");
        if (_this.webSocket != null) {
            try {
                _this.webSocket.close();
            } catch (e) {

            }
            if (_this.timeoutId) { window.clearTimeout(_this.timeoutId); }
            _this.webSocket = null;
        }
    },
    GetPrintList: function () {
        var _this = this;
        return _this.PrintList;
    },
    //日志输出
    consoleLog(title, msg) {
        var _this = this;
        //判断是否开启调试模式
        if (_this.options.isDubug) {
            if (msg) {
                //浏览器打印消息
                console.log(title, msg);
            } else {
                console.log(title);
            }
        }

    }
};
//ES6
export default PrinWebPlugin;