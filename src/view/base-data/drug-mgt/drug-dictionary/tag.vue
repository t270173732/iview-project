<template>
    <div>
        <input type="text" v-model="value" class="tag-input">
        <Button @click="handleAdd" style="margin-left: 5px;vertical-align: top;height: 34px;" type="primary">
            <Icon type="md-add" size="20"></Icon>
        </Button>
        <!--<div>-->
        <Tag v-for="item in keywords" :key="item" :name="item" closable @on-close="handleClose2" class="keyword-tag">{{item}}</Tag>
        <!--</div>-->
    </div>
</template>
<script>
import Vue from 'vue';
export default {
    props: ['field'],
    data() {
        return {
            keywords: [],
            value: ''
        }
    },
    mounted() {
        if(this.$parent.productFormData.tags && this.$parent.productFormData.tags.length !=0){
            this.keywords = this.$parent.productFormData.tags;
        }else{
            this.keywords = []
        }
    },
    methods: {
        handleAdd() {
            if(this.value){
                if(this.keywords.indexOf(this.value.replace(/\s/ig,'')) == -1){
                    if(this.keywords.length < 3){
                        this.keywords.push(this.value);
                    }else{
                        this.warn('最多只能设置3个关键词')
                    }
                }else{
                    this.warn('该关键词已经存在')
                }
                this.$parent.productFormData.tags = this.keywords;
            }
            this.value = '';
        },
        handleClose2(event, name) {
            const index = this.keywords.indexOf(name);
            this.keywords.splice(index, 1);
            this.$parent.productFormData.tags = this.keywords;
        }
    }
}
</script>
<style>
.tag-input {
  height: 34px;
  border: 1px solid #dbdbdb;
  border-radius: 4px;
  padding-left: 7px;
}
.keyword-tag {
  color: #333;
  font-size: 14px;
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
    Microsoft YaHei, \\5fae\8f6f\96c5\9ed1, Arial, sans-serif;
}
</style>