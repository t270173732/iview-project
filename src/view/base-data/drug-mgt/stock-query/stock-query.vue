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
                <div id="stock-grid"></div>
            </Row>
        </Card>
    </div>
</template>
<script>
    let stock_grid_data_url = '/biz/bdProduct/read/page';
    export default {
        data(){
            return{
                isLoadData:true,
                searchForm:{},
                searchFormData:{},
                stockGridData: new this.customstore({
                    load: (loadOptions) => {
                        return this.CommDs.loadPage(loadOptions, stock_grid_data_url, this.isLoadData, {});
                    },
                }),
            }
        },
        mounted(){
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
                            placeholder:'输入药品编码/药品名称进行查询'
                        }
                    },
                    {
                        dataField: 'orgName',
                        label: {
                            alignment: 'right',
                            text: '信息来源'
                        },
                        editorOptions:{
                            placeholder:'输入医院名称/药店名称/供应商名称进行查询'
                        }
                    },
                ]
            }).dxForm('instance');

            this.stockGrid = $("#stock-grid").dxDataGrid({
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
                    store: this.stockGridData
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
                        caption: "药品编码",
                        dataField: "drugCode",
                        width:150
                    },
                    {
                        caption: "药品名称",
                        dataField: "drugName",
                    },
                    {
                        caption: "包装规格",
                        dataField: "spec",
                        width:100
                    },
                    {
                        caption: "包装单位",
                        alignment: "center",
                        dataField: "unit",
                        width:80
                    },
                    {
                        caption: "生产厂商",
                        dataField: "factory",
                    },
                    {
                        caption: "批准文号",
                        dataField: "authNo",
                        width:100
                    },
                    {
                        caption: "信息来源",
                        dataField: "orgName",
                        width:100
                    },
                    {
                        caption: "价格(元)",
                        dataField: "price",
                        alignment: "left",
                        width:80
                    },
                    {
                        caption: "库存",
                        dataField: "total",
                        width:80
                    },
                ]
            }).dxDataGrid("instance");
        },
        methods:{
            //查询
            search(){
                var ds = this.stockGrid.getDataSource();
                ds.loadOptions().searchData = this.searchFormData;
                ds.reload();
            },
            //重置
            resetSearch(){
                this.searchForm.resetValues();
                this.stockGrid.refresh();
            },
        }
    }
</script>