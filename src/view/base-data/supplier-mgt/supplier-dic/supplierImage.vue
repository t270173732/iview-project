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
                :action="this.$config.backend_url+'/biz/uploadImg/image?certificateName=dbl'"
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
            if(this.$parent.supplierFormData.dblUrl) {
                let bdOrgPicVO = {};
                bdOrgPicVO.url = this.$config.img_base_url + this.$parent.supplierFormData.dblUrl;
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
                    if(res.fileData.dblName){
                        this.$parent.supplierForm.updateData('dblName', res.fileData.dblName);
                    }
                    //地址
                    if(res.fileData.dblAddr){
                        this.$parent.supplierForm.updateData('dblAddr', res.fileData.dblAddr);
                    }
                    //法定代表人
                    if(res.fileData.dblPerson){
                        this.$parent.supplierForm.updateData('dblPerson', res.fileData.dblPerson);
                    }
                    //营业期限
                    if(res.fileData.dblValidTime){
                        this.$parent.supplierForm.updateData('dblValidTime', res.fileData.dblValidTime);
                    }
                    //经营范围
                    if(res.fileData.dblBizScope){
                        this.$parent.supplierForm.updateData('dblBizScope', res.fileData.dblBizScope);
                    }
                    //注册号
                    if(res.fileData.dblNo){
                        this.$parent.supplierForm.updateData('dblNo', res.fileData.dblNo);
                    }
                    //登记机关
                    if(res.fileData.dblLicenseOrg){
                        this.$parent.supplierForm.updateData('dblLicenseOrg', res.fileData.dblLicenseOrg);
                    }
                    //经营方式
                    if(res.fileData.dblBizMode){
                        this.$parent.supplierForm.updateData('dblBizMode', res.fileData.dblBizMode);
                    }
                    //登记日期
                    if(res.fileData.dblLicenseTime){
                        this.$parent.supplierForm.updateData('dblLicenseTime', res.fileData.dblLicenseTime);
                    }
                    //企业负责人
                    if(res.fileData.dblPrincipal){
                        this.$parent.supplierForm.updateData('dblPrincipal', res.fileData.dblPrincipal);
                    }
                    //质量负责人
                    if(res.fileData.dblQuaPrincipal){
                        this.$parent.supplierForm.updateData('dblQuaPrincipal', res.fileData.dblQuaPrincipal);
                    }
                    //仓库地址
                    if(res.fileData.dblStoreAddr){
                        this.$parent.supplierForm.updateData('dblStoreAddr', res.fileData.dblStoreAddr);
                    }
                    for(let i = 0; i < this.$refs.upload.fileList.length; i++) {
                        if(this.$refs.upload.fileList[i].response) {
                            this.imageFile.push(this.$refs.upload.fileList[i].response.fileInfo[0]);
                        }
                        else {
                            this.imageFile.push(this.$refs.upload.fileList[i]);
                        }
                    }
                    this.$parent.supplierFormData.dblImg = this.imageFile;
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
                this.$parent.supplierFormData.dblImg = this.imageFile;
                this.limitImage = true
            },
            handleView () {
                this.visible = true;
            },
        }
    };
</script>

