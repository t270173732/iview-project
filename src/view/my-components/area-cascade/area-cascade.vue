<template>
    <Cascader :data="data" size="large" change-on-select v-model="val" transfer placeholder="选择区域" filterable @on-change="change" :disabled="isDisabled"></Cascader>
</template>

<script>

//获取区域的URL
// const get_area_array_url = '/biz/bdArea/areaList';
const get_area_array_url = '/biz/bdArea/selectCompletePathDown';
export default {
    name: "area-cascade",
    props: ['field'],
    mounted() {
        this.field.onValueChanged = this.change;
        if(this.field.editorOptions.value){
            this.getAreaArea(this.field.editorOptions.value)
        }
        if(this.field.isDisabled){
            this.isDisabled = this.field.isDisabled
        }else{
            this.isDisabled = false
        }
        // this.getAreaArea(this.field.editorOptions.value).done((c) => {
        //     this.val = c;
        // });
    },
    created() {
        if (localStorage.areaList &&localStorage.areaList.length>0) {
            this.data = JSON.parse(localStorage.areaList);
            // console.log(this.data)
        }
        else {
            this.CommDs.areaListStore.load();
            this.CommDs.areaListStore.on('loaded', (result) => {
                this.data = result;
            })
        }

    },
    computed: {


    },
    data() {
        return {
            isDisabled:false,
            val: [],
            //远程自定义数据
            // data: [],
            data:[]
        }
    },
    methods: {
        getAreaArea(value) {
            let params = {};
            params.id = value;
            this.$put(get_area_array_url, params).then(res => {
                if (res.code == '200') {
                    this.val = res.data.idList
                }
                else {
                    //提示信息
                    this.warn(res.msg);
                }
            }).catch(err => {
                this.error(err);
                // console.log(err)
            });
        },
        change(value, selectedData) {
            var val = null;
            if (selectedData.length == 0)
                val = null;
            else
                val = parseInt(selectedData[selectedData.length - 1].value);
            this.field.component.updateData(this.field.dataField, val);
        }
    }

}
</script>

