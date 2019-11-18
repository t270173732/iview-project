<style lang="less">
    @import "../../../styles/common.less";
</style>
<template>
    <div>
        <Card dis-hover>
            <div slot="title" class="cardHead">
                <a href="#" @click.prevent="cancle">
                    <Icon type="ios-arrow-back"></Icon>
                    返回
                </a>
            </div>
            <p slot="extra">
                <Button type="primary" @click="submit" :loading="modal_loading">保存</Button>
                <Button class="margin-left-5" @click="cancle">取消</Button>
            </p>
            <Row class="margin-top-10">
                <div id="patientsForm"></div>
            </Row>
        </Card>
    </div>
</template>
<script>
    import Vue from 'vue';
    import {codefans_net_CC2PY} from '@/libs/util.js';
    import HeadImg from './headImg';
    import FrontImg from './idCardFront';
    import BackImg from './idCardBack';
    import MiCardImg from './miCard';
    let patient_detail_url = '/sys/sysPatient/read/detail';
    let patient_insertOrUpdate_url = '/sys/sysPatient/updatePatient';
    export default {
        data(){
            return{
                modal_loading:false,
                patientsForm:{},
                patientsFormData:{}
            }
        },
        mounted(){
            this.patientsForm = $('#patientsForm').dxForm({
                colCount: 1,
                formData: this.patientsFormData,
                items:[
                    {
                        itemType: 'group',
                        caption: '基础信息',
                        colCount: 4,
                        name:"baseInfo",
                        items: [
                            {
                                dataField: 'helthNo',
                                label: {
                                    alignment: 'right',
                                    text: '健康号'
                                },
                                editorOptions:{
                                    placeholder:'<系统自动分配>',
                                    disabled:true
                                }
                            },
                            {
                                dataField: 'name',
                                label: {
                                    alignment: 'right',
                                    text: '姓名'
                                },
                                editorOptions:{
                                    maxLength:20,
                                    onValueChanged:(e)=>{
                                        if(e.value){
                                            this.patientsForm.updateData('code',codefans_net_CC2PY($.trim(e.value)));
                                        }
                                    }
                                },
                                validationRules: [{
                                    type: "required",
                                    message: "请输入姓名"
                                }]
                            },
                            {
                                dataField: 'code',
                                label: {
                                    alignment: 'right',
                                    text: '简码'
                                },
                                editorOptions:{
                                    readOnly:true
                                },
                            },
                            {
                                dataField: 'sex',
                                editorType:'dxSelectBox',
                                label: {
                                    alignment: 'right',
                                    text: '性别'
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
                                dataField: 'birthday',
                                label: {
                                    alignment: 'right',
                                    text: '出生日期'
                                },
                                validationRules: [{
                                    type: "required",
                                }],
                                template:this.datePicker
                            },
                            {
                                dataField: 'nation',
                                label: {
                                    alignment: 'right',
                                    text: '民族'
                                },
                                editorOptions:{
                                    maxLength:20
                                },
                                validationRules: [{
                                    type: "required",
                                    message: "请输入民族"
                                }]
                            },
                            {
                                dataField: 'idCard',
                                label: {
                                    alignment: 'right',
                                    text: '身份证'
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
                                dataField: 'account',
                                label: {
                                    alignment: 'right',
                                    text: '电话'
                                },
                                validationRules: [{
                                    type:"required",
                                    message: "请输入手机"
                                },{
                                    type: "pattern",
                                    pattern: "^1[3|4|5|6|7|8|9][0-9]{9}$",
                                    message: "请输入正确的手机号!"
                                }]
                            },
                            {
                                dataField: 'address',
                                label: {
                                    alignment: 'right',
                                    text: '家庭地址'
                                },
                                editorOptions:{
                                    maxLength:100
                                },
                                validationRules: [{
                                    type:"required",
                                    message: "请输入家庭地址"
                                }]
                            },
                            {itemType:'empty'},
                            {itemType:'empty'},
                            {itemType:'empty'},
                            {
                                dataField: 'remark',
                                editorType:'dxTextArea',
                                colSpan:4,
                                label: {
                                    alignment: 'right',
                                    text: '备注'
                                },
                                editorOptions:{
                                    height:60,
                                    maxLength:100
                                },
                            },
                            {
                                dataField: 'headImg',
                                colSpan:4,
                                label: {
                                    alignment: 'right',
                                    text: '头像'
                                },
                                template:(data, itemElement)=>{
                                    itemElement.append("<div id='headPic'/>");
                                }
                            },
                        ]
                    },{
                        itemType: 'group',
                        caption: '医保卡信息',
                        colCount: 4,
                        name:"cardInfo",
                        items: [
                            {
                                dataField: "miCardImg",
                                colSpan:4,
                                label: {
                                    alignment: "right",
                                    text: "医保卡"
                                },
                                template: (data, itemElement)=>{
                                    itemElement.append("<div id='miCardPic'/>");
                                }
                            },
                            {
                                dataField: 'miCard',
                                label: {
                                    alignment: 'right',
                                    text: '医保卡号'
                                },
                                editorOptions:{
                                    maxLength:20
                                },
                            },

                        ]
                    },{
                        itemType: 'group',
                        caption: '身份证信息',
                        colCount: 4,
                        name:"ID",
                        items: [
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
                            },
                            {
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
                    },
                ]
            }).dxForm('instance');

            this.patientsInit();
        },
        methods:{
            patientsInit() {
                if (this.$route.params.patient_id == 0) {
                    this.patientsFormData = {};
                    this.patientsForm.option('formData', this.patientsFormData);
                    this.uploadHeadImg();
                    this.uploadMiCard();
                    this.uploadIDFront();
                    this.uploadIDBack();
                } else {
                    let params = {};
                    params.id = Number(this.$route.params.patient_id);
                    this.$put(patient_detail_url, params).then(res => {
                        if (res.code == '200') {
                            this.patientsFormData = res.data;
                            this.patientsForm.itemOption('baseInfo.helthNo','editorOptions',{readOnly:true});
                            this.patientsForm.option("formData", this.patientsFormData);
                            this.uploadHeadImg();
                            this.uploadMiCard();
                            this.uploadIDFront();
                            this.uploadIDBack();
                        }
                        else {
                            this.warn(res.msg);
                        }
                    }).catch(err => {
                        this.error(err)
                        // console.log(err)
                    });
                }
            },
            submit() {
                let params = {};
                this.modal_loading = true;
                if (!this.patientsForm.validate().isValid) {
                    this.modal_loading = false;
                    return;
                }
                params = this.patientsFormData;
                this.$post(patient_insertOrUpdate_url, params).then(res => {
                    if (res.code == '200') {
                        this.success('保存成功!', () => {
                            this.$router.push({
                                name: 'patient-dic',
                            });
                            this.modal_loading = false;
                        });
                    }
                    else {
                        this.modal_loading = false;
                        this.warn(res.msg);
                    }
                }).catch(err => {
                    this.modal_loading = false;
                    this.error(err);
                });
            },
            cancle(){
                this.$router.push({
                    name: 'patient-dic',
                });
            },
            datePicker: function (data, itemElement) {
                itemElement.append("<div id='date-holder'/>");
                let datepicker = new (Vue.component('DateTimePicker'));
                datepicker.field = data;
                datepicker.$mount('#date-holder');
            },
            uploadHeadImg() {
                let FileUpload = new Vue(HeadImg);
                FileUpload.$parent = this;
                FileUpload.$mount('#headPic');
            },
            uploadIDFront() {
                let FileUpload = new Vue(FrontImg);
                FileUpload.$parent = this;
                FileUpload.$mount('#IDFront');
            },
            uploadIDBack() {
                let FileUpload = new Vue(BackImg);
                FileUpload.$parent = this;
                FileUpload.$mount('#IDBack');
            },
            uploadMiCard() {
                let FileUpload = new Vue(MiCardImg);
                FileUpload.$parent = this;
                FileUpload.$mount('#miCardPic');
            },
        }
    }
</script>