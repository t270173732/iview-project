<template>
    <div>
        <div v-for="op in items" style="vertical-align: middle">
            <p style="text-align: center" v-if="(op.isJump==false)">
                <span :style="'color:'+op.color">{{op.text}}</span>
            </p>
            <p style="text-align: center" v-if="(op.isJump==true)">
                <a @click=op.click(op.id)  :style="'margin-top:2px;color:'+op.color">{{op.text}}</a>
            </p>
            <p style="text-align: center" v-if="(op.isJump=='pop')">
                <Poptip
                        confirm
                        transfer
                        :title=op.tip
                        @on-ok=op.click(op.id)>
                    <a :style="'margin-top:2px;color:'+op.color">{{op.text}}</a>
                </Poptip>
            </p>
        </div>
    </div>
</template>
<script>
    export default {
        props: ['items'],
        name: 'OpBtn',
    };
</script>

<style scoped>

</style>