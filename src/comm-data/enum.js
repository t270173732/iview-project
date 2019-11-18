const Enum = {
    yesNo: [
        {id: 0, text: '否'},
        {id: 1, text: '是'}
    ],
    sex: [
        {id: 1, text: '男'},
        {id: 2, text: '女'}
    ],
    status: [
        {id: 0, text: '停用', badgeStatus: 'error'},
        {id: 1, text: '启用', badgeStatus: 'success'},
    ],
    drugClass: [
        {id: 1, text: '西成药'},
        {id: 2, text: '中成药'},
    ],
    specialType: [
        {id: '1', text: '普通药'},
        {id: '2', text: '胰岛素'},
        {id: '3', text: '抗菌药'},
    ],
    attr:[
        {id: '1', text: '急救'},
        {id: '2', text: '贵重'},
        {id: '3', text: '冷藏'},
        {id: '4', text: '易碎'},
    ],
    nature:[
        {id: '1', text: '公立'},
        {id: '2', text: '民营'},
    ],
    hosGrade:[
        {id: '1', text: '三甲'},
        {id: '2', text: '三乙'},
        {id: '3', text: '三丙'},
        {id: '4', text: '二甲'},
        {id: '5', text: '二乙'},
        {id: '6', text: '二丙'},
        {id: '7', text: '一级'},
    ],
    transType:[
        {id: '1', text: '处方转入'},
        {id: '2', text: '处方转出'},
    ],
    //机构类型  1--平台运营  2--医疗机构，3--药房，4--供应商
    orgType:[
        {id: 1, text: '平台运营'},
        {id: 2, text: '医疗机构'},
        {id: 5, text: '药房'},
        {id: 4, text: '监管机构'},
    ],
    //角色类型  1--平台运营端，2--医疗机构端，3--药店端，4--监管机构端
    roleType:[
        {id: 1, text: '平台运营端'},
        {id: 2, text: '医疗机构端'},
        {id: 5, text: '药店端'},
        {id: 4, text: '监管机构端'},
    ],
    dispatchType:[
        {id: 1, text: '送货上门'},
        {id: 2, text: '到店自提'},
        {id: 3, text: '全部'},
    ],
    storeType:[
        {id: 1, text: '便民药房'},
        {id: 2, text: '连锁药店'},
        {id: 3, text: '加盟药店'},
    ],
    storeNature:[
        {id: '1', text: '直营店'},
        {id: '2', text: '非直营店'},
    ],
    //国家基药、地方基药、其他基药
    baseDrug:[
        {id: '1', text: '国家基药'},
        {id: '2', text: '地方基药'},
        {id: '3', text: '其他基药'},
    ],
    source:[
        {id: '1', text: '国产'},
        {id: '2', text: '合资'},
        {id: '3', text: '进口'},
        {id: '4', text: '自制'},
        {id: '5', text: '其他'},
    ],
    //内容类型 1--活动，2--资讯，3--商品，4--自定义H5
    contentType:[
        {id: 1, text: '活动'},
        {id: 2, text: '资讯'},
        {id: 3, text: '药品'},
    ],
    //发布状态 0--新建，1--发布，2--撤销
    castStatus:[
        {id: 0, text: '新建'},
        {id: 1, text: '发布'},
        {id: 2, text: '撤回'},
    ],
    //状态 0--待审核，1--审核通过，2--不通过，3--撤回
    noticeStatus:[
        {id: 0, text: '待审核'},
        {id: 1, text: '审核通过'},
        {id: 2, text: '审核不通过'},
        {id: 3, text: '撤回'},
    ],
    noticeAudit:[
        {id: 0, text: '待审核'},
        {id: 1, text: '审核通过'},
    ],
    //状态 1--新建，2--审核，3--驳回，4--撤回
    contentStatus:[
        {id: 1, text: '待审核'},
        {id: 2, text: '审核通过'},
        {id: 3, text: '审核不通过'},
        {id: 4, text: '撤回'},
    ],
    contentAuth:[
        {id: 1, text: '新建'},
        {id: 2, text: '审核'},
    ],
    drugType:[
        {id: 1, text: '非处方药'},
        {id: 2, text: '处方药'},
    ],
    //状态 1--新建，2--发布，3--审核，4--驳回，0--停用
    activeStatus:[
        {id: 1, text: '新建'},
        {id: 2, text: '审核发布'},
        {id: 3, text: '驳回'},
    ],
    bannerType:[
        {id: 1, text: '患者端APP'},
    ],
    payType:[
        {id: 1, text: '线上支付'},
        {id: 2, text: '货到付款'},
    ],
    recipeStatus:[
        {id: 0, text: '新处方'},
        {id: 1, text: '已审核'},
        {id: 5, text: '已下订单'},
        {id: 2, text: '已取药'},
        {id: 3, text: '已退药'},
        {id: 4, text: '已失效'},
    ],
    printStatus:[
        {id: 0, text: '未打印'},
        {id: 1, text: '已打印'},
    ],
    patientType:[
        {id: 1, text: '普通'},
    ],
    authStatus:[
        {id: 0, text: '待审核'},
        {id: 1, text: '审核通过'},
        {id: 2, text: '审核不通过'},
    ],
    //对码状态  0--未对码  1--已对码   2--相似对码  3--无匹配对码
    mapStatus:[
        {id: 0, text: '未对码'},
        {id: 1, text: '已对码'},
    ],
    //交易类型（1-支付、2-退款）
    tradeType:[
        {id: 1, text: '支付'},
        {id: 2, text: '退款'},
    ],
    orderType:[
        {id: 1, text: '处方购药'},
        {id: 2, text: '在线购药'},
        {id: 3, text: '预约挂号'},
        {id: 4, text: '自助缴费'},
        {id: 5, text: '在线咨询'},
        {id: 6, text: '在线问诊'},
    ],
    payType1:[
        {id: 1, text: '支付宝'},
        {id: 2, text: '微信'},
        {id: 3, text: '医保'},
    ]
};
export default Enum;
