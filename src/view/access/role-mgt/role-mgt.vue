<style lang="less">
    @import "../../../styles/common.less";
</style>
<template>
    <div>
        <Card dis-hover>
            <Row :gutter="10" class="margin-top-10">
                <!--角色网格-->
                <Col :md="24" :lg="16">
                    <Card dis-hover>
                        <Row>
                            <Searchpanel ref="searchPanel">
                                <div slot="form" id="searchform"></div>
                                <div slot="control">
                                    <Button type="primary" @click="search">查询</Button>
                                    <Button @click="resetSearch" class="margin-left-5">重置</Button>
                                </div>
                            </Searchpanel>
                        </Row>
                        <Row class="margin-top-10">
                            <div id="role-grid"></div>
                        </Row>
                    </Card>
                    <Card dis-hover class="margin-top-10">
                        <Row>
                            <div id="rolerights-treelist"></div>
                        </Row>
                    </Card>
                </Col>
                <!--人员网格-->
                <Col :md="24" :lg="8">
                    <Card dis-hover>
                        <Row>
                            <div id="role-user-grid"></div>
                        </Row>
                    </Card>
                </Col>
            </Row>
        </Card>
        <!--新增编辑角色-->
        <Modal v-model="roleModal.visible" :mask-closable="false" width="650" title="编辑数据">
            <p slot="header">
                <span v-if="roleModal.isNew">新增角色</span>
                <span v-else="roleModal.isNew">编辑角色</span>
            </p>
            <div id="editRoleForm"></div>
            <div slot="footer">
                <Button type="text" @click="editFormCancel">取消</Button>
                <Button type="primary" :loading="roleModal.modal_loading" @click="roleEditFormSubmit">保存</Button>
            </div>
        </Modal>
        <!--新增编辑角色用户-->
        <Modal v-model="roleUserModal.visible" :mask-closable="false" width="450" title="编辑数据">
            <p slot="header">
                <span>分配用户</span>
            </p>
            <div id="editRoleUserForm"></div>

            <div slot="footer">
                <Button type="text" @click="editFormCancel">取消</Button>
                <Button type="primary" :loading="roleUserModal.modal_loading" @click="roleUserEditFormSubmit">保存
                </Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    import Vue from 'vue';
    //角色网格
    let role_grid_data_url = '/sys/role/page';
    //角色用户网格
    let roleuser_grid_data_url = '/sys/sysUser/getUserByRole';
    //新增角色
    let role_insert_url = '/sys/role/update';
    //删除角色
    let del_role_url = '/sys/role/delete';
    //新增角色用户
    let role_user_insert_url = '/sys/role/insertRoleUser';
    //删除角色用户
    let del_role_user_url = '/sys/role/deleteRoleUser';
    //用户详情
    let userListByKeyUrl = '/sys/sysUser/detail';
    //用户列表
    let user_list_url = '/sys/sysUser/getUserByRole';
    //获取模块
    let role_func_data_url = '/sys/func/list';
    //权限保存
    let role_assign_url = '/sys/role/updateFunc';
    //获取角色权限
    let role_rights_assigned_url = '/sys/role/getFuncByRole';
    export default {
        data() {
            return {
                selectKeys:[],
                userIds: [],
                unAssignUserPart: {},
                //选中角色信息
                selectedRoleData: {},
                batchRemoveEnabled: false,
                //搜索表单
                searchForm: {},
                //搜索表单数据
                searchFormData: {},
                //新增角色模态框
                editRoleForm: {},
                editRoleFormData: {},
                //分配用户表单
                editRoleUserForm: {},
                editRoleUserFormData: {},
                roleRightsChanged: false,
                //加载数据flag
                isLoadRoleUserData: false,
                isLoadData: true,
                //角色显示模态窗体
                roleModal: {
                    isNew: true,
                    visible: false,
                    modal_loading: false,
                    formData: {},
                },
                //新增角色用户模态框
                roleUserModal: {
                    visible: false,
                    modal_loading: false,
                },
                //角色网格远程数据
                roleGridData: new this.customstore({
                    load: (loadOptions) => {
                        return this.CommDs.loadPage(loadOptions, role_grid_data_url, this.isLoadData, {});
                    },
                }),
                //角色用户网格远程数据
                roleUserGridData: new this.customstore({
                    load: this.loadRoleUserData
                }),
                //用户
                userListData: new this.customstore({
                    key: "id",
                    byKey: (key) => {
                        return this.CommDs.loadByKey(userListByKeyUrl, {id: key});
                    },
                    // load: (e) => {
                    //     return this.CommDs.loadList(user_list_url);
                    // }
                    load: this.loadUserData
                }),

            }
        },
        mounted() {
            let _this = this;
            //搜索表单
            this.searchForm = $("#searchform").dxForm({
                colCount: 4,
                formData: this.searchFormData,
                items: [
                    {
                        dataField: "roleName",
                        label: {
                            alignment: "right",
                            text: "角色名称"
                        },

                    },
                    {
                        dataField: "status",
                        editorType: "dxSelectBox",
                        editorOptions: {
                            dataSource: this.enum.status,
                            displayExpr: "text",
                            valueExpr: "id",
                        },
                        label: {
                            alignment: "right",
                            text: "状态"
                        },
                    },
                ]
            }).dxForm("instance");

            //角色网格
            this.roleGrid = $("#role-grid").dxDataGrid({
                showRowLines: true,
                showBorders: true,
                allowColumnReordering: true,
                allowColumnResizing: true,
                columnAutoWidth: true,
                rowAlternationEnabled: true,
                onContentReady: (e) => {
                    e.component.selectRowsByIndexes([0]);
                },
                onToolbarPreparing: (e) => {
                    e.toolbarOptions.items.unshift({
                        location: "before",
                        template: () => {
                            return $('<div id=\'role-btn\'/>');
                        }
                    });
                },
                onSelectionChanged: (e) => {
                    if (e.selectedRowKeys.length > 0) {
                        this.userIds = [];
                        if(e.selectedRowKeys[0].status == 1){
                            this.roleUserBtnPart.items[0].enabled = true;
                        }else{
                            this.roleUserBtnPart.items[0].enabled = false;
                        }
                        this.selectedRoleData = e.selectedRowKeys[0];
                        let searchData = {};
                        searchData.roleId = this.selectedRoleData.id;
                        this.roleuserGrid.getDataSource().loadOptions().searchData = searchData;
                        this.roleuserGrid.refresh();
                        //获取角色权限信息,选中
                        this.treeListSelection(this.selectedRoleData.id,this.selectedRoleData.roleType);
                    }
                    else {
                        this.roleUserBtnPart.items[0].enabled = false;
                        this.roleuserGrid.getDataSource().loadOptions().searchData = null;
                        this.roleuserGrid.refresh();
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
                    store: this.roleGridData
                },
                remoteOperations: {
                    sorting: true,
                    paging: true
                },
                paging: {
                    pageSize: 10
                },
                // pager: {
                //     showPageSizeSelector: true,
                //     allowedPageSizes: [10, 20, 50]
                // },
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
                                {text: '编辑', showtip: false, id: options.data, click: this.roleEdit},
                                {
                                    text: '删除',
                                    color: '#ff9900',
                                    showtip: true,
                                    tip: '您确认删除该角色吗？',
                                    id: options.data,
                                    click: this.roleDell
                                },
                            ];
                            if(options.data.status == 0){
                                opcol.items.push({ text: '启用', showtip: false, color:'#19be6b', id: options.data,extra:'Y', click:this.updateStatus})
                            }else if(options.data.status == 1){
                                opcol.items.push({ text: '停用', showtip: true, color:'#ff9900', tip: '您确认停用吗?', id: options.data,extra:'N', click:this.updateStatus})
                            }
                            opcol.$mount('#t1');
                        },
                        width: 150,
                    },
                    {
                        caption: "编码",
                        dataField: "roleCode",
                        sortOrder: "asc",
                        width: 80,
                    },
                    {
                        caption: "角色名称",
                        dataField: "roleName",
                        allowSorting: false,
                        width:150
                    },
                    {
                        caption: "角色类型",
                        dataField: "roleType",
                        allowSorting: false,
                        lookup: {
                            dataSource: this.enum.roleType,
                            displayExpr: 'text',
                            valueExpr: 'id'
                        },
                        width:100
                    },
                    {
                        caption: "创建时间",
                        dataField: "createTime",
                        width: 150
                    },
                    {
                        caption: "修改时间",
                        dataField: "updateTime",
                        width: 150
                    },
                    {
                        caption: "是否启用",
                        dataField: "status",
                        alignment: "center",
                        allowSorting: false,
                        lookup: {
                            dataSource: this.enum.status,
                            displayExpr: 'text',
                            valueExpr: 'id'
                        },
                        width: 80
                    },
                    {
                        caption: "备注",
                        dataField: "remark",
                        allowSorting: false,
                    },
                ]
            }).dxDataGrid("instance");

            //角色权限treeList
            this.roleRightsTreelist = $("#rolerights-treelist").dxTreeList({
                keyExpr: 'id',
                columnAutoWidth: true,
                wordWrapEnabled: true,
                showBorders: true,
                parentIdExpr: "parentId",
                autoExpandAll: true,
                selection: {
                    mode: "multiple",
                    recursive: true
                },
                onCellClick: (e) => {
                    // console.log(this.roleRightsTreelist.getNodeByKey(e.data.id))
                    // this.roleRightsTreelist.deselectAll();
                    // let node = this.roleRightsTreelist.getNodeByKey(e.data.id);
                    // if(this.selectKeys.indexOf(e.data.id) < 0){
                    //     this.selectKeys.push(e.data.id);
                    //     if(e.data.parentId){
                    //         let brother = node.parent.children,num = 0;
                    //         // brother.forEach(item =>{
                    //         //     if(this.selectKeys.indexOf(item.key)>=0){
                    //         //         num++;
                    //         //     }
                    //         // })
                    //         // if(num == brother.length){
                    //         //     this.selectKeys.push(this.roleRightsTreelist.getNodeByKey(e.data.id).parent.key);
                    //         // }
                    //         if(this.selectKeys.indexOf(node.parent.key)<0){
                    //             this.selectKeys.push(node.parent.key)
                    //         }
                    //     }else{
                    //         let children = node.children;
                    //         children.forEach(item =>{
                    //             if(this.selectKeys.indexOf(item.key)<0){
                    //                 this.selectKeys.push(item.key)
                    //             }
                    //         })
                    //     }
                    // }else{
                    //     this.selectKeys.splice(this.selectKeys.indexOf(e.data.id),1);
                    //     if(e.data.parentId){
                    //         let brother = node.parent.children,num = 0;
                    //         brother.forEach(item =>{
                    //             if(this.selectKeys.indexOf(item.key)<0){
                    //                 num++;
                    //             }
                    //         })
                    //         if(num == brother.length){
                    //             this.selectKeys.splice(this.selectKeys.indexOf(node.parent.key),1)
                    //         }
                    //     }else{
                    //         let children = node.children;
                    //         children.forEach(item =>{
                    //             if(this.selectKeys.indexOf(item.key)>=0){
                    //                 this.selectKeys.splice(this.selectKeys.indexOf(item.key),1)
                    //             }
                    //         })
                    //     }
                    // }

                    this.roleRightsTreelist.option('selection', {
                        mode: "multiple",
                        recursive: true,
                    });
                    // this.roleRightsTreelist.selectRows(this.selectKeys, false);
                },
                onSelectionChanged: (e) => {
                    if (this.selectedRoleData) {
                        this.roleRightsBtnPart.items[0].enabled = true;
                    }
                    ;
                },
                dataSource:
                    new this.customstore({
                        // loadMode: "raw",
                        load: (loadOptions) => {
                            return this.CommDs.loadList(role_func_data_url);
                        }
                    }),
                searchPanel: {
                    visible: true,
                    width: 200,
                    placeholder: '查找...'
                },
                remoteOperations: {
                    filtering: false,
                    sorting: false,
                    paging: false
                },
                height: 400,
                onToolbarPreparing: (e) => {
                    e.toolbarOptions.items.unshift({
                        location: "before",
                        template: () => {
                            return $('<div id=\'rolerights-btn\'/>');
                        }
                    });
                },
                columns: [
                    {
                        dataField: 'funcCode',
                        caption: '模块编码',
                        // sortOrder: "asc",
                        alignment: 'left',
                        width: 200,
                    },
                    {
                        dataField: 'funcName',
                        caption: '模块名称',
                        allowSorting: false,
                    },
                    {
                        dataField: 'remark',
                        caption: '备注',
                        allowSorting: false,
                    }
                ],
            }).dxTreeList("instance");

            //人员网格
            this.roleuserGrid = $("#role-user-grid").dxDataGrid({
                // keyExpr: "userId",
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
                onToolbarPreparing: (e) => {
                    e.toolbarOptions.items.unshift({
                        location: "before",
                        template: () => {
                            return $('<div id=\'roleuser-btn\'/>');
                        }
                    });
                },
                columnFixing: {
                    enabled: true
                },
                selection: {
                    mode: "single"
                },
                hoverStateEnabled: true,
                dataSource: {
                    store: this.roleUserGridData
                },
                remoteOperations: {
                    sorting: false,
                    paging: false
                },
                paging: {
                    pageSize: 10
                },
                columns: [
                    {
                        caption: "操作",
                        width: 50,
                        alignment: "center",
                        allowResizing: false,
                        allowFiltering: false,
                        allowSorting: false,
                        cellTemplate: (container, options) => {
                            container.append("<div id='rub'/>");
                            let opcol = new (Vue.component('OpCol'));
                            opcol.items = [
                                {
                                    text: '删除',
                                    showtip: true,
                                    color: '#ff9900',
                                    tip: '您确认从此角色删除该账号吗?',
                                    id: options.data,
                                    click: this.roleUserCellDel
                                },
                            ];
                            opcol.$mount('#rub');
                        }
                    },
                    {
                        caption: "账号",
                        dataField: "account",
                        width: 100
                    },
                    {
                        caption: "用户",
                        dataField: "userName",
                        allowSorting: false,
                        width: 100
                    },
                    {
                        caption: "机构",
                        dataField: "orgName",
                        allowSorting: false,
                    },
                ]
            }).dxDataGrid("instance");

            //新增角色表单
            this.editRoleForm = $("#editRoleForm").dxForm({
                colCount: 2,
                formData: this.roleModal.formData,
                items: [
                    {
                        dataField: "roleCode",
                        editorOptions: {
                            placeholder: '<系统自动分配>',
                            disabled: true,
                        },
                        label: {
                            alignment: "right",
                            text: "角色编码"
                        },
                    },
                    {
                        dataField: "roleName",
                        label: {
                            alignment: "right",
                            text: "角色名称"
                        },
                        editorOptions: {
                            maxLength: 50
                        },
                        validationRules: [{
                            type: "required",
                            message: "请输入角色名称"
                        }]
                    },
                    {
                        dataField: "roleType",
                        editorType: "dxSelectBox",
                        editorOptions: {
                            dataSource: this.enum.roleType,
                            displayExpr: "text",
                            valueExpr: "id",
                        },
                        label: {
                            alignment: "right",
                            text: "角色类型"
                        },
                        validationRules: [{
                            type: "required",
                            message: "请选择角色类型"
                        }]
                    },
                    {
                        dataField: "status",
                        editorType: "dxSelectBox",
                        editorOptions: {
                            dataSource: this.enum.status,
                            displayExpr: "text",
                            valueExpr: "id",
                        },
                        label: {
                            alignment: "right",
                            text: "是否启用"
                        },
                        validationRules: [{
                            type: "required",
                            message: "请选择是否启用"
                        }]
                    },
                    {
                        dataField: "remark",
                        colSpan: 2,
                        editorType: "dxTextArea",
                        editorOptions: {
                            height: 80,
                            maxLength: 200
                        },
                        label: {
                            alignment: "right",
                            text: "备注"
                        },
                    }
                ]
            }).dxForm("instance");

            //分配用户表单
            this.editRoleUserForm = $("#editRoleUserForm").dxForm({
                formData: this.editRoleUserFormData,
                items: [
                    {
                        dataField: "ids",
                        editorType: "dxDropDownBox",
                        label: {
                            alignment: "right",
                            text: "选择账号"
                        },
                        validationRules: [{
                            type: 'required',
                            message: '请选择账号'
                        }],
                        editorOptions: {
                            dropDownOptions: {width: 550},
                            placeholder: '选择账号',
                            showClearButton: true,
                            valueExpr: "id",
                            displayExpr: 'account',
                            dataSource: this.userListData,
                            contentTemplate: (e) => {
                                let value = e.component.option('value');
                                let grid = $('<div>').dxDataGrid({
                                    dataSource: e.component.option('dataSource'),
                                    searchPanel: {
                                        visible: true,
                                        width: 150,
                                        placeholder: '查找...'
                                    },
                                    columns: [
                                        {
                                            caption: '账号',
                                            dataField: 'account',
                                            width: 70
                                        },
                                        {
                                            caption: '用户名',
                                            dataField: 'userName',
                                            allowSorting: false,
                                        },
                                        {
                                            caption: '机构',
                                            dataField: 'orgName',
                                            allowSorting: false,
                                        },
                                    ],
                                    hoverStateEnabled: true,
                                    scrolling: {mode: 'infinite'},
                                    paging: {enabled: true, pageSize: 10},
                                    // filterRow: { visible: true },
                                    height: 300,
                                    selection: {
                                        allowSelectAll: true,
                                        mode: 'multiple',
                                        showCheckBoxesMode: 'always'
                                    },
                                    selectedRowKeys: [value],
                                    onSelectionChanged: (selectedItems) => {
                                        let keys = selectedItems.selectedRowKeys;
                                        let hasSelection = keys.length;

                                        e.component.option("value", keys);
                                    }
                                });
                                let instance = grid.dxDataGrid('instance');
                                e.component.on("valueChanged", function (args) {
                                    instance.selectRows(args.value, false);
                                    // e.component.close();
                                });
                                _this['grid_user'] = instance;
                                return grid;
                            }
                        },
                    }
                ]
            }).dxForm("instance");

            this.roleBtnPart = new (Vue.component('CommandBtns'))();
            this.roleBtnPart.items = [
                {id: 1, text: '新增角色', type: "primary", enabled: true, click: this.addRole},
            ];
            this.roleBtnPart.$mount('#role-btn');
            this.roleBtnPart.$parent = this;

            this.roleUserBtnPart = new (Vue.component('CommandBtns'))();
            this.roleUserBtnPart.items = [
                {id: 1, text: '分配账号', type: "primary", enabled: false, click: this.addRoleUser},
                // { id: 2, text: '批量移除', enabled: !this.batchRemoveEnabled, },
            ];
            this.roleUserBtnPart.$mount('#roleuser-btn');
            this.roleUserBtnPart.$parent = this;

            this.roleRightsBtnPart = new (Vue.component('CommandBtns'))();
            this.roleRightsBtnPart.items = [
                {id: 1, text: '保存权限', type: "primary", enabled: false, click: this.rightEdit},
            ];
            this.roleRightsBtnPart.$mount('#rolerights-btn');
            this.roleRightsBtnPart.$parent = this;
        },
        methods: {
            //搜索
            search() {
                let ds = this.roleGrid.getDataSource();
                ds.loadOptions().searchData = this.searchFormData;
                ds.reload();
            },

            //重置
            resetSearch: function () {
                this.searchForm.resetValues();
                this.roleGrid.refresh();
            },

            //新增角色
            addRole: function () {
                this.roleModal.isNew = true;
                this.roleModal.formData = {};
                this.roleModal.formData.status = 1;
                this.editRoleForm.option('formData', this.roleModal.formData);
                this.roleModal.visible = true;
            },

            //删除角色
            roleDell: function (data) {
                let params = {}, p_data = {};
                if (data.status == 1) {
                    this.warn('先停用该角色，再删除');
                    return;
                }
                p_data.roleId = data.id;
                params.data = p_data;
                this.$del(del_role_url, params).then(res => {
                    if (res.code == '200') {
                        this.success('删除成功!', () => {
                            this.roleGrid.refresh();
                        });
                    } else {
                        // 提示信息
                        this.warn(res.msg);
                    }
                }).catch(err => {
                    this.error(err);
                });
            },

            //编辑角色
            roleEdit: function (data) {
                this.roleModal.isNew = false;
                this.roleModal.formData = data;
                this.editRoleForm.itemOption('roleCode', 'editorOptions', {readOnly: true});
                this.editRoleForm.option('formData', this.roleModal.formData);
                this.roleModal.visible = true;
            },

            //角色模态框提交
            roleEditFormSubmit: function () {
                let params = {};
                this.roleModal.modal_loading = true;
                if (!this.editRoleForm.validate().isValid) {
                    this.roleModal.modal_loading = false;
                    return;
                }
                params = this.roleModal.formData;
                this.$post(role_insert_url, params).then(res => {
                    if (res.code == '200') {
                        this.success('保存成功!', () => {
                            this.roleModal.modal_loading = false;
                            this.roleModal.visible = false;
                            //刷新网格
                            this.roleGrid.refresh();
                        });
                    }
                    else {
                        this.roleModal.modal_loading = false;
                        this.warn(res.msg);
                    }
                }).catch(err => {
                    this.roleModal.modal_loading = false;
                    this.error(err);
                });
            },

            //分配用户
            addRoleUser: function () {
                this.editRoleUserFormData = {};
                this.editRoleUserForm.option('formData', this.editRoleUserFormData);
                this.isLoadRoleUserData = true;
                if (this['grid_user']) {
                    this['grid_user'].refresh();
                }
                this.roleUserModal.visible = true;
            },

            //移除角色用户
            roleUserCellDel: function (data) {
                let params = {};
                params.userId = data.id;
                params.roleId = this.selectedRoleData.id;
                this.$post(del_role_user_url, params).then(res => {
                    if (res.code == '200') {
                        this.success('删除成功!', () => {
                            for (let i = 0; i < this.userIds.length; i++) {
                                if (this.userIds[i] == data.id) {
                                    this.userIds.splice(i, 1)
                                }
                            }
                            this.roleuserGrid.refresh();
                        });
                    } else {
                        // 提示信息
                        this.warn(res.msg);
                    }
                }).catch(err => {
                    this.error(err);
                });
            },

            //分配用户表单提交
            roleUserEditFormSubmit: function () {
                let params = {};
                this.roleUserModal.modal_loading = true;
                if (!this.editRoleUserForm.validate().isValid) {
                    this.roleUserModal.modal_loading = false;
                    return;
                }
                this.editRoleUserFormData.roleId = this.selectedRoleData.id;
                params = this.editRoleUserFormData;
                this.$post(role_user_insert_url, params).then(res => {
                    if (res.code == '200') {
                        this.success('保存成功!', () => {
                            this.roleUserModal.modal_loading = false;
                            this.roleUserModal.visible = false;
                            this.roleuserGrid.refresh();
                        });
                    }
                    else {
                        this.roleUserModal.modal_loading = false;
                        this.warn(res.msg);
                    }
                }).catch(err => {
                    this.roleUserModal.modal_loading = false;
                    this.error(err);
                });
            },

            //模态框取消
            editFormCancel: function () {
                this.roleModal.visible = false;
                this.roleUserModal.visible = false;
            },

            //加载角色用户数据
            loadRoleUserData: function (loadOptions) {
                let deferred = $.Deferred(),
                    params = {};
                if (loadOptions.searchData != null) {
                    params = loadOptions.searchData;
                    this.$put(roleuser_grid_data_url, params).then(res => {
                        if (res.code == '200') {
                            deferred.resolve(res.rows);
                            for (let i = 0; i < res.rows.length; i++) {
                                if (this.userIds.indexOf(res.rows[i].id) == -1) {
                                    this.userIds.push(res.rows[i].id)
                                }
                            }
                        }
                        else {
                            deferred.resolve([]);
                            this.warn(res.msg);
                        }
                    }).catch(err => {
                        deferred.resolve([]);
                        this.error(err);
                    });
                } else {
                    deferred.resolve([]);
                }

                return deferred.promise();
            },

            //保存权限
            rightEdit: function () {
                let selected = this.getAllSelectedNodes(this.roleRightsTreelist, this.roleRightsTreelist.getSelectedRowKeys());
                let ids = [], params = {};

                selected.forEach((key) => {
                    // ids.push({roleId:this.selectedRoleData.id,funcId:key.key});
                    ids.push(key.key);
                });
                params.roleId = this.selectedRoleData.id;
                params.ids = ids;
                this.$post(role_assign_url, params).then(res => {
                    if (res.code == '200') {
                        this.success('角色授权成功!', () => {

                        });
                    } else {
                        // 提示信息
                        this.warn(res.msg);
                    }
                }).catch(err => {
                    this.error(err);
                });
            },
            getAllSelectedNodes: function (treeListInstance, parentKeys) {
                let result = [];

                parentKeys.forEach((key) => {
                    let insertIndex = result.length,
                        node = treeListInstance.getNodeByKey(key),
                        parentNode = node.parent,
                        childKeys = node.children.map(function (child) {
                            return child.key;
                        });
                    while (parentNode.level >= 0) {
                        if (result.filter(function (nodeItem) {
                            return nodeItem.key === parentNode.key
                        }).length === 0) {

                            result.splice(insertIndex, 0, parentNode);
                            parentNode = parentNode.parent;
                            if (parentNode.level >= 0 && result.indexOf(parentNode) <= 0)
                                result.push(parentNode);

                        } else {
                            break;
                        }
                    }
                    if (result.indexOf(node) < 0)
                        result.push(node);
                    result = result.concat(this.getAllSelectedNodes(treeListInstance, childKeys));
                });
                $.unique(result);
                return result;
            },

            //获取角色权限，选中
            treeListSelection: function (roleId,type) {
                this.roleRightsTreelist.deselectAll();
                let params = {roleId: roleId, funcType:type, pageSize: 100};
                let selectKeys = [];
                this.$put(role_rights_assigned_url, params).then(res => {
                    if (res.code === '200') {
                        // console.log(res);
                        res.rows.forEach(function (key) {
                            selectKeys.push(key.id);
                        });
                        this.selectKeys = selectKeys;
                        this.roleRightsTreelist.option('selection', {
                            mode: "multiple",
                            recursive: false
                        });
                        this.roleRightsTreelist.selectRows(selectKeys, false);

                        this.roleRightsBtnPart.items[0].enabled = false;
                    } else {
                        this.warn(res.msg);
                    }
                }).catch(err => {
                    this.error(err);
                });
            },

            loadUserData: function (loadOptions) {
                let deferred = $.Deferred(),
                    params = {};
                if (!this.isLoadRoleUserData) {
                    deferred.resolve([]);
                } else {
                    if (this.userIds.length != 0) {
                        params.ids = this.userIds;
                    }
                    params.type = this.selectedRoleData.roleType;
                    this.$put(user_list_url, params).then(res => {
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
                }
                return deferred.promise();
            },
            updateStatus(data,extra){
                let params = {};
                params.id = data.id;
                if(extra == 'Y'){
                    params.status = 1;
                }else{
                    params.status = 0;
                }
                this.$post(role_insert_url,params).then(res => {
                    if(res.code=='200')
                    {
                        this.success('保存成功!',()=>{
                            this.roleGrid.refresh();
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
