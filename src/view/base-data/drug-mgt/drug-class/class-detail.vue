<template>
    <div>
        <Card dis-hover>
            <div slot="title" class="cardHead">
                <a href="#" @click.prevent="cancle">
                    <Icon type="ios-arrow-back" />
                    返回
                </a>
            </div>
            <!--<p slot="extra" >-->
                <!--<Button type="primary" @click="submit" :loading="modal_loading">保存</Button>-->
                <!--<Button class="margin-left-5" @click="cancle">取消</Button>-->
            <!--</p>-->
            <Row class="margin-top-10">
                <Col :span="6" offset="9">
                    <div id="classForm"></div>
                </Col>
            </Row>
            <Row class="margin-top-10">
                <Col :span="6" offset="11">
                    <!--<Button class="margin-left-5" type="text" @click="submit('c')" :loading="modal_loading">保存并继续</Button>-->
                    <Button class="margin-left-5" type="primary" @click="submit('s')" :loading="modal_loading">保存</Button>
                </Col>
            </Row>
        </Card>
    </div>
</template>
<script>
    import {codefans_net_CC2PY, word_wubi} from '@/libs/util.js';
    let class_byKey_url = '/biz/bdDrugClass/read/detail';
    let parent_class_list_url = '/biz/bdDrugClass/read/drugClassListParentStart';
    let class_insert_url = '/biz/bdDrugClass/update';
    export default {
        data(){
            return{
                classForm:{},
                classFormData:{},
                modal_loading:false,
                parentClassData:new this.customstore({
                    key: "id",
                    loadMode: "raw",
                    byKey: (key) => {
                        return this.CommDs.loadByKey(class_byKey_url, { id: key });
                    },
                    load: (e) => {
                        return this.CommDs.loadList(parent_class_list_url);
                    }
                }),
            }
        },
        mounted() {
            this.classForm = $('#classForm').dxForm({
                colCount: 1,
                formData: this.classFormData,
                items: [
                    {
                        dataField: 'code',
                        label: {
                            alignment: 'right',
                            text: '编码'
                        },
                        editorOptions:{
                            placeholder:'<系统自动分配>',
                            disabled:true
                        }
                    },
                    {
                        dataField: 'parentId',
                        editorType: 'dxSelectBox',
                        label: {
                            alignment: 'right',
                            text: '父级分类'
                        },
                        editorOptions:{
                            dataSource:this.parentClassData,
                            displayExpr:'name',
                            valueExpr:'id',
                            searchEnabled:true,
                            searchExpr:'name',
                            searchMode:'contains'
                        },
                    },
                    {
                        dataField: 'name',
                        label: {
                            alignment: 'right',
                            text: '名称'
                        },
                        editorOptions:{
                            placeholder:'输入药品分类名称',
                            maxLength:50,
                            onValueChanged:(e)=>{
                                if(e.value){
                                    this.classForm.updateData('simpleCode',codefans_net_CC2PY($.trim(e.value)))
                                }
                            }
                        },
                        validationRules: [{
                            type: "required",
                            message: "请输入药品分类名称"
                        }]
                    },
                    {
                        dataField: 'simpleCode',
                        label: {
                            alignment: 'right',
                            text: '简码'
                        },
                        editorOptions:{
                            placeholder:'根据药品分类名称生成拼音简码',
                            maxLength:50,
                            readOnly:true
                        }
                    },
                    {
                        dataField: 'type',
                        editorType: 'dxSelectBox',
                        label: {
                            alignment: 'right',
                            text: '类别'
                        },
                        editorOptions: {
                            dataSource: this.enum.drugClass,
                            displayExpr: 'text',
                            valueExpr: 'id',
                        },
                        validationRules: [{
                            type: "required",
                            message: "请选择药品类别"
                        }]
                    },
                ]
            }).dxForm('instance');
            this.init();
        },
        methods:{
            cancle(){
                this.$router.push({
                    name:'class-index',
                })
            },
            init(){
                if(this.$route.params.id == 0){
                    this.classFormData = {};
                    this.classFormData.status = 1;
                    this.classFormData.type = 1;
                    this.classForm.option("formData",this.classFormData);
                }else{
                    let params = {};
                    params.id = Number(this.$route.params.id);
                    this.$put(class_byKey_url,params).then(res => {
                        if(res.code=='200')
                        {
                            this.classFormData = res.data;
                            this.classForm.itemOption('code','editorOptions',{readOnly:true});
                            this.classForm.option("formData",this.classFormData);
                        }
                        else {

                        }
                    }).catch(err=>
                    {
                        this.err(err)
                        // console.log(err)
                    });
                }
            },
            submit(val){
                let params = {};
                this.modal_loading = true;
                if (!this.classForm.validate().isValid) {
                    this.modal_loading = false;
                    return;
                }
                params = this.classFormData;
                this.$post(class_insert_url, params).then(res => {
                    if (res.code == '200') {
                        this.success('保存成功!', () => {
                            if(val == 'c'){
                                this.classForm.option("formData",{status:1,type:1});
                            }else if(val == 's'){
                                this.cancle();
                            }
                            this.modal_loading = false;
                        });
                    }
                    else {
                        this.modal_loading = false;
                        this.warn(res.msg);
                    }
                }).catch(err => {
                    this.modal_loading = false;
                    this.error(err);
                });
            }
        }
    }
</script>