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
                <Button  type="primary" @click="agree" :loading="modal_loading">审核通过</Button>
                <Button class="margin-left-5"  @click="reject">审核不通过</Button>
            </p>
            <Row class="margin-top-10">
                <div id="noticeForm"></div>
            </Row>
        </Card>
        <Modal v-model="modal.visible" :mask-closable="false" width="650" title="编辑数据">
            <p slot="header">
                <span>审核不通过原因</span>
            </p>
            <div id="rejectForm"></div>
            <div slot="footer">
                <Button type="text" @click="formCancle">取消</Button>
                <Button type="primary" :loading="modal.modal_loading" @click="save">保存</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    import Vue from 'vue';
    import Editor from './editor';
    let notice_detail_url = '/sys/sysNotice/read/detail';
    let notice_status_url = '/sys/sysNotice/updateNoticeStatus';
    export default {
        data(){
            return{
                modal_loading:false,
                noticeForm:{},
                noticeFormData:{},
                rejectForm:{},
                rejectFormData:{},
                modal:{
                    visible:false,
                    modal_loading:false
                },
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
                        dataField: '',
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

            this.rejectForm = $('#rejectForm').dxForm({
                formData: this.rejectFormData,
                items: [
                    {
                        dataField: 'unauthReson',
                        editorType:'dxTextArea',
                        label: {
                            alignment: 'right',
                            text: '审核不通过原因'
                        },
                        editorOptions:{
                            maxLength:100,
                            height:80
                        },
                        validationRules: [{
                            type:"required",
                            message: "请输入审核不通过原因"
                        }]
                    },
                ]
            }).dxForm('instance');

            this.articleInit();
        },
        methods:{
            articleInit(){
                let params = {};
                params.id = Number(this.$route.params.notice_id);
                this.$put(notice_detail_url,params).then(res => {
                    if(res.code=='200')
                    {
                        this.noticeFormData = res.data;
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
            },
            cancle(){
                this.$router.push({
                    name: 'notice-audit',
                });
            },
            agree(){
                let params = {};
                params.id = this.noticeFormData.id;
                params.status = 1;
                this.$post(notice_status_url,params).then(res => {
                    if(res.code=='200')
                    {
                        this.success('保存成功!',()=>{
                            this.$router.push({
                                name: 'notice-audit',
                            });
                        });
                    }
                    else
                    {
                        this.warn(res.msg);
                    }
                }).catch(err=>
                {
                    this.error(err);
                });
            },
            reject(){
                this.rejectFormData = {};
                this.rejectForm.option('formData',this.rejectFormData);
                this.modal.visible = true;
            },
            formCancle(){
                this.modal.visible = false;
            },
            save(){
                let params = {};
                this.modal.modal_loading = true;
                if(!this.rejectForm.validate().isValid) {
                    this.modal.modal_loading = false;
                    return;
                }
                this.rejectFormData.id = this.noticeFormData.id;
                this.rejectFormData.status = 2;
                params = this.rejectFormData;
                this.$post(notice_status_url,params).then(res => {
                    if(res.code=='200')
                    {
                        this.success('保存成功!',()=>{
                            this.modal_loading = false;
                            this.$router.push({
                                name: 'notice-audit',
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
            },
        }
    }
</script>