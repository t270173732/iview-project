<style lang="less">
    @import "../../../../styles/common.less";
</style>
<template>
    <div>
        <div class="demo-upload-list" v-for="item in uploadList">
            <template v-if="item.status === 'finished'">
                <img :src="item.url">
                <div class="demo-upload-list-cover">
                    <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                    <Icon type="ios-eye-outline" @click.native="handleView()"></Icon>
                </div>
            </template>
            <template v-else>
                <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
            </template>
            <modal title="" v-model="visible">
                <img :src="item.url" v-if="visible" style="width: 100%">
            </modal>
        </div>
        <Upload
                ref="upload"
                :show-upload-list="false"
                :format="['jpg','jpeg','png']"
                :max-size="10240"
                multiple
                type="select"
                :before-upload="handleBeforeUpload"
                :on-progress="handleOnProgress"
                :on-success="handleSuccess"
                :on-error="handleError"
                :action="this.$config.backend_url+'/biz/uploadImg/image?certificateName=qua'"
                style="display: inline-block;width:75px;vertical-align: middle;"
                v-show="limitImage"
        >
            <div style="width: 75px;height:75px;line-height: 75px;border: 1px dotted #c3c3c3;text-align: center;cursor: pointer">
                <Icon type="md-add" size="30" />
            </div>
        </Upload>
    </div>
</template>
<script>
    import Vue from 'vue';

    export default {
        data() {
            return {
                visible:false,
                uploadList: [],
                imageFile: [],
                limitImage:true,
            };
        },
        mounted() {
            if(this.$parent.hosInfoFormData.originalUrl) {
                let bdOrgPicVO = {};
                bdOrgPicVO.url = this.$config.img_base_url + this.$parent.hosInfoFormData.originalUrl;
                bdOrgPicVO.status = 'finished';
                this.$refs.upload.fileList.push(bdOrgPicVO);
                this.limitImage = false;
            }
            this.uploadList = this.$refs.upload.fileList;
        },
        methods: {
            handleBeforeUpload: function(e) {
                this.limitImage = false
                // console.log(this.$refs.upload.fileList)
            },
            handleOnProgress: function(event, file, fileList) {

            },
            handleError(){
                this.limitImage = true
            },
            handleSuccess: function(res, file) {
                if(res.code == '200') {
                    this.imageFile = [];
                    if(file.response.fileInfo) {
                        file.url = this.$config.img_base_url + file.response.fileInfo[0].fileName;
                    }
                    //公司名称
                    if(res.fileData.quaOrgName){
                        this.$parent.hosInfoForm.updateData('quaOrgName', res.fileData.quaOrgName);
                    }
                    //地址
                    if(res.fileData.quaAddr){
                        this.$parent.hosInfoForm.updateData('quaAddr', res.fileData.quaAddr);
                    }
                    //法定代表人
                    if(res.fileData.quaPerson){
                        this.$parent.hosInfoForm.updateData('quaPerson', res.fileData.quaPerson);
                    }
                    //主要负责人
                    if(res.fileData.quaPrincipal){
                        this.$parent.hosInfoForm.updateData('quaPrincipal', res.fileData.quaPrincipal);
                    }
                    //营业期限
                    if(res.fileData.quaValidTime){
                        this.$parent.hosInfoForm.updateData('quaValidTime', res.fileData.quaValidTime);
                    }
                    //诊疗科目
                    if(res.fileData.quaSubject){
                        this.$parent.hosInfoForm.updateData('quaSubject', res.fileData.quaSubject);
                    }
                    //注册号
                    if(res.fileData.quaRegistNo){
                        this.$parent.hosInfoForm.updateData('quaRegistNo', res.fileData.quaRegistNo);
                    }
                    //登记机关
                    if(res.fileData.quaLicenseOrg){
                        this.$parent.hosInfoForm.updateData('quaLicenseOrg', res.fileData.quaLicenseOrg);
                    }
                    //登记日期
                    if(res.fileData.quaLicenseTime){
                        this.$parent.hosInfoForm.updateData('quaLicenseTime', res.fileData.quaLicenseTime);
                    }
                    for(let i = 0; i < this.$refs.upload.fileList.length; i++) {
                        if(this.$refs.upload.fileList[i].response) {
                            this.imageFile.push(this.$refs.upload.fileList[i].response.fileInfo[0]);
                        }
                        else {
                            this.imageFile.push(this.$refs.upload.fileList[i]);
                        }
                    }
                    this.$parent.hosInfoFormData.originalImg = this.imageFile;
                } else {
                    this.warn(res.msg);
                }
                this.limitImage = false;
            },
            handleRemove(file) {
                this.imageFile = [];
                const fileList = this.$refs.upload.fileList;
                this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
                for(let i = 0; i < this.$refs.upload.fileList.length; i++) {
                    if(this.$refs.upload.fileList[i].response) {
                        this.imageFile.push(this.$refs.upload.fileList[i].response.fileInfo[0]);
                    }
                    else {
                        this.imageFile.push(this.$refs.upload.fileList[i]);
                    }
                }
                this.$parent.hosInfoFormData.originalImg = this.imageFile;
                this.limitImage = true;
            },
            handleView () {
                this.visible = true;
            },
        }
    };
</script>

