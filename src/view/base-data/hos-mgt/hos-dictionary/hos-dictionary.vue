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
    let hos_del_url = '/biz/bdOrg/deleteOrg';
    let status_update_url = '/biz/bdOrg/updateStatus';
    export default {
        data(){
            return{
                isLoadData:true,
                searchForm:{},
                searchFormData:{},
                hosGridData: new this.customstore({
                    load: (loadOptions) => {
                        return this.CommDs.loadPage(loadOptions, hos_grid_data_url, this.isLoadData, {});
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
                            placeholder:'医疗机构名称/医疗机构编码'
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
                        caption: "操作",
                        width: 150,
                        alignment: "center",
                        allowResizing: false,
                        allowFiltering: false,
                        allowSorting: false,
                        cellTemplate: (container, options) => {
                            container.append("<div id='t1'/>");
                            let opcol = new (Vue.component('OpCol'));
                            opcol.items = [
                                { text: '编辑', showtip: false, id: options.data, click:this.edit},
                                { text: '删除', showtip: true, color:'#ff9900', tip: '您确认删除吗？', id: options.data, click:this.del},
                            ];
                            if(options.data.status == 0){
                                opcol.items.push({ text: '启用', showtip: false, color:'#19be6b', id: options.data,extra:'Y', click:this.updateStatus})
                            }else if(options.data.status == 1){
                                opcol.items.push({ text: '停用', showtip: true, color:'#ff9900', tip: '您确认停用吗?', id: options.data,extra:'N', click:this.updateStatus})
                            }
                            opcol.$mount('#t1');
                        }
                    },
                    {
                        caption: "医疗机构编码",
                        dataField: "orgCode",
                        width: 100
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
                { id: 1, text: '新增', type: "primary", enabled: true, click: this.addHos },
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
            //编辑
            edit(data){
                this.$router.push({
                    name:'hos-info',
                    params:{hos_id:data.id}
                })
            },
            //删除
            del(data){
                let params = {};
                params.id = data.id;
                this.$post(hos_del_url,params).then(res => {
                    if(res.code=='200')
                    {
                        this.success('删除成功!',()=>{
                            this.hosGrid.refresh();
                        });
                    }
                    else
                    {
                        this.warn(res.msg);
                    }
                }).catch(err=>
                {
                    this.error(err);
                });
            },
            //新增
            addHos(){
                this.$router.push({
                    name:'hos-info',
                    params:{hos_id:0}
                })
            },
            check(data){
                this.$router.push({
                    name:'hos-check-info',
                    params:{hos_id:data.id}
                })
            },
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
                            this.hosGrid.refresh();
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
