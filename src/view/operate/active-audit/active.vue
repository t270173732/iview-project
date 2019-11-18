<style lang="less">
    @import "../../../styles/common.less";
</style>
<template>
    <div>
        <Row>
            <Card dis-hover>
                <Row>
                    <Searchpanel ref="searchPanel">
                        <div slot="form" class="margin-bottom-3" id="searchFrom">
                        </div>
                        <div slot="control">
                            <Button type="primary" @click="search">查询</Button>
                            <Button class="margin-left-5" @click="resetSearch">重置</Button>
                        </div>
                    </Searchpanel>
                </Row>
                <Row :gutter="10" class="margin-top-10">
                    <div id="active-grid"></div>
                </Row>
            </Card>
        </Row>
    </div>
</template>
<script>
    import Vue from 'vue';

    let active_grid_url = '/biz/bizActivity/read/page';
    let active_status_url = '/biz/bizActivity/updateActivityStatus';
    export default {
        data () {
            return {
                searchFrom: {},
                searchFromData: {},
                isLoadData: true,
                activeGridData: new this.customstore({
                    load: (loadOptions) => {
                        return this.CommDs.loadPage(loadOptions, active_grid_url, this.isLoadData, {status:1}, this.activeGrid);
                    },
                }),
            };
        },
        mounted () {
            this.searchFrom = $('#searchFrom').dxForm({
                colCount: 4,
                formData: this.searchFromData,
                items: [
                    {
                        dataField: 'title',
                        label: {
                            alignment: 'right',
                            text: '活动名称'
                        },
                    },
                    {
                        dataField: 'creator',
                        label: {
                            alignment: 'right',
                            text: '创建人'
                        },
                    },
                    {
                        dataField: 'startTime',
                        label: {
                            alignment: 'right',
                            text: '活动开始时间'
                        },
                        template: this.addDateRange,
                    },
                ]
            }).dxForm('instance');

            this.activeGrid = $('#active-grid').dxDataGrid({
                // keyExpr: "id",
                showRowLines: true,
                showBorders: true,
                columnAutoWidth: true,
                columnFixing: {
                    enabled: true
                },
                selection: {
                    mode: 'single'
                },
                hoverStateEnabled: true,
                dataSource: {
                    store: this.activeGridData
                },
                remoteOperations: {
                    filtering: true,
                    sorting: true,
                    paging: true
                },
                paging: {
                    pageSize: 10
                },
                // pager: {
                //     showPageSizeSelector: true,
                //     allowedPageSizes: [10, 50, 100]
                // },
                columns: [
                    {
                        caption: '操作',
                        alignment: 'center',
                        allowResizing: false,
                        allowFiltering: false,
                        allowSorting: false,
                        cellTemplate: (container, options) => {
                            container.append('<div id=\'t1\'/>');
                            let opcol = new (Vue.component('OpCol'));
                            opcol.items = [
                                {text: '审核发布', showtip: false, id: options.data, click: this.audit},
                                // {text: '驳回', showtip: false, id: options.data, click: this.reject},
                            ];
                            opcol.$mount('#t1');
                        },
                        width: 100,
                    },
                    {
                        caption: '活动名称',
                        dataField: 'title',
                        allowSorting: false,
                    },
                    {
                        caption: '创建人',
                        dataField: 'creator',
                        allowSorting: false,
                        width:100
                    },
                    {
                        caption: '活动开始时间',
                        dataField: 'startTime',
                        width: 200,
                    },
                    {
                        caption: '活动结束时间',
                        dataField: 'endTime',
                        width: 200,
                    },
                    {
                        dataField: 'status',
                        allowSorting: false,
                        width: 80,
                        alignment: 'center',
                        caption: '状态',
                        lookup:{
                            dataSource:this.enum.activeStatus,
                            displayExpr:'text',
                            valueExpr:'id'
                        }
                    },
                    {
                        caption: '备注',
                        dataField: 'remark',
                        allowSorting: false,
                    },
                ]
            }).dxDataGrid('instance');
        },
        methods: {
            //添加时间
            addDateRange: function (data, itemElement) {
                itemElement.append('<div id=\'date-holder\'/>');
                var dateRange = new (Vue.component('DateRange'));
                dateRange.field = data;
                dateRange.$mount('#date-holder');
                dateRange.$parent = this;
                this.$refs.startTimeData = dateRange;
            },

            //搜索
            search: function () {
                var ds = this.activeGrid.getDataSource();
                ds.loadOptions().searchData = this.searchFromData;
                ds.reload();
            },

            //重置
            resetSearch: function () {
                this.$refs.startTimeData.values = null;
                this.searchFromData.startTime = '';
                this.searchFrom.resetValues();
                this.activeGrid.refresh();
            },

            //审核
            audit: function (data) {
                let argu;
                argu = {active_id: data.id};
                this.$router.push({
                    name: 'active-audit-info',
                    params: argu
                });
            },

            //驳回
            reject: function (data) {
                let params = {};
                params.id = data.id;
                params.status = 4;
                this.$post(active_status_url, params).then(res => {
                    if (res.code == '200') {
                        this.success('驳回成功!', () => {
                            this.activeGrid.refresh();
                        });
                    }
                    else {
                        //提示信息
                        this.warn(res.msg);
                    }
                }).catch(err => {
                    this.error(err);
                });
            },
        }
    };
</script>