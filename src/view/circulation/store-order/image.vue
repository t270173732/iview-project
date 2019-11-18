<style lang="less">
    @import "../../../styles/common.less";
</style>
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
                visible:false,
                uploadList: [],
                imageFile: [],
            };
        },
        mounted() {
            if(this.$parent.orderFormData.fileImg && this.$parent.orderFormData.fileImg.length != 0) {
                for (let i=0; i<this.$parent.orderFormData.fileImg.length; i++){
                    let bdOrgPicVO = {};
                    bdOrgPicVO.url = this.$config.img_base_url + this.$parent.orderFormData.fileImg[i];
                    this.uploadList.push(bdOrgPicVO);
                }
            }
        },
        methods: {
            handleView(){
                this.visible = true
            }
        }
    };
</script>

