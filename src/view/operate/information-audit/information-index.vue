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
                <div id="infomationGrid"></div>
            </Row>
        </Card>
    </div>
</template>
<script>
    import Vue from 'vue';
    let infomation_grid_data_url = '/biz/bizArticle/read/page';
    let article_status_url = '/biz/bizArticle/updateStatus';
    let class_list_url = '/biz/bizContentClass/read/list';
    let class_byKey_url = '/biz/bizContentClass/read/detail';
    export default {
        data(){
            return{
                isLoadData:true,
                searchForm: {},
                searchFormData: {},
                infomationGridData: new this.customstore({
                    load: (loadOptions) => {
                        return this.CommDs.loadPage(loadOptions, infomation_grid_data_url, this.isLoadData, {waitAuth:true});
                    },
                }),
                contentClassList: new this.customstore({
                    key: "id",
                    byKey: (key) => {
                        return this.CommDs.loadByKey(class_byKey_url, { id: key });
                    },
                    load: (e) => {
                        return this.CommDs.loadList(class_list_url,{status:1});
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
                        dataField: 'title',
                        label: {
                            alignment: 'right',
                            text: '资讯标题'
                        },
                    },
                    {
                        dataField: 'contentClass',
                        editorType: 'dxSelectBox',
                        label: {
                            alignment: 'right',
                            text: '分类'
                        },
                        editorOptions:{
                            dataSource:this.contentClassList,
                            displayExpr:'className',
                            valueExpr:'id'
                        }
                    },
                    {
                        dataField: 'creator',
                        label: {
                            alignment: 'right',
                            text: '创建人'
                        },
                    },
                    {
                        dataField: 'createTime',
                        label: {
                            alignment: 'right',
                            text: '创建时间'
                        },
                        template: this.addDateRange
                    },
                ]
            }).dxForm('instance');

            this.infomationGrid = $("#infomationGrid").dxDataGrid({
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
                    store: this.infomationGridData
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
                            if(options.data.status == 1){
                                opcol.items = [
                                    { text: '审核', showtip: false, id: options.data, click:this.edit},
                                ];
                            }else if(options.data.status == 2){
                                opcol.items = [
                                    { text: '撤回', showtip: true, tip:'确认撤回吗？', color:'#ff9900', id: options.data, click:this.reback},
                                ];
                            }
                            opcol.$mount('#t1');
                        },
                        width:100
                    },
                    {
                        caption: "资讯标题",
                        dataField: "title",
                        allowSorting: false,
                    },
                    {
                        caption: "分类",
                        dataField: "className",
                        allowSorting: false,
                        width:100
                    },
                    {
                        caption: "创建人",
                        dataField: "creator",
                        allowSorting: false,
                        width:100
                    },
                    {
                        caption: "创建时间",
                        dataField: "createTime",
                        width:200
                    },
                    {
                        caption: "编辑时间",
                        dataField: "updateTime",
                        width:200
                    },
                    {
                        caption: "状态",
                        alignment: "center",
                        dataField: "status",
                        allowSorting: false,
                        lookup: {
                            dataSource: this.enum.contentStatus,
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

        },
        methods:{
            addDateRange: function (data, itemElement) {
                itemElement.append('<div id=\'date\'/>');
                var dateRange = new (Vue.component('DateRange'));
                dateRange.field = data;
                dateRange.$mount('#date');
                dateRange.$parent = this;
                this.$refs.createDateRange = dateRange;
            },
            //查询
            search(){
                var ds = this.infomationGrid.getDataSource();
                ds.loadOptions().searchData = this.searchFormData;
                ds.reload();
            },
            //重置
            resetSearch(){
                this.$refs.createDateRange.values = [];
                this.searchFormData.createTime = [];
                this.searchForm.resetValues();
                this.infomationGrid.refresh();
            },
            edit(data){
                this.$router.push({
                    name: 'information-info',
                    params: {information_id:data.id}
                });
            },
            reback(data){
                let params = {};
                params.id = data.id;
                params.status = 4;
                this.$post(article_status_url,params).then(res => {
                    if(res.code=='200') {
                        this.success('撤回成功!',()=>{
                            this.infomationGrid.refresh();
                        });
                    } else {
                        this.warn(res.msg);
                    }
                }).catch(err=> {
                    this.error(err);
                });
            }
        }
    }
</script>