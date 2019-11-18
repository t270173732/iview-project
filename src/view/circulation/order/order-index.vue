<style lang="less">
    @import "../../../styles/common.less";
    @import "order.css";
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
                <Tabs v-model="tabValue" @on-click="tabChange">
                    <TabPane label="全部订单" name="all">
                        <Row class="margin-top-10">
                            <div id="allOrderGrid"></div>
                        </Row>
                    </TabPane>
                    <TabPane label="待支付订单" name="payment">
                        <Row class="margin-top-10">
                            <div id="paymentGrid"></div>
                        </Row>
                    </TabPane>
                    <TabPane label="待发货订单" name="notDeliver">
                        <Row class="margin-top-10">
                            <div id="notDeliverGrid"></div>
                        </Row>
                    </TabPane>
                    <TabPane label="待收货订单" name="deliver">
                        <Row class="margin-top-10">
                            <div id="deliverGrid"></div>
                        </Row>
                    </TabPane>
                    <TabPane label="交易完成订单" name="finish">
                        <Row class="margin-top-10">
                            <div id="finishGrid"></div>
                        </Row>
                    </TabPane>
                    <TabPane label="退款订单" name="refund">
                        <Row class="margin-top-10">
                            <div id="refundGrid"></div>
                        </Row>
                    </TabPane>
                    <TabPane label="退款完成订单" name="refunded">
                        <Row class="margin-top-10">
                            <div id="refundedGrid"></div>
                        </Row>
                    </TabPane>
                    <TabPane label="交易关闭订单" name="closed">
                        <Row class="margin-top-10">
                            <div id="closedGrid"></div>
                        </Row>
                    </TabPane>
                </Tabs>
            </Row>
        </Card>
    </div>
</template>
<script>
    import Vue from 'vue';
    let order_url = '/biz/bizOrder/getOrderPage';
    let return_money_url = '/biz/bizOrder/platformRefund';
    export default {
        data(){
            return{
                tabValue:'all',
                isLoadAllData:true,
                isLoadPaymentData:false,
                isLoadNotDeliverData:false,
                isLoadDeliverData:false,
                isLoadFinishData:false,
                isLoadRefundData:false,
                isLoadRefundedData:false,
                isLoadCloseData:false,
                searchForm:{},
                searchFormData:{},
                allOrderGridData: new this.customstore({
                    load: (loadOptions) => {
                        return this.CommDs.loadPage(loadOptions, order_url, this.isLoadAllData, {});
                    },
                }),
                paymentGridData: new this.customstore({
                    load: (loadOptions) => {
                        return this.CommDs.loadPage(loadOptions, order_url, this.isLoadPaymentData, {status:1});
                    },
                }),
                notDeliverGridData: new this.customstore({
                    load: (loadOptions) => {
                        return this.CommDs.loadPage(loadOptions, order_url, this.isLoadNotDeliverData, {status:2});
                    },
                }),
                deliverGridData: new this.customstore({
                    load: (loadOptions) => {
                        return this.CommDs.loadPage(loadOptions, order_url, this.isLoadDeliverData, {status:3});
                    },
                }),
                finishGridData: new this.customstore({
                    load: (loadOptions) => {
                        return this.CommDs.loadPage(loadOptions, order_url, this.isLoadFinishData, {status:6});
                    },
                }),
                refundGridData: new this.customstore({
                    load: (loadOptions) => {
                        return this.CommDs.loadPage(loadOptions, order_url, this.isLoadRefundData, {status:4});
                    },
                }),
                refundedGridData: new this.customstore({
                    load: (loadOptions) => {
                        return this.CommDs.loadPage(loadOptions, order_url, this.isLoadRefundedData, {status:7});
                    },
                }),
                closedGridData: new this.customstore({
                    load: (loadOptions) => {
                        return this.CommDs.loadPage(loadOptions, order_url, this.isLoadCloseData, {status:9});
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
                        dataField: 'recipeSources',
                        label: {
                            alignment: 'right',
                            text: '处方来源'
                        },
                    },{
                        dataField: 'orderCode',
                        label: {
                            alignment: 'right',
                            text: '订单编号'
                        },
                    },{
                        dataField: 'patient',
                        label: {
                            alignment: 'right',
                            text: '患者'
                        },
                        editorOptions:{
                            placeholder:'患者姓名/手机号'
                        }
                    },{
                        dataField: 'dispatchType',
                        editorType:'dxSelectBox',
                        label: {
                            alignment: 'right',
                            text: '购药方式'
                        },
                        editorOptions:{
                            dataSource:this.enum.dispatchType,
                            displayExpr:'text',
                            valueExpr:'id'
                        }
                    },{
                        dataField: 'drugStoreName',
                        label: {
                            alignment: 'right',
                            text: '执行药店'
                        },
                    },{
                        dataField: 'productName',
                        label: {
                            alignment: 'right',
                            text: '药品名称'
                        },
                    },{
                        dataField: 'createTime',
                        label: {
                            alignment: 'right',
                            text: '创建时间'
                        },
                        template: this.addDatePicker,
                    }
                ]
            }).dxForm('instance');
            //全部订单
            this.allOrderGrid = $("#allOrderGrid").dxDataGrid({
                showRowLines: true,
                showBorders: true,
                columnAutoWidth: true,
                columnFixing: {
                    enabled: true
                },
                dataSource: {
                    store: this.allOrderGridData
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
                        caption: "订单编号",
                        dataField: "orderCode",
                        width:150
                    },
                    {
                        caption: "药品",
                        dataField: "productName",
                        allowSorting: false,
                        width:500,
                        cellTemplate:function(container, options) {
                            let data = options.data.product;
                            let str = '';
                            let divHeight,baseHeight;
                            if(options.data.status == 4){
                                // if(options.data.returnType == 1){
                                //     baseHeight = 90
                                // }else{
                                    baseHeight = 71
                                // }
                            }else if(options.data.status == 7){
                                baseHeight = 71
                            }else{
                                baseHeight = 52
                            }
                            if(data.length*33<baseHeight){
                                divHeight = baseHeight/data.length + 'px'
                            }else{
                                divHeight = `calc(100%/${data.length})`
                            }
                            for(let i =0; i<data.length; i++){
                                let source = '';
                                if(data[i].recipeSources){source = data[i].recipeSources}
                                if(i == 0){
                                    str+= `
                                        <div style="height:${divHeight};width:30%" class="drugDiv drugDiv-padding" title=${data[i].productName}>${data[i].productName}</div>
                                        <div style="height:${divHeight};width:20%" class="drugDiv drugDiv-padding" title=${data[i].spec}>${data[i].spec}</div>
                                        <div style="height:${divHeight};width:25%" class="drugDiv drugDiv-padding" title=${data[i].factory}>${data[i].factory}</div>
                                        <div style="height:${divHeight};width:25%" class="drugDiv drugDiv-last drugDiv-padding" title=${source}>${source}</div>
                                        <div style="clear: both"></div>
                                    `
                                }else{
                                    str+= `
                                        <div style="height:${divHeight};width:30%" class="drugDiv drugDiv-border-top drugDiv-padding" title=${data[i].productName}>${data[i].productName}</div>
                                        <div style="height:${divHeight};width:20%" class="drugDiv drugDiv-border-top drugDiv-padding" title=${data[i].spec}>${data[i].spec}</div>
                                        <div style="height:${divHeight};width:25%" class="drugDiv drugDiv-border-top drugDiv-padding" title=${data[i].factory}>${data[i].factory}</div>
                                        <div style="height:${divHeight};width:25%" class="drugDiv drugDiv-last drugDiv-border-top drugDiv-padding" title=${source}>${source}</div>
                                        <div style="clear: both"></div>
                                    `
                                }
                            }
                            let markup = `<div class='drugDiv-outer'>${str}</div>`;
                            container.append(markup);
                        }
                    },
                    {
                        caption: "单价",
                        dataField: "price",
                        allowSorting: false,
                        width:70,
                        cellTemplate:function(container, options) {
                            let data = options.data.product;
                            let str = '';
                            let divHeight,baseHeight;
                            if(options.data.status == 4){
                                // if(options.data.returnType == 1){
                                //     baseHeight = 90
                                // }else{
                                    baseHeight = 71
                                // }
                            }else if(options.data.status == 7){
                                baseHeight = 71
                            }else{
                                baseHeight = 52
                            }
                            if(data.length*33<baseHeight){
                                divHeight = baseHeight/data.length + 'px'
                            }else{
                                divHeight = `calc(100%/${data.length})`
                            }
                            for(let i=0;i<data.length;i++){
                                if(i==0){
                                    str+=`<div style='height:${divHeight};' class="drugDiv-padding">￥${data[i].price}</div>`
                                }else{
                                    str+=`<div style='height:${divHeight};' class="drugDiv-border-top drugDiv-padding">￥${data[i].price}</div>`
                                }

                            }
                            let markup = "<div class='drugDiv-outer'>"+str+"</div>";
                            container.append(markup);
                        }
                    },
                    {
                        caption: "数量",
                        dataField: "num",
                        allowSorting: false,
                        width:50,
                        cellTemplate:function(container, options) {
                            let data = options.data.product;
                            let str = '';
                            let divHeight,baseHeight;
                            if(options.data.status == 4){
                                // if(options.data.returnType == 1){
                                //     baseHeight = 90
                                // }else{
                                    baseHeight = 71
                                // }
                            }else if(options.data.status == 7){
                                baseHeight = 71
                            }else{
                                baseHeight = 52
                            }
                            if(data.length*33<baseHeight){
                                divHeight = baseHeight/data.length + 'px'
                            }else{
                                divHeight = `calc(100%/${data.length})`
                            }
                            for(let i=0;i<data.length;i++){
                                if(i==0){
                                    str+=`<p style='height:${divHeight};' class="drugDiv-text drugDiv-padding">${data[i].sum}${data[i].packUnit}</p>`
                                }else{
                                    str+=`<p style='height:${divHeight};' class="drugDiv-padding drugDiv-border-top drugDiv-text">${data[i].sum}${data[i].packUnit}</p>`
                                }

                            }
                            let markup = "<div class='drugDiv-outer'>"+str+"</div>";
                            container.append(markup);
                        }
                    },
                    {
                        caption: "售价",
                        dataField: "productTotal",
                        allowSorting: false,
                        width:70,
                        cellTemplate:function(container, options) {
                            let data = options.data.product;
                            let str = '';
                            let divHeight,baseHeight;
                            if(options.data.status == 4){
                                // if(options.data.returnType == 1){
                                //     baseHeight = 90
                                // }else{
                                    baseHeight = 71
                                // }
                            }else if(options.data.status == 7){
                                baseHeight = 71
                            }else{
                                baseHeight = 52
                            }
                            if(data.length*33<baseHeight){
                                divHeight = baseHeight/data.length + 'px'
                            }else{
                                divHeight = `calc(100%/${data.length})`
                            }
                            for(let i=0;i<data.length;i++){
                                if(i==0){
                                    str+=`<p style='height:${divHeight};' class="drugDiv-padding">￥${data[i].productTotal}</p>`
                                }else{
                                    str+=`<p style='height:${divHeight};' class="drugDiv-padding drugDiv-border-top">￥${data[i].productTotal}</p>`
                                }

                            }
                            let markup = "<div class='drugDiv-outer'>"+str+"</div>";
                            container.append(markup);
                        }
                    },
                    {
                        caption: "订单状态",
                        dataField: "status",
                        alignment:'center',
                        allowSorting: false,
                        width:100,
                        cellTemplate: (container, options) => {
                            //1-待付款，2-待配送，3-待收货，4-退款中，6-已完成，7-已退款，9-交易关闭
                            container.append("<div id='orderStatus'/>");
                            // 这里有好多个if的用switch
                            let text = '',text1;
                            switch (options.data.status) {
                                case 1:
                                    text = '待支付'
                                    break;
                                case 2:
                                    text = '待发货'
                                    break;
                                case 3:
                                    text = '待收货'
                                    break;
                                case 4:
                                    text = '退货申请中'
                                    break;
                                case 5:
                                    text = '同意退货'
                                    break;
                                case 6:
                                    text = '交易完成'
                                    break;
                                case 7:
                                    text = '退款完成'
                                    break;
                                case 9:
                                    text = '交易关闭'
                                    break;
                                default:
                                    break;
                            }
                            switch (options.data.returnType) {
                                case 1:
                                    text1 = '(仅退款)'
                                    break;
                                case 2:
                                    text1 = '(退货退款)'
                                    break;
                                default:
                                    break;
                            }
                            let opbtn = new (Vue.component('OpBtn'));
                            if(options.data.status == 4){
                                opbtn.items = [
                                    { text: text, isJump: false,color:'#333',},
                                    { text: text1, isJump: false,color:'#333',},
                                    { text: '订单详情', isJump: true,color:'#2d8cf0', id: options.data, click:this.orderDetail},
                                ];
                                // if(options.data.returnType == 1){
                                //     opbtn.items.push({ text: '退款', isJump: 'pop',color:'#2d8cf0', tip:'确认退款吗？', id: options.data, click:this.returnMoney},)
                                // }
                            }else if(options.data.status == 7){
                                opbtn.items = [
                                    { text: text, isJump: false,color:'#333',},
                                    { text: text1, isJump: false,color:'#333',},
                                    { text: '订单详情', isJump: true,color:'#2d8cf0', id: options.data, click:this.orderDetail},
                                ];
                            }else{
                                opbtn.items = [
                                    { text: text, isJump: false,color:'#333', id: options.data,},
                                    { text: '订单详情', isJump: true,color:'#2d8cf0', id: options.data, click:this.orderDetail},
                                ];
                            }
                            opbtn.$mount('#orderStatus');
                        }
                    },
                    {
                        caption: "订单执行药店",
                        allowSorting: false,
                        dataField: "drugstoreName",
                        // width:100,
                    },
                    {
                        caption: "患者姓名",
                        allowSorting: false,
                        dataField: "receiver",
                        width:100,
                    },
                    {
                        caption: "创建时间",
                        dataField: "createTime",
                        width:150
                    },
                    {
                        caption: "购药方式",
                        allowSorting: false,
                        alignment:'center',
                        dataField: "dispatchType",
                        lookup: {
                            dataSource: this.enum.dispatchType,
                            displayExpr: 'text',
                            valueExpr: 'id',
                        },
                        width: 80
                    },
                    {
                        caption: "实收款",
                        allowSorting: false,
                        alignment:'center',
                        dataField: "payMoney",
                        width:120,
                        cellTemplate: (container, options) => {
                            container.append("<div id='pm'/>");
                            let opbtn = new (Vue.component('OpBtn'));
                            let text1 = "￥"+options.data.payMoney+"";
                            if(options.data.dispatchFee){
                                let text2 = "(含配送费￥"+options.data.dispatchFee+")";
                                opbtn.items = [
                                    { text: text1, isJump: false,color:'#333'},
                                    { text: text2, isJump: false,color:'#333'},
                                ];
                            }else{
                                opbtn.items = [
                                    { text: text1, isJump: false,color:'#333'}
                                ];
                            }

                            opbtn.$mount('#pm');
                        }
                    },
                ]
            }).dxDataGrid("instance");
            //待付款
            this.paymentGrid = $("#paymentGrid").dxDataGrid({
                showRowLines: true,
                showBorders: true,
                columnAutoWidth: true,
                columnFixing: {
                    enabled: true
                },
                dataSource: {
                    store: this.paymentGridData
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
                        caption: "订单编号",
                        dataField: "orderCode",
                        width:150
                    },
                    {
                        caption: "药品",
                        dataField: "productName",
                        allowSorting: false,
                        width:500,
                        cellTemplate:function(container, options) {
                            let data = options.data.product;
                            let str = '';
                            let divHeight;
                            if(data.length*33<52){
                                divHeight = 52/data.length + 'px'
                            }else{
                                divHeight = `calc(100%/${data.length})`
                            }
                            for(let i =0; i<data.length; i++){
                                let source = '';
                                if(data[i].recipeSources){source = data[i].recipeSources}
                                if(i == 0){
                                    str+= `
                                        <div style="height:${divHeight};width:30%" class="drugDiv drugDiv-padding" title=${data[i].productName}>${data[i].productName}</div>
                                        <div style="height:${divHeight};width:20%" class="drugDiv drugDiv-padding" title=${data[i].spec}>${data[i].spec}</div>
                                        <div style="height:${divHeight};width:25%" class="drugDiv drugDiv-padding" title=${data[i].factory}>${data[i].factory}</div>
                                        <div style="height:${divHeight};width:25%" class="drugDiv drugDiv-last drugDiv-padding" title=${source}>${source}</div>
                                        <div style="clear: both"></div>
                                    `
                                }else{
                                    str+= `
                                        <div style="height:${divHeight};width:30%" class="drugDiv drugDiv-border-top drugDiv-padding" title=${data[i].productName}>${data[i].productName}</div>
                                        <div style="height:${divHeight};width:20%" class="drugDiv drugDiv-border-top drugDiv-padding" title=${data[i].spec}>${data[i].spec}</div>
                                        <div style="height:${divHeight};width:25%" class="drugDiv drugDiv-border-top drugDiv-padding" title=${data[i].factory}>${data[i].factory}</div>
                                        <div style="height:${divHeight};width:25%" class="drugDiv drugDiv-last drugDiv-border-top drugDiv-padding" title=${source}>${source}</div>
                                        <div style="clear: both"></div>
                                    `
                                }
                            }
                            let markup = `<div class='drugDiv-outer'>${str}</div>`;
                            container.append(markup);
                        }
                    },
                    {
                        caption: "单价",
                        dataField: "price",
                        allowSorting: false,
                        width:70,
                        cellTemplate:function(container, options) {
                            let data = options.data.product;
                            let str = '';
                            let divHeight;
                            if(data.length*33<52){
                                divHeight = 52/data.length + 'px'
                            }else{
                                divHeight = `calc(100%/${data.length})`
                            }
                            for(let i=0;i<data.length;i++){
                                if(i==0){
                                    str+=`<div style='height:${divHeight};' class="drugDiv-padding">￥${data[i].price}</div>`
                                }else{
                                    str+=`<div style='height:${divHeight};' class="drugDiv-border-top drugDiv-padding">￥${data[i].price}</div>`
                                }

                            }
                            let markup = "<div class='drugDiv-outer'>"+str+"</div>";
                            container.append(markup);
                        }
                    },
                    {
                        caption: "数量",
                        dataField: "num",
                        allowSorting: false,
                        width:50,
                        cellTemplate:function(container, options) {
                            let data = options.data.product;
                            let str = '';
                            let divHeight;
                            if(data.length*33<52){
                                divHeight = 52/data.length + 'px'
                            }else{
                                divHeight = `calc(100%/${data.length})`
                            }
                            for(let i=0;i<data.length;i++){
                                if(i==0){
                                    str+=`<p style='height:${divHeight};' class="drugDiv-text drugDiv-padding">${data[i].sum}${data[i].packUnit}</p>`
                                }else{
                                    str+=`<p style='height:${divHeight};' class="drugDiv-padding drugDiv-border-top drugDiv-text">${data[i].sum}${data[i].packUnit}</p>`
                                }

                            }
                            let markup = "<div class='drugDiv-outer'>"+str+"</div>";
                            container.append(markup);
                        }
                    },
                    {
                        caption: "售价",
                        dataField: "productTotal",
                        allowSorting: false,
                        width:70,
                        cellTemplate:function(container, options) {
                            let data = options.data.product;
                            let str = '';
                            let divHeight;
                            if(data.length*33<52){
                                divHeight = 52/data.length + 'px'
                            }else{
                                divHeight = `calc(100%/${data.length})`
                            }
                            for(let i=0;i<data.length;i++){
                                if(i==0){
                                    str+=`<p style='height:${divHeight};' class="drugDiv-padding">￥${data[i].productTotal}</p>`
                                }else{
                                    str+=`<p style='height:${divHeight};' class="drugDiv-padding drugDiv-border-top">￥${data[i].productTotal}</p>`
                                }

                            }
                            let markup = "<div class='drugDiv-outer'>"+str+"</div>";
                            container.append(markup);
                        }
                    },
                    {
                        caption: "订单状态",
                        dataField: "status",
                        alignment:'center',
                        allowSorting: false,
                        width:100,
                        cellTemplate: (container, options) => {
                            container.append("<div id='orderStatus1'/>");
                            let text = '';
                            switch (options.data.status) {
                                case 1:
                                    text = '待支付'
                                    break;
                                case 2:
                                    text = '待发货'
                                    break;
                                case 3:
                                    text = '待收货'
                                    break;
                                case 4:
                                    text = '退货申请中'
                                    break;
                                case 5:
                                    text = '同意退货'
                                    break;
                                case 6:
                                    text = '交易完成'
                                    break;
                                case 7:
                                    text = '退款完成'
                                    break;
                                case 9:
                                    text = '交易关闭'
                                    break;
                                default:
                                    break;
                            }
                            let opbtn = new (Vue.component('OpBtn'));
                            opbtn.items = [
                                { text: text, isJump: false,color:'#333'},
                                { text: '订单详情', isJump: true,color:'#2d8cf0', id: options.data, click:this.orderDetail},
                            ];
                            opbtn.$mount('#orderStatus1');
                        }
                    },
                    {
                        caption: "订单执行药店",
                        allowSorting: false,
                        dataField: "drugstoreName",
                        // width:100,
                    },
                    {
                        caption: "患者姓名",
                        allowSorting: false,
                        dataField: "receiver",
                        width:100,
                    },
                    {
                        caption: "创建时间",
                        dataField: "createTime",
                        width:150
                    },
                    {
                        caption: "购药方式",
                        allowSorting: false,
                        dataField: "dispatchType",
                        lookup: {
                            dataSource: this.enum.dispatchType,
                            displayExpr: 'text',
                            valueExpr: 'id',
                        },
                        width:80
                    },
                    {
                        caption: "实收款",
                        allowSorting: false,
                        alignment:'center',
                        dataField: "payMoney",
                        width:120,
                        cellTemplate: (container, options) => {
                            container.append("<div id='pm1'/>");
                            let opbtn = new (Vue.component('OpBtn'));
                            let text1 = "￥"+options.data.payMoney+"";
                            if(options.data.dispatchFee){
                                let text2 = "(含配送费￥"+options.data.dispatchFee+")";
                                opbtn.items = [
                                    { text: text1, isJump: false,color:'#333'},
                                    { text: text2, isJump: false,color:'#333'},
                                ];
                            }else{
                                opbtn.items = [
                                    { text: text1, isJump: false,color:'#333'}
                                ];
                            }

                            opbtn.$mount('#pm1');
                        }
                    },
                ]
            }).dxDataGrid("instance");
            //待配送
            this.notDeliverGrid = $("#notDeliverGrid").dxDataGrid({
                showRowLines: true,
                showBorders: true,
                columnAutoWidth: true,
                columnFixing: {
                    enabled: true
                },
                dataSource: {
                    store: this.notDeliverGridData
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
                        caption: "订单编号",
                        dataField: "orderCode",
                        width:150
                    },
                    {
                        caption: "药品",
                        dataField: "productName",
                        allowSorting: false,
                        width:500,
                        cellTemplate:function(container, options) {
                            let data = options.data.product;
                            let str = '';
                            let divHeight;
                            if(data.length*33<52){
                                divHeight = 52/data.length + 'px'
                            }else{
                                divHeight = `calc(100%/${data.length})`
                            }
                            for(let i =0; i<data.length; i++){
                                let source = '';
                                if(data[i].recipeSources){source = data[i].recipeSources}
                                if(i == 0){
                                    str+= `
                                        <div style="height:${divHeight};width:30%" class="drugDiv drugDiv-padding" title=${data[i].productName}>${data[i].productName}</div>
                                        <div style="height:${divHeight};width:20%" class="drugDiv drugDiv-padding" title=${data[i].spec}>${data[i].spec}</div>
                                        <div style="height:${divHeight};width:25%" class="drugDiv drugDiv-padding" title=${data[i].factory}>${data[i].factory}</div>
                                        <div style="height:${divHeight};width:25%" class="drugDiv drugDiv-last drugDiv-padding" title=${source}>${source}</div>
                                        <div style="clear: both"></div>
                                    `
                                }else{
                                    str+= `
                                        <div style="height:${divHeight};width:30%" class="drugDiv drugDiv-border-top drugDiv-padding" title=${data[i].productName}>${data[i].productName}</div>
                                        <div style="height:${divHeight};width:20%" class="drugDiv drugDiv-border-top drugDiv-padding" title=${data[i].spec}>${data[i].spec}</div>
                                        <div style="height:${divHeight};width:25%" class="drugDiv drugDiv-border-top drugDiv-padding" title=${data[i].factory}>${data[i].factory}</div>
                                        <div style="height:${divHeight};width:25%" class="drugDiv drugDiv-last drugDiv-border-top drugDiv-padding" title=${source}>${source}</div>
                                        <div style="clear: both"></div>
                                    `
                                }
                            }
                            let markup = `<div class='drugDiv-outer'>${str}</div>`;
                            container.append(markup);
                        }
                    },
                    {
                        caption: "单价",
                        dataField: "price",
                        allowSorting: false,
                        width:70,
                        cellTemplate:function(container, options) {
                            let data = options.data.product;
                            let str = '';
                            let divHeight;
                            if(data.length*33<52){
                                divHeight = 52/data.length + 'px'
                            }else{
                                divHeight = `calc(100%/${data.length})`
                            }
                            for(let i=0;i<data.length;i++){
                                if(i==0){
                                    str+=`<div style='height:${divHeight};' class="drugDiv-padding">￥${data[i].price}</div>`
                                }else{
                                    str+=`<div style='height:${divHeight};' class="drugDiv-border-top drugDiv-padding">￥${data[i].price}</div>`
                                }

                            }
                            let markup = "<div class='drugDiv-outer'>"+str+"</div>";
                            container.append(markup);
                        }
                    },
                    {
                        caption: "数量",
                        dataField: "num",
                        allowSorting: false,
                        width:50,
                        cellTemplate:function(container, options) {
                            let data = options.data.product;
                            let str = '';
                            let divHeight;
                            if(data.length*33<52){
                                divHeight = 52/data.length + 'px'
                            }else{
                                divHeight = `calc(100%/${data.length})`
                            }
                            for(let i=0;i<data.length;i++){
                                if(i==0){
                                    str+=`<p style='height:${divHeight};' class="drugDiv-text drugDiv-padding">${data[i].sum}${data[i].packUnit}</p>`
                                }else{
                                    str+=`<p style='height:${divHeight};' class="drugDiv-padding drugDiv-border-top drugDiv-text">${data[i].sum}${data[i].packUnit}</p>`
                                }

                            }
                            let markup = "<div class='drugDiv-outer'>"+str+"</div>";
                            container.append(markup);
                        }
                    },
                    {
                        caption: "售价",
                        dataField: "productTotal",
                        allowSorting: false,
                        width:70,
                        cellTemplate:function(container, options) {
                            let data = options.data.product;
                            let str = '';
                            let divHeight;
                            if(data.length*33<52){
                                divHeight = 52/data.length + 'px'
                            }else{
                                divHeight = `calc(100%/${data.length})`
                            }
                            for(let i=0;i<data.length;i++){
                                if(i==0){
                                    str+=`<p style='height:${divHeight};' class="drugDiv-padding">￥${data[i].productTotal}</p>`
                                }else{
                                    str+=`<p style='height:${divHeight};' class="drugDiv-padding drugDiv-border-top">￥${data[i].productTotal}</p>`
                                }

                            }
                            let markup = "<div class='drugDiv-outer'>"+str+"</div>";
                            container.append(markup);
                        }
                    },
                    {
                        caption: "订单状态",
                        dataField: "status",
                        alignment:'center',
                        allowSorting: false,
                        width:100,
                        cellTemplate: (container, options) => {
                            container.append("<div id='orderStatus2'/>");
                            let text = '';
                            switch (options.data.status) {
                                case 1:
                                    text = '待支付'
                                    break;
                                case 2:
                                    text = '待发货'
                                    break;
                                case 3:
                                    text = '待收货'
                                    break;
                                case 4:
                                    text = '退货申请中'
                                    break;
                                case 5:
                                    text = '同意退货'
                                    break;
                                case 6:
                                    text = '交易完成'
                                    break;
                                case 7:
                                    text = '退款完成'
                                    break;
                                case 9:
                                    text = '交易关闭'
                                    break;
                                default:
                                    break;
                            }
                            let opbtn = new (Vue.component('OpBtn'));
                            opbtn.items = [
                                { text: text, isJump: false,color:'#333', id: options.data,},
                                { text: '订单详情', isJump: true,color:'#2d8cf0', id: options.data, click:this.orderDetail},
                            ];
                            opbtn.$mount('#orderStatus2');
                        }
                    },
                    {
                        caption: "订单执行药店",
                        allowSorting: false,
                        dataField: "drugstoreName",
                        // width:100,
                    },
                    {
                        caption: "患者姓名",
                        allowSorting: false,
                        dataField: "receiver",
                        width:100,
                    },
                    {
                        caption: "创建时间",
                        dataField: "createTime",
                        width:150
                    },
                    {
                        caption: "购药方式",
                        allowSorting: false,
                        dataField: "dispatchType",
                        lookup: {
                            dataSource: this.enum.dispatchType,
                            displayExpr: 'text',
                            valueExpr: 'id',
                        },
                        width:80
                    },
                    {
                        caption: "实收款",
                        allowSorting: false,
                        alignment:'center',
                        dataField: "payMoney",
                        width:120,
                        cellTemplate: (container, options) => {
                            container.append("<div id='pm2'/>");
                            let opbtn = new (Vue.component('OpBtn'));
                            let text1 = "￥"+options.data.payMoney+"";
                            if(options.data.dispatchFee){
                                let text2 = "(含配送费￥"+options.data.dispatchFee+")";
                                opbtn.items = [
                                    { text: text1, isJump: false,color:'#333'},
                                    { text: text2, isJump: false,color:'#333'},
                                ];
                            }else{
                                opbtn.items = [
                                    { text: text1, isJump: false,color:'#333'}
                                ];
                            }

                            opbtn.$mount('#pm2');
                        }
                    },
                ]
            }).dxDataGrid("instance");
            //待收货
            this.deliverGrid = $("#deliverGrid").dxDataGrid({
                showRowLines: true,
                showBorders: true,
                columnAutoWidth: true,
                columnFixing: {
                    enabled: true
                },
                dataSource: {
                    store: this.deliverGridData
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
                        caption: "订单编号",
                        dataField: "orderCode",
                        width:150
                    },
                    {
                        caption: "药品",
                        dataField: "productName",
                        allowSorting: false,
                        width:500,
                        cellTemplate:function(container, options) {
                            let data = options.data.product;
                            let str = '';
                            let divHeight;
                            if(data.length*33<52){
                                divHeight = 52/data.length + 'px'
                            }else{
                                divHeight = `calc(100%/${data.length})`
                            }
                            for(let i =0; i<data.length; i++){
                                let source = '';
                                if(data[i].recipeSources){source = data[i].recipeSources}
                                if(i == 0){
                                    str+= `
                                        <div style="height:${divHeight};width:30%" class="drugDiv drugDiv-padding" title=${data[i].productName}>${data[i].productName}</div>
                                        <div style="height:${divHeight};width:20%" class="drugDiv drugDiv-padding" title=${data[i].spec}>${data[i].spec}</div>
                                        <div style="height:${divHeight};width:25%" class="drugDiv drugDiv-padding" title=${data[i].factory}>${data[i].factory}</div>
                                        <div style="height:${divHeight};width:25%" class="drugDiv drugDiv-last drugDiv-padding" title=${source}>${source}</div>
                                        <div style="clear: both"></div>
                                    `
                                }else{
                                    str+= `
                                        <div style="height:${divHeight};width:30%" class="drugDiv drugDiv-border-top drugDiv-padding" title=${data[i].productName}>${data[i].productName}</div>
                                        <div style="height:${divHeight};width:20%" class="drugDiv drugDiv-border-top drugDiv-padding" title=${data[i].spec}>${data[i].spec}</div>
                                        <div style="height:${divHeight};width:25%" class="drugDiv drugDiv-border-top drugDiv-padding" title=${data[i].factory}>${data[i].factory}</div>
                                        <div style="height:${divHeight};width:25%" class="drugDiv drugDiv-last drugDiv-border-top drugDiv-padding" title=${source}>${source}</div>
                                        <div style="clear: both"></div>
                                    `
                                }
                            }
                            let markup = `<div class='drugDiv-outer'>${str}</div>`;
                            container.append(markup);
                        }
                    },
                    {
                        caption: "单价",
                        dataField: "price",
                        allowSorting: false,
                        width:70,
                        cellTemplate:function(container, options) {
                            let data = options.data.product;
                            let str = '';
                            let divHeight;
                            if(data.length*33<52){
                                divHeight = 52/data.length + 'px'
                            }else{
                                divHeight = `calc(100%/${data.length})`
                            }
                            for(let i=0;i<data.length;i++){
                                if(i==0){
                                    str+=`<div style='height:${divHeight};' class="drugDiv-padding">￥${data[i].price}</div>`
                                }else{
                                    str+=`<div style='height:${divHeight};' class="drugDiv-border-top drugDiv-padding">￥${data[i].price}</div>`
                                }

                            }
                            let markup = "<div class='drugDiv-outer'>"+str+"</div>";
                            container.append(markup);
                        }
                    },
                    {
                        caption: "数量",
                        dataField: "num",
                        allowSorting: false,
                        width:50,
                        cellTemplate:function(container, options) {
                            let data = options.data.product;
                            let str = '';
                            let divHeight;
                            if(data.length*33<52){
                                divHeight = 52/data.length + 'px'
                            }else{
                                divHeight = `calc(100%/${data.length})`
                            }
                            for(let i=0;i<data.length;i++){
                                if(i==0){
                                    str+=`<p style='height:${divHeight};' class="drugDiv-text drugDiv-padding">${data[i].sum}${data[i].packUnit}</p>`
                                }else{
                                    str+=`<p style='height:${divHeight};' class="drugDiv-padding drugDiv-border-top drugDiv-text">${data[i].sum}${data[i].packUnit}</p>`
                                }

                            }
                            let markup = "<div class='drugDiv-outer'>"+str+"</div>";
                            container.append(markup);
                        }
                    },
                    {
                        caption: "售价",
                        dataField: "productTotal",
                        allowSorting: false,
                        width:70,
                        cellTemplate:function(container, options) {
                            let data = options.data.product;
                            let str = '';
                            let divHeight;
                            if(data.length*33<52){
                                divHeight = 52/data.length + 'px'
                            }else{
                                divHeight = `calc(100%/${data.length})`
                            }
                            for(let i=0;i<data.length;i++){
                                if(i==0){
                                    str+=`<p style='height:${divHeight};' class="drugDiv-padding">￥${data[i].productTotal}</p>`
                                }else{
                                    str+=`<p style='height:${divHeight};' class="drugDiv-padding drugDiv-border-top">￥${data[i].productTotal}</p>`
                                }

                            }
                            let markup = "<div class='drugDiv-outer'>"+str+"</div>";
                            container.append(markup);
                        }
                    },
                    {
                        caption: "订单状态",
                        dataField: "status",
                        alignment:'center',
                        allowSorting: false,
                        width:100,
                        cellTemplate: (container, options) => {
                            container.append("<div id='orderStatus3'/>");
                            let text = '';
                            switch (options.data.status) {
                                case 1:
                                    text = '待支付'
                                    break;
                                case 2:
                                    text = '待发货'
                                    break;
                                case 3:
                                    text = '待收货'
                                    break;
                                case 4:
                                    text = '退货申请中'
                                    break;
                                case 5:
                                    text = '同意退货'
                                    break;
                                case 6:
                                    text = '交易完成'
                                    break;
                                case 7:
                                    text = '退款完成'
                                    break;
                                case 9:
                                    text = '交易关闭'
                                    break;
                                default:
                                    break;
                            }
                            let opbtn = new (Vue.component('OpBtn'));
                            opbtn.items = [
                                { text: text, isJump: false,color:'#333'},
                                { text: '订单详情', isJump: true,color:'#2d8cf0', id: options.data, click:this.orderDetail},
                            ];
                            opbtn.$mount('#orderStatus3');
                        }
                    },
                    {
                        caption: "订单执行药店",
                        allowSorting: false,
                        dataField: "drugstoreName",
                        // width:100,
                    },
                    {
                        caption: "患者姓名",
                        allowSorting: false,
                        dataField: "receiver",
                        width:100,
                    },
                    {
                        caption: "创建时间",
                        dataField: "createTime",
                        width:150
                    },
                    {
                        caption: "购药方式",
                        allowSorting: false,
                        dataField: "dispatchType",
                        lookup: {
                            dataSource: this.enum.dispatchType,
                            displayExpr: 'text',
                            valueExpr: 'id',
                        },
                        width:80
                    },
                    {
                        caption: "实收款",
                        allowSorting: false,
                        alignment:'center',
                        dataField: "payMoney",
                        width:120,
                        cellTemplate: (container, options) => {
                            container.append("<div id='pm'/>");
                            let opbtn = new (Vue.component('OpBtn'));
                            let text1 = "￥"+options.data.payMoney+"";
                            if(options.data.dispatchFee){
                                let text2 = "(含配送费￥"+options.data.dispatchFee+")";
                                opbtn.items = [
                                    { text: text1, isJump: false,color:'#333'},
                                    { text: text2, isJump: false,color:'#333'},
                                ];
                            }else{
                                opbtn.items = [
                                    { text: text1, isJump: false,color:'#333'}
                                ];
                            }

                            opbtn.$mount('#pm');
                        }
                    },
                ]
            }).dxDataGrid("instance");
            //已完成
            this.finishGrid = $("#finishGrid").dxDataGrid({
                showRowLines: true,
                showBorders: true,
                columnAutoWidth: true,
                columnFixing: {
                    enabled: true
                },
                dataSource: {
                    store: this.finishGridData
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
                        caption: "订单编号",
                        dataField: "orderCode",
                        width:150
                    },
                    {
                        caption: "药品",
                        dataField: "productName",
                        allowSorting: false,
                        width:500,
                        cellTemplate:function(container, options) {
                            let data = options.data.product;
                            let str = '';
                            let divHeight;
                            if(data.length*33<52){
                                divHeight = 52/data.length + 'px'
                            }else{
                                divHeight = `calc(100%/${data.length})`
                            }
                            for(let i =0; i<data.length; i++){
                                let source = '';
                                if(data[i].recipeSources){source = data[i].recipeSources}
                                if(i == 0){
                                    str+= `
                                        <div style="height:${divHeight};width:30%" class="drugDiv drugDiv-padding" title=${data[i].productName}>${data[i].productName}</div>
                                        <div style="height:${divHeight};width:20%" class="drugDiv drugDiv-padding" title=${data[i].spec}>${data[i].spec}</div>
                                        <div style="height:${divHeight};width:25%" class="drugDiv drugDiv-padding" title=${data[i].factory}>${data[i].factory}</div>
                                        <div style="height:${divHeight};width:25%" class="drugDiv drugDiv-last drugDiv-padding" title=${source}>${source}</div>
                                        <div style="clear: both"></div>
                                    `
                                }else{
                                    str+= `
                                        <div style="height:${divHeight};width:30%" class="drugDiv drugDiv-border-top drugDiv-padding" title=${data[i].productName}>${data[i].productName}</div>
                                        <div style="height:${divHeight};width:20%" class="drugDiv drugDiv-border-top drugDiv-padding" title=${data[i].spec}>${data[i].spec}</div>
                                        <div style="height:${divHeight};width:25%" class="drugDiv drugDiv-border-top drugDiv-padding" title=${data[i].factory}>${data[i].factory}</div>
                                        <div style="height:${divHeight};width:25%" class="drugDiv drugDiv-last drugDiv-border-top drugDiv-padding" title=${source}>${source}</div>
                                        <div style="clear: both"></div>
                                    `
                                }
                            }
                            let markup = `<div class='drugDiv-outer'>${str}</div>`;
                            container.append(markup);
                        }
                    },
                    {
                        caption: "单价",
                        dataField: "price",
                        allowSorting: false,
                        width:70,
                        cellTemplate:function(container, options) {
                            let data = options.data.product;
                            let str = '';
                            let divHeight;
                            if(data.length*33<52){
                                divHeight = 52/data.length + 'px'
                            }else{
                                divHeight = `calc(100%/${data.length})`
                            }
                            for(let i=0;i<data.length;i++){
                                if(i==0){
                                    str+=`<div style='height:${divHeight};' class="drugDiv-padding">￥${data[i].price}</div>`
                                }else{
                                    str+=`<div style='height:${divHeight};' class="drugDiv-border-top drugDiv-padding">￥${data[i].price}</div>`
                                }

                            }
                            let markup = "<div class='drugDiv-outer'>"+str+"</div>";
                            container.append(markup);
                        }
                    },
                    {
                        caption: "数量",
                        dataField: "num",
                        allowSorting: false,
                        width:50,
                        cellTemplate:function(container, options) {
                            let data = options.data.product;
                            let str = '';
                            let divHeight;
                            if(data.length*33<52){
                                divHeight = 52/data.length + 'px'
                            }else{
                                divHeight = `calc(100%/${data.length})`
                            }
                            for(let i=0;i<data.length;i++){
                                if(i==0){
                                    str+=`<p style='height:${divHeight};' class="drugDiv-text drugDiv-padding">${data[i].sum}${data[i].packUnit}</p>`
                                }else{
                                    str+=`<p style='height:${divHeight};' class="drugDiv-padding drugDiv-border-top drugDiv-text">${data[i].sum}${data[i].packUnit}</p>`
                                }

                            }
                            let markup = "<div class='drugDiv-outer'>"+str+"</div>";
                            container.append(markup);
                        }
                    },
                    {
                        caption: "售价",
                        dataField: "productTotal",
                        allowSorting: false,
                        width:70,
                        cellTemplate:function(container, options) {
                            let data = options.data.product;
                            let str = '';
                            let divHeight;
                            if(data.length*33<52){
                                divHeight = 52/data.length + 'px'
                            }else{
                                divHeight = `calc(100%/${data.length})`
                            }
                            for(let i=0;i<data.length;i++){
                                if(i==0){
                                    str+=`<p style='height:${divHeight};' class="drugDiv-padding">￥${data[i].productTotal}</p>`
                                }else{
                                    str+=`<p style='height:${divHeight};' class="drugDiv-padding drugDiv-border-top">￥${data[i].productTotal}</p>`
                                }

                            }
                            let markup = "<div class='drugDiv-outer'>"+str+"</div>";
                            container.append(markup);
                        }
                    },
                    {
                        caption: "订单状态",
                        dataField: "status",
                        alignment:'center',
                        allowSorting: false,
                        width:100,
                        cellTemplate: (container, options) => {
                            container.append("<div id='orderStatus4'/>");
                            let text = '';
                            switch (options.data.status) {
                                case 1:
                                    text = '待支付'
                                    break;
                                case 2:
                                    text = '待发货'
                                    break;
                                case 3:
                                    text = '待收货'
                                    break;
                                case 4:
                                    text = '退货申请中'
                                    break;
                                case 5:
                                    text = '同意退货'
                                    break;
                                case 6:
                                    text = '交易完成'
                                    break;
                                case 7:
                                    text = '退款完成'
                                    break;
                                case 9:
                                    text = '交易关闭'
                                    break;
                                default:
                                    break;
                            }
                            let opbtn = new (Vue.component('OpBtn'));
                            opbtn.items = [
                                { text: text, isJump: false,color:'#333'},
                                { text: '订单详情', isJump: true,color:'#2d8cf0', id: options.data, click:this.orderDetail},
                            ];
                            opbtn.$mount('#orderStatus4');
                        }
                    },
                    {
                        caption: "订单执行药店",
                        allowSorting: false,
                        dataField: "drugstoreName",
                        // width:100,
                    },
                    {
                        caption: "患者姓名",
                        allowSorting: false,
                        dataField: "receiver",
                        width:100,
                    },
                    {
                        caption: "创建时间",
                        dataField: "createTime",
                        width:150
                    },
                    {
                        caption: "购药方式",
                        allowSorting: false,
                        dataField: "dispatchType",
                        lookup: {
                            dataSource: this.enum.dispatchType,
                            displayExpr: 'text',
                            valueExpr: 'id',
                        },
                        width:80
                    },
                    {
                        caption: "实收款",
                        allowSorting: false,
                        alignment:'center',
                        dataField: "payMoney",
                        width:120,
                        cellTemplate: (container, options) => {
                            container.append("<div id='pm4'/>");
                            let opbtn = new (Vue.component('OpBtn'));
                            let text1 = "￥"+options.data.payMoney+"";
                            if(options.data.dispatchFee){
                                let text2 = "(含配送费￥"+options.data.dispatchFee+")";
                                opbtn.items = [
                                    { text: text1, isJump: false,color:'#333'},
                                    { text: text2, isJump: false,color:'#333'},
                                ];
                            }else{
                                opbtn.items = [
                                    { text: text1, isJump: false,color:'#333'}
                                ];
                            }

                            opbtn.$mount('#pm4');
                        }
                    },
                ]
            }).dxDataGrid("instance");
            //退款
            this.refundGrid = $("#refundGrid").dxDataGrid({
                showRowLines: true,
                showBorders: true,
                columnAutoWidth: true,
                columnFixing: {
                    enabled: true
                },
                dataSource: {
                    store: this.refundGridData
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
                        caption: "订单编号",
                        dataField: "orderCode",
                        width:150
                    },
                    {
                        caption: "药品",
                        dataField: "productName",
                        allowSorting: false,
                        width:500,
                        cellTemplate:function(container, options) {
                            let data = options.data.product;
                            let str = '';
                            let divHeight,baseHeight;
                            // if(options.data.returnType == 1){
                            //     baseHeight = 90
                            // }else{
                                baseHeight = 71
                            // }
                            if(data.length*33<baseHeight){
                                divHeight = baseHeight/data.length + 'px'
                            }else{
                                divHeight = `calc(100%/${data.length})`
                            }
                            for(let i =0; i<data.length; i++){
                                let source = '';
                                if(data[i].recipeSources){source = data[i].recipeSources}
                                if(i == 0){
                                    str+= `
                                        <div style="height:${divHeight};width:30%" class="drugDiv drugDiv-padding" title=${data[i].productName}>${data[i].productName}</div>
                                        <div style="height:${divHeight};width:20%" class="drugDiv drugDiv-padding" title=${data[i].spec}>${data[i].spec}</div>
                                        <div style="height:${divHeight};width:25%" class="drugDiv drugDiv-padding" title=${data[i].factory}>${data[i].factory}</div>
                                        <div style="height:${divHeight};width:25%" class="drugDiv drugDiv-last drugDiv-padding" title=${source}>${source}</div>
                                        <div style="clear: both"></div>
                                    `
                                }else{
                                    str+= `
                                        <div style="height:${divHeight};width:30%" class="drugDiv drugDiv-border-top drugDiv-padding" title=${data[i].productName}>${data[i].productName}</div>
                                        <div style="height:${divHeight};width:20%" class="drugDiv drugDiv-border-top drugDiv-padding" title=${data[i].spec}>${data[i].spec}</div>
                                        <div style="height:${divHeight};width:25%" class="drugDiv drugDiv-border-top drugDiv-padding" title=${data[i].factory}>${data[i].factory}</div>
                                        <div style="height:${divHeight};width:25%" class="drugDiv drugDiv-last drugDiv-border-top drugDiv-padding" title=${source}>${source}</div>
                                        <div style="clear: both"></div>
                                    `
                                }
                            }
                            let markup = `<div class='drugDiv-outer'>${str}</div>`;
                            container.append(markup);
                        }
                    },
                    {
                        caption: "单价",
                        dataField: "price",
                        allowSorting: false,
                        width:70,
                        cellTemplate:function(container, options) {
                            let data = options.data.product;
                            let str = '';
                            let divHeight,baseHeight;
                            // if(options.data.returnType == 1){
                            //     baseHeight = 90
                            // }else{
                                baseHeight = 71
                            // }
                            if(data.length*33<baseHeight){
                                divHeight = baseHeight/data.length + 'px'
                            }else{
                                divHeight = `calc(100%/${data.length})`
                            }
                            for(let i=0;i<data.length;i++){
                                if(i==0){
                                    str+=`<div style='height:${divHeight};' class="drugDiv-padding">￥${data[i].price}</div>`
                                }else{
                                    str+=`<div style='height:${divHeight};' class="drugDiv-border-top drugDiv-padding">￥${data[i].price}</div>`
                                }

                            }
                            let markup = "<div class='drugDiv-outer'>"+str+"</div>";
                            container.append(markup);
                        }
                    },
                    {
                        caption: "数量",
                        dataField: "num",
                        allowSorting: false,
                        width:50,
                        cellTemplate:function(container, options) {
                            let data = options.data.product;
                            let str = '';
                            let divHeight,baseHeight;
                            // if(options.data.returnType == 1){
                            //     baseHeight = 90
                            // }else{
                                baseHeight = 71
                            // }
                            if(data.length*33<baseHeight){
                                divHeight = baseHeight/data.length + 'px'
                            }else{
                                divHeight = `calc(100%/${data.length})`
                            }
                            for(let i=0;i<data.length;i++){
                                if(i==0){
                                    str+=`<p style='height:${divHeight};' class="drugDiv-text drugDiv-padding">${data[i].sum}${data[i].packUnit}</p>`
                                }else{
                                    str+=`<p style='height:${divHeight};' class="drugDiv-padding drugDiv-border-top drugDiv-text">${data[i].sum}${data[i].packUnit}</p>`
                                }

                            }
                            let markup = "<div class='drugDiv-outer'>"+str+"</div>";
                            container.append(markup);
                        }
                    },
                    {
                        caption: "售价",
                        dataField: "productTotal",
                        allowSorting: false,
                        width:70,
                        cellTemplate:function(container, options) {
                            let data = options.data.product;
                            let str = '';
                            let divHeight,baseHeight;
                            // if(options.data.returnType == 1){
                            //     baseHeight = 90
                            // }else{
                                baseHeight = 71
                            // }
                            if(data.length*33<baseHeight){
                                divHeight = baseHeight/data.length + 'px'
                            }else{
                                divHeight = `calc(100%/${data.length})`
                            }
                            for(let i=0;i<data.length;i++){
                                if(i==0){
                                    str+=`<p style='height:${divHeight};' class="drugDiv-padding">￥${data[i].productTotal}</p>`
                                }else{
                                    str+=`<p style='height:${divHeight};' class="drugDiv-padding drugDiv-border-top">￥${data[i].productTotal}</p>`
                                }

                            }
                            let markup = "<div class='drugDiv-outer'>"+str+"</div>";
                            container.append(markup);
                        }
                    },
                    {
                        caption: "订单状态",
                        dataField: "status",
                        alignment:'center',
                        allowSorting: false,
                        width:100,
                        cellTemplate: (container, options) => {
                            container.append("<div id='orderStatus5'/>");
                            let text = '',text1;
                            switch (options.data.status) {
                                case 1:
                                    text = '待支付'
                                    break;
                                case 2:
                                    text = '待发货'
                                    break;
                                case 3:
                                    text = '待收货'
                                    break;
                                case 4:
                                    text = '退货申请中'
                                    break;
                                case 5:
                                    text = '同意退货'
                                    break;
                                case 6:
                                    text = '交易完成'
                                    break;
                                case 7:
                                    text = '退款完成'
                                    break;
                                case 9:
                                    text = '交易关闭'
                                    break;
                                default:
                                    break;
                            }
                            switch (options.data.returnType) {
                                case 1:
                                    text1 = '(仅退款)'
                                    break;
                                case 2:
                                    text1 = '(退货退款)'
                                    break;
                                default:
                                    break;
                            }
                            let opbtn = new (Vue.component('OpBtn'));
                            opbtn.items = [
                                { text: text, isJump: false,color:'#333',},
                                { text: text1, isJump: false,color:'#333',},
                                { text: '订单详情', isJump: true,color:'#2d8cf0', id: options.data, click:this.orderDetail},
                            ];
                            // if(options.data.returnType == 1){
                            //     opbtn.items.push({ text: '退款', isJump: 'pop',color:'#2d8cf0', tip:'确认退款吗？', id: options.data, click:this.returnMoney},)
                            // }
                            opbtn.$mount('#orderStatus5');
                        }
                    },
                    {
                        caption: "订单执行药店",
                        allowSorting: false,
                        dataField: "drugstoreName",
                        // width:100,
                    },
                    {
                        caption: "患者姓名",
                        allowSorting: false,
                        dataField: "receiver",
                        width:100,
                    },
                    {
                        caption: "创建时间",
                        dataField: "createTime",
                        width:150
                    },
                    {
                        caption: "购药方式",
                        allowSorting: false,
                        dataField: "dispatchType",
                        lookup: {
                            dataSource: this.enum.dispatchType,
                            displayExpr: 'text',
                            valueExpr: 'id',
                        },
                        width:80
                    },
                    {
                        caption: "实收款",
                        alignment:'center',
                        allowSorting: false,
                        dataField: "payMoney",
                        width:120,
                        cellTemplate: (container, options) => {
                            container.append("<div id='pm5'/>");
                            let opbtn = new (Vue.component('OpBtn'));
                            let text1 = "￥"+options.data.payMoney+"";
                            if(options.data.dispatchFee){
                                let text2 = "(含配送费￥"+options.data.dispatchFee+")";
                                opbtn.items = [
                                    { text: text1, isJump: false,color:'#333'},
                                    { text: text2, isJump: false,color:'#333'},
                                ];
                            }else{
                                opbtn.items = [
                                    { text: text1, isJump: false,color:'#333'}
                                ];
                            }

                            opbtn.$mount('#pm5');
                        }
                    },
                ]
            }).dxDataGrid("instance");
            //已退款
            this.refundedGrid = $("#refundedGrid").dxDataGrid({
                showRowLines: true,
                showBorders: true,
                columnAutoWidth: true,
                columnFixing: {
                    enabled: true
                },
                dataSource: {
                    store: this.refundedGridData
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
                        caption: "订单编号",
                        dataField: "orderCode",
                        width:150
                    },
                    {
                        caption: "药品",
                        dataField: "productName",
                        allowSorting: false,
                        width:500,
                        cellTemplate:function(container, options) {
                            let data = options.data.product;
                            let str = '';
                            let divHeight;
                            if(data.length*33<71){
                                divHeight = 71/data.length + 'px'
                            }else{
                                divHeight = `calc(100%/${data.length})`
                            }
                            for(let i =0; i<data.length; i++){
                                let source = '';
                                if(data[i].recipeSources){source = data[i].recipeSources}
                                if(i == 0){
                                    str+= `
                                        <div style="height:${divHeight};width:30%" class="drugDiv drugDiv-padding" title=${data[i].productName}>${data[i].productName}</div>
                                        <div style="height:${divHeight};width:20%" class="drugDiv drugDiv-padding" title=${data[i].spec}>${data[i].spec}</div>
                                        <div style="height:${divHeight};width:25%" class="drugDiv drugDiv-padding" title=${data[i].factory}>${data[i].factory}</div>
                                        <div style="height:${divHeight};width:25%" class="drugDiv drugDiv-last drugDiv-padding" title=${source}>${source}</div>
                                        <div style="clear: both"></div>
                                    `
                                }else{
                                    str+= `
                                        <div style="height:${divHeight};width:30%" class="drugDiv drugDiv-border-top drugDiv-padding" title=${data[i].productName}>${data[i].productName}</div>
                                        <div style="height:${divHeight};width:20%" class="drugDiv drugDiv-border-top drugDiv-padding" title=${data[i].spec}>${data[i].spec}</div>
                                        <div style="height:${divHeight};width:25%" class="drugDiv drugDiv-border-top drugDiv-padding" title=${data[i].factory}>${data[i].factory}</div>
                                        <div style="height:${divHeight};width:25%" class="drugDiv drugDiv-last drugDiv-border-top drugDiv-padding" title=${source}>${source}</div>
                                        <div style="clear: both"></div>
                                    `
                                }
                            }
                            let markup = `<div class='drugDiv-outer'>${str}</div>`;
                            container.append(markup);
                        }
                    },
                    {
                        caption: "单价",
                        dataField: "price",
                        allowSorting: false,
                        width:70,
                        cellTemplate:function(container, options) {
                            let data = options.data.product;
                            let str = '';
                            let divHeight;
                            if(data.length*33<71){
                                divHeight = 71/data.length + 'px'
                            }else{
                                divHeight = `calc(100%/${data.length})`
                            }
                            for(let i=0;i<data.length;i++){
                                if(i==0){
                                    str+=`<div style='height:${divHeight};' class="drugDiv-padding">￥${data[i].price}</div>`
                                }else{
                                    str+=`<div style='height:${divHeight};' class="drugDiv-border-top drugDiv-padding">￥${data[i].price}</div>`
                                }

                            }
                            let markup = "<div class='drugDiv-outer'>"+str+"</div>";
                            container.append(markup);
                        }
                    },
                    {
                        caption: "数量",
                        dataField: "num",
                        allowSorting: false,
                        width:50,
                        cellTemplate:function(container, options) {
                            let data = options.data.product;
                            let str = '';
                            let divHeight;
                            if(data.length*33<71){
                                divHeight = 71/data.length + 'px'
                            }else{
                                divHeight = `calc(100%/${data.length})`
                            }
                            for(let i=0;i<data.length;i++){
                                if(i==0){
                                    str+=`<p style='height:${divHeight};' class="drugDiv-text drugDiv-padding">${data[i].sum}${data[i].packUnit}</p>`
                                }else{
                                    str+=`<p style='height:${divHeight};' class="drugDiv-padding drugDiv-border-top drugDiv-text">${data[i].sum}${data[i].packUnit}</p>`
                                }

                            }
                            let markup = "<div class='drugDiv-outer'>"+str+"</div>";
                            container.append(markup);
                        }
                    },
                    {
                        caption: "售价",
                        dataField: "productTotal",
                        allowSorting: false,
                        width:70,
                        cellTemplate:function(container, options) {
                            let data = options.data.product;
                            let str = '';
                            let divHeight;
                            if(data.length*33<71){
                                divHeight = 71/data.length + 'px'
                            }else{
                                divHeight = `calc(100%/${data.length})`
                            }
                            for(let i=0;i<data.length;i++){
                                if(i==0){
                                    str+=`<p style='height:${divHeight};' class="drugDiv-padding">￥${data[i].productTotal}</p>`
                                }else{
                                    str+=`<p style='height:${divHeight};' class="drugDiv-padding drugDiv-border-top">￥${data[i].productTotal}</p>`
                                }

                            }
                            let markup = "<div class='drugDiv-outer'>"+str+"</div>";
                            container.append(markup);
                        }
                    },
                    {
                        caption: "订单状态",
                        dataField: "status",
                        alignment:'center',
                        allowSorting: false,
                        width:100,
                        cellTemplate: (container, options) => {
                            container.append("<div id='orderStatus6'/>");
                            let text = '',text1;
                            switch (options.data.status) {
                                case 1:
                                    text = '待支付'
                                    break;
                                case 2:
                                    text = '待发货'
                                    break;
                                case 3:
                                    text = '待收货'
                                    break;
                                case 4:
                                    text = '退货申请中'
                                    break;
                                case 5:
                                    text = '同意退货'
                                    break;
                                case 6:
                                    text = '交易完成'
                                    break;
                                case 7:
                                    text = '退款完成'
                                    break;
                                case 9:
                                    text = '交易关闭'
                                    break;
                                default:
                                    break;
                            }
                            switch (options.data.returnType) {
                                case 1:
                                    text1 = '（仅退款）'
                                    break;
                                case 2:
                                    text1 = '（退货退款）'
                                    break;
                                default:
                                    break;
                            }
                            let opbtn = new (Vue.component('OpBtn'));
                            opbtn.items = [
                                { text: text, isJump: false,color:'#333',},
                                { text: text1, isJump: false,color:'#333',},
                                { text: '订单详情', isJump: true,color:'#2d8cf0', id: options.data, click:this.orderDetail},
                            ];
                            opbtn.$mount('#orderStatus6');
                        }
                    },
                    {
                        caption: "订单执行药店",
                        dataField: "drugstoreName",
                        allowSorting: false,
                        // width:100,
                    },
                    {
                        caption: "患者姓名",
                        dataField: "receiver",
                        allowSorting: false,
                        width:100,
                    },
                    {
                        caption: "创建时间",
                        dataField: "createTime",
                        width:150
                    },
                    {
                        caption: "购药方式",
                        dataField: "dispatchType",
                        allowSorting: false,
                        lookup: {
                            dataSource: this.enum.dispatchType,
                            displayExpr: 'text',
                            valueExpr: 'id',
                        },
                        width:80
                    },
                    {
                        caption: "实收款",
                        alignment:'center',
                        dataField: "payMoney",
                        allowSorting: false,
                        width:120,
                        cellTemplate: (container, options) => {
                            container.append("<div id='pm6'/>");
                            let opbtn = new (Vue.component('OpBtn'));
                            let text1 = "￥"+options.data.payMoney+"";
                            if(options.data.dispatchFee){
                                let text2 = "(含配送费￥"+options.data.dispatchFee+")";
                                opbtn.items = [
                                    { text: text1, isJump: false,color:'#333'},
                                    { text: text2, isJump: false,color:'#333'},
                                ];
                            }else{
                                opbtn.items = [
                                    { text: text1, isJump: false,color:'#333'}
                                ];
                            }

                            opbtn.$mount('#pm6');
                        }
                    },
                ]
            }).dxDataGrid("instance");
            //关闭订单
            this.closedGrid = $("#closedGrid").dxDataGrid({
                showRowLines: true,
                showBorders: true,
                columnAutoWidth: true,
                columnFixing: {
                    enabled: true
                },
                dataSource: {
                    store: this.closedGridData
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
                        caption: "订单编号",
                        dataField: "orderCode",
                        width:150
                    },
                    {
                        caption: "药品",
                        dataField: "productName",
                        allowSorting: false,
                        width:500,
                        cellTemplate:function(container, options) {
                            let data = options.data.product;
                            let str = '';
                            let divHeight;
                            if(data.length*33<52){
                                divHeight = 52/data.length + 'px'
                            }else{
                                divHeight = `calc(100%/${data.length})`
                            }
                            for(let i =0; i<data.length; i++){
                                let source = '';
                                if(data[i].recipeSources){source = data[i].recipeSources}
                                if(i == 0){
                                    str+= `
                                        <div style="height:${divHeight};width:30%" class="drugDiv drugDiv-padding" title=${data[i].productName}>${data[i].productName}</div>
                                        <div style="height:${divHeight};width:20%" class="drugDiv drugDiv-padding" title=${data[i].spec}>${data[i].spec}</div>
                                        <div style="height:${divHeight};width:25%" class="drugDiv drugDiv-padding" title=${data[i].factory}>${data[i].factory}</div>
                                        <div style="height:${divHeight};width:25%" class="drugDiv drugDiv-last drugDiv-padding" title=${source}>${source}</div>
                                        <div style="clear: both"></div>
                                    `
                                }else{
                                    str+= `
                                        <div style="height:${divHeight};width:30%" class="drugDiv drugDiv-border-top drugDiv-padding" title=${data[i].productName}>${data[i].productName}</div>
                                        <div style="height:${divHeight};width:20%" class="drugDiv drugDiv-border-top drugDiv-padding" title=${data[i].spec}>${data[i].spec}</div>
                                        <div style="height:${divHeight};width:25%" class="drugDiv drugDiv-border-top drugDiv-padding" title=${data[i].factory}>${data[i].factory}</div>
                                        <div style="height:${divHeight};width:25%" class="drugDiv drugDiv-last drugDiv-border-top drugDiv-padding" title=${source}>${source}</div>
                                        <div style="clear: both"></div>
                                    `
                                }
                            }
                            let markup = `<div class='drugDiv-outer'>${str}</div>`;
                            container.append(markup);
                        }
                    },
                    {
                        caption: "单价",
                        dataField: "price",
                        allowSorting: false,
                        width:70,
                        cellTemplate:function(container, options) {
                            let data = options.data.product;
                            let str = '';
                            let divHeight;
                            if(data.length*33<52){
                                divHeight = 52/data.length + 'px'
                            }else{
                                divHeight = `calc(100%/${data.length})`
                            }
                            for(let i=0;i<data.length;i++){
                                if(i==0){
                                    str+=`<div style='height:${divHeight};' class="drugDiv-padding">￥${data[i].price}</div>`
                                }else{
                                    str+=`<div style='height:${divHeight};' class="drugDiv-border-top drugDiv-padding">￥${data[i].price}</div>`
                                }

                            }
                            let markup = "<div class='drugDiv-outer'>"+str+"</div>";
                            container.append(markup);
                        }
                    },
                    {
                        caption: "数量",
                        dataField: "num",
                        allowSorting: false,
                        width:50,
                        cellTemplate:function(container, options) {
                            let data = options.data.product;
                            let str = '';
                            let divHeight;
                            if(data.length*33<52){
                                divHeight = 52/data.length + 'px'
                            }else{
                                divHeight = `calc(100%/${data.length})`
                            }
                            for(let i=0;i<data.length;i++){
                                if(i==0){
                                    str+=`<p style='height:${divHeight};' class="drugDiv-text drugDiv-padding">${data[i].sum}${data[i].packUnit}</p>`
                                }else{
                                    str+=`<p style='height:${divHeight};' class="drugDiv-padding drugDiv-border-top drugDiv-text">${data[i].sum}${data[i].packUnit}</p>`
                                }

                            }
                            let markup = "<div class='drugDiv-outer'>"+str+"</div>";
                            container.append(markup);
                        }
                    },
                    {
                        caption: "售价",
                        dataField: "productTotal",
                        allowSorting: false,
                        width:70,
                        cellTemplate:function(container, options) {
                            let data = options.data.product;
                            let str = '';
                            let divHeight;
                            if(data.length*33<52){
                                divHeight = 52/data.length + 'px'
                            }else{
                                divHeight = `calc(100%/${data.length})`
                            }
                            for(let i=0;i<data.length;i++){
                                if(i==0){
                                    str+=`<p style='height:${divHeight};' class="drugDiv-padding">￥${data[i].productTotal}</p>`
                                }else{
                                    str+=`<p style='height:${divHeight};' class="drugDiv-padding drugDiv-border-top">￥${data[i].productTotal}</p>`
                                }

                            }
                            let markup = "<div class='drugDiv-outer'>"+str+"</div>";
                            container.append(markup);
                        }
                    },
                    {
                        caption: "订单状态",
                        dataField: "status",
                        alignment:'center',
                        allowSorting: false,
                        width:100,
                        cellTemplate: (container, options) => {
                            container.append("<div id='orderStatus7'/>");
                            let text = '';
                            switch (options.data.status) {
                                case 1:
                                    text = '待支付'
                                    break;
                                case 2:
                                    text = '待发货'
                                    break;
                                case 3:
                                    text = '待收货'
                                    break;
                                case 4:
                                    text = '退货申请中'
                                    break;
                                case 5:
                                    text = '同意退货'
                                    break;
                                case 6:
                                    text = '交易完成'
                                    break;
                                case 7:
                                    text = '退款完成'
                                    break;
                                case 9:
                                    text = '交易关闭'
                                    break;
                                default:
                                    break;
                            }
                            let opbtn = new (Vue.component('OpBtn'));
                            opbtn.items = [
                                { text: text, isJump: false,color:'#333'},
                                { text: '订单详情', isJump: true,color:'#2d8cf0', id: options.data, click:this.orderDetail},
                            ];
                            opbtn.$mount('#orderStatus7');
                        }
                    },
                    {
                        caption: "订单执行药店",
                        dataField: "drugstoreName",
                        allowSorting: false,
                        // width:100,
                    },
                    {
                        caption: "患者姓名",
                        dataField: "receiver",
                        allowSorting: false,
                        width:100,
                    },
                    {
                        caption: "创建时间",
                        dataField: "createTime",
                        width:150
                    },
                    {
                        caption: "购药方式",
                        dataField: "dispatchType",
                        allowSorting: false,
                        lookup: {
                            dataSource: this.enum.dispatchType,
                            displayExpr: 'text',
                            valueExpr: 'id',
                        },
                        width:80
                    },
                    {
                        caption: "实收款",
                        alignment:'center',
                        dataField: "payMoney",
                        allowSorting: false,
                        width:120,
                        cellTemplate: (container, options) => {
                            container.append("<div id='pm7'/>");
                            let opbtn = new (Vue.component('OpBtn'));
                            let text1 = "￥"+options.data.payMoney+"";
                            if(options.data.dispatchFee){
                                let text2 = "(含配送费￥"+options.data.dispatchFee+")";
                                opbtn.items = [
                                    { text: text1, isJump: false,color:'#333'},
                                    { text: text2, isJump: false,color:'#333'},
                                ];
                            }else{
                                opbtn.items = [
                                    { text: text1, isJump: false,color:'#333'}
                                ];
                            }

                            opbtn.$mount('#pm7');
                        }
                    },
                ]
            }).dxDataGrid("instance");
        },
        methods:{
            search:function() {
                let ds;
                delete this.searchFormData.status;
                if(this.tabValue == 'all'){
                    ds = this.allOrderGrid.getDataSource()
                }else if(this.tabValue == 'payment'){
                    ds = this.paymentGrid.getDataSource();
                    this.searchFormData.status = 1
                }else if(this.tabValue == 'notDeliver'){
                    ds = this.notDeliverGrid.getDataSource();
                    this.searchFormData.status = 2
                }else if(this.tabValue == 'deliver'){
                    ds = this.deliverGrid.getDataSource();
                    this.searchFormData.status = 3
                }else if(this.tabValue == 'finish'){
                    ds = this.finishGrid.getDataSource();
                    this.searchFormData.status = 6
                }else if(this.tabValue == 'refund'){
                    ds = this.refundGrid.getDataSource();
                    this.searchFormData.status = 4
                }else if(this.tabValue == 'refunded'){
                    ds = this.refundedGrid.getDataSource();
                    this.searchFormData.status = 7
                }else if(this.tabValue == 'closed'){
                    ds = this.closedGrid.getDataSource();
                    this.searchFormData.status = 9
                }
                ds.loadOptions().searchData = this.searchFormData;
                ds.reload();
            },

            resetSearch:function() {
                delete this.searchFormData.status;
                this.$refs.creatTimeData.values = null;
                this.searchFormData.createTime = '';
                this.searchForm.resetValues();
                if(this.tabValue == 'all'){
                    this.allOrderGrid.refresh();
                }else if(this.tabValue == 'payment'){
                    this.paymentGrid.refresh();
                }else if(this.tabValue == 'notDeliver'){
                    this.notDeliverGrid.refresh();
                }else if(this.tabValue == 'deliver'){
                    this.deliverGrid.refresh();
                }else if(this.tabValue == 'finish'){
                    this.finishGrid.refresh();
                }else if(this.tabValue == 'refund'){
                    this.refundGrid.refresh();
                }else if(this.tabValue == 'refunded'){
                    this.refundedGrid.refresh();
                }else if(this.tabValue == 'closed'){
                    this.closedGrid.refresh();
                }
            },

            tabChange:function(name) {
                delete this.searchFormData.status;
                this.$refs.creatTimeData.values = [];
                this.searchFormData.createTime = '';
                this.searchForm.resetValues();
                if(name== 'all'){
                    this.allOrderGrid.refresh();
                }else if(name== 'payment'){
                    this.isLoadPaymentData = true;
                    this.paymentGrid.refresh();
                }else if(name == 'notDeliver'){
                    this.isLoadNotDeliverData = true;
                    this.notDeliverGrid.refresh();
                }else if(name == 'deliver'){
                    this.isLoadDeliverData = true;
                    this.deliverGrid.refresh();
                }else if(name == 'finish'){
                    this.isLoadFinishData = true;
                    this.finishGrid.refresh();
                }else if(name == 'refund'){
                    this.isLoadRefundData = true;
                    this.refundGrid.refresh();
                }else if(name == 'refunded'){
                    this.isLoadRefundedData = true;
                    this.refundedGrid.refresh();
                }else if(name == 'closed'){
                    this.isLoadCloseData = true;
                    this.closedGrid.refresh();
                }
            },
            orderDetail(data){
                this.$router.push({
                    name: 'order-info',
                    params: {order_id:data.orderId}
                });
            },
            returnMoney(data){
                let params = {};
                params.orderId = data.orderId;
                this.$post(return_money_url, params).then(res => {
                    if (res.code == '200') {
                        this.success('操作成功!', () => {
                            if(this.tabValue == 'all'){
                                this.allOrderGrid.refresh();
                            }else if(this.tabValue == 'refund'){
                                this.refundGrid.refresh();
                            }
                        });
                    } else {
                        //提示信息
                        this.warn(res.msg);
                    }
                }).catch(err => {
                    this.error(err);
                });
            },
            addDatePicker: function (data, itemElement) {
                itemElement.append('<div id=\'date-holder\'/>');
                let dateRange = new (Vue.component('DateRange'));
                dateRange.field = data;
                dateRange.$mount('#date-holder');
                dateRange.$parent = this;
                this.$refs.creatTimeData = dateRange;
            },
        }
    }
</script>