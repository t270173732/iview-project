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
                <div id="apo-grid"></div>
            </Row>
        </Card>
    </div>
</template>
<script>
    import Vue from 'vue';
    let hos_grid_data_url = '/sys/sysDruggist/read/page';
    let status_update_url = '/sys/sysAccount/updateStatus';
    export default {
        data(){
            return{
                isLoadData:true,
                searchForm:{},
                searchFormData:{},
                apoGridData: new this.customstore({
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
                            text: '药师'
                        },
                        editorOptions:{
                            placeholder:'药师编码或姓名'
                        }
                    },
                ]
            }).dxForm('instance');

            this.apoGrid = $("#apo-grid").dxDataGrid({
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
                    store: this.apoGridData
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
                            opcol.items = [
                                { text: '编辑', showtip: false, id: options.data, click:this.edit},
                            ];
                            if(options.data.authStatus == 1){
                                if(options.data.status == 1){
                                    opcol.items.push({ text: '停用', showtip: true, color:'#ff9900', tip: '您确认停用吗?', id: options.data,extra:'N', click:this.updateStatus})
                                }else if(options.data.status == 2){
                                    opcol.items.push({ text: '启用', showtip: false, color:'#19be6b', id: options.data,extra:'Y', click:this.updateStatus})
                                }
                            }

                            opcol.$mount('#t1');
                        }
                    },
                    {
                        caption: "药师编码",
                        dataField: "code",
                        width: 100
                    },
                    {
                        caption: "姓名",
                        dataField: "name",
                        allowSorting: false,
                        width:200
                    },
                    {
                        caption: "性别",
                        alignment:'center',
                        allowSorting: false,
                        dataField: "sex",
                        width:100,
                        lookup:{
                            dataSource:this.enum.sex,
                            displayExpr:'text',
                            valueExpr:'id'
                        }
                    },
                    {
                        caption: "身份证",
                        dataField: "idCard",
                        allowSorting: false,
                        width:200
                    },
                    {
                        caption: "执业类别",
                        dataField: "regType",
                        allowSorting: false,
                        width:100
                    },
                    {
                        caption: "执业范围",
                        dataField: "regScope",
                        allowSorting: false,
                    },
                    {
                        caption: "执业地点",
                        dataField: "regArea",
                        allowSorting: false,
                        width:100
                    },
                    {
                        caption: "职称",
                        dataField: "profession",
                        allowSorting: false,
                        width:100
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

            this.btnPart = new (Vue.component('CommandBtns'))();
            this.btnPart.items = [
                { id: 1, text: '新增', type: "primary", enabled: true, click: this.addHos },
            ];
            this.btnPart.$mount('#btn');
            this.btnPart.$parent = this;
        },
        methods:{
            //查询
            search(){
                var ds = this.apoGrid.getDataSource();
                ds.loadOptions().searchData = this.searchFormData;
                ds.reload();
            },
            //重置
            resetSearch(){
                this.searchForm.resetValues();
                this.apoGrid.refresh();
            },
            //编辑
            edit(data){
                this.$router.push({
                    name:'apo-info',
                    params:{apo_id:data.id}
                })
            },
            //新增
            addHos(){
                this.$router.push({
                    name:'apo-info',
                    params:{apo_id:0}
                })
            },
            //启用/停用
            updateStatus(data,extra){
                let params = {};
                params.id = data.id;
                if(extra == 'Y'){
                    params.status = 1;
                }else{
                    params.status = 2;
                }
                this.$post(status_update_url,params).then(res => {
                    if(res.code=='200')
                    {
                        this.success('保存成功!',()=>{
                            this.apoGrid.refresh();
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
