<style lang="less">
    @import "../../../../styles/common.less";
    .dx-texteditor{
        border-radius: 0;
    }
    .tdiv {
        /*padding: 5px;*/
    }

    .table_dm {
        border: solid #8ba0bc;
        border-width: 1px 0px 0px 1px;
        font-size: 12px;
        width:818px
    }

    .table_dm_td {
        border: solid #cfddee;
        border-width: 0px 1px 1px 0px;
        padding: 5px;
        text-align: right;
        line-height: 25px;
        font-size: 14px;
    }

    .table_dm_th {
        border: solid #8ba0bc;
        border-width: 0px 1px 1px 0px;
        padding: 0px;
        text-align: center;
        line-height: 25px;
        font-weight: bold;
        background: #e4effa;
    }

    .table_dm_tdh {
        /*font-weight:bold;*/
    }

    .table_dm_td select {
        width: 250px;
        height: 25px;
        border: 0px;
    }
    .bg_color{
        background-color: #e8eaec;
    }
    .text_center{
        text-align: center;
    }
    .text_bold{
        font-weight: bold;
    }
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
                <div id="drug-grid"></div>
            </Row>
        </Card>
        <Modal v-model="modal.visible" :mask-closable="false" width="850" title="编辑数据" :footer-hide="true">
            <p slot="header">
                <span>药品对码</span>
            </p>
            <div style="text-align: right">
                <Button type="primary" :loading="modal.modal_loading" @click="submit">保存</Button>
                <Button class="margin-left-5" @click="cancle">关闭</Button>
            </div>
            <div class="margin-top-10">
                <table class="table_dm">
                    <tr>
                        <td class="table_dm_th" width="200px"></td>
                        <td class="table_dm_th" width="200px">{{hosDrug.orgName}}</td>
                        <td class="table_dm_th" width="200px">处方平台</td>
                    </tr>
                    <tr>
                        <td class="table_dm_td text_bold">商品编码</td>
                        <td class="table_dm_td bg_color text_center">{{hosDrug.drugCode}}</td>
                        <td class="table_dm_td" id="drugCode"></td>
                    </tr>
                    <tr>
                        <td class="table_dm_td text_bold">通用名称</td>
                        <td class="table_dm_td bg_color text_center">{{hosDrug.drugName}}</td>
                        <td class="table_dm_td text_center">{{ownDrug.varietyName}}</td>
                    </tr>
                    <tr>
                        <td class="table_dm_td text_bold">剂型</td>
                        <td class="table_dm_td bg_color text_center">{{hosDrug.drugForm}}</td>
                        <td class="table_dm_td text_center">{{ownDrug.drugForm}}</td>
                    </tr>
                    <tr>
                        <td class="table_dm_td text_bold">药品规格</td>
                        <td class="table_dm_td bg_color text_center">{{hosDrug.spec}}</td>
                        <td class="table_dm_td text_center">{{ownDrug.varietySpec}}</td>
                    </tr>
                    <tr>
                        <td class="table_dm_td text_bold">药品单位</td>
                        <td class="table_dm_td bg_color text_center">{{hosDrug.unit}}</td>
                        <td class="table_dm_td text_center">{{ownDrug.unit}}</td>
                    </tr>
                    <tr>
                        <td class="table_dm_td text_bold">生产企业</td>
                        <td class="table_dm_td bg_color text_center">{{hosDrug.factory}}</td>
                        <td class="table_dm_td text_center">{{ownDrug.factory}}</td>
                    </tr>
                    <tr>
                        <td class="table_dm_td text_bold">批准文号</td>
                        <td class="table_dm_td bg_color text_center">{{hosDrug.authNo}}</td>
                        <td class="table_dm_td text_center">{{ownDrug.authNo}}</td>
                    </tr>
                </table>
            </div>
            <div id="notMapGrid" class="margin-top-10"></div>
        </Modal>
        <Modal v-model="drugModal.visible" :mask-closable="false" width="800" title="编辑数据">
            <p slot="header">
                <span>药品添加</span>
            </p>
            <div id="hosDrugGrid"></div>
            <div slot="footer">
                <Button type="text" @click="formCancel">取消</Button>
                <Button type="primary" :loading="drugModal.modal_loading" @click="formSubmit">保存</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    import Vue from 'vue';
    let drug_grid_data_url = '/biz/bdOrgDrugs/read/page';
    let drug_list_url = '/biz/bdDrugs/read/list';
    let org_drug_update_url = '/biz/bdOrgDrugs/updateOrgDrug';
    let org_drug_del_url = '/biz/bdOrgDrugs/deleteOrgDrug';
    let drug_List_byKey_url = '/biz/bdDrugs/read/detail';
    let org_drug_map_url = '/biz/bdDrugsMapping/updateDrugsMapping';
    let hos_drug_grid_data_url = '';
    let drug_insert_url = '';
    export default {
        data(){
            return{
                hosDrug:{},
                ownDrug:{},
                selectedData:{},
                isLoadData:true,
                searchForm:{},
                searchFormData:{},
                modal:{
                    visible:false,
                    modal_loading:false
                },
                drugModal:{
                    visible:false,
                    modal_loading:false
                },
                drugGridData: new this.customstore({
                    load: (loadOptions) => {
                        return this.CommDs.loadPage(loadOptions, drug_grid_data_url, this.isLoadData,{});
                    },
                }),
                notMapGridData: new this.customstore({
                    load: (loadOptions) => {
                        return this.CommDs.loadPage(loadOptions, drug_grid_data_url, this.isLoadData, {mapStatus:0});
                    },
                }),
                hosDrugGridData: new this.customstore({
                    load: (loadOptions) => {
                        return this.CommDs.loadPage(loadOptions, hos_drug_grid_data_url, this.isLoadData, {});
                    },
                }),
                drugListData: new this.customstore({
                    key: "id",
                    byKey: (key) => {
                        return this.CommDs.loadByKey(drug_List_byKey_url, { id: key });
                    },
                    load: (e) => {
                        return this.CommDs.loadList(drug_list_url);
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
                        dataField: 'drugName',
                        label: {
                            alignment: 'right',
                            text: '药品名称'
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
                        dataField: 'mapStatus',
                        editorType:'dxSelectBox',
                        label: {
                            alignment: 'right',
                            text: '对码状态'
                        },
                        editorOptions:{
                            dataSource:this.enum.mapStatus,
                            displayExpr:'text',
                            valueExpr:'id'
                        }
                    },
                ]
            }).dxForm('instance');

            this.drugGrid = $("#drug-grid").dxDataGrid({
                showRowLines: true,
                showBorders: true,
                allowColumnReordering: true,
                allowColumnResizing: true,
                columnAutoWidth: true,
                onToolbarPreparing: (e) => {
                    e.toolbarOptions.items.unshift({
                        location: "before",
                        template: () => {
                            return $('<div id=\'btn\'/>');
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
                        width: 100,
                        alignment: "center",
                        allowResizing: false,
                        allowFiltering: false,
                        allowSorting: false,
                        cellTemplate: (container, options) => {
                            container.append("<div id='t1'/>");
                            let opcol = new (Vue.component('OpCol'));
                            if(options.data.status == 0){
                                opcol.items = [
                                    { text: '启用', showtip: false,extra:'Y', id: options.data,click:this.orgDrugStatus},
                                    { text: '删除', showtip: true, color:'#ff9900', tip: '您确认删除吗？', id: options.data,click:this.orgDrugDel}
                                ];
                            }else{
                                opcol.items = [
                                    { text: '停用', showtip: true, color:'#ff9900', tip: '您确认停用吗？',extra:'N', id: options.data,click:this.orgDrugStatus},
                                    { text: '删除', showtip: true, color:'#ff9900', tip: '您确认删除吗？', id: options.data,click:this.orgDrugDel}
                                ];
                            }
                            opcol.$mount('#t1');
                        }
                    },
                    {
                        caption: "商品编码",
                        dataField: "drugCode",
                        width:100
                    },
                    {
                        caption: "通用名称",
                        dataField: "drugName",
                        allowSorting: false,
                    },
                    {
                        caption: "剂型",
                        dataField: "drugForm",
                        allowSorting: false,
                        width:100
                    },
                    {
                        caption: "药品规格",
                        dataField: "spec",
                        allowSorting: false,
                        width:100
                    },
                    {
                        caption: "药品单位",
                        dataField: "unit",
                        allowSorting: false,
                        width:100
                    },
                    {
                        caption: "生产厂商",
                        dataField: "factory",
                        allowSorting: false,
                    },
                    {
                        caption: "批准文号",
                        dataField: "authNo",
                        allowSorting: false,
                        width:150
                    },
                    {
                        caption: "对码状态",
                        alignment: "center",
                        dataField: "mapStatus",
                        allowSorting:false,
                        lookup:{
                            dataSource:this.enum.mapStatus,
                            displayExpr:'text',
                            valueExpr:'id'
                        },
                        width:100
                    },
                ]
            }).dxDataGrid("instance");

            this.notMapGrid = $("#notMapGrid").dxDataGrid({
                showRowLines: true,
                showBorders: true,
                allowColumnReordering: true,
                allowColumnResizing: true,
                columnAutoWidth: true,
                searchPanel: {
                    visible: true,
                    width: 240,
                    placeholder: '查找...'
                },
                onSelectionChanged: (e) => {
                    if (e.selectedRowKeys.length > 0) {
                        this.hosDrug = e.selectedRowKeys[0];
                    }
                    else {

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
                    store: this.notMapGridData
                },
                remoteOperations: {
                    sorting: false,
                    paging: false
                },
                paging: {
                    pageSize: 10
                },
                columns: [
                    {
                        caption: "商品编码",
                        dataField: "drugCode",
                        width:100
                    },
                    {
                        caption: "通用名称",
                        dataField: "drugName",
                        allowSorting: false,
                    },
                    {
                        caption: "剂型",
                        dataField: "drugForm",
                        allowSorting: false,
                        width:100
                    },
                    {
                        caption: "药品规格",
                        dataField: "spec",
                        allowSorting: false,
                        width:100
                    },
                    {
                        caption: "药品单位",
                        dataField: "unit",
                        allowSorting: false,
                        width:100
                    },
                    {
                        caption: "生产厂商",
                        dataField: "factory",
                        allowSorting: false,
                    },
                    {
                        caption: "批准文号",
                        dataField: "authNo",
                        allowSorting: false,
                        width:150
                    },
                    {
                        caption: "对码状态",
                        alignment: "center",
                        dataField: "mapStatus",
                        allowSorting:false,
                        lookup:{
                            dataSource:this.enum.mapStatus,
                            displayExpr:'text',
                            valueExpr:'id'
                        },
                        width:80
                    },
                ]
            }).dxDataGrid("instance");

            this.hosDrugGrid = $("#hosDrugGrid").dxDataGrid({
                showRowLines: true,
                showBorders: true,
                allowColumnReordering: true,
                allowColumnResizing: true,
                columnAutoWidth: true,
                columnFixing: {
                    enabled: true
                },
                searchPanel: {
                    visible: true,
                    width: 240,
                    placeholder: '查找...'
                },
                selection: {
                    allowSelectAll: true,
                    mode: 'multiple',
                    showCheckBoxesMode: 'always'
                },
                hoverStateEnabled: true,
                dataSource: {
                    // store: this.hosDrugGridData
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
                        caption: "商品编码",
                        dataField: "drugCode",
                        width:100
                    },
                    {
                        caption: "通用名称",
                        dataField: "drugName",
                        allowSorting: false,
                    },
                    {
                        caption: "剂型",
                        dataField: "drugForm",
                        allowSorting: false,
                        width:50
                    },
                    {
                        caption: "药品规格",
                        dataField: "spec",
                        allowSorting: false,
                        width:100
                    },
                    {
                        caption: "药品单位",
                        dataField: "unit",
                        allowSorting: false,
                        width:100
                    },
                    {
                        caption: "生产厂商",
                        dataField: "factory",
                        allowSorting: false,
                    },
                    {
                        caption: "批准文号",
                        dataField: "authNo",
                        allowSorting: false,
                        width:100
                    },
                    {
                        caption: "价格",
                        dataField: "price",
                        width:80
                    },
                ]
            }).dxDataGrid("instance");

            this.dropDownBox = $("#drugCode").dxDropDownBox({
                valueExpr: "id",
                deferRendering: false,
                placeholder: "选择药品...",
                displayExpr: 'drugCode',
                showClearButton: true,
                dropDownOptions: { width:800 },
                dataSource: this.drugListData,
                onValueChanged: (e) => {
                    if (e.value) {
                        this.$put(drug_List_byKey_url, {id:e.value}).then(res => {
                            if (res.code == '200') {
                                this.ownDrug = res.data;
                            } else {
                                this.warn(res.msg);
                            }
                        }).catch(err => {
                            this.error(err);
                        });
                    }
                },
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
                                caption: "商品编码",
                                dataField: "drugCode",
                                width:100
                            }, {
                                caption: "通用名称",
                                dataField: "varietyName",
                                allowSorting: false,
                            },{
                                caption: "剂型",
                                width:50,
                                dataField: "drugForm",
                                allowSorting: false,
                            },{
                                caption: "药品规格",
                                dataField: "varietySpec",
                                allowSorting: false,
                                width:80,
                            },{
                                caption: "药品单位",
                                dataField: "unit",
                                allowSorting: false,
                                width:80
                            },{
                                caption: "生产厂商",
                                dataField: "factory",
                                allowSorting: false,
                                width:100
                            },{
                                caption: "批准文号",
                                dataField: "authNo",
                                allowSorting: false,
                                width:100
                            },{
                                caption: "对码状态",
                                dataField: "mapStatus",
                                allowSorting: false,
                                width:80,
                                lookup:{
                                    dataSource:this.enum.mapStatus,
                                    displayExpr:'text',
                                    valueExpr:'id'
                                }
                            },
                        ],
                        hoverStateEnabled: true,
                        showRowLines: true,
                        showBorders:true,
                        scrolling: { mode: 'infinite' },
                        paging: { enabled: true, pageSize: 10 },
                        height: 400,
                        selection: { mode: 'single' },
                        selectedRowKeys: [value],
                        onSelectionChanged: (selectedItems) => {
                            let keys = selectedItems.selectedRowKeys;
                            let hasSelection = keys.length;
                            e.component.option("value", hasSelection ? keys[0] : null);
                        }
                    });
                    let instance = grid.dxDataGrid('instance');
                    e.component.on("valueChanged", function (args) {
                        instance.selectRows(args.value, false);
                        e.component.close();
                    });
                    return grid;
                }
            }).dxDropDownBox("instance");

            this.btnPart = new (Vue.component('CommandBtns'))();
            this.btnPart.items = [
                { id: 1, text: '导入药品', type: "primary", enabled: true, click:this.exportDrug},
                { id: 2, text: '手动对码', enabled: true, click:this.handCompare}
            ];
            this.btnPart.$mount('#btn');
            this.btnPart.$parent = this;
        },
        methods:{
            //查询
            search(){
                let ds = this.drugGrid.getDataSource();
                ds.loadOptions().searchData = this.searchFormData;
                ds.reload();
            },
            //重置
            resetSearch(){
                this.searchForm.resetValues();
                this.drugGrid.refresh();
            },
            handCompare(){
                this.hosDrug = {};
                this.ownDrug = {};
                this.notMapGrid.clearSelection();
                this.notMapGrid.refresh();
                this.dropDownBox.reset();
                this.modal.visible = true
            },
            orgDrugStatus(data,extr){
                let params = {};
                params.id = data.id;
                if(extr == 'Y'){
                    params.status = 1
                }else{
                    params.status = 0
                }
                this.$post(org_drug_update_url,params).then(res => {
                    if(res.code=='200'){
                        this.success('操作成功!',()=>{
                            this.drugGrid.refresh()
                        });
                    }else{
                        this.warn(res.msg);
                    }
                }).catch(err=>{
                    this.error(err);
                });
            },
            orgDrugDel(data){
                let params = {},p_data = {};
                p_data.id = data.id;
                params.data = p_data;
                this.$del(org_drug_del_url,params).then(res => {
                    if(res.code=='200'){
                        this.success('删除成功!',()=>{
                            this.drugGrid.refresh()
                        });
                    }else{
                        this.warn(res.msg);
                    }
                }).catch(err=>{
                    this.error(err);
                });
            },
            submit(){
                let params = {};
                this.modal.modal_loading = true;
                if(!this.hosDrug.drugCode || !this.ownDrug.id){
                    this.modal.modal_loading = false;
                    return
                }
                params.orgDrugCode = this.hosDrug.drugCode;
                params.drugId = this.ownDrug.id;
                this.$post(org_drug_map_url,params).then(res => {
                    if(res.code=='200'){
                        this.success('保存成功!',()=>{
                            this.hosDrug = {};
                            this.ownDrug = {};
                            this.dropDownBox.reset();
                            // this.notMapGrid.deselectAll();
                            this.notMapGrid.refresh();
                            this.modal.modal_loading = false;
                            this.drugGrid.refresh()
                        });
                    }else{
                        this.modal.modal_loading = false;
                        this.warn(res.msg);
                    }
                }).catch(err=>{
                    this.modal.modal_loading = false;
                    this.error(err);
                });
            },
            cancle(){
                this.modal.visible = false
            },
            exportDrug(){
                this.hosDrugGrid.refresh();
                this.drugModal.visible = true
            },
            formCancel(){
                this.drugModal.visible = false
            },
            formSubmit(){
                let params = {},ids = [];
                this.drugModal.modal_loading = true;
                let selectData = this.hosDrugGrid.getSelectedRowsData();
                if(selectData.length == 0){
                    this.drugModal.modal_loading = false;
                    return
                }
                for (let i=0; i<selectData.length; i++){
                    ids.push(selectData[i].id)
                }
                params.ids = ids;
                this.$post(drug_insert_url, params).then(res => {
                    if (res.code == '200') {
                        this.success('保存成功!', () => {
                            this.drugModal.visible = false;
                            this.drugModal.modal_loading = false;
                            this.drugGrid.refresh();
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
            }
        }
    }
</script>