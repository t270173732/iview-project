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
        <Modal v-model="modal.visible" :mask-closable="false" width="650" title="编辑数据">
            <p slot="header">
                <span>添加</span>
            </p>
            <div id="drugForm"></div>
            <div slot="footer">
                <Button type="text" @click="formCancle">取消</Button>
                <Button type="primary" :loading="modal.modal_loading" @click="formSubmit">保存</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    import Vue from 'vue';

    let drug_grid_data_url = '/biz/bdProduct/read/page';
    let drug_list_url = '/biz/bdDrugs/read/list';
    let drug_List_byKey_url = '/biz/bdDrugs/read/detail';
    let drug_insert_url = '/biz/bdProduct/updateDrug';
    let class_list_url = '/biz/bdProductClass/ProductClassList';
    let class_List_byKey_url = '/biz/bdProductClass/getProductClassDetail';
    export default {
        data() {
            return {
                isLoadData: true,
                searchForm: {},
                searchFormData: {},
                drugForm: {},
                drugFormData: {},
                modal: {
                    visible: false,
                    modal_loading: false
                },
                drugGridData: new this.customstore({
                    load: (loadOptions) => {
                        return this.CommDs.loadPage(loadOptions, drug_grid_data_url, this.isLoadData, {});
                    },
                }),
                drugListData: new this.customstore({
                    key: "id",
                    byKey: (key) => {
                        return this.CommDs.loadByKey(drug_List_byKey_url, {id: key});
                    },
                    load: (e) => {
                        return this.CommDs.loadList(drug_list_url, {drugStoreAdd: true, status: 1});
                    }
                }),
                classListData: new this.customstore({
                    key: "id",
                    byKey: (key) => {
                        return this.CommDs.loadByKey(class_List_byKey_url, {id: key});
                    },
                    load: (e) => {
                        return this.CommDs.loadList(class_list_url, {status: 1, childClass: true});
                    }
                }),
            }
        },
        mounted() {
            let _this = this;
            this.searchForm = $('#searchForm').dxForm({
                colCount: 4,
                formData: this.searchFormData,
                items: [
                    {
                        dataField: 'keyword',
                        label: {
                            alignment: 'right',
                            text: '商品名称'
                        },
                        editorOptions: {
                            placeholder: '商品编码/名称'
                        }
                    },
                    {
                        dataField: 'factory',
                        label: {
                            alignment: 'right',
                            text: '生产厂商'
                        },
                        editorOptions: {
                            placeholder: '生产厂商'
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
                onToolbarPreparing: (e) => {
                    e.toolbarOptions.items.unshift({
                        location: "before",
                        template: () => {
                            return $('<div id=\'btn\'/>');
                        }
                    });
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
                            if (options.data.status == 0 && options.data.drugStatus == 1) {
                                opcol.items = [
                                    {
                                        text: '编辑',
                                        showtip: false,
                                        id: options.data,
                                        click: this.edit
                                    },{
                                        text: '启用',
                                        showtip: false,
                                        color: '#19be6b',
                                        id: options.data,
                                        extra: 'Y',
                                        click: this.drugStatus
                                    }
                                ]
                            } else if (options.data.status == 1 && options.data.drugStatus == 1) {
                                opcol.items = [
                                    {
                                        text: '编辑',
                                        showtip: false,
                                        id: options.data,
                                        click: this.edit
                                    },{
                                        text: '停用',
                                        showtip: true,
                                        color: '#ff9900',
                                        tip: '您确认停用吗?',
                                        id: options.data,
                                        extra: 'N',
                                        click: this.drugStatus
                                    }
                                ]
                            }
                            opcol.$mount('#t1');
                        }
                    },
                    {
                        caption: "商品编码",
                        dataField: "drugCode",
                        width: 100
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
                        width: 100
                    },
                    {
                        caption: "药品规格",
                        dataField: "spec",
                        allowSorting: false,
                        width: 100
                    },
                    {
                        caption: "药品单位",
                        dataField: "unit",
                        allowSorting: false,
                        width: 100
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
                        width: 150
                    },
                    {
                        caption: "分类",
                        dataField: "classId",
                        allowSorting: false,
                        width: 100,
                        lookup: {
                            dataSource: this.classListData,
                            displayExpr: 'name',
                            valueExpr: 'id'
                        }
                    },
                    {
                        caption: "价格",
                        dataField: "price",
                        allowSorting: false,
                        width: 100
                    },
                    {
                        caption: "数量",
                        dataField: "total",
                        allowSorting: false,
                        width: 100
                    },
                ]
            }).dxDataGrid("instance");

            this.drugForm = $('#drugForm').dxForm({
                colCount: 2,
                formData: this.drugFormData,
                items: [
                    {
                        dataField: 'drugId',
                        visible:true,
                        editorType: 'dxDropDownBox',
                        label: {
                            alignment: 'right',
                            text: '通用名称'
                        },
                        validationRules: [{
                            type: 'required',
                            message: '请选择药品'
                        }],
                        editorOptions: {
                            dropDownOptions: {width: 800},
                            placeholder: '选择药品',
                            displayExpr: 'name',
                            valueExpr: 'id',
                            onValueChanged: (e) => {
                                if (e.value) {
                                    this.$put(drug_List_byKey_url, {id: e.value}).then(res => {
                                        if (res.code == '200') {
                                            this.drugForm.updateData('drugCode', res.data.drugCode);
                                            this.drugForm.updateData('drugForm', res.data.drugForm);
                                            this.drugForm.updateData('varietySpec', res.data.varietySpec);
                                            this.drugForm.updateData('unit', res.data.unit);
                                            this.drugForm.updateData('factory', res.data.factory);
                                            this.drugForm.updateData('authNo', res.data.authNo);
                                        } else {
                                            this.warn(res.msg);
                                        }
                                    }).catch(err => {
                                        this.error(err);
                                    });
                                }
                            },
                            dataSource: this.drugListData,
                            contentTemplate: (e) => {
                                let value = e.component.option('value');
                                let grid = $('<div>').dxDataGrid({
                                    dataSource: e.component.option('dataSource'),
                                    searchPanel: {
                                        visible: true,
                                        width: 240,
                                        placeholder: '查找...'
                                    },
                                    columns: [
                                        {
                                            caption: "商品编码",
                                            dataField: "drugCode",
                                            width: 100
                                        }, {
                                            caption: "通用名称",
                                            dataField: "name",
                                        }, {
                                            caption: "剂型",
                                            width: 50,
                                            dataField: "drugForm",
                                        }, {
                                            caption: "药品规格",
                                            dataField: "varietySpec",
                                            width: 80,
                                        }, {
                                            caption: "药品单位",
                                            dataField: "unit",
                                            width: 80
                                        }, {
                                            caption: "生产厂商",
                                            dataField: "factory",
                                        }, {
                                            caption: "批准文号",
                                            dataField: "authNo",
                                            width: 100
                                        },
                                    ],
                                    hoverStateEnabled: true,
                                    showBorders: true,
                                    showRowLines: true,
                                    scrolling: {mode: 'infinite'},
                                    paging: {enabled: true, pageSize: 10},
                                    height: 200,
                                    selection: {mode: 'single'},
                                    selectedRowKeys: [value],
                                    onSelectionChanged: (selectedItems) => {
                                        let keys = selectedItems.selectedRowKeys;
                                        let hasSelection = keys.length;
                                        e.component.option("value", hasSelection ? keys[0] : null);
                                    }
                                });
                                let instance = grid.dxDataGrid('instance');
                                e.component.on("valueChanged", function (args) {
                                    instance.selectRows(args.value, false);
                                    e.component.close();
                                });
                                _this['grid_drug'] = instance;
                                return grid;
                            }
                        }
                    },
                    {
                        dataField: 'drugCode',
                        label: {
                            alignment: 'right',
                            text: '商品编码'
                        },
                        editorOptions: {
                            placeholder: '选药品自动生成',
                            readOnly: true
                        }
                    }, {
                        dataField: 'drugForm',
                        label: {
                            alignment: 'right',
                            text: '剂型'
                        },
                        editorOptions: {
                            placeholder: '选药品自动生成',
                            readOnly: true
                        }
                    }, {
                        dataField: 'varietySpec',
                        label: {
                            alignment: 'right',
                            text: '药品规格'
                        },
                        editorOptions: {
                            placeholder: '选药品自动生成',
                            readOnly: true
                        }
                    }, {
                        dataField: 'unit',
                        label: {
                            alignment: 'right',
                            text: '药品单位'
                        },
                        editorOptions: {
                            placeholder: '选药品自动生成',
                            readOnly: true
                        }
                    }, {
                        dataField: 'factory',
                        label: {
                            alignment: 'right',
                            text: '生产厂商'
                        },
                        editorOptions: {
                            placeholder: '选药品自动生成',
                            readOnly: true
                        }
                    }, {
                        dataField: 'authNo',
                        label: {
                            alignment: 'right',
                            text: '批准文号'
                        },
                        editorOptions: {
                            placeholder: '选药品自动生成',
                            readOnly: true
                        }
                    }, {
                        dataField: 'classId',
                        editorType: 'dxSelectBox',
                        label: {
                            alignment: 'right',
                            text: '药品分类'
                        },
                        editorOptions: {
                            dataSource: this.classListData,
                            displayExpr: 'name',
                            valueExpr: 'id'
                        },
                        validationRules: [{
                            type: 'required',
                            message: '请选择分类'
                        }],
                    }, {
                        dataField: 'price',
                        label: {
                            alignment: 'right',
                            text: '价格'
                        },
                        validationRules: [{
                            type: 'pattern',
                            pattern: '^[0-9]{1,9}(\\.[0-9]([0-9])?)?$',
                            message: '价格格式不对!'
                        }, {
                            type: 'required',
                            message: '请输入价格'
                        }],
                    }, {
                        dataField: 'total',
                        editorType: 'dxNumberBox',
                        label: {
                            alignment: 'right',
                            text: '数量'
                        },
                        editorOptions: {
                            min: 0
                        },
                        validationRules: [{
                            type: 'required',
                            message: '请输入数量'
                        }],
                    },
                ]
            }).dxForm('instance');

            this.btnPart = new (Vue.component('CommandBtns'))();
            this.btnPart.items = [
                {id: 1, text: '添加', type: "primary", enabled: true, click: this.addDrug},
            ];
            this.btnPart.$mount('#btn');
            this.btnPart.$parent = this;
        },
        methods: {
            //查询
            search() {
                let ds = this.drugGrid.getDataSource();
                ds.loadOptions().searchData = this.searchFormData;
                ds.reload();
            },
            //重置
            resetSearch() {
                this.searchForm.resetValues();
                this.drugGrid.refresh();
            },
            addDrug() {
                this.drugFormData = {};
                this.drugFormData.status = 1;
                this.drugForm.option('formData', this.drugFormData);
                this.drugForm.itemOption('drugId','visible',true);
                if (this['grid_drug']) {
                    this['grid_drug'].refresh();
                }
                this.modal.visible = true
            },
            edit(data){
                this.drugFormData = data;
                this.drugFormData.varietySpec = data.spec;
                this.drugForm.itemOption('drugId','visible',false);
                this.drugForm.option('formData', this.drugFormData);
                this.modal.visible = true
            },
            formCancle() {
                this.modal.visible = false;
            },
            formSubmit() {
                let params = {};
                this.modal.modal_loading = true;
                if (!this.drugForm.validate().isValid) {
                    this.modal.modal_loading = false;
                    return;
                }
                params = this.drugFormData;
                this.$post(drug_insert_url, params).then(res => {
                    if (res.code == '200') {
                        this.success('保存成功!', () => {
                            this.modal.visible = false;
                            this.modal.modal_loading = false;
                            this.drugGrid.refresh();
                        });
                    } else {
                        this.modal.modal_loading = false;
                        this.warn(res.msg);
                    }
                }).catch(err => {
                    this.modal.modal_loading = false;
                    this.error(err);
                });
            },
            drugStatus(data, extr) {
                let params = {};
                params.id = data.id;
                if (extr == 'N') {
                    params.status = 0
                } else {
                    params.status = 1
                }
                this.$post(drug_insert_url, params).then(res => {
                    if (res.code == '200') {
                        this.success('保存成功!', () => {
                            this.drugGrid.refresh();
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