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
                :action="this.$config.backend_url+'/sys/upload/image'"
                style="display: inline-block;width:75px;vertical-align: middle;"
                v-show="addLimit"
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
                addLimit: true
            }
        },
        mounted() {
            if (this.$parent.activeInfoFormData.photoUrl) {
                let pic = [], picObj = {};
                picObj.url = this.$config.img_base_url + this.$parent.activeInfoFormData.photoUrl;
                // picObj.url = 'http://192.168.0.150:30080/res/' + this.$parent.activeInfoFormData.imgUrl;
                picObj.status = 'finished';
                pic.push(picObj);
                this.$refs.upload.fileList = pic;
                this.addLimit = false;
            }
            this.uploadList = this.$refs.upload.fileList;
        },
        methods: {
            handleBeforeUpload: function (e) {
                this.limitImage = false
            },
            handleOnProgress: function (event, file, fileList) {

            },
            handleError(){
                this.limitImage = true
            },
            handleView () {
                this.visible = true;
            },
            handleSuccess: function (res, file) {
                if (res.code == '200') {
                    this.imageFile = [];
                    if (file.response.fileInfo) {
                        file.url = this.$config.img_base_url + file.response.fileInfo[0].fileName;
                        // file.url = 'http://192.168.0.150:30080/res/' + file.response.fileInfo[0].fileName;
                    }
                    for (let i = 0; i < this.$refs.upload.fileList.length; i++) {
                        if (this.$refs.upload.fileList[i].response) {
                            this.imageFile.push(this.$refs.upload.fileList[i].response.fileInfo[0])
                        }
                        else {
                            this.imageFile.push(this.$refs.upload.fileList[i])
                        }
                    }
                    this.$parent.activeInfoFormData.photoImg = this.imageFile;
                } else {
                    this.warn(res.msg)
                }
                this.addLimit = false;
            },
            handleRemove(file) {
                // console.log(file)
                this.imageFile = [];
                const fileList = this.$refs.upload.fileList;
                this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
                for (let i = 0; i < this.$refs.upload.fileList.length; i++) {
                    if (this.$refs.upload.fileList[i].response) {
                        this.imageFile.push(this.$refs.upload.fileList[i].response.fileInfo[0])
                    }
                    else {
                        this.imageFile.push(this.$refs.upload.fileList[i])
                    }
                }
                this.addLimit = true;
                this.$parent.activeInfoFormData.photoImg = this.imageFile;
            },
        }
    }
</script>
<style>
    .demo-upload-list {
        display: inline-block;
        width: 75px;
        height: 75px;
        text-align: center;
        line-height: 75px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        margin-right: 4px;
        vertical-align: middle;
    }

    .demo-upload-list img {
        width: 100%;
        height: 100%;
    }

    .demo-upload-list-cover {
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, .6);
    }

    .demo-upload-list:hover .demo-upload-list-cover {
        display: block;
    }

    .demo-upload-list-cover i {
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
</style>

