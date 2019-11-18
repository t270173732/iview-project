import Mock from 'mockjs'
import { doCustomTimes } from '@/libs/util'
const Random = Mock.Random

export const getTableData = req => {
  let tableData = []
  doCustomTimes(5, () => {
    tableData.push(Mock.mock({
      name: '@name',
      email: '@email',
      createTime: '@date'
    }))
  })
  return tableData
}

export const getDragList = req => {
  let dragList = []
  doCustomTimes(5, () => {
    dragList.push(Mock.mock({
      name: Random.csentence(10, 13),
      id: Random.increment(10)
    }))
  })
  return dragList
}

export const getGridData = req => {
  let gridData = []
  doCustomTimes(5, () => {
    gridData.push(Mock.mock({
      name: '@name',
      email: '@email',
      'sex|1':['男','女'],
      createTime: '@date'
    }))
  })
  return gridData
}
