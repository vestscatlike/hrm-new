/*
 * @Author: 方书生 fanss1368@163.com
 * @Date: 2023-02-07 16:06:42
 * @LastEditors: 方书生 fanss1368@163.com
 * @LastEditTime: 2023-02-10 15:21:45
 * @FilePath: \hrsaas\src\api\user.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import request from '@/utils/request'

// 登录接口
export function login(data) {
  // 返回一个axios对象 => promise  // 返回了一个promise对象
  return request({
    url: '/sys/login', // 因为所有的接口都要跨域 表示所有的接口要带 /api
    method: 'post',
    data
  })
}

// 获取用户基本参数
export function getInfoApi() {
  return request({
    url: '/sys/profile', // 因为所有的接口都要跨域 表示所有的接口要带 /api
    method: 'post'
  })
}

// 获取用户头像参数
export function getInfoRoleApi(id) {
  return request({
    url: `/sys/user/${id}`,
    method: 'get'
  })
}
export function logout() {}
