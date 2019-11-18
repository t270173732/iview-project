<template>
    <div>
        <table class="table_dm">
            <tr>
                <td class="table_dm_th" width="200px"></td>
                <td class="table_dm_th" width="200px">处方平台</td>
                <td class="table_dm_th" width="200px">重庆医保</td>
            </tr>
            <tr>
                <td class="table_dm_td">医药编码</td>
                <td class="table_dm_td bg_color"></td>
                <td class="table_dm_td" id="drugCode"></td>
            </tr>
            <tr>
                <td class="table_dm_td">通用名称</td>
                <td class="table_dm_td bg_color"></td>
                <td class="table_dm_td"></td>
            </tr>
            <tr>
                <td class="table_dm_td">剂型</td>
                <td class="table_dm_td bg_color"></td>
                <td class="table_dm_td"></td>
            </tr>
            <tr>
                <td class="table_dm_td">药品规格</td>
                <td class="table_dm_td bg_color"></td>
                <td class="table_dm_td"></td>
            </tr>
            <tr>
                <td class="table_dm_td">药品单位</td>
                <td class="table_dm_td bg_color"></td>
                <td class="table_dm_td" id="drugUnit"></td>
            </tr>
            <tr>
                <td class="table_dm_td">生产企业</td>
                <td class="table_dm_td bg_color"></td>
                <td class="table_dm_td"></td>
            </tr>
            <tr>
                <td class="table_dm_td">批准文号</td>
                <td class="table_dm_td bg_color"></td>
                <td class="table_dm_td"></td>
            </tr>
        </table>
    </div>
</template>
<script>
    export default {
        data(){
            return{

            }
        },
        mounted(){
            $("#drugCode").dxDropDownBox({
                elementAttr: {
                    class: "class-name"
                },
                inputAttr: {
                    height: '25px'
                },
                value: 3,
                valueExpr: "ID",
                deferRendering: false,
                placeholder: "Select a value...",
                displayExpr: function(item){
                    return item && item.CompanyName + " <" + item.Phone + ">";
                },
                showClearButton: true,
                // dataSource: makeAsyncDataSource("customers.json"),
                contentTemplate: (e) => {
                    let value = e.component.option('value');
                    let grid = $('<div>').dxDataGrid({
                        dataSource: e.component.option('dataSource'),
                        searchPanel: {
                            visible: true,
                            width: 150,
                            placeholder: '查找...'
                        },
                        columns: [
                            {
                                caption: "供应商编码",
                                dataField: "code",
                                width:100
                            }, {
                                caption: "供应商名称",
                                dataField: "name",
                            },
                        ],
                        hoverStateEnabled: true,
                        scrolling: { mode: 'infinite' },
                        paging: { enabled: true, pageSize: 10 },
                        height: 200,
                        selection: { mode: 'single' },
                        selectedRowKeys: [value],
                        onSelectionChanged: (selectedItems) => {
                            let keys = selectedItems.selectedRowKeys;
                            let hasSelection = keys.length;
                            e.component.option("value", hasSelection ? keys[0] : null);
                        }
                    });
                    let instance = grid.dxDataGrid('instance');
                    e.component.on("valueChanged", function (args) {
                        instance.selectRows(args.value, false);
                        e.component.close();
                    });
                    return grid;
                }
            });

            $("#drugUnit").dxSelectBox({
                // dataSource: ,
                displayExpr: "Name",
                valueExpr: "ID",
            });
        },
        methods:{

        }
    }
</script>
<style scoped>
    .dx-texteditor{
        border-radius: 0;
    }
    .tdiv {
        /*padding: 5px;*/
    }

    .table_dm {
        border: solid #8ba0bc;
        border-width: 1px 0px 0px 1px;
        font-size: 12px;
    }

    .table_dm_td {
        border: solid #cfddee;
        border-width: 0px 1px 1px 0px;
        padding: 5px;
        text-align: right;
        line-height: 25px;
    }

    .table_dm_th {
        border: solid #8ba0bc;
        border-width: 0px 1px 1px 0px;
        padding: 0px;
        text-align: center;
        line-height: 25px;
        font-weight: bold;
        background: #e4effa;
    }

    .table_dm_tdh {
        /*font-weight:bold;*/
    }

    .table_dm_td select {
        width: 250px;
        height: 25px;
        border: 0px;
    }
    .bg_color{
        background-color: #e8eaec;
    }
</style>