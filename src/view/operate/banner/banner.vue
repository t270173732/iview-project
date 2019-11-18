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
        <Modal v-model="modal.visible" :mask-closable="false" width="650" title="编辑数据">
            <p slot="header">
                <span v-if="modal.isNew">新增轮播图</span>
                <span v-else="modal.isNew">编辑轮播图</span>
            </p>
            <div id="editForm"></div>
            <div slot="footer">
                <Button type="text" @click="editFormCancel">取消</Button>
                <Button type="primary" :loading="modal.modal_loading" @click="formSubmit">保存</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    import Vue from 'vue';
    import Image from './image';
    let banner_grid_data_url = '/biz/bizBroadcast/read/page';
    let del_banner_url = '/biz/bizBroadcast/deleteBroadCast';
    let banner_insert_url = '/biz/bizBroadcast/updateBroadCast';
    //药品
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
                    modal_loading:false
                },
                bannerGridData: new this.customstore({
                    load: (loadOptions) => {
                        return this.CommDs.loadPage(loadOptions, banner_grid_data_url, this.isLoadData, {});
                    },
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
                onToolbarPreparing: (e) => {
                    e.toolbarOptions.items.unshift({
                        location: 'before',
                        template: () => {
                            return $('<div id=\'btn\'/>');
                        }
                    });
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
                            let opcol = new (Vue.component('OpCol'));
                            if(options.data.status == 1){
                                opcol.items = [
                                    { text: '编辑', showtip: false, id: options.data, click:this.bannerEdit},
                                ];
                            }else{
                                opcol.items = [
                                    { text: '编辑', showtip: false, id: options.data, click:this.bannerEdit},
                                    { text: '删除', showtip: true, color:'#ff9900', tip: '您确认删除吗？', id: options.data, click:this.bannerDel},
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
                            maxLength:50
                        },
                        validationRules: [{
                            type: "required",
                            message: "请输入名称"
                        }]
                    },
                    {
                        dataField: 'contentType',
                        editorType: 'dxSelectBox',
                        editorOptions: {
                            dataSource: this.enum.contentType,
                            displayExpr: 'text',
                            valueExpr: 'id',
                        },
                        label: {
                            alignment: 'right',
                            text: '轮播图分类'
                        },
                        validationRules: [{
                            type: "required",
                            message: "请选择分类"
                        }]
                    },
                    {
                        dataField: 'type',
                        editorType: 'dxSelectBox',
                        editorOptions: {
                            dataSource: this.enum.bannerType,
                            displayExpr: 'text',
                            valueExpr: 'id',
                        },
                        label: {
                            alignment: 'right',
                            text: '轮播图类型'
                        },
                        validationRules: [{
                            type: "required",
                            message: "轮播图类型"
                        }]
                    },
                    {
                        dataField: "articleId",
                        visible:true,
                        editorType: "dxSelectBox",
                        label: {
                            alignment: "right",
                            text: "选择资讯"
                        },
                        validationRules: [{
                            type: 'required',
                            message: '请选择资讯'
                        }],
                        editorOptions:{
                            dataSource:this.CommDs.acticleListData,
                            displayExpr:'title',
                            valueExpr:'id',
                            searchEnabled:true
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
                        validationRules: [{
                            type: 'required',
                            message: '请选择活动'
                        }],
                        editorOptions:{
                            dataSource:this.CommDs.activeListData,
                            displayExpr:'title',
                            valueExpr:'id',
                            searchEnabled:true
                        }
                    },
                    {
                        dataField: "productId",
                        visible:false,
                        editorType: "dxDropDownBox",
                        label: {
                            alignment: "right",
                            text: "选择药品"
                        },
                        validationRules: [{
                            type: 'required',
                            message: '请选择药品'
                        }],
                        editorOptions:{
                            dropDownOptions: { width:450 },
                            placeholder: '选择药品',
                            showClearButton: true,
                            valueExpr: "id",
                            displayExpr: 'name',
                            dataSource: this.productListData,
                            contentTemplate: (e) => {
                                let value = e.component.option('value');
                                let grid = $('<div>').dxDataGrid({
                                    dataSource: e.component.option('dataSource'),
                                    searchPanel: {
                                        visible: true,
                                        width: 150,
                                        placeholder: '查找...'
                                    },
                                    columns: [
                                        {
                                            caption: '药品名称',
                                            dataField: 'name',
                                            width:100
                                        },
                                        {
                                            caption: '包装规格',
                                            dataField: 'packSpec',
                                            width:50
                                        },
                                        {
                                            caption: '包装单位',
                                            alignment:'center',
                                            dataField: 'packUnit',
                                            width:50
                                        },
                                        {
                                            caption: '厂商',
                                            dataField: 'factory',
                                        },
                                    ],
                                    hoverStateEnabled: true,
                                    scrolling: { mode: 'infinite' },
                                    paging: { enabled: true, pageSize: 10 },
                                    // filterRow: { visible: true },
                                    height: 300,
                                    selection: {
                                        mode: "single"
                                    },
                                    selectedRowKeys: [value],
                                    onSelectionChanged: (selectedItems) => {
                                        let keys = selectedItems.selectedRowKeys;
                                        let hasSelection = keys.length;

                                        e.component.option("value", keys[0]);
                                    }
                                });
                                let instance = grid.dxDataGrid('instance');
                                e.component.on("valueChanged", function (args) {
                                    instance.selectRows(args.value, false);
                                    e.component.close();
                                });
                                return grid;
                            }
                        }
                    },
                    {
                        dataField: 'remark',
                        colSpan:2,
                        editorOptions: {
                            maxLength:20
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
                        validationRules: [{
                            type: "required",
                            message: "请上传轮播图"
                        }],
                        template: this.addIamgeFile
                    },
                ]
            }).dxForm('instance');

            this.btnPart = new (Vue.component('CommandBtns'))();
            this.btnPart.items = [
                {id: 1, text: '新增', type: 'primary', enabled: true, click: this.addBanner},
            ];
            this.btnPart.$mount('#btn');
            this.btnPart.$parent = this;
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
            addBanner(){
                this.modal.isNew = true;
                this.editFormData = {};
                this.editFormData.contentType = 2;
                this.editForm.option('formData',this.editFormData);
                this.editForm.repaint();
                this.modal.visible = true;
            },
            bannerEdit(data){
                this.modal.isNew = false;
                this.editFormData = data;
                if(data.contentType == 1){
                    this.editFormData.activeId = data.contentId;
                }else if(data.contentType == 2){
                    this.editFormData.articleId = data.contentId;
                }else if(data.contentType == 3){
                    this.editFormData.productId = data.contentId;
                }
                this.editForm.option("formData",this.editFormData);
                this.modal.visible = true;
            },
            bannerDel(data){
                let params = {},p_data = {};
                p_data.id = data.id;
                params.data = p_data;
                this.$del(del_banner_url, params).then(res => {
                    if (res.code == '200') {
                        this.success('删除成功!', () => {
                            this.bannerGrid.refresh();
                        });
                    } else {
                        // 提示信息
                        this.warn(res.msg);
                    }
                }).catch(err => {
                    this.error(err);
                });
            },
            editFormCancel:function () {
                this.modal.visible = false;
            },
            formSubmit:function () {
                let params = {};
                this.modal.modal_loading = true;
                if (!this.editForm.validate().isValid) {
                    this.modal.modal_loading = false;
                    return;
                }
                if(!this.editFormData.photoImg && !this.editFormData.photoUrl){
                    this.warn('请上传轮播图');
                    this.modal.modal_loading = false;
                    return;
                }
                if(this.editFormData.photoImg && this.editFormData.photoImg.length == 0){
                    this.warn('请上传轮播图');
                    this.modal.modal_loading = false;
                    return;
                }
                if(this.editFormData.contentType == 1){
                    this.editFormData.contentId = this.editFormData.activeId
                }else if(this.editFormData.contentType == 2){
                    this.editFormData.contentId = this.editFormData.articleId
                }else if(this.editFormData.contentType == 3){
                    this.editFormData.contentId = this.editFormData.productId
                }
                this.editFormData.status = 0;
                params = this.editFormData;
                this.$post(banner_insert_url, params).then(res => {
                    if (res.code == '200') {
                        this.success('保存成功!', () => {
                            this.modal.modal_loading = false;
                            this.modal.visible = false;
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
            addIamgeFile: function (data, itemElement) {
                itemElement.append("<div id='addImage'/>");
                let FileUpload = new Vue(Image);
                FileUpload.$parent = this;
                FileUpload.$mount('#addImage');
            },
        }
    }
</script>