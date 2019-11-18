<style lang="less">
    @import "../../../../styles/common.less";
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
            <Card dis-hover class="margin-top-10">
                <Row>
                    <div id="varieties-grid"></div>
                </Row>
            </Card>
            <Card dis-hover class="margin-top-10">
                <Row>
                    <div id="product-grid"></div>
                </Row>
            </Card>
        </Card>
        <Modal v-model="modal.visible" :mask-closable="false" width="650" title="编辑数据">
            <p slot="header">
                <span v-if="modal.isNew">新增</span>
                <span v-else="modal.isNew">编辑</span>
            </p>
            <div id="drugForm"></div>
            <div slot="footer">
                <Button type="text" @click="cancelForm">取消</Button>
                <Button type="text" @click="varietiesSubmit('c')" v-show="modal.isNew">保存并继续</Button>
                <Button type="primary" :loading="modal.modal_loading" @click="varietiesSubmit('s')">保存</Button>
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
                <Button type="text" @click="drugsSubmit('c')" v-show="drugModal.isNew">保存并继续</Button>
                <Button type="primary" :loading="drugModal.modal_loading" @click="drugsSubmit('s')">保存</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    import Vue from 'vue';
    import {codefans_net_CC2PY, word_wubi} from '@/libs/util.js';
    import Tag from './tag';
    import Image from './image';
    import ThumbnailImg from './thumbnailImg';
    let varieties_grid_data_url = '/biz/bdDrugVariety/read/page';
    let del_varieties_url = '/biz/bdDrugVariety/delete';
    let varieties_insert_url = '/biz/bdDrugVariety/update';
    let drugs_grid_data_url = '/biz/bdDrugs/read/page';
    let del_drugs_url = '/biz/bdDrugs/deleteDrug';
    let drugs_insert_url = '/biz/bdDrugs/updateDrug';
    let class_list_url = '/biz/bdDrugClass/read/drugClassList';
    let class_list_byKey_url = '/biz/bdDrugClass/read/detail';
    let drugs_detail_url = '/biz/bdDrugs/read/detail';
    let status_class_list_url = '/biz/bdDrugClass/read/drugClassListStart';
    let status_update_url = '/biz/bdDrugs/updateStatus';
    export default {
        data(){
            return{
                continue:false,
                isLoadData:true,
                isLoadProductData:false,
                selectedData:{},
                searchForm:{},
                searchFormData:{},
                drugForm:{},
                drugFormData:{},
                productForm:{},
                productFormData:{},
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
                drugClassList: new this.customstore({
                    key: "id",
                    byKey: (key) => {
                        return this.CommDs.loadByKey(class_list_byKey_url, { id: key });
                    },
                    load: (e) => {
                        return this.CommDs.loadList(class_list_url);
                    }
                }),
                classList: new this.customstore({
                    key: "id",
                    byKey: (key) => {
                        return this.CommDs.loadByKey(class_list_byKey_url, { id: key });
                    },
                    load: (e) => {
                        return this.CommDs.loadList(status_class_list_url);
                    }
                }),
            }
        },
        mounted(){
            let that = this;
            this.searchForm = $('#searchForm').dxForm({
                colCount: 4,
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
                    {
                        dataField: 'specialType',
                        editorType: 'dxSelectBox',
                        label: {
                            alignment: 'right',
                            text: '特殊类型'
                        },
                        editorOptions: {
                            dataSource: this.enum.specialType,
                            displayExpr: 'text',
                            valueExpr: 'id',
                        },
                    },
                    {
                        dataField: 'status',
                        editorType: 'dxSelectBox',
                        editorOptions: {
                            dataSource: this.enum.status,
                            displayExpr: 'text',
                            valueExpr: 'id',
                        },
                        label: {
                            alignment: 'right',
                            text: '状态'
                        }
                    },
                ]
            }).dxForm('instance');

            this.drugForm = $('#drugForm').dxForm({
                colCount: 2,
                formData: this.drugFormData,
                items: [
                    {
                        dataField: 'classId',
                        editorType:'dxDropDownBox',
                        label: {
                            alignment: 'right',
                            text: '药品分类'
                        },
                        editorOptions:{
                            dropDownOptions: { width:450 },
                            placeholder: '选择分类',
                            showClearButton: true,
                            valueExpr: "id",
                            displayExpr: 'name',
                            dataSource: this.classList,
                            contentTemplate: (e) => {
                                let value = e.component.option('value');
                                let grid = $('<div>').dxTreeList({
                                    dataSource: e.component.option('dataSource'),
                                    keyExpr: "id",
                                    parentIdExpr: 'parentId',
                                    searchPanel: {
                                        visible: true,
                                        width: 150,
                                        placeholder: '查找...'
                                    },
                                    columns: [
                                        {
                                            caption: "分类编码",
                                            dataField: "code",
                                            sortOrder: "asc",
                                            width:100
                                        },
                                        {
                                            caption: "名称",
                                            dataField: "name",
                                            allowSorting: false,
                                        },
                                        {
                                            caption: "状态",
                                            dataField: "status",
                                            allowSorting: false,
                                            alignment: "center",
                                            lookup:{
                                                dataSource:this.enum.status,
                                                displayExpr:'text',
                                                valueExpr:'id'
                                            },
                                            width:50
                                        },
                                    ],
                                    hoverStateEnabled: true,
                                    remoteOperations: {
                                        filtering: false,
                                        sorting: false,
                                        paging:false
                                    },
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
                                let instance = grid.dxTreeList('instance');
                                e.component.on("valueChanged", function (args) {
                                    instance.selectRows(args.value, false);
                                    e.component.close();
                                });
                                return grid;
                            }
                        }
                    },
                    {
                        dataField: 'varietyCode',
                        label: {
                            alignment: 'right',
                            text: '编码'
                        },
                        editorOptions:{
                            placeholder:'<系统自动生成>',
                            disabled:true
                        }
                    },
                    {
                        dataField: 'name',
                        label: {
                            alignment: 'right',
                            text: '通用名称'
                        },
                        editorOptions:{
                            placeholder:'输入药品通用名称',
                            maxLength:50,
                            onValueChanged:(e)=>{
                                if(e.value){
                                    this.drugForm.updateData('pinyin',codefans_net_CC2PY($.trim(e.value)));
                                    this.drugForm.updateData('wubi',word_wubi($.trim(e.value)))
                                }
                            }
                        },
                        validationRules: [{
                            type: "required",
                            message: "请输入药品通用名称"
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
                        editorOptions:{
                            placeholder:'输入药品英文名称',
                            maxLength:50
                        },
                        validationRules: [{
                            type: "required",
                            message: "请输入药品英文名称"
                        }]
                    },
                    {
                        dataField: 'drugForm',
                        label: {
                            alignment: 'right',
                            text: '剂型'
                        },
                        editorOptions:{
                            placeholder:'输入药品剂型',
                            maxLength:20
                        },
                        validationRules: [{
                            type: "required",
                            message: "请输入药品剂型"
                        }]
                    },
                    {
                        dataField: 'spec',
                        label: {
                            alignment: 'right',
                            text: '药品规格'
                        },
                        editorOptions:{
                            placeholder:'输入药品规格',
                            maxLength:50
                        },
                        validationRules: [{
                            type: "required",
                            message: "请输入药品规格"
                        }]
                    },
                    {
                        dataField: 'unit',
                        label: {
                            alignment: 'right',
                            text: '药品单位'
                        },
                        editorOptions:{
                            placeholder:'输入药品单位',
                            maxLength:20
                        },
                        validationRules: [{
                            type: "required",
                            message: "请输入药品单位"
                        }]
                    },
                    {
                        dataField: 'smallestUnit',
                        label: {
                            alignment: 'right',
                            text: '最小单位'
                        },
                        editorOptions:{
                            placeholder:'请输入药品最小单位',
                            maxLength:20
                        },
                        validationRules: [{
                            type: "required",
                            message: "请输入最小单位"
                        }]
                    },
                    {
                        dataField: 'packContent',
                        editorType:'dxNumberBox',
                        label: {
                            alignment: 'right',
                            text: '包装含量'
                        },
                        editorOptions:{
                            placeholder:'请输入该规格下药品包装数量',
                            min:1
                        },
                        validationRules: [{
                            type: "required",
                            message: "请输入包装含量"
                        }]
                    },
                    {
                        dataField: 'doseUnit',
                        label: {
                            alignment: 'right',
                            text: '剂量单位'
                        },
                        editorOptions:{
                            placeholder:'输入剂量单位',
                            maxLength:20
                        },
                        validationRules: [{
                            type: "required",
                            message: "请输入剂量单位"
                        }]
                    },
                    {
                        dataField: 'attr',
                        editorType: 'dxSelectBox',
                        label: {
                            alignment: 'right',
                            text: '属性'
                        },
                        editorOptions: {
                            dataSource: this.enum.attr,
                            displayExpr: 'text',
                            valueExpr: 'id',
                        },
                    },
                    {
                        dataField: 'specialType',
                        editorType: 'dxSelectBox',
                        label: {
                            alignment: 'right',
                            text: '特殊类型'
                        },
                        editorOptions: {
                            dataSource: this.enum.specialType,
                            displayExpr: 'text',
                            valueExpr: 'id',
                        },
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

            this.varietiesGrid = $("#varieties-grid").dxDataGrid({
                showRowLines: true,
                showBorders: true,
                allowColumnReordering: true,
                allowColumnResizing: true,
                columnAutoWidth: true,
                onContentReady: (e) => {
                    e.component.selectRowsByIndexes([0]);
                },
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
                        this.isLoadProductData = true;
                        this.productPart.items[0].enabled = true;
                        this.selectedData = e.selectedRowKeys[0];
                        let searchData = {
                            varietyId:this.selectedData.id
                        };
                        this.productGrid.getDataSource().loadOptions().searchData = searchData;
                        this.productGrid.refresh();
                    }
                    else {
                        this.isLoadProductData = false;
                        this.productPart.items[0].enabled = false;
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
                    {
                        caption: "操作",
                        width: 150,
                        alignment: "center",
                        allowResizing: false,
                        allowFiltering: false,
                        allowSorting: false,
                        cellTemplate: (container, options) => {
                            container.append("<div id='t1'/>");
                            let opcol = new (Vue.component('OpCol'));
                            opcol.items = [
                                { text: '编辑', showtip: false, id: options.data, click:this.edit},
                                { text: '删除', showtip: true, color:'#ff9900', tip: '您确认删除吗？', id: options.data, click:this.drugDel},
                            ];
                            if(options.data.status == 0){
                                opcol.items.push({ text: '启用', showtip: false, color:'#19be6b', id: options.data,extra:'Y', click:this.varietyUpdateStatus})
                            }else if(options.data.status == 1){
                                opcol.items.push({ text: '停用', showtip: true, color:'#ff9900', tip: '您确认停用吗?', id: options.data,extra:'N', click:this.varietyUpdateStatus})
                            }
                            opcol.$mount('#t1');
                        }
                    },
                    {
                        caption: "药品编码",
                        dataField: "varietyCode",
                        width: 100
                    },
                    {
                        caption: "通用名称",
                        dataField: "name",
                        allowSorting: false,
                    },
                    {
                        caption: "分类",
                        dataField: "classId",
                        allowSorting: false,
                        width:100,
                        lookup:{
                            dataSource:this.drugClassList,
                            displayExpr:'name',
                            valueExpr:'id'
                        }
                    },
                    {
                        caption: "包装含量",
                        alignment: "right",
                        allowSorting: false,
                        dataField: "packContent",
                        width:100
                    },
                    {
                        caption: "最小单位",
                        alignment: "center",
                        allowSorting: false,
                        dataField: "smallestUnit",
                        width:100
                    },
                    {
                        caption: "剂量单位",
                        alignment: "center",
                        allowSorting: false,
                        dataField: "doseUnit",
                        width:100
                    },
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

            this.productGrid = $("#product-grid").dxDataGrid({
                showRowLines: true,
                showBorders: true,
                allowColumnReordering: true,
                allowColumnResizing: true,
                columnAutoWidth: true,
                onToolbarPreparing: (e) => {
                    e.toolbarOptions.items.unshift({
                        location: "before",
                        template: () => {
                            return $('<div id=\'btn1\'/>');
                        }
                    });
                },
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
                    {
                        caption: "操作",
                        width: 150,
                        alignment: "center",
                        allowResizing: false,
                        allowFiltering: false,
                        allowSorting: false,
                        cellTemplate: (container, options) => {
                            container.append("<div id='t2'/>");
                            let opcol = new (Vue.component('OpCol'));
                            opcol.items = [
                                { text: '编辑', showtip: false, id: options.data, click:this.productEdit},
                                { text: '删除', showtip: true, color:'#ff9900', tip: '您确认删除吗？', id: options.data, click:this.productDel},
                            ];
                            if(options.data.status == 0){
                                opcol.items.push({ text: '启用', showtip: false, color:'#19be6b', id: options.data,extra:'Y', click:this.updateStatus})
                            }else if(options.data.status == 1){
                                opcol.items.push({ text: '停用', showtip: true, color:'#ff9900', tip: '您确认停用吗?', id: options.data,extra:'N', click:this.updateStatus})
                            }
                            opcol.$mount('#t2');
                        }
                    },
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

            this.btnPart = new (Vue.component('CommandBtns'))();
            this.btnPart.items = [
                { id: 1, text: '新增品种', type: "primary", enabled: true, click: this.addDrug },
            ];
            this.btnPart.$mount('#btn');
            this.btnPart.$parent = this;

            this.productPart = new (Vue.component('CommandBtns'))();
            this.productPart.items = [
                { id: 1, text: '新增药品', type: "primary", enabled: false, click: this.addProduct },
            ];
            this.productPart.$mount('#btn1');
            this.productPart.$parent = this;
        },
        methods:{
            //查询
            search(){
                var ds = this.varietiesGrid.getDataSource();
                ds.loadOptions().searchData = this.searchFormData;
                ds.reload();
            },
            //重置
            resetSearch(){
                this.searchForm.resetValues();
                this.varietiesGrid.refresh();
            },
            //新增品种
            addDrug(){
                this.modal.isNew = true;
                this.drugFormData = {};
                this.drugFormData.status = 1;
                this.drugForm.itemOption('varietyCode','editorOptions',{placeholder:'<系统自动生成>',disabled:true});
                this.drugForm.option('formData',this.drugFormData);
                this.modal.visible = true;
            },
            //编辑品种
            edit(data){
                this.modal.isNew = false;
                this.drugFormData = data;
                this.drugForm.itemOption('varietyCode','editorOptions',{readOnly:true});
                this.drugForm.option('formData',this.drugFormData);
                this.modal.visible = true;
            },
            //删除药品
            drugDel(data){
                let params = {},p_data = {};
                p_data.id = data.id;
                params.data = p_data;
                this.$del(del_varieties_url, params).then(res => {
                    if (res.code == '200') {
                        this.success('删除成功!', () => {
                            this.varietiesGrid.refresh();
                        });
                    } else {
                        // 提示信息
                        this.warn(res.msg);
                    }
                }).catch(err => {
                    this.error(err);
                });
            },
            //新增商品
            addProduct(){
                this.drugModal.isNew = true;
                this.productFormData = {};
                this.productFormData.varietyName = this.selectedData.name;
                this.productFormData.status = 1;
                this.productForm.option('formData',this.productFormData);
                this.productForm.itemOption('drugCode','editorOptions',{placeholder:'<系统自动生成>',disabled:true});
                this.addTag();
                this.addImage();
                this.addThumbnail();
                this.drugModal.visible = true;
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
            //品种提交
            varietiesSubmit(val){
                let params = {};
                this.modal.modal_loading = true;
                if (!this.drugForm.validate().isValid) {
                    this.modal.modal_loading = false;
                    return;
                }
                params = this.drugFormData;
                this.$post(varieties_insert_url, params).then(res => {
                    if (res.code == '200') {
                        this.success('保存成功!', () => {
                            this.modal.modal_loading = false;
                            if(val == 'c'){
                                this.drugFormData = {};
                                this.drugFormData.status = 1;
                                this.drugForm.option('formData',this.drugFormData);
                            }else if(val == 's'){
                                this.modal.visible = false;
                            }
                            this.varietiesGrid.refresh();
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
            cancelForm(){
                this.modal.visible = false;
                this.drugModal.visible = false;
            },
            drugsSubmit(val){
                let params = {};
                this.drugModal.modal_loading = true;
                if (!this.productForm.validate().isValid) {
                    this.drugModal.modal_loading = false;
                    return;
                }
                if(!this.productFormData.thumbnailImg && !this.productFormData.thumbnailUrl){
                    this.warn('请上传缩略图');
                    this.drugModal.modal_loading = false;
                    return;
                }
                if(this.productFormData.thumbnailImg && this.productFormData.thumbnailImg.length == 0){
                    this.warn('请上传缩略图');
                    this.drugModal.modal_loading = false;
                    return;
                }
                if(!this.productFormData.picImgs && !this.productFormData.picUrl){
                    this.warn('请上传详情图');
                    this.drugModal.modal_loading = false;
                    return;
                }
                if(this.productFormData.picImgs && this.productFormData.picImgs.length == 0){
                    this.warn('请上传详情图');
                    this.drugModal.modal_loading = false;
                    return;
                }
                params = this.productFormData;
                params.varietyId = this.selectedData.id;
                delete params.keyword;
                this.$post(drugs_insert_url, params).then(res => {
                    if (res.code == '200') {
                        this.success('保存成功!', () => {
                            this.drugModal.modal_loading = false;
                            if(val == 'c'){
                                this.productFormData = {};
                                this.productFormData.varietyName = this.selectedData.name;
                                this.productFormData.status = 1;
                                this.productForm.option('formData',this.productFormData);
                                this.productForm.repaint();
                                this.addTag();
                                this.addThumbnail();
                                this.addImage();
                            }else if(val== 's'){
                                this.drugModal.visible = false;
                            }
                            this.productGrid.refresh();
                        });
                    }
                    else {
                        this.drugModal.modal_loading = false;
                        this.warn(res.msg);
                    }
                }).catch(err => {
                    this.drugModal.modal_loading = false;
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
            //启用/停用
            varietyUpdateStatus(data,extra){
                let params = {};
                params.id = data.id;
                if(extra == 'Y'){
                    params.status = 1;
                }else{
                    params.status = 0;
                }
                this.$post(varieties_insert_url,params).then(res => {
                    if(res.code=='200')
                    {
                        this.success('保存成功!',()=>{
                            this.varietiesGrid.refresh();
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
            updateStatus(data,extra){
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
            }
        }
    }
</script>
