<style lang="less">
    @import "../../../styles/common.less";
</style>
<template>
    <div>
        <Card dis-hover>
            <Row>
                <Col :sm="18" :md="12" :lg="6">
                    <div id="form"></div>
                    <div  class="margin-top-20" style="width: 100%;padding: 0 30% 0 30%">
                        <Button type="primary" @click="submit" :loading="modal_loading" style="width: 100%">保存</Button>
                    </div>
                </Col>
            </Row>
        </Card>
    </div>
</template>
<script>
    import Vue from 'vue'
    import Photo from './photo'

    export default {
        data() {
            return {
                form: {},
                formData: {},
                modal_loading: false
            }
        },
        mounted() {
            let that = this;
            this.form = $("#form").dxForm({
                colCount: 1,
                formData: this.formData,
                items: [
                    {
                        dataField: "",
                        label: {
                            alignment: "right",
                            text: "上传头像"
                        },
                        template: this.photos
                    },
                    {
                        dataField: "",
                        label: {
                            alignment: "right",
                            text: "用户名"
                        },
                        editorOptions: {
                            readOnly: true
                        }
                    },
                    // {
                    //     dataField: "",
                    //     label: {
                    //         alignment: "right",
                    //         text: "Email"
                    //     },
                    //     editorOptions: {
                    //         readOnly: true
                    //     }
                    // },
                    {
                        dataField: "password",
                        label: {
                            alignment: "right",
                            text: "旧密码"
                        },
                        validationRules: [{
                            type: "required",
                            message: "请输入旧密码"
                        }]
                    },
                    {
                        dataField: "newPass",
                        label: {
                            alignment: "right",
                            text: "新密码"
                        },
                        editorOptions: {
                            maxLength: 15,
                            // mode: "password"
                        },
                        validationRules: [{
                            type: "required",
                            message: "请输入新密码"
                        }]
                    },
                    {
                        dataField: "newPwd",
                        label: {
                            alignment: "right",
                            text: "确认密码"
                        },
                        editorOptions: {
                            maxLength: 15,
                            // mode: "password"
                        },
                        validationRules: [{
                            type: "required",
                            message: "请确认密码"
                        }, {
                            type: "compare",
                            comparisonTarget: function () {
                                if (that.formData.newPwd = that.formData.newPass) {
                                    return that.formData.newPwd
                                } else {
                                    return that.formData.newPass;
                                }
                            },
                            message: "两次输入的密码不一致"
                        }]
                    }
                ]
            }).dxForm("instance");
        },
        methods: {
            photos(data, itemElement) {
                itemElement.append("<div id='photo'/>");
                var fileUpload = new Vue(Photo);
                fileUpload.$parent = this;
                fileUpload.$mount('#photo');
            },

            submit() {

            }
        }
    }
</script>
