<style lang="less">
    @import "../../../../styles/common.less";
</style>
<template>
    <div>
        <Card dis-hover>
            <div slot="title" class="cardHead">
                <a href="#" @click.prevent="cancle">
                    <Icon type="ios-arrow-back" />
                    返回
                </a>
            </div>
            <p slot="extra" >
                <Button type="primary" @click="submit" :loading="modal_loading">保存</Button>
                <Button class="margin-left-5" @click="cancle">取消</Button>
            </p>
            <Row class="margin-top-10">
                <div id="supplier-info"></div>
            </Row>
        </Card>
    </div>
</template>
<script>
    import Vue from 'vue';
    import {codefans_net_CC2PY} from '@/libs/util.js';
    import Image from './image';
    import SupplierImage from './supplierImage';
    import GspImage from './gspImage';
    import LogoImage from './logoImg';
    let supplier_detail_url = '/biz/bdOrgSupply/read/detail';
    let supplier_insert_url = '/biz/bdOrgSupply/updateSupply';
    export default {
        data(){
            return{
                supplierForm:{},
                supplierFormData:{},
                modal_loading:false
            }
        },
        mounted(){
            this.supplierForm = $("#supplier-info").dxForm({
                colCount:1,
                formData:this.supplierFormData,
                items:[
                    {
                        itemType: 'group',
                        caption: '基础信息',
                        colCount: 4,
                        name:"baseInfo",
                        items:[
                            {
                                dataField: "orgCode",
                                label: {
                                    alignment: "right",
                                    text: "供应商编码"
                                },
                                editorOptions: {
                                    placeholder:'<系统自动分配>',
                                    disabled:true,
                                },
                            },
                            {
                                dataField: "orgName",
                                label: {
                                    alignment: "right",
                                    text: "供应商名称"
                                },
                                editorOptions:{
                                    maxLength:50,
                                    onValueChanged:(e)=>{
                                        if(e.value){
                                            this.supplierForm.updateData('simpleCode',codefans_net_CC2PY($.trim(e.value)))
                                        }
                                    }
                                },
                                validationRules: [{
                                    type: 'required',
                                    message: '请输入供应商名称'
                                }],
                            },
                            {
                                dataField: "simpleCode",
                                label: {
                                    alignment: "right",
                                    text: "简码"
                                },
                                editorOptions:{
                                    maxLength:20,
                                    readOnly:true
                                },
                            },
                            {
                                dataField: "simpleName",
                                label: {
                                    alignment: "right",
                                    text: "供应商简称"
                                },
                                editorOptions:{
                                    maxLength:20
                                },
                                validationRules: [{
                                    type: 'required',
                                    message: '请输入供应商简称'
                                }],
                            },
                            {
                                dataField: "nature",
                                label: {
                                    alignment: "right",
                                    text: "企业性质"
                                },
                                editorOptions:{
                                    maxLength:20
                                },
                                validationRules: [{
                                    type: 'required',
                                    message: '请输入企业性质'
                                }],
                            },
                            {
                                dataField: "contacts",
                                label: {
                                    alignment: "right",
                                    text: "联系人"
                                },
                                editorOptions:{
                                    maxLength:20
                                },
                                validationRules: [{
                                    type: 'required',
                                    message: '请输入联系人'
                                }],
                            },
                            {
                                dataField: "telephone",
                                label: {
                                    alignment: "right",
                                    text: "联系电话"
                                },
                                validationRules: [{
                                    type: 'required',
                                    message: '请输入联系电话'
                                },{
                                    type: "pattern",
                                    pattern: "^(((0\\d{2,3}-)?\\d{7,8})|(1[3584679]\\d{9}))$",
                                    message: "请输入正确的联系电话!"
                                }],
                            },
                            {
                                dataField: "address",
                                label: {
                                    alignment: "right",
                                    text: "地址"
                                },
                                editorOptions:{
                                    maxLength:100
                                },
                                validationRules: [{
                                    type: 'required',
                                    message: '请输入地址'
                                }],
                            },
                            {
                                dataField: "bank",
                                label: {
                                    alignment: "right",
                                    text: "开户银行"
                                },
                                editorOptions:{
                                    maxLength:50
                                },
                                validationRules: [{
                                    type: 'required',
                                    message: '请输入开户银行'
                                }],
                            },
                            {
                                dataField: "account",
                                label: {
                                    alignment: "right",
                                    text: "账号"
                                },
                                editorOptions:{
                                    maxLength:50
                                },
                                validationRules: [{
                                    type: 'required',
                                    message: '请输入账号'
                                }],
                            },
                            {
                                dataField: "status",
                                editorType:'dxSelectBox',
                                label: {
                                    alignment: "right",
                                    text: "状态"
                                },
                                editorOptions:{
                                    dataSource:this.enum.status,
                                    displayExpr:'text',
                                    valueExpr:'id'
                                },
                                validationRules: [{
                                    type: 'required',
                                    message: '请选择状态'
                                }],
                            },
                            {
                                itemType:'empty',
                            },
                            {
                                dataField: "remark",
                                colSpan: 4,
                                editorType: "dxTextArea",
                                editorOptions: {
                                    height: 80,
                                    maxLength:100
                                },
                                label: {
                                    alignment: "right",
                                    text: "备注"
                                },
                            },
                            {
                                dataField: "logoImg",
                                colSpan:4,
                                label: {
                                    alignment: "right",
                                    text: "机构图标"
                                },
                                template: (data, itemElement)=>{
                                    itemElement.append("<div id='addLogo'/>");
                                }
                            },
                        ]
                    },
                    {
                        itemType: 'group',
                        caption: '供应商营业执照',
                        colCount: 4,
                        name:"license",
                        visible:true,
                        items:[
                            {
                                dataField: "blName",
                                label: {
                                    alignment: "right",
                                    text: "名称"
                                },
                                editorOptions:{
                                    maxLength:50
                                },
                                validationRules: [{
                                    type: 'required',
                                    message: '请输入名称'
                                }],
                            },
                            {
                                dataField: "blType",
                                label: {
                                    alignment: "right",
                                    text: "类型"
                                },
                                editorOptions:{
                                    maxLength:50
                                },
                                validationRules: [{
                                    type: 'required',
                                    message: '请输入类型'
                                }],
                            },
                            {
                                dataField: "blAddr",
                                label: {
                                    alignment: "right",
                                    text: "住所"
                                },
                                editorOptions:{
                                    maxLength:50
                                },
                                validationRules: [{
                                    type: 'required',
                                    message: '请输入住所'
                                }],
                            },
                            {
                                dataField: "blRegistCapital",
                                label: {
                                    alignment: "right",
                                    text: "注册资金"
                                },
                                editorOptions:{
                                    maxLength:50
                                },
                                validationRules: [{
                                    type: 'required',
                                    message: '请输入注册资金'
                                }],
                            },
                            {
                                dataField: "blFundingTime",
                                label: {
                                    alignment: "right",
                                    text: "成立日期"
                                },
                                editorOptions:{
                                    maxLength:50
                                },
                                validationRules: [{
                                    type: 'required',
                                    message: '请选择成立日期'
                                }],
                            },
                            {
                                dataField: "blBizLimit",
                                label: {
                                    alignment: "right",
                                    text: "经营期限"
                                },
                                editorOptions:{
                                    maxLength:50
                                },
                                validationRules: [{
                                    type: 'required',
                                    message: '请选择经营期限'
                                }],
                            },
                            {
                                dataField: "blPerson",
                                label: {
                                    alignment: "right",
                                    text: "法定代表人"
                                },
                                editorOptions:{
                                    maxLength:50
                                },
                                validationRules: [{
                                    type: 'required',
                                    message: '请输入法定代表人'
                                }],
                            },
                            {
                                dataField: "blLicenseTime",
                                label: {
                                    alignment: "right",
                                    text: "登记日期"
                                },
                                editorOptions:{
                                    maxLength:50
                                },
                                validationRules: [{
                                    type: 'required',
                                    message: '请选择登记日期'
                                }],
                            },
                            {
                                dataField: "blBizScope",
                                colSpan:4,
                                label: {
                                    alignment: "right",
                                    text: "经营范围"
                                },
                                editorOptions:{
                                    maxLength:500
                                },
                                validationRules: [{
                                    type: 'required',
                                    message: '请输入经营范围'
                                }],
                            },
                            {
                                dataField: "blLicenseOrg",
                                label: {
                                    alignment: "right",
                                    text: "登记机关"
                                },
                                editorOptions:{
                                    maxLength:50
                                },
                                validationRules: [{
                                    type: 'required',
                                    message: '请输入登记机关'
                                }],
                            },
                            {itemType:'empty'},
                            {itemType:'empty'},
                            {itemType:'empty'},
                            {
                                dataField: "blImg",
                                colSpan:4,
                                label: {
                                    alignment: "right",
                                    text: "资质上传"
                                },
                                validationRules: [{
                                    type: 'required',
                                    message: '请上传资质'
                                }],
                                template: (data, itemElement)=>{
                                    itemElement.append("<div id='blImg'/>");
                                }
                            },
                        ]
                    },
                    {
                        itemType: 'group',
                        caption: '供应商经营许可证',
                        colCount: 4,
                        name:"supplierLicense",
                        visible:true,
                        items:[
                            {
                                dataField: "dblName",
                                label: {
                                    alignment: "right",
                                    text: "企业名称"
                                },
                                editorOptions:{
                                    maxLength:50
                                },
                                validationRules: [{
                                    type: 'required',
                                    message: '请输入企业名称'
                                }],
                            },
                            {
                                dataField: "dblAddr",
                                label: {
                                    alignment: "right",
                                    text: "注册地址"
                                },
                                editorOptions:{
                                    maxLength:100
                                },
                                validationRules: [{
                                    type: 'required',
                                    message: '请输入注册地址'
                                }],
                            },
                            {
                                dataField: "dblPerson",
                                label: {
                                    alignment: "right",
                                    text: "法定代表人"
                                },
                                editorOptions:{
                                    maxLength:20
                                },
                                validationRules: [{
                                    type: 'required',
                                    message: '请输入法定代表人'
                                }],
                            },
                            {
                                dataField: "dblPrincipal",
                                label: {
                                    alignment: "right",
                                    text: "企业负责人"
                                },
                                editorOptions:{
                                    maxLength:20
                                },
                                validationRules: [{
                                    type: 'required',
                                    message: '请输入企业负责人'
                                }],
                            },
                            {
                                dataField: "dblQuaPrincipal",
                                label: {
                                    alignment: "right",
                                    text: "质量负责人"
                                },
                                editorOptions:{
                                    maxLength:20
                                },
                                validationRules: [{
                                    type: 'required',
                                    message: '请输入质量负责人'
                                }],
                            },
                            {
                                dataField: "dblStoreAddr",
                                label: {
                                    alignment: "right",
                                    text: "仓库地址"
                                },
                                editorOptions:{
                                    maxLength:50
                                },
                                validationRules: [{
                                    type: 'required',
                                    message: '请输入仓库地址'
                                }],
                            },
                            {
                                dataField: "dblNo",
                                label: {
                                    alignment: "right",
                                    text: "证号"
                                },
                                editorOptions:{
                                    maxLength:50
                                },
                                validationRules: [{
                                    type: 'required',
                                    message: '请输入证号'
                                }],
                            },
                            {
                                dataField: "dblBizMode",
                                label: {
                                    alignment: "right",
                                    text: "经营方式"
                                },
                                editorOptions:{
                                    maxLength:20
                                },
                                validationRules: [{
                                    type: 'required',
                                    message: '请输入经营方式'
                                }],
                            },
                            {
                                dataField: "dblBizScope",
                                colSpan:4,
                                label: {
                                    alignment: "right",
                                    text: "经营范围"
                                },
                                editorOptions:{
                                    maxLength:500
                                },
                                validationRules: [{
                                    type: 'required',
                                    message: '请输入经营范围'
                                }],
                            },
                            {
                                dataField: "dblValidTime",
                                label: {
                                    alignment: "right",
                                    text: "有效期至"
                                },
                                editorOptions:{
                                    maxLength:20
                                },
                                validationRules: [{
                                    type: 'required',
                                    message: '请选择有效期至'
                                }],
                            },
                            {
                                dataField: "dblLicenseOrg",
                                label: {
                                    alignment: "right",
                                    text: "发证机关"
                                },
                                editorOptions:{
                                    maxLength:50
                                },
                                validationRules: [{
                                    type: 'required',
                                    message: '请输入发证机关'
                                }],
                            },
                            {
                                dataField: "dblLicenseTime",
                                label: {
                                    alignment: "right",
                                    text: "发证日期"
                                },
                                editorOptions:{
                                    maxLength:20
                                },
                                validationRules: [{
                                    type: 'required',
                                    message: '请选择发证日期'
                                }],
                            },
                            {
                                dataField: "dblWholesale",
                                label: {
                                    alignment: "right",
                                    text: "批发"
                                },
                                editorOptions:{
                                    maxLength:20
                                },
                                validationRules: [{
                                    type: 'required',
                                    message: '请输入批发'
                                }],
                            },
                            {
                                dataField: "dblImg",
                                colSpan:4,
                                label: {
                                    alignment: "right",
                                    text: "资质上传"
                                },
                                validationRules: [{
                                    type: 'required',
                                    message: '请上传资质'
                                }],
                                template: (data, itemElement)=>{
                                    itemElement.append("<div id='uploadFile'/>");
                                }
                            },
                        ]
                    },
                    {
                        itemType: 'group',
                        caption: '供应商经营质量管理规范认证证书(GSP)',
                        colCount: 4,
                        name:"supplierGSP",
                        visible:true,
                        items:[
                            {
                                dataField: "gspName",
                                label: {
                                    alignment: "right",
                                    text: "企业名称"
                                },
                                editorOptions:{
                                    maxLength:50
                                },
                                validationRules: [{
                                    type: 'required',
                                    message: '请输入企业名称'
                                }],
                            },
                            {
                                dataField: "gspAddr",
                                label: {
                                    alignment: "right",
                                    text: "地址"
                                },
                                editorOptions:{
                                    maxLength:50
                                },
                                validationRules: [{
                                    type: 'required',
                                    message: '请输入地址'
                                }],
                            },
                            {
                                dataField: "gspNo",
                                label: {
                                    alignment: "right",
                                    text: "证书编号"
                                },
                                editorOptions:{
                                    maxLength:50
                                },
                                validationRules: [{
                                    type: 'required',
                                    message: '请输入证书编号'
                                }],
                            },
                            {
                                dataField: "gspValidTime",
                                label: {
                                    alignment: "right",
                                    text: "有效期至"
                                },
                                editorOptions:{
                                    maxLength:20
                                },
                                validationRules: [{
                                    type: 'required',
                                    message: '请选择有效期至'
                                }],
                            },
                            {
                                dataField: "gspScope",
                                colSpan:4,
                                label: {
                                    alignment: "right",
                                    text: "认证范围"
                                },
                                editorOptions:{
                                    maxLength:500
                                },
                                validationRules: [{
                                    type: 'required',
                                    message: '请输入认证范围'
                                }],
                            },
                            {
                                dataField: "gspLicenseOrg",
                                label: {
                                    alignment: "right",
                                    text: "发证机关"
                                },
                                editorOptions:{
                                    maxLength:50
                                },
                                validationRules: [{
                                    type: 'required',
                                    message: '请输入发证机关'
                                }],
                            },
                            {
                                dataField: "gspLicenseTime",
                                label: {
                                    alignment: "right",
                                    text: "发证日期"
                                },
                                editorOptions:{
                                    maxLength:20
                                },
                                validationRules: [{
                                    type: 'required',
                                    message: '请选择发证日期'
                                }],
                            },
                            {
                                itemType:'empty'
                            },{
                                itemType:'empty'
                            },
                            {
                                dataField: "gspImg",
                                label: {
                                    alignment: "right",
                                    text: "资质上传"
                                },
                                validationRules: [{
                                    type: 'required',
                                    message: '请上传资质'
                                }],
                                template: (data, itemElement)=>{
                                    itemElement.append("<div id='gspImg'/>");
                                }
                            },
                        ]
                    }
                ]
            }).dxForm("instance");

            this.supplierInit();
        },
        methods:{
            supplierInit(){
                if(this.$route.params.supplier_id == 0){
                    this.supplierFormData = {};
                    this.supplierFormData.status = 1;
                    this.supplierForm.option("formData",this.supplierFormData);
                    this.uploadLogo();
                    this.addIamgeFile();
                    this.uploadFile();
                    this.uploadGsp();
                }else{
                    let params = {};
                    params.id = this.$route.params.supplier_id;
                    this.$put(supplier_detail_url,params).then(res => {
                        if(res.code=='200')
                        {
                            this.supplierFormData = res.data;
                            this.supplierForm.itemOption('baseInfo.orgCode','editorOptions',{readOnly:true});
                            this.supplierForm.option("formData",this.supplierFormData);
                            this.uploadLogo();
                            this.addIamgeFile();
                            this.uploadFile();
                            this.uploadGsp();
                        }
                        else {

                        }
                    }).catch(err=>
                    {
                        this.error(err)
                        // console.log(err)
                    });
                }
            },
            cancle(){
                this.$router.push({
                    name:'supplier-dic'
                })
            },
            submit(){
                let params = {};
                this.modal_loading = true;
                if(!this.supplierForm.validate().isValid) {
                    this.modal_loading = false;
                    return;
                }
                params = this.supplierFormData;
                params.orgType = 3;
                if(!params.blImg && !params.blUrl){
                    this.warn('请上传营业执照');
                    this.modal_loading = false;
                    return;
                }
                if(params.blImg && params.blImg.length == 0){
                    this.warn('请上传营业执照');
                    this.modal_loading = false;
                    return;
                }
                if(!params.dblImg && !params.dblUrl){
                    this.warn('请上传许可证');
                    this.modal_loading = false;
                    return;
                }
                if(params.dblImg && params.dblImg.length == 0){
                    this.warn('请上传许可证');
                    this.modal_loading = false;
                    return;
                }
                if(!params.gspImg && !params.gspUrl){
                    this.warn('请上传GSP照');
                    this.modal_loading = false;
                    return;
                }
                if(params.gspImg && params.gspImg.length == 0){
                    this.warn('请上传GSP照');
                    this.modal_loading = false;
                    return;
                }
                this.$post(supplier_insert_url,params).then(res => {
                    if(res.code=='200')
                    {
                        this.success('保存成功!',()=>{
                            this.modal_loading = false;
                            this.$router.push({
                                name: 'supplier-dic',
                            });
                        });
                    }
                    else
                    {
                        this.modal_loading = false;
                        this.warn(res.msg);
                    }
                }).catch(err=>
                {
                    this.modal_loading = false;
                    this.error(err);
                });
            },
            addIamgeFile() {
                var FileUpload = new Vue(Image);
                FileUpload.$parent = this;
                FileUpload.$mount('#blImg');
            },
            uploadFile() {
                var FileUpload = new Vue(SupplierImage);
                FileUpload.$parent = this;
                FileUpload.$mount('#uploadFile');
            },
            uploadGsp() {
                var FileUpload = new Vue(GspImage);
                FileUpload.$parent = this;
                FileUpload.$mount('#gspImg');
            },
            uploadLogo: function () {
                let FileUpload = new Vue(LogoImage);
                FileUpload.$parent = this;
                FileUpload.$mount('#addLogo');
            },
        }
    }
</script>
