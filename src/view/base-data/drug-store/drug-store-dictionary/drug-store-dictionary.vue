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
            <Card dis-hover class="margin-top-10">
                <Row>
                    <div id="store-grid"></div>
                </Row>
            </Card>
            <Card dis-hover class="margin-top-10">
                <Row>
                    <div id="saler-grid"></div>
                </Row>
            </Card>
        </Card>
        <Modal v-model="modal.visible" :mask-closable="false" width="650" title="编辑数据">
            <p slot="header">
                <span v-if="modal.isNew">新增</span>
                <span v-else="modal.isNew">编辑</span>
            </p>
            <div id="salerForm"></div>
            <div slot="footer">
                <Button type="text" @click="editFormCancel">取消</Button>
                <Button type="primary" :loading="modal.modal_loading" @click="formSubmit">保存</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    import Vue from 'vue';
    let store_grid_data_url = '/biz/bdOrgDrugstore/read/page';
    let store_del_url = '/biz/bdOrg/deleteOrg';
    let saler_grid_data_url = '/sys/sysUser/page';
    let user_update_url = '/sys/sysUser/update';
    let status_update_url = '/biz/bdOrg/updateStatus';
    export default {
        data(){
            return{
                isLoadData:true,
                isLoadSalerData:false,
                searchForm:{},
                searchFormData:{},
                selectedData:{},
                salerForm:{},
                salerFormData:{},
                modal:{
                    isNew:true,
                    visible:false,
                    modal_loading:false
                },
                storeGridData: new this.customstore({
                    load: (loadOptions) => {
                        return this.CommDs.loadPage(loadOptions, store_grid_data_url, this.isLoadData, {});
                    },
                }),
                salerGridData: new this.customstore({
                    load: (loadOptions) => {
                        return this.CommDs.loadPage(loadOptions, saler_grid_data_url, this.isLoadSalerData, {});
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
                            text: '药店'
                        },
                        editorOptions:{
                            placeholder:'药店编码/名称查询'
                        }
                    },
                ]
            }).dxForm('instance');

            this.salerForm = $('#salerForm').dxForm({
                colCount: 2,
                formData: this.salerFormData,
                items: [
                    {
                        dataField: 'account',
                        label: {
                            alignment: 'right',
                            text: '账号'
                        },
                        editorOptions:{
                            placeholder:'<系统自动生成>',
                            disabled:true
                        }
                    },
                    {
                        dataField: 'name',
                        label: {
                            alignment: 'right',
                            text: '姓名'
                        },
                        editorOptions:{
                            maxLength:20
                        },
                        validationRules: [{
                            type:"required",
                            message: "请输入用户名"
                        }]
                    },
                    {
                        dataField: 'sex',
                        editorType:'dxSelectBox',
                        label: {
                            alignment: 'right',
                            text: '性别'
                        },
                        editorOptions:{
                            dataSource:this.enum.sex,
                            displayExpr:'text',
                            valueExpr:'id'
                        }
                    },
                    {
                        dataField: 'mobile',
                        label: {
                            alignment: 'right',
                            text: '联系电话'
                        },
                        validationRules: [{
                            type:"required",
                            message: "请输入手机"
                        },{
                            type: "pattern",
                            pattern: "^1[3|4|5|6|7|8|9][0-9]{9}$",
                            message: "请输入正确的手机号!"
                        }]
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
                onContentReady: (e) => {
                    e.component.selectRowsByIndexes([0]);
                },
                onSelectionChanged: (e) => {
                    this.isLoadSalerData = true;
                    if (e.selectedRowKeys.length > 0) {
                        if(e.selectedRowKeys[0].authStatus == 1 && e.selectedRowKeys[0].status == 1){
                            this.btnPart.items[0].enabled = true;
                        }else{
                            this.btnPart.items[0].enabled = false;
                        }
                        this.selectedData = e.selectedRowKeys[0];
                        let searchData = {
                            orgId:this.selectedData.id
                        };
                        this.salerGrid.getDataSource().loadOptions().searchData = searchData;
                        this.salerGrid.refresh();
                    }
                    else {
                        this.isLoadSalerData = false;
                        this.btnPart.items[0].enabled = false;
                        this.salerGrid.refresh();
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
                        caption: "操作",
                        width: 150,
                        alignment: "center",
                        allowResizing: false,
                        allowFiltering: false,
                        allowSorting: false,
                        cellTemplate: (container, options) => {
                            container.append("<div id='t1'/>");
                            let opcol = new (Vue.component('OpCol'));
                            if(options.data.authStatus == 1){
                                opcol.items = [
                                    { text: '查看', showtip: false, id: options.data, click:this.check},
                                ];
                            }else{
                                opcol.items = [
                                    { text: '编辑', showtip: false, id: options.data, click:this.edit},
                                    { text: '删除', showtip: true, color:'#ff9900', tip: '您确认删除吗？', id: options.data, click:this.del},
                                ];
                            }
                            if(options.data.authStatus == 1){
                                if(options.data.status == 0){
                                    opcol.items.push({ text: '启用', showtip: false, color:'#19be6b', id: options.data,extra:'Y', click:this.updateStatus})
                                }else if(options.data.status == 1){
                                    opcol.items.push({ text: '停用', showtip: true, color:'#ff9900', tip: '您确认停用吗?', id: options.data,extra:'N', click:this.updateStatus})
                                }
                            }
                            opcol.$mount('#t1');
                        }
                    },
                    {
                        caption: "药店编码",
                        dataField: "orgCode",
                        width: 100
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
                        caption: "配送方式",
                        width:100,
                        alignment:'center',
                        dataField: "dispatchType",
                        allowSorting: false,
                        lookup:{
                            dataSource:this.enum.dispatchType,
                            displayExpr:'text',
                            valueExpr:'id'
                        },
                    },
                    {
                        caption: "状态",
                        dataField: "authStatus",
                        alignment:'center',
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

            this.salerGrid = $("#saler-grid").dxDataGrid({
                showRowLines: true,
                showBorders: true,
                allowColumnReordering: true,
                allowColumnResizing: true,
                columnAutoWidth: true,
                onToolbarPreparing: (e) => {
                    e.toolbarOptions.items.unshift({
                        location: "before",
                        template: () => {
                            return $('<div id=\'btn1\'/>');
                        }
                    });
                },
                columnFixing: {
                    enabled: true
                },
                selection: {
                    mode: 'single',
                },
                hoverStateEnabled: true,
                dataSource: {
                    store: this.salerGridData
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
                        width: 150,
                        alignment: "center",
                        allowResizing: false,
                        allowFiltering: false,
                        allowSorting: false,
                        cellTemplate: (container, options) => {
                            container.append("<div id='t1'/>");
                            var opcol = new (Vue.component('OpCol'));
                            opcol.items = [
                                { text: '编辑', showtip: false, id: options.data, click:this.editSaler},
                                { text: '删除', showtip: true, color:'#ff9900', tip: '您确认删除吗？', id: options.data, click:this.delSaler},
                            ];
                            if(options.data.status == 0){
                                opcol.items.push({ text: '启用', showtip: false, color:'#19be6b', id: options.data,extra:'Y', click:this.userUpdateStatus})
                            }else if(options.data.status == 1){
                                opcol.items.push({ text: '停用', showtip: true, color:'#ff9900', tip: '您确认停用吗?', id: options.data,extra:'N', click:this.userUpdateStatus})
                            }
                            opcol.$mount('#t1');
                        }
                    },
                    {
                        caption: "账号",
                        dataField: "account",
                    },
                    {
                        caption: "姓名",
                        dataField: "name",
                        allowSorting: false,
                    },
                    {
                        caption: "联系电话",
                        dataField: "mobile",
                        allowSorting: false,
                    },
                    {
                        caption: "状态",
                        alignment:'center',
                        dataField: "status",
                        allowSorting: false,
                        lookup:{
                            dataSource:this.enum.status,
                            displayExpr:'text',
                            valueExpr:'id'
                        },
                    },
                ]
            }).dxDataGrid("instance");

            this.classBtnPart = new (Vue.component('CommandBtns'))();
            this.classBtnPart.items = [
                { id: 1, text: '新增', type: "primary", enabled: true, click: this.addHos },
            ];
            this.classBtnPart.$mount('#btn');
            this.classBtnPart.$parent = this;

            this.btnPart = new (Vue.component('CommandBtns'))();
            this.btnPart.items = [
                { id: 1, text: '新增店员', type: "primary", enabled: false, click: this.addSaler },
            ];
            this.btnPart.$mount('#btn1');
            this.btnPart.$parent = this;
        },
        methods:{
            //查询
            search(){
                var ds = this.storeGrid.getDataSource();
                ds.loadOptions().searchData = this.searchFormData;
                ds.reload();
            },
            //重置
            resetSearch(){
                this.searchForm.resetValues();
                this.storeGrid.refresh();
            },
            //编辑
            edit(data){
                this.$router.push({
                    name:'store-info',
                    params:{store_id:data.id}
                })
            },
            //删除
            del(data){
                let params = {};
                params.id = data.id;
                this.$post(store_del_url,params).then(res => {
                    if(res.code=='200'){
                        this.success('删除成功!',()=>{
                            this.storeGrid.refresh();
                        });
                    }
                    else{
                        this.warn(res.msg);
                    }
                }).catch(err=>{
                    this.error(err);
                });
            },
            //新增
            addHos(){
                this.$router.push({
                    name:'store-info',
                    params:{store_id:0}
                })
            },
            check(data){
                this.$router.push({
                    name:'drugStore-check',
                    params:{store_id:data.id}
                })
            },
            //新增店员
            addSaler(){
                this.modal.isNew = true;
                this.salerFormData = {};
                this.salerFormData.status = 1;
                this.salerForm.option('formData',this.salerFormData);
                this.modal.visible = true;
            },
            //编辑店员
            editSaler(data){
                this.modal.isNew = false;
                this.salerFormData = data;
                this.salerForm.option('formData',this.salerFormData);
                this.modal.visible = true;
            },
            //删除店员
            delSaler(data){
                var params = {};
                if(data.status == 1){
                    this.warn('请先停用该用户再删除');
                    return;
                }
                params.id = data.id;
                params.orgId = this.selectedData.id;
                params.enable = 0;
                this.$post(user_update_url, params).then(res => {
                    if (res.code == '200') {
                        this.success('删除成功!', () => {
                            this.salerGrid.refresh();
                        });
                    } else {
                        // 提示信息
                        this.warn(res.msg);
                    }
                }).catch(err => {
                    this.error(err);
                });
            },
            editFormCancel(){
                this.modal.visible = false;
            },
            formSubmit(){
                let params = {};
                let url;
                this.modal.modal_loading = true;
                if(!this.salerForm.validate().isValid) {
                    this.modal.modal_loading=false;
                    return;
                }
                this.salerFormData.type = 5;
                this.salerFormData.orgId = this.selectedData.id;
                params = this.salerFormData;
                this.$post(user_update_url,params).then(res => {
                    if(res.code=='200') {
                        this.success('保存成功!',()=>{
                            this.modal.modal_loading =false;
                            this.modal.visible=false;
                            this.salerGrid.refresh();
                        });
                    } else {
                        this.modal.modal_loading =false;
                        this.warn(res.msg);
                    }
                }).catch(err=> {
                    this.modal.modal_loading =false;
                    this.error(err);
                });
            },
            //启用/停用
            updateStatus(data,extra){
                let params = {};
                params.id = data.id;
                if(extra == 'Y'){
                    params.status = 1;
                }else{
                    params.status = 0;
                }
                this.$post(status_update_url,params).then(res => {
                    if(res.code=='200')
                    {
                        this.success('保存成功!',()=>{
                            this.storeGrid.refresh();
                        });
                    }
                    else
                    {
                        //提示信息
                        this.warn(res.msg);
                    }
                }).catch(err=>
                {
                    this.error(err);
                });
            },
            userUpdateStatus(data,extra){
                let params = {};
                params.id = data.id;
                if(extra == 'Y'){
                    params.status = 1;
                }else{
                    params.status = 0;
                }
                this.$post(user_update_url,params).then(res => {
                    if(res.code=='200')
                    {
                        this.success('保存成功!',()=>{
                            this.salerGrid.refresh();
                        });
                    }
                    else
                    {
                        //提示信息
                        this.warn(res.msg);
                    }
                }).catch(err=>
                {
                    this.error(err);
                });
            }
        }
    }
</script>
