<!--
 * @Author: 方书生 fanss1368@163.com
 * @Date: 2023-02-13 16:49:03
 * @LastEditors: 方书生 fanss1368@163.com
 * @LastEditTime: 2023-02-16 11:11:11
 * @FilePath: \hrsaas\src\views\departments\components\add-dept.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <!-- 新增部门的弹层 -->
  <el-dialog :title="showTitle" :visible="showDialog" @close="cancel">
    <!-- 表单组件  el-form   label-width设置label的宽度   -->
    <!-- 匿名插槽 -->
    <el-form ref="deptForm" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="formData.name" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="formData.code" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门负责人">
        <el-select v-model="formData.manager" placeholder="请选择" style="width:80%" @focus="getEmployeeSimple">
          <!-- label绑定展示的值 -->
          <!-- value绑定的是选中的值，传给v-model绑定的东西  -->
          <el-option
            v-for="item in peoples"
            :key="item.value"
            :label="item.name"
            :value="item.username"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="formData.introduce" style="width:80%" placeholder="1-300个字符" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>
    <!-- el-dialog有专门放置底部操作栏的 插槽  具名插槽 -->
    <el-row slot="footer" type="flex" justify="center">

      <el-col :span="6">
        <el-button type="primary" size="small" @click="submit">确定</el-button>
        <el-button size="small" @click="cancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getDepartmentsApi, getEmployeeSimple, addDepartments, getDepartDetail, updateDepartments } from '@/api/departments'
// import { runInThisContext } from 'vm'
export default {
  name: 'AddDept',
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    treeNode: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    // 定义是否重复的
    const checkName = async(rules, value) => {
      // console.log(1)
      const { depts } = await getDepartmentsApi()
      // console.log(depts)
      // console.log(this.treeNode.id)

      // 如果点击的是编辑，则同级不能相同
      // 如果是点击的是新增，则子集不能相同
      let res
      if (this.formData.id) {
        res = depts.filter(item => item.pid === this.treeNode.pid && item.id !== this.treeNode.id)
      } else {
        res = depts.filter(item => item.pid === this.treeNode.id)
      }
      // console.log(res)
      const isRepeat = res.some(item => item.name === value)
      if (isRepeat) {
        return Promise.reject(new Error('重复了'))
      }
    }
    const checkCode = async(rules, value) => {
      const { depts } = await getDepartmentsApi()
      let isRepeat
      if (this.formData.id) {
        isRepeat = depts.some(item => item.code === value && item.id !== this.treeNode.id)
      } else {
        isRepeat = depts.some(item => item.code === value)
      }
      if (isRepeat) {
        return Promise.reject(new Error('重复了'))
      }
    }
    return {
      // 表单的数据
      // 定义表单数据
      formData: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },

      // 定义校验规则
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门名称要求1-50个字符', trigger: 'blur' },
          {
            validator: checkName,
            trigger: 'blur'
          }
        ],
        code: [
          { required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门编码要求1-50个字符', trigger: 'blur' },
          {
            validator: checkCode,
            trigger: 'blur'
          }
        ],
        manager: [{ required: true, message: '部门负责人不能为空', trigger: 'blur' }],
        introduce: [{ required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { trigger: 'blur', min: 1, max: 300, message: '部门介绍要求1-50个字符' }]
      },

      // 下拉框的数据
      peoples: [],
      value: ''

    }
  },
  computed: {
    showTitle() {
      return this.formData.id ? '编辑部门' : '新增部门'
    }
  },
  methods: {
    cancel() {
      // console.log(3)
      this.formData = {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      }
      // this.$refs.deptForm.resetFields()
      this.$emit('update:showDialog', false) // 触发事件
      // console.log(4)
      // console.log(this.showDialog)
    },
    async  getEmployeeSimple() {
      const res = await getEmployeeSimple()
      // console.log(res)
      this.peoples = res
    },
    async submit() {
      await this.$refs.deptForm.validate()
      // console.log(1)

      if (this.formData.id) {
        await updateDepartments({ data: this.formData })
      } else {
        // 新增，此时formData里没有id
        await addDepartments({
          ...this.formData,
          pid: this.treeNode.id
        })
      }

      this.cancel()
      this.$emit('getDepartments')
    },
    // 获取部门详情  add-dept.vue组件内部
    async  getDepartDetail(id) {
      this.formData = await getDepartDetail(id)
    }
  }
}
</script>
