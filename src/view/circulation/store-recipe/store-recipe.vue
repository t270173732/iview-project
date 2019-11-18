<style lang="less">
    @import "../../../styles/common.less";
    @import "../order/order.css";
    .authContainer {
        position: relative;

        .authIcon {
            width: 183px;
            height: 96px;
            background: url('../../../assets/images/pass.png') no-repeat 100% 100%;
            position: absolute;
            top: 0;
            right: 60px;
        }

        .problemCard {
            position: relative;
            overflow: hidden;

            .rightIcon {
                position: absolute;
                background-color: grey;
                color: #fff;
                font-size: 16px;
                text-align: center;
                padding: 5px 40px;
                transform: rotate(45deg);
                right: -30px
            }
        }
    }
</style>
<template>
    <div>
        <Card dis-hover>
            <Row>
                <Searchpanel ref="searchPanel">
                    <div slot="form" class="margin-bottom-3" id="searchForm">
                    </div>
                    <div slot="control">
                        <Button type="primary" @click="search">查询</Button>
                        <Button @click="resetSearch" class="margin-left-5">重置</Button>
                    </div>
                </Searchpanel>
            </Row>
            <Row class="margin-top-10">
                <div id="recipeGrid"></div>
            </Row>
            <Drawer :closable="false" width="700" v-model="visible">
                <Button @click="print">处方打印</Button>
                <!--<h1 class="recipe-title">{{recipeInfo.title}}</h1>-->
                <table class="recipe" ref="print">
                    <tr>
                        <th colspan="5" class="recipe-title">{{recipeInfo.title}}</th>
                    </tr>
                    <tr>
                        <td colspan="3">NO：{{recipeInfo.code}}</td>
                        <td colspan="2" style="text-align: right">取药联  √</td>
                    </tr>
                    <tr>
                        <td>姓名：{{recipeInfo.patientName}}</td>
                        <td>性别：{{recipeInfo.sex}}</td>
                        <td>年龄：{{recipeInfo.age}}</td>
                        <td>科室：{{recipeInfo.dept}}</td>
                        <td>门诊号：{{recipeInfo.clinicNo}}</td>
                    </tr>
                    <tr>
                        <td colspan="3">费别：{{recipeInfo.feeType}}</td>
                        <td colspan="2" style="text-align: right">{{recipeInfo.recipeData}}</td>
                    </tr>
                    <tr>
                        <td colspan="5">临床诊断：{{recipeInfo.diag}}</td>
                    </tr>
                    <tr>
                        <td colspan="5">
                            <h1 class="recipe-text-bold">R:</h1>
                            <template v-for="(item,index) in recipeInfo.info">
                                <p class="recipe-text">{{index+1}}、{{item.name}}&nbsp;&nbsp;&nbsp;{{item.spec}}&nbsp;&nbsp;&nbsp;{{item.eachDose}}</p>
                                <p class="recipe-text">{{item.freq}}</p>
                            </template>
                        </td>
                    </tr>
                    <tr>
                        <td>医师：{{recipeInfo.doctorName}}</td>
                        <td colspan="2">审核、调配：{{recipeInfo.author}}</td>
                        <td colspan="2">核对、发药：{{recipeInfo.deliver}}</td>
                    </tr>
                </table>
                <div class="margin-top-10" v-if="steps.length">
                    <!--<Steps :current="current">-->
                    <!--<Step v-for="item in stepData" :title='item.title' :content='item.content'></Step>-->
                    <!--</Steps>-->
                    <Steps :current="current">
                        <Step :title=item.title v-for="(item,index) in steps" :key="index">
                            <p class="ivu-steps-content">{{item.time}}</p>
                            <p class="ivu-steps-content">{{item.org}}</p>
                            <p class="ivu-steps-content">{{item.name}}</p>
                        </Step>
                    </Steps>
                </div>
            </Drawer>

            <Drawer :closable="false" width="700" v-model="authVisible">
                <div class="authContainer">
                    <div class="authIcon"></div>
                    <Row>
                        <Col span="6"><span class="txtBlod">处方号：</span>1015030101</Col>
                        <Col span="6"><span class="txtBlod">开单科室：</span>普通内科门诊</Col>
                        <Col span="6"><span class="txtBlod">开单医生：</span>汪志红</Col>
                        <Col span="6"><span class="txtBlod">时间：</span>2019-08-30 09-12</Col>
                    </Row>
                    <Row>
                        <Col span="6"><span class="txtBlod">审核状态：</span>通过</Col>
                        <Col span="6"><span class="txtBlod">审核人：</span>李启富</Col>
                        <Col span="12"><span class="txtBlod">审核时间：</span>2019-10-24 14:32</Col>
                    </Row>
                    <Row>
                        <span class="txtBlod">审核意见：</span>通过
                    </Row>
                    <Row class="margin-top-10">
                        <h3>问题描述：<Tag color="#4354A2" class="margin-left-5">3级</Tag><Tag color="primary" class="margin-left-5">全部</Tag></h3>
                    </Row>
                    <div style="width: 100%">
                        <Card dis-hover v-for="(item,index) in listData" :key="index" class="margin-top-10 problemCard">
                            <div class="rightIcon">已审核</div>
                            <Row>
                                <Tag color="#4354A2">3级</Tag>
                                <span class="margin-left-5" style="font-size: 16px;font-weight: bold">药品与给药途径匹配</span>
                                <span class="margin-left-5">盐酸碱片(赤峰蒙欣药业)40mg*7</span>
                            </Row>
                            <Row class="margin-top-10">
                                <Tag>问题</Tag>
                                <span class="margin-left-5">给药途径不适合</span>
                            </Row>
                            <Row>
                                <Tag>描述</Tag>
                                <span class="margin-left-5">本品宜【吞服】给药。</span>
                            </Row>
                        </Card>
                        <div style="text-align: center;width: 100%" v-if="listData.length <= 3" class="margin-top-10">
                            <a style="color: #4354A2;" @click="checkMore"> >>查看更多 </a>
                        </div>
                        <div style="text-align: center;width: 100%" v-else class="margin-top-10">
                            <a style="color: #4354A2;" @click="checkReset"> 收起 </a>
                        </div>
                    </div>
                </div>
            </Drawer>
        </Card>
    </div>
</template>
<script>
    import Vue from 'vue';
    import PrinWebPlugin from '@/libs/printWebPlugin'
    let recipe_grid_data_url = '/biz/bizRecipe/getRecipePage';
    let recipe_detail_url = '/biz/bizRecipe/getRecipeDetails';
    export default {
        data(){
            return{
                current:1,
                recipeInfo:{
                    code:'1802071800',patientName:'谢正友',sex:'男',age:'55岁',dept:'消化内科',
                    clicicNo:'180109288',feeType:'医保  新农合  公费  工伤  自费  其他',
                    diag:'胃炎',recipeData:'2018年05月03日',title:'陆军军医大学第一附属医院处方签',
                    info:[
                        {name:'异烟肼片',spec:'0.1 GM*100',eachDose:'7粒',freq:'用法：0.1g  每天一次  口服'},
                        {name:'异烟肼片',spec:'0.1 GM*100',eachDose:'7粒',freq:'用法：0.1g  每天一次  口服'},
                        {name:'异烟肼片',spec:'0.1 GM*100',eachDose:'7粒',freq:'用法：0.1g  每天一次  口服'},
                        {name:'异烟肼片',spec:'0.1 GM*100',eachDose:'7粒',freq:'用法：0.1g  每天一次  口服'},
                    ],
                },
                steps:[],
                visible:false,
                isLoadData:true,
                searchForm:{},
                searchFormData:{},
                recipeGridData: new this.customstore({
                    load: (loadOptions) => {
                        return this.CommDs.loadPage(loadOptions, recipe_grid_data_url, this.isLoadData, {});
                    },
                }),
                authVisible:false,
                problemList:[{},{},{},{},{}],
                listData:[]
            }
        },
        mounted(){
            this.searchForm = $('#searchForm').dxForm({
                colCount: 4,
                formData: this.searchFormData,
                items: [
                    {
                        dataField: 'orgName',
                        label: {
                            alignment: 'right',
                            text: '处方来源'
                        },
                        editorOptions:{
                            placeholder:'输入医院名称查询'
                        }
                    },
                    {
                        dataField: 'recipeDate',
                        label: {
                            alignment: 'right',
                            text: '时间范围'
                        },
                        template: this.addDateRange,
                    },
                    {
                        dataField: 'code',
                        label: {
                            alignment: 'right',
                            text: '处方号'
                        },
                        editorOptions:{
                            placeholder:'输入处方号查询'
                        }
                    },
                    {
                        dataField: 'patientName',
                        label: {
                            alignment: 'right',
                            text: '姓名'
                        },
                        editorOptions:{
                            placeholder:'输入姓名查询'
                        }
                    },
                    {
                        dataField: 'patientType',
                        editorType: 'dxSelectBox',
                        label: {
                            alignment: 'right',
                            text: '患者类型'
                        },
                        editorOptions: {
                            dataSource: this.enum.patientType,
                            displayExpr: 'text',
                            valueExpr: 'id',
                        },
                    },
                    {
                        dataField: 'status',
                        editorType: 'dxSelectBox',
                        label: {
                            alignment: 'right',
                            text: '状态'
                        },
                        editorOptions: {
                            dataSource: this.enum.recipeStatus,
                            displayExpr: 'text',
                            valueExpr: 'id',
                        },
                    },
                    {
                        dataField: 'print',
                        editorType: 'dxSelectBox',
                        label: {
                            alignment: 'right',
                            text: '打印状态'
                        },
                        editorOptions: {
                            dataSource: this.enum.printStatus,
                            displayExpr: 'text',
                            valueExpr: 'id',
                        },
                    },
                ]
            }).dxForm('instance');

            this.recipeGrid = $("#recipeGrid").dxDataGrid({
                showRowLines: true,
                showBorders: true,
                allowColumnReordering: true,
                allowColumnResizing: true,
                columnAutoWidth: true,
                columnFixing: {
                    enabled: true
                },
                selection: {
                    mode: "single"
                },
                hoverStateEnabled: true,
                dataSource: {
                    store: this.recipeGridData
                },
                remoteOperations: {
                    sorting: true,
                    paging: true
                },
                paging: {
                    pageSize: 10
                },
                columns: [
                    {
                        caption: "处方号",
                        dataField: "code",
                        width: 100,
                        cellTemplate: (container, options) => {
                            container.append("<div id='b'/>");
                            let opcol = new (Vue.component('OpCol'));
                            opcol.items = [
                                { text: options.data.code, showtip: false, id: options.data, click:this.recipeDetail},
                            ];
                            opcol.$mount('#b');
                        }
                    },
                    {
                        caption: "姓名",
                        dataField: "patientName",
                        allowSorting: false,
                    },
                    {
                        caption: "处方来源",
                        dataField: "orgName",
                        allowSorting: false,
                    },
                    {
                        caption: "开单时间",
                        dataField: "recipeDate",
                        width: 150
                    },
                    {
                        caption: "患者类型",
                        alignment: "center",
                        dataField: "patientType",
                        allowSorting: false,
                        lookup: {
                            dataSource: this.enum.patientType,
                            displayExpr: 'text',
                            valueExpr: 'id'
                        },
                        width: 100
                    },
                    {
                        caption: "取药方式",
                        alignment: "center",
                        dataField: "dispatchType",
                        allowSorting: false,
                        lookup: {
                            dataSource: this.enum.dispatchType,
                            displayExpr: 'text',
                            valueExpr: 'id'
                        },
                        width: 100
                    },
                    {
                        caption: "审方结果",
                        alignment: "center",
                        allowSorting: false,
                        width: 100,
                        cellTemplate: (container, options) => {
                            container.append("<div id='c'/>");
                            let opcol = new (Vue.component('OpCol'));
                            opcol.items = [
                                { text: '通过', showtip: false, id: options.data, click:this.authDetail},
                            ];
                            opcol.$mount('#c');
                        }
                    },
                    {
                        caption: "状态",
                        alignment: "center",
                        dataField: "status",
                        allowSorting: false,
                        lookup: {
                            dataSource: this.enum.recipeStatus,
                            displayExpr: 'text',
                            valueExpr: 'id'
                        },
                        width: 100
                    },
                    {
                        caption: "打印次数",
                        dataField: "printNum",
                        width: 100,
                        calculateCellValue: function (rowData) {
                            if(!rowData.printNum && rowData.printNum != 0){
                                return ''
                            }else if(rowData.printNum == 0){
                                return  '0次';
                            }else{
                                return  rowData.printNum+'次';
                            }
                        },
                    },
                ]
            }).dxDataGrid("instance");
        },
        methods:{
            search(){
                let ds = this.recipeGrid.getDataSource();
                ds.loadOptions().searchData = this.searchFormData;
                ds.reload();
            },
            resetSearch(){
                this.$refs.creatTimeData.values = [];
                this.searchFormData.recipeDate = [];
                this.searchForm.resetValues();
                this.recipeGrid.refresh();
            },
            recipeDetail(data){
                this.steps = [];
                this.$put(recipe_detail_url, {recipeIds:[data.id]}).then(res => {
                    if (res.code == '200') {
                        this.recipeInfo = res.rows[0];
                        this.recipeInfo.title = res.rows[0].orgName+'处方签';
                        this.recipeInfo.info = [];
                        for(let i=0; i<res.rows[0].bizRecipeDetails.length; i++){
                            let info = {};
                            info.name = res.rows[0].bizRecipeDetails[i].name;
                            info.spec = res.rows[0].bizRecipeDetails[i].spec;
                            info.eachDose = res.rows[0].bizRecipeDetails[i].eachDose;
                            info.freq = res.rows[0].bizRecipeDetails[i].freq;
                            this.recipeInfo.info.push(info)
                        }
                        if(res.rows[0].status == 0){
                            this.steps = [
                                {title:'处方下达',time:res.rows[0].recipeDate,org:res.rows[0].orgName,name:res.rows[0].doctorName},
                            ];
                            this.current = 0
                        }else if(res.rows[0].status == 1){
                            this.steps = [
                                {title:'处方下达',time:res.rows[0].recipeDate,org:res.rows[0].orgName,name:res.rows[0].doctorName},
                                {title:'处方审核',time:res.rows[0].authTime,org:res.rows[0].authOrg,name:res.rows[0].author},
                            ];
                            this.current = 1
                        }else if(res.rows[0].status == 2){
                            this.steps = [
                                {title:'处方下达',time:res.rows[0].recipeDate,org:res.rows[0].orgName,name:res.rows[0].doctorName},
                                {title:'处方审核',time:res.rows[0].authTime,org:res.rows[0].authOrg,name:res.rows[0].author},
                                {title:'处方下单',time:res.rows[0].payTime,org:res.rows[0].drugStoreName,name:res.rows[0].payMan},
                                {title:'处方发药',time:res.rows[0].deliverTime,org:res.rows[0].drugStoreName,name:res.rows[0].deliver},
                            ];
                            this.current = 3
                        }else if(res.rows[0].status == 3){
                            this.steps = [
                                {title:'处方下达',time:res.rows[0].recipeDate,org:res.rows[0].orgName,name:res.rows[0].doctorName},
                                {title:'处方审核',time:res.rows[0].authTime,org:res.rows[0].authOrg,name:res.rows[0].author},
                                {title:'处方下单',time:res.rows[0].payTime,org:res.rows[0].drugStoreName,name:res.rows[0].payMan},
                                {title:'处方发药',time:res.rows[0].deliverTime,org:res.rows[0].drugStoreName,name:res.rows[0].deliverName},
                                {title:'退药',time:res.rows[0].returnFinishTime,org:res.rows[0].drugStoreName,name:res.rows[0].returnAcceptor},
                            ];
                            this.current = 4
                        }else if(res.rows[0].status == 5){
                            this.steps = [
                                {title:'处方下达',time:res.rows[0].recipeDate,org:res.rows[0].orgName,name:res.rows[0].doctorName},
                                {title:'处方审核',time:res.rows[0].authTime,org:res.rows[0].authOrg,name:res.rows[0].author},
                                {title:'处方下单',time:res.rows[0].payTime,org:res.rows[0].drugStoreName,name:res.rows[0].payMan},
                            ];
                            this.current = 2
                        }else if(res.rows[0].status == 5){
                            this.steps = [
                                {title:'处方下达',time:res.rows[0].recipeDate,org:res.rows[0].orgName,name:res.rows[0].doctorName},
                                {title:'处方审核',time:res.rows[0].authTime,org:res.rows[0].authOrg,name:res.rows[0].author},
                                {title:'处方失效',time:res.rows[0].expiryDate,org:'',name:''},
                            ];
                            this.current = 2
                        }
                        this.visible = true
                    } else {
                        this.warn(res.msg);
                    }
                }).catch(err => {
                    this.error(err);
                });
            },
            authDetail(data){
                this.listData = this.problemList.slice(0,3);
                this.authVisible = true;
            },
            checkMore(){
                this.listData = this.problemList ;
            },
            checkReset(){
                this.listData = this.problemList.slice(0,3);
            },
            addDateRange: function (data, itemElement) {
                itemElement.append('<div id=\'date-range\'/>');
                let dateRange = new (Vue.component('DateRange'));
                dateRange.field = data;
                dateRange.$mount('#date-range');
                dateRange.$parent = this;
                this.$refs.creatTimeData = dateRange;
            },
            print() {
                // let newstr = $(".recipe").html(),
                //     oldstr = $('body').html();
                // $('body').html(newstr);
                // window.print();
                // window.location.reload();
                // $('body').html(oldstr);
                // return false;
                this.$print(this.$refs.print)
            },
        }
    }
</script>