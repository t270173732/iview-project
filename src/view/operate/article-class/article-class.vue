<style lang="less">
    @import "../../../styles/common.less";
</style>
<template>
    <div>
        <Card dis-hover>
            <Row>
                <Searchpanel ref="searchPanel">
                    <div slot="form" class="margin-bottom-3" id="searchFrom">
                    </div>
                    <div slot="control">
                        <Button type="primary" @click="search">查询</Button>
                        <Button @click="resetSearch">重置</Button>
                    </div>
                </Searchpanel>
            </Row>
            <Row class="margin-top-10">
                <div id="class-grid"></div>
            </Row>
        </Card>
        <Modal v-model="modal.visible" :mask-closable="false" width="650" title="编辑数据">
            <p slot="header">
                <span v-if="modal.isNew">新增分类</span>
                <span v-else="modal.isNew">编辑分类</span>
            </p>
            <div id="editForm"></div>
            <div slot="footer">
                <Button type="text" @click="editFormCancel">取消</Button>
                <Button type="primary" :loading="modal.modal_loading" @click="formSubmit">保存</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    import Vue from 'vue';
    import Tag from './tag';
    import Image from './image';
    let class_grid_url = '/biz/bizContentClass/read/page';
    let del_class_url = '/biz/bizContentClass/deleteClass';
    let class_insert_url = '/biz/bizContentClass/updateContentClass';
    let status_update_url = '/biz/bizContentClass/updateStatus';
    export default {
        data(){
            return{
                searchFrom: {},
                searchFormData: {},
                editForm:{},
                editFormData:{},
                isLoadData:true,
                modal:{
                    isNew:true,
                    visible:false,
                    modal_loading:false
                },
                classGridData: new this.customstore({
                    load: (loadOptions) => {
                        return this.CommDs.loadPage(loadOptions, class_grid_url, this.isLoadData, {}, this.classGrid);
                    },
                })
            }
        },
        mounted(){
            this.searchFrom = $('#searchFrom').dxForm({
                colCount: 4,
                formData: this.searchFormData,
                items: [
                    {
                        dataField: 'className',
                        label: {
                            alignment: 'right',
                            text: '分类名称'
                        },
                    },
                    {
                        dataField: 'status',
                        editorType: 'dxSelectBox',
                        editorOptions: {
                            dataSource: this.enum.status,
                            displayExpr: 'text',
                            valueExpr: 'id',
                        },
                        label: {
                            alignment: 'right',
                            text: '状态'
                        }
                    },
                ]
            }).dxForm('instance');

            this.classGrid = $('#class-grid').dxDataGrid({
                showRowLines: true,
                showBorders: true,
                columnAutoWidth: true,
                columnFixing: {
                    enabled: true
                },
                selection: {
                    mode: 'single'
                },
                onToolbarPreparing: (e) => {
                    e.toolbarOptions.items.unshift({
                        location: 'before',
                        template: () => {
                            return $('<div id=\'btn\'/>');
                        }
                    });
                },
                hoverStateEnabled: true,
                dataSource: {
                    store: this.classGridData
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
                            container.append('<div id=\'t1\'/>');
                            let opcol = new (Vue.component('OpCol'));
                            opcol.items = [
                                {text: '编辑', showtip: false, id: options.data, click: this.edit},
                                {
                                    text: '删除',
                                    color: '#ff9900',
                                    showtip: true,
                                    tip: '您确认删除吗？',
                                    id: options.data,
                                    click: this.del
                                },
                            ];
                            if(options.data.status == 0){
                                opcol.items.push({ text: '启用', showtip: false, color:'#19be6b', id: options.data,extra:'Y', click:this.updateStatus})
                            }else if(options.data.status == 1){
                                opcol.items.push({ text: '停用', showtip: true, color:'#ff9900', tip: '您确认停用吗?', id: options.data,extra:'N', click:this.updateStatus})
                            }
                            opcol.$mount('#t1');
                        },
                        width: 130,
                    },
                    {
                        caption: '分类编码',
                        dataField: 'classCode',
                        width:150
                    },
                    {
                        caption: '分类名称',
                        dataField: 'className',
                        allowSorting: false,
                        width:150
                    },
                    {
                        caption: '分类说明',
                        dataField: 'remark',
                        allowSorting: false,
                    },
                    {
                        caption: '状态',
                        alignment: 'center',
                        dataField: 'status',
                        allowSorting: false,
                        lookup:{
                            dataSource:this.enum.status,
                            displayExpr:'text',
                            valueExpr:'id',
                        },
                        width:100
                    },
                ]
            }).dxDataGrid('instance');

            this.editForm = $('#editForm').dxForm({
                colCount: 2,
                formData: this.editFormData,
                items: [
                    {
                        dataField: 'classCode',
                        label: {
                            alignment: 'right',
                            text: '分类编码'
                        },
                        editorOptions:{
                            placeholder:'<系统自动生成>',
                            disabled:true
                        }
                    },{
                        dataField: 'className',
                        label: {
                            alignment: 'right',
                            text: '名称'
                        },
                        editorOptions:{
                            placeholder:'最多输入4个字',
                            maxLength:4
                        },
                        validationRules: [{
                            type: "required",
                            message: "请输入名称"
                        }]
                    },{
                        dataField: 'sort',
                        editorType:'dxNumberBox',
                        label: {
                            alignment: 'right',
                            text: '分类排序'
                        },
                        editorOptions:{
                            placeholder:'至少为4',
                            min:4
                        },
                        validationRules: [{
                            type: "required",
                            message: "请输入分类排序"
                        }]
                    },
                    {
                        dataField: 'remark',
                        colSpan:2,
                        label: {
                            alignment: 'right',
                            text: '分类描述'
                        },
                        editorOptions:{
                            placeholder:'数字个数不超过50个',
                            maxLength:50
                        },
                        validationRules: [{
                            type: "required",
                            message: "请输入分类描述"
                        }]
                    },
                    {
                        dataField: "tags",
                        colSpan: 2,
                        label: {
                            alignment: "right",
                            text: "关键词设置"
                        },
                        template: this.addTag
                    },
                    {
                        dataField: "photoImg",
                        label: {
                            alignment: "right",
                            text: "分类缩略图"
                        },
                        validationRules: [{
                            type: "required",
                            message: "请上传缩略图"
                        }],
                        template: this.addIamgeFile
                    },
                ]
            }).dxForm('instance');

            this.btnPart = new (Vue.component('CommandBtns'))();
            this.btnPart.items = [
                {id: 1, text: '新增', type: 'primary', enabled: true, click: this.addClass},
            ];
            this.btnPart.$mount('#btn');
            this.btnPart.$parent = this;
        },
        methods:{
            //搜索
            search () {
                var ds = this.classGrid.getDataSource();
                ds.loadOptions().searchData = this.searchFormData;
                ds.reload();
            },

            //重置
            resetSearch: function () {
                this.searchFrom.resetValues();
                this.classGrid.refresh();
            },
            //新增分类
            addClass:function () {
                this.modal.isNew = true;
                this.editFormData = {};
                this.editFormData.status = 1;
                this.editForm.option('formData',this.editFormData);
                this.editForm.itemOption('classCode','editorOptions',{placeholder:'<系统自动生成>',disabled:true});
                this.modal.visible = true;
            },
            //编辑
            edit:function (data) {
                this.modal.isNew = false;
                this.editFormData = data;
                this.editForm.option('formData',this.editFormData);
                this.editForm.itemOption('classCode','editorOptions',{readOnly:true});
                this.modal.visible = true;
            },

            del:function (data) {
                let params = {},p_data = {};
                if(data.status == 1){
                    this.warn('请先停用该分类，再删除');
                    return;
                }
                p_data.id = data.id;
                params.data = p_data;
                this.$del(del_class_url, params).then(res => {
                    if (res.code == '200') {
                        this.success('删除成功!', () => {
                            this.classGrid.refresh();
                        });
                    } else {
                        this.warn(res.msg);
                    }
                }).catch(err => {
                    this.error(err);
                });
            },

            editFormCancel:function(){
                this.modal.visible = false
            },

            formSubmit:function(){
                let params = {};
                this.modal.modal_loading = true;
                if (!this.editForm.validate().isValid) {
                    this.modal.modal_loading = false;
                    return;
                }
                if(!this.editFormData.photoImg && !this.editFormData.photoUrl){
                    this.warn('请上传分类图');
                    this.modal.modal_loading = false;
                    return;
                }
                if(this.editFormData.photoImg && this.editFormData.photoImg.length == 0){
                    this.warn('请上传分类图');
                    this.modal.modal_loading = false;
                    return;
                }
                params = this.editFormData;
                this.$post(class_insert_url, params).then(res => {
                    if (res.code == '200') {
                        this.success('保存成功!', () => {
                            this.modal.visible = false;
                            this.modal.modal_loading = false;
                            this.classGrid.refresh();
                        });
                    }
                    else {
                        this.modal.modal_loading = false;
                        this.warn(res.msg);
                    }
                }).catch(err => {
                    this.modal.modal_loading = false;
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
                            this.classGrid.refresh();
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

            //标签
            addTag: function (data, itemElement) {
                itemElement.append("<div id='t'/>");
                var tag = new Vue(Tag);
                tag.field = data;
                tag.$parent = this;
                this.$refs.tagData = tag;
                tag.$mount('#t');
            },

            //上传图片
            addIamgeFile: function (data, itemElement) {
                itemElement.append("<div id='addImage'/>")
                let FileUpload = new Vue(Image);
                FileUpload.$parent = this;
                FileUpload.$mount('#addImage');
            },
        }
    }
</script>