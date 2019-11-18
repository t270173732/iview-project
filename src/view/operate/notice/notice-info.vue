<style lang="less">
    @import "../../../styles/common.less";
</style>
<template>
    <div>
        <Card dis-hover>
            <div slot="title"  class="cardHead">
                <a href="#"  @click.prevent="cancle" >
                    <Icon type="ios-arrow-back"></Icon>
                    返回
                </a>
            </div>
            <p slot="extra" >
                <Button  type="primary" @click="submit" :loading="modal_loading">保存</Button>
                <Button class="margin-left-5"  @click="cancle">取消</Button>
            </p>
            <Row class="margin-top-10">
                <div id="noticeForm"></div>
            </Row>
        </Card>
    </div>
</template>
<script>
    import Vue from 'vue';
    import Editor from './editor';
    let notice_detail_url = '/sys/sysNotice/read/detail';
    let notice_inserORupdate_url = '/sys/sysNotice/updateNotice';
    export default {
        data(){
            return{
                modal_loading:false,
                noticeForm:{},
                noticeFormData:{},
            }
        },
        mounted(){
            this.noticeForm = $('#noticeForm').dxForm({
                colCount: 4,
                formData: this.noticeFormData,
                items: [
                    {
                        dataField: 'title',
                        colSpan:4,
                        label: {
                            alignment: 'right',
                            text: '公告标题'
                        },
                        validationRules: [{
                            type:"required",
                            message: "请输入公告标题"
                        }]
                    },
                    {
                        dataField: 'unauthReson',
                        visible:false,
                        colSpan:4,
                        label: {
                            alignment: 'right',
                            text: '不通过原因'
                        },
                        editorOptions:{
                            readOnly:true
                        }
                    },
                    {
                        dataField: 'content',
                        colSpan:4,
                        label: {
                            alignment: 'right',
                            text: '公告内容'
                        },
                        validationRules: [{
                            type:"required",
                            message: "请输入公告内容"
                        }],
                        template:(data, itemElement)=>{
                            itemElement.append("<div id='editor'/>");
                        }
                    },
                ]
            }).dxForm('instance');

            this.articleInit();
        },
        methods:{
            articleInit(){
                if(this.$route.params.notice_id == 0){
                    this.noticeFormData = {};
                    this.noticeForm.option('formData',this.noticeFormData);
                    this.addEditor();
                }else{
                    let params = {};
                    params.id = this.$route.params.notice_id;
                    this.$put(notice_detail_url,params).then(res => {
                        if(res.code=='200')
                        {
                            this.noticeFormData = res.data;
                            if(this.noticeFormData.status == 2){
                                this.noticeForm.itemOption('unauthReson','visible',true)
                            }
                            this.noticeForm.option("formData",this.noticeFormData);
                            this.addEditor();
                        }
                        else {
                            this.warn(res.msg);
                        }
                    }).catch(err=>
                    {
                        this.err(err)
                        // console.log(err)
                    });
                }
            },
            cancle(){
                this.$router.push({
                    name: 'notice',
                });
            },
            submit(){
                let params = {};
                this.modal_loading = true;
                if(!this.noticeForm.validate().isValid){
                    this.warn('信息不完整');
                    this.modal_loading = false;
                    return;
                }
                if(this.$refs.editorData.editorContent == undefined){
                    this.warn('请输入公告内容');
                    this.modal_loading = false;
                    return;
                }else{
                    this.noticeFormData.content = this.$refs.editorData.editorContent;
                }
                if(this.noticeFormData.status == 2){
                    this.noticeFormData.unauthReson = ''
                }
                this.noticeFormData.status = 0;
                params = this.noticeFormData;
                this.$post(notice_inserORupdate_url,params).then(res => {
                    if(res.code=='200')
                    {
                        this.success('保存成功!',()=>{
                            this.modal_loading = false;
                            this.$router.push({
                                name: 'notice',
                            });
                        });
                    }
                    else
                    {
                        this.modal_loading = false;
                        this.warn(res.msg);
                    }
                }).catch(err=>
                {
                    this.modal_loading = false;
                    this.error(err);
                });
            },
            addEditor() {
                let tag = new Vue(Editor);
                tag.$parent = this;
                tag.$mount('#editor');
                this.$refs.editorData = tag;
            },
        }
    }
</script>