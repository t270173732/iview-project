import { Message } from 'iview';

//延迟0.5秒
// const duration=0.5;

function getmsg(e){
    var msg = '';
    if (e.hasOwnProperty("message"))
    {
        msg = e.message;
    }
    else if (e.hasOwnProperty('data'))
    {
        msg= e.data.msg;
    }
    else
        msg = e;
    return msg;
}



function install(Vue, options) {
    Vue.prototype.error = (err,func)=>{

       var msg =  getmsg(err);
        //错误控制台输出
        if (typeof(func) =='undefined')
        {
            Message.error(msg);
        }
        else
            Message.error({
                content:msg,
                duration:0.5,
                onClose:func
            })
    };

    Vue.prototype.warn = (msg,func)=>{

        var msg =  getmsg(msg);
        console.warn(msg);
        if (typeof(func) =='undefined')
            Message.warning(msg);
        else
            Message.warning({
                content:msg,
                duration:0.5,
                onClose:func
            })

    };
    Vue.prototype.success = (msg,func)=>{
        var msg =  getmsg(msg);
        if (typeof(func) =='undefined')
            Message.success(msg);
        else
            Message.success({
                content:msg,
                duration:0.5,
                onClose:func
            })
    };
};
export default install;
