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
                </Tabs>
            </Row>
        </Card>
        <Modal v-model="modal.visible" :mask-closable="false" width="650" title="编辑数据">
            <p slot="header">
                <span v-if="modal.isNew">拒绝原因</span>
                <span v-else="modal.isNew">拒收原因</span>
            </p>
            <div id="rejectForm"></div>
            <div slot="footer">
                <Button type="text" @click="formCancle">取消</Button>
                <Button type="primary" :loading="modal.modal_loading" @click="save">保存</Button>
            </div>
        </Modal>
        <Modal v-model="userModal.visible" :mask-closable="false" width="650" title="编辑数据">
            <p slot="header">
                <span>配送人员</span>
            </p>
            <div style="margin-left: 20px">
                <RadioGroup v-model="vertical" vertical size="large">
                    <Radio :label="item.id" :key="item.id" v-for="item in userList">
                        <span>{{item.account}}&nbsp;&nbsp;{{item.name}}&nbsp;&nbsp;{{item.mobile}}</span>
                    </Radio>
                </RadioGroup>
            </div>

            <div slot="footer">
                <Button type="text" @click="formCancle">取消</Button>
                <Button type="primary" :loading="userModal.modal_loading" @click="submitUser">确定</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    import Vue from 'vue';
    let order_url = '/biz/bizOrder/getOrderPage';
    let return_money_url = '/biz/bizOrder/platformRefund';
    //发药
    let order_deliver_url = '/biz/bizOrder/deliverOrder';
    //配送完成
    let order_finish_deliver_url = '/biz/bizOrder/finishOrder';
    //同意退货
    let order_return_url = '/biz/bizOrder/returnAccept';
    //拒绝退货
    let order_refuse_return_url = '/biz/bizOrder/withdrawApply';
    //确认收药
    let get_drug_url = '/biz/bizOrder/returnRefund';
    //获取药店用户
    let store_user_url = '/biz/bizOrder/getDispatchUser';
    //患者拒收
    let patient_return_url = '/biz/bizOrder/reject';
    export default {
        data(){
            return{
                vertical:'',
                userList:[
                    {name:'张三',mobile:'13654254896',account:'345313',id:1},
                    {name:'张三',mobile:'13654254896',account:'345313',id:2},
                    {name:'张三',mobile:'13654254896',account:'345313',id:3},
                ],
                selectOrder:null,
                tabValue:'all',
                isLoadAllData:true,
                isLoadNotDeliverData:false,
                isLoadDeliverData:false,
                isLoadFinishData:false,
                isLoadRefundData:false,
                isLoadRefundedData:false,
                isLoadCloseData:false,
                searchForm:{},
                searchFormData:{},
                rejectForm:{},
                rejectFormData:{},
                modal:{
                    isNew:true,
                    visible:false,
                    modal_loading:false
                },
                userModal:{
                    visible:false,
                    modal_loading:false
                },
                allOrderGridData: new this.customstore({
                    load: (loadOptions) => {
                        return this.CommDs.loadPage(loadOptions, order_url, this.isLoadAllData, {exclude:[1,9]});
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
                        return this.CommDs.loadPage(loadOptions, order_url, this.isLoadRefundData, {state:[4,5]});
                    },
                }),
                refundedGridData: new this.customstore({
                    load: (loadOptions) => {
                        return this.CommDs.loadPage(loadOptions, order_url, this.isLoadRefundedData, {status:7});
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
                        dataField: 'receiveCode',
                        label: {
                            alignment: 'right',
                            text: '取药信息'
                        },
                    },{
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
                        width:400,
                        cellTemplate:function(container, options) {
                            let data = options.data.product;
                            let str = '';
                            let divHeight,baseHeight;
                            if(options.data.status == 2){
                                baseHeight = 71
                            }else if(options.data.status == 3){
                                baseHeight = 90
                            }else if(options.data.status == 4){
                                if(options.data.returnType == 2){
                                    baseHeight = 109
                                }else{
                                    baseHeight = 71
                                }
                            }else if(options.data.status == 5){
                                baseHeight = 109
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
                            if(options.data.status == 2){
                                baseHeight = 71
                            }else if(options.data.status == 3){
                                baseHeight = 90
                            }else if(options.data.status == 4){
                                if(options.data.returnType == 2){
                                    baseHeight = 109
                                }else{
                                    baseHeight = 71
                                }
                            }else if(options.data.status == 5){
                                baseHeight = 109
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
                            if(options.data.status == 2){
                                baseHeight = 71
                            }else if(options.data.status == 3){
                                baseHeight = 90
                            }else if(options.data.status == 4){
                                if(options.data.returnType == 2){
                                    baseHeight = 109
                                }else{
                                    baseHeight = 71
                                }
                            }else if(options.data.status == 5){
                                baseHeight = 109
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
                            if(options.data.status == 2){
                                baseHeight = 71
                            }else if(options.data.status == 3){
                                baseHeight = 90
                            }else if(options.data.status == 4){
                                if(options.data.returnType == 2){
                                    baseHeight = 109
                                }else{
                                    baseHeight = 71
                                }
                            }else if(options.data.status == 5){
                                baseHeight = 109
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
                            //1-待付款，2-待配送，3-配送中，4-退款中，6-已完成，7-已退款，9-交易关闭
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
                            if(options.data.status == 2){
                                opbtn.items = [
                                    { text: text, isJump: false,color:'#333', id: options.data,},
                                    { text: '订单详情', isJump: true,color:'#2d8cf0', id: options.data, click:this.orderDetail},
                                ];
                                if(options.data.dispatchType == 2){
                                    opbtn.items.push({ text: '发药', isJump: 'pop',color:'#2d8cf0', tip:'是否确认发药', id: options.data,click:this.deliver})
                                }else{
                                    opbtn.items.push({ text: '发药', isJump: true,color:'#2d8cf0', id: options.data,click:this.chooseMan})
                                }
                            }else if(options.data.status == 3){
                                opbtn.items = [
                                    { text: text, isJump: false,color:'#333'},
                                    { text: '订单详情', isJump: true,color:'#2d8cf0', id: options.data, click:this.orderDetail},
                                    { text: '配送完成', isJump: true,color:'#2d8cf0', id: options.data,click:this.finishOrder},
                                    { text: '患者拒收', isJump: true,color:'#2d8cf0', id: options.data,click:this.patientRefusal},
                                ];
                            }else if(options.data.status == 4){
                                opbtn.items = [
                                    { text: text, isJump: false,color:'#333',},
                                    { text: text1, isJump: false,color:'#333',},
                                    { text: '订单详情', isJump: true,color:'#2d8cf0', id: options.data, click:this.orderDetail},
                                ];
                                if(options.data.returnType == 2){
                                    opbtn.items.push(
                                        { text: '同意退货', isJump: 'pop', tip:'确认退货吗？',color:'#2d8cf0', id: options.data,click:this.agreeReturn},
                                        { text: '拒绝退货', isJump: 'pop', tip:'确认退款吗？',color:'#2d8cf0', id: options.data,click:this.refuse})
                                }
                            }else if(options.data.status == 5){
                                opbtn.items = [
                                    { text: text, isJump: false,color:'#333',},
                                    { text: text1, isJump: false,color:'#333',},
                                    { text: '订单详情', isJump: true,color:'#2d8cf0', id: options.data, click:this.orderDetail},
                                    { text: '确认收货', isJump: 'pop', tip:'确认收药！',color:'#2d8cf0', id: options.data, click:this.getDrug},
                                    { text: '拒绝收货', isJump: true,color:'#2d8cf0', id: options.data,click:this.refuse},
                                ];
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
                        caption: "取药信息",
                        allowSorting: false,
                        dataField: "receiveCode",
                        width:80,
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
            //待发药
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
                                        <div style="height:${divHeight};width:25%"" class="drugDiv drugDiv-border-top drugDiv-padding" title=${data[i].factory}>${data[i].factory}</div>
                                        <div style="height:${divHeight};width:25%"" class="drugDiv drugDiv-last drugDiv-border-top drugDiv-padding" title=${source}>${source}</div>
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
                            if(options.data.dispatchType == 2){
                                opbtn.items.push({ text: '发药', isJump: 'pop',color:'#2d8cf0', tip:'是否确认发药', id: options.data,click:this.deliver})
                            }else{
                                opbtn.items.push({ text: '发药', isJump: true,color:'#2d8cf0', id: options.data,click:this.chooseMan})
                            }
                            opbtn.$mount('#orderStatus2');
                        }
                    },
                    {
                        caption: "取药信息",
                        allowSorting: false,
                        dataField: "receiveCode",
                        width:80,
                    },
                    {
                        caption: "订单执行药店",
                        allowSorting: false,
                        dataField: "drugstoreName",
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
                            if(data.length*33<90){
                                divHeight = 90/data.length + 'px'
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
                            if(data.length*33<90){
                                divHeight = 90/data.length + 'px'
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
                            if(data.length*33<90){
                                divHeight = 90/data.length + 'px'
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
                            if(data.length*33<90){
                                divHeight = 90/data.length + 'px'
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
                                { text: '配送完成', isJump: true,color:'#2d8cf0', id: options.data,clisk:this.finishOrder},
                                { text: '患者拒收', isJump: true,color:'#2d8cf0', id: options.data, click:this.patientRefusal},
                            ];
                            opbtn.$mount('#orderStatus3');
                        }
                    },
                    {
                        caption: "取药信息",
                        allowSorting: false,
                        dataField: "receiveCode",
                        width:80,
                    },
                    {
                        caption: "订单执行药店",
                        allowSorting: false,
                        dataField: "drugstoreName",
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
                        width:550,
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
                        alignment:'right',
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
                        caption: "取药信息",
                        allowSorting: false,
                        dataField: "receiveCode",
                        width:80,
                    },
                    {
                        caption: "订单执行药店",
                        allowSorting: false,
                        dataField: "drugstoreName",
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
                            if(options.data.status == 4){
                                if(options.data.returnType == 2){
                                    baseHeight = 109
                                }else{
                                    baseHeight = 71
                                }
                            }else if(options.data.status == 5){
                                baseHeight = 109
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
                                if(options.data.returnType == 2){
                                    baseHeight = 109
                                }else{
                                    baseHeight = 71
                                }
                            }else if(options.data.status == 5){
                                baseHeight = 109
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
                                if(options.data.returnType == 2){
                                    baseHeight = 109
                                }else{
                                    baseHeight = 71
                                }
                            }else if(options.data.status == 5){
                                baseHeight = 109
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
                                if(options.data.returnType == 2){
                                    baseHeight = 109
                                }else{
                                    baseHeight = 71
                                }
                            }else if(options.data.status == 5){
                                baseHeight = 109
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
                            if(options.data.status == 4){
                                if(options.data.returnType == 2){
                                    text = '待处理'
                                }
                                opbtn.items = [
                                    { text: text, isJump: false,color:'#333',},
                                    { text: text1, isJump: false,color:'#333',},
                                    { text: '订单详情', isJump: true,color:'#2d8cf0', id: options.data, click:this.orderDetail},
                                ];
                                if(options.data.returnType == 2){
                                    opbtn.items.push(
                                        { text: '同意退货', isJump: 'pop', tip:'确认退款吗？',color:'#2d8cf0', id: options.data,click:this.agreeReturn},
                                        { text: '拒绝退货', isJump: 'pop', tip:'确认退款吗？',color:'#2d8cf0', id: options.data,click:this.refuse},
                                    )
                                }
                            }else if(options.data.status == 5){
                                opbtn.items = [
                                    { text: text, isJump: false,color:'#333',},
                                    { text: text1, isJump: false,color:'#333',},
                                    { text: '订单详情', isJump: true,color:'#2d8cf0', id: options.data, click:this.orderDetail},
                                    { text: '确认收货', isJump: 'pop', tip:'确认收药！',color:'#2d8cf0', id: options.data, click:this.getDrug},
                                    { text: '拒绝收货', isJump: true,color:'#2d8cf0', id: options.data,click:this.refuse},
                                ];
                            }
                            opbtn.$mount('#orderStatus5');
                        }
                    },
                    {
                        caption: "取药信息",
                        allowSorting: false,
                        dataField: "receiveCode",
                        width:80,
                    },
                    {
                        caption: "订单执行药店",
                        allowSorting: false,
                        dataField: "drugstoreName",
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
                        caption: "取药信息",
                        allowSorting: false,
                        dataField: "receiveCode",
                        width:80,
                    },
                    {
                        caption: "订单执行药店",
                        allowSorting: false,
                        dataField: "drugstoreName",
                        width:100,
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

            this.rejectForm = $('#rejectForm').dxForm({
                formData: this.rejectFormData,
                items: [
                    {
                        dataField: 'refuseReturnReson',
                        visible:false,
                        editorType:'dxTextArea',
                        label: {
                            alignment: 'right',
                            text: '原因'
                        },
                        editorOptions:{
                            maxLength:200,
                            height:60
                        },
                        validationRules: [{
                            type:"required",
                            message: "请输入原因"
                        }]
                    },
                    {
                        dataField: 'returnReson',
                        visible:false,
                        editorType:'dxTextArea',
                        label: {
                            alignment: 'right',
                            text: '原因'
                        },
                        editorOptions:{
                            maxLength:100,
                            height:60
                        },
                        validationRules: [{
                            type:"required",
                            message: "请输入原因"
                        }]
                    },
                ]
            }).dxForm('instance');
        },
        methods:{
            search:function() {
                let ds;
                delete this.searchFormData.status;
                delete this.searchFormData.state;
                if(this.tabValue == 'all'){
                    ds = this.allOrderGrid.getDataSource()
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
                    this.searchFormData.state = [4,5]
                }else if(this.tabValue == 'refunded'){
                    ds = this.refundedGrid.getDataSource();
                    this.searchFormData.status = 7
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
                }
            },

            tabChange:function(name) {
                delete this.searchFormData.status;
                this.$refs.creatTimeData.values = [];
                this.searchFormData.createTime = '';
                this.searchForm.resetValues();
                if(name== 'all'){
                    this.allOrderGrid.refresh();
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
                }
            },
            orderDetail(data){
                this.$router.push({
                    name: 'store-order-info',
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
            deliver(data){
                let params = {};
                params.orderId = data.orderId;
                this.$post(order_deliver_url, params).then(res => {
                    if (res.code == '200') {
                        this.success('操作成功!', () => {
                            if(this.tabValue == 'all'){
                                this.allOrderGrid.refresh();
                            }else if(this.tabValue == 'notDeliver'){
                                this.notDeliverGrid.refresh();
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
            finishOrder(data){
                let params = {};
                params.orderId = data.orderId;
                this.$post(order_finish_deliver_url, params).then(res => {
                    if (res.code == '200') {
                        this.success('操作成功!', () => {
                            if(this.tabValue == 'all'){
                                this.allOrderGrid.refresh();
                            }else if(this.tabValue == 'deliver'){
                                this.deliverGrid.refresh();
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
            agreeReturn(data){
                let params = {};
                params.orderId = data.orderId;
                this.$post(order_return_url, params).then(res => {
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
            getDrug(data){
                let params = {};
                params.orderId = data.orderId;
                this.$post(get_drug_url, params).then(res => {
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
            refuse(data){
                this.modal.isNew = true;
                this.rejectFormData = data;
                this.rejectForm.option('formData',this.rejectFormData);
                this.rejectForm.itemOption('refuseReturnReson','visible',true);
                this.rejectForm.itemOption('returnReson','visible',false);
                this.modal.visible = true
            },
            patientRefusal(data){
                this.modal.isNew = false;
                this.rejectFormData = data;
                this.rejectForm.option('formData',this.rejectFormData);
                this.rejectForm.itemOption('refuseReturnReson','visible',false);
                this.rejectForm.itemOption('returnReson','visible',true);
                this.modal.visible = true
            },
            formCancle(){
                this.modal.visible = false;
                this.userModal.visible = false
            },
            save(){
                let params = {},url;
                params.orderId = this.rejectFormData.orderId;
                this.modal.modal_loading = true;
                if(this.modal.isNew){
                    url = order_refuse_return_url;
                    params.refuseReturnReson = this.rejectFormData.refuseReturnReson;
                }else{
                    url = patient_return_url;
                    params.returnReson = this.rejectFormData.returnReson;
                }
                if(!this.rejectForm.validate().isValid) {
                    this.modal.modal_loading = false;
                    return;
                }
                this.$post(url, params).then(res => {
                    if (res.code == '200') {
                        this.success('操作成功!', () => {
                            this.modal.modal_loading = false;
                            this.modal.visible = false;
                            if(this.modal.isNew){
                                if(this.tabValue == 'all'){
                                    this.allOrderGrid.refresh();
                                }else if(this.tabValue == 'refund'){
                                    this.refundGrid.refresh();
                                }
                            }else{
                                if(this.tabValue == 'all'){
                                    this.allOrderGrid.refresh();
                                }else if(this.tabValue == 'deliver'){
                                    this.deliverGrid.refresh();
                                }
                            }
                        });
                    } else {
                        this.modal.modal_loading = false;
                        this.warn(res.msg);
                    }
                }).catch(err => {
                    this.modal.modal_loading = false;
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
            chooseMan(data){
                this.selectOrder = data.orderId;
                this.$put(store_user_url, {}).then(res => {
                    if (res.code == '200') {
                        this.userList = res.rows;
                        this.userModal.visible = true;
                    } else {
                        this.warn(res.msg);
                    }
                }).catch(err => {
                    this.error(err);
                });
            },
            submitUser(){
                this.userModal.modal_loading = true;
                if(!this.vertical){
                    this.warn('请选择配送人员');
                    this.userModal.modal_loading = false;
                    return
                }
                this.$post(order_deliver_url, {orderId:this.selectOrder,dispatchId:Number(this.vertical)}).then(res => {
                    if (res.code == '200') {
                        this.success('操作成功!', () => {
                            this.userModal.visible = false;
                            this.userModal.modal_loading = false;
                            if(this.tabValue == 'all'){
                                this.allOrderGrid.refresh();
                            }else if(this.tabValue == 'notDeliver'){
                                this.notDeliverGrid.refresh();
                            }
                        });
                    } else {
                        this.userModal.modal_loading = false;
                        this.warn(res.msg);
                    }
                }).catch(err => {
                    this.userModal.modal_loading = false;
                    this.error(err);
                });
            }
        }
    }
</script>