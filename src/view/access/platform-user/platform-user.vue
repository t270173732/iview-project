<style lang="less">
    @import "../../../styles/common.less";
</style>
<template>
    <div>
        <Card dis-hover>
            <Row :gutter="10">
                <Col :md="24" :lg="6">
                    <Card dis-hover>
                        <Row>
                            <div id="typeForm"></div>
                        </Row>
                        <Row class="margin-top-10">
                            <div id="company-grid"></div>
                        </Row>
                    </Card>
                </Col>
                <Col :md="24" :lg="18">
                    <Card dis-hover>
                        <Row class="margin-top-10">
                            <div id="user-grid"></div>
                        </Row>
                        <Row class="margin-top-10">
                            <div id="role-tree"></div>
                        </Row>
                    </Card>
                </Col>
            </Row>
        </Card>
        <!--新增用户-->
        <Modal v-model="userModal.visible" :mask-closable="false" width="650" title="编辑数据">
            <p slot="header">
                <span v-if="userModal.isNew">新增用户</span>
                <span v-else="userModal.isNew">编辑用户</span>
            </p>
            <div id="editUserForm"></div>
            <!--新增编辑表单内容-->
            <div slot="footer">
                <Button type="text" @click="editFormCancel">取消</Button>
                <Button type="primary" :loading="userModal.modal_loading" @click="userEditFormSubmit">保存</Button>
            </div>
        </Modal>
        <!--重置密码-->
        <Modal v-model="resetPwModal.visible" :mask-closable="false" width="650" title="编辑数据">
            <p slot="header">
                <span>重置密码</span>
            </p>
            <div id="resetPwForm"></div>
            <!--新增编辑表单内容-->
            <div slot="footer">
                <Button type="text" @click="editFormCancel">取消</Button>
                <Button type="primary" :loading="resetPwModal.modal_loading" @click="resetPwSubmit">保存</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    import Vue from 'vue';
    import Cookie from 'js-cookie';
    //公司列表
    let company_list_url = '/biz/bdOrg/getList';
    //公司用户网格
    let company_user_grid_url = '/sys/sysUser/page';
    //新增/编辑/删除用户
    let user_update_url = '/sys/sysUser/update';
    //重置密码
    let reset_pwd_url = '/sys/sysUser/resetPassword';
    //角色
    let role_list_url = '/sys/role/list';
    //用户角色
    let user_role_list_url = '/sys/role/getRoleByUser';
    //用户添加角色
    let user_insert_role_url = '/sys/sysUser/updateRole';
    export default {
        data(){
            return {
                isLoadData:false,
                isLoadUser:false,
                typeForm:{},
                typeFormData:{},
                account:'',
                selectedOrgData:{},
                //用户表单
                userEditForm:{},
                //重置密码表单
                resetPwForm:{},
                resetPwFormData:{},
                userModal:{
                    isNew:true,
                    visible:false,
                    modal_loading:false,
                    formDate:{},
                },
                resetPwModal:{
                    visible:false,
                    modal_loading:false,
                },
                companyTreeListData: new this.customstore({
                    load:this.orgListData
                }),
                companyUserGridData: new this.customstore({
                    load: (loadOptions) => {
                        return this.CommDs.loadPage(loadOptions, company_user_grid_url, this.isLoadUser, {type:this.selectedOrgData.orgType});
                    },
                }),
                roleTreeListData: new this.customstore({
                    key:'id',
                    // load: (loadOptions)=> {
                    //     return this.CommDs.loadList(role_list_url);
                    // },
                    load:this.roleGridListData
                }),
            }
        },
        mounted(){
            var that = this;
            this.account = Cookie.get('user');

            //公司网格
            this.companyTreeList = $('#company-grid').dxTreeList({
                searchPanel: {
                    visible: true,
                    width: 200,
                    placeholder: '查找...'
                },
                height: 400,
                keyExpr: 'id',
                onContentReady:(e)=> {
                    e.component.selectRowsByIndexes([0]);
                },
                dataSource: {
                    store: this.companyTreeListData
                },
                onSelectionChanged: (e)=>{
                    if (e.selectedRowKeys.length > 0) {
                        this.isLoadUser = true;
                        this.userBtnPart.items[0].enabled = true;
                        this.selectedOrgData = e.selectedRowKeys[0];
                        var searchData = {};
                        searchData.orgId = this.selectedOrgData;
                        this.userGrid.getDataSource().loadOptions().searchData = searchData;
                        this.userGrid.refresh();
                    }
                    else {
                        this.isLoadUser = false;
                        this.userBtnPart.items[0].enabled = false;
                        this.userGrid.getDataSource().loadOptions().searchData = null;
                        this.userGrid.refresh();
                    }
                },
                showBorders: true,
                parentIdExpr: 'parentId',
                selection: {
                    mode: 'single'
                },
                remoteOperations: {
                    filtering: false,
                    sorting: false,
                },
                columns: [
                    {
                        dataField: 'orgName',
                        caption: '机构名称'
                    }
                ],
                // expandedRowKeys: [3],
                showRowLines: true,
                columnAutoWidth: true
            }).dxTreeList('instance');

            //公司用户网格
            this.userGrid = $("#user-grid").dxDataGrid({
                keyExpr: "id",
                showRowLines: true,
                showBorders: true,
                allowColumnReordering: true,
                allowColumnResizing: true,
                columnAutoWidth: true,
                searchPanel: {
                    visible: true,
                    width: 200,
                    placeholder: '查找...'
                },
                onContentReady:(e)=>{
                    e.component.selectRowsByIndexes([0]);
                },
                onToolbarPreparing: (e) => {
                    e.toolbarOptions.items.unshift({
                        location: "before",
                        template: () => {
                            return $('<div id=\'user-btn\'/>');
                        }
                    });
                },
                onSelectionChanged: (e) => {
                    if (e.selectedRowKeys.length > 0) {
                        this.roleListData(e.selectedRowKeys[0].id)
                    }
                    else {
                        this.roleTreeList.deselectAll();
                    }
                },
                columnFixing: {
                    enabled: true
                },
                selection: {
                    mode: "single"
                },
                hoverStateEnabled: true,
                dataSource: {
                    store: this.companyUserGridData
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
                        width: 220,
                        alignment: "center",
                        // fixed: true,
                        allowResizing: false,
                        allowFiltering: false,
                        allowSorting: false,
                        cellTemplate: (container, options) => {
                            //操作列
                            container.append("<div id='removeRoleBtn'/>");
                            var opcol = new (Vue.component('OpCol'));
                            if(this.account != options.data.account){
                                opcol.items = [
                                    { text: '编辑', showtip: false, id: options.data, click:this.edit},
                                    { text: '重置密码', showtip: true, tip: '您确认重置密码吗?', id: options.data, click:this.resetPwd},
                                    { text: '删除', showtip: true, color:'#ff9900', tip: '您确认删除吗?', id: options.data, click:this.userDel},
                                ];
                            }else{
                                opcol.items = [
                                    { text: '编辑', showtip: false, id: options.data, click:this.edit},
                                    { text: '重置密码', showtip: true, tip: '您确认重置密码吗?', id: options.data, click:this.resetPwd},
                                ];
                            }
                            if(options.data.status == 0){
                                opcol.items.push({ text: '启用', showtip: false, color:'#19be6b', id: options.data,extra:'Y', click:this.updateStatus})
                            }else if(options.data.status == 1){
                                opcol.items.push({ text: '停用', showtip: true, color:'#ff9900', tip: '您确认停用吗?', id: options.data,extra:'N', click:this.updateStatus})
                            }
                            opcol.$mount('#removeRoleBtn');
                        }
                    },
                    {
                        caption: "账号",
                        dataField: "account",
                        sortOrder:'asc',
                    },
                    {
                        caption: "姓名",
                        dataField: "name",
                        allowSorting: false,
                    },
                    {
                        caption: "手机",
                        dataField: "mobile",
                        allowSorting: false,
                    },
                    {
                        caption: "创建时间",
                        dataField: "createTime",
                        dataType:"datetime",
                        format:"yyyy-MM-dd HH:mm",
                    },
                    {
                        caption: "状态 ",
                        dataField: "status",
                        allowSorting: false,
                        alignment: "center",
                        cellTemplate: (container, options) => {
                            container.append("<div id='statusBadge'/>");
                            var badgeStatus = new (Vue.component('BadgeStatus'));
                            badgeStatus.dataSource=this.enum.status;
                            badgeStatus.displayExpr='text';
                            badgeStatus.valueExpr='id';
                            badgeStatus.value=options.data.status;
                            badgeStatus.$mount('#statusBadge');
                        }
                    },
                ]
            }).dxDataGrid("instance");

            //用户表单
            this.userEditForm = $("#editUserForm").dxForm({
                colCount:2,
                formData:this.userModal.formDate,
                items:[
                    {
                        dataField: "account",
                        label: {
                            alignment: "right",
                            text: "账号"
                        },
                        editorOptions:{
                            placeholder: '<系统自动生成>',
                            disabled:true,
                        }
                    },
                    {
                        dataField: "name",
                        label: {
                            alignment: "right",
                            text: "姓名"
                        },
                        editorOptions:{
                            maxLength:20
                        },
                        validationRules: [{
                            type:"required",
                            message: "请输入姓名"
                        }]
                    },
                    {
                        dataField: "mobile",
                        label: {
                            alignment: "right",
                            text: "手机"
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
            }).dxForm("instance");

            //重置密码表单
            this.resetPwForm = $("#resetPwForm").dxForm({
                colCount:2,
                formData:this.resetPwFormData,
                onFieldDataChanged:(e)=> {
                    //密码验证
                    if(e.dataField==="newPwd"){
                        var rules = e.component.itemOption('newPwd').validationRules;
                        rules.push({
                            type: "compare",
                            comparisonTarget: function() {
                                if(that.resetPwFormData.newPwd = that.resetPwFormData.newPass)
                                {
                                    return that.resetPwFormData.newPwd
                                }else{
                                    return that.resetPwFormData.newPass;
                                }
                            },
                            message: "两次输入的密码不一致"
                        });
                        e.component.itemOption('newPwd').validationRules = rules;
                    }
                },
                items:[
                    {
                        dataField: "name",
                        label: {
                            alignment: "right",
                            text: "用户名"
                        },
                        editorOptions:{
                            readOnly:true,
                        }
                    },
                    {
                        dataField: "newPass",
                        label: {
                            alignment: "right",
                            text: "新密码"
                        },
                        editorOptions:{
                            maxLength:15
                        },
                        validationRules: [{
                            type:"required",
                            message: "请输入新密码"
                        }]
                    },
                    {
                        dataField: "newPwd",
                        label: {
                            alignment: "right",
                            text: "确认密码"
                        },
                        editorOptions:{
                            maxLength:15
                        },
                        validationRules: [{
                            type:"required",
                            message: "请确认密码"
                        }]
                    }
                ]
            }).dxForm("instance");

            this.typeForm = $("#typeForm").dxForm({
                colCount: 1,
                formData: this.typeFormData,
                items: [
                    {
                        dataField: "type",
                        editorType: "dxSelectBox",
                        editorOptions: {
                            dataSource: this.enum.orgType,
                            displayExpr: "text",
                            valueExpr: "id",
                            onValueChanged:(e)=>{
                                if (e.value != null){
                                    this.isLoadData = true;
                                    this.companyTreeList.getDataSource().loadOptions().searchData = {type:e.value};
                                    this.companyTreeList.refresh();
                                    this.roleTreeList.getDataSource().loadOptions().searchData = {roleType:e.value,status:1};
                                    this.roleTreeList.refresh();
                                }
                            }
                        },
                        label: {
                            alignment: "right",
                            text: "类型"
                        },
                    },
                ]
            }).dxForm("instance");

            this.roleTreeList = $('#role-tree').dxDataGrid({
                showRowLines: true,
                columnAutoWidth: true,
                height: 400,
                keyExpr: 'id',
                searchPanel: {
                    visible: true,
                    width: 200,
                    placeholder: '查找...'
                },
                onToolbarPreparing: (e) => {
                    e.toolbarOptions.items.unshift({
                        location: "before",
                        template: () => {
                            return $('<div id=\'role-btn\'/>');
                        }
                    });
                },
                dataSource: {
                    store: this.roleTreeListData
                },
                onSelectionChanged: (e)=>{
                    if (e.selectedRowKeys.length > 0) {
                        if(this.userGrid.getSelectedRowsData().length != 0){
                            this.roleBtnPart.items[0].enabled = true
                        }
                    }
                    else {
                        this.roleBtnPart.items[0].enabled = false
                    }
                },
                showBorders: true,
                parentIdExpr: 'parentId',
                selection: {
                    mode: "multiple",
                    recursive: true,
                    showCheckBoxesMode: 'always'
                },
                remoteOperations: {
                    filtering: false,
                    sorting: false,
                },
                columns: [
                    {
                        dataField: 'roleName',
                        allowSorting: false,
                        caption: '角色名称'
                    },
                    {
                        dataField: 'remark',
                        allowSorting: false,
                        caption: '备注'
                    }
                ],
            }).dxDataGrid('instance');

            this.userBtnPart = new (Vue.component('CommandBtns'))();
            this.userBtnPart.items = [
                { id: 1, text: '新增', type: "primary", enabled: false, click:this.addUser},
            ];
            this.userBtnPart.$mount('#user-btn');
            this.userBtnPart.$parent = this;

            this.roleBtnPart = new (Vue.component('CommandBtns'))();
            this.roleBtnPart.items = [
                { id: 1, text: '保存角色', type: "primary", enabled: false, click:this.addRole},
            ];
            this.roleBtnPart.$mount('#role-btn');
            this.roleBtnPart.$parent = this;

            this.userInit()
        },
        methods:{
            userInit(){
                this.typeFormData = {};
                this.typeFormData.type = 1;
                this.typeForm.option('formData',this.typeFormData);
            },
            //新增用户
            addUser(){
                this.userModal.isNew = true;
                this.userModal.formDate = {};
                this.userModal.formDate.status = 1;
                this.userEditForm.option('formData', this.userModal.formDate);
                this.userModal.visible = true;
            },

            //编辑用户
            edit(data){
                this.userModal.isNew = false;
                this.userModal.formDate = data;
                this.userEditForm.itemOption('account', 'editorOptions', { readOnly: true });
                this.userEditForm.option('formData', this.userModal.formDate);
                this.userModal.visible = true;
            },

            //重置密码
            resetPwd(data){
                this.resetPwFormData = data;
                this.resetPwForm.option('formData', this.resetPwFormData);
                this.resetPwModal.visible = true;
            },

            //删除用户
            userDel(data){
                let params = {};
                if(data.status == 1){
                    this.warn('请先停用该用户再删除');
                    return;
                }
                params.id = data.id;
                params.orgId = this.selectedOrgData;
                params.enable = 0;
                this.$post(user_update_url, params).then(res => {
                    if (res.code == '200') {
                        this.success('删除成功!', () => {
                            this.userGrid.refresh();
                        });
                    } else {
                        // 提示信息
                        this.warn(res.msg);
                    }
                }).catch(err => {
                    this.error(err);
                });
            },

            //用户表单提交
            userEditFormSubmit(){
                let params = {};
                this.userModal.modal_loading = true;
                if(!this.userEditForm.validate().isValid)
                {
                    this.userModal.modal_loading=false;
                    return;
                }
                this.userModal.formDate.type = this.typeFormData.type;
                this.userModal.formDate.orgId = this.selectedOrgData;
                params = this.userModal.formDate;
                this.$post(user_update_url,params).then(res => {
                    if(res.code=='200')
                    {
                        this.success('保存成功!',()=>{
                            this.userModal.modal_loading =false;
                            this.userModal.visible=false;
                            //刷新网格
                            this.userGrid.refresh();

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
                this.userModal.modal_loading =false;
            },

            //重置密码表单提交
            resetPwSubmit(){
                let params = {};
                this.resetPwModal.modal_loading = true;
                if(!this.resetPwForm.validate().isValid)
                {
                    this.resetPwModal.modal_loading=false;
                    return;
                }
                params.id = this.resetPwFormData.id;
                params.password = this.resetPwFormData.newPass;
                this.$post(reset_pwd_url,params).then(res => {
                    if(res.code=='200')
                    {
                        this.success('保存成功!',()=>{
                            this.resetPwModal.modal_loading =false;
                            this.resetPwModal.visible=false;
                            this.userGrid.refresh();
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
                this.resetPwModal.modal_loading =false;
            },

            //表单取消
            editFormCancel(){
                this.userModal.visible = false;
                this.resetPwModal.visible = false;
            },

            orgListData(loadOptions){
                var deferred = $.Deferred(),
                    params = {};
                if(this.isLoadData){
                    params.orgType = loadOptions.searchData.type;
                    this.$put(company_list_url, params).then(res => {
                        if (res.code == '200') {
                            deferred.resolve(res.rows);
                        }
                        else {
                            deferred.resolve([]);
                            this.warn(res.msg);
                        }
                    }).catch(err => {
                        deferred.resolve([]);
                        this.error(err);
                    });
                }else{
                    deferred.resolve([]);
                }
                return deferred.promise();
            },

            roleListData(userId){
                this.roleTreeList.deselectAll();
                let selectKeys = [];
                this.$put(user_role_list_url, {userId:userId}).then(res => {
                    if (res.code == '200') {
                        res.rows.forEach(function (key) {
                            selectKeys.push(key.id);
                        });
                        this.roleTreeList.option('selection', {
                            mode: "multiple",
                            recursive: false
                        });
                        this.roleTreeList.selectRows(selectKeys, false);

                        this.roleBtnPart.items[0].enabled = false;
                    }
                    else {
                        this.warn(res.msg);
                    }
                }).catch(err => {
                    this.error(err);
                });
            },

            roleGridListData(loadOptions){
                let deferred = $.Deferred();
                this.$put(role_list_url, loadOptions.searchData).then(res => {
                    if (res.code == '200') {
                        deferred.resolve(res.rows);
                    }
                    else {
                        deferred.resolve([]);
                        this.warn(res.msg);
                    }
                }).catch(err => {
                    deferred.resolve([]);
                    this.error(err);
                });
                return deferred.promise();
            },

            addRole(){
                let params = {};
                params.userId = this.userGrid.getSelectedRowKeys()[0].id;
                params.ids = this.roleTreeList.getSelectedRowKeys();
                this.$post(user_insert_role_url,params).then(res => {
                    if(res.code=='200')
                    {
                        this.success('保存成功!',()=>{
                            this.userGrid.refresh();
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
            updateStatus(data,extra){
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
                            this.userGrid.refresh();
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
