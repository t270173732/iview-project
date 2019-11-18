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
            <Row :gutter="10" class="margin-top-10">
                <div id="active-info"></div>
            </Row>
        </Card>
    </div>
</template>
<script>
    import Vue from 'vue';
    import ImageInfo from './imageInfo';
    import TagInfo from './tagInfo';
    let active_detail_url = '/biz/bizActivity/read/detail';
    export default {
        data(){
            return{
                activeInfoForm:{},
                activeInfoFormData:{},
            }
        },
        mounted(){
            this.activeInfoForm = $("#active-info").dxForm({
                colCount:4,
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
                            readOnly:true
                        },
                    },
                    {
                        dataField: "startTime",
                        label: {
                            alignment: "right",
                            text: "活动开始时间"
                        },
                        editorOptions:{
                            readOnly:true
                        }
                    },
                    {
                        dataField: "endTime",
                        label: {
                            alignment: "right",
                            text: "活动结束时间"
                        },
                        editorOptions:{
                            readOnly:true
                        }
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
                            text: "地址信息"
                        },
                        editorOptions:{
                            readOnly:true
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
                        editorOptions:{
                            readOnly:true
                        }
                    },
                    {
                        dataField: "remark",
                        editorType:'dxTextArea',
                        colSpan:4,
                        label: {
                            alignment: "right",
                            text: "备注"
                        },
                        editorOptions:{
                            readOnly:true
                        }
                    },
                ]
            }).dxForm("instance");

            this.activeInit();
        },
        methods:{
            activeInit:function(){
                let params = {};
                params.id = Number(this.$route.params.active_id);
                this.$put(active_detail_url,params).then(res => {
                    if(res.code=='200')
                    {
                        this.activeInfoFormData = res.data;
                        this.activeInfoForm.option("formData",this.activeInfoFormData);
                        this.activeInfoForm.repaint();
                    }
                    else {
                        this.warn(res.msg);
                    }
                }).catch(err=>
                {
                    this.err(err)
                    // console.log(err)
                });
            },

            addIamgeFile(data, itemElement) {
                itemElement.append("<div id='addImage'/>");
                var FileUpload = new Vue(ImageInfo);
                FileUpload.$parent = this;
                FileUpload.$mount('#addImage');
            },

            addTag(data, itemElement) {
                itemElement.append("<div id='t'/>");
                var tag = new Vue(TagInfo);
                tag.$parent = this;
                this.$refs.tagData = tag;
                tag.$mount('#t');
            },

            cancle:function () {
                this.$router.push({
                    name: 'active',
                });
            },

            //添加区域
            addAreaCascade: function (data, itemElement) {
                itemElement.append("<div id='Area'/>");
                var area = new (Vue.component('AreaCascade'));
                area.field = data;
                area.field.isDisabled = true;
                area.$mount('#Area');
            },
        }
    }
</script>