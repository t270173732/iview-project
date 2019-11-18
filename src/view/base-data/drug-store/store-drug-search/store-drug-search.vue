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
                <div id="drug-grid"></div>
            </Row>
        </Card>
    </div>
</template>
<script>
    import Vue from 'vue';
    let drug_grid_data_url = '/biz/bdProduct/read/page';
    let drug_recommend_url = '/biz/bdProduct/updateDrug';
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
                            text: '来源药店'
                        },
                        editorOptions:{
                            placeholder:'药店名称'
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
                        caption: "操作",
                        width: 100,
                        alignment: "center",
                        allowResizing: false,
                        allowFiltering: false,
                        allowSorting: false,
                        cellTemplate: (container, options) => {
                            container.append("<div id='t1'/>");
                            let opcol = new (Vue.component('OpCol'));
                            if(options.data.recommend == 0){
                                opcol.items = [
                                    { text: '推荐', showtip: false, id: options.data,extra:'Y', click:this.edit},
                                ];
                            }else{
                                opcol.items = [
                                    { text: '不推荐', showtip: false, color:'#ff9900', id: options.data,extra:'N', click:this.edit},
                                ];
                            }
                            opcol.$mount('#t1');
                        }
                    },
                    {
                        caption: "药品编码",
                        dataField: "drugCode",
                        width:100
                    },
                    {
                        caption: "通用名称",
                        dataField: "varietyName",
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
                        caption: "来源药店",
                        dataField: "orgName",
                        allowSorting: false,
                        width:150
                    },
                    {
                        caption: "价格",
                        dataField: "price",
                        width:100
                    },
                    {
                        caption: "库存",
                        dataField: "total",
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
            edit(data,extra){
                let params = {};
                params.id = data.id;
                if(extra == 'Y'){
                    params.recommend = 1
                }else{
                    params.recommend = 0
                }
                this.$post(drug_recommend_url, params).then(res => {
                    if (res.code == '200') {
                        this.success('操作成功!', () => {
                            this.drugGrid.refresh()
                        });
                    } else {
                        this.warn(res.msg);
                    }
                }).catch(err => {
                    this.error(err);
                });
            }
        }
    }
</script>