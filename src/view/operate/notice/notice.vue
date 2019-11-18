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
                <div id="noticeGrid"></div>
            </Row>
        </Card>
    </div>
</template>
<script>
    import Vue from 'vue';
    let notice_grid_data_url = '/sys/sysNotice/read/page';
    let notice_del_url = '/sys/sysNotice/deleteNotice';
    export default {
        data(){
            return{
                isLoadData:true,
                searchForm: {},
                searchFormData: {},
                noticeGridData: new this.customstore({
                    load: (loadOptions) => {
                        return this.CommDs.loadPage(loadOptions, notice_grid_data_url, this.isLoadData, {});
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
                        dataField: 'title',
                        label: {
                            alignment: 'right',
                            text: '公告标题'
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
                    {
                        dataField: 'status',
                        editorType: 'dxSelectBox',
                        label: {
                            alignment: 'right',
                            text: '状态'
                        },
                        editorOptions: {
                            dataSource: this.enum.noticeStatus,
                            displayExpr: 'text',
                            valueExpr: 'id',
                        },
                    },
                ]
            }).dxForm('instance');

            this.noticeGrid = $("#noticeGrid").dxDataGrid({
                showRowLines: true,
                showBorders: true,
                allowColumnReordering: true,
                allowColumnResizing: true,
                columnAutoWidth: true,
                columnFixing: {
                    enabled: true
                },
                onToolbarPreparing: (e) => {
                    e.toolbarOptions.items.unshift({
                        location: "before",
                        template: () => {
                            return $('<div id=\'btn\'/>');
                        }
                    });
                },
                selection: {
                    mode: "single"
                },
                hoverStateEnabled: true,
                dataSource: {
                    store: this.noticeGridData
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
                            var opcol = new (Vue.component('OpCol'));
                            if(options.data.status == 1){
                                opcol.items = [
                                    { text: '编辑', showtip: false, id: options.data, click:this.edit},
                                ];
                            }else{
                                opcol.items = [
                                    { text: '编辑', showtip: false, id: options.data, click:this.edit},
                                    { text: '删除', showtip: true, tip:'确认删除吗？', color:'#ff9900', id: options.data, click:this.del},
                                ];
                            }
                            opcol.$mount('#t1');
                        },
                        width:100
                    },
                    {
                        caption: "公告标题",
                        dataField: "title",
                        allowSorting: false,
                    },
                    {
                        caption: "创建人",
                        dataField: "creator",
                        allowSorting: false,
                        width: 100
                    },
                    {
                        caption: "创建时间",
                        dataField: "createTime",
                        width: 200
                    },
                    {
                        caption: "编辑时间",
                        dataField: "updateTime",
                        width: 200
                    },
                    {
                        caption: "状态",
                        alignment: "center",
                        dataField: "status",
                        allowSorting: false,
                        lookup: {
                            dataSource: this.enum.noticeStatus,
                            displayExpr: 'text',
                            valueExpr: 'id'
                        },
                        width: 200
                    },
                ]
            }).dxDataGrid("instance");

            this.btnPart = new (Vue.component('CommandBtns'))();
            this.btnPart.items = [
                { id: 1, text: '新增', type: "primary", enabled: true, click: this.addNotice },
            ];
            this.btnPart.$mount('#btn');
            this.btnPart.$parent = this;

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
                var ds = this.noticeGrid.getDataSource();
                ds.loadOptions().searchData = this.searchFormData;
                ds.reload();
            },
            //重置
            resetSearch(){
                this.$refs.createDateRange.values = [];
                this.searchFormData.createTime = [];
                this.searchForm.resetValues();
                this.noticeGrid.refresh();
            },
            addNotice(){
                this.$router.push({
                    name: 'notice-info',
                    params: {notice_id:0}
                });
            },
            edit(data){
                this.$router.push({
                    name: 'notice-info',
                    params: {notice_id:data.id}
                });
            },
            del(data){
                let params = {},p_data = {};
                p_data.id = data.id;
                params.data = p_data;
                this.$del(notice_del_url,params).then(res => {
                    if(res.code=='200') {
                        this.success('删除成功!',()=>{
                            this.noticeGrid.refresh();
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