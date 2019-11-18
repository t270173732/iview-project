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
                :action="this.$config.backend_url+'/biz/uploadImg/image?certificateName=druggist_reg'"
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
            if(this.$parent.apoInfoFormData.regUrl) {
                let bdOrgPicVO = {};
                bdOrgPicVO.url = this.$config.img_base_url + this.$parent.apoInfoFormData.regUrl;
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
                    if(res.fileData.regArea){
                        this.$parent.apoInfoForm.updateData('regArea', res.fileData.regArea);
                    }
                    if(res.fileData.regIssueOrg){
                        this.$parent.apoInfoForm.updateData('regIssueOrg', res.fileData.regIssueOrg);
                    }
                    if(res.fileData.regIssueTime){
                        this.$parent.apoInfoForm.updateData('regIssueTime', res.fileData.regIssueTime);
                    }
                    if(res.fileData.regName){
                        this.$parent.apoInfoForm.updateData('regName', res.fileData.regName);
                    }
                    if(res.fileData.regNo){
                        this.$parent.apoInfoForm.updateData('regNo', res.fileData.regNo);
                    }
                    if(res.fileData.regOrgName){
                        this.$parent.apoInfoForm.updateData('regOrgName', res.fileData.regOrgName);
                    }
                    if(res.fileData.regQuaNo){
                        this.$parent.apoInfoForm.updateData('regQuaNo', res.fileData.regQuaNo);
                    }
                    if(res.fileData.regScope){
                        this.$parent.apoInfoForm.updateData('regScope', res.fileData.regScope);
                    }
                    if(res.fileData.regType){
                        this.$parent.apoInfoForm.updateData('regType', res.fileData.regType);
                    }
                    if(res.fileData.regValidTime){
                        this.$parent.apoInfoForm.updateData('regValidTime', res.fileData.regValidTime);
                    }
                    for(let i = 0; i < this.$refs.upload.fileList.length; i++) {
                        if(this.$refs.upload.fileList[i].response) {
                            this.imageFile.push(this.$refs.upload.fileList[i].response.fileInfo[0]);
                        }
                        else {
                            this.imageFile.push(this.$refs.upload.fileList[i]);
                        }
                    }
                    this.$parent.apoInfoFormData.regImg = this.imageFile;
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
                this.$parent.apoInfoFormData.regImg = this.imageFile;
                this.limitImage = true;
            },
            handleView(){
                this.visible = true
            }
        }
    };
</script>

