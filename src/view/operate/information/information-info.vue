<style lang="less">
    @import "../../../styles/common.less";
</style>
<template>
    <div>
        <Card dis-hover>
            <div slot="title" class="cardHead">
                <a href="#" @click.prevent="cancle">
                    <Icon type="ios-arrow-back"></Icon>
                    返回
                </a>
            </div>
            <p slot="extra">
                <Button type="primary" @click="submit" :loading="modal_loading">保存</Button>
                <Button class="margin-left-5" @click="cancle">取消</Button>
            </p>
            <Row class="margin-top-10">
                <div id="articleForm"></div>
            </Row>
        </Card>
    </div>
</template>
<script>
    import Vue from 'vue';
    import Image from './image';
    import Tag from './tag';
    import Editor from './editor';

    let article_detail_url = '/biz/bizArticle/read/detail';
    let article_update_url = '/biz/bizArticle/updateArticle';
    let class_list_url = '/biz/bizContentClass/read/list';
    let class_byKey_url = '/biz/bizContentClass/read/detail';
    export default {
        data() {
            return {
                modal_loading: false,
                articleForm: {},
                articleFormData: {},
                contentClassList: new this.customstore({
                    key: "id",
                    byKey: (key) => {
                        return this.CommDs.loadByKey(class_byKey_url, {id: key});
                    },
                    load: (e) => {
                        return this.CommDs.loadList(class_list_url,{status:1});
                    }
                }),
            }
        },
        mounted() {
            this.articleForm = $('#articleForm').dxForm({
                colCount: 4,
                formData: this.articleFormData,
                items: [
                    {
                        dataField: 'title',
                        colSpan: 4,
                        label: {
                            alignment: 'right',
                            text: '资讯标题'
                        },
                        validationRules: [{
                            type: "required",
                            message: "请输入资讯标题"
                        }]
                    },
                    {
                        dataField: 'photoImg',
                        colSpan: 4,
                        label: {
                            alignment: 'right',
                            text: '资讯封面图'
                        },
                        validationRules: [{
                            type: "required",
                        }],
                        template: (data, itemElement) => {
                            itemElement.append("<div id='addImage'/>");
                        }
                    },
                    {
                        dataField: 'contentClass',
                        editorType: 'dxSelectBox',
                        label: {
                            alignment: 'right',
                            text: '选择分类'
                        },
                        validationRules: [{
                            type: "required",
                            message: "请选择选择分类"
                        }],
                        editorOptions: {
                            dataSource: this.contentClassList,
                            displayExpr: 'className',
                            valueExpr: 'id'
                        }
                    },
                    {
                        dataField: 'recommend',
                        editorType: 'dxSelectBox',
                        label: {
                            alignment: 'right',
                            text: '是否推荐'
                        },
                        validationRules: [{
                            type: "required",
                            message: "请选择是否推荐"
                        }],
                        editorOptions: {
                            dataSource: this.enum.yesNo,
                            displayExpr: 'text',
                            valueExpr: 'id'
                        }
                    },
                    {
                        dataField: 'top',
                        editorType: 'dxSelectBox',
                        label: {
                            alignment: 'right',
                            text: '是否置顶'
                        },
                        validationRules: [{
                            type: "required",
                            message: "请选择是否置顶"
                        }],
                        editorOptions: {
                            dataSource: this.enum.yesNo,
                            displayExpr: 'text',
                            valueExpr: 'id'
                        }
                    },
                    {
                        itemType: 'empty'
                    },
                    {
                        dataField: 'tags',
                        colSpan: 4,
                        label: {
                            alignment: 'right',
                            text: '关键词设置'
                        },
                        validationRules: [{
                            type: "required",
                            message: "请设置关键词"
                        }],
                        template: (data, itemElement) => {
                            itemElement.append("<div id='tag'/>");
                        }
                    },
                    {
                        dataField: 'content',
                        colSpan: 4,
                        label: {
                            alignment: 'right',
                            text: '资讯内容'
                        },
                        validationRules: [{
                            type: "required",
                            message: "请输入资讯内容"
                        }],
                        template: (data, itemElement) => {
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
                            maxLength:200
                        }
                    },
                    {
                        dataField: 'reson',
                        colSpan:4,
                        visible:false,
                        label: {
                            alignment: 'right',
                            text: '不通过原因'
                        },
                        editorOptions:{
                            readOnly:true
                        }
                    },
                ]
            }).dxForm('instance');

            this.articleInit();
        },
        methods: {
            articleInit() {
                if (this.$route.params.information_id == 0) {
                    this.articleFormData = {};
                    this.articleFormData.recommend = 0;
                    this.articleFormData.top = 0;
                    this.articleForm.option('formData', this.articleFormData);
                    this.addIamgeFile();
                    this.addTag();
                    this.addEditor();
                } else {
                    let params = {};
                    params.id = Number(this.$route.params.information_id);
                    this.$put(article_detail_url, params).then(res => {
                        if (res.code == '200') {
                            this.articleFormData = res.data;
                            this.articleForm.option("formData", this.articleFormData);
                            if(this.articleFormData.status == 3){
                                this.articleForm.itemOption('reson','visible',true)
                            }
                            this.addIamgeFile();
                            this.addTag();
                            this.addEditor();
                        }
                        else {
                            this.warn(res.msg);
                        }
                    }).catch(err => {
                        this.error(err)
                        // console.log(err)
                    });
                }
            },
            cancle() {
                this.$router.push({
                    name: 'information',
                });
            },
            submit() {
                let params = {};
                this.modal_loading = true;
                if (!this.articleForm.validate().isValid) {
                    this.modal_loading = false;
                    return;
                }
                if(!this.articleFormData.photoImg && !this.articleFormData.photoUrl){
                    this.warn('请上传资讯封面图');
                    this.modal_loading = false;
                    return;
                }
                if(this.articleFormData.photoImg && this.articleFormData.photoImg.length == 0){
                    this.warn('请上传资讯封面图');
                    this.modal_loading = false;
                    return;
                }
                if(!this.articleFormData.tags || this.articleFormData.tags.length == 0){
                    this.warn('请设置关键词');
                    this.modal_loading = false;
                    return;
                }
                if (this.$refs.editorData.editorContent == undefined) {
                    this.warn('请输入资讯内容');
                    this.modal_loading = false;
                    return;
                } else {
                    this.articleFormData.content = this.$refs.editorData.editorContent;
                }
                if(this.articleFormData.status == 3){
                    this.articleFormData.reson = ''
                }
                this.articleFormData.status = 1;
                params = this.articleFormData;
                this.$post(article_update_url, params).then(res => {
                    if (res.code == '200') {
                        this.success('保存成功!', () => {
                            this.$router.push({
                                name: 'information',
                            });
                            this.modal_loading = true;
                        });
                    }
                    else {
                        this.modal_loading = true;
                        this.warn(res.msg);
                    }
                }).catch(err => {
                    this.modal_loading = true;
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
                this.$refs.editorData = tag
            },
        }
    }
</script>