<!--
 * @Author: 方书生 fanss1368@163.com
 * @Date: 2023-02-11 12:11:48
 * @LastEditors: 方书生 fanss1368@163.com
 * @LastEditTime: 2023-02-25 10:47:59
 * @FilePath: \hrsaas\src\views\permission\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 新增的弹层 -->
      <el-dialog :title="changeTitle" :visible.sync="dialogFormVisible" @close="cancel">
        <el-form ref="perForm" :model="formData" :rules="formRules">
          <el-form-item label="权限名称" prop="name">
            <el-input v-model="formData.name" style="width:90%" />
          </el-form-item>
          <el-form-item label="权限标识" prop="code">
            <el-input v-model="formData.code" style="width:90%" />
          </el-form-item>
          <el-form-item label="权限描述">
            <el-input v-model="formData.description" style="width:90%" />
          </el-form-item>
          <el-form-item label="开启">
            <el-switch />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="dialogSubmit">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 靠右的按钮 -->
      <!-- <page-tools>
        <template>
          <el-button type="primary" size="small" @click="addPermission(row.id,'1')">添加权限</el-button>
        </template>
      </page-tools> -->
      <page-tools>

        <template slot="after">
          <!-- <el-button size="small" type="warning" @click="daoru">导入</el-button>
          <el-button size="small" type="danger" @click="exportEmployees">导出</el-button> -->
          <el-button type="primary" size="small" @click="addPermission(0,'1')">添加权限</el-button>
        </template>
      </page-tools>
      <!-- 表格 -->
      <el-table border :data="tableData" row-key="id">
        <el-table-column type="index" label="序号" width="80" />
        <el-table-column prop="name" align="center" label="名称" />
        <el-table-column prop="code" align="center" label="标识" />
        <el-table-column prop="description" align="center" label="描述" />
        <el-table-column align="center" label="操作">
          <template #default="{row}">
            <el-button v-if="row.type === 1" icon="el-icon-circle-plus-outline" type="text" @click="addPermission(row.id,'2')">添加</el-button>
            <el-button icon="el-icon-edit" type="text" @click="emitPermission(row.id)">编辑</el-button>
            <el-button icon="el-icon-delete" type="text" style="color: red" @click="delPermission(row.id)"> 删除</el-button>
          </template>
        </el-table-column>

      </el-table>
    </div>
  </div>
</template>

<script>
import { getPermissionListApi, addPermissionApi, getPermissionDetailApi, updatePermissionApi, delPermissionApi } from '@/api/permisson'

// 引入双for循环，把数组改成树状图
import { transListToTree } from '@/utils/index'
export default {
  name: 'Permission',
  data() {
    return {
      // 最开始获取的数据
      tableData: [],

      // 新增的弹框绑定的数据
      dialogFormVisible: false,
      formData: {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了 操作权限是2，访问权限是1
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      },
      formRules: {
        name: [{ required: true, message: '权限名称不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '权限标识不能为空', trigger: 'blur' }]
      }
    }
  },

  computed: {
    changeTitle() {
      if (this.formData.id) return '编辑'
      else return '新增'
    }
  },
  created() {
    this.getPermissionList()
  },
  methods: {
    // 最开始获取的数据,
    // 调用公告组件，把数据转为树状图
    async getPermissionList() {
      const res = await getPermissionListApi()
      // console.log(res)
      // this.tableData = res
      // console.log(this.tableData)
      this.tableData = transListToTree(res, '0')
      // console.log(this.tableData)
    },

    // 点击新增
    addPermission(pid, type) {
      this.formData.pid = pid
      this.formData.type = type
      this.dialogFormVisible = true
    },

    // 点击编辑
    async emitPermission(id) {
      this.formData = await getPermissionDetailApi(id)
      this.dialogFormVisible = true
    },

    // 点击删除
    async delPermission(id) {
      await delPermissionApi(id)
      this.getPermissionList()
    },

    // 点击dialog弹层的确定按钮时
    async dialogSubmit() {
      await this.$refs.perForm.validate()

      if (this.formData.id) {
        await updatePermissionApi(this.formData)
      } else {
        await addPermissionApi(this.formData)
        this.$message.success('添加成功')
      }
      this.cancel()
      this.getPermissionList()
    },

    cancel() {
      this.dialogFormVisible = false
      this.$refs.perForm.resetFields()
      this.formData = {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了 操作权限是2，访问权限是1
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      }
    }
  }
}
</script>

<style>

</style>
