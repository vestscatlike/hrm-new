/*
 * @Author: 方书生 fanss1368@163.com
 * @Date: 2023-02-17 10:55:37
 * @LastEditors: 方书生 fanss1368@163.com
 * @LastEditTime: 2023-03-01 14:33:49
 * @FilePath: \hrsaas\src\components\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import PageTools from '@/components/PageTools/index.vue'

// 引入xlsx
import UploadExcel from './UploadExcel.vue'

import ImageUpload from './ImageUpload'

import ScreenFull from './ScreenFull'

import ThemePicker from './ThemePicker'

// 多页签标签页
import TagsView from './TagsView'

export default {
  install(Vue) {
    Vue.component(PageTools.name, PageTools) // 注册工具栏组件
    Vue.component('UploadExcel', UploadExcel) // 注册导入excel组件
    Vue.component('ImageUpload', ImageUpload) // 注册导入上传组件
    Vue.component('ScreenFull', ScreenFull) // 注册全屏组件
    Vue.component('ThemePicker', ThemePicker) // 注册全屏组件
    Vue.component('TagsView', TagsView)
  }
}
