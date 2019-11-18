<style lang="less">
    .badge-status {
        font-size: 14px;
        color: rgba(0, 0, 0, .65);
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        list-style: none;
        position: relative;
        display: inline-block;
        line-height: 1;
        vertical-align: middle;
        line-height: inherit;
        vertical-align: baseline;
    }
    .badge-status-text {
        color: rgba(0,0,0,.65);
        font-size: 14px;
        margin-left: 4px;
        box-sizing: border-box;
        line-height: inherit;
    }
    .badge-status-dot{
        width: 6px;
        height: 6px;
        display: inline-block;
        border-radius: 50%;
        vertical-align: middle;
        position: relative;
        top: -1px;
    }

    .badge-status-default{
        background-color: #d9d9d9;
    }
    .badge-status-success{
        background-color: #52c41a;
    }
    .badge-status-info{
        background-color: #2db7f5;
    }
    .badge-status-processing{
        background-color: #1890ff;
    }
    .badge-status-error{
        background-color: #f5222d;
    }
    .badge-status-warning{
        background-color: #FC9619;
    }
</style>

<template>
    <span class="badge-status">
        <span :class="'badge-status-dot '+bgColor"></span>
        <span class="badge-status-text">{{GetText}}</span>
    </span>
</template>

<script>
    import Vue from 'vue';
    export default {
        props: {
            dataSource: {
                type: Array
            },
            displayExpr: {
                type: String,
                default: 'text',
            },
            valueExpr: {
                type: String,
                default: 'id',
            },
            value: {
                type: String,
            },
        },
        computed: {
            bgColor () {
                let stateType=null;
                for(let i=0;i<this.dataSource.length;i++)
                {
                    if(this.dataSource[i][this.valueExpr]==this.value)
                    {
                        stateType=this.dataSource[i].badgeStatus;
                        break;
                    }
                }
                let ColorCss=null;
                switch (stateType)
                {
                    case "success":
                        ColorCss= "badge-status-success";
                        break;
                    case "processing":
                        ColorCss= "badge-status-processing";
                        break;
                    case "error":
                        ColorCss= "badge-status-error";
                        break;
                    case "warning":
                        ColorCss= "badge-status-warning";
                        break;
                    case "info":
                        ColorCss= "badge-status-info";
                        break;
                    default:
                        ColorCss= "badge-status-default";
                        break;
                }
                return ColorCss;
            },
            GetText () {
                for(let i=0;i<this.dataSource.length;i++)
                {
                    if(this.dataSource[i][this.valueExpr]==this.value)
                    {
                        return this.dataSource[i][this.displayExpr];
                    }
                }
                return "未知";
            },
        },
    };
</script>
