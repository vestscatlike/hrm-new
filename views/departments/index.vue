<!--
 * @Author: 方书生 fanss1368@163.com
 * @Date: 2023-02-11 12:11:48
 * @LastEditors: 方书生 fanss1368@163.com
 * @LastEditTime: 2023-02-16 17:31:29
 * @FilePath: \hrsaas\src\views\departments\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div
    v-loading="loading"
    class="dashboard-container"
    element-loading-text="拼命加载中"
  >
    <div class="app-container">
      <el-card class="tree-card">
        <!-- 用了一个行列布局 -->

        <!-- 缺少treeNode -->
        <TreeTool :tree-node="company" :is-root="true" @addDept="addDept" />

        <el-tree :data="departs" :props="defaultProps" :default-expand-all="true">
          <!-- 传入内容 插槽内容 会循环多次 有多少节点 就循环多少次 -->
          <!-- 作用域插槽 slot-scope="obj" 接收传递给插槽的数据   data 每个节点的数据对象-->
          <!-- scope-scope 是 tree组件传给每个节点的插槽的内容的数据 -->
          <!-- 顺序一定是 执行slot-scope的赋值 才去执行 props的传值 -->
          <!-- 为什么传的是data/// -->
          <TreeTool slot-scope="{ data }" :tree-node="data" @getDepartments="getDepartments" @addDept="addDept" @editDept="editDept" />

        <!-- 右侧内容 -->

        </el-tree>
      </el-card>
    </div>
    <AddDept
      ref="addDept"
      :tree-node="node"
      :show-dialog.sync="showDialog"
      @getDepartments="getDepartments"
    />
  </div>
</template>

<script>
import TreeTool from './components/tree-tools.vue'
import AddDept from './components/add-dept.vue'

import { getDepartmentsApi } from '@/api/departments'

import { transListToTree } from '@/utils/index'

// import { Loading } from 'element-ui';
// Loading.service(options);
export default {
  // name: 'Dept',
  components: { TreeTool, AddDept },
  data() {
    return {
      loading: true,
      departs: [],
      defaultProps: {
        label: 'name' // 表示 从这个属性显示内容
      },
      company: { name: '江苏传智播客教育科技股份有限公司', manager: '负责人' },
      showDialog: false, // 显示窗体

      node: {}// 存储部门信息
    }
  },

  created() {
    this.getDepartments() // 调用自身的方法
  },
  methods: {
    handleNodeClick(data) {
      // console.log(data)
    },

    // 获取-部门列表
    async getDepartments() {
      this.loading = true
      const res = await getDepartmentsApi()
      // console.log(res)
      this.company = {
        name: res.companyName,
        manager: '负责人',
        id: ''
      }
      // console.log(res)

      // 用的就是递归或者双for循环的那个
      this.departs = transListToTree(res.depts, '') // 需要将其转化成树形结构
      this.loading = false
    },

    // 修改showDialog
    // 获得传入的部门信息
    addDept(node) {
      this.node = node
      this.showDialog = true
    },

    // 当点击了编辑的时候，弹出弹框
    // 点击编辑触发的父组件的方法
    editDept(node) {
      // console.log(node)
      // console.log(node.id)
      this.showDialog = true // 显示新增组件弹层
      this.node = node // 存储传递过来的node数据
      // 我们需要在这个位置 调用子组件的方法
      // 父组件 调用子组件的方法
      this.$refs.addDept.getDepartDetail(node.id) // 直接调用子组件中的方法 传入一个id
    }

    // showDialog(value) {
    //   this.showDialog = value
    // }

    // transListToTree(list, rootPid) {
    //   console.log(list)

    //   // arr的第一层存储的是以及部门
    //   const arr = []
    //   list.forEach(item => {
    //     // 只push以及部门
    //     // 满足什么条件的就是以及部门
    //     // pid ===''
    //     // 只要pid为空的，表示的就是一级节点，只要是一级节点，就把他push到数组里面
    //     if (item.pid === rootPid) {
    //       const children = this.tranListToTreeData(list, item.id)
    //       item.children = children
    //       arr.push(item) // 将内容加入到数组中
    //     }
    //     console.log(1)
    //   })
    //   console.log(2)
    //   return arr
    // }
  }
}
</script>

<style scoped  lang="scss">
.tree-card {
  width: 1000px;
  // height: 140px;
  padding: 30px  140px;
  font-size:14px;
  margin: 0 auto;
  background:rgb(145, 205, 251);
}

</style>
