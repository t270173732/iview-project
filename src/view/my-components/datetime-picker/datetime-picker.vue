<template>
    <DatePicker size='large' transfer :value="val" :format="format" :type="type" placeholder="选择日期" @on-change="change" placement="bottom"></DatePicker>
</template>
<script>
    export default {
        name: "datetime-picker",
        props:['field','type','format'],
        mounted()
        {
            if(this.field['editorOptions']){
                this.val = this.field.editorOptions.value;

                this.field.component.on('fieldDataChanged',this.onFieldDataChanged);
            }else{
                this.val=this.field.value;
            }

            if (!this.type)
                this.type = 'date';
            if (!this.format)
                    this.format = 'yyyy-MM-dd';

        },
        data(){
            return {
                val:null,
            }
        },
        methods: {
            onValueChanged(e)
            {
                if(e.value!=null)
                {
                    this.val = e.value;
                }

            },
            onFieldDataChanged(e)
            {
                if (e.dataField === this.field.dataField)
                {
                    this.val = e.value;
                }
            },
            change(e)
            {
                if (e &&e[0]==''){
                    this.val =null;
                }else{
                    this.val = e;
                }
                this.field.component.updateData(this.field.dataField,  this.val);
            }
        }
    }
</script>
