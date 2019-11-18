<style>
    @import "regist.css";
</style>
<template>
    <div>
        <div class="registType">
            <div class="registType-store" @click="toStoreRegist"><Icon type="md-medkit"/>药店用户注册</div>
            <div class="maginLeft"><Icon type="md-car"/>供应商用户注册</div>
        </div>
    </div>
</template>
<script>
    export default {
        data(){
            return{

            }
        },
        mounted(){

        },
        methods:{
            toStoreRegist(){
                this.$router.push({
                    name: 'store-regist'
                });
            },
        }
    }
</script>