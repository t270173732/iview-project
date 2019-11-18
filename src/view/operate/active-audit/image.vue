<template>
  <div>
    <div class="demo-upload-list" v-for="item in uploadList">
      <img :src="item.url">
    </div>
  </div>
</template>
<script>
import Vue from 'vue';
    export default {
        data(){
            return{
                uploadList:[],
            }
        },
        mounted(){
            this.uploadList = [];
            if(this.$parent.activeInfoFormData.photoUrl){
                let pic = [],picObj = {};
                picObj.url = this.$config.img_base_url + this.$parent.activeInfoFormData.photoUrl;
                // picObj.url = 'http://192.168.0.150:30080/res/' + this.$parent.activeInfoFormData.imgUrl;
                pic.push(picObj);
                this.uploadList = pic;
            }
        },
        methods:{
            handleBeforeUpload:function (e) {
                // console.log(this.$refs.upload.fileList)
            },
            handleOnProgress:function (event, file, fileList) {

            },
            handleSuccess:function (res, file) {

            },
            handleRemove (file) {

            },
        }
    }
</script>
<style>
  .demo-upload-list{
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
  .demo-upload-list img{
    width: 100%;
    height: 100%;
  }
  .demo-upload-list-cover{
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,.6);
  }
  .demo-upload-list:hover .demo-upload-list-cover{
    display: block;
  }
  .demo-upload-list-cover i{
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }
</style>

