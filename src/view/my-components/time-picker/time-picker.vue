<template>
    <TimePicker transfer size="large" v-model="val" format="HH:mm" type="timerange" @on-change="change" :clearable="false"></TimePicker>
</template>
<script>
    export default {
        props:['field'],
        data(){
            return{
                val:null,
            }
        },
        mounted(){
            if(this.field['editorOptions']){
                this.val = this.field.editorOptions.value;

                this.field.component.on('fieldDataChanged',this.onFieldDataChanged);
            }else{
                this.val=this.field.value;
            }
        },
        methods:{
            onFieldDataChanged(e)
            {
                if (e.dataField === this.field.dataField)
                {
                    this.val = e.value;
                }
            },
            change(e){
                if (e &&e.length==0){
                    this.val =null;
                }else{
                    this.val = e;
                }
                this.field.component.updateData(this.field.dataField,  this.val);
            }
        }
    }
</script>