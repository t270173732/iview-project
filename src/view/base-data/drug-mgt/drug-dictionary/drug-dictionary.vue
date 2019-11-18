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
            <Row class="margin-top-10">
                <div id="drugGrid"></div>
            </Row>
        </Card>
        <Modal v-model="modal.visible" :mask-closable="false" width="900" title="编辑数据">
            <p slot="header">
                <span v-if="modal.isNew">新增</span>
                <span v-else>编辑</span>
            </p>
            <div id="drugForm"></div>
            <hr/>
            <div id="productForm"></div>
            <div slot="footer">
                <Button type="text" @click="formCancle">取消</Button>
                <Button type="primary" :loading="modal.modal_loading" @click="submit">保存</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    import Vue from 'vue';
    import {codefans_net_CC2PY, word_wubi} from '@/libs/util.js';
    import Tag from './tag';
    import Image from '../drug-varieties/image';
    import ThumbnailImg from '../drug-varieties/thumbnailImg';
    let drug_grid_data_url = '/biz/bdDrugs/read/page';
    let drug_insert_url = '/biz/bdDrugs/updateDrug';
    let class_list_url = '/biz/bdDrugClass/read/page';
    let class_list_byKey_url = '/biz/bdDrugClass/read/detail';
    let status_update_url = '/biz/bdDrugs/updateStatus';
    export default {
        data(){
            return{
                isLoadData: true,
                searchForm: {},
                searchFormData: {},
                drugForm: {},
                drugFormData: {},
                productForm: {},
                productFormData: {},
                modal: {
                    isNew: false,
                    visible: false,
                    modal_loading: false
                },
                drugGridData: new this.customstore({
                    load: (loadOptions) => {
                        return this.CommDs.loadPage(loadOptions, drug_grid_data_url, this.isLoadData, {});
                    },
                }),
                classListData: new this.customstore({
                    key: "id",
                    byKey: (key) => {
                        return this.CommDs.loadByKey(class_list_byKey_url, {id: key});
                    },
                    load: (e) => {
                        return this.CommDs.loadList(class_list_url);
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
                        dataField: 'name',
                        label: {
                            alignment: 'right',
                            text: '药品名称'
                        },
                    },
                    {
                        dataField: 'varietyName',
                        label: {
                            alignment: 'right',
                            text: '品种名称'
                        },
                    },
                    {
                        dataField: 'factory',
                        label: {
                            alignment: 'right',
                            text: '生产厂商'
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
                            dataSource: this.enum.status,
                            displayExpr: 'text',
                            valueExpr: 'id',
                        },
                    },
                ]
            }).dxForm('instance');

            this.drugForm = $('#drugForm').dxForm({
                colCount: 3,
                formData: this.drugFormData,
                items: [
                    {
                        dataField: 'classId',
                        editorType: 'dxSelectBox',
                        label: {
                            alignment: 'right',
                            text: '药品分类'
                        },
                        editorOptions: {
                            dataSource: this.classListData,
                            displayExpr: 'name',
                            valueExpr: 'id',
                            readOnly:true
                        }
                    },
                    {
                        dataField: 'varietyCode',
                        label: {
                            alignment: 'right',
                            text: '编码'
                        },
                        editorOptions: {
                            readOnly:true
                        }
                    },
                    {
                        dataField: 'varietyName',
                        label: {
                            alignment: 'right',
                            text: '通用名称'
                        },
                        editorOptions: {
                            readOnly:true
                        },
                    },
                    {
                        dataField: 'varietyPinyin',
                        label: {
                            alignment: 'right',
                            text: '拼音简码'
                        },
                        editorOptions: {
                            readOnly:true
                        },
                    },
                    {
                        dataField: 'varietyWubi',
                        label: {
                            alignment: 'right',
                            text: '五笔简码'
                        },
                        editorOptions: {
                            readOnly:true
                        },
                    },
                    {
                        dataField: 'varietyEnName',
                        label: {
                            alignment: 'right',
                            text: '英文名称'
                        },
                        editorOptions: {
                            readOnly:true
                        },
                    },
                    {
                        dataField: 'drugForm',
                        label: {
                            alignment: 'right',
                            text: '剂型'
                        },
                        editorOptions: {
                            readOnly:true
                        },
                    },
                    {
                        dataField: 'varietySpec',
                        label: {
                            alignment: 'right',
                            text: '药品规格'
                        },
                        editorOptions: {
                            readOnly:true
                        },
                    },
                    {
                        dataField: 'unit',
                        label: {
                            alignment: 'right',
                            text: '药品单位'
                        },
                        editorOptions: {
                            readOnly:true
                        },
                    },
                    {
                        dataField: 'doseUnit',
                        label: {
                            alignment: 'right',
                            text: '剂量单位'
                        },
                        editorOptions: {
                            readOnly:true
                        },
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
                            readOnly:true
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
                            readOnly:true
                        },
                    },
                    {
                        dataField: 'varietyStatus',
                        editorType: 'dxSelectBox',
                        editorOptions: {
                            dataSource: this.enum.status,
                            displayExpr: 'text',
                            valueExpr: 'id',
                            readOnly:true
                        },
                        label: {
                            alignment: 'right',
                            text: '状态'
                        }
                    },
                ]
            }).dxForm('instance');

            this.productForm = $('#productForm').dxForm({
                colCount: 3,
                formData: this.productFormData,
                items: [
                    {
                        dataField: 'drugCode',
                        label: {
                            alignment: 'right',
                            text: '商品编码'
                        },
                        editorOptions: {
                            placeholder: '<系统自动生成>',
                            disabled: true
                        }
                    },
                    {
                        dataField: 'name',
                        label: {
                            alignment: 'right',
                            text: '商品名称'
                        },
                        editorOptions: {
                            placeholder: '输入商品名称',
                            maxLength:50,
                            onValueChanged:(e)=>{
                                if(e.value){
                                    this.productForm.updateData('pinyin',codefans_net_CC2PY($.trim(e.value)))
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
                        editorOptions: {
                            placeholder: '根据药品通用名称生成拼音简码',
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
                        editorOptions: {
                            placeholder: '根据药品通用名称生成五笔简码',
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
                        editorOptions: {
                            placeholder: '输入包装规格',
                            maxLength:50
                        },
                        validationRules: [{
                            type: "required",
                            message: "请输入包装规格"
                        }]
                    },
                    {
                        dataField: 'packUnit',
                        alignment:'center',
                        label: {
                            alignment: 'right',
                            text: '包装单位'
                        },
                        editorOptions: {
                            placeholder: '输入包装单位',
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
                        editorOptions: {
                            placeholder: '输入生产厂商',
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
                        editorOptions: {
                            placeholder: '输入批准文号',
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
                        editorOptions: {
                            placeholder: '输入本位码',
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
                        editorOptions: {
                            placeholder: '输入监管码',
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
                        colSpan: 3,
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
                        colSpan: 3,
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
                        colSpan: 3,
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

            this.drugGrid = $("#drugGrid").dxDataGrid({
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
                    store: this.drugGridData
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
                        alignment: "center",
                        allowResizing: false,
                        allowFiltering: false,
                        allowSorting: false,
                        cellTemplate: (container, options) => {
                            container.append("<div id='t1'/>");
                            let opcol = new (Vue.component('OpCol'));
                            opcol.items = [
                                { text: '编辑', showtip: false, id: options.data, click:this.edit},
                            ];
                            if(options.data.status == 0){
                                opcol.items.push({ text: '启用', showtip: false, color:'#19be6b', id: options.data,extra:'Y', click:this.updateStatus})
                            }else if(options.data.status == 1){
                                opcol.items.push({ text: '停用', showtip: true, color:'#ff9900', tip: '您确认停用吗?', id: options.data,extra:'N', click:this.updateStatus})
                            }
                            opcol.$mount('#t1');
                        },
                        width:100
                    },
                    {
                        caption: "药品编码",
                        dataField: "drugCode",
                        width: 80
                    },
                    {
                        caption: "药品名称",
                        dataField: "name",
                        allowSorting: false,
                    },
                    {
                        caption: "品种名称",
                        dataField: "varietyName",
                        allowSorting: false,
                    },
                    {
                        caption: "剂量单位",
                        dataField: "doseUnit",
                        allowSorting: false,
                        width: 80
                    },
                    {
                        caption: "剂型",
                        dataField: "drugForm",
                        allowSorting: false,
                        width: 50
                    },
                    {
                        caption: "特殊类型",
                        alignment: "center",
                        allowSorting: false,
                        dataField: "specialType",
                        lookup: {
                            dataSource: this.enum.specialType,
                            displayExpr: 'text',
                            valueExpr: 'id'
                        },
                        width: 80
                    },
                    {
                        caption: "药品规格",
                        allowSorting: false,
                        dataField: "varietySpec",
                        width: 80
                    },
                    {
                        caption: "药品单位",
                        alignment: "center",
                        allowSorting: false,
                        dataField: "unit",
                        width: 80
                    },
                    {
                        caption: "包装规格",
                        allowSorting: false,
                        dataField: "packSpec",
                        width: 80
                    },
                    {
                        caption: "包装单位",
                        allowSorting: false,
                        dataField: "packUnit",
                        width: 80
                    },
                    {
                        caption: "生产厂商",
                        dataField: "factory",
                        allowSorting: false,
                        width: 200
                    },
                    {
                        caption: "批准文号",
                        dataField: "authNo",
                        allowSorting: false,
                        width: 200
                    },
                    {
                        caption: "状态",
                        alignment: "center",
                        dataField: "status",
                        allowSorting: false,
                        lookup: {
                            dataSource: this.enum.status,
                            displayExpr: 'text',
                            valueExpr: 'id'
                        },
                        width: 50
                    },
                ]
            }).dxDataGrid("instance");
        },
        methods:{
            //查询
            search() {
                let ds = this.drugGrid.getDataSource();
                ds.loadOptions().searchData = this.searchFormData;
                ds.reload();
            },
            //重置
            resetSearch() {
                this.searchForm.resetValues();
                this.drugGrid.refresh();
            },
            edit(data) {
                this.modal.isNew = false;
                this.drugFormData = data;
                this.productFormData = data;
                if(this.productFormData.picUrl){
                    this.productFormData.picUrls = this.productFormData.picUrl.split(",");
                }
                this.drugForm.option('formData', this.drugFormData);
                this.productForm.option('formData', this.productFormData);
                this.productForm.repaint();
                this.addTag();
                this.addImage();
                this.addThumbnail();
                this.modal.visible = true;
            },
            submit() {
                let params = {};
                this.modal.modal_loading = true;
                if (!this.productForm.validate().isValid) {
                    this.modal.modal_loading = false;
                    return;
                }
                if(!this.productFormData.thumbnailImg && !this.productFormData.thumbnailUrl){
                    this.warn('请上传缩略图');
                    this.modal.modal_loading = false;
                    return;
                }
                if(this.productFormData.thumbnailImg && this.productFormData.thumbnailImg.length == 0){
                    this.warn('请上传缩略图');
                    this.modal.modal_loading = false;
                    return;
                }
                if(!this.productFormData.picImgs && !this.productFormData.picUrl){
                    this.warn('请上传详情图');
                    this.modal.modal_loading = false;
                    return;
                }
                if(this.productFormData.picImgs && this.productFormData.picImgs.length == 0){
                    this.warn('请上传详情图');
                    this.modal.modal_loading = false;
                    return;
                }
                params = this.productFormData;
                this.$post(drug_insert_url, params).then(res => {
                    if (res.code == '200') {
                        this.success('保存成功!', () => {
                            this.modal.modal_loading = false;
                            this.modal.visible = false;
                            this.drugGrid.refresh();
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
            formCancle(){
                this.modal.visible = false;
            },
            addTag() {
                let tag = new Vue(Tag);
                tag.$parent = this;
                tag.$mount('#tag');
            },
            //启用/停用
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
                            this.drugGrid.refresh();
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
        }
    }
</script>