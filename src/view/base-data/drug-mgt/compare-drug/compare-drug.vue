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
    }

    .table_dm_td {
        border: solid #cfddee;
        border-width: 0px 1px 1px 0px;
        padding: 5px;
        text-align: right;
        line-height: 25px;
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
        <Modal v-model="modal.visible" :mask-closable="false" width="650" title="编辑数据">
            <p slot="header">
                <span>药品对码</span>
            </p>
            <div>
                <table class="table_dm">
                    <tr>
                        <td class="table_dm_th" width="200px"></td>
                        <td class="table_dm_th" width="200px">处方平台</td>
                        <td class="table_dm_th" width="200px">重庆医保</td>
                    </tr>
                    <tr>
                        <td class="table_dm_td text_bold">医药编码</td>
                        <td class="table_dm_td bg_color text_center"></td>
                        <td class="table_dm_td" id="drugCode"></td>
                    </tr>
                    <tr>
                        <td class="table_dm_td text_bold">通用名称</td>
                        <td class="table_dm_td bg_color text_center"></td>
                        <td class="table_dm_td"></td>
                    </tr>
                    <tr>
                        <td class="table_dm_td text_bold">剂型</td>
                        <td class="table_dm_td bg_color text_center"></td>
                        <td class="table_dm_td"></td>
                    </tr>
                    <tr>
                        <td class="table_dm_td text_bold">药品规格</td>
                        <td class="table_dm_td bg_color text_center"></td>
                        <td class="table_dm_td"></td>
                    </tr>
                    <tr>
                        <td class="table_dm_td text_bold">药品单位</td>
                        <td class="table_dm_td bg_color text_center"></td>
                        <td class="table_dm_td" id="drugUnit"></td>
                    </tr>
                    <tr>
                        <td class="table_dm_td text_bold">生产企业</td>
                        <td class="table_dm_td bg_color text_center"></td>
                        <td class="table_dm_td"></td>
                    </tr>
                    <tr>
                        <td class="table_dm_td text_bold">批准文号</td>
                        <td class="table_dm_td bg_color text_center"></td>
                        <td class="table_dm_td"></td>
                    </tr>
                </table>
            </div>
            <div slot="footer">
                <Button type="text">取消</Button>
                <Button type="primary" :loading="modal.modal_loading">保存</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    import Vue from 'vue';
    let drug_grid_data_url = '';
    let drug_list_url = '';
    let drug_List_byKey_url = '';
    export default {
        data(){
            return{
                isLoadData:true,
                searchForm:{},
                searchFormData:{},
                modal:{
                    visible:false,
                    modal_loading:false
                },
                drugGridData: new this.customstore({
                    load: (loadOptions) => {
                        return this.CommDs.loadPage(loadOptions, drug_grid_data_url, this.isLoadData, {});
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
                        dataField: '',
                        label: {
                            alignment: 'right',
                            text: '药品名称'
                        },
                        editorOptions:{
                            placeholder:'输入名称进行查询'
                        }
                    },
                    {
                        dataField: '',
                        editorType: 'dxSelectBox',
                        label: {
                            alignment: 'right',
                            text: '对码状态'
                        },
                        editorOptions: {
                            // dataSource: this.enum.status1,
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
                                    { text: '启用', showtip: false, id: options.data,},
                                ];
                            }else{
                                opcol.items = [
                                    { text: '停用', showtip: true, color:'#ff9900', tip: '您确认删除吗？', id: options.data,},
                                ];
                            }
                            opcol.$mount('#t1');
                        }
                    },
                    {
                        caption: "通用名称",
                        dataField: "",
                    },
                    {
                        caption: "剂型",
                        alignment: "center",
                        dataField: "",
                        width:100
                    },
                    {
                        caption: "包装规格",
                        dataField: "",
                        width:100
                    },
                    {
                        caption: "包装单位",
                        alignment: "center",
                        dataField: "",
                        width:100
                    },
                    {
                        caption: "生产厂商",
                        dataField: "",
                    },
                    {
                        caption: "价格",
                        dataField: "",
                        width:100
                    },
                    {
                        caption: "对码状态",
                        alignment: "center",
                        dataField: "status",
                        lookup:{
                            // dataSource:this.enum.status,
                            displayExpr:'text',
                            valueExpr:'id'
                        },
                        width:100
                    },
                ]
            }).dxDataGrid("instance");

            this.dropDownBox = $("#drugCode").dxDropDownBox({
                inputAttr: {
                    height: '25px'
                },
                valueExpr: "ID",
                deferRendering: false,
                placeholder: "Select a value...",
                displayExpr: function(item){
                    return item && item.CompanyName + " <" + item.Phone + ">";
                },
                showClearButton: true,
                dropDownOptions: { width:800 },
                dataSource: this.drugListData,
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
                                caption: "医保编码",
                                dataField: "",
                                width:100
                            }, {
                                caption: "通用名称",
                                dataField: "",
                            },{
                                caption: "剂型",
                                alignment:'center',
                                width:50,
                                dataField: "",
                            },{
                                caption: "药品规格",
                                dataField: "",
                                width:80,
                            },{
                                caption: "药品单位",
                                dataField: "",
                                width:80
                            },{
                                caption: "生产厂商",
                                dataField: "",
                                width:100
                            },{
                                caption: "批准文号",
                                dataField: "",
                                width:100
                            },{
                                caption: "对码状态",
                                dataField: "",
                                width:80
                            },
                        ],
                        hoverStateEnabled: true,
                        showBorders:true,
                        scrolling: { mode: 'infinite' },
                        paging: { enabled: true, pageSize: 10 },
                        height: 200,
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
            });

            this.selectBox = $("#drugUnit").dxSelectBox({
                dataSource: this.enum.status,
                displayExpr: "text",
                valueExpr: "id",
            }).dxSelectBox("instance");

            this.btnPart = new (Vue.component('CommandBtns'))();
            this.btnPart.items = [
                { id: 1, text: '自动对码', type: "primary", enabled: true, },
                { id: 2, text: '手动对码', type: "success", enabled: true, click:this.handCompare},
                { id: 3, text: '审核', enabled: true, },
            ];
            this.btnPart.$mount('#btn');
            this.btnPart.$parent = this;
        },
        methods:{
            //查询
            search(){
                var ds = this.drugGrid.getDataSource();
                ds.loadOptions().searchData = this.searchFormData;
                ds.reload();
            },
            //重置
            resetSearch(){
                this.searchForm.resetValues();
                this.drugGrid.refresh();
            },
            handCompare(){
                this.selectBox.option('value',1)
                this.modal.visible = true
            }
        }
    }
</script>