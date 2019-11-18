<template>
    <div>
        <div class="demo-upload-list" v-for="item in uploadList">
            <img :src="item.url">
            <div class="demo-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView()"></Icon>
            </div>
            <modal title="" v-model="visible">
                <img :src="item.url" v-if="visible" style="width: 100%">
            </modal>
        </div>
    </div>
</template>
<script>
    import Vue from 'vue';

    export default {
        data() {
            return {
                visible: false,
                uploadList: [],
                limitImage: true,
            }
        },
        mounted() {
            if (this.$parent.editFormData.photoUrl) {
                let pic = [], picObj = {};
                picObj.url = this.$config.img_base_url + this.$parent.editFormData.photoUrl;
                // picObj.url = 'http://192.168.0.150:30080/res/' + this.$parent.editFormData.imgUrl;
                picObj.status = 'finished';
                pic.push(picObj);
                this.uploadList = pic;
                this.limitImage = false;
            }
        },
        methods: {
            handleBeforeUpload: function (e) {

            },
            handleOnProgress: function (event, file, fileList) {

            },
            handleError: function (error, file, fileList) {

            },
            handleSuccess: function (res, file) {

            },
            handleRemove(file) {

            },
            handleView() {
                this.visible = true
            }
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

