<style lang="less">
    @import "../../../styles/common.less";
    @import "record.css";
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
                <div id="recordGrid"></div>
            </Row>
        </Card>
        <Drawer :closable="false" width="500" v-model="visible">
            <table class="table_record">
                <tr>
                    <td class="table_record_th bg_color">订单编号</td>
                    <td class="table_record_td text_center">{{recordInfo.orderCode}}</td>
                </tr>
                <tr>
                    <td class="table_record_th bg_color">交易号</td>
                    <td class="table_record_td text_center">{{recordInfo.payCode}}</td>
                </tr>
                <tr>
                    <td class="table_record_th bg_color">订单类型</td>
                    <td class="table_record_td text_center">{{setType(recordInfo.orderType)}}</td>
                </tr>
                <tr>
                    <td class="table_record_th bg_color">金额</td>
                    <td class="table_record_td text_center">{{recordInfo.total}}</td>
                </tr>
                <tr>
                    <td class="table_record_th bg_color">交易类型</td>
                    <td class="table_record_td text_center">{{recordInfo.trade}}</td>
                </tr>
                <tr>
                    <td class="table_record_th bg_color">支付方式</td>
                    <td class="table_record_td text_center">{{recordInfo.type}}</td>
                </tr>
                <tr>
                    <td class="table_record_th bg_color">交易时间</td>
                    <td class="table_record_td text_center">{{recordInfo.payTime}}</td>
                </tr>
                <tr>
                    <td class="table_record_th bg_color">订单执行方</td>
                    <td class="table_record_td text_center">{{recordInfo.drugStoreName}}</td>
                </tr>
            </table>
        </Drawer>
    </div>
</template>
<script>
    import Vue from 'vue';
    let record_grid_data_url = '/biz/bizPaymentFlow/read/page';
    let record_url = '/biz/bizPaymentFlow/read/selectPaymentFlowByDetail';
    export default {
        data(){
            return{
                recordInfo:{
                    // orderCode:'201707196398345',
                    // payCode:'2018291829480287',
                    // orderType:'在线支付',
                    // total:'200',
                    // trade:'支付',
                    // type:'支付宝',
                    // payTime:'2017-07-19 14:48:38',
                    // drugStoreName:'和平大药房渝北店（001）',
                },
                visible:false,
                isLoadData:true,
                searchForm:{},
                searchFormData:{},
                recordGridData: new this.customstore({
                    load: (loadOptions) => {
                        return this.CommDs.loadPage(loadOptions, record_grid_data_url, this.isLoadData, {});
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
                        dataField: 'orderCode',
                        label: {
                            alignment: 'right',
                            text: '订单编号'
                        },
                        editorOptions:{
                            placeholder:'订单编号'
                        }
                    },
                    {
                        dataField: 'payCode',
                        label: {
                            alignment: 'right',
                            text: '交易号'
                        },
                        editorOptions:{
                            placeholder:'交易号'
                        }
                    },
                    {
                        dataField: 'receiver',
                        label: {
                            alignment: 'right',
                            text: '姓名'
                        },
                        editorOptions:{
                            placeholder:'姓名'
                        }
                    },
                    {
                        dataField: 'tradeType',
                        editorType:'dxSelectBox',
                        label: {
                            alignment: 'right',
                            text: '交易状态'
                        },
                        editorOptions:{
                            dataSource:this.enum.tradeType,
                            displayExpr:'text',
                            valueExpr:'id'
                        }
                    },
                    {
                        dataField: 'payTime',
                        label: {
                            alignment: 'right',
                            text: '交易时间'
                        },
                        template: this.addDateRange,
                    },
                    {
                        dataField: 'orderType',
                        editorType:'dxSelectBox',
                        label: {
                            alignment: 'right',
                            text: '订单类型'
                        },
                        editorOptions:{
                            dataSource:this.enum.orderType,
                            displayExpr:'text',
                            valueExpr:'id'
                        }
                    },
                    {
                        dataField: 'payType',
                        editorType:'dxSelectBox',
                        label: {
                            alignment: 'right',
                            text: '支付方式'
                        },
                        editorOptions:{
                            dataSource:this.enum.payType1,
                            displayExpr:'text',
                            valueExpr:'id'
                        }
                    },
                    {
                        dataField: 'drugStoreName',
                        label: {
                            alignment: 'right',
                            text: '订单执行方'
                        },
                        editorOptions:{
                            placeholder:'医院/药店名称'
                        }
                    },
                ]
            }).dxForm('instance');

            this.recordGrid = $("#recordGrid").dxDataGrid({
                keyExpr:'id',
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
                onSelectionChanged: (e) => {
                    if (e.selectedRowKeys.length > 0) {
                        this.btnPart.items[0].enabled = true
                    }
                    else {
                        this.btnPart.items[0].enabled = false
                    }
                },
                columnFixing: {
                    enabled: true
                },
                selection: {
                    mode: "multiple",
                    recursive: true,
                    showCheckBoxesMode: 'always'
                },
                hoverStateEnabled: true,
                dataSource: {
                    store: this.recordGridData
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
                            container.append("<div id='c'/>");
                            let opcol = new (Vue.component('OpCol'));
                            opcol.items = [
                                { text: '查看详情', showtip: false, id: options.data, click:this.edit},
                            ];
                            opcol.$mount('#c');
                        }
                    },
                    {
                        caption: "订单编号",
                        dataField: "orderCode",
                        width: 100,
                    },
                    {
                        caption: "订单类型",
                        dataField: "orderType",
                        allowSorting: false,
                        lookup:{
                            dataSource:this.enum.orderType,
                            displayExpr:'text',
                            valueExpr:'id'
                        }
                    },
                    {
                        caption: "姓名",
                        dataField: "receiver",
                        allowSorting: false,
                        width:100
                    },
                    {
                        caption: "交易号",
                        dataField: "payCode",
                        width: 150
                    },
                    {
                        caption: "金额",
                        dataField: "total",
                        allowSorting: false,
                        width: 100,
                        calculateCellValue: function (rowData) {
                            if(!rowData.total){
                                return  '';
                            }else{
                                return  '￥' + rowData.total;
                            }
                        },
                    },
                    {
                        caption: "支付方式",
                        alignment: "center",
                        dataField: "payType",
                        allowSorting: false,
                        lookup: {
                            dataSource: this.enum.payType1,
                            displayExpr: 'text',
                            valueExpr: 'id'
                        },
                        width: 100
                    },
                    {
                        caption: "交易时间",
                        dataField: "payTime",
                        allowSorting: false,
                        width: 150
                    },
                    {
                        caption: "交易状态",
                        alignment: "center",
                        dataField: "tradeType",
                        allowSorting: false,
                        lookup: {
                            dataSource: this.enum.tradeType,
                            displayExpr: 'text',
                            valueExpr: 'id'
                        },
                        width: 100
                    },
                    {
                        caption: "订单执行方",
                        dataField: "drugStoreName",
                        allowSorting: false,
                    },
                ]
            }).dxDataGrid("instance");

            this.btnPart = new (Vue.component('CommandBtns'))();
            this.btnPart.items = [
                { id: 1, text: '导出数据', type: "primary", enabled: false, click:this.exportRecord},
            ];
            this.btnPart.$mount('#btn');
            this.btnPart.$parent = this;
        },
        methods:{
            //搜索
            search() {
                let ds = this.recordGrid.getDataSource();
                ds.loadOptions().searchData = this.searchFormData;
                ds.reload();
            },

            //重置
            resetSearch: function () {
                this.$refs.creatTimeData.values = [];
                this.searchFormData.payTime = null;
                this.searchForm.resetValues();
                this.recordGrid.refresh();
            },
            setType(val){
                for(let i=0;i<this.enum.orderType.length;i++){
                    if(this.enum.orderType[i].id == val){
                        return this.enum.orderType[i].text;
                    }
                }
            },
            edit(data){
                this.$put(record_url,{id:data.id}).then(res => {
                    if (res.code == '200') {
                        let text = '',text1 = '';
                        switch (res.data.tradeType) {
                            case 1:
                                text = '支付';
                                break;
                            case 2:
                                text = '退款';
                                break;
                            default:
                                break;
                        }
                        switch (res.data.payType) {
                            case 1:
                                text1 = '支付宝';
                                break;
                            case 2:
                                text1 = '微信';
                                break;
                            case 3:
                                text1 = '医保';
                                break;
                            default:
                                break;
                        }
                        this.recordInfo = res.data;
                        this.recordInfo.trade = text;
                        this.recordInfo.type = text1;
                        this.visible = true
                    }
                    else {
                        this.warn(res.msg);
                    }
                }).catch(err => {
                    this.error(err);
                });
            },
            exportRecord(){
                let selectData = this.recordGrid.getSelectedRowsData(),
                    ids = [];
                selectData.forEach((item)=>{
                    ids.push(item.id)
                });
                let form = $("<form>");
                form.attr("style","display:none");
                form.attr("method","get");
                form.attr("action",this.$config.backend_url + "/biz/bizPaymentFlow/exportPaymentFlowByDetail");
                $("body").append(form);

                let input1 = $("<input>");
                input1.attr("type","hidden");
                input1.attr("name","ids");
                input1.attr("value",ids);
                form.append(input1);

                form.submit();
            },
            addDateRange: function (data, itemElement) {
                itemElement.append('<div id=\'date-range\'/>');
                let dateRange = new (Vue.component('DateRange'));
                dateRange.field = data;
                dateRange.$mount('#date-range');
                dateRange.$parent = this;
                this.$refs.creatTimeData = dateRange;
            },
        }
    }
</script>