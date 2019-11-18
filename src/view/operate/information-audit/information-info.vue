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
                <div id="articleForm"></div>
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
    import Image from './image';
    import Tag from './tag';
    import Editor from './editor';
    let article_detail_url = '/biz/bizArticle/read/detail';
    let article_status_url = '/biz/bizArticle/updateStatus';
    let class_list_url = '/biz/bizContentClass/read/list';
    let class_byKey_url = '/biz/bizContentClass/read/detail';
    export default {
        data(){
            return{
                modal_loading:false,
                articleForm:{},
                articleFormData:{},
                rejectForm:{},
                rejectFormData:{},
                modal:{
                    visible:false,
                    modal_loading:false
                },
                contentClassList: new this.customstore({
                    key: "id",
                    byKey: (key) => {
                        return this.CommDs.loadByKey(class_byKey_url, { id: key });
                    },
                    load: (e) => {
                        return this.CommDs.loadList(class_list_url);
                    }
                }),
            }
        },
        mounted(){
            this.articleForm = $('#articleForm').dxForm({
                colCount: 4,
                formData: this.articleFormData,
                items: [
                    {
                        dataField: 'title',
                        colSpan:4,
                        label: {
                            alignment: 'right',
                            text: '资讯标题'
                        },
                        validationRules: [{
                            type:"required",
                            message: "请输入资讯标题"
                        }],
                        editorOptions:{
                            readOnly:true
                        }
                    },
                    {
                        dataField: 'photoImg',
                        colSpan:4,
                        label: {
                            alignment: 'right',
                            text: '资讯封面图'
                        },
                        template:(data, itemElement)=>{
                            itemElement.append("<div id='addImage'/>");
                        }
                    },
                    {
                        dataField: 'contentClass',
                        editorType:'dxSelectBox',
                        label: {
                            alignment: 'right',
                            text: '选择分类'
                        },
                        validationRules: [{
                            type:"required",
                            message: "请选择选择分类"
                        }],
                        editorOptions:{
                            dataSource:this.contentClassList,
                            displayExpr:'className',
                            valueExpr:'id',
                            readOnly:true
                        }
                    },
                    {
                        dataField: 'recommend',
                        editorType:'dxSelectBox',
                        label: {
                            alignment: 'right',
                            text: '是否推荐'
                        },
                        validationRules: [{
                            type:"required",
                            message: "请选择是否推荐"
                        }],
                        editorOptions:{
                            dataSource:this.enum.yesNo,
                            displayExpr:'text',
                            valueExpr:'id',
                            readOnly:true
                        }
                    },
                    {
                        dataField: 'top',
                        editorType:'dxSelectBox',
                        label: {
                            alignment: 'right',
                            text: '是否置顶'
                        },
                        validationRules: [{
                            type:"required",
                            message: "请选择是否置顶"
                        }],
                        editorOptions:{
                            dataSource:this.enum.yesNo,
                            displayExpr:'text',
                            valueExpr:'id',
                            readOnly:true
                        }
                    },
                    {
                        itemType:'empty'
                    },
                    {
                        dataField: 'tags',
                        colSpan:4,
                        label: {
                            alignment: 'right',
                            text: '关键词设置'
                        },
                        validationRules: [{
                            type:"required",
                            message: "请设置关键词"
                        }],
                        template:(data, itemElement)=>{
                            itemElement.append("<div id='tag'/>");
                        }
                    },
                    {
                        dataField: 'content',
                        colSpan:4,
                        label: {
                            alignment: 'right',
                            text: '资讯内容'
                        },
                        validationRules: [{
                            type:"required",
                            message: "请输入资讯内容"
                        }],
                        template:(data, itemElement)=>{
                            itemElement.append("<div id='editor'/>");
                        }
                    },
                    {
                        dataField: 'remark',
                        editorType:'dxTextArea',
                        colSpan: 4,
                        label: {
                            alignment: 'right',
                            text: '备注'
                        },
                        editorOptions:{
                            height:60,
                            readOnly:true
                        }
                    }
                ]
            }).dxForm('instance');

            this.rejectForm = $('#rejectForm').dxForm({
                formData: this.rejectFormData,
                items: [
                    {
                        dataField: 'reson',
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
                            message: "请输入不通过原因"
                        }]
                    },
                ]
            }).dxForm('instance');

            this.articleInit();
        },
        methods:{
            articleInit(){
                let params = {};
                params.id = Number(this.$route.params.information_id);
                this.$put(article_detail_url,params).then(res => {
                    if(res.code=='200')
                    {
                        this.articleFormData = res.data;
                        this.articleForm.option("formData",this.articleFormData);
                        this.addIamgeFile();
                        this.addTag();
                        this.addEditor();
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
            cancle(){
                this.$router.push({
                    name: 'information-audit',
                });
            },
            agree(){
                let params = {};
                this.modal_loading = true;
                params.id = this.articleFormData.id;
                params.status = 2;
                this.$post(article_status_url,params).then(res => {
                    if(res.code=='200')
                    {
                        this.success('保存成功!',()=>{
                            this.$router.push({
                                name: 'information-audit',
                            });
                            this.modal_loading = true;
                        });
                    }
                    else
                    {
                        this.modal_loading = true;
                        this.warn(res.msg);
                    }
                }).catch(err=>
                {
                    this.modal_loading = true;
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
                this.rejectFormData.id = this.articleFormData.id;
                this.rejectFormData.status = 3;
                params = this.rejectFormData;
                this.$post(article_status_url,params).then(res => {
                    if(res.code=='200')
                    {
                        this.success('保存成功!',()=>{
                            this.$router.push({
                                name: 'information-audit',
                            });
                            this.modal_loading = false;
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
            addIamgeFile() {
                let FileUpload = new Vue(Image);
                FileUpload.$parent = this;
                FileUpload.$mount('#addImage');
            },
            addTag() {
                let tag = new Vue(Tag);
                tag.$parent = this;
                tag.$mount('#tag');
            },
            addEditor() {
                let tag = new Vue(Editor);
                tag.$parent = this;
                tag.$mount('#editor');
            },
        }
    }
</script>