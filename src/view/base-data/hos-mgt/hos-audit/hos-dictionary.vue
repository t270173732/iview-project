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
                <div id="hos-grid"></div>
            </Row>
        </Card>
    </div>
</template>
<script>
    import Vue from 'vue';
    let hos_grid_data_url = '/biz/bdOrgHospital/read/page';
    let hos_audit_url = '/biz/bdOrgHospital/authHospital';
    export default {
        data(){
            return{
                isLoadData:true,
                searchForm:{},
                searchFormData:{},
                hosGridData: new this.customstore({
                    load: (loadOptions) => {
                        return this.CommDs.loadPage(loadOptions, hos_grid_data_url, this.isLoadData, {authStatus:0});
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
                            text: '医疗机构'
                        },
                        editorOptions:{
                            placeholder:'医疗机构名称/编码'
                        }
                    },
                ]
            }).dxForm('instance');

            this.hosGrid = $("#hos-grid").dxDataGrid({
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
                onSelectionChanged: (e) => {
                    if (e.selectedRowKeys.length > 0) {
                        this.classBtnPart.items[0].enabled = true
                        this.classBtnPart.items[1].enabled = true
                    }
                    else {
                        this.classBtnPart.items[0].enabled = false
                        this.classBtnPart.items[1].enabled = false
                    }
                },
                columnFixing: {
                    enabled: true
                },
                selection: {
                    mode: 'single',
                },
                hoverStateEnabled: true,
                dataSource: {
                    store: this.hosGridData
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
                        caption: "医疗机构编码",
                        dataField: "orgCode",
                        width: 100,
                        cellTemplate: (container, options) => {
                            container.append("<div id='t1'/>");
                            var opcol = new (Vue.component('OpCol'));
                            opcol.items = [
                                { text: options.data.orgCode, showtip: false, id: options.data, click:this.toDetail},
                            ];
                            opcol.$mount('#t1');
                        }
                    },
                    {
                        caption: "医疗机构名称",
                        dataField: "orgName",
                        allowSorting: false,
                    },
                    {
                        caption: "联系人",
                        dataField: "contacts",
                        allowSorting: false,
                        width:100
                    },
                    {
                        caption: "联系电话",
                        dataField: "telephone",
                        allowSorting: false,
                        width:100
                    },
                    {
                        caption: "地址",
                        dataField: "address",
                        allowSorting: false,
                    },
                    {
                        caption: "医疗机构性质",
                        width:100,
                        dataField: "nature",
                        allowSorting: false,
                        lookup:{
                            dataSource:this.enum.nature,
                            displayExpr:'text',
                            valueExpr:'id',
                        }
                    },
                    {
                        caption: "转出方式",
                        dataField: "transType",
                        allowSorting: false,
                        width:100,
                        lookup:{
                            dataSource:this.enum.transType,
                            displayExpr:'text',
                            valueExpr:'id',
                        }
                    },
                ]
            }).dxDataGrid("instance");

            this.classBtnPart = new (Vue.component('CommandBtns'))();
            this.classBtnPart.items = [
                { id: 1, text: '审核通过', type: "primary", enabled: false, click: this.auditHos },
                { id: 2, text: '审核不通过', enabled: false, click: this.reject },
            ];
            this.classBtnPart.$mount('#btn');
            this.classBtnPart.$parent = this;
        },
        methods:{
            //查询
            search(){
                var ds = this.hosGrid.getDataSource();
                ds.loadOptions().searchData = this.searchFormData;
                ds.reload();
            },
            //重置
            resetSearch(){
                this.searchForm.resetValues();
                this.hosGrid.refresh();
            },
            //审核
            auditHos(){
                let params = {};
                params.id = this.hosGrid.getSelectedRowsData()[0].id;
                params.authStatus = 1;
                this.$post(hos_audit_url,params).then(res => {
                    if(res.code=='200'){
                        this.success('审核成功!',()=>{
                            this.hosGrid.refresh()
                        });
                    }else{
                        this.warn(res.msg);
                    }
                }).catch(err=>{
                    this.error(err);
                });
            },
            reject(){
                let params = {};
                params.id = this.hosGrid.getSelectedRowsData()[0].id;
                params.authStatus = 2;
                this.$post(hos_audit_url,params).then(res => {
                    if(res.code=='200'){
                        this.success('审核成功!',()=>{
                            this.hosGrid.refresh()
                        });
                    }else{
                        this.warn(res.msg);
                    }
                }).catch(err=>{
                    this.error(err);
                });
            },
            toDetail(data){
                this.$router.push({
                    name:'hos-audit-info',
                    params:{hos_id:data.id}
                })
            }
        }
    }
</script>
