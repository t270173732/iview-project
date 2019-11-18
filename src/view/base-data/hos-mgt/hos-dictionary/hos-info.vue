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
                <div id="hos-info"></div>
            </Row>
        </Card>
    </div>
</template>
<script>
    import Vue from 'vue';
    import {codefans_net_CC2PY} from '@/libs/util.js';
    import Image from './image';
    import CopyImage from './copyImage';
    import LogoImage from './logoImg';
    let hos_detail_url = '/biz/bdOrgHospital/read/detail';
    let hos_insert_url = '/biz/bdOrgHospital/updateHospital';
    export default {
        data(){
            return{
                hosInfoForm:{},
                hosInfoFormData:{},
                modal_loading:false
            }
        },
        mounted(){
            this.hosInfoForm = $("#hos-info").dxForm({
                colCount:1,
                formData:this.hosInfoFormData,
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
                                    text: "医疗机构编码"
                                },
                                editorOptions: {
                                    placeholder:'<系统自动分配>',
                                    disabled:true,
                                },
                            },
                            {
                                dataField: "hospitalCode",
                                label: {
                                    alignment: "right",
                                    text: "医疗机构代码"
                                },
                                validationRules: [{
                                    type: 'required',
                                    message: '请输入医疗机构代码'
                                }],
                                editorOptions:{
                                    maxLength:20
                                }
                            },
                            {
                                dataField: "orgName",
                                label: {
                                    alignment: "right",
                                    text: "医疗机构名称"
                                },
                                validationRules: [{
                                    type: 'required',
                                    message: '请输入医疗机构名称'
                                }],
                                editorOptions:{
                                    maxLength:50,
                                    onValueChanged:(e)=>{
                                        if(e.value){
                                            this.hosInfoForm.updateData('simpleCode',codefans_net_CC2PY($.trim(e.value)))
                                        }
                                    }
                                }
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
                                }
                            },
                            {
                                dataField: "contacts",
                                label: {
                                    alignment: "right",
                                    text: "联系人"
                                },
                                validationRules: [{
                                    type: 'required',
                                    message: '请输入联系人'
                                }],
                                editorOptions:{
                                    maxLength:20
                                }
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
                                validationRules: [{
                                    type: 'required',
                                    message: '请输入地址'
                                }],
                                editorOptions:{
                                    maxLength:100
                                }
                            },
                            {
                                dataField: "level",
                                editorType:'dxSelectBox',
                                label: {
                                    alignment: "right",
                                    text: "医疗机构等级"
                                },
                                editorOptions:{
                                    dataSource:this.enum.hosGrade,
                                    displayExpr:'text',
                                    valueExpr:'id'
                                },
                                validationRules: [{
                                    type: 'required',
                                    message: '请选择医疗机构等级'
                                }],
                            },
                            {
                                dataField: "transType",
                                editorType:'dxSelectBox',
                                label: {
                                    alignment: "right",
                                    text: "转出方式"
                                },
                                editorOptions:{
                                    dataSource:this.enum.transType,
                                    displayExpr:'text',
                                    valueExpr:'id'
                                },
                                validationRules: [{
                                    type: 'required',
                                    message: '请选择转出方式'
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
                                }
                            },
                            {
                                dataField: "account",
                                label: {
                                    alignment: "right",
                                    text: "账号"
                                },
                                editorOptions:{
                                    maxLength:50
                                }
                            },
                            {
                                dataField: "nature",
                                editorType:'dxSelectBox',
                                label: {
                                    alignment: "right",
                                    text: "医疗机构性质"
                                },
                                editorOptions:{
                                    dataSource:this.enum.nature,
                                    displayExpr:'text',
                                    valueExpr:'id'
                                },
                                validationRules: [{
                                    type: 'required',
                                    message: '请选择医疗机构性质'
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
                        caption: '医疗机构执业许可证',
                        colCount: 4,
                        name:"otherInfo",
                        visible:true,
                        items:[
                            {
                                dataField: "quaOrgName",
                                label: {
                                    alignment: "right",
                                    text: "机构名称"
                                },
                                validationRules: [{
                                    type: 'required',
                                    message: '请输入机构名称'
                                }],
                                editorOptions:{
                                    maxLength:50
                                }
                            },
                            {
                                dataField: "quaPerson",
                                label: {
                                    alignment: "right",
                                    text: "法定代表人"
                                },
                                validationRules: [{
                                    type: 'required',
                                    message: '请输入法定代表人'
                                }],
                                editorOptions:{
                                    maxLength:50
                                }
                            },
                            {
                                dataField: "quaPrincipal",
                                label: {
                                    alignment: "right",
                                    text: "主要负责人"
                                },
                                validationRules: [{
                                    type: 'required',
                                    message: '请输入主要负责人'
                                }],
                                editorOptions:{
                                    maxLength:50
                                }
                            },
                            {
                                dataField: "quaRegistNo",
                                label: {
                                    alignment: "right",
                                    text: "登记号"
                                },
                                validationRules: [{
                                    type: 'required',
                                    message: '请输入登记号'
                                }],
                                editorOptions:{
                                    maxLength:50
                                }
                            },
                            {
                                dataField: "quaAddr",
                                colSpan:2,
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
                                }
                            },
                            {
                                dataField: "quaValidTime",
                                colSpan:2,
                                label: {
                                    alignment: "right",
                                    text: "有效期限"
                                },
                                validationRules: [{
                                    type: 'required',
                                    message: '请输入有效期限'
                                }],
                                editorOptions:{
                                    maxLength:50
                                }
                            },
                            {
                                dataField: "quaLicenseOrg",
                                label: {
                                    alignment: "right",
                                    text: "发证机关"
                                },
                                validationRules: [{
                                    type: 'required',
                                    message: '请输入发证机关'
                                }],
                                editorOptions:{
                                    maxLength:50
                                }
                            },
                            {
                                dataField: "quaLicenseTime",
                                label: {
                                    alignment: "right",
                                    text: "发证时间"
                                },
                                validationRules: [{
                                    type: 'required',
                                    message: '请选择发证时间'
                                }],
                                editorOptions:{
                                    maxLength:50
                                }
                            },
                            {
                                itemType:'empty'
                            },
                            {
                                itemType:'empty'
                            },
                            {
                                dataField: "quaSubject",
                                colSpan: 4,
                                editorType: "dxTextArea",
                                label: {
                                    alignment: "right",
                                    text: "诊疗科目"
                                },
                                editorOptions: {
                                    height: 80,
                                    maxLength:500
                                },
                                validationRules: [{
                                    type: 'required',
                                    message: '请输入诊疗科目'
                                }],
                            },
                            {
                                dataField: "originalImg",
                                colSpan:4,
                                label: {
                                    alignment: "right",
                                    text: "资质上传(正本)"
                                },
                                validationRules: [{
                                    type: 'required',
                                    message: '请上传资质'
                                }],
                                template: (data, itemElement)=>{
                                    itemElement.append("<div id='addImage'/>");
                                }
                            },
                            {
                                dataField: "copyImg",
                                colSpan:4,
                                label: {
                                    alignment: "right",
                                    text: "资质上传(副本)"
                                },
                                validationRules: [{
                                    type: 'required',
                                    message: '请上传资质'
                                }],
                                template: (data, itemElement)=>{
                                    itemElement.append("<div id='copy'/>");
                                }
                            },
                        ]
                    }
                ]
            }).dxForm("instance");

            this.hosInit();
        },
        methods:{
            hosInit(){
                if(this.$route.params.hos_id == 0){
                    this.hosInfoFormData = {};
                    this.hosInfoFormData.status = 1;
                    this.hosInfoForm.option("formData",this.hosInfoFormData);
                    this.uploadLogo();
                    this.addIamgeFile();
                    this.copyFile();
                }else{
                    let params = {};
                    params.id = Number(this.$route.params.hos_id);
                    this.$put(hos_detail_url,params).then(res => {
                        if(res.code=='200')
                        {
                            this.hosInfoFormData = res.data;
                            this.hosInfoForm.itemOption('baseInfo.orgCode','editorOptions',{readOnly:true});
                            this.hosInfoForm.option("formData",this.hosInfoFormData);
                            this.uploadLogo();
                            this.addIamgeFile();
                            this.copyFile();
                        }
                        else {

                        }
                    }).catch(err=>
                    {
                        this.err(err)
                        // console.log(err)
                    });
                }
            },
            cancle(){
                this.$router.push({
                    name:'hos-dictionary'
                })
            },
            submit(){
                let params = {};
                this.modal_loading = true;
                if(!this.hosInfoForm.validate().isValid) {
                    this.modal_loading = false;
                    return;
                }
                params = this.hosInfoFormData;
                params.orgType = 2;
                if(!params.originalImg && !params.originalUrl){
                    this.warn('请上传资质正本');
                    this.modal_loading = false;
                    return;
                }
                if(params.originalImg && params.originalImg.length == 0){
                    this.warn('请上传资质正本');
                    this.modal_loading = false;
                    return;
                }
                if(!params.copyImg && !params.copyUrl){
                    this.warn('请上传资质副本');
                    this.modal_loading = false;
                    return;
                }
                if(params.copyImg && params.copyImg.length == 0){
                    this.warn('请上传资质副本');
                    this.modal_loading = false;
                    return;
                }
                this.$post(hos_insert_url,params).then(res => {
                    if(res.code=='200')
                    {
                        this.success('保存成功!',()=>{
                            this.modal_loading = false;
                            this.$router.push({
                                name: 'hos-dictionary',
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
            addIamgeFile: function () {
                let FileUpload = new Vue(Image);
                FileUpload.$parent = this;
                FileUpload.$mount('#addImage');
            },
            copyFile: function () {
                let FileUpload = new Vue(CopyImage);
                FileUpload.$parent = this;
                FileUpload.$mount('#copy');
            },
            uploadLogo: function () {
                let FileUpload = new Vue(LogoImage);
                FileUpload.$parent = this;
                FileUpload.$mount('#addLogo');
            },
        }
    }
</script>
