<style lang="less">
    @import "../../../styles/common.less";
</style>
<template>
    <div>
        <Row>
            <Card dis-hover>
                <p slot="title" style="font-size: 20px">问题反馈管理</p>
                <Row>
                    <Searchpanel ref="searchPanel">
                        <div slot="form" class="margin-bottom-3" id="searchform"></div>
                        <div slot="control">
                            <Button type="primary" @click="search">查询</Button>
                            <Button class="margin-left-5" @click="resetSearch">重置</Button>
                        </div>
                    </Searchpanel>
                </Row>
                <Row :gutter="10" class="margin-top-10">
                    <div id="problem-grid"></div>
                </Row>
            </Card>
        </Row>

        <!--问题反馈处理页面-->
        <Modal v-model="problemModal.visible" :mask-closable="false" width="650" title="问题内容">
            <p slot="header">
                <span>处理操作</span>
            </p>
            <div id="dealProblemFrom"></div>
            <div slot="footer" style="text-align: center">
                <Button type="text" @click="dealFormCancel">取消</Button>
                <Button type="primary" :loading="problemModal.modal_loading" @click="problemDealFormSubmit">保存</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import Vue from 'vue';
    import Image from './image';
    let problem_grid_data_url = '';
    let problem_deal_url = '';
    export default {
        data(){
            return {
                //选中问题
                selectedProblemData: {},
                searchForm: {},
                searchFormData: {},
                dealProblemForm: {},
                dealProblemFormData: {},
                isLoadData: true,
                problemModal: {
                    isNew:true,
                    visible: false,
                    modal_loading: false,
                },
                problemGridData: new this.customstore({
                    load: (loadOptions) => {
                        return this.CommDs.loadPage(loadOptions, problem_grid_data_url, this.isLoadData, {}, this.problemGrid);
                    },
                }),
            }
        },
        mounted(){
            let _this = this;
            //搜索表单
            this.searchForm = $("#searchform").dxForm({
                colCount: 4,
                formData: this.searchFormData,
                items: [
                    {
                        dataField: 'createTime',
                        label: {
                            alignment: 'right',
                            text: '创建时间'
                        },
                        template: this.addDateRange,
                    },
                ]
            }).dxForm("instance");

            //问题反馈表格
            this.problemGrid = $("#problem-grid").dxDataGrid({
                showRowLines: true,
                showBorders: true,
                allowColumnReordering: true,
                allowColumnResizing: true,
                columnAutoWidth: true,
                rowAlternationEnabled: true,
                columnFixing: {//当所有列的宽度超过窗口小部件宽度时，将显示水平滚动
                    enabled: true
                },
                selection: {
                    mode: "single"
                },
                hoverStateEnabled: true, //指定当用户在其上暂停时窗口小部件是否更改其状态
                dataSource: {
                    store: this.problemGridData,
                },
                remoteOperations: {
                    filtering: true,
                    sorting: true,
                    paging:true,
                },
                paging: {
                    pageSize: 10
                },
                columns: [
                    {
                        caption:"操作",
                        alignment: 'center',
                        allowResizing: false,
                        allowFiltering: false,
                        allowSorting: false,
                        cellTemplate: (container,options) => {
                            container.append("<div id='t1'/>");
                            var opcol = new (Vue.component('OpCol'));
                            if (options.data.handleResult) {
                                opcol.items = [
                                    {text:'重新处理',showtip:false, id:options.data, click:this.edit},
                                ];
                            }else {
                                opcol.items = [
                                    {text:'处理',showtip:false, id:options.data, click:this.edit},
                                ];
                            }
                            opcol.$mount('#t1');
                        },
                        width:100,
                    },
                    {
                        dataField: 'mobile',
                        caption: '会员手机号',

                    },
                    {
                        dataField: 'feedback',
                        caption: '反馈内容',
                    },
                    {
                        caption: '创建时间',
                        dataField: 'createTime',
                    },
                    {
                        caption: '操作人',
                        dataField: 'handleName',
                    },
                    {
                        caption: '操作结果',
                        dataField: 'handleResult',

                    },
                    {
                        dataField: 'handleTime',
                        caption: '操作时间',
                    },
                ]
            }).dxDataGrid('instance');

            //编辑处理问题表单
            this.dealProblemForm = $("#dealProblemFrom").dxForm({
                colCount: 1,
                formData: this.dealProblemFormData,
                items: [
                    {
                        dataField:'feedback',
                        editorType:'dxTextArea',
                        editorOptions: {
                            height:80,
                            readOnly:true,
                        },
                        label: {
                            alignment: 'center',
                            text: '问题内容',
                        },
                    },
                    {
                        dataField:'picList',
                        visible:true,
                        editorOptions: {
                            readOnly:true,
                        },
                        label:{
                            alignment:'center',
                            text:'图片'
                        },
                        template: this.addImageFile
                    },
                    {
                        dataField:'handleResult',
                        label:{
                            alignment:'center',
                            text:'解决方案',
                        },
                        editorOptions:{
                            maxLength:20,
                            placeholder:'<内容最多不超过20个字>'
                        },
                        validationRules:[{
                            type: 'required',
                            message: '请输入解决方案',
                        }]
                    }
                ],
            }).dxForm('instance');
        },
        methods:{
            //添加时间
            addDateRange: function (data, itemElement) {
                itemElement.append('<div id=\'date-holder\'/>');
                var dateRange = new (Vue.component('DateRange'));
                dateRange.field = data;
                dateRange.$mount('#date-holder');
                dateRange.$parent = this;
                this.$refs.creatTimeData = dateRange;
            },
            //添加图片
            addImageFile:function (data, itemElement) {
                itemElement.append("<div id='addImage'/>");
                var FileUpload = new Vue(Image);
                FileUpload.$parent = this;
                FileUpload.$mount('#addImage');
            },
            //搜索
            search:function(){
                var ds = this.problemGrid.getDataSource();
                ds.loadOptions().searchData = this.searchFormData;
                ds.reload();
            },
            //重置
            resetSearch:function(){
                this.$refs.creatTimeData.values = null;
                this.searchFormData.createTime = '';
                this.searchForm.resetValues();
                this.problemGrid.refresh();
            },

            edit:function(data){
                this.problemModal.isNew = false;
                this.dealProblemFormData= data;
                this.dealProblemForm.itemOption('account', 'editorOptions', {readOnly: true});
                this.dealProblemForm.option('formData',this.dealProblemFormData);
                if(!this.dealProblemFormData.picList){
                    this.dealProblemForm.itemOption('picList', 'visible', false);
                }else{
                    this.dealProblemForm.itemOption('picList', 'visible', true);
                }
                this.problemModal.visible = true;
            },
            //取消
            dealFormCancel:function () {
                this.problemModal.visible = false;
            },
            //提交
            problemDealFormSubmit:function () {
                let params = {};
                this.problemModal.modal_loading = true;
                if (!this.dealProblemForm.validate().isValid){
                    this.problemModal.modal_loading = false;
                    return;
                }
                params.id = this.dealProblemFormData.id;
                params.handleResult = this.dealProblemFormData.handleResult;
                this.$post(problem_deal_url,params).then(res => {
                    if(res.code=='200')
                    {
                        this.success('保存成功!',()=>{
                            this.problemModal.modal_loading =false;
                            this.problemModal.visible=false;
                            //刷新网格
                            this.problemGrid.refresh();
                        });
                    }
                    else
                    {
                        //提示信息
                        this.warn(res.msg);
                    }
                }).catch(err => {
                    this.error(err);
                });
                this.problemModal.modal_loading =false;
            },
        }

    };
</script>
