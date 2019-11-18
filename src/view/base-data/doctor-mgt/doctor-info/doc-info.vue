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
                <div id="doc-info"></div>
            </Row>
        </Card>
    </div>
</template>
<script>
    import Vue from 'vue';
    import {codefans_net_CC2PY} from '@/libs/util.js';
    import Image from './ppcPicOneImg';
    import QcImg from './qcPicImg';
    import TcImg from './tcPicImg';
    import IDFront from './idCardFront';
    import IDBack from './idCardBack';
    let doc_detail_url = '/sys/sysDoctor/read/detail';
    let doc_insert_url = '/sys/sysDoctor/insertDoctor';
    let doc_update_url = '/sys/sysDoctor/updateDoctor';
    export default {
        data(){
            return{
                isNew:true,
                docInfoForm:{},
                docInfoFormData:{},
                modal_loading:false
            }
        },
        mounted(){
            this.docInfoForm = $("#doc-info").dxForm({
                colCount:1,
                formData:this.docInfoFormData,
                items:[
                    {
                        itemType: 'group',
                        caption: '基础信息',
                        colCount: 4,
                        name:"baseInfo",
                        items:[
                            {
                                dataField: "drCode",
                                label: {
                                    alignment: "right",
                                    text: "医师编码"
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
                                dataField: "drName",
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
                                            this.docInfoForm.updateData('simpleCode',codefans_net_CC2PY($.trim(e.value)));
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
                                }]
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
                                }]
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
                                dataField: "jobAddr",
                                label: {
                                    alignment: "right",
                                    text: "执业地点"
                                },
                                validationRules: [{
                                    type: "required",
                                    message: "请输入执业地点"
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
                            {
                                itemType:'empty',
                            },
                            {
                                itemType:'empty',
                            },
                            {
                                dataField: "unauthReson",
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
                        caption: '医师执业证书',
                        colCount: 4,
                        name:"license",
                        visible:true,
                        items:[
                            {
                                dataField: "ppcNo",
                                label: {
                                    alignment: "right",
                                    text: "编码"
                                },
                                validationRules: [{
                                    type: "required",
                                    message: "请输入编码"
                                }],
                                editorOptions:{
                                    maxLength:50
                                }
                            },
                            {
                                dataField: "ppcName",
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
                                dataField: "ppcSex",
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
                                dataField: "ppcBirthday",
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
                                dataField: "ppcJobAddr",
                                label: {
                                    alignment: "right",
                                    text: "执业地点"
                                },
                                validationRules: [{
                                    type: "required",
                                    message: "请输入执业地点"
                                }],
                                editorOptions:{
                                    maxLength:100
                                }
                            },
                            {
                                dataField: "ppcType",
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
                                dataField: "ppcIdCard",
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
                                dataField: "ppcIssueOrg",
                                label: {
                                    alignment: "right",
                                    text: "发证机关"
                                },
                                validationRules: [{
                                    type: "required",
                                    message: "请输入发证机关"
                                }],
                                editorOptions:{
                                    maxLength:20
                                }
                            },
                            {
                                dataField: "ppcIssueBy",
                                label: {
                                    alignment: "right",
                                    text: "签发人"
                                },
                                validationRules: [{
                                    type: "required",
                                    message: "请输入签发人"
                                }],
                                editorOptions:{
                                    maxLength:20
                                }
                            },
                            {
                                dataField: "ppcIssueTime",
                                label: {
                                    alignment: "right",
                                    text: "发证日期"
                                },
                                validationRules: [{
                                    type: "required",
                                    message: "请输入发证日期"
                                }],
                                editorOptions:{
                                    maxLength:20
                                }
                            },
                            {itemType:'empty'},
                            {itemType:'empty'},
                            {
                                dataField: "ppcScope",
                                colSpan:4,
                                editorType:'dxTextArea',
                                label: {
                                    alignment: "right",
                                    text: "执业范围"
                                },
                                validationRules: [{
                                    type: "required",
                                    message: "请输入执业执业范围"
                                }],
                                editorOptions:{
                                    height:60,
                                    maxLength:500
                                }
                            },
                            {
                                dataField: "ppcOneImg",
                                colSpan:4,
                                label: {
                                    alignment: "right",
                                    text: "资质上传"
                                },
                                validationRules: [{
                                    type: "required",
                                }],
                                template: (data, itemElement)=>{
                                    itemElement.append("<div id='ppcImg'/>");
                                }
                            },
                        ]
                    },
                    {
                        itemType: 'group',
                        caption: '医师资格证书',
                        colCount: 4,
                        name:"docLicense",
                        visible:true,
                        items:[
                            {
                                dataField: "qcNo",
                                label: {
                                    alignment: "right",
                                    text: "证书编码"
                                },
                                validationRules: [{
                                    type: "required",
                                    message: "请输入证书编码"
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
                                dataField: "qcIdCard",
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
                                dataField: "qcEducation",
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
                                dataField: "qcGradInst",
                                label: {
                                    alignment: "right",
                                    text: "毕业院校"
                                },
                                validationRules: [{
                                    type: "required",
                                    message: "请输入毕业院校"
                                }],
                                editorOptions:{
                                    maxLength:20
                                }
                            },
                            {
                                dataField: "qcMajor",
                                label: {
                                    alignment: "right",
                                    text: "专业"
                                },
                                validationRules: [{
                                    type: "required",
                                    message: "请输入专业"
                                }],
                                editorOptions:{
                                    maxLength:50
                                }
                            },
                            {
                                dataField: "qcType",
                                label: {
                                    alignment: "right",
                                    text: "类别"
                                },
                                validationRules: [{
                                    type: "required",
                                    message: "请输入类别"
                                }],
                                editorOptions:{
                                    maxLength:20
                                }
                            },
                            {
                                dataField: "qcIssueOrg",
                                label: {
                                    alignment: "right",
                                    text: "发证机关"
                                },
                                validationRules: [{
                                    type: "required",
                                    message: "请输入发证机关"
                                }],
                                editorOptions:{
                                    maxLength:20
                                }
                            },
                            {
                                dataField: "qcIssueBy",
                                label: {
                                    alignment: "right",
                                    text: "签发人"
                                },
                                validationRules: [{
                                    type: "required",
                                    message: "请输入签发人"
                                }],
                                editorOptions:{
                                    maxLength:20
                                }
                            },
                            {
                                dataField: "qcIssueTime",
                                label: {
                                    alignment: "right",
                                    text: "发证日期"
                                },
                                validationRules: [{
                                    type: "required",
                                    message: "请输入发证日期"
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
                        caption: '专业技术资格证书',
                        colCount: 4,
                        name:"gsp",
                        visible:true,
                        items:[
                            {
                                dataField: "tcNo",
                                label: {
                                    alignment: "right",
                                    text: "证书编码"
                                },
                                validationRules: [{
                                    type: "required",
                                    message: "请输入证书编码"
                                }],
                                editorOptions:{
                                    maxLength:50
                                }
                            },
                            {
                                dataField: "tcName",
                                label: {
                                    alignment: "right",
                                    text: "姓名"
                                },
                                validationRules: [{
                                    type: "required",
                                    message: "请输入证书编码"
                                }],
                                editorOptions:{
                                    maxLength:20
                                }
                            },
                            {
                                dataField: "tcSex",
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
                                dataField: "tcBirthday",
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
                                dataField: "tcOrgName",
                                label: {
                                    alignment: "right",
                                    text: "工作单位"
                                },
                                validationRules: [{
                                    type: "required",
                                    message: "请输入出生日期"
                                }],
                                editorOptions:{
                                    maxLength:50
                                }
                            },
                            {
                                dataField: "tcMajor",
                                label: {
                                    alignment: "right",
                                    text: "专业名称"
                                },
                                validationRules: [{
                                    type: "required",
                                    message: "请输入专业名称"
                                }],
                                editorOptions:{
                                    maxLength:50
                                }
                            },
                            {
                                dataField: "tcQuaName",
                                label: {
                                    alignment: "right",
                                    text: "资格名称"
                                },
                                validationRules: [{
                                    type: "required",
                                    message: "请输入资格名称"
                                }],
                                editorOptions:{
                                    maxLength:50
                                }
                            },
                            {
                                dataField: "tcAuthTime",
                                label: {
                                    alignment: "right",
                                    text: "评审时间"
                                },
                                validationRules: [{
                                    type: "required",
                                    message: "请输入评审时间"
                                }],
                                editorOptions:{
                                    maxLength:20
                                }
                            },
                            {
                                dataField: "tcImg",
                                colSpan:4,
                                label: {
                                    alignment: "right",
                                    text: "资质上传"
                                },
                                validationRules: [{
                                    type: "required",
                                }],
                                template: (data, itemElement)=>{
                                    itemElement.append("<div id='tcPicImg'/>");
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
                                    itemElement.append("<div id='IDFront'/>");
                                }
                            },{
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
                                    itemElement.append("<div id='IDBack'/>");
                                }
                            },
                        ]
                    }
                ]
            }).dxForm("instance");

            this.docInit();
        },
        methods:{
            docInit(){
                if(this.$route.params.doc_id == 0){
                    this.isNew = true;
                    this.docInfoFormData = {};
                    this.docInfoForm.option('formData',this.docInfoFormData);
                    this.addIamgeFile();
                    this.uploadQc();
                    this.uploadTc();
                    this.uploadIDFront();
                    this.uploadIDBack();
                }else{
                    this.isNew = false;
                    let params = {};
                    params.id = Number(this.$route.params.doc_id);
                    this.$put(doc_detail_url,params).then(res => {
                        if(res.code=='200')
                        {
                            this.docInfoFormData = res.data;
                            if(this.docInfoFormData.authStatus == 2){
                                this.docInfoForm.itemOption('baseInfo.unauthReson','visible',true);
                            }
                            this.docInfoForm.itemOption('baseInfo.drCode','editorOptions',{readOnly:true});
                            this.docInfoForm.option("formData",this.docInfoFormData);
                            this.addIamgeFile();
                            this.uploadQc();
                            this.uploadTc();
                            this.uploadIDFront();
                            this.uploadIDBack();
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
                    name:'doctor-info-router'
                })
            },
            submit(){
                let params = {},url;
                this.modal_loading = true;
                if(!this.docInfoForm.validate().isValid) {
                    this.modal_loading = false;
                    return;
                }
                if(this.docInfoFormData.authStatus == 2){
                    this.docInfoFormData.unauthReson = ''
                }
                params = this.docInfoFormData;
                params.authStatus = 0;
                if(!params.ppcOneImg && !params.ppcOneUrl){
                    this.warn('请上传执业证');
                    this.modal_loading = false;
                    return;
                }
                if(params.ppcOneImg && params.ppcOneImg.length == 0){
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
                if(!params.tcImg && !params.tcUrl){
                    this.warn('请上传专业证');
                    this.modal_loading = false;
                    return;
                }
                if(params.tcImg && params.tcImg.length == 0){
                    this.warn('请上传专业证');
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
                    url = doc_insert_url
                }else{
                    url = doc_update_url
                }
                this.$post(url,params).then(res => {
                    if(res.code=='200')
                    {
                        this.success('保存成功!',()=>{
                            this.modal_loading = false;
                            this.$router.push({
                                name: 'doctor-info-router',
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
                let datePicker = new (Vue.component('DateTimePicker'));
                datePicker.field = data;
                datePicker.$mount('#picker');
            },
            addIamgeFile() {
                let FileUpload = new Vue(Image);
                FileUpload.$parent = this;
                FileUpload.$mount('#ppcImg');
            },
            uploadQc() {
                let FileUpload = new Vue(QcImg);
                FileUpload.$parent = this;
                FileUpload.$mount('#qcPicImg');
            },
            uploadTc() {
                let FileUpload = new Vue(TcImg);
                FileUpload.$parent = this;
                FileUpload.$mount('#tcPicImg');
            },
            uploadIDFront() {
                let FileUpload = new Vue(IDFront);
                FileUpload.$parent = this;
                FileUpload.$mount('#IDFront');
            },
            uploadIDBack() {
                let FileUpload = new Vue(IDBack);
                FileUpload.$parent = this;
                FileUpload.$mount('#IDBack');
            },
        }
    }
</script>