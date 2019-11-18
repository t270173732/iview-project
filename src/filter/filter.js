import Vue from 'vue'
import * as dayjs from 'dayjs'


Vue.filter('dayjs', function(dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  return dayjs(dataStr).format(pattern)
})

Vue.filter('moment', function(dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  return dayjs(dataStr).format(pattern)
})
Vue.filter('lasttime', function(dataStr, pattern = 'YYYY-MM-DD HH:mm') {
  return dayjs(dataStr).format(pattern)
})
Vue.filter('talktime', function(dataStr, pattern = 'HH:mm') {
  if (dayjs(dataStr).format('YYYY-MM-DD') == dayjs(new Date).format('YYYY-MM-DD')) {
    return dayjs(dataStr).format(pattern)
  } else {
    return dayjs(dataStr).format('MM-DD')
  }
})
Vue.filter('historytime', function(dataStr, pattern = 'HH:mm') {
  if (dayjs(dataStr).format('YYYY-MM-DD') == dayjs(new Date).format('YYYY-MM-DD')) {
    return dayjs(dataStr).format(pattern)
  } else {
    return dayjs(dataStr).format('MM-DD HH:mm')
  }
})