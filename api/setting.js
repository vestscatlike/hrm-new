/*
 * @Author: 方书生 fanss1368@163.com
 * @Date: 2023-02-16 14:44:13
 * @LastEditors: 方书生 fanss1368@163.com
 * @LastEditTime: 2023-02-17 12:18:28
 * @FilePath: \hrsaas\src\api\setting.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/**
 * 获取角色列表
 * ***/

import request from '@/utils/request'
export function getRoleListApi(params) {
  return request({
    url: '/sys/role',
    params
  })
}

/**
 * 获取公司信息
 * **/
export function getCompanyInfoApi(companyId) {
  return request({
    url: `/company/${companyId}`
  })
}

/** **
 *  删除角色
 *
 * ****/
export function deleteRoleApi(id) {
  return request({
    url: `/sys/role/${id}`,
    method: 'delete'
  })
}

/**
 * 获取角色详情
 * **/
export function getRoleDetailApi(id) {
  return request({
    url: `/sys/role/${id}`
  })
}

/** *
 * 修改角色
 * ***/
export function updateRoleApi(data) {
  return request({
    url: `/sys/role/${data.id}`,
    method: 'put',
    data
  })
}

/** *
 * 新增角色
 * ***/
export function addRoleApi(data) {
  return request({
    url: '/sys/role',
    data,
    method: 'post'
  })
}
