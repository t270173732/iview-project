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
                <div id="apo-info"></div>
            </Row>
        </Card>
    </div>
</template>
<script>
    import Vue from 'vue';
    import {codefans_net_CC2PY} from '@/libs/util.js';
    import RegPic from './regPic';
    import QcPic from './qcPic';
    import FrontPic from './idCardFront';
    import BackPic from './idCardBack';
    let apo_detail_url = '/sys/sysDruggist/read/detail';
    let apo_insert_url = '/sys/sysDruggist/insertDruggist';
    let apo_update_url = '/sys/sysDruggist/updateDruggist';
    export default {
        data(){
            return{
                isNew:true,
                apoInfoForm:{},
                apoInfoFormData:{},
                modal_loading:false
            }
        },
        mounted(){
            this.apoInfoForm = $("#apo-info").dxForm({
                colCount:1,
                formData:this.apoInfoFormData,
                items:[
                    {
                        itemType: 'group',
                        caption: '基础信息',
                        colCount: 4,
                        name:"baseInfo",
                        items:[
                            {
                                dataField: "code",
                                label: {
                                    alignment: "right",
                                    text: "药师编码"
                                },
                                editorOptions: {
                                    placeholder:'<系统自动分配>',
                                    disabled:true,
                                },
                            },
                            {
                                dataField: "account",
                                label: {
                                    alignment: "right",
                                    text: "账号"
                                },
                                editorOptions:{
                                    placeholder:'请输入手机号'
                                },
                                validationRules: [{
                                    type:"required",
                                    message: "请输入手机号"
                                },{
                                    type: "pattern",
                                    pattern: "^1[3|4|5|6|7|8|9][0-9]{9}$",
                                    message: "请输入正确的手机号!"
                                }]
                            },
                            {
                                dataField: "name",
                                label: {
                                    alignment: "right",
                                    text: "姓名"
                                },
                                validationRules: [{
                                    type: "required",
                                    message: "请输入姓名"
                                }],
                                editorOptions:{
                                    maxLength:20,
                                    onValueChanged:(e)=>{
                                        if(e.value){
                                            this.apoInfoForm.updateData('simpleCode',codefans_net_CC2PY($.trim(e.value)));
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
                                dataField: "sex",
                                editorType:'dxSelectBox',
                                label: {
                                    alignment: "right",
                                    text: "性别"
                                },
                                editorOptions:{
                                    dataSource:this.enum.sex,
                                    displayExpr:'text',
                                    valueExpr:'id'
                                },
                                validationRules: [{
                                    type: "required",
                                    message: "请选择性别"
                                }],
                            },
                            {
                                dataField: "idCard",
                                label: {
                                    alignment: "right",
                                    text: "身份证号"
                                },
                                validationRules: [{
                                    type: "required",
                                    message: "请输入身份证号"
                                },{
                                    type: "pattern",
                                    pattern: "(^\\d{15}$)|(^\\d{18}$)",
                                    message: "请输入正确的身份证号!"
                                }],
                            },
                            {
                                dataField: "jobOrg",
                                label: {
                                    alignment: "right",
                                    text: "执业机构"
                                },
                                validationRules: [{
                                    type: "required",
                                    message: "请输入执业机构"
                                }],
                                editorOptions:{
                                    maxLength:100
                                }
                            },
                            {
                                dataField: "profession",
                                label: {
                                    alignment: "right",
                                    text: "职称"
                                },
                                validationRules: [{
                                    type: "required",
                                    message: "请输入职称"
                                }],
                                editorOptions:{
                                    maxLength:20
                                }
                            },
                            {
                                dataField: "jobAddr",
                                label: {
                                    alignment: "right",
                                    text: "执业地点"
                                },
                                validationRules: [{
                                    type: "required",
                                    message: "请输入职称"
                                }],
                                editorOptions:{
                                    maxLength:100
                                }
                            },
                            {
                                dataField: "telephone",
                                label: {
                                    alignment: "right",
                                    text: "联系电话"
                                },
                                editorOptions:{
                                    placeholder:'请输入手机或座机'
                                },
                                validationRules: [{
                                    type:"required",
                                    message: "请输入联系电话"
                                },{
                                    type: "pattern",
                                    pattern: "^(((0\\d{2,3}-)?\\d{7,8})|(1[3584679]\\d{9}))$",
                                    message: "请输入正确的联系电话!"
                                }]
                            },
                            {
                                dataField: "gradInst",
                                label: {
                                    alignment: "right",
                                    text: "毕业院校"
                                },
                                validationRules: [{
                                    type: "required",
                                    message: "请输入毕业院校"
                                }],
                                editorOptions:{
                                    maxLength:100
                                }
                            },
                            {
                                dataField: "education",
                                label: {
                                    alignment: "right",
                                    text: "学历"
                                },
                                validationRules: [{
                                    type: "required",
                                    message: "请输入学历"
                                }],
                                editorOptions:{
                                    maxLength:20
                                }
                            },
                            {
                                dataField: "major",
                                label: {
                                    alignment: "right",
                                    text: "专业"
                                },
                                validationRules: [{
                                    type: "required",
                                    message: "请输入专业"
                                }],
                                editorOptions:{
                                    maxLength:100
                                }
                            },
                            {
                                dataField: "jobStartTime",
                                label: {
                                    alignment: "right",
                                    text: "参加工作时间"
                                },
                                validationRules: [{
                                    type: "required",
                                    message: "请选择参加工作时间"
                                }],
                                template: this.picker
                            },
                            {itemType:'empty'},
                            {itemType:'empty'},
                            {
                                dataField: "unauthReson",
                                visible:false,
                                colSpan: 4,
                                editorOptions: {
                                    readOnly:true
                                },
                                label: {
                                    alignment: "right",
                                    text: "不通过原因"
                                },
                            },
                            {
                                dataField: "profile",
                                colSpan: 4,
                                editorType: "dxTextArea",
                                editorOptions: {
                                    height: 60,
                                    maxLength:500
                                },
                                label: {
                                    alignment: "right",
                                    text: "个人介绍"
                                },
                            },
                            {
                                dataField: "expertField",
                                colSpan: 4,
                                editorType: "dxTextArea",
                                editorOptions: {
                                    height: 60,
                                    maxLength:500
                                },
                                label: {
                                    alignment: "right",
                                    text: "擅长领域"
                                },
                            },
                            {
                                dataField: "remark",
                                colSpan: 4,
                                editorType: "dxTextArea",
                                editorOptions: {
                                    height: 60,
                                    maxLength:500
                                },
                                label: {
                                    alignment: "right",
                                    text: "备注"
                                },
                            }
                        ]
                    },
                    {
                        itemType: 'group',
                        caption: '执业药师注册证',
                        colCount: 4,
                        name:"license",
                        visible:true,
                        items:[
                            {
                                dataField: "regQuaNo",
                                label: {
                                    alignment: "right",
                                    text: "资格证书号"
                                },
                                validationRules: [{
                                    type: "required",
                                    message: "请输入资格证书号"
                                }],
                                editorOptions:{
                                    maxLength:50
                                }
                            },
                            {
                                dataField: "regNo",
                                label: {
                                    alignment: "right",
                                    text: "注册证编号"
                                },
                                validationRules: [{
                                    type: "required",
                                    message: "请输入注册证编号"
                                }],
                                editorOptions:{
                                    maxLength:50
                                }
                            },
                            {
                                dataField: "regName",
                                label: {
                                    alignment: "right",
                                    text: "姓名"
                                },
                                validationRules: [{
                                    type: "required",
                                    message: "请输入注册证编号"
                                }],
                                editorOptions:{
                                    maxLength:20
                                }
                            },
                            {
                                dataField: "regArea",
                                label: {
                                    alignment: "right",
                                    text: "执业地区"
                                },
                                validationRules: [{
                                    type: "required",
                                    message: "请输入执业地区"
                                }],
                                editorOptions:{
                                    maxLength:20
                                }
                            },
                            {
                                dataField: "regType",
                                label: {
                                    alignment: "right",
                                    text: "执业类别"
                                },
                                validationRules: [{
                                    type: "required",
                                    message: "请输入执业类别"
                                }],
                                editorOptions:{
                                    maxLength:20
                                }
                            },
                            {
                                dataField: "regOrgName",
                                label: {
                                    alignment: "right",
                                    text: "执业单位"
                                },
                                validationRules: [{
                                    type: "required",
                                    message: "请输入执业单位"
                                }],
                                editorOptions:{
                                    maxLength:50
                                }
                            },
                            {
                                dataField: "regValidTime",
                                label: {
                                    alignment: "right",
                                    text: "有效期至"
                                },
                                validationRules: [{
                                    type: "required",
                                    message: "请输入有效期至"
                                }],
                                editorOptions:{
                                    maxLength:20
                                }
                            },
                            {
                                dataField: "regIssueOrg",
                                label: {
                                    alignment: "right",
                                    text: "发证机关"
                                },
                                validationRules: [{
                                    type: "required",
                                    message: "请输入发证机关"
                                }],
                                editorOptions:{
                                    maxLength:50
                                }
                            },
                            {
                                dataField: "regIssueTime",
                                label: {
                                    alignment: "right",
                                    text: "注册日期"
                                },
                                validationRules: [{
                                    type: "required",
                                    message: "请输入注册日期"
                                }],
                                editorOptions:{
                                    maxLength:20
                                }
                            },
                            {itemType:'empty'},
                            {itemType:'empty'},
                            {itemType:'empty'},
                            {
                                dataField: "regScope",
                                editorType:'dxTextArea',
                                colSpan:4,
                                label: {
                                    alignment: "right",
                                    text: "执业范围"
                                },
                                validationRules: [{
                                    type: "required",
                                    message: "请输入执业范围"
                                }],
                                editorOptions:{
                                    height:60,
                                    maxLength:500
                                }
                            },
                            {
                                dataField: "regImg",
                                colSpan:4,
                                label: {
                                    alignment: "right",
                                    text: "资质上传"
                                },
                                validationRules: [{
                                    type: "required",
                                }],
                                template: (data, itemElement)=>{
                                    itemElement.append("<div id='regPicImg'/>");
                                }
                            },
                        ]
                    },
                    {
                        itemType: 'group',
                        caption: '执业药师资格证书',
                        colCount: 4,
                        name:"apoLicense",
                        visible:true,
                        items:[
                            {
                                dataField: "qcNo",
                                label: {
                                    alignment: "right",
                                    text: "管理号"
                                },
                                validationRules: [{
                                    type: "required",
                                    message: "请输入管理号"
                                }],
                                editorOptions:{
                                    maxLength:50
                                }
                            },
                            {
                                dataField: "qcName",
                                label: {
                                    alignment: "right",
                                    text: "姓名"
                                },
                                validationRules: [{
                                    type: "required",
                                    message: "请输入姓名"
                                }],
                                editorOptions:{
                                    maxLength:20
                                }
                            },
                            {
                                dataField: "qcSex",
                                label: {
                                    alignment: "right",
                                    text: "性别"
                                },
                                validationRules: [{
                                    type: "required",
                                    message: "请输入性别"
                                }],
                                editorOptions:{
                                    maxLength:20
                                }
                            },
                            {
                                dataField: "qcBirthday",
                                label: {
                                    alignment: "right",
                                    text: "出生日期"
                                },
                                validationRules: [{
                                    type: "required",
                                    message: "请输入出生日期"
                                }],
                                editorOptions:{
                                    maxLength:20
                                }
                            },
                            {
                                dataField: "qcMajor",
                                label: {
                                    alignment: "right",
                                    text: "专业类别"
                                },
                                validationRules: [{
                                    type: "required",
                                    message: "请输入专业类别"
                                }],
                                editorOptions:{
                                    maxLength:20
                                }
                            },
                            {
                                dataField: "qcAuthTime",
                                label: {
                                    alignment: "right",
                                    text: "批准日期"
                                },
                                validationRules: [{
                                    type: "required",
                                    message: "请输入批准日期"
                                }],
                                editorOptions:{
                                    maxLength:20
                                }
                            },
                            {
                                dataField: "qcIssueOrg",
                                label: {
                                    alignment: "right",
                                    text: "签发单位"
                                },
                                validationRules: [{
                                    type: "required",
                                    message: "请输入签发单位"
                                }],
                                editorOptions:{
                                    maxLength:50
                                }
                            },
                            {
                                dataField: "qcIssueTime",
                                label: {
                                    alignment: "right",
                                    text: "签发日期"
                                },
                                validationRules: [{
                                    type: "required",
                                    message: "请输入签发日期"
                                }],
                                editorOptions:{
                                    maxLength:20
                                }
                            },
                            {
                                dataField: "qcImg",
                                colSpan:4,
                                label: {
                                    alignment: "right",
                                    text: "资质上传"
                                },
                                validationRules: [{
                                    type: "required",
                                }],
                                template: (data, itemElement)=>{
                                    itemElement.append("<div id='qcPicImg'/>");
                                }
                            },
                        ]
                    },
                    {
                        itemType: 'group',
                        caption: '身份证',
                        colCount: 4,
                        name:"ID",
                        visible:true,
                        items:[
                            {
                                dataField: "idCardFrontImg",
                                colSpan:4,
                                label: {
                                    alignment: "right",
                                    text: "身份证正面"
                                },
                                validationRules: [{
                                    type: "required",
                                }],
                                template: (data, itemElement)=>{
                                    itemElement.append("<div id='frontImg'/>");
                                }
                            },
                            {
                                dataField: "idCardBackImg",
                                colSpan:4,
                                label: {
                                    alignment: "right",
                                    text: "身份证反面"
                                },
                                validationRules: [{
                                    type: "required",
                                }],
                                template: (data, itemElement)=>{
                                    itemElement.append("<div id='backImg'/>");
                                }
                            },
                        ]
                    },
                ]
            }).dxForm("instance");

            this.apoInit();
        },
        methods:{
            apoInit(){
                if(this.$route.params.apo_id == 0){
                    this.isNew = true;
                    this.apoInfoFormData = {};
                    this.apoInfoForm.option('formData',this.apoInfoFormData);
                    this.addRegPicImg();
                    this.addQcPicImg();
                    this.addFrontImg();
                    this.addBackImg();
                }else{
                    this.isNew = false;
                    let params = {};
                    params.id = Number(this.$route.params.apo_id);
                    this.$put(apo_detail_url,params).then(res => {
                        if(res.code=='200')
                        {
                            this.apoInfoFormData = res.data;
                            this.apoInfoForm.itemOption('baseInfo.code','editorOptions',{readOnly:true});
                            if(this.apoInfoFormData.authStatus == 2){
                                this.apoInfoForm.itemOption('baseInfo.unauthReson','visible',true);
                            }
                            this.apoInfoForm.option("formData",this.apoInfoFormData);
                            this.addRegPicImg();
                            this.addQcPicImg();
                            this.addFrontImg();
                            this.addBackImg();
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
                    name:'apothecary-info-dic'
                })
            },
            submit(){
                let params = {},url;
                this.modal_loading = true;
                if(!this.apoInfoForm.validate().isValid) {
                    this.modal_loading = false;
                    return;
                }
                if(this.apoInfoFormData.authStatus == 2){
                    this.apoInfoFormData.unauthReson = ''
                }
                params = this.apoInfoFormData;
                params.authStatus = 0;
                if(!params.regImg && !params.regUrl){
                    this.warn('请上传执业证');
                    this.modal_loading = false;
                    return;
                }
                if(params.regImg && params.regImg.length == 0){
                    this.warn('请上传执业证');
                    this.modal_loading = false;
                    return;
                }
                if(!params.qcImg && !params.qcUrl){
                    this.warn('请上传资格证');
                    this.modal_loading = false;
                    return;
                }
                if(params.qcImg && params.qcImg.length == 0){
                    this.warn('请上传资格证');
                    this.modal_loading = false;
                    return;
                }
                if(!params.idCardFrontImg && !params.idCardFrontUrl){
                    this.warn('请上传身份证正面');
                    this.modal_loading = false;
                    return;
                }
                if(params.idCardFrontImg && params.idCardFrontImg.length == 0){
                    this.warn('请上传身份证正面');
                    this.modal_loading = false;
                    return;
                }
                if(!params.idCardBackImg && !params.idCardBackUrl){
                    this.warn('请上传身份证反面');
                    this.modal_loading = false;
                    return;
                }
                if(params.idCardBackImg && params.idCardBackImg.length == 0){
                    this.warn('请上传身份证反面');
                    this.modal_loading = false;
                    return;
                }
                if(this.isNew){
                    url = apo_insert_url
                }else{
                    url = apo_update_url
                }
                this.$post(url,params).then(res => {
                    if(res.code=='200')
                    {
                        this.success('保存成功!',()=>{
                            this.modal_loading = false;
                            this.$router.push({
                                name: 'apothecary-info-dic',
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
            picker: function (data, itemElement) {
                itemElement.append("<div id='picker'/>");
                var datePicker = new (Vue.component('DateTimePicker'));
                datePicker.field = data;
                datePicker.$mount('#picker');
            },
            addRegPicImg() {
                let FileUpload = new Vue(RegPic);
                FileUpload.$parent = this;
                FileUpload.$mount('#regPicImg');
            },
            addQcPicImg() {
                let FileUpload = new Vue(QcPic);
                FileUpload.$parent = this;
                FileUpload.$mount('#qcPicImg');
            },
            addFrontImg() {
                let FileUpload = new Vue(FrontPic);
                FileUpload.$parent = this;
                FileUpload.$mount('#frontImg');
            },
            addBackImg() {
                let FileUpload = new Vue(BackPic);
                FileUpload.$parent = this;
                FileUpload.$mount('#backImg');
            },
        }
    }
</script>