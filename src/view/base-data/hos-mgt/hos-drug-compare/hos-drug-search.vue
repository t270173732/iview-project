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
    </div>
</template>
<script>
    import Vue from 'vue';
    let drug_grid_data_url = '/biz/bdOrgDrugs/read/page';
    export default {
        data(){
            return{
                isLoadData:true,
                searchForm:{},
                searchFormData:{},
                drugGridData: new this.customstore({
                    load: (loadOptions) => {
                        return this.CommDs.loadPage(loadOptions, drug_grid_data_url, this.isLoadData, {});
                    },
                }),
            }
        },
        mounted(){
            this.searchForm = $('#searchForm').dxForm({
                colCount: 4,
                formData: this.searchFormData,
                items: [
                    {
                        dataField: 'keyword',
                        label: {
                            alignment: 'right',
                            text: '药品名称'
                        },
                        editorOptions:{
                            placeholder:'药品编码/名称'
                        }
                    },
                    {
                        dataField: 'orgName',
                        label: {
                            alignment: 'right',
                            text: '医疗机构'
                        },
                        editorOptions:{
                            placeholder:'医疗机构名称'
                        }
                    },
                    {
                        dataField: 'factory',
                        label: {
                            alignment: 'right',
                            text: '生产厂商'
                        },
                        editorOptions:{
                            placeholder:'生产厂商'
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
                columnFixing: {
                    enabled: true
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
                        caption: "药品编码",
                        dataField: "drugCode",
                        width:100
                    },
                    {
                        caption: "通用名称",
                        dataField: "drugName",
                        allowSorting:false,
                    },
                    {
                        caption: "剂型",
                        dataField: "drugForm",
                        allowSorting:false,
                        width:100
                    },
                    {
                        caption: "药品规格",
                        dataField: "spec",
                        allowSorting:false,
                        width:100
                    },
                    {
                        caption: "药品单位",
                        dataField: "unit",
                        allowSorting:false,
                        width:100
                    },
                    {
                        caption: "生产厂商",
                        dataField: "factory",
                        allowSorting:false,
                    },
                    {
                        caption: "批准文号",
                        dataField: "authNo",
                        allowSorting:false,
                        width:150
                    },
                    {
                        caption: "医疗机构",
                        dataField: "orgName",
                        allowSorting:false,
                        width:150
                    },
                    {
                        caption: "价格",
                        dataField: "price",
                        allowSorting:false,
                        width:100
                    },
                ]
            }).dxDataGrid("instance");
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
        }
    }
</script>