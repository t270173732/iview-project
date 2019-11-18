<style>
    @import "store-regist.css";
</style>
<template>
    <div>
        <div class="registForm">
            <div class="form-con">
                <Form ref="formRegist" :model="formRegist" :rules="rulesRegist"
                      @keydown.enter.native="submitForm('formRegist')">
                    <FormItem lable="orgName" prop="orgName" class="formItem">
                        <Input v-model="formRegist.orgName" placeholder="请填写药店名称">
                        <span slot="prepend" class="form-prepend">药店名称</span>
                        </Input>
                    </FormItem>
                    <FormItem lable="address" prop="address"  class="formItem">
                        <Input v-model="formRegist.address" placeholder="请填写药店地址">
                        <span slot="prepend" class="form-prepend">药店地址</span>
                        </Input>
                    </FormItem>
                    <FormItem lable="contacts" prop="contacts"  class="formItem">
                        <Input v-model="formRegist.contacts" placeholder="请填药店联系人">
                        <span slot="prepend" class="form-prepend">联系人</span>
                        </Input>
                    </FormItem>
                    <FormItem lable="telephone" prop="telephone"  class="formItem">
                        <Input v-model="formRegist.telephone" placeholder="请填写药店联系人电话(77777777/18888888888)">
                        <span slot="prepend" class="form-prepend">联系电话</span>
                        </Input>
                    </FormItem>
                    <FormItem lable="mobile" prop="mobile"  class="formItem">
                        <Input v-model="formRegist.mobile" placeholder="请填写常用手机号">
                        <span slot="prepend" class="form-prepend">中国&nbsp;&nbsp;+86</span>
                        </Input>
                    </FormItem>
                    <FormItem lable="verifyCode"  class="formItem">
                        <Row>
                            <Col span="16">
                                <FormItem prop="verifyCode">
                                    <Input v-model="formRegist.verifyCode" placeholder="请填写手机验证码">
                                    <span slot="prepend" class="form-prepend">手机验证码</span>
                                    </Input>
                                </FormItem>
                            </Col>
                            <Col span="7">
                                <div class="tel-code" @click="sendCode">{{codeText}}</div>
                            </Col>
                        </Row>
                    </FormItem>
                    <FormItem lable="password" prop="password"  class="formItem">
                        <Input v-model="formRegist.password" placeholder="建议使用两种或两种以上字符组合">
                        <span slot="prepend" class="form-prepend">设置密码</span>
                        </Input>
                    </FormItem>
                    <FormItem lable="pw" prop="passwdCheck"  class="formItem">
                        <Input v-model="formRegist.passwdCheck" placeholder="请再次输入密码">
                        <span slot="prepend" class="form-prepend">确认密码</span>
                        </Input>
                    </FormItem>
                    <FormItem lable="checkbox" prop="checkbox" class="text-left formItem">
                        <CheckboxGroup v-model="formRegist.checkbox">
                            <Checkbox label="agree">我已阅读并同意</Checkbox><a @click="clause">《双达科技产品注册协议和隐私条款》</a>
                        </CheckboxGroup>
                    </FormItem>
                    <FormItem>
                        <Button :loading="loading" @click="submitForm('formRegist')" type="primary" long class="regist-button">
                            <span v-if="!loading">注&nbsp;&nbsp;册</span>
                            <span v-else>注&nbsp;&nbsp;册&nbsp;&nbsp;中...</span>
                        </Button>
                    </FormItem>
                </Form>
            </div>
        </div>
        <Modal v-model="visible" width="360">
            <div style="text-align:center;padding: 15px 15px 0 15px">
                <p>内容丢失了，正在找回...</p>
            </div>
            <div slot="footer" style="text-align: center">
                <Button type="error" size="large" @click="agree">同意并继续</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    import Cookies from 'js-cookie';
    export default {
        data(){
            const validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    if (this.formRegist.passwdCheck !== '') {
                        // 对第二个密码框单独验证
                        this.$refs.formRegist.validateField('passwdCheck');
                    }
                    callback();
                }
            };
            const validatePassCheck = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请确认密码'));
                } else if (value !== this.formRegist.password) {
                    callback(new Error('两次密码不一致!'));
                } else {
                    callback();
                }
            };
            const validatePassCheckbox = (rule, value, callback) => {
                if(this.formRegist.checkbox.length == 0){
                    callback(new Error('请阅读条款!'));
                }else{
                    callback();
                }
            };
            return{
                visible:false,
                codeText:'发送验证码',
                timer:null,
                loading:false,
                formRegist: {
                    orgName: '',
                    address: '',
                    contacts:'',
                    telephone:'',
                    mobile:'',
                    verifyCode:'',
                    password:'',
                    passwdCheck:'',
                    checkbox:[]
                },
                rulesRegist: {
                    orgName: [
                        {required: true, message: '请输入药店名称', trigger: 'blur'},
                        { type: 'string', max: 50, message: '最长50字', trigger: 'blur' }
                    ],
                    address: [
                        {required: true, message: '请输入药店地址', trigger: 'blur'},
                        { type: 'string', max: 100, message: '最长100字', trigger: 'blur' }
                    ],
                    contacts: [
                        {required: true, message: '请输入药店联系人', trigger: 'blur'},
                        { type: 'string', max: 20, message: '最长20字', trigger: 'blur' }
                    ],
                    telephone: [
                        {required: true, message: '请输入药店联系人电话', trigger: 'blur'},
                        {type: 'number', message: '请正确填写联系电话', trigger: 'blur', transform(value){
                                if (!(/^((\d{7,8})|(1[3584679]\d{9}))$/.test(value))) {
                                    return false
                                }else{
                                    return Number(value)
                                }
                            }}
                    ],
                    mobile: [
                        {required: true, message: '请输入常用手机', trigger: 'blur'},
                        {type: 'number', message: '请正确填写手机号', trigger: 'blur', transform(value){
                                if (!(/^1[34578]\d{9}$/.test(value))) {
                                    return false
                                }else{
                                    return Number(value)
                                }
                            }}
                    ],
                    verifyCode: [
                        {required: true, message: '请输入手机验证码', trigger: 'blur'}
                    ],
                    password: [
                        { validator: validatePass, trigger: 'blur' }
                    ],
                    passwdCheck: [
                        { validator: validatePassCheck, trigger: 'blur' }
                    ],
                    checkbox: [
                        { validator: validatePassCheckbox, trigger: 'change' }
                    ],
                },
            }
        },
        mounted(){

        },
        methods:{
            sendCode(){
                let num = 60,that = this,url;
                if(!this.formRegist.mobile || !(/^1[34578]\d{9}$/.test(this.formRegist.mobile))){
                    return;
                }
                url = '/biz/smsVerify/sendNewVerifyCode?mobile='+this.formRegist.mobile+'&verifyType=1';
                this.$post(url).then(res => {
                    if (res.code == '200') {

                    }
                    else {
                        this.warn(res.msg);
                    }
                }).catch(err => {
                    that.error(err);
                });
                this.timer = setInterval(function () {
                    num--;
                    if(num == 0){
                        clearInterval(that.timer);
                        that.codeText = '重新发送';
                    }else{
                        that.codeText = '发送中'+ num +'s';
                    }
                },1000);

            },
            submitForm(name) {
                const that = this;
                that.$refs[name].validate((valid) => {
                    if (valid) that.goRegist(); // 验证通过，前去注册
                });
                // that.goRegist()
            },
            async goRegist(){
                const that = this;
                let params = this.formRegist;
                that.loading = true;
                that.$post('/biz/bdOrgDrugstore/registerDrugStore', params).then(res => {
                    if (res.code == '200') {
                        Cookies.set('regist-user', res.data.account);
                        that.$router.push({
                            name: 'regist-success'
                        });
                    }
                    else {
                        that.warn(res.msg);
                        that.loading = false;
                    }
                }).catch(err => {
                    that.loading = false;
                    that.error(err);
                });
                // this.$router.push({
                //     name: 'regist-success'
                // });
            },
            clause(){
                this.visible = true;
            },
            agree(){
                this.visible = false;
                this.formRegist.checkbox = ['agree'];
                this.$refs.formRegist.validateField('checkbox');
            }
        }
    }
</script>