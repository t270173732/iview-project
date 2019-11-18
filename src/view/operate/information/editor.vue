<style>
    .w-e-toolbar .w-e-menu{
        z-index: 1 !important;
    }
    .w-e-text-container{
        z-index: 1 !important;
    }
</style>
<template>
    <div>
        <div id="editorElem" style="text-align:left"></div>
    </div>
</template>

<script>
    import E from 'wangeditor';
    export default {
        name: 'editor',
        // props:['editorContent'],
        data () {
            return {
                editorContent: ''
            }
        },
        methods: {

        },
        mounted() {
            var editor = new E('#editorElem'),that=this;
            // 隐藏“网络图片”tab
            editor.customConfig.showLinkImg = false
            editor.customConfig.uploadImgShowBase64 = true;
            editor.customConfig.uploadImgServer = this.$config.backend_url + '/sys/upload/image';
            // editor.customConfig.uploadImgHeaders = {
            //     'Accept': 'text/x-json'
            // }
            // editor.customConfig.withCredentials = true
            editor.customConfig.onchange = (html) => {
                this.editorContent = html
            };
            // editor.customConfig.menus = [
            //     'head',  // 标题
            //     'bold',  // 粗体
            //     'fontSize',  // 字号
            //     'fontName',  // 字体
            //     'italic',  // 斜体
            //     'underline',  // 下划线
            //     'strikeThrough',  // 删除线
            //     'foreColor',  // 文字颜色
            //     'backColor',  // 背景颜色
            //     'link',  // 插入链接
            //     'list',  // 列表
            //     'justify',  // 对齐方式
            //     'quote',  // 引用
            //     'emoticon',  // 表情
            //     'image',  // 插入图片
            //     'table',  // 表格
            //     // 'video',  // 插入视频
            //     'code',  // 插入代码
            //     'undo',  // 撤销
            //     'redo'  // 重复
            // ]
            // editor.customConfig.customUploadImg = function (files, insert) {
            //     console.log(files)
            //     // files 是 input 中选中的文件列表
            //     // insert 是获取图片 url 后，插入到编辑器的方法
            //
            //     // 上传代码返回结果之后，将图片插入到编辑器中
            //     // insert(imgUrl)
            // }

            editor.customConfig.uploadImgHooks = {
                before: function (xhr, editor, files) {
                    // 图片上传之前触发
                    // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，files 是选择的图片文件

                    // 如果返回的结果是 {prevent: true, msg: 'xxxx'} 则表示用户放弃上传
                    // return {
                    //     prevent: true,
                    //     msg: '放弃上传'
                    // }
                },
                success: function (xhr, editor, result) {
                    // console.log(xhr)
                    // 图片上传并返回结果，图片插入成功之后触发
                    // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
                },
                fail: function (xhr, editor, result) {
                    // 图片上传并返回结果，但图片插入错误时触发
                    // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
                },
                error: function (xhr, editor) {
                    // 图片上传出错时触发
                    // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
                },
                timeout: function (xhr, editor) {
                    // 图片上传超时时触发
                    // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
                },

                // 如果服务器端返回的不是 {errno:0, data: [...]} 这种格式，可使用该配置
                // （但是，服务器端返回的必须是一个 JSON 格式字符串！！！否则会报错）
                customInsert: function (insertImg, result, editor) {
                    // console.log(result)
                    if(result.code != 200){
                        that.warn('图片上传失败');
                        return
                    }
                    // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
                    // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果

                    // 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
                    for(let i=0 ; i<result.fileInfo.length ; i++){
                        var url = that.$config.img_base_url + result.fileInfo[i].fileName;
                        // var url = 'http://192.168.0.150:30080/res/' + result.fileInfo[i].fileName;
                        insertImg(url)
                    }
                    // result 必须是一个 JSON 格式字符串！！！否则报错
                }
            }

            editor.create();

            if(this.$parent.articleFormData.content){
                editor.txt.html(this.$parent.articleFormData.content);
                this.editorContent = editor.txt.html();
            }
        }
    }
</script>