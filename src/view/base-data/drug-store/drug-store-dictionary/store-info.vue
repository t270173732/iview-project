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
                <div id="store-info"></div>
            </Row>
        </Card>
    </div>
</template>
<script>
    import Vue from 'vue';
    import {codefans_net_CC2PY} from '@/libs/util.js';
    import Image from './image';
    import LicenseImage from './licenseImage';
    import GspImage from './gspImage';
    import LogoImage from './logoImg';
    import TimePicker from '@/view/my-components/time-picker/time-picker'
    let store_detail_url = '/biz/bdOrgDrugstore/read/detail';
    let store_insert_url = '/biz/bdOrgDrugstore/updateDrugStore';
    export default {
        data(){
            return{
                cityName:'',
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
                                    placeholder:'<系统自动分配>',
                                    disabled:true,
                                },
                            },
                            {
                                dataField: "orgName",
                                label: {
                                    alignment: "right",
                                    text: "药店名称"
                                },
                                editorOptions:{
                                    maxLength:50,
                                    onValueChanged:(e)=>{
                                        if(e.value){
                                            this.storeInfoForm.updateData('simpleCode',codefans_net_CC2PY($.trim(e.value)))
                                        }
                                    }
                                },
                                validationRules: [{
                                    type: 'required',
                                    message: '请输入药店名称'
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
                                validationRules: [{
                                    type: 'required',
                                    message: '请输入简码'
                                }],
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
                                validationRules: [{
                                    type: 'required',
                                    message: '请选择药店类型'
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
                                editorOptions:{
                                    maxLength:100,
                                    placeholder:'',
                                    onValueChanged:(e)=>{
                                        if(e.value){
                                            this.getPoint(e.value)
                                        }
                                    }
                                },
                                validationRules: [{
                                    type: 'required',
                                    message: '请输入地址'
                                }],
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
                                validationRules: [{
                                    type: 'required',
                                    message: '请选择药店性质'
                                }],
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
                                validationRules: [{
                                    type: 'required',
                                    message: '请选择配送方式'
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
                                dataField: "refuseReson",
                                visible:false,
                                colSpan: 4,
                                editorOptions: {
                                    readOnly:true
                                },
                                label: {
                                    alignment: "right",
                                    text: "审核不通过原因"
                                },
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
                            {
                                itemType:'empty'
                            },
                            {
                                itemType:'empty'
                            },{
                                itemType:'empty'
                            },
                            {
                                dataField: "blBizScope",
                                editorType:'dxTextArea',
                                colSpan:4,
                                label: {
                                    alignment: "right",
                                    text: "经营范围"
                                },
                                editorOptions:{
                                    height:60,
                                    maxLength:500
                                },
                                validationRules: [{
                                    type: 'required',
                                    message: '请输入经营范围'
                                }],
                            },
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
                                editorType:'dxTextArea',
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
                                itemType:'empty'
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
                                    maxLength:50
                                },
                                validationRules: [{
                                    type: 'required',
                                    message: '请输入企业名称'
                                }],
                            },
                            {
                                dataField: "gspAddr",
                                colSpan:2,
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
                                dataField: "gspScope",
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
                                dataField: "gspImg",
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
                if(this.$route.params.store_id == 0){
                    this.storeInfoFormData = this.$route.params;
                    this.storeInfoFormData.status = 1;
                    this.storeInfoForm.option("formData",this.storeInfoFormData);
                    this.uploadLogo();
                    this.addIamgeFile();
                    this.uploadFile();
                    this.uploadGSP();
                }else{
                    let params = {};
                    params.id = Number(this.$route.params.store_id);
                    this.$put(store_detail_url,params).then(res => {
                        if(res.code=='200')
                        {
                            this.storeInfoFormData = res.data;
                            this.storeInfoForm.option("formData",this.storeInfoFormData);
                            this.storeInfoForm.itemOption('baseInfo.orgCode','editorOptions',{readOnly:true});
                            if(this.storeInfoFormData.authStatus == 2){
                                this.storeInfoForm.itemOption('baseInfo.refuseReson','visible',true)
                            }
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
                }
            },
            cancle(){
                this.$router.push({
                    name:'drug-store-dictionary'
                })
            },
            submit(){
                let params = {};
                this.modal_loading = true;
                if(!this.storeInfoForm.validate().isValid) {
                    this.modal_loading = false;
                    return;
                }
                params = this.storeInfoFormData;
                if(params.authStatus == 2){
                    params.refuseReson = ''
                }
                params.authStatus = 0;
                params.orgType = 5;
                if(!params.blImg && !params.blUrl){
                    this.warn('请上传药店营业执照');
                    this.modal_loading = false;
                    return;
                }
                if(params.blImg && params.blImg.length == 0){
                    this.warn('请上传药店营业执照');
                    this.modal_loading = false;
                    return;
                }
                if(!params.dblImg && !params.dblUrl){
                    this.warn('请上传药品经营许可证');
                    this.modal_loading = false;
                    return;
                }
                if(params.dblImg && params.dblImg.length == 0){
                    this.warn('请上传药品经营许可证');
                    this.modal_loading = false;
                    return;
                }
                if(!params.gspImg && !params.gspUrl){
                    this.warn('请上传GSP证书');
                    this.modal_loading = false;
                    return;
                }
                if(params.gspImg && params.gspImg.length == 0){
                    this.warn('请上传GSP证书');
                    this.modal_loading = false;
                    return;
                }
                this.$post(store_insert_url,params).then(res => {
                    if(res.code=='200')
                    {
                        this.success('保存成功!',()=>{
                            this.modal_loading = false;
                            this.$router.push({
                                name: 'drug-store-dictionary',
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
                var area = new (Vue.component('AreaCascade'));
                area.field = data;
                area.$parent = this;
                area.$mount('#Area');
            },
            timePicker(data, itemElement){
                itemElement.append("<div id='aaa'/>");
                let picker = new Vue(TimePicker);
                picker.field = data;
                picker.$parent = this;
                picker.$mount('#aaa');
            },
            //根据药店地址获取经纬度（经度>100，纬度<90）
            //百度地图
            // getPoint(val){
            //     let map = new BMap.Map("allmap");
            //     let localSearch = new BMap.LocalSearch(map);
            //     localSearch.setSearchCompleteCallback(function (searchResult) {
            //         let poi = searchResult.getPoi(0);
            //         console.log(poi)
            //         // console.log(poi.point.lng);
            //         // console.log(poi.point.lat);
            //     })
            //     localSearch.search(val);
            // },
            //高德地图
            getPoint(val){
                let that = this;
                let map = new AMap.Map("container");
                //获取当前城市
                // AMap.service(["AMap.CitySearch"], function() {
                //     let citysearch = new AMap.CitySearch( );
                //     citysearch.getLocalCity(function(status, result) {
                //         if (status === 'complete' && result.info === 'OK') {
                //             if (result && result.city && result.bounds) {
                //                 let cityinfo = result.city;
                //                 console.log(cityinfo);
                //
                //             }
                //         } else {
                //
                //         }
                //     });
                // });
                //获取指定地址经纬度
                map.plugin(["AMap.Geocoder"], function() {
                    let MGeocoder = new AMap.Geocoder({
                        city: '', //城市，默认：“全国”
                    });
                    MGeocoder.getLocation(val, function(status, result) {
                        if (status === 'complete' && result.info === 'OK') {
                            let lng = result.geocodes[0].location.lng;   //获取经度
                            let lat = result.geocodes[0].location.lat;   //获取纬度
                            that.storeInfoFormData.longitude = lng;
                            that.storeInfoFormData.latitude = lat;
                        }else{

                        }
                    })
                })
            }
        }
    }
</script>
