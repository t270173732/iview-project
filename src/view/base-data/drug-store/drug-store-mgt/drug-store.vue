<style lang="less">
    @import "../../../../styles/common.less";
</style>
<template>
    <div>
        <Card dis-hover>
            <p style="text-align: right">
                <Button type="primary" @click="submit" :loading="modal_loading">保存</Button>
            </p>
            <Row class="margin-top-10">
                <div id="store-info"></div>
            </Row>
        </Card>
    </div>
</template>
<script>
    import Vue from 'vue';
    import {codefans_net_CC2PY} from '@/libs/util.js';
    import Image from '../drug-store-audit/image';
    import LicenseImage from '../drug-store-audit/licenseImage';
    import GspImage from '../drug-store-audit/gspImage';
    import LogoImage from '../drug-store-dictionary/logoImg';
    let store_detail_url = '/biz/bdOrgDrugstore/read/detail';
    let store_insert_url = '/biz/bdOrgDrugstore/updateDrugStore';
    export default {
        data(){
            return{
                storeInfoForm:{},
                storeInfoFormData:{},
                modal_loading:false
            }
        },
        mounted(){
            this.storeInfoForm = $("#store-info").dxForm({
                colCount:1,
                formData:this.storeInfoFormData,
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
                                    text: "药店编码"
                                },
                                editorOptions: {
                                    readOnly:true
                                },
                            },
                            {
                                dataField: "orgName",
                                label: {
                                    alignment: "right",
                                    text: "药店名称"
                                },
                                editorOptions:{
                                    readOnly:true
                                },
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
                                dataField: "type",
                                editorType: "dxSelectBox",
                                label: {
                                    alignment: "right",
                                    text: "药店类型"
                                },
                                editorOptions:{
                                    dataSource:this.enum.storeType,
                                    displayExpr:'text',
                                    valueExpr:'id'
                                },
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
                                dataField: "areaId",
                                label: {
                                    alignment: "right",
                                    text: "区域"
                                },
                                validationRules: [{
                                    type: 'required',
                                    message: '请选择区域'
                                }],
                                template:this.addAreaCascade
                            },
                            {
                                dataField: "address",
                                label: {
                                    alignment: "right",
                                    text: "地址"
                                },
                                validationRules: [{
                                    type: 'required',
                                    message: '请输入地址'
                                }],
                                editorOptions:{
                                    maxLength:100
                                },
                            },
                            {
                                dataField: "nature",
                                editorType: "dxSelectBox",
                                label: {
                                    alignment: "right",
                                    text: "药店性质"
                                },
                                editorOptions:{
                                    dataSource:this.enum.storeNature,
                                    displayExpr:'text',
                                    valueExpr:'id'
                                },
                            },
                            {
                                dataField: "dispatchType",
                                editorType: "dxSelectBox",
                                label: {
                                    alignment: "right",
                                    text: "配送方式"
                                },
                                editorOptions:{
                                    dataSource:this.enum.dispatchType,
                                    displayExpr:'text',
                                    valueExpr:'id'
                                },
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
                            },
                            {
                                dataField: "businessHours",
                                label: {
                                    alignment: "right",
                                    text: "营业时间"
                                },
                                editorOptions:{
                                    maxLength:50
                                },
                                validationRules: [{
                                    type: 'required',
                                    message: '请选择营业时间'
                                }],
                                // template:this.timePicker
                            },
                            {
                                dataField: "featureService",
                                colSpan:3,
                                label: {
                                    alignment: "right",
                                    text: "特色服务"
                                },
                                editorOptions:{
                                    maxLength:500
                                },
                                validationRules: [{
                                    type: 'required',
                                    message: '请输入特色服务'
                                }],
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
                                    text: "药店图标"
                                },
                                template: (data, itemElement)=>{
                                    itemElement.append("<div id='addLogo'/>");
                                }
                            },
                        ]
                    },
                    {
                        itemType: 'group',
                        caption: '药店营业执照',
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
                                    readOnly:true
                                },
                            },
                            {
                                dataField: "blType",
                                label: {
                                    alignment: "right",
                                    text: "类型"
                                },
                                editorOptions:{
                                    readOnly:true
                                },
                            },
                            {
                                dataField: "blAddr",
                                label: {
                                    alignment: "right",
                                    text: "住所"
                                },
                                editorOptions:{
                                    readOnly:true
                                },
                            },
                            {
                                dataField: "blRegistCapital",
                                label: {
                                    alignment: "right",
                                    text: "注册资金"
                                },
                                editorOptions:{
                                    readOnly:true
                                },
                            },
                            {
                                dataField: "blFundingTime",
                                label: {
                                    alignment: "right",
                                    text: "成立日期"
                                },
                                editorOptions:{
                                    readOnly:true
                                },
                            },
                            {
                                dataField: "blBizLimit",
                                label: {
                                    alignment: "right",
                                    text: "经营期限"
                                },
                                editorOptions:{
                                    readOnly:true
                                },
                            },
                            {
                                dataField: "blBizScope",
                                label: {
                                    alignment: "right",
                                    text: "经营范围"
                                },
                                editorOptions:{
                                    readOnly:true
                                },
                            },
                            {
                                dataField: "blPerson",
                                label: {
                                    alignment: "right",
                                    text: "法定代表人"
                                },
                                editorOptions:{
                                    readOnly:true
                                },
                            },
                            {
                                dataField: "blLicenseTime",
                                label: {
                                    alignment: "right",
                                    text: "登记日期"
                                },
                                editorOptions:{
                                    readOnly:true
                                },
                            },
                            {
                                dataField: "blLicenseOrg",
                                label: {
                                    alignment: "right",
                                    text: "登记机关"
                                },
                                editorOptions:{
                                    readOnly:true
                                },
                            },
                            {
                                itemType:'empty'
                            },
                            {
                                itemType:'empty'
                            },
                            {
                                dataField: "blImg",
                                colSpan:4,
                                label: {
                                    alignment: "right",
                                    text: "资质上传"
                                },
                                template: (data, itemElement)=>{
                                    itemElement.append("<div id='addImage'/>");
                                }
                            },
                        ]
                    },
                    {
                        itemType: 'group',
                        caption: '药品经营许可证',
                        colCount: 4,
                        name:"drugLicense",
                        visible:true,
                        items:[
                            {
                                dataField: "dblName",
                                label: {
                                    alignment: "right",
                                    text: "企业名称"
                                },
                                editorOptions:{
                                    readOnly:true
                                },
                            },
                            {
                                dataField: "dblAddr",
                                label: {
                                    alignment: "right",
                                    text: "注册地址"
                                },
                                editorOptions:{
                                    readOnly:true
                                },
                            },
                            {
                                dataField: "dblPerson",
                                label: {
                                    alignment: "right",
                                    text: "法定代表人"
                                },
                                editorOptions:{
                                    readOnly:true
                                },
                            },
                            {
                                dataField: "dblPrincipal",
                                label: {
                                    alignment: "right",
                                    text: "企业负责人"
                                },
                                editorOptions:{
                                    readOnly:true
                                },
                            },
                            {
                                dataField: "dblQuaPrincipal",
                                label: {
                                    alignment: "right",
                                    text: "质量负责人"
                                },
                                editorOptions:{
                                    readOnly:true
                                },
                            },
                            {
                                dataField: "dblStoreAddr",
                                label: {
                                    alignment: "right",
                                    text: "仓库地址"
                                },
                                editorOptions:{
                                    readOnly:true
                                },
                            },
                            {
                                dataField: "dblNo",
                                label: {
                                    alignment: "right",
                                    text: "证号"
                                },
                                editorOptions:{
                                    readOnly:true
                                },
                            },
                            {
                                dataField: "dblBizMode",
                                label: {
                                    alignment: "right",
                                    text: "经营方式"
                                },
                                editorOptions:{
                                    readOnly:true
                                },
                            },
                            {
                                dataField: "dblBizScope",
                                colSpan:4,
                                label: {
                                    alignment: "right",
                                    text: "经营范围"
                                },
                                editorOptions:{
                                    readOnly:true
                                },
                            },
                            {
                                dataField: "dblValidTime",
                                label: {
                                    alignment: "right",
                                    text: "有效期至"
                                },
                                editorOptions:{
                                    readOnly:true
                                },
                            },
                            {
                                dataField: "dblLicenseOrg",
                                label: {
                                    alignment: "right",
                                    text: "发证机关"
                                },
                                editorOptions:{
                                    readOnly:true
                                },
                            },
                            {
                                dataField: "dblLicenseTime",
                                label: {
                                    alignment: "right",
                                    text: "发证日期"
                                },
                                editorOptions:{
                                    readOnly:true
                                },
                            },
                            {
                                dataField: "dblWholesale",
                                label: {
                                    alignment: "right",
                                    text: "批发"
                                },
                                editorOptions:{
                                    readOnly:true
                                },
                            },
                            {
                                dataField: "dblImg",
                                colSpan:4,
                                label: {
                                    alignment: "right",
                                    text: "资质上传"
                                },
                                template: (data, itemElement)=>{
                                    itemElement.append("<div id='uploadFile'/>");
                                }
                            },
                        ]
                    },
                    {
                        itemType: 'group',
                        caption: '药品经营质量管理规范认证证书（GSP）',
                        colCount: 4,
                        name:"gsp",
                        visible:true,
                        items:[
                            {
                                dataField: "gspName",
                                label: {
                                    alignment: "right",
                                    text: "企业名称"
                                },
                                editorOptions:{
                                    readOnly:true
                                },
                            },
                            {
                                dataField: "gspAddr",
                                colSpan:2,
                                label: {
                                    alignment: "right",
                                    text: "地址"
                                },
                                editorOptions:{
                                    readOnly:true
                                },
                            },
                            {
                                dataField: "gspScope",
                                label: {
                                    alignment: "right",
                                    text: "认证范围"
                                },
                                editorOptions:{
                                    readOnly:true
                                },
                            },
                            {
                                dataField: "gspNo",
                                label: {
                                    alignment: "right",
                                    text: "证书编号"
                                },
                                editorOptions:{
                                    readOnly:true
                                },
                            },
                            {
                                dataField: "gspValidTime",
                                label: {
                                    alignment: "right",
                                    text: "有效期至"
                                },
                                editorOptions:{
                                    readOnly:true
                                },
                            },
                            {
                                dataField: "gspLicenseOrg",
                                label: {
                                    alignment: "right",
                                    text: "发证机关"
                                },
                                editorOptions:{
                                    readOnly:true
                                },
                            },
                            {
                                dataField: "gspLicenseTime",
                                label: {
                                    alignment: "right",
                                    text: "发证日期"
                                },
                                editorOptions:{
                                    readOnly:true
                                },
                            },
                            {
                                dataField: "gspImg",
                                colSpan:4,
                                label: {
                                    alignment: "right",
                                    text: "资质上传"
                                },
                                template: (data, itemElement)=>{
                                    itemElement.append("<div id='uploadGSP'/>");
                                }
                            },
                        ]
                    }
                ]
            }).dxForm("instance");
            this.storeInit();
        },
        methods:{
            storeInit(){
                this.$put(store_detail_url,{}).then(res => {
                    if(res.code=='200')
                    {
                        this.storeInfoFormData = res.data;
                        this.storeInfoForm.option("formData",this.storeInfoFormData);
                        this.storeInfoForm.repaint();
                        this.uploadLogo();
                        this.addIamgeFile();
                        this.uploadFile();
                        this.uploadGSP();
                    }
                    else {

                    }
                }).catch(err=>
                {
                    this.error(err)
                    // console.log(err)
                });
            },
            submit(){
                let params = {};
                this.modal_loading = true;
                if(!this.storeInfoForm.validate().isValid) {
                    this.modal_loading = false;
                    return;
                }
                if(!this.storeInfoFormData.areaId){
                    this.warn('请选择药店区域')
                }
                params = this.storeInfoFormData;
                this.$post(store_insert_url,params).then(res => {
                    if(res.code=='200')
                    {
                        this.success('保存成功!',()=>{
                            this.modal_loading = false;
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
                let FileUpload = new Vue(Image);
                FileUpload.$parent = this;
                FileUpload.$mount('#addImage');
            },
            uploadFile: function () {
                let FileUpload = new Vue(LicenseImage);
                FileUpload.$parent = this;
                FileUpload.$mount('#uploadFile');
            },
            uploadGSP: function () {
                let FileUpload = new Vue(GspImage);
                FileUpload.$parent = this;
                FileUpload.$mount('#uploadGSP');
            },
            uploadLogo: function () {
                let FileUpload = new Vue(LogoImage);
                FileUpload.$parent = this;
                FileUpload.$mount('#addLogo');
            },
            addAreaCascade: function (data, itemElement) {
                itemElement.append("<div id='Area'/>");
                let area = new (Vue.component('AreaCascade'));
                area.field = data;
                area.$mount('#Area');
            },
        }
    }
</script>
