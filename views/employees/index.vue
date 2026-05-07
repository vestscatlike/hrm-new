<!--
 * @Author: 方书生 fanss1368@163.com
 * @Date: 2023-02-11 12:11:48
 * @LastEditors: 方书生 fanss1368@163.com
 * @LastEditTime: 2023-02-26 11:33:56
 * @FilePath: \hrsaas\src\views\employees\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 公告头部样式 -->
      <page-tools>
        <template slot="before">
          <span>共{{ total }}条记录</span>
        </template>

        <template slot="after">
          <el-button size="small" type="warning" @click="daoru">导入{{ $t('route.import') }}</el-button>
          <el-button size="small" type="danger" @click="exportEmployees">导出</el-button>
          <el-button size="small" type="primary" @click="addEmployees">新增员工</el-button>
        </template>
      </page-tools>

      <!-- 表格 -->
      <el-table border :data="list" :v-loading="loading">
        <el-table-column label="序号" type="index" width="60" />
        <el-table-column label="姓名" width="200" prop="username" />
        <el-table-column label="头像" sortable="">
          <!-- 展示头像组件 -->
          <template #default="{row}">
            <el-avatar ref="myCanvas" :size="100" :src="row.staffPhoto" @click.native="handleImgShowDialog(row.staffPhoto)">
              <!-- 设置默认头像 -->
              <img src="~@/assets/common/bigUserHeader.png" alt="">
            </el-avatar>
          </template>
        </el-table-column>
        <el-table-column label="工号" sortable="" prop="workNumber" />
        <el-table-column label="聘用形式" sortable="" prop="formOfEmployment" :formatter="formatter" />
        <el-table-column label="部门名称" sortable="" prop="departmentName" />
        <el-table-column label="入职时间" sortable="" prop="timeOfEntry">
          <template #default="{row}">
            {{ row.timeOfEntry | formatDate }}
          </template>
        </el-table-column>
        <el-table-column label="账户状态" sortable="">
          <template #default="{row}">
            <el-switch
              :value="row.enableState!==1"
              active-color="#13ce66"
              inactive-color="#ff4949"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" sortable="" width="250">
          <template #default="{row}">
            <el-row type="flex" justify="space-between">
              <el-link type="primary" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-link>
              <el-link type="primary">转正</el-link>
              <el-link type="primary">调岗</el-link>
              <el-link type="primary">离职</el-link>
              <el-link type="primary" @click="openshowRoleDialog(row.id)">角色</el-link>
              <!-- mixin混入的方法 -->
              <!-- <el-link :disabled="!checkPermission('DELETE_EMP')" type="primary" @click="delEmployee(row.id)">删除</el-link> -->
              <el-link v-auth="'DELETE_EMP'" type="primary" @click="delEmployee(row.id)">删除</el-link>
            </el-row>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-row type="flex" justify="center" style="height:80px" align="middle">
        <el-pagination background layout="prev,pager,next" :current-page="page.page" :page-size="page.size" :total="total" @current-change="changepage" />
      </el-row>
    </div>
    <add-employee :show-dialog.sync="showDialog" />

    <!-- 头像二维码弹层 -->
    <el-dialog title="二维码" :visible.sync="showImgDialog">
      <el-row type="flex" justify="center">
        <canvas ref="myCanvas" />
      </el-row>
    </el-dialog>

    <assign-role ref="assignRole" :user-id="userId" :show-role-dialog.sync="showRoleDialog" />
  </div>
</template>

<script>
import Employees from '@/api/constant/employees'
import { getEmployeeListApi, delEmployeeApi } from '@/api/employees'
import QrCode from 'qrcode'

import AssignRole from '@/views/employees/component/assign-role.vue'

// 引入过滤器
import { formatDate } from '@/filters'

// 引入add弹层组件
import addEmployee from './comployees/add-employee.vue'

// 引入mixin混入
import checkPermission from '@/mixin/checkPermission'

export default {
  components: { addEmployee, AssignRole },
  mixins: [checkPermission],
  data() {
    return {
      loading: false,
      list: [], // 接数据的

      // 分页绑定数据
      page: {
        page: 1, // 当前页码
        size: 10,
        total: 0 // 总数
      },
      total: null,

      // 弹层显示属性
      showDialog: false,

      // 二维码弹层
      showImgDialog: false,

      // 分配角色弹层
      showRoleDialog: false,
      // 分配角色时获取的id，传递给子组件
      userId: null
    }
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    async getEmployeeList() {
      this.loading = true
      const res = await getEmployeeListApi(this.page)
      // console.log(res)
      this.list = res.rows
      this.total = res.total
      this.loading = false
    },
    changepage(page) {
      // console.log(page)
      this.page.page = page
      this.getEmployeeList()
    },
    formatter(row, column, cellValue, index) {
      // console.log(cellValue)
      // 第一种方法
      // return cellValue === 1 ? '正式员工' : '非正式员工'

      // 第二种方法
      const currentObj = Employees.hireType.find(item => item.id === +cellValue)
      // if (currentObj.value) {
      //   return currentObj.value
      // } else {
      //   return '未知'
      // }
      return currentObj?.value || '未知'
    },
    async delEmployee(id) {
      await delEmployeeApi(id)
      // console.log(res)
      this.$message.success('删除成功')
      this.getEmployeeList()
    },
    addEmployees() {
      this.showDialog = true
    },

    // 关闭弹窗
    // closedislog() {
    //   this.showDialog = false
    // },

    // 导入功能
    daoru() {
      this.$router.push('/import')
    },

    // 导出功能
    async exportEmployees() {
      // 点击了导出的按钮时候会触发
      // import函数会动态的导入一个文件
      // 当这个函数触发的时候再去加载这个文件
      // import函数返回的是一个promise
      // promise成功的结果就是文件内部导出的内容
      import('@/vendor/Export2Excel').then(res => {
        console.log(res)
      })

      const [{ export_json_to_excel }, { rows }] = await Promise.all([import('@/vendor/Export2Excel.js'), getEmployeeListApi({ page: 1, size: this.total })])
      console.log(export_json_to_excel, rows)

      // 定义映射表
      const headers = {
        '手机号': 'mobile',
        '姓名': 'username',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }

      const data = this.formatJson(headers, rows)
      console.log(data)
      export_json_to_excel({
        header: Object.keys(headers), // 表头 必填
        data, // 具体数据 必填
        filename: 'excel-list', // 非必填
        autoWidth: true, // 非必填
        bookType: 'xlsx' // 非必填
      })
    },
    formatJson(headers, rows) {
      const arr = rows.map(item => {
        return Object.keys(headers).map(key => {
          if (['timeOfEntry', 'correctionTime'].includes(headers[key])) {
            return formatDate(item[headers[key]])
          }
          if (headers[key] === 'formOfEmployment') {
            const res = Employees.hireType.find(empitem => empitem.id === +item[headers[key]])
            return res?.value || '未知'
          }
          return item[headers[key]]
        })
      })
      console.log(arr)
      return arr
    },

    // 显示头像二维码
    handleImgShowDialog(url) {
      // url存在的情况下 才弹出层
      if (url) {
        this.showCodeDialog = true // 数据更新了 但是我的弹层会立刻出现吗 ？页面的渲染是异步的！！！！
        // 有一个方法可以在上一次数据更新完毕，页面渲染完毕之后
        this.$nextTick(() => {
          // 此时可以确认已经有ref对象了
          QrCode.toCanvas(this.$refs.myCanvas, url) // 将地址转化成二维码
          // 如果转化的二维码后面信息 是一个地址的话 就会跳转到该地址 如果不是地址就会显示内容
        })
      } else {
        this.$message.warning('该用户还未上传头像')
      }
    },

    // 点击角色后，打开分配角色的弹层
    openshowRoleDialog(id) {
      this.showRoleDialog = true
      this.$refs.assignRole.getUserDetailById(id)
      this.userId = id
    }
  }
}
</script>

<style>

</style>
