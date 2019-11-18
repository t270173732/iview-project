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
                <Button type="primary" @click="agree" :loading="modal_loading" :disabled="auditBtn">审核通过</Button>
                <Button class="margin-left-5" @click="reject" :disabled="auditBtn">审核不通过</Button>
            </p>
            <Row class="margin-top-10">
                <div id="apo-info"></div>
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
    import RegPic from './regPic';
    import QcPic from './qcPic';
    import FrontPic from './idCardFront';
    import BackPic from './idCardBack';
    let apo_detail_url = '/sys/sysDruggist/read/detail';
    let apo_audit_url = '/sys/sysDruggist/authDruggist';
    export default {
        data(){
            return{
                auditBtn:true,
                apoInfoForm:{},
                apoInfoFormData:{},
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
                                dataField: "name",
                                label: {
                                    alignment: "right",
                                    text: "姓名"
                                },
                                editorOptions: {
                                    readOnly:true,
                                },
                            },
                            {
                                dataField: "simpleCode",
                                label: {
                                    alignment: "right",
                                    text: "简码"
                                },
                                editorOptions:{
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
                                    valueExpr:'id',
                                    readOnly:true
                                },
                            },
                            {
                                dataField: "idCard",
                                label: {
                                    alignment: "right",
                                    text: "身份证号"
                                },
                                editorOptions: {
                                    readOnly:true,
                                },
                            },
                            {
                                dataField: "jobOrg",
                                label: {
                                    alignment: "right",
                                    text: "执业机构"
                                },
                                editorOptions: {
                                    readOnly:true,
                                },
                            },
                            {
                                dataField: "profession",
                                label: {
                                    alignment: "right",
                                    text: "职称"
                                },
                                editorOptions: {
                                    readOnly:true,
                                },
                            },
                            {
                                dataField: "jobAddr",
                                label: {
                                    alignment: "right",
                                    text: "执业地点"
                                },
                                editorOptions: {
                                    readOnly:true,
                                },
                            },
                            {
                                dataField: "telephone",
                                label: {
                                    alignment: "right",
                                    text: "联系电话"
                                },
                                editorOptions: {
                                    readOnly:true,
                                },
                            },
                            {
                                dataField: "gradInst",
                                label: {
                                    alignment: "right",
                                    text: "毕业院校"
                                },
                                editorOptions: {
                                    readOnly:true,
                                },
                            },
                            {
                                dataField: "education",
                                label: {
                                    alignment: "right",
                                    text: "学历"
                                },
                                editorOptions: {
                                    readOnly:true,
                                },
                            },
                            {
                                dataField: "major",
                                label: {
                                    alignment: "right",
                                    text: "专业"
                                },
                                editorOptions: {
                                    readOnly:true,
                                },
                            },
                            {
                                dataField: "jobStartTime",
                                label: {
                                    alignment: "right",
                                    text: "参加工作时间"
                                },
                                editorOptions: {
                                    readOnly:true,
                                },
                            },
                            {itemType:'empty'},
                            {itemType:'empty'},
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
                                editorOptions: {
                                    readOnly:true,
                                },
                            },
                            {
                                dataField: "regNo",
                                label: {
                                    alignment: "right",
                                    text: "注册证编号"
                                },
                                editorOptions: {
                                    readOnly:true,
                                },
                            },
                            {
                                dataField: "regName",
                                label: {
                                    alignment: "right",
                                    text: "姓名"
                                },
                                editorOptions: {
                                    readOnly:true,
                                },
                            },
                            {
                                dataField: "regArea",
                                label: {
                                    alignment: "right",
                                    text: "执业地区"
                                },
                                editorOptions: {
                                    readOnly:true,
                                },
                            },
                            {
                                dataField: "regType",
                                label: {
                                    alignment: "right",
                                    text: "执业类别"
                                },
                                editorOptions: {
                                    readOnly:true,
                                },
                            },
                            {
                                dataField: "regOrgName",
                                label: {
                                    alignment: "right",
                                    text: "执业单位"
                                },
                                editorOptions: {
                                    readOnly:true,
                                },
                            },
                            {
                                dataField: "regValidTime",
                                label: {
                                    alignment: "right",
                                    text: "有效期至"
                                },
                                editorOptions: {
                                    readOnly:true,
                                },
                            },
                            {
                                dataField: "regIssueOrg",
                                label: {
                                    alignment: "right",
                                    text: "发证机关"
                                },
                                editorOptions: {
                                    readOnly:true,
                                },
                            },
                            {
                                dataField: "regIssueTime",
                                label: {
                                    alignment: "right",
                                    text: "注册日期"
                                },
                                editorOptions: {
                                    readOnly:true,
                                },
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
                                    readOnly:true
                                }
                            },
                            {
                                dataField: "regImg",
                                colSpan:4,
                                label: {
                                    alignment: "right",
                                    text: "资质上传"
                                },
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
                                editorOptions: {
                                    readOnly:true,
                                },
                            },
                            {
                                dataField: "qcName",
                                label: {
                                    alignment: "right",
                                    text: "姓名"
                                },
                                editorOptions: {
                                    readOnly:true,
                                },
                            },
                            {
                                dataField: "qcSex",
                                label: {
                                    alignment: "right",
                                    text: "性别"
                                },
                                editorOptions: {
                                    readOnly:true,
                                },
                            },
                            {
                                dataField: "qcBirthday",
                                label: {
                                    alignment: "right",
                                    text: "出生日期"
                                },
                                editorOptions: {
                                    readOnly:true,
                                },
                            },
                            {
                                dataField: "qcMajor",
                                label: {
                                    alignment: "right",
                                    text: "专业类别"
                                },
                                editorOptions: {
                                    readOnly:true,
                                },
                            },
                            {
                                dataField: "qcAuthTime",
                                label: {
                                    alignment: "right",
                                    text: "批准日期"
                                },
                                editorOptions: {
                                    readOnly:true,
                                },
                            },
                            {
                                dataField: "qcIssueOrg",
                                label: {
                                    alignment: "right",
                                    text: "签发单位"
                                },
                                editorOptions: {
                                    readOnly:true,
                                },
                            },
                            {
                                dataField: "qcIssueTime",
                                label: {
                                    alignment: "right",
                                    text: "签发日期"
                                },
                                editorOptions: {
                                    readOnly:true,
                                },
                            },
                            {
                                dataField: "qcImg",
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
                                template: (data, itemElement)=>{
                                    itemElement.append("<div id='backImg'/>");
                                }
                            },
                        ]
                    },
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

            this.apoInit();
        },
        methods:{
            apoInit(){
                let params = {};
                params.id = Number(this.$route.params.apo_id);
                this.$put(apo_detail_url,params).then(res => {
                    if(res.code=='200')
                    {
                        this.apoInfoFormData = res.data;
                        this.apoInfoForm.option("formData",this.apoInfoFormData);
                        this.auditBtn = false;
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
            },
            cancle(){
                this.$router.push({
                    name:'apothecary-audit'
                })
            },
            agree(){
                let params = {};
                this.modal_loading = true;
                params.id = this.apoInfoFormData.id;
                params.authStatus = 1;
                this.$post(apo_audit_url,params).then(res => {
                    if(res.code=='200')
                    {
                        this.success('审核成功!',()=>{
                            this.modal_loading = false;
                            this.$router.push({
                                name: 'apothecary-audit',
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
            save(){
                let params = {};
                this.modal.modal_loading = true;
                if(!this.rejectForm.validate().isValid) {
                    this.modal.modal_loading = false;
                    return;
                }
                this.rejectFormData.id = this.apoInfoFormData.id;
                this.rejectFormData.authStatus = 2;
                params = this.rejectFormData;
                this.$post(apo_audit_url, params).then(res => {
                    if (res.code == '200') {
                        this.success('驳回成功!', () => {
                            this.$router.push({
                                name: 'apothecary-audit',
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
            formCancle(){
                this.modal.visible = false;
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
