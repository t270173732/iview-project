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
                <div id="hos-info"></div>
            </Row>
        </Card>
    </div>
</template>
<script>
    import Vue from 'vue';
    import Image from '../hos-audit/image';
    import CopyImage from '../hos-audit/copyImage';
    import LogoImage from '../hos-dictionary/logoImg';
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
                                    readOnly:true
                                },
                            },
                            {
                                dataField: "hospitalCode",
                                label: {
                                    alignment: "right",
                                    text: "医疗机构代码"
                                },
                                editorOptions: {
                                    readOnly:true
                                },
                            },
                            {
                                dataField: "orgName",
                                label: {
                                    alignment: "right",
                                    text: "医疗机构名称"
                                },
                                editorOptions: {
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
                                editorOptions: {
                                    readOnly:true
                                },
                            },
                            {
                                dataField: "quaPerson",
                                label: {
                                    alignment: "right",
                                    text: "法定代表人"
                                },
                                editorOptions: {
                                    readOnly:true
                                },
                            },
                            {
                                dataField: "quaPrincipal",
                                label: {
                                    alignment: "right",
                                    text: "主要负责人"
                                },
                                editorOptions: {
                                    readOnly:true
                                },
                            },
                            {
                                dataField: "quaRegistNo",
                                label: {
                                    alignment: "right",
                                    text: "登记号"
                                },
                                editorOptions: {
                                    readOnly:true
                                },
                            },
                            {
                                dataField: "quaAddr",
                                colSpan:2,
                                label: {
                                    alignment: "right",
                                    text: "地址"
                                },
                                editorOptions: {
                                    readOnly:true
                                },
                            },
                            {
                                dataField: "quaValidTime",
                                colSpan:2,
                                label: {
                                    alignment: "right",
                                    text: "有效期限"
                                },
                                editorOptions: {
                                    readOnly:true
                                },
                            },
                            {
                                dataField: "quaLicenseOrg",
                                label: {
                                    alignment: "right",
                                    text: "发证机关"
                                },
                                editorOptions: {
                                    readOnly:true
                                },
                            },
                            {
                                dataField: "quaLicenseTime",
                                label: {
                                    alignment: "right",
                                    text: "发证时间"
                                },
                                editorOptions: {
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
                                dataField: "quaSubject",
                                colSpan: 4,
                                editorType: "dxTextArea",
                                label: {
                                    alignment: "right",
                                    text: "诊疗科目"
                                },
                                editorOptions: {
                                    readOnly:true
                                },
                            },
                            {
                                dataField: "originalImg",
                                colSpan:4,
                                label: {
                                    alignment: "right",
                                    text: "资质上传(正本)"
                                },
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
                this.$put(hos_detail_url,{}).then(res => {
                    if(res.code=='200')
                    {
                        this.hosInfoFormData = res.data;
                        this.hosInfoForm.option("formData",this.hosInfoFormData);
                        this.uploadLogo();
                        this.addIamgeFile();
                        this.copyFile();
                    }
                    else {
                        this.warn(res.msg)
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
                if(!this.hosInfoForm.validate().isValid) {
                    this.modal_loading = false;
                    return;
                }
                params = this.hosInfoFormData;
                this.$post(hos_insert_url,params).then(res => {
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
