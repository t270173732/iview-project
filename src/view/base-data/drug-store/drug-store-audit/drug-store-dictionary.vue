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
                <div id="store-grid"></div>
            </Row>
            <Row class="margin-top-10">
                <div id="saler-grid"></div>
            </Row>
        </Card>
        <Modal v-model="modal.visible" :mask-closable="false" width="650" title="编辑数据">
            <p slot="header">
                <span>不通过原因</span>
            </p>
            <div id="rejectForm"></div>
            <div slot="footer">
                <Button type="text" @click="formCancle">取消</Button>
                <Button type="primary" :loading="modal.modal_loading" @click="save">保存</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    import Vue from 'vue';

    let store_grid_data_url = '/biz/bdOrgDrugstore/read/page';
    let store_audit_url = '/biz/bdOrg/authOrg';
    export default {
        data() {
            return {
                isLoadData: true,
                isLoadSalerData: false,
                searchForm: {},
                searchFormData: {},
                selectedData: {},
                salerForm: {},
                salerFormData: {},
                rejectForm:{},
                rejectFormData:{},
                modal:{
                    visible:false,
                    modal_loading:false
                },
                storeGridData: new this.customstore({
                    load: (loadOptions) => {
                        return this.CommDs.loadPage(loadOptions, store_grid_data_url, this.isLoadData, {authStatus: 0});
                    },
                }),
            }
        },
        mounted() {
            this.rejectForm = $('#rejectForm').dxForm({
                formData: this.rejectFormData,
                items: [
                    {
                        dataField: 'refuseReson',
                        editorType:'dxTextArea',
                        label: {
                            alignment: 'right',
                            text: '不通过原因'
                        },
                        editorOptions:{
                            maxLength:100,
                            height:60
                        },
                    },
                ]
            }).dxForm('instance');

            this.searchForm = $('#searchForm').dxForm({
                colCount: 4,
                formData: this.searchFormData,
                items: [
                    {
                        dataField: 'keyword',
                        label: {
                            alignment: 'right',
                            text: '药店'
                        },
                        editorOptions: {
                            placeholder: '药店名称/编码'
                        }
                    },
                ]
            }).dxForm('instance');

            this.storeGrid = $("#store-grid").dxDataGrid({
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
                        this.classBtnPart.items[0].enabled = true;
                        this.classBtnPart.items[1].enabled = true;
                    }
                    else {
                        this.classBtnPart.items[0].enabled = false;
                        this.classBtnPart.items[1].enabled = false;
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
                    store: this.storeGridData
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
                        caption: "药店编码",
                        dataField: "orgCode",
                        width: 100,
                        cellTemplate: (container, options) => {
                            container.append("<div id='t1'/>");
                            let opcol = new (Vue.component('OpCol'));
                            opcol.items = [
                                {text: options.data.orgCode, showtip: false, id: options.data, click: this.addHos},
                            ];
                            opcol.$mount('#t1');
                        }
                    },
                    {
                        caption: "药店名称",
                        dataField: "orgName",
                        allowSorting: false,
                    },
                    {
                        caption: '区域',
                        dataField: 'areaId',
                        allowSorting: false,
                        lookup: {
                            dataSource: this.CommDs.areaPathList,
                            displayExpr: 'fullPath',
                            valueExpr: 'id',
                        },
                    },
                    {
                        caption: "联系人",
                        dataField: "contacts",
                        allowSorting: false,
                        width: 100
                    },
                    {
                        caption: "联系电话",
                        dataField: "telephone",
                        allowSorting: false,
                        width: 100
                    },
                    {
                        caption: "地址",
                        dataField: "address",
                        allowSorting: false,
                    },
                    {
                        caption: "配送方式",
                        width: 100,
                        alignment: 'center',
                        dataField: "dispatchType",
                        allowSorting: false,
                        lookup: {
                            dataSource: this.enum.dispatchType,
                            displayExpr: 'text',
                            valueExpr: 'id'
                        },
                    },
                    {
                        caption: "状态",
                        dataField: "authStatus",
                        allowSorting: false,
                        width:100,
                        lookup:{
                            dataSource:this.enum.authStatus,
                            displayExpr:'text',
                            valueExpr:'id',
                        }
                    },
                ]
            }).dxDataGrid("instance");

            this.classBtnPart = new (Vue.component('CommandBtns'))();
            this.classBtnPart.items = [
                {id: 1, text: '审核通过', type: "primary", enabled: false, click: this.audit},
                {id: 2, text: '审核不通过', enabled: false, click: this.reject},
            ];
            this.classBtnPart.$mount('#btn');
            this.classBtnPart.$parent = this;
        },
        methods: {
            //查询
            search() {
                var ds = this.storeGrid.getDataSource();
                ds.loadOptions().searchData = this.searchFormData;
                ds.reload();
            },
            //重置
            resetSearch() {
                this.searchForm.resetValues();
                this.storeGrid.refresh();
            },
            addHos(data) {
                this.$router.push({
                    name: 'drugStore-info',
                    params: {store_id: data.id}
                })
            },
            //审核
            audit() {
                let params = {};
                params.id = this.storeGrid.getSelectedRowsData()[0].id;
                params.authStatus = 1;
                this.$post(store_audit_url, params).then(res => {
                    if (res.code == '200') {
                        this.success('审核成功!', () => {
                            this.storeGrid.refresh()
                        });
                    } else {
                        this.warn(res.msg);
                    }
                }).catch(err => {
                    this.error(err);
                });
            },
            reject(){
                this.rejectFormData = {};
                this.rejectForm.option('formData',this.rejectFormData);
                this.modal.visible = true;
            },
            formCancle(){
                this.modal.visible = false;
            },
            save() {
                let params = {};
                this.modal.modal_loading = true;
                params = this.rejectFormData;
                params.id = this.storeGrid.getSelectedRowsData()[0].id;
                params.authStatus = 2;
                this.$post(store_audit_url, params).then(res => {
                    if (res.code == '200') {
                        this.success('操作成功!', () => {
                            this.modal.visible = false;
                            this.modal.modal_loading = false;
                            this.storeGrid.refresh()
                        });
                    } else {
                        this.modal.modal_loading = false;
                        this.warn(res.msg);
                    }
                }).catch(err => {
                    this.modal.modal_loading = false;
                    this.error(err);
                });
            }
        }
    }
</script>
