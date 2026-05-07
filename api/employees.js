/*
 * @Author: 方书生 fanss1368@163.com
 * @Date: 2023-02-17 12:18:21
 * @LastEditors: 方书生 fanss1368@163.com
 * @LastEditTime: 2023-02-23 14:45:29
 * @FilePath: \hrsaas\src\api\employees.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import request from '@/utils/request'
/**
 * 获取员工的综合列表数据
 * ***/
export function getEmployeeListApi(params) {
  return request({
    url: '/sys/user',
    params
  })
}

/**
 * 删除员工接口
 * ****/

export function delEmployeeApi(id) {
  return request({
    url: `/sys/user/${id}`,
    method: 'delete'
  })
}

// 获取所有的员工数据
export const getDepartListApi = () => {
  return request({
    url: '/company/department'
  })
}

/** **
 *  新增员工的接口
 * **/
export function addEmployeeApi(data) {
  return request({
    method: 'post',
    url: '/sys/user',
    data
  })
}

/** *
 *  封装一个导入员工的接口
 * ***/
export function importEmployeeApi(data) {
  return request({
    url: '/sys/user/batch',
    method: 'post',
    data
  })
}

/** *
 *  获取某个用户的基本信息
 *
 * ***/
export function getUserDetailByIdApi(id) {
  return request({
    url: `/sys/user/${id}`
  })
}

/** *
 *
 * 保存员工的基本信息
 * **/
export function saveUserDetailByIdApi(data) {
  return request({
    url: `/sys/user/${data.id}`,
    method: 'put',
    data
  })
}

/** *
 *  读取用户详情的基础信息
 * **/
export function getPersonalDetailApi(id) {
  return request({
    url: `/employees/${id}/personalInfo`
  })
}
/** *
 *  更新用户详情的基础信息
 * **/
export function updatePersonalApi(data) {
  return request({
    url: `/employees/${data.userId}/personalInfo`,
    method: 'put',
    data
  })
}
/** **
 * 获取用户的岗位信息
 *
 * ****/
export function getJobDetailApi(id) {
  console.log(id)
  return request({
    url: `/employees/${id}/jobs`
  })
}
/** **
 * 获取用户列表信息（简略版）
 *
 * ****/
export function getJobDetailListApi() {
  // console.log(id)
  return request({
    url: `/sys/user/simple`,
    method: 'get'
  })
}
/**
 * 保存岗位信息
 * ****/
export function updateJobApi(data) {
  return request({
    url: `/employees/${data.userId}/jobs`,
    method: 'put',
    data
  })
}

/** *
 * 给用户分配角色
 * ***/
export function assignRolesApi(data) {
  return request({
    url: '/sys/user/assignRoles',
    data,
    method: 'put'
  })
}
