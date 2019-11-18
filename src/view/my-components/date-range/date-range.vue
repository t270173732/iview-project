<template>
    <!----@on-change="change"--->
    <DatePicker size='large' transfer type="daterange" :value="values" @on-change="change" :options="options"
                :format="format" placement="bottom-start" placeholder="选择日期范围" :clearable="false"
    ></DatePicker>
</template>
<script>
    export default {
        name: "date-range",
        props: ['field'],
        mounted() {
            this.field.onValueChanged = this.change;
        },
        data() {
            return {
                values: [],
                format:'yyyy-MM-dd',
                options: {
                    shortcuts: [
                        {
                            text: '昨天',
                            value() {
                                const date = new Date();
                                date.setTime(date.getTime() - 3600 * 1000 * 24);
                                const start = date;
                                const end = new Date();
                                return [start, end];
                            }
                        },
                        {
                            text: '一周',
                            value() {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                                return [start, end];
                            }
                        },
                        {
                            text: '一个月',
                            value() {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                                return [start, end];
                            }
                        },
                        {
                            text: '三个月',
                            value() {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                                return [start, end];
                            }
                        }
                    ]
                }
            }
        },
        methods: {
            change(e) {
                if (e && e[0] == '')
                    this.values = null;
                else{
                    this.values = e;
                    this.field.component.updateData(this.field.dataField, this.values);
                }
            },

        }
    }
</script>
<style>

</style>
