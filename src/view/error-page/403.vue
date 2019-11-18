<template>
  <error-content code="403" desc="Oh~~您没有权限~"/>
</template>

<script>
import errorContent from './error-content.vue'
export default {
  name: 'error_403',
  components: {
    errorContent
  },
  data () {
    return {

    }
  }
}
</script>
