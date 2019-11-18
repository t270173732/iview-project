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
                <div id="patientsGrid"></div>
            </Row>
        </Card>
    </div>
</template>
<script>
    import Vue from 'vue';
    let patients_grid_data_url = '/sys/sysPatient/read/page';
    export default {
        data(){
            return{
                isLoadData:true,
                searchForm: {},
                searchFormData: {},
                patientsGridData: new this.customstore({
                    load: (loadOptions) => {
                        return this.CommDs.loadPage(loadOptions, patients_grid_data_url, this.isLoadData, {});
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
                            text: '患者'
                        },
                        editorOptions:{
                            placeholder:'姓名/健康号'
                        }
                    },
                ]
            }).dxForm('instance');

            this.patientsGrid = $("#patientsGrid").dxDataGrid({
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
                    store: this.patientsGridData
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
                            opcol.items = [
                                { text: '编辑', showtip: false, id: options.data, click:this.edit},
                            ];
                            opcol.$mount('#t1');
                        },
                        width:100
                    },
                    {
                        caption: "健康号",
                        dataField: "helthNo",
                        width:100
                    },
                    {
                        caption: "姓名",
                        dataField: "name",
                        allowSorting: false,
                        width:200
                    },
                    {
                        caption: "性别",
                        dataField: "sex",
                        allowSorting: false,
                        width:80,
                        lookup:{
                            dataSource:this.enum.sex,
                            displayExpr:'text',
                            valueExpr:'id'
                        }
                    },
                    {
                        caption: "出生日期",
                        dataField: "birthday",
                        dataType: "datetime",
                        format: "yyyy-MM-dd",
                        width:100
                    },
                    {
                        caption: "电话",
                        dataField: "account",
                        allowSorting: false,
                        width:150
                    },
                    {
                        caption: "身份证",
                        dataField: "idCard",
                        allowSorting: false,
                        width:200
                    },
                    {
                        caption: "地址",
                        dataField: "address",
                        allowSorting: false,
                    },
                ]
            }).dxDataGrid("instance");

            this.btnPart = new (Vue.component('CommandBtns'))();
            this.btnPart.items = [
                { id: 1, text: '新增', type: "primary", enabled: true, click: this.addInfo },
            ];
            this.btnPart.$mount('#btn');
            this.btnPart.$parent = this;
        },
        methods:{
            search(){
                let ds = this.patientsGrid.getDataSource();
                ds.loadOptions().searchData = this.searchFormData;
                ds.reload();
            },
            resetSearch(){
                this.searchForm.resetValues();
                this.patientsGrid.refresh();
            },
            addInfo(){
                this.$router.push({
                    name: 'patient-info',
                    params: {patient_id:0}
                });
            },
            edit(data){
                this.$router.push({
                    name: 'patient-info',
                    params: {patient_id:data.id}
                });
            },
        }
    }
</script>