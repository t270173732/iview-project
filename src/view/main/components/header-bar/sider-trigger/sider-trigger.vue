<template>
  <a @click="handleChange" type="text" class="sider-trigger-a">
    <i class="layui-icon layui-icon-spread-left" style="font-size: 20px" v-if="collapsed"></i>
    <i class="layui-icon layui-icon-shrink-right" style="font-size: 20px" v-else="collapsed"></i>
  </a>
</template>
<script>
export default {
  name: 'siderTrigger',
  props: {
    collapsed: Boolean,
    icon: {
      type: String,
      default: 'navicon-round'
    },
    size: {
      type: Number,
      default: 26
    }
  },
  methods: {
    handleChange () {
      this.$emit('on-change', !this.collapsed)
    }
  }
}
</script>
<style lang="less">
@import './sider-trigger.less';
</style>
