<style lang="less">
    @import "../../../styles/common.less";
    .demo-spin-icon-load{
        animation: ani-demo-spin 1s linear infinite;
    }
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
                <Button  type="primary" @click="submit">审核发布</Button>
                <Button class="margin-left-5"  @click="reject">驳回</Button>
            </p>
            <Row :gutter="10" class="margin-top-10">
                <div id="active-info"></div>
            </Row>
        </Card>
        <Modal v-model="modal.visible" :mask-closable="false" width="650" title="编辑数据">
            <p slot="header">
                <span>驳回原因</span>
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
    import Image from './image';
    import Tag from './tag';
    let active_detail_url = '/biz/bizActivity/read/detail';
    let active_status_url = '/biz/bizActivity/updateActivityStatus';
    export default {
        data(){
            return{
                isNew:true,
                modal_loading:false,
                activeInfoForm:{},
                activeInfoFormData:{},
                rejectForm:{},
                rejectFormData:{},
                modal:{
                    visible:false,
                    modal_loading:false
                },
            }
        },
        mounted(){
            this.activeInfoForm = $("#active-info").dxForm({
                colCount:4,
                formData:this.activeInfoFormData,
                items:[
                    {
                        dataField: "title",
                        colSpan:4,
                        label: {
                            alignment: "right",
                            text: "活动标题"
                        },
                        editorOptions: {
                            readOnly:true
                        },
                    },
                    {
                        dataField: "startTime",
                        label: {
                            alignment: "right",
                            text: "活动开始时间"
                        },
                        editorOptions:{
                            readOnly:true
                        }
                    },
                    {
                        dataField: "endTime",
                        label: {
                            alignment: "right",
                            text: "活动结束时间"
                        },
                        editorOptions:{
                            readOnly:true
                        }
                    },
                    {
                        dataField: "areaId",
                        label: {
                            alignment: "right",
                            text: "活动地区"
                        },
                        template:this.addAreaCascade
                    },
                    {itemType:'empty'},
                    {
                        dataField: "address",
                        colSpan:4,
                        label: {
                            alignment: "right",
                            text: "活动地址"
                        },
                        editorOptions:{
                            readOnly:true
                        }
                    },
                    {
                        dataField: "photoImg",
                        colSpan:4,
                        label: {
                            alignment: "right",
                            text: "活动图片"
                        },
                        template: this.addIamgeFile
                    },
                    {
                        dataField: "tags",
                        colSpan: 4,
                        label: {
                            alignment: "right",
                            text: "关键词设置"
                        },
                        template: this.addTag
                    },
                    {
                        dataField: "description",
                        editorType:'dxTextArea',
                        colSpan:4,
                        label: {
                            alignment: "right",
                            text: "活动描述"
                        },
                        editorOptions:{
                            readOnly:true
                        }
                    },
                    {
                        dataField: "summary",
                        editorType:'dxTextArea',
                        colSpan:4,
                        label: {
                            alignment: "right",
                            text: "备注"
                        },
                        editorOptions:{
                            readOnly:true
                        }
                    },
                ]
            }).dxForm("instance");

            this.rejectForm = $('#rejectForm').dxForm({
                formData: this.rejectFormData,
                items: [
                    {
                        dataField: 'unauthReson',
                        editorType:'dxTextArea',
                        label: {
                            alignment: 'right',
                            text: '驳回原因'
                        },
                        editorOptions:{
                            maxLength:50,
                            height:60
                        },
                        validationRules: [{
                            type:"required",
                            message: "请输入驳回原因"
                        }]
                    },
                ]
            }).dxForm('instance');

            this.activeInit();
        },
        methods:{
            activeInit:function(){
                let params = {};
                params.id = Number(this.$route.params.active_id);
                this.$put(active_detail_url,params).then(res => {
                    if(res.code=='200')
                    {
                        this.activeInfoFormData = res.data;
                        this.activeInfoForm.option("formData",this.activeInfoFormData);
                        this.activeInfoForm.repaint();
                    }
                    else {
                        this.warn(res.msg);
                    }
                }).catch(err=>
                {
                    this.error(err)
                    // console.log(err)
                });
            },

            addIamgeFile(data, itemElement) {
                itemElement.append("<div id='addImage'/>");
                let FileUpload = new Vue(Image);
                FileUpload.$parent = this;
                FileUpload.$mount('#addImage');
            },

            addTag(data, itemElement) {
                itemElement.append("<div id='t'/>");
                let tag = new Vue(Tag);
                tag.$parent = this;
                this.$refs.tagData = tag;
                tag.$mount('#t');
            },

            cancle:function () {
                this.$router.push({
                    name: 'active-audit',
                });
            },

            formCancle(){
                this.modal.visible = false;
            },
            submit:function(){
                let params = {};
                params.id = this.activeInfoFormData.id;
                params.status = 2;
                this.$post(active_status_url, params).then(res => {
                    if (res.code == '200') {
                        this.success('发布成功!', () => {
                            this.$router.push({
                                name: 'active-audit',
                            });
                        });
                    }
                    else {
                        //提示信息
                        this.warn(res.msg);
                    }
                }).catch(err => {
                    this.error(err);
                });
            },

            reject:function(){
                this.rejectFormData = {};
                this.rejectForm.option('formData',this.rejectFormData);
                this.modal.visible = true;
            },

            save(){
                let params = {};
                this.modal.modal_loading = true;
                if(!this.rejectForm.validate().isValid) {
                    this.modal.modal_loading = false;
                    return;
                }
                params.id = this.activeInfoFormData.id;
                params.status = 3;
                params.reson = this.rejectFormData.unauthReson;
                this.$post(active_status_url, params).then(res => {
                    if (res.code == '200') {
                        this.success('驳回成功!', () => {
                            this.$router.push({
                                name: 'active-audit',
                            });
                        });
                    }
                    else {
                        //提示信息
                        this.warn(res.msg);
                    }
                }).catch(err => {
                    this.error(err);
                });
            },

            //添加区域
            addAreaCascade: function (data, itemElement) {
                itemElement.append("<div id='Area'/>");
                var area = new (Vue.component('AreaCascade'));
                area.field = data;
                area.field.isDisabled = true;
                area.$mount('#Area');
            },
        }
    }
</script>