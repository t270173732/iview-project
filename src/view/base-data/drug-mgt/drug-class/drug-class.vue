<style lang="less">
    @import "../../../../styles/common.less";
</style>
<template>
    <div>
        <Card dis-hover>
            <Row :gutter="10">
                <Col span="8">
                    <Card :padding="5" title="药品分类" dis-hover>
                        <div id="class-grid"></div>
                    </Card>
                </Col>
                <Col span="16">
                    <Card title="药品品种" :padding="5" dis-hover>
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
                        <div id="drug-varieties" class="margin-top-10"></div>
                        <Tabs class="margin-top-10">
                            <TabPane label="药品字典" name="name1">
                                <div id="drug-grid"></div>
                            </TabPane>
                        </Tabs>
                    </Card>
                </Col>
            </Row>
        </Card>
        <Modal v-model="modal.visible" :mask-closable="false" width="650" title="编辑数据">
            <p slot="header">
                <span v-if="modal.isNew">新增分类</span>
                <span v-else="modal.isNew">编辑分类</span>
            </p>
            <div id="classForm"></div>
            <div slot="footer">
                <Button type="text" @click="cancelForm">取消</Button>
                <Button type="text" @click="formSubmit('c')" v-show="modal.isNew">保存并继续</Button>
                <Button type="primary" :loading="modal.modal_loading" @click="formSubmit('s')">保存</Button>
            </div>
        </Modal>
        <Modal v-model="drugModal.visible" :mask-closable="false" width="700" title="编辑数据">
            <p slot="header">
                <span v-if="drugModal.isNew">新增</span>
                <span v-else="drugModal.isNew">编辑</span>
            </p>
            <div id="productForm"></div>
            <div slot="footer">
                <Button type="text" @click="cancelForm">取消</Button>
                <Button type="primary" :loading="drugModal.modal_loading" @click="drugsSubmit('s')">保存</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    import Vue from 'vue';
    import {codefans_net_CC2PY, word_wubi} from '@/libs/util.js';
    import Tag from '../drug-varieties/tag';
    import Image from '../drug-varieties/image';
    import ThumbnailImg from '../drug-varieties/thumbnailImg';
    let class_list_url = '/biz/bdDrugClass/read/drugClassList';
    let del_class_url = '/biz/bdDrugClass/delete';
    let class_insert_url = '/biz/bdDrugClass/update';
    let varieties_grid_data_url = '/biz/bdDrugVariety/read/page';
    let drugs_grid_data_url = '/biz/bdDrugs/read/page';
    let status_update_url = '/biz/bdDrugs/updateStatus';
    let del_drugs_url = '/biz/bdDrugs/deleteDrug';
    let drugs_detail_url = '/biz/bdDrugs/read/detail';
    let class_byKey_url = '/biz/bdDrugClass/read/detail';
    let parent_class_list_url = '/biz/bdDrugClass/read/drugClassListParentStart';
    export default {
        data(){
            return{
                selectData:{},
                searchForm:{},
                searchFormData:{},
                classForm:{},
                classFormData:{},
                isLoadData:false,
                selectVarieties:{},
                isLoadProductData:false,
                modal:{
                    isNew:true,
                    visible:false,
                    modal_loading:false
                },
                drugModal:{
                    isNew:true,
                    visible:false,
                    modal_loading:false
                },
                parentData:[],
                productForm:{},
                productFormData:{},
                classListData: new this.customstore({
                    key: "id",
                    byKey: (key) => {
                        return this.CommDs.loadByKey(class_byKey_url, { id: key });
                    },
                    load: (e) => {
                        return this.CommDs.loadList(class_list_url);
                    }
                }),
                varietiesGridData: new this.customstore({
                    load: (loadOptions) => {
                        return this.CommDs.loadPage(loadOptions, varieties_grid_data_url, this.isLoadData, {});
                    },
                }),
                productGridData: new this.customstore({
                    load: (loadOptions) => {
                        return this.CommDs.loadPage(loadOptions, drugs_grid_data_url, this.isLoadProductData, {});
                    },
                }),
            }
        },
        mounted(){
            this.classForm = $('#classForm').dxForm({
                colCount: 2,
                formData: this.classFormData,
                items: [
                    {
                        dataField: 'code',
                        label: {
                            alignment: 'right',
                            text: '编码'
                        },
                        editorOptions:{
                            placeholder:'<系统自动分配>',
                            disabled:true
                        }
                    },
                    {
                        dataField: 'parentId',
                        editorType: 'dxDropDownBox',
                        label: {
                            alignment: 'right',
                            text: '父级分类'
                        },
                        editorOptions:{
                            dataSource:this.CommDs.parentClassData,
                            displayExpr:'name',
                            valueExpr:'id',
                            searchEnabled:true,
                            searchExpr:'name',
                            searchMode:'contains'
                        },
                    },
                    {
                        dataField: 'name',
                        label: {
                            alignment: 'right',
                            text: '名称'
                        },
                        editorOptions:{
                            placeholder:'输入药品分类名称',
                            maxLength:50,
                            onValueChanged:(e)=>{
                                if(e.value){
                                    this.classForm.updateData('simpleCode',codefans_net_CC2PY($.trim(e.value)))
                                }
                            }
                        },
                        validationRules: [{
                            type: "required",
                            message: "请输入药品分类名称"
                        }]
                    },
                    {
                        dataField: 'simpleCode',
                        label: {
                            alignment: 'right',
                            text: '简码'
                        },
                        editorOptions:{
                            placeholder:'根据药品分类名称生成拼音简码',
                            maxLength:50,
                            readOnly:true
                        }
                    },
                    {
                        dataField: 'type',
                        editorType: 'dxSelectBox',
                        label: {
                            alignment: 'right',
                            text: '类别'
                        },
                        editorOptions: {
                            dataSource: this.enum.drugClass,
                            displayExpr: 'text',
                            valueExpr: 'id',
                        },
                        validationRules: [{
                            type: "required",
                            message: "请选择药品类别"
                        }]
                    },
                ]
            }).dxForm('instance');

            this.productForm = $('#productForm').dxForm({
                colCount: 2,
                formData: this.productFormData,
                items: [
                    {
                        dataField: 'drugCode',
                        label: {
                            alignment: 'right',
                            text: '商品编码'
                        },
                        editorOptions:{
                            placeholder:'<系统自动生成>',
                            disabled:true
                        }
                    },
                    {
                        dataField: 'varietyName',
                        label: {
                            alignment: 'right',
                            text: '通用名称'
                        },
                        editorOptions:{
                            readOnly:true
                        }
                    },
                    {
                        dataField: 'name',
                        label: {
                            alignment: 'right',
                            text: '商品名称'
                        },
                        editorOptions:{
                            placeholder:'输入商品名称',
                            maxLength:50,
                            onValueChanged:(e)=>{
                                if(e.value){
                                    this.productForm.updateData('pinyin',codefans_net_CC2PY($.trim(e.value)));
                                    this.productForm.updateData('wubi',word_wubi($.trim(e.value)))
                                }
                            }
                        },
                        validationRules: [{
                            type: "required",
                            message: "请输入商品名称"
                        }]
                    },
                    {
                        dataField: 'pinyin',
                        label: {
                            alignment: 'right',
                            text: '拼音简码'
                        },
                        editorOptions:{
                            placeholder:'通用名称生成拼音简码',
                            maxLength:20,
                            readOnly:true
                        },
                    },
                    {
                        dataField: 'wubi',
                        label: {
                            alignment: 'right',
                            text: '五笔简码'
                        },
                        editorOptions:{
                            placeholder:'通用名称生成五笔简码',
                            maxLength:20,
                            readOnly:true
                        },
                    },
                    {
                        dataField: 'enName',
                        label: {
                            alignment: 'right',
                            text: '英文名称'
                        },
                        editorOptions: {
                            placeholder: '输入药品英文名称',
                            maxLength:50
                        },
                        validationRules: [{
                            type: "required",
                            message: "请输入药品英文名称"
                        }]
                    },
                    {
                        dataField: "drugType",
                        editorType:'dxSelectBox',
                        label: {
                            alignment: 'right',
                            text: '药品类型'
                        },
                        editorOptions:{
                            placeholder: '选择药品类型',
                            dataSource:this.enum.drugType,
                            displayExpr:'text',
                            valueExpr:'id'
                        },
                        validationRules: [{
                            type: "required",
                            message: "请选择药品类型"
                        }]
                    },
                    {
                        dataField: 'packSpec',
                        label: {
                            alignment: 'right',
                            text: '包装规格'
                        },
                        editorOptions:{
                            placeholder:'输入包装规格',
                            maxLength:50
                        },
                        validationRules: [{
                            type: "required",
                            message: "请输入包装规格"
                        }]
                    },
                    {
                        dataField: 'packUnit',
                        label: {
                            alignment: 'right',
                            text: '包装单位'
                        },
                        editorOptions:{
                            placeholder:'输入包装单位',
                            maxLength:20
                        },
                        validationRules: [{
                            type: "required",
                            message: "请输入包装单位"
                        }]
                    },
                    {
                        dataField: 'factory',
                        label: {
                            alignment: 'right',
                            text: '生产厂商'
                        },
                        editorOptions:{
                            placeholder:'输入生产厂商',
                            maxLength:50
                        },
                        validationRules: [{
                            type: "required",
                            message: "请输入生产厂商"
                        }]
                    },
                    {
                        dataField: 'authNo',
                        label: {
                            alignment: 'right',
                            text: '批准文号'
                        },
                        editorOptions:{
                            placeholder:'输入批准文号',
                            maxLength:20
                        },
                        validationRules: [{
                            type: "required",
                            message: "请输入批准文号"
                        }]
                    },
                    {
                        dataField: 'localCode',
                        label: {
                            alignment: 'right',
                            text: '本位码'
                        },
                        editorOptions:{
                            placeholder:'输入本位码',
                            maxLength:20
                        },
                        validationRules: [{
                            type: "required",
                            message: "请输入本位码"
                        }]
                    },
                    {
                        dataField: 'supCode',
                        label: {
                            alignment: 'right',
                            text: '监管码'
                        },
                        editorOptions:{
                            placeholder:'输入监管码',
                            maxLength:20
                        },
                        validationRules: [{
                            type: "required",
                            message: "请输入监管码"
                        }]
                    },
                    {
                        dataField: 'baseDrug',
                        editorType: 'dxSelectBox',
                        label: {
                            alignment: 'right',
                            text: '基本药物'
                        },
                        editorOptions: {
                            dataSource: this.enum.baseDrug,
                            displayExpr: 'text',
                            valueExpr: 'id',
                        },
                    },
                    {
                        dataField: 'source',
                        editorType: 'dxSelectBox',
                        label: {
                            alignment: 'right',
                            text: '来源分类'
                        },
                        editorOptions: {
                            dataSource: this.enum.source,
                            displayExpr: 'text',
                            valueExpr: 'id',
                        },
                    },
                    {
                        itemType:'empty'
                    },
                    {
                        dataField: 'tags',
                        colSpan: 2,
                        label: {
                            alignment: 'right',
                            text: '关键词设置'
                        },
                        template: (data, itemElement) => {
                            itemElement.append("<div id='tag'/>");
                        }
                    },
                    {
                        dataField: 'thumbnailImg',
                        colSpan: 2,
                        validationRules: [{
                            type: "required",
                        }],
                        label: {
                            alignment: 'right',
                            text: '缩略图'
                        },
                        template: (data, itemElement) => {
                            itemElement.append("<div id='thumbnailImg'/>");
                        }
                    },
                    {
                        dataField: 'picImgs',
                        colSpan: 2,
                        label: {
                            alignment: 'right',
                            text: '详情图'
                        },
                        validationRules: [{
                            type: "required",
                        }],
                        template: (data, itemElement) => {
                            itemElement.append("<div id='picImg'/>");
                        }
                    },
                ]
            }).dxForm('instance');

            this.searchForm = $('#searchForm').dxForm({
                colCount: 3,
                formData: this.searchFormData,
                items: [
                    {
                        dataField: 'keyword',
                        label: {
                            alignment: 'right',
                            text: '名称'
                        },
                        editorOptions:{
                            placeholder:'输入药品编码/名称查询'
                        }
                    },
                ]
            }).dxForm('instance');

            this.classTreeListGrid = $("#class-grid").dxTreeList({
                keyExpr: "id",
                showRowLines: true,
                showBorders: true,
                columnAutoWidth: true,
                // expandedRowKeys: [1],
                parentIdExpr: 'parentId',
                remoteOperations: {
                    filtering: false,
                    sorting: false,
                    paging:false
                },
                height:700,
                // onContentReady: (e) => {
                //     e.component.selectRowsByIndexes([0]);
                // },
                onToolbarPreparing: (e) => {
                    e.toolbarOptions.items.unshift({
                        location: "before",
                        template: () => {
                            return $('<div id=\'btn\'/>');
                        }
                    });
                },
                onSelectionChanged: (e) => {
                    if (e.selectedRowKeys.length > 0) {
                        this.selectData = e.selectedRowsData[0];
                        this.isLoadData = true;
                        let searchData = {
                            parentId:this.selectData.id
                        };
                        this.varietiesGrid.getDataSource().loadOptions().searchData = searchData;
                        this.varietiesGrid.refresh();
                    }
                    else {
                        this.isLoadData = false;
                        this.varietiesGrid.refresh();
                    }
                },
                searchPanel: {
                    visible: true,
                    width: 240,
                    placeholder: '查找...'
                },
                selection: {
                    mode: "single"
                },
                dataSource: {
                    store: this.classListData
                },
                paging: {
                    pageSize: 10
                },
                columns: [
                    {
                        caption: "操作",
                        alignment: "center",
                        allowResizing: false,
                        allowFiltering: false,
                        allowSorting: false,
                        cellTemplate: (container, options) => {
                            container.append("<div id='t1'/>");
                            let opcol = new (Vue.component('OpCol'));
                            opcol.items = [
                                { text: '编辑', showtip: false, id: options.data, click:this.edit},
                                { text: '删除', showtip: true, color:'#ff9900', tip: '您确认删除吗？', id: options.data, click:this.classDel},
                            ];
                            if(options.data.status == 0){
                                opcol.items.push({ text: '启用', showtip: false, color:'#19be6b', id: options.data,extra:'Y', click:this.updateStatus})
                            }else if(options.data.status == 1){
                                opcol.items.push({ text: '停用', showtip: true, color:'#ff9900', tip: '您确认停用吗?', id: options.data,extra:'N', click:this.updateStatus})
                            }
                            opcol.$mount('#t1');
                        },
                        width:180
                    },
                    // {
                    //     caption: "分类编码",
                    //     dataField: "code",
                    //     sortOrder: "asc",
                    //     width:50
                    // },
                    {
                        caption: "名称",
                        dataField: "name",
                        allowSorting: false,
                    },
                    // {
                    //     caption: "类别",
                    //     dataField: "type",
                    //     allowSorting: false,
                    //     alignment: "center",
                    //     lookup:{
                    //         dataSource:this.enum.drugClass,
                    //         displayExpr:'text',
                    //         valueExpr:'id'
                    //     },
                    //     width:200
                    // },
                    // {
                    //     caption: "状态",
                    //     dataField: "status",
                    //     allowSorting: false,
                    //     alignment: "center",
                    //     lookup:{
                    //         dataSource:this.enum.status,
                    //         displayExpr:'text',
                    //         valueExpr:'id'
                    //     },
                    //     width:200
                    // },
                ]
            }).dxTreeList("instance");

            this.varietiesGrid = $("#drug-varieties").dxDataGrid({
                showRowLines: true,
                showBorders: true,
                allowColumnReordering: true,
                allowColumnResizing: true,
                columnAutoWidth: true,
                onContentReady: (e) => {
                    e.component.selectRowsByIndexes([0]);
                },
                onSelectionChanged: (e) => {
                    if (e.selectedRowKeys.length > 0) {
                        this.isLoadProductData = true;
                        this.selectVarieties = e.selectedRowKeys[0];
                        let searchData = {
                            varietyId:this.selectVarieties.id
                        };
                        this.productGrid.getDataSource().loadOptions().searchData = searchData;
                        this.productGrid.refresh();
                    }
                    else {
                        this.isLoadProductData = false;
                        this.productGrid.refresh();
                    }
                },
                columnFixing: {
                    enabled: true
                },
                selection: {
                    mode: "single"
                },
                hoverStateEnabled: true,
                dataSource: {
                    store: this.varietiesGridData
                },
                remoteOperations: {
                    filtering: true,
                    sorting: true,
                    paging: true
                },
                paging: {
                    pageSize: 10
                },
                columns: [
                    // {
                    //     caption: "操作",
                    //     width: 150,
                    //     alignment: "center",
                    //     allowResizing: false,
                    //     allowFiltering: false,
                    //     allowSorting: false,
                    //     cellTemplate: (container, options) => {
                    //         container.append("<div id='t1'/>");
                    //         let opcol = new (Vue.component('OpCol'));
                    //         opcol.items = [
                    //             { text: '编辑', showtip: false, id: options.data, click:this.edit},
                    //             { text: '删除', showtip: true, color:'#ff9900', tip: '您确认删除吗？', id: options.data, click:this.drugDel},
                    //         ];
                    //         if(options.data.status == 0){
                    //             opcol.items.push({ text: '启用', showtip: false, color:'#19be6b', id: options.data,extra:'Y', click:this.varietyUpdateStatus})
                    //         }else if(options.data.status == 1){
                    //             opcol.items.push({ text: '停用', showtip: true, color:'#ff9900', tip: '您确认停用吗?', id: options.data,extra:'N', click:this.varietyUpdateStatus})
                    //         }
                    //         opcol.$mount('#t1');
                    //     }
                    // },
                    {
                        caption: "药品编码",
                        dataField: "varietyCode",
                        width: 120
                    },
                    {
                        caption: "通用名称",
                        dataField: "name",
                        allowSorting: false,
                    },
                    // {
                    //     caption: "分类",
                    //     dataField: "classId",
                    //     allowSorting: false,
                    //     width:100,
                    //     lookup:{
                    //         dataSource:this.drugClassList,
                    //         displayExpr:'name',
                    //         valueExpr:'id'
                    //     }
                    // },
                    {
                        caption: "包装含量",
                        alignment: "right",
                        allowSorting: false,
                        dataField: "packContent",
                        width:100
                    },
                    // {
                    //     caption: "最小单位",
                    //     alignment: "center",
                    //     allowSorting: false,
                    //     dataField: "smallestUnit",
                    //     width:100
                    // },
                    // {
                    //     caption: "剂量单位",
                    //     alignment: "center",
                    //     allowSorting: false,
                    //     dataField: "doseUnit",
                    //     width:100
                    // },
                    {
                        caption: "剂型",
                        alignment: "center",
                        allowSorting: false,
                        dataField: "drugForm",
                        width:100
                    },
                    {
                        caption: "药品规格",
                        dataField: "spec",
                        allowSorting: false,
                        width:150
                    },
                    {
                        caption: "药品单位",
                        alignment: "center",
                        dataField: "unit",
                        allowSorting: false,
                        width:100
                    },
                    {
                        caption: "特殊类型",
                        alignment: "center",
                        dataField: "specialType",
                        allowSorting: false,
                        lookup:{
                            dataSource:this.enum.specialType,
                            displayExpr:'text',
                            valueExpr:'id'
                        },
                        width:100
                    },
                    // {
                    //     caption: "状态",
                    //     alignment: "center",
                    //     dataField: "status",
                    //     allowSorting: false,
                    //     lookup:{
                    //         dataSource:this.enum.status,
                    //         displayExpr:'text',
                    //         valueExpr:'id'
                    //     },
                    //     width:100
                    // },
                ]
            }).dxDataGrid("instance");

            this.productGrid = $("#drug-grid").dxDataGrid({
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
                    store: this.productGridData
                },
                remoteOperations: {
                    sorting: true,
                    paging: true
                },
                paging: {
                    pageSize: 10
                },
                columns: [
                    // {
                    //     caption: "操作",
                    //     width: 150,
                    //     alignment: "center",
                    //     allowResizing: false,
                    //     allowFiltering: false,
                    //     allowSorting: false,
                    //     cellTemplate: (container, options) => {
                    //         container.append("<div id='t2'/>");
                    //         let opcol = new (Vue.component('OpCol'));
                    //         opcol.items = [
                    //             { text: '编辑', showtip: false, id: options.data, click:this.productEdit},
                    //             { text: '删除', showtip: true, color:'#ff9900', tip: '您确认删除吗？', id: options.data, click:this.productDel},
                    //         ];
                    //         if(options.data.status == 0){
                    //             opcol.items.push({ text: '启用', showtip: false, color:'#19be6b', id: options.data,extra:'Y', click:this.drugUpdateStatus})
                    //         }else if(options.data.status == 1){
                    //             opcol.items.push({ text: '停用', showtip: true, color:'#ff9900', tip: '您确认停用吗?', id: options.data,extra:'N', click:this.drugUpdateStatus})
                    //         }
                    //         opcol.$mount('#t2');
                    //     }
                    // },
                    {
                        caption: "商品编码",
                        dataField: "drugCode",
                        width: 100
                    },
                    {
                        caption: "商品名称",
                        dataField: "name",
                        allowSorting: false,
                    },
                    {
                        caption: "通用名称",
                        dataField: "varietyName",
                        allowSorting: false,
                    },
                    {
                        caption: "包装规格",
                        dataField: "packSpec",
                        allowSorting: false,
                        width:150
                    },
                    {
                        caption: "包装单位",
                        alignment: "center",
                        dataField: "packUnit",
                        allowSorting: false,
                        width:100
                    },
                    {
                        caption: "生产厂商",
                        dataField: "factory",
                        allowSorting: false,
                        width:200
                    },
                    {
                        caption: "批准文号",
                        dataField: "authNo",
                        allowSorting: false,
                        width:200
                    },
                    {
                        caption: "状态",
                        alignment: "center",
                        dataField: "status",
                        allowSorting: false,
                        lookup:{
                            dataSource:this.enum.status,
                            displayExpr:'text',
                            valueExpr:'id'
                        },
                        width:100
                    },
                ]
            }).dxDataGrid("instance");

            this.classBtnPart = new (Vue.component('CommandBtns'))();
            this.classBtnPart.items = [
                { id: 1, text: '新增', type: "primary", enabled: true, click: this.addClass },
            ];
            this.classBtnPart.$mount('#btn');
            this.classBtnPart.$parent = this;
        },
        methods:{
            //查询
            search(){
                var ds = this.varietiesGrid.getDataSource();
                this.searchFormData.parentId = this.selectData.id;
                ds.loadOptions().searchData = this.searchFormData;
                ds.reload();
            },
            //重置
            resetSearch(){
                var ds = this.varietiesGrid.getDataSource();
                this.searchForm.resetValues();
                this.searchFormData.parentId = this.selectData.id;
                ds.loadOptions().searchData = this.searchFormData;
                ds.reload();
                // this.varietiesGrid.refresh();
            },
            //新增
            addClass(){
                if(this.selectData.status == 0){
                    this.warn('该分类已经停用，不能添加子分类');
                    return;
                }
                // this.modal.isNew = true;
                // this.classFormData = {};
                // this.classFormData.parentId = this.selectData.id;
                // this.classFormData.status = 1;
                // this.classFormData.type = 1;
                // this.classForm.itemOption('code','editorOptions',{placeholder:'<系统自动分配>',disabled:true});
                // this.classForm.option('formData',this.classFormData);
                // let DXDataSource = this.classForm.getEditor('parentId');
                // DXDataSource = DXDataSource.getDataSource();
                // DXDataSource.reload();
                // this.modal.visible = true;
                this.$router.push({
                    name:'class-detail',
                    params:{id:0}
                })
            },
            //编辑
            edit(data){
                this.modal.isNew = false;
                if(data.parentId){
                    this.$put(class_byKey_url, {id:data.parentId}).then(res => {
                        if (res.code == '200') {
                            if(res.data.status == 0){
                                this.warn('该分类的父级分类已经停用，不能编辑');
                                return;
                            }else{
                                // this.classFormData = data;
                                // this.classForm.itemOption('code','editorOptions',{readOnly:true});
                                // this.classForm.option('formData',this.classFormData);
                                // this.modal.visible = true;
                                this.$router.push({
                                    name:'class-detail',
                                    params:{id:data.id}
                                })
                            }
                        } else {
                            // 提示信息
                            this.warn(res.msg);
                        }
                    }).catch(err => {
                        this.error(err);
                    });
                }else{
                    // this.classFormData = data;
                    // // this.classForm.itemOption('code','editorOptions',{readOnly:true});
                    // this.classForm.option('formData',this.classFormData);
                    // this.modal.visible = true;
                    this.$router.push({
                        name:'class-detail',
                        params:{id:data.id}
                    })
                }
            },
            //删除
            classDel(data){
                let params = {},p_data = {};
                if(data.status == 1){
                    this.warn('请先停用该分类，再删除');
                    return
                }
                p_data.id = data.id;
                params.data = p_data;
                this.$del(del_class_url, params).then(res => {
                    if (res.code == '200') {
                        this.success('删除成功!', () => {
                            this.classTreeListGrid.refresh();
                        });
                    } else {
                        // 提示信息
                        this.warn(res.msg);
                    }
                }).catch(err => {
                    this.error(err);
                });
            },
            //提交
            formSubmit(val){
                let params = {};
                this.modal.modal_loading = true;
                if (!this.classForm.validate().isValid) {
                    this.modal.modal_loading = false;
                    return;
                }
                params = this.classFormData;
                this.$post(class_insert_url, params).then(res => {
                    if (res.code == '200') {
                        this.success('保存成功!', () => {
                            this.modal.modal_loading = false;
                            if(val == 'c'){
                                this.classFormData = {};
                                this.classFormData.status = 1;
                                this.classFormData.type = 1;
                                this.classForm.option('formData',this.classFormData);
                            }else if(val == 's'){
                                this.modal.visible = false;
                            }
                            this.classTreeListGrid.refresh();
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
            //启用/停用
            updateStatus(data,extra){
                let params = {};
                params.id = data.id;
                if(data.parentId){
                    params.parentId = data.parentId;
                }
                if(extra == 'Y'){
                    params.status = 1;
                }else{
                    params.status = 0;
                }
                this.$post(class_insert_url,params).then(res => {
                    if(res.code=='200')
                    {
                        this.success('保存成功!',()=>{
                            this.classTreeListGrid.refresh();
                        });
                    }
                    else
                    {
                        //提示信息
                        this.warn(res.msg);
                    }
                }).catch(err=>
                {
                    this.error(err);
                });
            },
            drugUpdateStatus(data,extra){
                let params = {};
                params.id = data.id;
                if(extra == 'Y'){
                    params.status = 1;
                }else{
                    params.status = 0;
                }
                this.$post(status_update_url,params).then(res => {
                    if(res.code=='200')
                    {
                        this.success('保存成功!',()=>{
                            this.productGrid.refresh();
                        });
                    }
                    else
                    {
                        //提示信息
                        this.warn(res.msg);
                    }
                }).catch(err=>
                {
                    this.error(err);
                });
            },
            //删除商品
            productDel(data){
                let params = {};
                params.id = data.id;
                this.$post(del_drugs_url, params).then(res => {
                    if (res.code == '200') {
                        this.success('删除成功!', () => {
                            this.productGrid.refresh();
                        });
                    } else {
                        // 提示信息
                        this.warn(res.msg);
                    }
                }).catch(err => {
                    this.error(err);
                });
            },
            //编辑商品
            productEdit(data){
                this.drugModal.isNew = false;
                this.$put(drugs_detail_url, {id:data.id}).then(res => {
                    if (res.code == '200') {
                        this.productFormData = res.data;
                        if(this.productFormData.picUrl){
                            this.productFormData.picUrls = this.productFormData.picUrl.split(",");
                        }
                        this.productForm.option('formData',this.productFormData);
                        this.productForm.itemOption('drugCode','editorOptions',{readOnly:true});
                        this.addTag();
                        this.addImage();
                        this.addThumbnail();
                        this.drugModal.visible = true;
                    } else {
                        this.warn(res.msg);
                    }
                }).catch(err => {
                    this.error(err);
                });
            },
            addTag() {
                let tag = new Vue(Tag);
                tag.$parent = this;
                tag.$mount('#tag');
            },
            addImage() {
                let tag = new Vue(Image);
                tag.$parent = this;
                tag.$mount('#picImg');
            },
            addThumbnail() {
                let tag = new Vue(ThumbnailImg);
                tag.$parent = this;
                tag.$mount('#thumbnailImg');
            },
            cancelForm(){
                this.modal.visible = false;
                this.drugModal.visible = false;
            }
        }
    }
</script>
