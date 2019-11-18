<style lang="less">
    @import "../../../../styles/common.less";
</style>
<template>
    <div>
        <Card dis-hover>
            <Row class="margin-top-10">
                <div id="classTreeList"></div>
            </Row>
        </Card>
        <Modal v-model="modal.visible" :mask-closable="false" width="650" title="编辑数据" @on-cancel="editFormCancel">
            <p slot="header">
                <span v-if="modal.isNew">新增分类</span>
                <span v-else="modal.isNew">编辑分类</span>
            </p>
            <div id="classForm"></div>
            <div slot="footer">
                <Button type="text" @click="editFormCancel">取消</Button>
                <Button type="primary" :loading="modal.modal_loading" @click="formSubmit">保存</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    import Vue from 'vue';
    import Image from './image';
    let class_list_url = '/biz/bdProductClass/ProductClassList';
    let class_list_byKey_url = '/biz/bdProductClass/getProductClassDetail';
    let del_class_url = '/biz/bdProductClass/deleteProductClass';
    let class_insert_url = '/biz/bdProductClass/updateProductClass';
    let class_status_url = '/biz/bdProductClass/updateClassStatus';
    export default {
        data(){
            return{
                classForm:{},
                classFormData:{},
                selectData:{},
                modal:{
                    isNew:true,
                    visible:false,
                    modal_loading:false
                },
                classTreeListData: new this.customstore({
                    key: "id",
                    byKey: (key) => {
                        return this.CommDs.loadByKey(class_list_byKey_url, {id: key});
                    },
                    load: (e) => {
                        return this.CommDs.loadList(class_list_url);
                    }
                }),
                classListData: new this.customstore({
                    key: "id",
                    byKey: (key) => {
                        return this.CommDs.loadByKey(class_list_byKey_url, {id: key});
                    },
                    load: (e) => {
                        return this.CommDs.loadList(class_list_url,{upClass:true});
                    }
                }),
            }
        },
        mounted(){
            this.classForm = $('#classForm').dxForm({
                colCount: 2,
                formData: this.classFormData,
                items: [
                    {
                        dataField: 'code',
                        label: {
                            alignment: 'right',
                            text: '编码'
                        },
                        editorOptions:{
                            placeholder:'<系统自动分配>',
                            disabled:true
                        }
                    },
                    {
                        dataField: 'parentId',
                        visible:true,
                        editorType: 'dxSelectBox',
                        label: {
                            alignment: 'right',
                            text: '父级分类'
                        },
                        editorOptions:{
                            dataSource:this.classListData,
                            displayExpr:'name',
                            valueExpr:'id'
                        },
                    },
                    {
                        dataField: 'name',
                        label: {
                            alignment: 'right',
                            text: '名称'
                        },
                        editorOptions:{
                            placeholder:'输入分类名称',
                            maxLength:50
                        },
                        validationRules: [{
                            type: "required",
                            message: "请输入分类名称"
                        }]
                    },
                    {
                        dataField: 'empty',
                        itemType:'empty',
                        visible:true
                    },
                    {
                        dataField: 'remark',
                        editorType:'dxTextArea',
                        colSpan:2,
                        label: {
                            alignment: 'right',
                            text: '备注'
                        },
                        editorOptions:{
                            maxLength:200,
                            height:60
                        },
                    },
                    {
                        dataField: 'picImg',
                        colSpan:2,
                        label: {
                            alignment: 'right',
                            text: '分类图片'
                        },
                        template: (data, itemElement)=>{
                            itemElement.append("<div id='picImg'/>");
                        }
                    },
                ]
            }).dxForm('instance');

            this.classTreeList = $("#classTreeList").dxTreeList({
                keyExpr: "id",
                showRowLines: true,
                showBorders: true,
                columnAutoWidth: true,
                parentIdExpr: 'parentId',
                remoteOperations: {
                    filtering: false,
                    sorting: false,
                    paging:false
                },
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
                        this.selectData = e.selectedRowsData[0];
                    }
                    else {

                    }
                },
                searchPanel: {
                    visible: true,
                    width: 240,
                    placeholder: '查找...'
                },
                selection: {
                    mode: "single"
                },
                dataSource: {
                    store: this.classTreeListData
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
                                { text: '删除', showtip: true, color:'#ff9900', tip: '您确认删除吗？', id: options.data, click:this.classDel},
                            ];
                            if(options.data.status == 0){
                                opcol.items.push({ text: '启用', showtip: false, color:'#19be6b', id: options.data,extra:'Y', click:this.updateStatus})
                            }else if(options.data.status == 1){
                                opcol.items.push({ text: '停用', showtip: true, color:'#ff9900', tip: '您确认停用吗?', id: options.data,extra:'N', click:this.updateStatus})
                            }
                            opcol.$mount('#t1');
                        },
                        width:200
                    },
                    {
                        caption: "分类编码",
                        dataField: "code",
                        sortOrder: "asc",
                        width:200
                    },
                    {
                        caption: "名称",
                        dataField: "name",
                        allowSorting: false,
                    },
                    {
                        caption: "创建时间",
                        dataField: "createTime",
                        allowSorting: false,
                        width:150
                    },
                    {
                        caption: "状态",
                        dataField: "status",
                        alignment: "center",
                        allowSorting: false,
                        lookup:{
                            dataSource:this.enum.status,
                            displayExpr:'text',
                            valueExpr:'id'
                        },
                        width:200
                    },
                    {
                        caption: "备注",
                        dataField: "remark",
                        allowSorting: false,
                    },
                ]
            }).dxTreeList("instance");

            this.btnPart = new (Vue.component('CommandBtns'))();
            this.btnPart.items = [
                { id: 1, text: '新增', type: "primary", enabled: true, click: this.addClass },
            ];
            this.btnPart.$mount('#btn');
            this.btnPart.$parent = this;
        },
        methods:{
            addClass(){
                this.modal.isNew = true;
                this.classForm.itemOption('code', 'editorOptions', {
                    placeholder:'<系统自动分配>',
                    disabled:true
                });
                this.classForm.itemOption('parentId', 'visible', true);
                this.classForm.itemOption('empty', 'visible', true);
                this.classFormData = {};
                if(!this.selectData.parentId){
                    this.classFormData.parentId = this.selectData.id
                }
                this.classFormData.status = 1;
                this.classForm.option('formData',this.classFormData);
                this.modal.visible = true;
                this.addIamgeFile();
            },
            edit(data){
                this.modal.isNew = false;
                this.classForm.itemOption('code', 'editorOptions', { readOnly: true });
                if(!data.parentId){
                    this.classForm.itemOption('parentId', 'visible', false);
                    this.classForm.itemOption('empty', 'visible', false);
                }else{
                    this.classForm.itemOption('parentId', 'visible', true);
                    this.classForm.itemOption('empty', 'visible', true);
                }
                this.classFormData = data;
                this.classForm.option('formData',this.classFormData);
                this.modal.visible = true;
                this.addIamgeFile();
            },
            classDel(data){
                let params = {},p_data = {};
                if(data.status == 1){
                    this.warn('请先停用该分类，再删除');
                    return
                }
                p_data.id = data.id;
                params.data = p_data;
                this.$del(del_class_url, params).then(res => {
                    if (res.code == '200') {
                        this.success('删除成功!', () => {
                            this.classTreeList.refresh();
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
                this.classFormData = {};
                this.classForm.option('formData',this.classFormData);
            },
            formSubmit(){
                let params = {};
                this.modal.modal_loading = true;
                if (!this.classForm.validate().isValid) {
                    this.modal.modal_loading = false;
                    return;
                }
                params = this.classFormData;
                this.$post(class_insert_url, params).then(res => {
                    if (res.code == '200') {
                        this.success('保存成功!', () => {
                            this.modal.modal_loading = false;
                            this.modal.visible = false;
                            this.classTreeList.refresh();
                            this.classFormData = {};
                            this.classForm.option('formData',this.classFormData);
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
            addIamgeFile() {
                let FileUpload = new Vue(Image);
                FileUpload.$parent = this;
                FileUpload.$mount('#picImg');
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
                this.$post(class_status_url,params).then(res => {
                    if(res.code=='200')
                    {
                        this.success('操作成功!',()=>{
                            this.classTreeList.refresh();
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