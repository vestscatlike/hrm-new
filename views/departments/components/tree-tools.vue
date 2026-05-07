<!--
 * @Author: 方书生 fanss1368@163.com
 * @Date: 2023-02-13 10:23:48
 * @LastEditors: 方书生 fanss1368@163.com
 * @LastEditTime: 2023-02-14 17:00:15
 * @FilePath: \hrsaas\src\views\departments\components\tree-tools.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <el-row style="width: 100%" type="flex">
    <el-col>
      {{ treeNode.name }}
    </el-col>
    <el-col :span="6">
      <el-row type="flex" justify="space-between">
        <el-col>
          <span style="margin-right: 20px">{{ treeNode.manager }}</span>
        </el-col>
        <el-col>
          <el-dropdown @command="clickMenuItem">
            <span class="el-dropdown-link">
              操作<i class="el-icon-arrow-down el-icon--right" />
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="add">添加部门</el-dropdown-item>
                <!--如果是头部card组件内部调用会传递isRoot属性为true-->
                <!--编辑和删除只在树组件内部调用(isRoot: false)的时候展示出来-->
                <el-dropdown-item v-if="!isRoot" divided command="edit">编辑部门</el-dropdown-item>
                <el-dropdown-item v-if="!isRoot" divided command="del">删除部门</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { delDepartmentsApi } from '@/api/departments'

// 该组件需要对外开放属性 外部需要提供一个对象 对象里需要有name  manager
export default {
  // props可以用数组来接收数据 也可以用对象来接收
  // props: {   props属性: {  配置选项 }  }
  props: {
    // 定义一个props属性
    treeNode: {
      type: Object, // 对象类型
      required: true // 要求对方使用您的组件的时候 必须传treeNode属性 如果不传 就会报错
    },
    isRoot: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    async clickMenuItem(type) {
      // console.log(type)
      if (type === 'del') {
        // console.log('删除开始')
        // console.log(this.treeNode)
        // await this.$confirm('是否确认删除')

        const res = await delDepartmentsApi(this.treeNode.id)
        console.log(res)
        this.$emit('getDepartments')
      } else if (type === 'add') {
        // console.log(1)
        // console.log(this.treeNode)
        this.$emit('addDept', this.treeNode)
      } else if (type === 'edit') {
        // console.log(1)
        this.$emit('editDept', this.treeNode)
      }
    }
  }
}
</script>
