<style>
    @import "index.css";
</style>
<template>
    <div>
        <div class="succ-outer">
            <h1>恭喜您，注册成功</h1>
            <h2 class="margin-top-10">您的登录账号为{{account}}</h2>
            <h3 class="margin-top-10">请登陆完善药店信息</h3>
            <Button type="primary" long class="margin-top-10 succ-btn" @click="toLogin">去&nbsp;登&nbsp;陆</Button>
        </div>
    </div>
</template>
<script>
    import Cookies from 'js-cookie';
    export default {
        data(){
            return{
                account:''
            }
        },
        created () {
            const that = this;
            that.account = Cookies.get('regist-user');
        },
        mounted(){

        },
        methods:{
            toLogin(){
                this.$router.push({
                    name: 'login'
                });
            }
        }
    }
</script>