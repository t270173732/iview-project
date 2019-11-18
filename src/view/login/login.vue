<style lang="less">
    @import './login.less';
</style>

<template>
    <div class="login">
        <transition name="form-fade" mode="in-out">
            <div class="login-con">
                <Card icon="log-in" title="欢迎登录" :bordered="false">
                    <div class="form-con">
                        <Form ref="formLogin" :model="formLogin" :rules="rulesLogin"
                              @keydown.enter.native="submitForm('formLogin')">
                            <FormItem prop="userName">
                                <Input v-model="formLogin.userName" placeholder="请输入用户名">
                                <span slot="prepend">
                  <Icon :size="16" type="ios-person"></Icon>
                </span>
                                </Input>
                            </FormItem>
                            <FormItem prop="password">
                                <Input type="password" v-model="formLogin.password" placeholder="请输入密码">
                                <span slot="prepend">
                  <Icon :size="14" type="md-lock"></Icon>
                </span>
                                </Input>
                            </FormItem>
                            <FormItem>
                                <Button :loading="loading" @click="submitForm('formLogin')" type="primary" long>
                                    <span v-if="!loading">登录</span>
                                    <span v-else>登录中...</span>
                                </Button>
                                <Button @click="regist" long class="margin-top-10">
                                    <span>立即注册</span>
                                </Button>
                            </FormItem>
                        </Form>
                    </div>
                </Card>
            </div>
        </transition>

    </div>
</template>

<script>
    import Cookies from 'js-cookie'

    export default {
        data() {
            return {
                loading: false,
                formLogin: {
                    userName: '',
                    password: ''
                },
                rulesLogin: {
                    username: [
                        {required: true, message: '请输入账号', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'}
                    ]
                },
            }
        },
        created() {
            const that = this;
            that.formLogin.userName = Cookies.get('regist-user');
        },
        mounted() {
            document.title = '处方云共享平台';
            this.$store.commit('setUserType', 0);
        },
        methods: {
            submitForm(name) {
                const that = this;
                that.$refs[name].validate((valid) => {
                    if (valid) that.goLogin(); // 验证通过，前去登录
                });
            },
            async goLogin() { // 登录
                const that = this;
                that.loading = true;
                const formLogin = that.formLogin;
                // let $conf = that.$conf;
                const params = {
                    account: formLogin.userName.trim(),
                    password: formLogin.password,
                };
                // //跳过登录
                // Cookies.set('user',params.account,{ expires: twoHours});
                // Cookies.set('rememberme',params.rememberme);
                // if (params.rememberme)
                //     Cookies.set('lastlogin',params.account);
                // this.$store.commit('setAvator', '../src/assets/default-avatar.png');
                // //进入首页
                // that.$router.push({
                //     name: 'home'
                // });
                this.$post('/sys/login', params).then(res => {
                    that.loading = false;
                    if (res.code == '200') {
                        //移除选项卡缓存
                        if (localStorage.getItem('user') != params.account) {
                            this.$store.state.app.tagNavList = [];
                        }
                        localStorage.setItem('user', params.account);
                        Cookies.set('user', params.account);
                        // Cookies.set('rememberme', params.rememberme);
                        // if (params.rememberme) {
                        //     Cookies.set('lastlogin', params.account);
                        // }
                        //获取用户模块信息
                        this.$store.commit('setUserModuleList');
                        this.$store.commit('setUserName', params.account);
                        //获取用户信息
                        if (params.account != 'admin') {
                            this.$store.commit('setUserInfo', params.account);
                        }
                        //进入首页
                        that.$router.push({
                            name: 'home'
                        });
                    }
                    else {
                        if (res.msg.indexOf('过期') != -1) {
                            that.warning(res.msg);
                        } else {
                            that.error(res.msg);
                        }
                        that.loading = false;
                    }
                }).catch(err => {
                    that.loading = false;
                    that.error(err);
                });
            },
            regist() {
                this.$router.push({
                    name: 'regist-type'
                });
            }
        }
    }
</script>

<style>

</style>
