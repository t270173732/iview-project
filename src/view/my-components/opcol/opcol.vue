<template>
    <div >
        <div v-for="(op,index) in items" style="display: inline">
            <a v-if="(op.showtip==false)" @click=op.click(op.id,op.extra)  style="margin-left:2px" :style="{'color':op.color?op.color:'#4354A2'}">{{op.text}}</a>
            <Poptip v-if="(op.showtip==true)"
                    confirm
                    transfer
                    :title=op.tip
                    @on-ok=op.click(op.id,op.extra)>
                <a :style="'color:'+op.color">{{op.text}}</a>
            </Poptip>
            <Divider v-if="(index!=items.length-1)" type="vertical" />
        </div>
    </div>
</template>
<script>
    export default {
        props:['items'],
        name: "OpCol",
    }
</script>

<style scoped>

</style>
