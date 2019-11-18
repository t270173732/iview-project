<style lang="less">
    @import "../../../../styles/common.less";
</style>
<template>
    <div>
        <Card dis-hover>
            <div slot="title" class="cardHead">
                <a href="#" @click.prevent="cancle">
                    <Icon type="ios-arrow-back" />
                    返回
                </a>
            </div>
            <p slot="extra" >
                <Button type="primary" @click="submit('y')" :loading="modal_loading" :disabled="auditBtn">保存</Button>
                <Button class="margin-left-5" @click="submit('n')" :disabled="auditBtn">取消</Button>
            </p>
            <Row class="margin-top-10">
                <div id="supplier-info"></div>
            </Row>
        </Card>
    </div>
</template>
<script>
    import Vue from 'vue';
    import Image from './image';
    import SupplierImage from './supplierImage';
    import GspImage from './gspImage';
    import LogoImage from './logoImg';
    let supplier_detail_url = '/biz/bdOrgSupply/read/detail';
    let supplier_audit_url = '/biz/bdOrgSupply/authSupply';
    export default {
        data(){
            return{
                auditBtn:true,
                supplierForm:{},
                supplierFormData:{},
                modal_loading:false
            }
        },
        mounted(){
            this.supplierForm = $("#supplier-info").dxForm({
                colCount:1,
                formData:this.supplierFormData,
                items:[
                    {
                        itemType: 'group',
                        caption: '基础信息',
                        colCount: 4,
                        name:"baseInfo",
                        items:[
                            {
                                dataField: "orgCode",
                                label: {
                                    alignment: "right",
                                    text: "供应商编码"
                                },
                                editorOptions: {
                                    readOnly:true,
                                },
                            },
                            {
                                dataField: "orgName",
                                label: {
                                    alignment: "right",
                                    text: "供应商名称"
                                },
                                editorOptions: {
                                    readOnly:true,
                                },
                            },
                            {
                                dataField: "simpleCode",
                                label: {
                                    alignment: "right",
                                    text: "简码"
                                },
                                editorOptions: {
                                    readOnly:true,
                                },
                            },
                            {
                                dataField: "simpleName",
                                label: {
                                    alignment: "right",
                                    text: "供应商简称"
                                },
                                editorOptions: {
                                    readOnly:true,
                                },
                            },
                            {
                                dataField: "nature",
                                label: {
                                    alignment: "right",
                                    text: "企业性质"
                                },
                                editorOptions: {
                                    readOnly:true,
                                },
                            },
                            {
                                dataField: "contacts",
                                label: {
                                    alignment: "right",
                                    text: "联系人"
                                },
                                editorOptions: {
                                    readOnly:true,
                                },
                            },
                            {
                                dataField: "telephone",
                                label: {
                                    alignment: "right",
                                    text: "联系电话"
                                },
                                editorOptions: {
                                    readOnly:true,
                                },
                            },
                            {
                                dataField: "address",
                                label: {
                                    alignment: "right",
                                    text: "地址"
                                },
                                editorOptions: {
                                    readOnly:true,
                                },
                            },
                            {
                                dataField: "bank",
                                label: {
                                    alignment: "right",
                                    text: "开户银行"
                                },
                                editorOptions: {
                                    readOnly:true,
                                },
                            },
                            {
                                dataField: "account",
                                label: {
                                    alignment: "right",
                                    text: "账号"
                                },
                                editorOptions: {
                                    readOnly:true,
                                },
                            },
                            {
                                dataField: "status",
                                editorType:'dxSelectBox',
                                label: {
                                    alignment: "right",
                                    text: "状态"
                                },
                                editorOptions:{
                                    dataSource:this.enum.status,
                                    displayExpr:'text',
                                    valueExpr:'id',
                                    readOnly:true
                                }
                            },
                            {
                                itemType:'empty',
                            },
                            {
                                dataField: "remark",
                                colSpan: 4,
                                editorType: "dxTextArea",
                                editorOptions: {
                                    readOnly:true,
                                },
                                label: {
                                    alignment: "right",
                                    text: "备注"
                                },
                            },
                            {
                                dataField: "logoImg",
                                colSpan:4,
                                label: {
                                    alignment: "right",
                                    text: "机构图标"
                                },
                                template: (data, itemElement)=>{
                                    itemElement.append("<div id='addLogo'/>");
                                }
                            },
                        ]
                    },
                    {
                        itemType: 'group',
                        caption: '供应商营业执照',
                        colCount: 4,
                        name:"license",
                        visible:true,
                        items:[
                            {
                                dataField: "blName",
                                label: {
                                    alignment: "right",
                                    text: "名称"
                                },
                                editorOptions: {
                                    readOnly:true,
                                },
                            },
                            {
                                dataField: "blType",
                                label: {
                                    alignment: "right",
                                    text: "类型"
                                },
                                editorOptions: {
                                    readOnly:true,
                                },
                            },
                            {
                                dataField: "blAddr",
                                label: {
                                    alignment: "right",
                                    text: "住所"
                                },
                                editorOptions: {
                                    readOnly:true,
                                },
                            },
                            {
                                dataField: "blRegistCapital",
                                label: {
                                    alignment: "right",
                                    text: "注册资金"
                                },
                                editorOptions: {
                                    readOnly:true,
                                },
                            },
                            {
                                dataField: "blFundingTime",
                                label: {
                                    alignment: "right",
                                    text: "成立日期"
                                },
                                editorOptions: {
                                    readOnly:true,
                                },
                            },
                            {
                                dataField: "blBizLimit",
                                label: {
                                    alignment: "right",
                                    text: "经营期限"
                                },
                                editorOptions: {
                                    readOnly:true,
                                },
                            },
                            {
                                dataField: "blBizScope",
                                label: {
                                    alignment: "right",
                                    text: "经营范围"
                                },
                                editorOptions: {
                                    readOnly:true,
                                },
                            },
                            {
                                dataField: "blPerson",
                                label: {
                                    alignment: "right",
                                    text: "法定代表人"
                                },
                                editorOptions: {
                                    readOnly:true,
                                },
                            },
                            {
                                dataField: "",
                                label: {
                                    alignment: "right",
                                    text: "登记日期"
                                },
                                editorOptions: {
                                    readOnly:true,
                                },
                            },
                            {
                                dataField: "",
                                label: {
                                    alignment: "right",
                                    text: "登记机关"
                                },
                                editorOptions: {
                                    readOnly:true,
                                },
                            },
                            {itemType:'empty'},
                            {itemType:'empty'},
                            {
                                dataField: "blImg",
                                colSpan:4,
                                label: {
                                    alignment: "right",
                                    text: "资质上传"
                                },
                                template: (data, itemElement)=>{
                                    itemElement.append("<div id='blImg'/>");
                                }
                            },
                        ]
                    },
                    {
                        itemType: 'group',
                        caption: '供应商经营许可证',
                        colCount: 4,
                        name:"supplierLicense",
                        visible:true,
                        items:[
                            {
                                dataField: "dblName",
                                label: {
                                    alignment: "right",
                                    text: "企业名称"
                                },
                                editorOptions: {
                                    readOnly:true,
                                },
                            },
                            {
                                dataField: "dblAddr",
                                label: {
                                    alignment: "right",
                                    text: "注册地址"
                                },
                                editorOptions: {
                                    readOnly:true,
                                },
                            },
                            {
                                dataField: "dblPerson",
                                label: {
                                    alignment: "right",
                                    text: "法定代表人"
                                },
                                editorOptions: {
                                    readOnly:true,
                                },
                            },
                            {
                                dataField: "dblPrincipal",
                                label: {
                                    alignment: "right",
                                    text: "企业负责人"
                                },
                                editorOptions: {
                                    readOnly:true,
                                },
                            },
                            {
                                dataField: "dblQuaPrincipal",
                                label: {
                                    alignment: "right",
                                    text: "质量负责人"
                                },
                                editorOptions: {
                                    readOnly:true,
                                },
                            },
                            {
                                dataField: "dblStoreAddr",
                                label: {
                                    alignment: "right",
                                    text: "仓库地址"
                                },
                                editorOptions: {
                                    readOnly:true,
                                },
                            },
                            {
                                dataField: "dblNo",
                                label: {
                                    alignment: "right",
                                    text: "证号"
                                },
                                editorOptions: {
                                    readOnly:true,
                                },
                            },
                            {
                                dataField: "dblBizMode",
                                label: {
                                    alignment: "right",
                                    text: "经营方式"
                                },
                                editorOptions: {
                                    readOnly:true,
                                },
                            },
                            {
                                dataField: "dblBizScope",
                                label: {
                                    alignment: "right",
                                    text: "经营范围"
                                },
                                editorOptions: {
                                    readOnly:true,
                                },
                            },
                            {
                                dataField: "dblValidTime",
                                label: {
                                    alignment: "right",
                                    text: "有效期至"
                                },
                                editorOptions: {
                                    readOnly:true,
                                },
                            },
                            {
                                dataField: "dblLicenseOrg",
                                label: {
                                    alignment: "right",
                                    text: "发证机关"
                                },
                                editorOptions: {
                                    readOnly:true,
                                },
                            },
                            {
                                dataField: "dblLicenseTime",
                                label: {
                                    alignment: "right",
                                    text: "发证日期"
                                },
                                editorOptions: {
                                    readOnly:true,
                                },
                            },
                            {
                                dataField: "",
                                label: {
                                    alignment: "right",
                                    text: "批发"
                                },
                                editorOptions: {
                                    readOnly:true,
                                },
                            },
                            {itemType:'empty'},
                            {itemType:'empty'},
                            {itemType:'empty'},
                            {
                                dataField: "dblImg",
                                colSpan:4,
                                label: {
                                    alignment: "right",
                                    text: "资质上传"
                                },
                                template: (data, itemElement)=>{
                                    itemElement.append("<div id='uploadFile'/>");
                                }
                            },
                        ]
                    },
                    {
                        itemType: 'group',
                        caption: '供应商经营质量管理规范认证证书(GSP)',
                        colCount: 4,
                        name:"supplierGSP",
                        visible:true,
                        items:[
                            {
                                dataField: "gspName",
                                label: {
                                    alignment: "right",
                                    text: "企业名称"
                                },
                                editorOptions: {
                                    readOnly:true,
                                },
                            },
                            {
                                dataField: "gspAddr",
                                label: {
                                    alignment: "right",
                                    text: "地址"
                                },
                                editorOptions: {
                                    readOnly:true,
                                },
                            },
                            {
                                dataField: "gspScope",
                                label: {
                                    alignment: "right",
                                    text: "认证范围"
                                },
                                editorOptions: {
                                    readOnly:true,
                                },
                            },
                            {
                                dataField: "gspNo",
                                label: {
                                    alignment: "right",
                                    text: "证书编号"
                                },
                                editorOptions: {
                                    readOnly:true,
                                },
                            },
                            {
                                dataField: "gspValidTime",
                                label: {
                                    alignment: "right",
                                    text: "有效期至"
                                },
                                editorOptions: {
                                    readOnly:true,
                                },
                            },
                            {
                                dataField: "gspLicenseOrg",
                                label: {
                                    alignment: "right",
                                    text: "发证机关"
                                },
                                editorOptions: {
                                    readOnly:true,
                                },
                            },
                            {
                                dataField: "gspLicenseTime",
                                label: {
                                    alignment: "right",
                                    text: "发证日期"
                                },
                                editorOptions: {
                                    readOnly:true,
                                },
                            },
                            {
                                itemType:'empty'
                            },
                            {
                                dataField: "gspImg",
                                label: {
                                    alignment: "right",
                                    text: "资质上传"
                                },
                                template: (data, itemElement)=>{
                                    itemElement.append("<div id='gspImg'/>");
                                }
                            },
                        ]
                    }
                ]
            }).dxForm("instance");

            this.supplierInit();
        },
        methods:{
            supplierInit(){
                let params = {};
                params.id = this.$route.params.supplier_id;
                this.$put(supplier_detail_url,params).then(res => {
                    if(res.code=='200')
                    {
                        this.supplierFormData = res.data;
                        this.supplierForm.option("formData",this.supplierFormData);
                        this.auditBtn = false;
                        this.uploadLogo();
                        this.addIamgeFile();
                        this.uploadFile();
                        this.uploadGsp();
                    }
                    else {

                    }
                }).catch(err=>
                {
                    this.err(err)
                    // console.log(err)
                });
            },
            cancle(){
                this.$router.push({
                    name:'supplier-audit'
                })
            },
            submit(val){
                let params = {};
                params.id = this.supplierFormData.id;
                if(val == 'y'){
                    params.authStatus = 1;
                }else{
                    params.authStatus = 2;
                }
                this.$post(supplier_audit_url,params).then(res => {
                    if(res.code=='200'){
                        this.success('操作成功!',()=>{
                            this.$router.push({
                                name:'supplier-audit'
                            })
                        });
                    }else{
                        this.warn(res.msg);
                    }
                }).catch(err=>{
                    this.error(err);
                });
            },
            addIamgeFile() {
                var FileUpload = new Vue(Image);
                FileUpload.$parent = this;
                FileUpload.$mount('#blImg');
            },
            uploadFile() {
                var FileUpload = new Vue(SupplierImage);
                FileUpload.$parent = this;
                FileUpload.$mount('#uploadFile');
            },
            uploadGsp() {
                var FileUpload = new Vue(GspImage);
                FileUpload.$parent = this;
                FileUpload.$mount('#gspImg');
            },
            uploadLogo: function () {
                let FileUpload = new Vue(LogoImage);
                FileUpload.$parent = this;
                FileUpload.$mount('#addLogo');
            },
        }
    }
</script>
