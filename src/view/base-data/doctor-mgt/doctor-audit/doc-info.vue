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
                <Button type="primary" @click="agree" :loading="modal_loading">审核通过</Button>
                <Button class="margin-left-5" @click="reject">审核不通过</Button>
            </p>
            <Row class="margin-top-10">
                <div id="doc-info"></div>
            </Row>
        </Card>
        <Modal v-model="modal.visible" :mask-closable="false" width="650" title="编辑数据">
            <p slot="header">
                <span>审核不通过原因</span>
            </p>
            <div id="rejectForm"></div>
            <div slot="footer">
                <Button type="text" @click="formCancle">取消</Button>
                <Button type="primary" :loading="modal.modal_loading" @click="save">保存</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    import Vue from 'vue';
    import Image from './ppcPicOneImg';
    import QcImg from './qcPicImg';
    import TcImg from './tcPicImg';
    import IDFront from './idCardFront';
    import IDBack from './idCardBack';
    let doc_detail_url = '/sys/sysDoctor/read/detail';
    let doc_status_url = '/sys/sysDoctor/authDoctor';
    export default {
        data(){
            return{
                docInfoForm:{},
                docInfoFormData:{},
                modal_loading:false,
                rejectForm:{},
                rejectFormData:{},
                modal:{
                    visible:false,
                    modal_loading:false
                },
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
                                    readOnly:true,
                                },
                            },
                            {
                                dataField: "account",
                                label: {
                                    alignment: "right",
                                    text: "账号"
                                },
                                editorOptions:{
                                    readOnly:true
                                },
                            },
                            {
                                dataField: "drName",
                                label: {
                                    alignment: "right",
                                    text: "姓名"
                                },
                                editorOptions:{
                                    readOnly:true,
                                }
                            },
                            {
                                dataField: "simpleCode",
                                label: {
                                    alignment: "right",
                                    text: "简码"
                                },
                                editorOptions:{
                                    readOnly:true,
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
                                    valueExpr:'id',
                                    readOnly:true,
                                },
                            },
                            {
                                dataField: "idCard",
                                label: {
                                    alignment: "right",
                                    text: "身份证号"
                                },
                                editorOptions:{
                                    readOnly:true,
                                },
                            },
                            {
                                dataField: "jobOrg",
                                label: {
                                    alignment: "right",
                                    text: "执业机构"
                                },
                                editorOptions:{
                                    readOnly:true,
                                }
                            },
                            {
                                dataField: "jobAddr",
                                label: {
                                    alignment: "right",
                                    text: "执业地点"
                                },
                                editorOptions:{
                                    readOnly:true,
                                }
                            },
                            {
                                dataField: "major",
                                label: {
                                    alignment: "right",
                                    text: "专业"
                                },
                                editorOptions:{
                                    readOnly:true,
                                }
                            },
                            {
                                dataField: "profession",
                                label: {
                                    alignment: "right",
                                    text: "职称"
                                },
                                editorOptions:{
                                    readOnly:true,
                                }
                            },
                            {
                                dataField: "gradInst",
                                label: {
                                    alignment: "right",
                                    text: "毕业院校"
                                },
                                editorOptions:{
                                    readOnly:true,
                                }
                            },
                            {
                                dataField: "education",
                                label: {
                                    alignment: "right",
                                    text: "学历"
                                },
                                editorOptions:{
                                    readOnly:true,
                                }
                            },
                            {
                                dataField: "telephone",
                                label: {
                                    alignment: "right",
                                    text: "联系电话"
                                },
                                editorOptions:{
                                    readOnly:true,
                                }
                            },
                            {
                                dataField: "jobStartTime",
                                label: {
                                    alignment: "right",
                                    text: "参加工作时间"
                                },
                                editorOptions:{
                                    readOnly:true,
                                }
                            },
                            {
                                itemType:'empty',
                            },
                            {
                                itemType:'empty',
                            },
                            {
                                dataField: "profile",
                                colSpan: 4,
                                editorType: "dxTextArea",
                                editorOptions: {
                                    height: 60,
                                    readOnly:true
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
                                    readOnly:true
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
                                    readOnly:true
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
                                    readOnly:true
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
                                    readOnly:true
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
                                    readOnly:true
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
                                    readOnly:true
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
                                    readOnly:true
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
                                    readOnly:true
                                }
                            },
                            {
                                dataField: "ppcIdCard",
                                label: {
                                    alignment: "right",
                                    text: "身份证号"
                                },
                                editorOptions:{
                                    readOnly:true
                                }
                            },
                            {
                                dataField: "ppcIssueOrg",
                                label: {
                                    alignment: "right",
                                    text: "发证机关"
                                },
                                editorOptions:{
                                    readOnly:true
                                }
                            },
                            {
                                dataField: "ppcIssueBy",
                                label: {
                                    alignment: "right",
                                    text: "签发人"
                                },
                                editorOptions:{
                                    readOnly:true
                                }
                            },
                            {
                                dataField: "ppcIssueTime",
                                label: {
                                    alignment: "right",
                                    text: "发证日期"
                                },
                                editorOptions:{
                                    readOnly:true
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
                                editorOptions:{
                                    height:60,
                                    readOnly:true
                                }
                            },
                            {
                                dataField: "ppcPicOneImg",
                                colSpan:4,
                                label: {
                                    alignment: "right",
                                    text: "资质上传"
                                },
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
                                editorOptions:{
                                    readOnly:true
                                }
                            },
                            {
                                dataField: "qcName",
                                label: {
                                    alignment: "right",
                                    text: "姓名"
                                },
                                editorOptions:{
                                    readOnly:true
                                }
                            },
                            {
                                dataField: "qcSex",
                                label: {
                                    alignment: "right",
                                    text: "性别"
                                },
                                editorOptions:{
                                    readOnly:true
                                }
                            },
                            {
                                dataField: "qcBirthday",
                                label: {
                                    alignment: "right",
                                    text: "出生日期"
                                },
                                editorOptions:{
                                    readOnly:true
                                }
                            },
                            {
                                dataField: "qcIdCard",
                                label: {
                                    alignment: "right",
                                    text: "身份证号"
                                },
                                editorOptions:{
                                    readOnly:true
                                }
                            },
                            {
                                dataField: "qcEducation",
                                label: {
                                    alignment: "right",
                                    text: "学历"
                                },
                                editorOptions:{
                                    readOnly:true
                                }
                            },
                            {
                                dataField: "qcGradInst",
                                label: {
                                    alignment: "right",
                                    text: "毕业院校"
                                },
                                editorOptions:{
                                    readOnly:true
                                }
                            },
                            {
                                dataField: "qcMajor",
                                label: {
                                    alignment: "right",
                                    text: "专业"
                                },
                                editorOptions:{
                                    readOnly:true
                                }
                            },
                            {
                                dataField: "qcType",
                                label: {
                                    alignment: "right",
                                    text: "类别"
                                },
                                editorOptions:{
                                    readOnly:true
                                }
                            },
                            {
                                dataField: "qcIssueOrg",
                                label: {
                                    alignment: "right",
                                    text: "发证机关"
                                },
                                editorOptions:{
                                    readOnly:true
                                }
                            },
                            {
                                dataField: "qcIssueBy",
                                label: {
                                    alignment: "right",
                                    text: "签发人"
                                },
                                editorOptions:{
                                    readOnly:true
                                }
                            },
                            {
                                dataField: "qcIssueTime",
                                label: {
                                    alignment: "right",
                                    text: "发证日期"
                                },
                                editorOptions:{
                                    readOnly:true
                                }
                            },
                            {
                                dataField: "qcPicImg",
                                colSpan:4,
                                label: {
                                    alignment: "right",
                                    text: "资质上传"
                                },
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
                                editorOptions:{
                                    readOnly:true
                                }
                            },
                            {
                                dataField: "tcName",
                                label: {
                                    alignment: "right",
                                    text: "姓名"
                                },
                                editorOptions:{
                                    readOnly:true
                                }
                            },
                            {
                                dataField: "tcSex",
                                label: {
                                    alignment: "right",
                                    text: "性别"
                                },
                                editorOptions:{
                                    readOnly:true
                                }
                            },
                            {
                                dataField: "tcBirthday",
                                label: {
                                    alignment: "right",
                                    text: "出生日期"
                                },
                                editorOptions:{
                                    readOnly:true
                                }
                            },
                            {
                                dataField: "tcOrgName",
                                label: {
                                    alignment: "right",
                                    text: "工作单位"
                                },
                                editorOptions:{
                                    readOnly:true
                                }
                            },
                            {
                                dataField: "tcMajor",
                                label: {
                                    alignment: "right",
                                    text: "专业名称"
                                },
                                editorOptions:{
                                    readOnly:true
                                }
                            },
                            {
                                dataField: "tcQuaName",
                                label: {
                                    alignment: "right",
                                    text: "资格名称"
                                },
                                editorOptions:{
                                    readOnly:true
                                }
                            },
                            {
                                dataField: "tcAuthTime",
                                label: {
                                    alignment: "right",
                                    text: "评审时间"
                                },
                                editorOptions:{
                                    readOnly:true
                                }
                            },
                            {
                                dataField: "tcPicImg",
                                colSpan:4,
                                label: {
                                    alignment: "right",
                                    text: "资质上传"
                                },
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
                                template: (data, itemElement)=>{
                                    itemElement.append("<div id='IDBack'/>");
                                }
                            },
                        ]
                    }
                ]
            }).dxForm("instance");

            this.rejectForm = $('#rejectForm').dxForm({
                formData: this.rejectFormData,
                items: [
                    {
                        dataField: 'unauthReson',
                        editorType:'dxTextArea',
                        label: {
                            alignment: 'right',
                            text: '审核不通过原因'
                        },
                        editorOptions:{
                            maxLength:100,
                            height:60
                        },
                        validationRules: [{
                            type:"required",
                            message: "请输入审核不通过原因"
                        }]
                    },
                ]
            }).dxForm('instance');

            this.docInit();
        },
        methods:{
            docInit(){
                let params = {};
                params.id = this.$route.params.doc_id;
                this.$put(doc_detail_url,params).then(res => {
                    if(res.code=='200')
                    {
                        this.docInfoFormData = res.data;
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
            },
            cancle(){
                this.$router.push({
                    name:'hos-dictionary'
                })
            },
            agree(){
                let params = {},url;
                this.modal_loading = true;
                params = this.docInfoFormData;
                params.authStatus = 1;
                this.$post(doc_status_url,params).then(res => {
                    if(res.code=='200')
                    {
                        this.success('审核成功!',()=>{
                            this.modal_loading = false;
                            this.$router.push({
                                name: 'doctor-audit-router',
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
            reject(){
                this.rejectFormData = {};
                this.rejectForm.option('formData',this.rejectFormData);
                this.modal.visible = true;
            },
            formCancle(){
                this.modal.visible = false;
            },
            save(){
                let params = {};
                this.modal.modal_loading = true;
                if(!this.rejectForm.validate().isValid) {
                    this.modal.modal_loading = false;
                    return;
                }
                this.rejectFormData.id = this.docInfoFormData.id;
                this.rejectFormData.authStatus = 2;
                params = this.rejectFormData;
                this.$post(doc_status_url, params).then(res => {
                    if (res.code == '200') {
                        this.success('驳回成功!', () => {
                            this.$router.push({
                                name: 'doctor-audit-router',
                            });
                        });
                    }
                    else {
                        //提示信息
                        this.warn(res.msg);
                    }
                }).catch(err => {
                    this.error(err);
                });
            },
            picker: function (data, itemElement) {
                itemElement.append("<div id='picker'/>");
                var datePicker = new (Vue.component('DateTimePicker'));
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