<style lang="less">
    @import "../../../styles/common.less";
    @import "order.css";
</style>
<template>
    <div>
        <Card dis-hover>
            <div slot="title"  class="cardHead">
                <a href="#"  @click.prevent="cancle" >
                    <Icon type="ios-arrow-back"></Icon>
                    返回
                </a>
            </div>
            <p slot="extra" id="btn"></p>
            <Row class="margin-top-10">
                <Spin fix v-show="isSpin">
                    <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
                    <div>加载中...</div>
                </Spin>
                <div>
                    <Steps :current="current">
                        <Step v-for="(item,index) in stepData" :title='item.title' :content='item.content' :key="index"></Step>
                    </Steps>
                </div>
                <div id="orderForm" class="margin-top-10"></div>
                <div id="orderGrid" class="margin-top-10"></div>
            </Row>
        </Card>
        <Drawer :closable="false" width="650" v-model="visible">
            <!--<h1 class="recipe-title">{{recipeInfo.title}}</h1>-->
            <table class="recipe">
                <tr>
                    <th colspan="5" class="recipe-title">{{recipeInfo.title}}</th>
                </tr>
                <tr>
                    <td colspan="3">NO：{{recipeInfo.code}}</td>
                    <td colspan="2" style="text-align: right">取药联  √</td>
                </tr>
                <tr>
                    <td>姓名：{{recipeInfo.patientName}}</td>
                    <td>性别：{{recipeInfo.sex}}</td>
                    <td>年龄：{{recipeInfo.age}}</td>
                    <td>科室：{{recipeInfo.dept}}</td>
                    <td>门诊号：{{recipeInfo.clinicNo}}</td>
                </tr>
                <tr>
                    <td colspan="3">费别：{{recipeInfo.feeType}}</td>
                    <td colspan="2" style="text-align: right">{{recipeInfo.recipeData}}</td>
                </tr>
                <tr>
                    <td colspan="5">临床诊断：{{recipeInfo.diag}}</td>
                </tr>
                <tr>
                    <td colspan="5">
                        <h1 class="recipe-text-bold">R:</h1>
                        <template v-for="(item,index) in recipeInfo.info">
                            <p class="recipe-text">{{index+1}}、{{item.name}}&nbsp;&nbsp;&nbsp;{{item.spec}}&nbsp;&nbsp;&nbsp;{{item.eachDose}}</p>
                            <p class="recipe-text">{{item.freq}}</p>
                        </template>
                    </td>
                </tr>
                <tr>
                    <td>医师：{{recipeInfo.doctorName}}</td>
                    <td colspan="2">审核、调配：{{recipeInfo.author}}</td>
                    <td colspan="2">核对、发药：{{recipeInfo.deliver}}</td>
                </tr>
            </table>
        </Drawer>
        <Drawer :closable="false" width="650" v-model="disVisible">
            <div style="margin-left: 20px;font-size: 16px">
                <p>配送人员：{{disInfo.name}}</p>
                <p>电话：{{disInfo.mobile}}</p>
            </div>
        </Drawer>
        <Modal v-model="modal.visible" :mask-closable="false" width="650" title="编辑数据">
            <p slot="header">
                <span v-if="modal.isNew">拒绝原因</span>
                <span v-else>拒收原因</span>
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
    import Image from './image';
    let order_detail_url = '/biz/bizOrder/getOrderDetails';
    //发药
    let order_deliver_url = '/biz/bizOrder/deliverOrder';
    //配送完成
    let order_finish_deliver_url = '/biz/bizOrder/finishOrder';
    //同意退货
    let order_agree_return_url = '/biz/bizOrder/returnAccept';
    //拒绝退款
    let order_refuse_return_url = '/biz/bizOrder/withdrawApply';
    //确认收药
    let get_drug_url = '/biz/bizOrder/returnRefund';
    //处方详情
    let recipe_detail_url = '/biz/bizRecipe/getRecipeDetails';
    //获取药店用户
    let store_user_url = '/biz/bizOrder/getDispatchUser';
    let dispatch_info_url = '/biz/bizOrder/getDispatchInfo';
    //患者拒收
    let patient_return_url = '/biz/bizOrder/reject';
    export default {
        data(){
            return{
                isSpin:true,
                vertical:'',
                userList:[
                    {name:'张三',mobile:'13654254896',account:'345313',id:1},
                    {name:'张三',mobile:'13654254896',account:'345313',id:2},
                    {name:'张三',mobile:'13654254896',account:'345313',id:3},
                ],
                recipeInfo:{
                    code:'1802071800',patientName:'谢正友',sex:'男',age:'55岁',dept:'消化内科',
                    clicicNo:'180109288',feeType:'医保  新农合  公费  工伤  自费  其他',
                    diag:'胃炎',recipeData:'2018年05月03日',title:'陆军军医大学第一附属医院处方签',
                    info:[
                        {name:'异烟肼片',spec:'0.1 GM*100',eachDose:'7粒',freq:'用法：0.1g  每天一次  口服'},
                        {name:'异烟肼片',spec:'0.1 GM*100',eachDose:'7粒',freq:'用法：0.1g  每天一次  口服'},
                        {name:'异烟肼片',spec:'0.1 GM*100',eachDose:'7粒',freq:'用法：0.1g  每天一次  口服'},
                        {name:'异烟肼片',spec:'0.1 GM*100',eachDose:'7粒',freq:'用法：0.1g  每天一次  口服'},
                    ],
                },
                current:1,
                stepData:[],
                rowData:[],
                modal_loading:false,
                orderForm:{},
                orderFormData:{},
                visible:false,
                disVisible:false,
                disInfo:{},
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
            }
        },
        mounted(){
            let that = this;
            this.orderForm = $("#orderForm").dxForm({
                colCount:1,
                formData:this.orderFormData,
                items:[
                    {
                        itemType: 'group',
                        caption: '用户信息',
                        colCount: 4,
                        name:"userInfo",
                        items:[
                            {
                                dataField: "receiver",
                                label: {
                                    alignment: "right",
                                    text: "姓名"
                                },
                                editorOptions: {
                                    readOnly:true,
                                },
                            },
                            {
                                dataField: "mobile",
                                label: {
                                    alignment: "right",
                                    text: "手机"
                                },
                                editorOptions:{
                                    readOnly:true
                                },
                            },
                        ]
                    },
                    {
                        itemType: 'group',
                        caption: '订单信息',
                        colCount: 4,
                        name:"orderInfo",
                        visible:true,
                        items:[
                            {
                                dataField: "orderCode",
                                label: {
                                    alignment: "right",
                                    text: "订单编号"
                                },
                                editorOptions:{
                                    readOnly:true
                                },
                            },
                            {
                                dataField: "payTime",
                                visible:false,
                                label: {
                                    alignment: "right",
                                    text: "付款时间"
                                },
                                editorOptions:{
                                    readOnly:true
                                },
                            },
                            {
                                dataField: "createTime",
                                label: {
                                    alignment: "right",
                                    text: "创建时间"
                                },
                                editorOptions:{
                                    readOnly:true
                                },
                            },
                            {
                                dataField: "varieties",
                                label: {
                                    alignment: "right",
                                    text: "药品品种"
                                },
                                editorOptions:{
                                    readOnly:true
                                },
                            },
                            {
                                dataField: "productTotal",
                                label: {
                                    alignment: "right",
                                    text: "药品总数"
                                },
                                editorOptions:{
                                    readOnly:true
                                },
                            },
                            {
                                dataField: "dispatchType",
                                editorType:'dxSelectBox',
                                label: {
                                    alignment: "right",
                                    text: "购药方式"
                                },
                                editorOptions:{
                                    dataSource: this.enum.dispatchType,
                                    displayExpr: 'text',
                                    valueExpr: 'id',
                                    readOnly:true
                                },
                            },
                            {
                                dataField: "drugstoreName",
                                label: {
                                    alignment: "right",
                                    text: "订单执行药店"
                                },
                                editorOptions:{
                                    readOnly:true
                                },
                            },
                            {
                                dataField: "returnApplyTime",
                                visible:false,
                                label: {
                                    alignment: "right",
                                    text: "申请退货退款时间"
                                },
                                editorOptions:{
                                    readOnly:true
                                },
                            },{
                                dataField: "returnFinishTime",
                                visible:false,
                                label: {
                                    alignment: "right",
                                    text: "退款完成时间"
                                },
                                editorOptions:{
                                    readOnly:true
                                },
                            },{
                                dataField: "returnAcceptTime",
                                visible:false,
                                label: {
                                    alignment: "right",
                                    text: "药店处理时间"
                                },
                                editorOptions:{
                                    readOnly:true
                                },
                            },{
                                dataField: "deliverTime",
                                visible:false,
                                label: {
                                    alignment: "right",
                                    text: "发药时间"
                                },
                                editorOptions:{
                                    readOnly:true
                                },
                            },{
                                dataField: "confirmTime",
                                visible:false,
                                label: {
                                    alignment: "right",
                                    text: "收药时间"
                                },
                                editorOptions:{
                                    readOnly:true
                                },
                            },{
                                dataField: "cancelTime",
                                visible:false,
                                label: {
                                    alignment: "right",
                                    text: "交易关闭时间"
                                },
                                editorOptions:{
                                    readOnly:true
                                },
                            },{
                                dataField: "returnReson",
                                colSpan:4,
                                visible:false,
                                label: {
                                    alignment: "right",
                                    text: "退货/退款原因"
                                },
                                editorOptions:{
                                    readOnly:true
                                },
                            },
                            {
                                dataField: "img",
                                visible:false,
                                colSpan:4,
                                label: {
                                    alignment: "right",
                                    text: "凭证照片"
                                },
                                template: this.addImg
                            },
                        ]
                    },
                    {
                        itemType: 'group',
                        caption: '处方信息',
                        colCount: 4,
                        name:"recipeInfo",
                        visible:true,
                        items:[
                            {
                                dataField: "recipeTotal",
                                label: {
                                    alignment: "right",
                                    text: "处方数"
                                },
                                template: (data, itemElement)=>{
                                    let str = '';
                                    if(this.orderFormData.recipeTotal){
                                        str+= this.orderFormData.recipeTotal+'张';
                                        if(this.orderFormData.recipeTotal == 1){
                                            str+=`<a  style='margin-left: 5px;color: #2d8cf0'>查看处方</a>`;
                                        }else if(this.orderFormData.recipeTotal >1){
                                            for (let i=1;i<=this.orderFormData.recipeTotal;i++){
                                                str+=`<a  style='margin-left: 5px;color: #2d8cf0'>查看处方${i}</a>`;
                                            }
                                        }
                                    }
                                    itemElement.append("<div class='blImg' style='padding-top: 10px'></div>").append(str);
                                    let aList = itemElement.find('a');
                                    for (let ii=0;ii<aList.length;ii++){
                                        $(aList[ii]).click(function () {
                                            that.recipeDetail(Number($(this)[0].innerHTML.substring(4)));
                                            // console.log(Number($(this)[0].innerHTML.substring(4)))
                                        });
                                    }
                                }
                            },
                        ]
                    },
                    {
                        itemType: 'group',
                        caption: '取药信息',
                        colCount: 4,
                        name:"addressInfo",
                        visible:true,
                        items:[
                            {
                                dataField: "storeAddress",
                                colSpan:4,
                                label: {
                                    alignment: "right",
                                    text: "药店地址"
                                },
                                editorOptions:{
                                    readOnly:true
                                },
                            },
                            {
                                dataField: "address",
                                visible:false,
                                colSpan:4,
                                label: {
                                    alignment: "right",
                                    text: "收货地址"
                                },
                                editorOptions:{
                                    readOnly:true
                                },
                            },
                            {
                                dataField: "returnAddress",
                                visible:false,
                                colSpan:4,
                                label: {
                                    alignment: "right",
                                    text: "退货地址"
                                },
                                editorOptions:{
                                    readOnly:true
                                },
                            },
                        ]
                    },
                ]
            }).dxForm("instance");

            this.orderGrid = $("#orderGrid").dxDataGrid({
                showRowLines: true,
                showBorders: true,
                columnAutoWidth: true,
                columnFixing: {
                    enabled: true
                },
                hoverStateEnabled: true,
                dataSource: this.rowData,
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
                        caption: "商品名称",
                        dataField: "productName",
                        allowSorting: false,
                        width:400,
                        cellTemplate:function(container, options) {
                            let data = options.data.product;
                            let str = '';
                            let divHeight,baseHeight;
                            if(options.data.dispatchFee && options.data.dispatchType == 1){
                                baseHeight = 71
                            }else if(!options.data.dispatchFee && options.data.dispatchType == 1){
                                baseHeight = 52
                            }else if(options.data.dispatchType == 2){
                                baseHeight = 33
                            }
                            if(data.length*33<baseHeight){
                                divHeight = baseHeight/data.length + 'px'
                            }else{
                                divHeight = `calc(100%/${data.length})`
                            }
                            for(let i=0;i<data.length;i++){
                                if(i==0){
                                    str+=`<div style='height:${divHeight};' class="drugDiv-padding drugDiv-text">${data[i].productName}</div>`
                                }else{
                                    str+=`<div style='height:${divHeight};' class="drugDiv-border-top drugDiv-padding drugDiv-text">${data[i].productName}</div>`
                                }
                            }
                            let markup = "<div class='drugDiv-outer'>"+str+"</div>";
                            container.append(markup);
                        }
                    },
                    {
                        caption: "规格",
                        dataField: "spec",
                        allowSorting: false,
                        width:200,
                        cellTemplate:function(container, options) {
                            let data = options.data.product;
                            let str = '';
                            let divHeight,baseHeight;
                            if(options.data.dispatchFee && options.data.dispatchType == 1){
                                baseHeight = 71
                            }else if(!options.data.dispatchFee && options.data.dispatchType == 1){
                                baseHeight = 52
                            }else if(options.data.dispatchType == 2){
                                baseHeight = 33
                            }
                            if(data.length*33<baseHeight){
                                divHeight = baseHeight/data.length + 'px'
                            }else{
                                divHeight = `calc(100%/${data.length})`
                            }
                            for(let i=0;i<data.length;i++){
                                if(i==0){
                                    str+=`<div style='height:${divHeight};' class="drugDiv-padding drugDiv-text">${data[i].spec}</div>`
                                }else{
                                    str+=`<div style='height:${divHeight};' class="drugDiv-border-top drugDiv-padding drugDiv-text">${data[i].spec}</div>`
                                }
                            }
                            let markup = "<div class='drugDiv-outer'>"+str+"</div>";
                            container.append(markup);
                        }
                    },
                    {
                        caption: "生产厂商",
                        dataField: "factory",
                        allowSorting: false,
                        // width:300,
                        cellTemplate:function(container, options) {
                            let data = options.data.product;
                            let str = '';
                            let divHeight,baseHeight;
                            if(options.data.dispatchFee && options.data.dispatchType == 1){
                                baseHeight = 71
                            }else if(!options.data.dispatchFee && options.data.dispatchType == 1){
                                baseHeight = 52
                            }else if(options.data.dispatchType == 2){
                                baseHeight = 33
                            }
                            if(data.length*33<baseHeight){
                                divHeight = baseHeight/data.length + 'px'
                            }else{
                                divHeight = `calc(100%/${data.length})`
                            }
                            for(let i=0;i<data.length;i++){
                                if(i==0){
                                    str+=`<div style='height:${divHeight};' class="drugDiv-padding drugDiv-text"  title=${data[i].factory}>${data[i].factory}</div>`
                                }else{
                                    str+=`<div style='height:${divHeight};' class="drugDiv-border-top drugDiv-padding drugDiv-text"  title=${data[i].factory}>${data[i].factory}</div>`
                                }
                            }
                            let markup = "<div class='drugDiv-outer'>"+str+"</div>";
                            container.append(markup);
                        }
                    },
                    {
                        caption: "单价",
                        dataField: "price",
                        alignment:'left',
                        allowSorting: false,
                        width:100,
                        cellTemplate:function(container, options) {
                            let data = options.data.product;
                            let str = '';
                            let divHeight,baseHeight;
                            if(options.data.dispatchFee && options.data.dispatchType == 1){
                                baseHeight = 71
                            }else if(!options.data.dispatchFee && options.data.dispatchType == 1){
                                baseHeight = 52
                            }else if(options.data.dispatchType == 2){
                                baseHeight = 33
                            }
                            if(data.length*33<baseHeight){
                                divHeight = baseHeight/data.length + 'px'
                            }else{
                                divHeight = `calc(100%/${data.length})`
                            }
                            for(let i=0;i<data.length;i++){
                                if(i==0){
                                    str+=`<div style='height:${divHeight};' class="drugDiv-padding drugDiv-text">￥${data[i].price}</div>`
                                }else{
                                    str+=`<div style='height:${divHeight};' class="drugDiv-border-top drugDiv-padding drugDiv-text">￥${data[i].price}</div>`
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
                        width:100,
                        cellTemplate:function(container, options) {
                            let data = options.data.product;
                            let str = '';
                            let divHeight,baseHeight;
                            if(options.data.dispatchFee && options.data.dispatchType == 1){
                                baseHeight = 71
                            }else if(!options.data.dispatchFee && options.data.dispatchType == 1){
                                baseHeight = 52
                            }else if(options.data.dispatchType == 2){
                                baseHeight = 33
                            }
                            if(data.length*33<baseHeight){
                                divHeight = baseHeight/data.length + 'px'
                            }else{
                                divHeight = `calc(100%/${data.length})`
                            }
                            for(let i=0;i<data.length;i++){
                                if(i==0){
                                    str+=`<div style='height:${divHeight};' class="drugDiv-padding drugDiv-text">${data[i].sum}${data[i].packUnit}</div>`
                                }else{
                                    str+=`<div style='height:${divHeight};' class="drugDiv-border-top drugDiv-padding drugDiv-text">${data[i].sum}${data[i].packUnit}</div>`
                                }
                            }
                            let markup = "<div class='drugDiv-outer'>"+str+"</div>";
                            container.append(markup);
                        }
                    },
                    {
                        caption: "售价",
                        dataField: "productTotal",
                        alignment:'left',
                        allowSorting: false,
                        width:100,
                        cellTemplate:function(container, options) {
                            let data = options.data.product;
                            let str = '';
                            let divHeight,baseHeight;
                            if(options.data.dispatchFee && options.data.dispatchType == 1){
                                baseHeight = 71
                            }else if(!options.data.dispatchFee && options.data.dispatchType == 1){
                                baseHeight = 52
                            }else if(options.data.dispatchType == 2){
                                baseHeight = 33
                            }
                            if(data.length*33<baseHeight){
                                divHeight = baseHeight/data.length + 'px'
                            }else{
                                divHeight = `calc(100%/${data.length})`
                            }
                            for(let i=0;i<data.length;i++){
                                if(i==0){
                                    str+=`<div style='height:${divHeight};' class="drugDiv-padding drugDiv-text">￥${data[i].productTotal}</div>`
                                }else{
                                    str+=`<div style='height:${divHeight};' class="drugDiv-border-top drugDiv-padding drugDiv-text">￥${data[i].productTotal}</div>`
                                }
                            }
                            let markup = "<div class='drugDiv-outer'>"+str+"</div>";
                            container.append(markup);
                        }
                    },
                    {
                        caption: "处方来源",
                        dataField: "recipeSources",
                        allowSorting: false,
                        visible:this.orderFormData.recipeTotal?true:false,
                        // width:300,
                        cellTemplate:function(container, options) {
                            // if(this.orderFormData.recipeTotal){
                                let data = options.data.product;
                                let str = '';
                                let divHeight,baseHeight;
                                if(options.data.dispatchFee && options.data.dispatchType == 1){
                                    baseHeight = 71
                                }else if(!options.data.dispatchFee && options.data.dispatchType == 1){
                                    baseHeight = 52
                                }else if(options.data.dispatchType == 2){
                                    baseHeight = 33
                                }
                                if(data.length*33<baseHeight){
                                    divHeight = baseHeight/data.length + 'px'
                                }else{
                                    divHeight = `calc(100%/${data.length})`
                                }
                                for(let i=0;i<data.length;i++){
                                    let source = '';
                                    if(data[i].recipeSources){source = data[i].recipeSources}
                                    if(i==0){
                                        str+=`<div style='height:${divHeight};' class="drugDiv-padding drugDiv-text" title=${source}>${source}</div>`
                                    }else{
                                        str+=`<div style='height:${divHeight};' class="drugDiv-border-top drugDiv-padding drugDiv-text" title=${source}>${source}</div>`
                                    }
                                }
                                let markup = "<div class='drugDiv-outer'>"+str+"</div>";
                                container.append(markup);
                            // }
                        }
                    },
                    {
                        caption: "实收款",
                        allowSorting: false,
                        alignment:'center',
                        dataField: "payMoney",
                        width:150,
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
                            if(this.orderFormData.dispatchType == 1){
                                opbtn.items.push({ text: '查看物流', isJump: true,color:'#2d8cf0', click:this.dispatchInfo})
                            }


                            opbtn.$mount('#pm');
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

            this.btnPart = new (Vue.component('CommandBtns'))();
            this.btnPart.items = [
                { id: 1, text: '发药', type: "primary", enabled: true, display:'none',modal_loading:false, click:this.deliver},
                { id: 2, text: '配送完成', type: "primary", enabled: true, display:'none',modal_loading:false, click:this.finishOrder},
                { id: 3, text: '患者拒收', enabled: true, display:'none',modal_loading:false, click:this.patientRefusal},
                { id: 4, text: '同意退货', enabled: true, type: "primary", display:'none',modal_loading:false,click:this.agreeReturn},
                { id: 5, text: '确认收货', enabled: true, type: "primary", display:'none',modal_loading:false,click:this.getDrug},
                { id: 6, text: '拒绝退货', enabled: true, display:'none',click:this.refuse},
                { id: 7, text: '拒绝收货', enabled: true, display:'none',click:this.refuse},
                { id: 8, text: '发药', type: "primary", enabled: true, display:'none',modal_loading:false, click:this.chooseMan}
            ];
            this.btnPart.$mount('#btn');
            this.btnPart.$parent = this;

            this.orderInit();
        },
        methods:{
            orderInit(){
                let params = {};
                params.orderId = Number(this.$route.params.order_id);
                this.$put(order_detail_url,params).then(res => {
                    if(res.code=='200')
                    {
                        this.orderFormData = res.data.orderInfo;
                        this.orderFormData.receiver = res.data.user.receiver;
                        this.orderFormData.mobile = res.data.user.mobile;
                        if(!this.orderFormData.recipeTotal){
                            this.orderForm.itemOption('recipeInfo','visible',false);
                        }
                        if(res.data.status.status == 2){//待发药
                            this.orderForm.itemOption('orderInfo.payTime','visible',true);
                            if(res.data.orderInfo.dispatchType == 2){
                                this.btnPart.items[0].display = 'inline-block';
                                this.stepData = [
                                    {title:'待发药',content:res.data.status.payTime},
                                    {title:'已完成',content:''},
                                ];
                                this.current = 0;
                                this.orderFormData.storeAddress = res.data.address[0].name+ ' , ' +res.data.address[0].mobile+' , '+res.data.address[0].address;
                            }else{
                                this.btnPart.items[7].display = 'inline-block';
                                this.stepData = [
                                    {title:'待发药',content:res.data.status.payTime},
                                    {title:'配送中',content:''},
                                    {title:'已完成',content:''},
                                ];
                                this.current = 0;
                                this.orderForm.itemOption('addressInfo.address','visible',true);
                                this.orderFormData.address = res.data.address[0].name+ ' , ' +res.data.address[0].mobile+' , '+res.data.address[0].address;
                                this.orderFormData.storeAddress = res.data.address[1].name+ ' , ' +res.data.address[1].mobile+' , '+res.data.address[1].address;
                            }
                        }else if(res.data.status.status == 3){
                            this.btnPart.items[1].display = 'inline-block';
                            this.btnPart.items[2].display = 'inline-block';
                            this.stepData = [
                                {title:'待发药',content:res.data.status.payTime},
                                {title:'配送中',content:res.data.status.deliverTime},
                                {title:'已完成',content:''},
                            ];
                            this.current = 1;
                            this.orderForm.itemOption('orderInfo.payTime','visible',true);
                            this.orderForm.itemOption('orderInfo.deliverTime','visible',true);
                            this.orderForm.itemOption('addressInfo.address','visible',true);
                            this.orderFormData.address = res.data.address[0].name+ ' , ' +res.data.address[0].mobile+' , '+res.data.address[0].address;
                            this.orderFormData.storeAddress = res.data.address[1].name+ ' , ' +res.data.address[1].mobile+' , '+res.data.address[1].address;

                        }else if(res.data.status.status == 4){//退药申请
                            this.orderForm.itemOption('orderInfo.payTime','visible',true);
                            this.orderForm.itemOption('orderInfo.returnApplyTime','visible',true);
                            this.orderForm.itemOption('orderInfo.returnReson','visible',true);
                            if(res.data.orderInfo.dispatchType == 2){
                                this.orderFormData.storeAddress = res.data.address[0].name+ ' , ' +res.data.address[0].mobile+' , '+res.data.address[0].address;
                            }else{
                                this.orderForm.itemOption('addressInfo.address','visible',true);
                                this.orderForm.itemOption('addressInfo.returnAddress','visible',true);
                                this.orderFormData.address = res.data.address[0].name+ ' , ' +res.data.address[0].mobile+' , '+res.data.address[0].address;
                                this.orderFormData.storeAddress = res.data.address[1].name+ ' , ' +res.data.address[1].mobile+' , '+res.data.address[1].address;
                                this.orderFormData.returnAddress = res.data.address[1].name+ ' , ' +res.data.address[1].mobile+' , '+res.data.address[1].address;
                            }
                            if(res.data.status.returnType == 1){
                                this.stepData = [
                                    {title:'患者申请仅退款',content:res.data.status.returnApplyTime},
                                    {title:'退款完成',content:''}
                                ];
                                this.current = 0
                            }else{
                                if(this.orderFormData.fileImg && this.orderFormData.fileImg.length != 0){
                                    this.orderForm.itemOption('orderInfo.img','visible',true);
                                }
                                this.btnPart.items[3].display = 'inline-block';
                                this.btnPart.items[5].display = 'inline-block';
                                this.stepData = [
                                    {title:'患者申请退货退款',content:res.data.status.returnApplyTime},
                                    {title:'药店处理退货申请',content:''},
                                    {title:'退款完毕',content:''}
                                ];
                                this.current = 0
                            }
                        }else if(res.data.status.status == 5){//已同意退款
                            this.btnPart.items[4].display = 'inline-block';
                            this.btnPart.items[6].display = 'inline-block';
                            this.orderForm.itemOption('orderInfo.payTime','visible',true);
                            // this.orderForm.itemOption('orderInfo.returnApplyTime','visible',true);
                            this.orderForm.itemOption('orderInfo.returnAcceptTime','visible',true);
                            this.orderForm.itemOption('orderInfo.returnReson','visible',true);
                            if(this.orderFormData.fileImg && this.orderFormData.fileImg.length != 0){
                                this.orderForm.itemOption('orderInfo.img','visible',true);
                            }
                            if(res.data.orderInfo.dispatchType == 2){
                                this.orderFormData.storeAddress = res.data.address[0].name+ ' , ' +res.data.address[0].mobile+' , '+res.data.address[0].address;
                            }else{
                                this.orderForm.itemOption('addressInfo.address','visible',true);
                                this.orderForm.itemOption('addressInfo.returnAddress','visible',true);
                                this.orderFormData.address = res.data.address[0].name+ ' , ' +res.data.address[0].mobile+' , '+res.data.address[0].address;
                                this.orderFormData.storeAddress = res.data.address[1].name+ ' , ' +res.data.address[1].mobile+' , '+res.data.address[1].address;
                                this.orderFormData.returnAddress = res.data.address[1].name+ ' , ' +res.data.address[1].mobile+' , '+res.data.address[1].address;
                            }
                            this.stepData = [
                                {title:'患者申请退货退款',content:res.data.status.returnApplyTime},
                                {title:'药店处理退货申请',content:res.data.status.returnAcceptTime},
                                {title:'退款完毕',content:''}
                            ];
                            this.current = 1

                        }else if(res.data.status.status == 6){
                            this.orderForm.itemOption('orderInfo.payTime','visible',true);
                            this.orderForm.itemOption('orderInfo.confirmTime','visible',true);
                            if(res.data.orderInfo.dispatchType == 2){
                                this.stepData = [
                                    {title:'待发药',content:res.data.status.payTime},
                                    {title:'已完成',content:res.data.status.confirmTime},
                                ];
                                this.current = 1;
                                this.orderFormData.storeAddress = res.data.address[0].name+ ' , ' +res.data.address[0].mobile+' , '+res.data.address[0].address;
                            }else{
                                this.stepData = [
                                    {title:'已发药',content:res.data.status.payTime},
                                    {title:'配送中',content:res.data.status.deliverTime},
                                    {title:'已完成',content:res.data.status.confirmTime},
                                ];
                                this.current = 2;
                                this.orderForm.itemOption('orderInfo.deliverTime','visible',true);
                                this.orderForm.itemOption('addressInfo.address','visible',true);
                                this.orderFormData.address = res.data.address[0].name+ ' , ' +res.data.address[0].mobile+' , '+res.data.address[0].address;
                                this.orderFormData.storeAddress = res.data.address[1].name+ ' , ' +res.data.address[1].mobile+' , '+res.data.address[1].address;
                            }

                        }else if(res.data.status.status == 7){//已退款
                            if(res.data.orderInfo.dispatchType == 2){
                                this.orderFormData.storeAddress = res.data.address[0].name+ ' , ' +res.data.address[0].mobile+' , '+res.data.address[0].address;
                            }else{
                                this.orderForm.itemOption('addressInfo.address','visible',true);
                                this.orderFormData.address = res.data.address[0].name+ ' , ' +res.data.address[0].mobile+' , '+res.data.address[0].address;
                                this.orderFormData.storeAddress = res.data.address[1].name+ ' , ' +res.data.address[1].mobile+' , '+res.data.address[1].address;
                            }
                            if(res.data.status.returnType == 1){
                                this.stepData = [
                                    {title:'患者申请仅退款',content:res.data.status.returnApplyTime},
                                    {title:'退款完成',content:res.data.status.returnFinishTime}
                                ];
                                this.current = 1
                            }else{
                                if(this.orderFormData.fileImg && this.orderFormData.fileImg.length != 0){
                                    this.orderForm.itemOption('orderInfo.img','visible',true);
                                }
                                this.stepData = [
                                    {title:'患者申请退货退款',content:res.data.status.returnApplyTime},
                                    {title:'药店处理退货申请',content:res.data.status.returnAcceptTime},
                                    {title:'退款完毕',content:res.data.status.returnFinishTime}
                                ];
                                this.current = 2
                            }
                            this.orderForm.itemOption('orderInfo.payTime','visible',true);
                            this.orderForm.itemOption('orderInfo.returnFinishTime','visible',true);
                            this.orderForm.itemOption('orderInfo.returnReson','visible',true);
                        }
                        this.orderForm.option("formData",this.orderFormData);
                        this.orderForm.repaint();
                        let objData = {};
                        objData.product = res.data.product;
                        objData.dispatchFee = res.data.orderInfo.dispatchFee;
                        objData.payMoney = res.data.orderInfo.payMoney;
                        objData.dispatchType = res.data.orderInfo.dispatchType;
                        this.rowData.push(objData);
                        this.orderGrid.option("dataSource", this.rowData);
                        this.isSpin = false
                    }
                    else {

                    }
                }).catch(err=>
                {
                    this.error(err)
                    // console.log(err)
                });
            },
            cancle(){
                this.$router.push({
                    name: 'store-order',
                });
            },
            deliver(){
                let params = {};
                this.btnPart.items[0].modal_loading = true;
                params.orderId = this.orderFormData.orderId;
                this.$post(order_deliver_url, params).then(res => {
                    if (res.code == '200') {
                        this.success('操作成功!', () => {
                            this.$router.push({
                                name: 'store-order',
                            });
                        });
                    } else {
                        this.btnPart.items[0].modal_loading = false;
                        this.warn(res.msg);
                    }
                }).catch(err => {
                    this.btnPart.items[0].modal_loading = false;
                    this.error(err);
                });
            },
            finishOrder(){
                let params = {};
                this.btnPart.items[1].modal_loading = true;
                params.orderId = this.orderFormData.orderId;
                this.$post(order_finish_deliver_url, params).then(res => {
                    if (res.code == '200') {
                        this.success('操作成功!', () => {
                            this.$router.push({
                                name: 'store-order',
                            });
                        });
                    } else {
                        this.btnPart.items[1].modal_loading = false;
                        this.warn(res.msg);
                    }
                }).catch(err => {
                    this.btnPart.items[1].modal_loading = false;
                    this.error(err);
                });
            },
            agreeReturn(){
                let params = {};
                this.btnPart.items[3].modal_loading = true;
                params.orderId = this.orderFormData.orderId;
                this.$post(order_agree_return_url, params).then(res => {
                    if (res.code == '200') {
                        this.success('操作成功!', () => {
                            this.$router.push({
                                name: 'store-order',
                            });
                        });
                    } else {
                        this.btnPart.items[3].modal_loading = false;
                        this.warn(res.msg);
                    }
                }).catch(err => {
                    this.btnPart.items[3].modal_loading = false;
                    this.error(err);
                });
            },
            refuse(){
                this.modal.isNew = true;
                this.rejectFormData = {};
                this.rejectForm.option('formData',this.rejectFormData);
                this.rejectForm.itemOption('refuseReturnReson','visible',true);
                this.rejectForm.itemOption('returnReson','visible',false);
                this.modal.visible = true
            },
            patientRefusal(){
                this.modal.isNew = false;
                this.rejectFormData = {};
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
                params.orderId = this.orderFormData.orderId;
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
                            this.$router.push({
                                name: 'store-order',
                            });
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
            getDrug(){
                let params = {};
                this.btnPart.items[4].modal_loading = true;
                params.orderId = this.orderFormData.orderId;
                this.$post(get_drug_url, params).then(res => {
                    if (res.code == '200') {
                        this.success('操作成功!', () => {
                            this.$router.push({
                                name: 'store-order',
                            });
                        });
                    } else {
                        this.btnPart.items[4].modal_loading = false;
                        this.warn(res.msg);
                    }
                }).catch(err => {
                    this.btnPart.items[4].modal_loading = false;
                    this.error(err);
                });
            },
            recipeDetail(val){
                let ids = [];
                if(this.orderFormData.recipeId.length == 1){
                    ids.push(Number(this.orderFormData.recipeId[val]))
                }else{
                    ids.push(Number(this.orderFormData.recipeId[val-1]))
                }
                this.$put(recipe_detail_url,{recipeIds:ids}).then(res => {
                    if(res.code=='200') {
                        this.recipeInfo = res.rows[0];
                        this.recipeInfo.title = res.rows[0].orgName+'处方签';
                        this.recipeInfo.info = [];
                        for(let i=0; i<res.rows[0].bizRecipeDetails.length; i++){
                            let info = {};
                            info.name = res.rows[0].bizRecipeDetails[i].name;
                            info.spec = res.rows[0].bizRecipeDetails[i].spec;
                            info.eachDose = res.rows[0].bizRecipeDetails[i].eachDose;
                            info.freq = res.rows[0].bizRecipeDetails[i].freq;
                            this.recipeInfo.info.push(info)
                        }
                        this.visible = true;
                    }
                    else {

                    }
                }).catch(err=>
                {
                    this.error(err)
                    // console.log(err)
                });
            },
            chooseMan(){
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
                this.$post(order_deliver_url, {orderId:this.orderFormData.orderId,dispatchId:Number(this.vertical)}).then(res => {
                    if (res.code == '200') {
                        this.success('发货成功!', () => {
                            this.$router.push({
                                name: 'store-order',
                            });
                        });
                    } else {
                        this.userModal.modal_loading = false;
                        this.warn(res.msg);
                    }
                }).catch(err => {
                    this.userModal.modal_loading = false;
                    this.error(err);
                });
            },
            dispatchInfo(){
                this.$put(dispatch_info_url, {orderId:this.orderFormData.orderId}).then(res => {
                    if (res.code == '200') {
                        this.disInfo = res.data;
                        this.disVisible = true
                    } else {
                        this.warn(res.msg);
                    }
                }).catch(err => {
                    this.error(err);
                });
            },
            addImg(data, itemElement) {
                itemElement.append("<div id='picImg'/>");
                let FileUpload = new Vue(Image);
                FileUpload.$parent = this;
                FileUpload.$mount('#picImg');
            },
        }
    }
</script>