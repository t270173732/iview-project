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
                <div id="doc-grid"></div>
            </Row>
        </Card>
    </div>
</template>
<script>
    import Vue from 'vue';
    let supplier_grid_data_url = '/biz/bdOrgSupply/read/page';
    let supplier_audit_url = '/biz/bdOrgSupply/authSupply';
    export default {
        data(){
            return{
                isLoadData:true,
                searchForm:{},
                searchFormData:{},
                supplierGridData: new this.customstore({
                    load: (loadOptions) => {
                        return this.CommDs.loadPage(loadOptions, supplier_grid_data_url, this.isLoadData, {authStatus:0});
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
                            text: '供应商'
                        },
                        editorOptions:{
                            placeholder:''
                        }
                    },
                ]
            }).dxForm('instance');

            this.supplierGrid = $("#doc-grid").dxDataGrid({
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
                onSelectionChanged:(e)=>{
                    if (e.selectedRowKeys.length > 0) {
                        this.btnPart.items[0].enabled = true;
                        this.btnPart.items[1].enabled = true
                    }
                    else {
                        this.btnPart.items[0].enabled = false;
                        this.btnPart.items[1].enabled = false
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
                    store: this.supplierGridData
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
                        caption: "供应商编号",
                        dataField: "orgCode",
                        width: 100,
                        cellTemplate: (container, options) => {
                            container.append("<div id='t1'/>");
                            var opcol = new (Vue.component('OpCol'));
                            opcol.items = [
                                { text: options.data.orgCode, showtip: false, id: options.data, click:this.edit},
                            ];
                            opcol.$mount('#t1');
                        }
                    },
                    {
                        caption: "供应商名称",
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
                    },
                    {
                        caption: "地址",
                        dataField: "address",
                        allowSorting: false,
                    },
                    {
                        caption: "企业性质",
                        dataField: "nature",
                        allowSorting: false,
                        width:100
                    },
                ]
            }).dxDataGrid("instance");

            this.btnPart = new (Vue.component('CommandBtns'))();
            this.btnPart.items = [
                { id: 1, text: '审核通过', type: "primary", enabled: false, click: this.audit },
                { id: 2, text: '审核不通过', enabled: false, click: this.reject },
            ];
            this.btnPart.$mount('#btn');
            this.btnPart.$parent = this;
        },
        methods:{
            //查询
            search(){
                var ds = this.supplierGrid.getDataSource();
                ds.loadOptions().searchData = this.searchFormData;
                ds.reload();
            },
            //重置
            resetSearch(){
                this.searchForm.resetValues();
                this.supplierGrid.refresh();
            },
            //编辑
            edit(data){
                this.$router.push({
                    name:'supplier-info-audit',
                    params:{supplier_id:data.id}
                })
            },
            //审核
            audit(){
                let params = {};
                params.id = this.supplierGrid.getSelectedRowsData()[0].id;
                params.authStatus = 1;
                this.$post(supplier_audit_url,params).then(res => {
                    if(res.code=='200'){
                        this.success('审核成功!',()=>{
                            this.supplierGrid.refresh()
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
                params.id = this.supplierGrid.getSelectedRowsData()[0].id;
                params.authStatus = 2;
                this.$post(supplier_audit_url,params).then(res => {
                    if(res.code=='200'){
                        this.success('审核成功!',()=>{
                            this.supplierGrid.refresh()
                        });
                    }else{
                        this.warn(res.msg);
                    }
                }).catch(err=>{
                    this.error(err);
                });
            }
        }
    }
</script>
