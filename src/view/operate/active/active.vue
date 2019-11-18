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
                <Row class="margin-top-10">
                    <div id="active-grid"></div>
                </Row>
            </Card>
        </Row>
    </div>
</template>
<script>
    import Vue from 'vue';
    import Cookie from 'js-cookie';

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
                        return this.CommDs.loadPage(loadOptions, active_grid_url, this.isLoadData, {});
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
                        dataField: 'status',
                        editorType: 'dxSelectBox',
                        label: {
                            alignment: 'right',
                            text: '状态'
                        },
                        editorOptions: {
                            dataSource: this.enum.activeStatus,
                            displayExpr: 'text',
                            valueExpr: 'id',
                        }
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
                showRowLines: true,
                showBorders: true,
                columnAutoWidth: true,
                allowResizing: true,
                onToolbarPreparing: (e) => {
                    e.toolbarOptions.items.unshift({
                        location: 'before',
                        template: () => {
                            return $('<div id=\'btn\'/>');
                        }
                    });
                },
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
                columns: [
                    {
                        caption: '操作',
                        alignment: 'center',
                        allowResizing: false,
                        allowFiltering: false,
                        allowSorting: false,
                        cellTemplate: (container, options) => {
                            //操作列
                            container.append('<div id=\'t1\'/>');

                            let opcol = new (Vue.component('OpCol'));
                            if (options.data.status == 1 || options.data.status == 3) {
                                opcol.items = [
                                    {text: '编辑', showtip: false, id: options.data, click: this.edit},
                                ];
                            } else if (options.data.status == 2) {
                                opcol.items = [
                                    {text: '查看', showtip: false, id: options.data, click: this.checkEdit},
                                    // {text: '撤回', showtip: false, id: options.data, click: this.recall},
                                    // {text: '停用', showtip: false, id: options.data, click: this.stopPublish},
                                ];
                            }
                            // else if (options.data.status == 3) {
                            //     opcol.items = [
                            //         {text: '查看', showtip: false, id: options.data, click: this.checkEdit},
                            //         {text: '发布', showtip: false, id: options.data, click: this.publish},
                            //         {text: '停用', showtip: false, id: options.data, click: this.stopPublish},
                            //     ];
                            // }

                            opcol.$mount('#t1');
                        },
                        width: 130,
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
                        width: 150,
                    },
                    {
                        caption: '活动结束时间',
                        dataField: 'endTime',
                        width: 150,
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

            this.btnPart = new (Vue.component('CommandBtns'))();
            this.btnPart.items = [
                {id: 1, text: '新增', type: 'primary', enabled: true, click: this.addActive},
            ];
            this.btnPart.$mount('#btn');
            this.btnPart.$parent = this;
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
                let ds = this.activeGrid.getDataSource();
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

            addActive: function () {
                let argu;
                argu = {active_id: 0};
                this.$router.push({
                    name: 'active-info',
                    params: argu
                });
            },

            edit: function (data) {
                let argu;
                argu = {active_id: data.id};
                this.$router.push({
                    name: 'active-info',
                    params: argu
                });
            },

            //停用
            stopPublish: function (data) {
                let params = {};
                params.id = data.id;
                params.status = 0;
                this.$post(active_status_url, params).then(res => {
                    if (res.code == '200') {
                        this.success('停用成功!', () => {
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

            //发布
            publish: function (data) {
                let params = {};
                params.id = data.id;
                params.status = 2;
                this.$post(active_status_url, params).then(res => {
                    if (res.code == '200') {
                        this.success('发布成功!', () => {
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

            //撤回
            recall:function(data){
                let params = {};
                params.id = data.id;
                params.status = 6;
                this.$post(active_status_url, params).then(res => {
                    if (res.code == '200') {
                        this.success('撤回成功!', () => {
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

            //查看
            checkEdit:function (data) {
                let argu;
                argu = {active_id: data.id};
                this.$router.push({
                    name: 'check-active',
                    params: argu
                });
            }
        }
    };
</script>