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
                :on-success="handleSuccess"
                :on-error="handleError"
                :action="this.$config.backend_url+'/biz/uploadImg/image?certificateName=bl'"
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
                limitImage:true
            };
        },
        mounted() {
            if(this.$parent.supplierFormData.blUrl) {
                let bdOrgPicVO = {};
                bdOrgPicVO.url = this.$config.img_base_url + this.$parent.supplierFormData.blUrl;
                bdOrgPicVO.status = 'finished';
                this.$refs.upload.fileList.push(bdOrgPicVO);
                this.limitImage = false
            }
            this.uploadList = this.$refs.upload.fileList;
        },
        methods: {
            handleBeforeUpload: function(e) {
                this.limitImage = false
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
                    if(res.fileData.blName){
                        this.$parent.supplierForm.updateData('blName', res.fileData.blName);
                    }
                    //主体类型
                    if(res.fileData.blType){
                        this.$parent.supplierForm.updateData('blType', res.fileData.blType);
                    }
                    //地址
                    if(res.fileData.blAddr){
                        this.$parent.supplierForm.updateData('blAddr', res.fileData.blAddr);
                    }
                    //法定代表人
                    if(res.fileData.blPerson){
                        this.$parent.supplierForm.updateData('blPerson', res.fileData.blPerson);
                    }
                    //注册资本
                    if(res.fileData.blRegistCapital){
                        this.$parent.supplierForm.updateData('blRegistCapital', res.fileData.blRegistCapital);
                    }
                    //成立日期
                    if(res.fileData.blFundingTime){
                        this.$parent.supplierForm.updateData('blFundingTime', res.fileData.blFundingTime);
                    }
                    //营业期限
                    if(res.fileData.blBizLimit){
                        this.$parent.supplierForm.updateData('blBizLimit', res.fileData.blBizLimit);
                    }
                    //经营范围
                    if(res.fileData.blBizScope){
                        this.$parent.supplierForm.updateData('blBizScope', res.fileData.blBizScope);
                    }
                    //登记机关
                    if(res.fileData.blLicenseOrg){
                        this.$parent.supplierForm.updateData('blLicenseOrg', res.fileData.blLicenseOrg);
                    }
                    //登记日期
                    if(res.fileData.blLicenseTime){
                        this.$parent.supplierForm.updateData('blLicenseTime', res.fileData.blLicenseTime);
                    }
                    for(let i = 0; i < this.$refs.upload.fileList.length; i++) {
                        if(this.$refs.upload.fileList[i].response) {
                            this.imageFile.push(this.$refs.upload.fileList[i].response.fileInfo[0]);
                        }
                        else {
                            this.imageFile.push(this.$refs.upload.fileList[i]);
                        }
                    }
                    this.$parent.supplierFormData.blImg = this.imageFile;
                } else {
                    this.warn(res.msg);
                }
                this.limitImage = false
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
                this.$parent.supplierFormData.blImg = this.imageFile;
                this.limitImage = true
            },
            handleView () {
                this.visible = true;
            },
        }
    };
</script>

