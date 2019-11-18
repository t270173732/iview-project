<template>
            <div style="font-size:16px;">
                <Button v-for="op in items" :key="op.id" :type=op.type  @click=op.click(op.extra) :disabled="!op.enabled" :style="'display:'+op.display" :loading="op.modal_loading">{{op.text}}</Button>
            </div>
</template>

<script>
    export default {
        props:['items'],
        name: "command-btns"
    }
</script>

<style scoped>
button:not(:first-child) {
        margin-left: 3px;
    }
</style>
