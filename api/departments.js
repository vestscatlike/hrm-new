/*
 * @Author: 方书生 fanss1368@163.com
 * @Date: 2023-02-13 11:03:48
 * @LastEditors: 方书生 fanss1368@163.com
 * @LastEditTime: 2023-02-16 09:56:29
 * @FilePath: \hrsaas\src\api\departments.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 *
 *
 */
import request from '@/utils/request'

// 获取组织结构数据数据
export function getDepartmentsApi() {
  return request({
    url: '/company/department'
  })
}

// 删除接口
export function delDepartmentsApi(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'delete'
  })
}

// 新增接口
export function addDepartments(data) {
  console.log(data)
  return request({
    url: '/company/department',
    method: 'post',
    data
  })
}

// 当点击下拉框时，才会去调用接口
export function getEmployeeSimple() {
  return request({
    url: '/sys/user/simple'
  })
}

// 获取部门信息详情的模块
export function getDepartDetail(id) {
  return request({
    url: `/company/department/${id}`
  })
}

/**
 * 编辑部门
 * ***/
export function updateDepartments({ data }) {
  console.log(data)
  return request({
    url: `/company/department/${data.id}`,
    method: 'put',
    data
  })
}
