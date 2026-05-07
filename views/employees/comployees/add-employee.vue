<!--
 * @Author: 方书生 fanss1368@163.com
 * @Date: 2023-02-17 17:05:17
 * @LastEditors: 方书生 fanss1368@163.com
 * @LastEditTime: 2023-02-19 18:29:01
 * @FilePath: \hrsaas\src\views\employees\comployees\add-employee.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <el-dialog title="新增员工" :visible="showDialog" @close="cancel">
    <!-- 表单 -->
    <el-form ref="addEmployee" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="姓名" prop="username">
        <el-input v-model="formData.username" style="width:50%" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="formData.mobile" style="width:50%" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker v-model="formData.timeOfEntry" style="width:50%" placeholder="请选择日期" />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select v-model="formData.formOfEmployment" style="width:50%" placeholder="请选择">
          <el-option v-for="item in Employees.hireType" :key="item.id" :label="item.value" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input v-model="formData.workNumber" style="width:50%" placeholder="请输入工号" />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <!-- <el-input v-model="formData.departmentName" style="width:50%" placeholder="请选择部门"  /> -->
        <el-cascader
          v-model="formData.departmentName"
          :options="cascaderData"
          :props="cascaderProps"
          @focus="getEmployeeList"
          @change="handleChange"
        />
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker v-model="formData.correctionTime" style="width:50%" placeholder="请选择日期" />
      </el-form-item>
    </el-form>
    <!-- footer插槽 -->
    <template v-slot:footer>
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="cancel">取消</el-button>
          <el-button type="primary" size="small" @click="submit">确定</el-button>
        </el-col>
      </el-row>
    </template>
    <!-- <button type="submit" @click="ceshi">dianji</button> -->
  </el-dialog>
</template>

<script>
import { getDepartListApi, addEmployeeApi } from '@/api/employees'

import { transListToTree } from '@/utils/index'

import Employees from '@/api/constant/employees'
export default {
  name: 'AddEmployees',
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formData: {
        username: '', // 用户姓名
        mobile: '', // 手机号
        formOfEmployment: '', // 聘用形式
        workNumber: '', // 工号
        departmentName: '', // 部门名称
        timeOfEntry: '', // 入职时间
        correctionTime: '' // 转正时间
      },
      rules: {
        username: [{ required: true, message: '用户姓名不能为空', trigger: 'blur' }, {
          min: 1, max: 4, message: '用户姓名为1-4位'
        }],
        mobile: [{ required: true, message: '手机号不能为空', trigger: 'blur' }, {
          pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur'
        }],
        formOfEmployment: [{ required: true, message: '聘用形式不能为空', trigger: 'blur' }],
        workNumber: [{ required: true, message: '工号不能为空', trigger: 'blur' }],
        departmentName: [{ required: true, message: '部门不能为空', trigger: 'change' }],
        timeOfEntry: [{ required: true, message: '入职时间', trigger: 'blur' }]
      },

      // 添加部门时的数据
      cascaderData: [],
      // 点击时绑定的数据，记录点击的数据
      // cascaderValue: this.formData.departmentName,
      // 级联选择器规则
      cascaderProps: {
        value: 'id',
        label: 'name',
        children: 'children',
        emitPath: false,
        checkStrictly: true
      },

      // 映射表
      Employees
    }
  },
  methods: {
    async getEmployeeList() {
      const res = await getDepartListApi()
      // console.log(res)
      this.cascaderData = transListToTree(res.depts, ' ')
      console.log(this.formData)
      console.log(this.cascaderData)
    },
    handleChange() {
      // console.log(this.cascaderValue)
    },

    // 新增功能
    async submit() {
      // this.$refs.addEmployee.resetFields()
      console.log(this.formData)
      const res = await addEmployeeApi(this.formData)
      console.log(res)
      this.cancel()
      // this.getEmployeeList()
      this.$parent.getEmployeeList()
    },

    // 关闭事件
    cancel() {
      // this.showDialog = false
      this.$emit('updata:showDialog', false)
      this.$refs.addEmployee.resetFields()
      this.formData = {
        username: '', // 用户姓名
        mobile: '', // 手机号
        formOfEmployment: '', // 聘用形式
        workNumber: '', // 工号
        departmentName: '', // 部门名称
        timeOfEntry: '', // 入职时间
        correctionTime: '' // 转正时间
      }
    }
  }
}
</script>

<style>

</style>
