<style lang="less">
    @import "../../../../styles/common.less";
</style>
<template>
    <div>
        <Card dis-hover>
            <div slot="title" class="cardHead">
                <a href="#" @click.prevent="cancle">
                    <Icon type="ios-arrow-back"/>
                    返回
                </a>
            </div>
            <p slot="extra">
                <Button type="primary" @click="submit('y')" :loading="modal_loading">审核通过</Button>
                <Button class="margin-left-5" @click="submit('n')">审核不通过</Button>
            </p>
            <Row class="margin-top-10">
                <div id="hos-info"></div>
            </Row>
        </Card>
    </div>
</template>
<script>
    import Vue from 'vue';
    import Image from './image';
    import CopyImage from './copyImage';
    import LogoImage from './logoImg';

    let hos_detail_Url = '/biz/bdOrgHospital/read/detail';
    export default {
        data() {
            return {
                hosInfoForm: {},
                hosInfoFormData: {},
                modal_loading: false
            }
        },
        mounted() {
            this.hosInfoForm = $("#hos-info").dxForm({
                colCount: 1,
                formData: this.hosInfoFormData,
                items: [
                    {
                        itemType: 'group',
                        caption: '基础信息',
                        colCount: 4,
                        name: "baseInfo",
                        items: [
                            {
                                dataField: "orgCode",
                                label: {
                                    alignment: "right",
                                    text: "医疗机构编码"
                                },
                                editorOptions: {
                                    readOnly: true,
                                },
                            },
                            {
                                dataField: "hospitalCode",
                                label: {
                                    alignment: "right",
                                    text: "医疗机构代码"
                                },
                                editorOptions: {
                                    readOnly: true,
                                },
                            },
                            {
                                dataField: "orgName",
                                label: {
                                    alignment: "right",
                                    text: "医疗机构名称"
                                },
                                editorOptions: {
                                    readOnly: true,
                                },
                            },
                            {
                                dataField: "simpleCode",
                                label: {
                                    alignment: "right",
                                    text: "简码"
                                },
                                editorOptions: {
                                    readOnly: true,
                                },
                            },
                            {
                                dataField: "contacts",
                                label: {
                                    alignment: "right",
                                    text: "联系人"
                                },
                                editorOptions: {
                                    readOnly: true,
                                },
                            },
                            {
                                dataField: "telephone",
                                label: {
                                    alignment: "right",
                                    text: "联系电话"
                                },
                                editorOptions: {
                                    readOnly: true,
                                },
                            },
                            {
                                dataField: "address",
                                label: {
                                    alignment: "right",
                                    text: "地址"
                                },
                                editorOptions: {
                                    readOnly: true,
                                },
                            },
                            {
                                dataField: "level",
                                editorType: 'dxSelectBox',
                                label: {
                                    alignment: "right",
                                    text: "医疗机构等级"
                                },
                                editorOptions: {
                                    dataSource: this.enum.hosGrade,
                                    displayExpr: 'text',
                                    valueExpr: 'id',
                                    readOnly:true
                                },
                            },
                            {
                                dataField: "transType",
                                editorType: 'dxSelectBox',
                                label: {
                                    alignment: "right",
                                    text: "转出方式"
                                },
                                editorOptions: {
                                    dataSource: this.enum.transType,
                                    displayExpr: 'text',
                                    valueExpr: 'id',
                                    readOnly:true
                                },
                            },
                            {
                                dataField: "bank",
                                label: {
                                    alignment: "right",
                                    text: "开户银行"
                                },
                                editorOptions: {
                                    readOnly: true,
                                },
                            },
                            {
                                dataField: "account",
                                label: {
                                    alignment: "right",
                                    text: "账号"
                                },
                                editorOptions: {
                                    readOnly: true,
                                },
                            },
                            {
                                dataField: "nature",
                                editorType: 'dxSelectBox',
                                label: {
                                    alignment: "right",
                                    text: "医疗机构性质"
                                },
                                editorOptions: {
                                    dataSource: this.enum.nature,
                                    displayExpr: 'text',
                                    valueExpr: 'id',
                                    readOnly:true
                                },
                            },
                            {
                                dataField: "status",
                                editorType: "dxSelectBox",
                                editorOptions: {
                                    dataSource: this.enum.status,
                                    displayExpr: "text",
                                    valueExpr: "id",
                                    readOnly:true
                                },
                                label: {
                                    alignment: "right",
                                    text: "状态"
                                },
                            },
                            {
                                itemType: 'empty',
                            }, {
                                itemType: 'empty',
                            }, {
                                itemType: 'empty',
                            },
                            {
                                dataField: "remark",
                                colSpan: 4,
                                editorType: "dxTextArea",
                                editorOptions: {
                                    height: 80,
                                    maxLength: 500
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
                        caption: '资质信息',
                        colCount: 4,
                        name: "otherInfo",
                        visible: true,
                        items: [
                            {
                                dataField: "quaOrgName",
                                label: {
                                    alignment: "right",
                                    text: "机构名称"
                                },
                                editorOptions: {
                                    readOnly: true,
                                },
                            },
                            {
                                dataField: "quaPerson",
                                label: {
                                    alignment: "right",
                                    text: "法定代表人"
                                },
                                editorOptions: {
                                    readOnly: true,
                                },
                            },
                            {
                                dataField: "quaPrincipal",
                                label: {
                                    alignment: "right",
                                    text: "主要负责人"
                                },
                                editorOptions: {
                                    readOnly: true,
                                },
                            },
                            {
                                dataField: "quaRegistNo",
                                label: {
                                    alignment: "right",
                                    text: "登记号"
                                },
                                editorOptions: {
                                    readOnly: true,
                                },
                            },
                            {
                                dataField: "quaAddr",
                                colSpan: 2,
                                label: {
                                    alignment: "right",
                                    text: "地址"
                                },
                                editorOptions: {
                                    readOnly: true,
                                },
                            },
                            {
                                dataField: "quaValidTime",
                                colSpan: 2,
                                label: {
                                    alignment: "right",
                                    text: "有效期限"
                                },
                                editorOptions: {
                                    readOnly: true,
                                },
                            },
                            {
                                dataField: "quaLicenseOrg",
                                label: {
                                    alignment: "right",
                                    text: "发证机关"
                                },
                                editorOptions: {
                                    readOnly: true,
                                },
                            },
                            {
                                dataField: "quaLicenseTime",
                                label: {
                                    alignment: "right",
                                    text: "发证时间"
                                },
                                editorOptions: {
                                    readOnly: true,
                                },
                            },
                            {
                                itemType: 'empty'
                            },
                            {
                                itemType: 'empty'
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
                                    readOnly:true
                                },
                            },
                            {
                                dataField: "originalImg",
                                colSpan: 4,
                                label: {
                                    alignment: "right",
                                    text: "资质上传(正本)"
                                },
                                template: (data, itemElement) => {
                                    itemElement.append("<div id='addImage'/>");
                                }
                            },
                            {
                                dataField: "copyImg",
                                colSpan: 4,
                                label: {
                                    alignment: "right",
                                    text: "资质上传(副本)"
                                },
                                template: (data, itemElement) => {
                                    itemElement.append("<div id='copy'/>");
                                }
                            },
                        ]
                    }
                ]
            }).dxForm("instance");

            this.hosInit();
        },
        methods: {
            hosInit() {
                let params = {};
                params.id = this.$route.params.hos_id;
                this.$put(hos_detail_Url, params).then(res => {
                    if (res.code == '200') {
                        this.hosInfoFormData = res.data;
                        this.hosInfoForm.option("formData", this.hosInfoFormData);
                        this.uploadLogo();
                        this.addIamgeFile();
                        this.copyFile();
                    }
                    else {

                    }
                }).catch(err => {
                    this.err(err)
                    // console.log(err)
                });
            },
            cancle() {
                this.$router.push({
                    name: 'hos-dictionary'
                })
            },
            submit(val) {
                let params = {};
                this.modal_loading = true;
                params.id = this.hosInfoFormData.id;
                if(val == 'y'){
                    params.authStatus = 1;
                }else{
                    params.authStatus = 2;
                }
                params.authStatus = 1;
                this.$post(hos_audit_url,params).then(res => {
                    if(res.code=='200'){
                        this.success('审核成功!',()=>{
                            this.modal_loading = false;
                            this.$router.push({
                                name: 'hos-dictionary'
                            })
                        });
                    }else{
                        this.modal_loading = false;
                        this.warn(res.msg);
                    }
                }).catch(err=>{
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
