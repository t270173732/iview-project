<style lang="less">
    @import "../../../styles/common.less";
</style>
<template>
    <div>
        <div class="demo-upload-list" v-for="item in uploadList">
            <template v-if="item.status === 'finished'">
                <img :src="item.url">
                <div class="demo-upload-list-cover">
                    <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                </div>
            </template>
            <template v-else>
                <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
            </template>
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
                :action="this.$config.backend_url+'/sys/upload/image'"
                v-show="limitImage"
                style="display: inline-block;width:75px;vertical-align: middle;"
        >
            <div class="upload-icon">
                <Icon type="md-add" size="32"></Icon>
            </div>
        </Upload>
    </div>
</template>
<script>
    import Vue from 'vue';

    export default {
        data() {
            return {
                uploadList: [],
                imageFile: [],
                limitImage: true
            }
        },
        mounted() {
            // if(this.$parent.pharmacyInfoFormData.bdDrugstorePicVO && this.$parent.pharmacyInfoFormData.bdDrugstorePicVO.length != 0){
            //     let bdOrgPicVO = this.$parent.pharmacyInfoFormData.bdDrugstorePicVO;
            //
            //     for(let i=0 ;i<bdOrgPicVO.length ; i++){
            //         bdOrgPicVO[i].url = this.$conf.constant.img_base_url + bdOrgPicVO[i].filename;
            //         bdOrgPicVO[i].status = 'finished';
            //     }
            //     this.$refs.upload.fileList = bdOrgPicVO;
            // }
            this.uploadList = this.$refs.upload.fileList;
        },
        methods: {
            handleBeforeUpload: function (e) {

            },
            handleOnProgress: function (event, file, fileList) {

            },
            handleSuccess: function (res, file) {
                if (res.code == '200') {
                    this.imageFile = [];
                    if (file.response.fileInfo) {
                        file.url = this.$config.img_base_url + file.response.fileInfo[0].fileName;
                    }
                    for (let i = 0; i < this.$refs.upload.fileList.length; i++) {
                        if (this.$refs.upload.fileList[i].response) {
                            this.imageFile.push(this.$refs.upload.fileList[i].response.fileInfo[0])
                        }
                        else {
                            this.imageFile.push(this.$refs.upload.fileList[i])
                        }
                    }
                    // this.$parent.pharmacyInfoFormData.fileInfo = this.imageFile
                } else {
                    this.warn(res.msg)
                }
                this.limitImage = false;
            },
            handleRemove(file) {
                this.imageFile = [];
                const fileList = this.$refs.upload.fileList;
                this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
                this.limitImage = true;
                for (let i = 0; i < this.$refs.upload.fileList.length; i++) {
                    if (this.$refs.upload.fileList[i].response) {
                        this.imageFile.push(this.$refs.upload.fileList[i].response.fileInfo[0])
                    }
                    else {
                        this.imageFile.push(this.$refs.upload.fileList[i])
                    }
                }
                // this.$parent.pharmacyInfoFormData.fileInfo = this.imageFile
            },
        }
    }
</script>
