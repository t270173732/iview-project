<template>
    <div>
        <!--<div>-->
        <Tag v-for="item in keywords" :key="item" :name="item" class="keyword-tag">{{item}}</Tag>
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
        }
    },
    mounted() {
        if(this.$parent.activeInfoFormData.tags && this.$parent.activeInfoFormData.tags.length !=0){
            this.keywords = this.$parent.activeInfoFormData.tags;
        }else{
            this.keywords = []
        }
    },
    methods: {

    }
}
</script>
<style>
.keyword-tag {
  color: #333;
  font-size: 14px;
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
    Microsoft YaHei, \\5fae\8f6f\96c5\9ed1, Arial, sans-serif;
}
.keyword-tag i {
  font-size: 18px;
  height: 25px;
}
</style>