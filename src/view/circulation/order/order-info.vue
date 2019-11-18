<style lang="less">
    @import "../../../styles/common.less";
    @import "order.css";

    .boder-solid {
        border-left: 1px solid #cccccc;
    }

    .border-dot {
        border-left: 1px dotted #cccccc;
    }

    .ordering-color {
        color: #686868;
    }

    .order-color {
        color: #cccccc;
    }

    .time-size {
        font-size: 10px;
    }

    .order-height {
        height: 170px;
    }

    .order {
        font-size: 16px;
        background: #f2f2f2;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;

        .order-header {
            width: 95%;
            margin-top: 10px;
            // display: flex;
            // align-items: center;
            // justify-content: space-between;
            background: #fff;
            height: 125px;
            border-radius: 10px;

            .order-header-up {
                margin-top: 10px;
                display: flex;
                align-items: center;
                justify-content: space-between;

                .order-header-up-left {
                    display: flex;
                    align-items: center;
                    margin-left: 20px;

                    img {
                        width: 50px;
                        margin-right: 25px;
                    }

                    p {
                        color: #58585a;
                    }

                    div {
                        .avg-score {
                            // display: flex;
                            // align-items: center;
                            span {
                                font-size: 8px;
                                color: #cccccc;
                            }
                        }
                    }
                }

                .order-header-up-right {
                    margin-right: 20px;

                    p {
                        font-size: 15px;
                    }
                }
            }

            .order-header-down {
                margin: 25px 0 0 20px;
                display: flex;
                align-items: flex-start;

                span {
                    color: #58585a;
                    font-size: 15px;
                }
            }
        }

        .order-content {
            width: 95%;
            // height: 80%;
            padding: 30px 20px 0;
            margin-top: 10px;
            background: #fff;
            border-radius: 10px 10px 0 0;
            overflow: hidden;

            .order-content-card {
                height: 75px;
                display: flex;

                .order-content-card-time {
                    width: 15%;
                    height: 100%;

                    .time-cell {
                        width: 70%;
                        display: flex;
                        flex-direction: column;
                        align-items: flex-end;

                        p {
                            font-size: 10px;
                        }
                    }
                }

                .order-content-card-detail {
                    width: 85%;
                    display: flex;

                    .order-content-card-detail-img {
                        width: 18px;

                        .img-color {
                            background: #fff;
                            position: relative;
                            top: -7px;
                            left: -14px;
                            z-index: 99;
                        }
                    }

                    .order-content-card-detail-text {
                        h4 {
                            width: 100%;
                            margin-bottom: 4px;
                        }

                        p {
                            font-size: 13px;

                            span {
                                color: #fb6a16;
                            }
                        }
                    }
                }
            }
        }

        .show-order {
            width: 95%;
            height: 40px;
            background: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 13px;
            border-radius: 0 0 10px 10px;
        }
    }
</style>
<template>
    <div>
        <Card dis-hover>
            <div slot="title" class="cardHead">
                <a href="#" @click.prevent="cancle">
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
                        <Step v-for="(item,index) in stepData" :title='item.title' :content='item.content'
                              :key="index"></Step>
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
                    <td colspan="2" style="text-align: right">取药联 √</td>
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
        <Drawer :closable="false" width="450" v-model="disVisible">
            <div class="order">
                <div class="order-header">
                    <div class="order-header-up">
                        <div class="order-header-up-left">
                            <img src="@/assets/images/head1.png" alt="">
                            <div>
                                <p>顺丰快递员</p>
                                <div class="avg-score">
                                    <span>平均分</span>
                                    <Icon type="md-star" color="#FEC537"/>
                                    <Icon type="md-star" color="#FEC537"/>
                                    <Icon type="md-star" color="#FEC537"/>
                                    <Icon type="md-star" color="#FEC537"/>
                                    <Icon type="md-star-outline" color="#FEC537"/>
                                </div>
                            </div>
                        </div>
                        <div class="order-header-up-right">
                            <Icon type="ios-call-outline" size="35"/>
                            <p>电话</p>
                        </div>
                    </div>
                    <div class="order-header-down">
                        <span>顺丰速运 260459738188 </span>
                        <Icon type="ios-browsers-outline" size="20"/>
                    </div>
                </div>
                <div class="order-content" :class="isShowOrder?'':'order-height'">
                    <div class="order-content-card order-color">
                        <div class="order-content-card-time">
                            <div class="time-cell">
                                <h4></h4>
                                <p></p>
                            </div>
                        </div>
                        <div class="order-content-card-detail" :class="1==2?'boder-solid':'border-dot'">
                            <div class="order-content-card-detail-img">
                                <div class="img-color">
                                    <img src="@/assets/images/icon_received.png" alt="">
                                </div>
                            </div>
                            <div class="order-content-card-detail-text">
                                <h4></h4>
                                <p>【收货地址】重庆重庆市渝北区 鸳鸯街道 重庆市渝北区翠渝路55号美利山公园城市185栋</p>
                            </div>
                        </div>
                    </div>
                    <div class="order-content-card ordering-color">
                        <div class="order-content-card-time">
                            <div class="time-cell">
                                <h4>上午</h4>
                                <p>09:29</p>
                            </div>
                        </div>
                        <div class="order-content-card-detail" :class="1==1?'boder-solid':'border-dot'">
                            <div class="order-content-card-detail-img">
                                <div class="img-color">
                                    <img src="@/assets/images/icon_deliver_pre.png" alt="">
                                </div>
                            </div>
                            <div class="order-content-card-detail-text">
                                <h4>派送中</h4>
                                <p>快件交给余仁焰，正在派送途中（联系电话：<span>18183057670</span>）</p>
                            </div>
                        </div>
                    </div>
                    <div class="order-content-card order-color">
                        <div class="order-content-card-time">
                            <div class="time-cell">
                                <h4 class="time-size">上午</h4>
                                <p>09:27</p>
                            </div>
                        </div>
                        <div class="order-content-card-detail" :class="1==1?'boder-solid':'border-dot'">
                            <div class="order-content-card-detail-img">
                                <div class="img-color">
                                    <img src="@/assets/images/icon_transport.png" alt="">
                                </div>
                            </div>
                            <div class="order-content-card-detail-text">
                                <h4>运输中</h4>
                                <p>快件到达【重庆渝北金开大道营业点】<span></span></p>
                            </div>
                        </div>
                    </div>
                    <div class="order-content-card order-color">
                        <div class="order-content-card-time">
                            <div class="time-cell">
                                <h4 class="time-size">早上</h4>
                                <p>08:18</p>
                            </div>
                        </div>
                        <div class="order-content-card-detail" :class="1==1?'boder-solid':'border-dot'">
                            <div class="order-content-card-detail-img">
                                <div class="img-color">
                                    <img src="@/assets/images/icon_line.png" alt="">
                                </div>
                            </div>
                            <div class="order-content-card-detail-text">
                                <h4></h4>
                                <p>快件在【重庆渝北集散中心】，已装车准备发往【重庆渝北金开大道营业点】<span></span></p>
                            </div>
                        </div>
                    </div>
                    <div class="order-content-card order-color">
                        <div class="order-content-card-time">
                            <div class="time-cell">
                                <h4 class="time-size">昨天</h4>
                                <p>21:13</p>
                            </div>
                        </div>
                        <div class="order-content-card-detail" :class="1==1?'boder-solid':'border-dot'">
                            <div class="order-content-card-detail-img">
                                <div class="img-color">
                                    <img src="@/assets/images/icon_line.png" alt="">
                                </div>
                            </div>
                            <div class="order-content-card-detail-text">
                                <h4></h4>
                                <p>快件在【重庆渝北集散中心】<span></span></p>
                            </div>
                        </div>
                    </div>
                    <div class="order-content-card order-color">
                        <div class="order-content-card-time">
                            <div class="time-cell">
                                <h4 class="time-size">昨天</h4>
                                <p>01:03</p>
                            </div>
                        </div>
                        <div class="order-content-card-detail" :class="1==1?'boder-solid':'border-dot'">
                            <div class="order-content-card-detail-img">
                                <div class="img-color">
                                    <img src="@/assets/images/icon_line.png" alt="">
                                </div>
                            </div>
                            <div class="order-content-card-detail-text">
                                <h4></h4>
                                <p>快件在【合肥经开集散中心】已装车，准备发往【重庆渝北集散中心】<span></span></p>
                            </div>
                        </div>
                    </div>
                    <div class="order-content-card order-color">
                        <div class="order-content-card-time">
                            <div class="time-cell">
                                <h4 class="time-size">10.20</h4>
                                <p>16:42</p>
                            </div>
                        </div>
                        <div class="order-content-card-detail" :class="1==1?'boder-solid':'border-dot'">
                            <div class="order-content-card-detail-img">
                                <div class="img-color">
                                    <img src="@/assets/images/icon_line.png" alt="">
                                </div>
                            </div>
                            <div class="order-content-card-detail-text">
                                <h4></h4>
                                <p>快件在【合肥经开集散中心】<span></span></p>
                            </div>
                        </div>
                    </div>
                    <div class="order-content-card order-color">
                        <div class="order-content-card-time">
                            <div class="time-cell">
                                <h4 class="time-size">10.20</h4>
                                <p>13:17</p>
                            </div>
                        </div>
                        <div class="order-content-card-detail" :class="1==1?'boder-solid':'border-dot'">
                            <div class="order-content-card-detail-img">
                                <div class="img-color">
                                    <img src="@/assets/images/icon_collect.png" alt="">
                                </div>
                            </div>
                            <div class="order-content-card-detail-text">
                                <h4>已揽件</h4>
                                <p>顺丰速运 已收取快件<span></span></p>
                            </div>
                        </div>
                    </div>
                    <div class="order-content-card order-color">
                        <div class="order-content-card-time">
                            <div class="time-cell">
                                <h4 class="time-size">10.20</h4>
                                <p>13:17</p>
                            </div>
                        </div>
                        <div class="order-content-card-detail">
                            <div class="order-content-card-detail-img">
                                <div class="img-color">
                                    <img src="@/assets/images/icon_collect.png" alt="">
                                </div>
                            </div>
                            <div class="order-content-card-detail-text">
                                <h4>已发货</h4>
                                <p>包裹正在等待揽件<span></span></p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="show-order" @click="showOrder">点击折叠物流信息
                    <Icon type="ios-arrow-dropup" size="18" v-if="isShowOrder"/>
                    <Icon type="ios-arrow-dropdown" size="18" v-else/>
                </div>
            </div>
        </Drawer>
        <!--<Modal v-model="modal.visible" :mask-closable="false" :footer-hide="true" width="650" title="编辑数据">-->
        <!--<p slot="header">-->
        <!--<span>订单跟踪</span>-->
        <!--</p>-->
        <!--<div></div>-->
        <!--</Modal>-->
    </div>
</template>
<script>
    import Vue from 'vue';
    import Image from '../store-order/image';

    let order_detail_url = '/biz/bizOrder/getOrderDetails';
    let return_money_url = '/biz/bizOrder/platformRefund';
    //处方详情
    let recipe_detail_url = '/biz/bizRecipe/getRecipeDetails';
    let dispatch_info_url = '/biz/bizOrder/getDispatchInfo';
    export default {
        data() {
            return {
                isSpin: true,
                recipeInfo: {
                    code: '1802071800', patientName: '谢正友', sex: '男', age: '55岁', dept: '消化内科',
                    clicicNo: '180109288', feeType: '医保  新农合  公费  工伤  自费  其他',
                    diag: '胃炎', recipeData: '2018年05月03日', title: '陆军军医大学第一附属医院处方签',
                    doctorName: '曾波', author: '安未', deliver: '杨杰',
                    info: [
                        {name: '异烟肼片', spec: '0.1 GM*100', eachDose: '7粒', freq: '用法：0.1g  每天一次  口服'},
                        {name: '异烟肼片', spec: '0.1 GM*100', eachDose: '7粒', freq: '用法：0.1g  每天一次  口服'},
                        {name: '异烟肼片', spec: '0.1 GM*100', eachDose: '7粒', freq: '用法：0.1g  每天一次  口服'},
                        {name: '异烟肼片', spec: '0.1 GM*100', eachDose: '7粒', freq: '用法：0.1g  每天一次  口服'},
                    ],
                },
                disVisible: false,
                disInfo: {},
                current: 1,
                stepData: [],
                rowData: [],
                modal_loading: false,
                orderForm: {},
                orderFormData: {},
                visible: false,
                isShowOrder: false
            }
        },
        mounted() {
            let that = this;
            this.orderForm = $("#orderForm").dxForm({
                colCount: 1,
                formData: this.orderFormData,
                items: [
                    {
                        itemType: 'group',
                        caption: '用户信息',
                        colCount: 4,
                        name: "userInfo",
                        items: [
                            {
                                dataField: "receiver",
                                label: {
                                    alignment: "right",
                                    text: "姓名"
                                },
                                editorOptions: {
                                    readOnly: true,
                                },
                            },
                            {
                                dataField: "mobile",
                                label: {
                                    alignment: "right",
                                    text: "手机"
                                },
                                editorOptions: {
                                    readOnly: true
                                },
                            },
                        ]
                    },
                    {
                        itemType: 'group',
                        caption: '订单信息',
                        colCount: 4,
                        name: "orderInfo",
                        visible: true,
                        items: [
                            {
                                dataField: "orderCode",
                                label: {
                                    alignment: "right",
                                    text: "订单编号"
                                },
                                editorOptions: {
                                    readOnly: true
                                },
                            },
                            {
                                dataField: "payTime",
                                visible: false,
                                label: {
                                    alignment: "right",
                                    text: "付款时间"
                                },
                                editorOptions: {
                                    readOnly: true
                                },
                            },
                            {
                                dataField: "createTime",
                                label: {
                                    alignment: "right",
                                    text: "创建时间"
                                },
                                editorOptions: {
                                    readOnly: true
                                },
                            },
                            {
                                dataField: "varieties",
                                label: {
                                    alignment: "right",
                                    text: "药品品种"
                                },
                                editorOptions: {
                                    readOnly: true
                                },
                            },
                            {
                                dataField: "productTotal",
                                label: {
                                    alignment: "right",
                                    text: "药品总数"
                                },
                                editorOptions: {
                                    readOnly: true
                                },
                            },
                            {
                                dataField: "dispatchType",
                                editorType: 'dxSelectBox',
                                label: {
                                    alignment: "right",
                                    text: "购药方式"
                                },
                                editorOptions: {
                                    dataSource: this.enum.dispatchType,
                                    displayExpr: 'text',
                                    valueExpr: 'id',
                                    readOnly: true
                                },
                            },
                            {
                                dataField: "drugstoreName",
                                label: {
                                    alignment: "right",
                                    text: "订单执行药店"
                                },
                                editorOptions: {
                                    readOnly: true
                                },
                            },
                            {
                                dataField: "returnApplyTime",
                                visible: false,
                                label: {
                                    alignment: "right",
                                    text: "申请退货退款时间"
                                },
                                editorOptions: {
                                    readOnly: true
                                },
                            }, {
                                dataField: "returnFinishTime",
                                visible: false,
                                label: {
                                    alignment: "right",
                                    text: "退款完成时间"
                                },
                                editorOptions: {
                                    readOnly: true
                                },
                            }, {
                                dataField: "returnAcceptTime",
                                visible: false,
                                label: {
                                    alignment: "right",
                                    text: "药店处理时间"
                                },
                                editorOptions: {
                                    readOnly: true
                                },
                            }, {
                                dataField: "deliverTime",
                                visible: false,
                                label: {
                                    alignment: "right",
                                    text: "发药时间"
                                },
                                editorOptions: {
                                    readOnly: true
                                },
                            }, {
                                dataField: "confirmTime",
                                visible: false,
                                label: {
                                    alignment: "right",
                                    text: "收药时间"
                                },
                                editorOptions: {
                                    readOnly: true
                                },
                            }, {
                                dataField: "cancelTime",
                                visible: false,
                                label: {
                                    alignment: "right",
                                    text: "交易关闭时间"
                                },
                                editorOptions: {
                                    readOnly: true
                                },
                            }, {
                                dataField: "returnReson",
                                colSpan: 4,
                                visible: false,
                                label: {
                                    alignment: "right",
                                    text: "退货/退款原因"
                                },
                                editorOptions: {
                                    readOnly: true
                                },
                            },
                            {
                                dataField: "img",
                                visible: false,
                                colSpan: 4,
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
                        name: "recipeInfo",
                        visible: true,
                        items: [
                            {
                                dataField: "recipeTotal",
                                label: {
                                    alignment: "right",
                                    text: "处方数"
                                },
                                template: (data, itemElement) => {
                                    let str = '';
                                    if (this.orderFormData.recipeTotal) {
                                        str += this.orderFormData.recipeTotal + '张';
                                        if (this.orderFormData.recipeTotal == 1) {
                                            str += `<a  style='margin-left: 5px;color: #2d8cf0'>查看处方</a>`;
                                        } else {
                                            for (let i = 1; i <= this.orderFormData.recipeTotal; i++) {
                                                str += `<a  style='margin-left: 5px;color: #2d8cf0'>查看处方${i}</a>`;
                                            }
                                        }
                                    }
                                    itemElement.append("<div class='blImg' style='padding-top: 10px'></div>").append(str);
                                    let aList = itemElement.find('a');
                                    for (let ii = 0; ii < aList.length; ii++) {
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
                        name: "addressInfo",
                        visible: true,
                        items: [
                            {
                                dataField: "storeAddress",
                                colSpan: 4,
                                label: {
                                    alignment: "right",
                                    text: "药店地址"
                                },
                                editorOptions: {
                                    readOnly: true
                                },
                            },
                            {
                                dataField: "address",
                                visible: false,
                                colSpan: 4,
                                label: {
                                    alignment: "right",
                                    text: "收货地址"
                                },
                                editorOptions: {
                                    readOnly: true
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
                        width: 400,
                        cellTemplate: function (container, options) {
                            let data = options.data.product;
                            let str = '';
                            let divHeight, baseHeight;
                            if (options.data.dispatchFee && options.data.dispatchType == 1) {
                                baseHeight = 71
                            } else if (!options.data.dispatchFee && options.data.dispatchType == 1) {
                                baseHeight = 52
                            } else if (options.data.dispatchType == 2) {
                                baseHeight = 33
                            }
                            if (data.length * 33 < baseHeight) {
                                divHeight = baseHeight / data.length + 'px'
                            } else {
                                divHeight = `calc(100%/${data.length})`
                            }
                            for (let i = 0; i < data.length; i++) {
                                if (i == 0) {
                                    str += `<div style='height:${divHeight};' class="drugDiv-padding drugDiv-text">${data[i].productName}</div>`
                                } else {
                                    str += `<div style='height:${divHeight};' class="drugDiv-border-top drugDiv-padding drugDiv-text">${data[i].productName}</div>`
                                }
                            }
                            let markup = "<div class='drugDiv-outer'>" + str + "</div>";
                            container.append(markup);
                        }
                    },
                    {
                        caption: "规格",
                        dataField: "spec",
                        allowSorting: false,
                        width: 200,
                        cellTemplate: function (container, options) {
                            let data = options.data.product;
                            let str = '';
                            let divHeight, baseHeight;
                            if (options.data.dispatchFee && options.data.dispatchType == 1) {
                                baseHeight = 71
                            } else if (!options.data.dispatchFee && options.data.dispatchType == 1) {
                                baseHeight = 52
                            } else if (options.data.dispatchType == 2) {
                                baseHeight = 33
                            }
                            if (data.length * 33 < baseHeight) {
                                divHeight = baseHeight / data.length + 'px'
                            } else {
                                divHeight = `calc(100%/${data.length})`
                            }
                            for (let i = 0; i < data.length; i++) {
                                if (i == 0) {
                                    str += `<div style='height:${divHeight};' class="drugDiv-padding drugDiv-text">${data[i].spec}</div>`
                                } else {
                                    str += `<div style='height:${divHeight};' class="drugDiv-border-top drugDiv-padding drugDiv-text">${data[i].spec}</div>`
                                }
                            }
                            let markup = "<div class='drugDiv-outer'>" + str + "</div>";
                            container.append(markup);
                        }
                    },
                    {
                        caption: "生产厂商",
                        dataField: "factory",
                        allowSorting: false,
                        // width:300,
                        cellTemplate: function (container, options) {
                            let data = options.data.product;
                            let str = '';
                            let divHeight, baseHeight;
                            if (options.data.dispatchFee && options.data.dispatchType == 1) {
                                baseHeight = 71
                            } else if (!options.data.dispatchFee && options.data.dispatchType == 1) {
                                baseHeight = 52
                            } else if (options.data.dispatchType == 2) {
                                baseHeight = 33
                            }
                            if (data.length * 33 < baseHeight) {
                                divHeight = baseHeight / data.length + 'px'
                            } else {
                                divHeight = `calc(100%/${data.length})`
                            }
                            for (let i = 0; i < data.length; i++) {
                                if (i == 0) {
                                    str += `<div style='height:${divHeight};' class="drugDiv-padding drugDiv-text" title=${data[i].factory}>${data[i].factory}</div>`
                                } else {
                                    str += `<div style='height:${divHeight};' class="drugDiv-border-top drugDiv-padding drugDiv-text" title=${data[i].factory}>${data[i].factory}</div>`
                                }
                            }
                            let markup = "<div class='drugDiv-outer'>" + str + "</div>";
                            container.append(markup);
                        }
                    },
                    {
                        caption: "单价",
                        dataField: "price",
                        alignment: 'left',
                        allowSorting: false,
                        width: 100,
                        cellTemplate: function (container, options) {
                            let data = options.data.product;
                            let str = '';
                            let divHeight, baseHeight;
                            if (options.data.dispatchFee && options.data.dispatchType == 1) {
                                baseHeight = 71
                            } else if (!options.data.dispatchFee && options.data.dispatchType == 1) {
                                baseHeight = 52
                            } else if (options.data.dispatchType == 2) {
                                baseHeight = 33
                            }
                            if (data.length * 33 < baseHeight) {
                                divHeight = baseHeight / data.length + 'px'
                            } else {
                                divHeight = `calc(100%/${data.length})`
                            }
                            for (let i = 0; i < data.length; i++) {
                                if (i == 0) {
                                    str += `<div style='height:${divHeight};' class="drugDiv-padding drugDiv-text">￥${data[i].price}</div>`
                                } else {
                                    str += `<div style='height:${divHeight};' class="drugDiv-border-top drugDiv-padding drugDiv-text">￥${data[i].price}</div>`
                                }
                            }
                            let markup = "<div class='drugDiv-outer'>" + str + "</div>";
                            container.append(markup);
                        }
                    },
                    {
                        caption: "数量",
                        dataField: "num",
                        allowSorting: false,
                        width: 100,
                        cellTemplate: function (container, options) {
                            let data = options.data.product;
                            let str = '';
                            let divHeight, baseHeight;
                            if (options.data.dispatchFee && options.data.dispatchType == 1) {
                                baseHeight = 71
                            } else if (!options.data.dispatchFee && options.data.dispatchType == 1) {
                                baseHeight = 52
                            } else if (options.data.dispatchType == 2) {
                                baseHeight = 33
                            }
                            if (data.length * 33 < baseHeight) {
                                divHeight = baseHeight / data.length + 'px'
                            } else {
                                divHeight = `calc(100%/${data.length})`
                            }
                            for (let i = 0; i < data.length; i++) {
                                if (i == 0) {
                                    str += `<div style='height:${divHeight};' class="drugDiv-padding drugDiv-text">${data[i].sum}${data[i].packUnit}</div>`
                                } else {
                                    str += `<div style='height:${divHeight};' class="drugDiv-border-top drugDiv-padding drugDiv-text">${data[i].sum}${data[i].packUnit}</div>`
                                }
                            }
                            let markup = "<div class='drugDiv-outer'>" + str + "</div>";
                            container.append(markup);
                        }
                    },
                    {
                        caption: "售价",
                        dataField: "productTotal",
                        alignment: 'left',
                        allowSorting: false,
                        width: 100,
                        cellTemplate: function (container, options) {
                            let data = options.data.product;
                            let str = '';
                            let divHeight, baseHeight;
                            if (options.data.dispatchFee && options.data.dispatchType == 1) {
                                baseHeight = 71
                            } else if (!options.data.dispatchFee && options.data.dispatchType == 1) {
                                baseHeight = 52
                            } else if (options.data.dispatchType == 2) {
                                baseHeight = 33
                            }
                            if (data.length * 33 < baseHeight) {
                                divHeight = baseHeight / data.length + 'px'
                            } else {
                                divHeight = `calc(100%/${data.length})`
                            }
                            for (let i = 0; i < data.length; i++) {
                                if (i == 0) {
                                    str += `<div style='height:${divHeight};' class="drugDiv-padding drugDiv-text">￥${data[i].productTotal}</div>`
                                } else {
                                    str += `<div style='height:${divHeight};' class="drugDiv-border-top drugDiv-padding drugDiv-text">￥${data[i].productTotal}</div>`
                                }
                            }
                            let markup = "<div class='drugDiv-outer'>" + str + "</div>";
                            container.append(markup);
                        }
                    },
                    {
                        caption: "处方来源",
                        dataField: "recipeSources",
                        allowSorting: false,
                        visible: this.orderFormData.recipeTotal ? true : false,
                        // width:300,
                        cellTemplate: function (container, options) {
                            let data = options.data.product;
                            let str = '';
                            let divHeight, baseHeight;
                            if (options.data.dispatchFee && options.data.dispatchType == 1) {
                                baseHeight = 71
                            } else if (!options.data.dispatchFee && options.data.dispatchType == 1) {
                                baseHeight = 52
                            } else if (options.data.dispatchType == 2) {
                                baseHeight = 33
                            }
                            if (data.length * 33 < baseHeight) {
                                divHeight = baseHeight / data.length + 'px'
                            } else {
                                divHeight = `calc(100%/${data.length})`
                            }
                            for (let i = 0; i < data.length; i++) {
                                let source = '';
                                if (data[i].recipeSources) {
                                    source = data[i].recipeSources
                                }
                                if (i == 0) {
                                    str += `<div style='height:${divHeight};' class="drugDiv-padding drugDiv-text" title=${source}>${source}</div>`
                                } else {
                                    str += `<div style='height:${divHeight};' class="drugDiv-border-top drugDiv-padding drugDiv-text" title=${source}>${source}</div>`
                                }
                            }
                            let markup = "<div class='drugDiv-outer'>" + str + "</div>";
                            container.append(markup);
                        }
                    },
                    {
                        caption: "实收款",
                        allowSorting: false,
                        alignment: 'center',
                        dataField: "payMoney",
                        width: 150,
                        cellTemplate: (container, options) => {
                            container.append("<div id='pm'/>");
                            let opbtn = new (Vue.component('OpBtn'));
                            let text1 = "￥" + options.data.payMoney + "";
                            if (options.data.dispatchFee) {
                                let text2 = "(含配送费￥" + options.data.dispatchFee + ")";
                                opbtn.items = [
                                    {text: text1, isJump: false, color: '#333'},
                                    {text: text2, isJump: false, color: '#333'},

                                ];
                            } else {
                                opbtn.items = [
                                    {text: text1, isJump: false, color: '#333'}
                                ];
                            }
                            if (this.orderFormData.dispatchType == 1) {
                                opbtn.items.push({
                                    text: '查看物流',
                                    isJump: true,
                                    color: '#2d8cf0',
                                    click: this.dispatchInfo
                                })
                            }


                            opbtn.$mount('#pm');
                        }
                    },
                ]
            }).dxDataGrid("instance");

            this.btnPart = new (Vue.component('CommandBtns'))();
            this.btnPart.items = [
                {
                    id: 1,
                    text: '退款',
                    type: "primary",
                    enabled: true,
                    display: 'none',
                    modal_loading: false,
                    click: this.returnMoney
                },
            ];
            this.btnPart.$mount('#btn');
            this.btnPart.$parent = this;

            this.orderInit();
        },
        methods: {
            orderInit() {
                let params = {};
                params.orderId = Number(this.$route.params.order_id);
                this.$put(order_detail_url, params).then(res => {
                    if (res.code == '200') {
                        this.orderFormData = res.data.orderInfo;
                        this.orderFormData.receiver = res.data.user.receiver;
                        this.orderFormData.mobile = res.data.user.mobile;
                        if (!this.orderFormData.recipeTotal) {
                            this.orderForm.itemOption('recipeInfo', 'visible', false);
                        }
                        if (res.data.status.status == 1) {
                            if (res.data.orderInfo.dispatchType == 2) {
                                this.stepData = [
                                    {title: '待付款', content: res.data.status.createTime},
                                    {title: '已付款', content: ''},
                                    {title: '已收药', content: ''},
                                ];
                                this.current = 0;
                                this.orderFormData.storeAddress = res.data.address[0].name + ' , ' + res.data.address[0].mobile + ' , ' + res.data.address[0].address;
                            } else {
                                this.stepData = [
                                    {title: '待付款', content: res.data.status.createTime},
                                    {title: '已付款', content: ''},
                                    {title: '配送中', content: ''},
                                    {title: '已收药', content: ''},
                                ];
                                this.current = 0;
                                this.orderForm.itemOption('addressInfo.address', 'visible', true);
                                this.orderFormData.address = res.data.address[0].name + ' , ' + res.data.address[0].mobile + ' , ' + res.data.address[0].address;
                                this.orderFormData.storeAddress = res.data.address[1].name + ' , ' + res.data.address[1].mobile + ' , ' + res.data.address[1].address;
                            }

                        } else if (res.data.status.status == 2) {//已付款
                            this.orderForm.itemOption('orderInfo.payTime', 'visible', true);
                            if (res.data.orderInfo.dispatchType == 2) {
                                this.stepData = [
                                    {title: '待付款', content: res.data.status.createTime},
                                    {title: '已付款', content: res.data.status.payTime},
                                    {title: '已收药', content: ''},
                                ];
                                this.current = 1;
                                this.orderFormData.storeAddress = res.data.address[0].name + ' , ' + res.data.address[0].mobile + ' , ' + res.data.address[0].address;
                            } else {
                                this.stepData = [
                                    {title: '待付款', content: res.data.status.createTime},
                                    {title: '已付款', content: res.data.status.payTime},
                                    {title: '配送中', content: ''},
                                    {title: '已收药', content: ''},
                                ];
                                this.current = 1;
                                this.orderForm.itemOption('addressInfo.address', 'visible', true);
                                this.orderFormData.address = res.data.address[0].name + ' , ' + res.data.address[0].mobile + ' , ' + res.data.address[0].address;
                                this.orderFormData.storeAddress = res.data.address[1].name + ' , ' + res.data.address[1].mobile + ' , ' + res.data.address[1].address;
                            }
                        } else if (res.data.status.status == 3) {
                            this.stepData = [
                                {title: '待付款', content: res.data.status.createTime},
                                {title: '已付款', content: res.data.status.payTime},
                                {title: '配送中', content: res.data.status.deliverTime},
                                {title: '已收药', content: ''},
                            ];
                            this.current = 2;
                            this.orderForm.itemOption('orderInfo.payTime', 'visible', true);
                            this.orderForm.itemOption('orderInfo.deliverTime', 'visible', true);
                            this.orderForm.itemOption('addressInfo.address', 'visible', true);
                            this.orderFormData.address = res.data.address[0].name + ' , ' + res.data.address[0].mobile + ' , ' + res.data.address[0].address;
                            this.orderFormData.storeAddress = res.data.address[1].name + ' , ' + res.data.address[1].mobile + ' , ' + res.data.address[1].address;

                        } else if (res.data.status.status == 4 || res.data.status.status == 5) {//退款中或已同意退款
                            this.orderForm.itemOption('orderInfo.payTime', 'visible', true);
                            this.orderForm.itemOption('orderInfo.returnReson', 'visible', true);
                            if (res.data.orderInfo.dispatchType == 2) {
                                this.orderFormData.storeAddress = res.data.address[0].name + ' , ' + res.data.address[0].mobile + ' , ' + res.data.address[0].address;
                            } else {
                                this.orderForm.itemOption('addressInfo.address', 'visible', true);
                                this.orderFormData.address = res.data.address[0].name + ' , ' + res.data.address[0].mobile + ' , ' + res.data.address[0].address;
                                this.orderFormData.storeAddress = res.data.address[1].name + ' , ' + res.data.address[1].mobile + ' , ' + res.data.address[1].address;
                            }
                            if (res.data.status.returnType == 1) {
                                // this.btnPart.items[0].display = 'inline-block';
                                this.stepData = [
                                    {title: '患者申请仅退款', content: res.data.status.returnApplyTime},
                                    {title: '退款完成', content: res.data.status.returnFinishTime}
                                ];
                                if (res.data.status.status == 4) {
                                    this.orderForm.itemOption('orderInfo.returnApplyTime', 'visible', true);
                                    this.current = 0
                                }
                            } else {
                                if (this.orderFormData.fileImg && this.orderFormData.fileImg.length != 0) {
                                    this.orderForm.itemOption('orderInfo.img', 'visible', true);
                                }
                                this.stepData = [
                                    {title: '患者申请退货退款', content: res.data.status.returnApplyTime},
                                    {title: '药店处理退货申请', content: res.data.status.returnAcceptTime},
                                    {title: '退款完毕', content: res.data.status.returnFinishTime}
                                ];
                                if (res.data.status.status == 4) {
                                    this.orderForm.itemOption('orderInfo.returnApplyTime', 'visible', true);
                                    this.current = 0
                                } else if (res.data.status.status == 5) {
                                    this.orderForm.itemOption('orderInfo.returnAcceptTime', 'visible', true);
                                    this.current = 1
                                }
                            }

                        } else if (res.data.status.status == 6) {
                            this.orderForm.itemOption('orderInfo.payTime', 'visible', true);
                            this.orderForm.itemOption('orderInfo.confirmTime', 'visible', true);
                            if (res.data.orderInfo.dispatchType == 2) {
                                this.stepData = [
                                    {title: '待付款', content: res.data.status.createTime},
                                    {title: '已付款', content: res.data.status.payTime},
                                    {title: '已收药', content: res.data.status.confirmTime},
                                ];
                                this.current = 2;
                                this.orderFormData.storeAddress = res.data.address[0].name + ' , ' + res.data.address[0].mobile + ' , ' + res.data.address[0].address;
                            } else {
                                this.stepData = [
                                    {title: '待付款', content: res.data.status.createTime},
                                    {title: '已付款', content: res.data.status.payTime},
                                    {title: '配送中', content: res.data.status.deliverTime},
                                    {title: '已收药', content: res.data.status.confirmTime},
                                ];
                                this.current = 3;
                                this.orderForm.itemOption('orderInfo.deliverTime', 'visible', true);
                                this.orderForm.itemOption('addressInfo.address', 'visible', true);
                                this.orderFormData.address = res.data.address[0].name + ' , ' + res.data.address[0].mobile + ' , ' + res.data.address[0].address;
                                this.orderFormData.storeAddress = res.data.address[1].name + ' , ' + res.data.address[1].mobile + ' , ' + res.data.address[1].address;
                            }

                        } else if (res.data.status.status == 7) {//已退款
                            this.orderForm.itemOption('orderInfo.returnReson', 'visible', true);
                            if (res.data.orderInfo.dispatchType == 2) {
                                this.orderFormData.storeAddress = res.data.address[0].name + ' , ' + res.data.address[0].mobile + ' , ' + res.data.address[0].address;
                            } else {
                                this.orderForm.itemOption('addressInfo.address', 'visible', true);
                                this.orderFormData.address = res.data.address[0].name + ' , ' + res.data.address[0].mobile + ' , ' + res.data.address[0].address;
                                this.orderFormData.storeAddress = res.data.address[1].name + ' , ' + res.data.address[1].mobile + ' , ' + res.data.address[1].address;
                            }
                            if (res.data.status.returnType == 1) {
                                this.stepData = [
                                    {title: '患者申请仅退款', content: res.data.status.returnApplyTime},
                                    {title: '退款完成', content: res.data.status.returnFinishTime}
                                ];
                                this.current = 1
                            } else {
                                if (this.orderFormData.fileImg && this.orderFormData.fileImg.length != 0) {
                                    this.orderForm.itemOption('orderInfo.img', 'visible', true);
                                }
                                this.stepData = [
                                    {title: '患者申请退货退款', content: res.data.status.returnApplyTime},
                                    {title: '药店处理退货申请', content: res.data.status.returnAcceptTime},
                                    {title: '退款完毕', content: res.data.status.returnFinishTime}
                                ];
                                this.current = 2
                            }
                            this.orderForm.itemOption('orderInfo.returnFinishTime', 'visible', true);

                        } else if (res.data.status.status == 9) {
                            this.stepData = [
                                {title: '待付款', content: res.data.status.createTime},
                                {title: '交易关闭', content: res.data.status.cancelTime},
                            ];
                            this.current = 1;
                            this.orderForm.itemOption('orderInfo.cancelTime', 'visible', true);
                            if (res.data.orderInfo.dispatchType == 2) {
                                this.orderFormData.storeAddress = res.data.address[0].name + ' , ' + res.data.address[0].mobile + ' , ' + res.data.address[0].address;
                            } else {
                                this.orderForm.itemOption('addressInfo.address', 'visible', true);
                                this.orderFormData.address = res.data.address[0].name + ' , ' + res.data.address[0].mobile + ' , ' + res.data.address[0].address;
                                this.orderFormData.storeAddress = res.data.address[1].name + ' , ' + res.data.address[1].mobile + ' , ' + res.data.address[1].address;
                            }
                        }
                        this.orderForm.option("formData", this.orderFormData);
                        this.orderForm.repaint();
                        let objData = {};
                        objData.product = res.data.product;
                        objData.dispatchFee = res.data.orderInfo.dispatchFee;
                        objData.payMoney = res.data.orderInfo.payMoney;
                        objData.dispatchType = res.data.orderInfo.dispatchType;
                        this.rowData.push(objData);
                        this.orderGrid.option("dataSource", this.rowData);
                        this.isSpin = false;
                    } else {

                    }
                }).catch(err => {
                    this.error(err)
                    // console.log(err)
                });
            },
            cancle() {
                this.$router.push({
                    name: 'order',
                });
            },
            returnMoney() {
                let params = {};
                this.btnPart.items[0].modal_loading = true;
                params.orderId = this.orderFormData.orderId;
                this.$post(return_money_url, params).then(res => {
                    if (res.code == '200') {
                        this.success('操作成功!', () => {
                            this.$router.push({
                                name: 'order',
                            });
                        });
                    } else {
                        //提示信息
                        this.warn(res.msg);
                    }
                }).catch(err => {
                    this.error(err);
                });
            },
            recipeDetail(val) {
                let ids = [];
                if (this.orderFormData.recipeId.length == 1) {
                    ids.push(Number(this.orderFormData.recipeId[val]))
                } else {
                    ids.push(Number(this.orderFormData.recipeId[val - 1]))
                }
                this.$put(recipe_detail_url, {recipeIds: ids}).then(res => {
                    if (res.code == '200') {
                        this.recipeInfo = res.rows[0];
                        this.recipeInfo.title = res.rows[0].orgName + '处方签';
                        this.recipeInfo.info = [];
                        for (let i = 0; i < res.rows[0].bizRecipeDetails.length; i++) {
                            let info = {};
                            info.name = res.rows[0].bizRecipeDetails[i].name;
                            info.spec = res.rows[0].bizRecipeDetails[i].spec;
                            info.eachDose = res.rows[0].bizRecipeDetails[i].eachDose;
                            info.freq = res.rows[0].bizRecipeDetails[i].freq;
                            this.recipeInfo.info.push(info);
                        }
                        this.visible = true;
                    } else {

                    }
                }).catch(err => {
                    this.error(err)
                    // console.log(err)
                });
            },
            dispatchInfo() {
                this.$put(dispatch_info_url, {orderId: this.orderFormData.orderId}).then(res => {
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
            showOrder() {
                this.isShowOrder = !this.isShowOrder;
            }
        }
    }
</script>