<style lang="less">
    @import "../../../styles/common.less";
</style>
<template>
    <div>
        <Card dis-hover>
            <Row>
                <Searchpanel ref="searchPanel">
                    <div slot="form" class="margin-bottom-3" id="searchForm">
                    </div>
                    <div slot="control">
                        <Button type="primary" @click="search">查询</Button>
                        <Button @click="resetSearch" class="margin-left-5">重置</Button>
                    </div>
                </Searchpanel>
            </Row>
            <Row class="margin-top-10">
                <div id="bannerGrid"></div>
            </Row>
        </Card>
        <Modal v-model="modal.visible" :mask-closable="false" width="650" title="编辑数据" :footer-hide="modal.footerHide">
            <p slot="header">
                <span v-if="modal.isNew">新增轮播图</span>
                <span v-else="modal.isNew">轮播图</span>
            </p>
            <div id="editForm"></div>
            <div slot="footer">
                <Button type="text" @click="editFormCancel">取消</Button>
                <Button type="primary" :loading="modal.modal_loading" @click="formSubmit">发布</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    import Vue from 'vue';
    import Image from './image';
    let banner_grid_data_url = '/biz/bizBroadcast/read/page';
    let banner_status_url = '/biz/bizBroadcast/updateBroadCastStatus';
    //资讯
    let acticle_list_url = '/biz/bizArticle/read/list';
    let acticle_list_byKey_url = '/biz/bizArticle/read/detail';
    //活动
    let active_list_url = '/biz/bizActivity/read/list';
    let active_list_byKey_url = '/biz/bizActivity/read/detail';
    //商品
    let product_list_url = '/biz/bdDrugs/read/list';
    let product_list_byKey_url = '/biz/bdDrugs/read/detail';
    export default {
        data(){
            return{
                isLoadData:true,
                searchForm:{},
                searchFormData:{},
                editForm:{},
                editFormData:{},
                modal:{
                    isNew:true,
                    visible:false,
                    footerHide:false,
                    modal_loading:false
                },
                bannerGridData: new this.customstore({
                    load: (loadOptions) => {
                        return this.CommDs.loadPage(loadOptions, banner_grid_data_url, this.isLoadData, {});
                    },
                }),
                acticleListData: new this.customstore({
                    key: "id",
                    byKey: (key) => {
                        return this.CommDs.loadByKey(acticle_list_byKey_url, { id: key });
                    },
                    load: (e) => {
                        return this.CommDs.loadList(acticle_list_url);
                    }
                }),
                activeListData: new this.customstore({
                    key: "id",
                    byKey: (key) => {
                        return this.CommDs.loadByKey(active_list_byKey_url, { id: key });
                    },
                    load: (e) => {
                        return this.CommDs.loadList(active_list_url);
                    }
                }),
                productListData: new this.customstore({
                    key: "id",
                    byKey: (key) => {
                        return this.CommDs.loadByKey(product_list_byKey_url, { id: key });
                    },
                    load: (e) => {
                        return this.CommDs.loadList(product_list_url);
                    }
                }),
            }
        },
        mounted(){
            this.searchForm = $('#searchForm').dxForm({
                colCount: 4,
                formData: this.searchFormData,
                items: [
                    {
                        dataField: 'castName',
                        label: {
                            alignment: 'right',
                            text: '轮播图名称'
                        },
                    },
                    {
                        dataField: 'contentType',
                        editorType: 'dxSelectBox',
                        label: {
                            alignment: 'right',
                            text: '分类'
                        },
                        editorOptions: {
                            dataSource: this.enum.contentType,
                            displayExpr: 'text',
                            valueExpr: 'id',
                        },
                    },
                    {
                        dataField: 'status',
                        editorType: 'dxSelectBox',
                        label: {
                            alignment: 'right',
                            text: '状态'
                        },
                        editorOptions: {
                            dataSource: this.enum.castStatus,
                            displayExpr: 'text',
                            valueExpr: 'id',
                        },
                    },
                ]
            }).dxForm('instance');

            this.bannerGrid = $("#bannerGrid").dxDataGrid({
                showRowLines: true,
                showBorders: true,
                allowColumnReordering: true,
                allowColumnResizing: true,
                columnAutoWidth: true,
                columnFixing: {
                    enabled: true
                },
                selection: {
                    mode: "single"
                },
                hoverStateEnabled: true,
                dataSource: {
                    store: this.bannerGridData
                },
                remoteOperations: {
                    sorting: true,
                    paging: true
                },
                paging: {
                    pageSize: 10
                },
                columns: [
                    {
                        caption: "操作",
                        width: 100,
                        alignment: "center",
                        allowResizing: false,
                        allowFiltering: false,
                        allowSorting: false,
                        cellTemplate: (container, options) => {
                            container.append("<div id='b'/>");
                            var opcol = new (Vue.component('OpCol'));
                            if(options.data.status == 0){
                                opcol.items = [
                                    { text: '发布', showtip: false, id: options.data, click:this.publish},
                                ];
                            }else if(options.data.status == 1){
                                opcol.items = [
                                    { text: '撤回', showtip: true, color:'#ff9900', tip: '您确认撤回吗？', id: options.data, click:this.notPublish},
                                ];
                            }else{
                                opcol.items = [
                                    { text: '查看', showtip: false, id: options.data, click:this.bannerEdit},
                                ];
                            }
                            opcol.$mount('#b');
                        }
                    },
                    {
                        caption: "轮播图名称",
                        dataField: "castName",
                        allowSorting: false,
                    },
                    {
                        caption: "分类",
                        dataField: "contentType",
                        allowSorting: false,
                        lookup: {
                            dataSource: this.enum.contentType,
                            displayExpr: 'text',
                            valueExpr: 'id'
                        },
                        width: 100
                    },
                    {
                        caption: "状态",
                        alignment: "center",
                        dataField: "status",
                        allowSorting: false,
                        lookup: {
                            dataSource: this.enum.castStatus,
                            displayExpr: 'text',
                            valueExpr: 'id'
                        },
                        width: 100
                    },
                    {
                        caption: "备注",
                        dataField: "remark",
                        allowSorting: false,
                    },
                ]
            }).dxDataGrid("instance");

            this.editForm = $('#editForm').dxForm({
                colCount: 2,
                formData: this.editFormData,
                onFieldDataChanged:(e)=>{
                    if(e.dataField == 'contentType'){
                        if(e.value == 1){
                            this.editForm.itemOption('articleId','visible',false);
                            this.editForm.itemOption('activeId','visible',true);
                            this.editForm.itemOption('productId','visible',false);
                        }else if(e.value == 2){
                            this.editForm.itemOption('articleId','visible',true);
                            this.editForm.itemOption('activeId','visible',false);
                            this.editForm.itemOption('productId','visible',false);
                        }else if(e.value == 3){
                            this.editForm.itemOption('articleId','visible',false);
                            this.editForm.itemOption('activeId','visible',false);
                            this.editForm.itemOption('productId','visible',true);
                        }
                    }
                },
                items: [
                    {
                        dataField: 'castName',
                        label: {
                            alignment: 'right',
                            text: '轮播图名称'
                        },
                        editorOptions:{
                            maxLength:50,
                            readOnly:true,
                        },
                    },
                    {
                        dataField: 'contentType',
                        editorType: 'dxSelectBox',
                        editorOptions: {
                            dataSource: this.enum.contentType,
                            displayExpr: 'text',
                            valueExpr: 'id',
                            readOnly:true,
                        },
                        label: {
                            alignment: 'right',
                            text: '轮播图分类'
                        },
                    },
                    {
                        dataField: 'type',
                        editorType: 'dxSelectBox',
                        editorOptions: {
                            dataSource: this.enum.bannerType,
                            displayExpr: 'text',
                            valueExpr: 'id',
                            readOnly:true,
                        },
                        label: {
                            alignment: 'right',
                            text: '轮播图类型'
                        },
                    },
                    {
                        dataField: "articleId",
                        visible:true,
                        editorType: "dxSelectBox",
                        label: {
                            alignment: "right",
                            text: "选择资讯"
                        },
                        editorOptions:{
                            dataSource:this.acticleListData,
                            displayExpr:'title',
                            valueExpr:'id',
                            readOnly:true,
                        }
                    },
                    {
                        dataField: "activeId",
                        visible:false,
                        editorType: "dxSelectBox",
                        label: {
                            alignment: "right",
                            text: "选择活动"
                        },
                        editorOptions:{
                            dataSource:this.activeListData,
                            displayExpr:'title',
                            valueExpr:'id',
                            readOnly:true,
                        }
                    },
                    {
                        dataField: "productId",
                        visible:false,
                        editorType: "dxSelectBox",
                        label: {
                            alignment: "right",
                            text: "药品"
                        },
                        editorOptions:{
                            readOnly:true,
                            placeholder: '选择药品',
                            valueExpr: "id",
                            displayExpr: 'name',
                            dataSource: this.productListData,
                        }
                    },
                    {
                        dataField: 'remark',
                        colSpan:2,
                        editorOptions: {
                            readOnly:true
                        },
                        label: {
                            alignment: 'right',
                            text: '备注'
                        },
                    },
                    {
                        dataField: "photoImg",
                        label: {
                            alignment: "right",
                            text: "轮播图"
                        },
                        template: this.addIamgeFile
                    },
                ]
            }).dxForm('instance');
        },
        methods:{
            search(){
                let ds = this.bannerGrid.getDataSource();
                ds.loadOptions().searchData = this.searchFormData;
                ds.reload();
            },
            resetSearch(){
                this.searchForm.resetValues();
                this.bannerGrid.refresh();
            },
            bannerEdit(data){
                this.modal.isNew = false;
                this.editFormData = data;
                if(this.editFormData.contentType == 1){
                    this.editFormData.activeId = this.editFormData.contentId;
                }else if(this.editFormData.contentType == 2){
                    this.editFormData.articleId = this.editFormData.contentId;
                }else if(this.editFormData.contentType == 3){
                    this.editFormData.productId = this.editFormData.contentId;
                }
                this.editForm.option("formData",this.editFormData);
                this.modal.footerHide = true;
                this.modal.visible = true;
            },
            publish(data){
                this.modal.isNew = false;
                this.editFormData = data;
                if(this.editFormData.contentType == 1){
                    this.editFormData.activeId = this.editFormData.contentId;
                }else if(this.editFormData.contentType == 2){
                    this.editFormData.articleId = this.editFormData.contentId;
                }else if(this.editFormData.contentType == 3){
                    this.editFormData.productId = this.editFormData.contentId;
                }
                this.editForm.option("formData",this.editFormData);
                this.modal.footerHide = false;
                this.modal.visible = true;
            },
            notPublish(data){
                let params = {};
                params.id = data.id;
                params.status = 2;
                this.$post(banner_status_url, params).then(res => {
                    if (res.code == '200') {
                        this.success('撤回成功!', () => {
                            this.bannerGrid.refresh();
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
            formSubmit(){
                let params = {};
                this.modal.modal_loading = true;
                params.id = this.editFormData.id;
                params.status = 1;
                this.$post(banner_status_url, params).then(res => {
                    if (res.code == '200') {
                        this.success('发布成功!', () => {
                            this.modal.visible = false;
                            this.modal.modal_loading = false;
                            this.bannerGrid.refresh();
                        });
                    }
                    else {
                        this.modal.modal_loading = false;
                        this.warn(res.msg);
                    }
                }).catch(err => {
                    this.modal.modal_loading = false;
                    this.error(err);
                });
            },
            editFormCancel:function () {
                this.modal.visible = false;
            },
            addIamgeFile: function (data, itemElement) {
                itemElement.append("<div id='addImage'/>");
                let FileUpload = new Vue(Image);
                FileUpload.$parent = this;
                FileUpload.$mount('#addImage');
            },
        }
    }
</script>