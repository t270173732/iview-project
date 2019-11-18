<style lang="less">
    @import "../../../styles/common.less";
    .demo-spin-icon-load{
        animation: ani-demo-spin 1s linear infinite;
    }
</style>
<template>
    <div>
        <Card dis-hover>
            <div slot="title"  class="cardHead">
                <a href="#"  @click.prevent="cancle" >
                    <Icon type="ios-arrow-back"></Icon>
                    返回
                </a>
            </div>
            <p slot="extra" >
                <Button  type="primary" @click="submit" :loading="modal_loading">保存</Button>
                <Button class="margin-left-5"  @click="cancle">取消</Button>
            </p>
            <Row :gutter="10" class="margin-top-10">
                <div id="active-info"></div>
            </Row>
        </Card>
    </div>
</template>
<script>
    import Vue from 'vue';
    import Image from './image';
    import Tag from './tag';
    let active_inserORupdate_url = '/biz/bizActivity/updateActivity';
    let active_detail_url = '/biz/bizActivity/read/detail';
    export default {
        data(){
            return{
                isNew:true,
                modal_loading:false,
                activeInfoForm:{},
                activeInfoFormData:{},
            }
        },
        mounted(){
            this.activeInfoForm = $("#active-info").dxForm({
                colCount: 4,
                formData:this.activeInfoFormData,
                items:[
                    {
                        dataField: "title",
                        colSpan:4,
                        label: {
                            alignment: "right",
                            text: "活动标题"
                        },
                        editorOptions: {
                            maxLength:80
                        },
                        validationRules: [{
                            type:"required",
                            message: "请输入活动标题"
                        }]
                    },
                    {
                        dataField: "startTime",
                        label: {
                            alignment: "right",
                            text: "活动开始时间"
                        },
                        validationRules: [{
                            type:"required",
                            message: "请选择活动开始时间"
                        }],
                        template:this.startPicker
                    },
                    {
                        dataField: "endTime",
                        label: {
                            alignment: "right",
                            text: "活动结束时间"
                        },
                        validationRules: [{
                            type:"required",
                            message: "请选择活动结束时间"
                        }],
                        template:this.endPicker
                    },
                    {
                        dataField: "areaId",
                        label: {
                            alignment: "right",
                            text: "活动地区"
                        },
                        validationRules: [{
                            type:"required",
                            message: "请选择活动地区"
                        }],
                        template:this.addAreaCascade
                    },
                    {itemType:'empty'},
                    {
                        dataField: "address",
                        colSpan:4,
                        label: {
                            alignment: "right",
                            text: "活动地址"
                        },
                        validationRules: [{
                            type:"required",
                            message: "请输入活动地址"
                        }],
                        editorOptions:{
                            placeholder:'请输入详细地址信息，如道路、门牌号、小区、楼栋号、单元等信息',
                            maxLength:200
                        }
                    },
                    {
                        dataField: "photoImg",
                        colSpan:4,
                        label: {
                            alignment: "right",
                            text: "活动图片"
                        },
                        validationRules: [{
                            type:"required",
                            message: "请上传活动图片"
                        }],
                        template: this.addIamgeFile
                    },
                    {
                        dataField: "tags",
                        colSpan: 4,
                        label: {
                            alignment: "right",
                            text: "关键词设置"
                        },
                        validationRules: [{
                            type:"required",
                            message: "请设置关键词"
                        }],
                        template: this.addTag
                    },
                    {
                        dataField: "description",
                        editorType:'dxTextArea',
                        colSpan:4,
                        label: {
                            alignment: "right",
                            text: "活动描述"
                        },
                        validationRules: [{
                            type:"required",
                            message: "请输入活动描述"
                        }],
                        editorOptions:{
                            placeholder:'最多输入500字',
                            maxLength:2000,
                            height:80
                        }
                    },
                    {
                        dataField: "reson",
                        visible:false,
                        colSpan:4,
                        label: {
                            alignment: "right",
                            text: "不通过原因"
                        },
                        editorOptions:{
                            readOnly:true
                        }
                    },
                    {
                        dataField: "summary",
                        editorType:'dxTextArea',
                        colSpan:4,
                        label: {
                            alignment: "right",
                            text: "备注"
                        },
                        editorOptions:{
                            maxLength:100,
                            height:80
                        }
                    },
                ]
            }).dxForm("instance");

            this.activeInit();
        },
        methods:{
            activeInit:function(){
                if(this.$route.params.active_id == 0){
                    this.isNew = true;
                    this.activeInfoFormData = {};
                    this.activeInfoForm.option('formData',this.activeInfoFormData);
                }else{
                    this.isNew = false;
                    let params = {};
                    params.id = Number(this.$route.params.active_id);
                    this.$put(active_detail_url,params).then(res => {
                        if(res.code=='200')
                        {
                            this.activeInfoFormData = res.data;
                            if(this.activeInfoFormData.status == 3){
                                this.activeInfoForm.itemOption('reson','visible',true)
                            }
                            this.activeInfoForm.option("formData",this.activeInfoFormData);
                            this.activeInfoForm.repaint();
                        }
                        else {
                            this.warn(res.msg);
                        }
                    }).catch(err=>
                    {
                        this.error(err)
                        // console.log(err)
                    });
                }
            },

            startPicker: function (data, itemElement) {
                itemElement.append("<div id='startPicker'/>");
                var datepicker = new (Vue.component('DateTimePicker'));
                datepicker.field = data;
                datepicker.type = 'datetime';
                datepicker.format = 'yyyy-MM-dd HH:mm';
                datepicker.$mount('#startPicker');
            },
            endPicker: function (data, itemElement) {
                itemElement.append("<div id='endPicker'/>");
                var datepicker = new (Vue.component('DateTimePicker'));
                datepicker.field = data;
                datepicker.type = 'datetime';
                datepicker.format = 'yyyy-MM-dd HH:mm';
                datepicker.$mount('#endPicker');
            },
            //添加区域
            addAreaCascade: function (data, itemElement) {
                itemElement.append("<div id='Area'/>");
                var area = new (Vue.component('AreaCascade'));
                area.field = data;
                area.$mount('#Area');
            },

            addIamgeFile(data, itemElement) {
                itemElement.append("<div id='addImage'/>");
                let FileUpload = new Vue(Image);
                FileUpload.$parent = this;
                FileUpload.$mount('#addImage');
            },

            addTag(data, itemElement) {
                itemElement.append("<div id='t'/>");
                let tag = new Vue(Tag);
                tag.$parent = this;
                this.$refs.tagData = tag;
                tag.$mount('#t');
            },

            cancle:function () {
                this.$router.push({
                    name: 'active',
                });
            },

            submit:function () {
                let params = {};
                this.modal_loading = true;
                if(!this.activeInfoForm.validate().isValid){
                    this.warn('信息不完整');
                    this.modal_loading = false;
                    return;
                }
                if(!this.activeInfoFormData.startTime){
                    this.warn('选择活动开始时间');
                    this.modal_loading = false;
                    return;
                }
                if(!this.activeInfoFormData.endTime){
                    this.warn('选择活动结束时间');
                    this.modal_loading = false;
                    return;
                }else{
                    let now = new Date().getTime();
                    let endTime = new Date(this.activeInfoFormData.endTime).getTime();
                    if(endTime < now){
                        this.warn('活动结束时间小于当前时间，不能保存');
                        this.modal_loading = false;
                        return;
                    }
                }
                if (this.activeInfoFormData.startTime && this.activeInfoFormData.endTime) {
                    let startTime = new Date(this.activeInfoFormData.startTime).getTime();
                    let endTime = new Date(this.activeInfoFormData.endTime).getTime();
                    if (startTime > endTime) {
                        this.modal_loading = false;
                        this.warn('活动开始时间不能在结束时间之后');
                        return;
                    }
                }
                if(!this.activeInfoFormData.photoImg && !this.activeInfoFormData.photoUrl){
                    this.warn('请上传活动图片');
                    this.modal_loading = false;
                    return;
                }
                if(this.activeInfoFormData.photoImg && this.activeInfoFormData.photoImg.length == 0){
                    this.warn('请上传活动图片');
                    this.modal_loading = false;
                    return;
                }
                if(!this.activeInfoFormData.areaId){
                    this.warn('请选择区域');
                    this.modal_loading = false;
                    return;
                }
                if(!this.activeInfoFormData.tags || this.activeInfoFormData.tags.length == 0){
                    this.warn('请设置关键词');
                    this.modal_loading = false;
                    return;
                }
                if(this.activeInfoFormData.status == 3){
                    this.activeInfoFormData.reson = ''
                }
                this.activeInfoFormData.status = 1;
                params = this.activeInfoFormData;
                this.$post(active_inserORupdate_url,params).then(res => {
                    if(res.code=='200')
                    {
                        this.success('保存成功!',()=>{
                            this.modal_loading = false;
                            this.$router.push({
                                name: 'active',
                            });
                        });
                    }
                    else
                    {
                        //提示信息
                        this.warn(res.msg);
                    }
                }).catch(err=>
                {
                    this.error(err);
                });
                this.modal_loading = false;
            }
        }
    }
</script>