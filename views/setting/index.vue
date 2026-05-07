<!--
 * @Author: 方书生 fanss1368@163.com
 * @Date: 2023-02-11 12:11:48
 * @LastEditors: 方书生 fanss1368@163.com
 * @LastEditTime: 2023-02-25 15:50:15
 * @FilePath: \hrsaas\src\views\setting\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-tabs>
        <el-tab-pane label="公司管理" name="first">
          <el-row>
            <el-button type="primary" icon="el-icon-plus" size="small " @click="addRole">新增角色</el-button>
          </el-row>
          <el-row>
            <el-table
              :data="list"
              border
              style="width: 100%"
            >
              <el-table-column label="序号" type="index" />
              <el-table-column label="角色名称" prop="name" />
              <el-table-column label="描述" prop="description" />
              <el-table-column label="操作">
                <template #default="{row}">
                  <el-button type="success" icon="el-icon-s-tools" size="small" @click="allocation(row.id)">分配权限</el-button>
                  <el-button type="primary" icon="el-icon-plus" size="small " @click="emitRole(row.id)">编辑</el-button>
                  <el-button type="danger" icon="el-icon-delete" size="small " @click="deleteRole(row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>

          </el-row>
          <!-- 分页组件 -->
          <el-row type="flex" justify="center" align="middle" style="height: 60px">
            <!-- 分页组件 -->
            <el-pagination
              layout="prev, pager, next"
              :total="total"
              :page-size="page.pagesize"
              :current-page="page.page"
              @current-change="changepage"
            />
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="公司信息" name="second">
          <el-alert
            title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
            type="info"
            show-icon
            :closable="false"
          />
          <el-form :model="formData" label-width="120px" style="margin-top:50px">
            <el-form-item label="公司名称">
              <el-input v-model="formData.name" disabled style="width:400px" />
            </el-form-item>
            <el-form-item label="公司地址">
              <el-input v-model="formData.companyAddress" disabled style="width:400px" />
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="formData.mailbox" disabled style="width:400px" />
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="formData.remarks" type="textarea" :rows="3" disabled style="width:400px" />
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 新增编辑的弹层 -->
    <el-dialog title="编辑" :visible.sync="dialogFormVisible" @close="close">
      <el-form ref="roleFormRef" label-width="100px" :model="roleForm" :rules="rules">
        <el-form-item label="名称" prop="name">
          <el-input v-model="roleForm.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="roleForm.description" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 设置权限的弹层 -->
    <el-dialog :visible="showPermissionDialog" title="权限设置" @close="cancel">
      <!-- 树状图数据 -->
      <el-tree ref="treeRef" :data="allocationData" :props="allocationProps" show-checkbox check-strictly default-expand-all :default-checked-keys="userAllocationList" node-key="id" />
      <template #footer>
        <el-row type="flex" justify="center">
          <el-button>取消</el-button>
          <el-button type="primary" @click="allocationSubmit">确认</el-button>
        </el-row>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleListApi, getCompanyInfoApi, deleteRoleApi, getRoleDetailApi, updateRoleApi, addRoleApi } from '@/api/setting'
import { transListToTree } from '@/utils/index'
import { getPermissionListApi } from '@/api/permisson'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      // tabel数据列表，之后进行数据填充
      list: [],

      // 获取数据时要传递的参数
      page: {
        page: 1,
        pagesize: 10
      },
      total: 5,

      // form表单要绑定的数据
      formData: {},

      // 弹层
      dialogFormVisible: false,

      // 弹层中的表单
      roleForm: {},

      // 表单校验规则
      rules: {
        name: {
          required: true
        }
      },

      //  设置权限的弹层
      showPermissionDialog: false,

      // 分配权限弹层绑定的数据
      allocationData: [],
      // 分配权限弹层的规则
      allocationProps: {
        value: 'id',
        label: 'name'
      },
      // 分配角色时，当前点击的角色id
      roleId: null,

      // 获取角色权限列表
      userAllocationList: []
    }
  },
  computed: {
    ...mapGetters(['companyId'])
  },
  created() {
    this.getRoleList()
    this.getCompanyInfo()
  },
  methods: {
    // 获取数据
    async getRoleList() {
      const res = await getRoleListApi(
        this.page
      )
      // console.log(res)
      this.total = res.total
      this.list = res.rows
      // console.log(this.total)
      // console.log(this.list)
    },

    // 点击分页页数，进行改变
    changepage(type) {
      this.page.page = type
      // this.total
      this.getRoleList()
    },

    // 获取公司信息模块的数据
    async getCompanyInfo() {
      // console.log(this.companyId)
      const res = await getCompanyInfoApi(this.companyId)
      // console.log(res)
      this.formData = res
      // console.log(this.formData)
    },

    // 删除功能
    async deleteRole(id) {
      try {
        const len = this.list.length
        await this.$confirm('确认要删除吗')
        await deleteRoleApi(id)
        if (len === 1 && this.page.page > 1) {
          this.page.page--
        }
        this.$message.success('删除角色成功')
        this.getRoleList()
      } catch (error) {
        // console.log(error)
      }
    },

    // 编辑功能
    // 数据回显
    async emitRole(id) {
      const res = await getRoleDetailApi(id)
      // console.log(res)
      this.roleForm = res
      this.dialogFormVisible = true
    },

    // 当点击新增时
    addRole() {
      this.dialogFormVisible = true
    },

    // 提交按钮,要绑定新增和编辑俩个功能，进行判断
    async submit() {
      // await this.$refs.roleFormRef.validata()
      await this.$refs.roleFormRef.validate()
      if (this.roleForm.id) {
        await updateRoleApi(this.roleForm)
      } else {
        await addRoleApi(this.roleForm)
      }
      this.getRoleList()
      this.close()
    },

    // 关闭弹窗时
    close() {
      this.$refs.roleFormRef.resetFields()
      this.roleForm = {
        name: '',
        description: ''
      }
      this.dialogFormVisible = false
    },

    // 点击分配权限
    async allocation(id) {
      console.log(id)
      // 把id存入本地
      this.roleId = id
      // 获取全部的权限列表
      const res = await getPermissionListApi()
      // 把数据转成树状图
      this.allocationData = transListToTree(res, '0')
      // console.log(this.allocationData)
      // 请求当前点击的角色的权限
      const { permIds } = await getRoleDetailApi(id)
      console.log(permIds)
      this.userAllocationList = permIds
      // 打开弹层
      this.showPermissionDialog = true
    },

    // 点击了分配权限的确定按钮时
    async allocationSubmit() {
      console.log(this.$refs.treeRef.getCheckedKeys())
      // await allocation({
      //   permIds: this.$refs.treeRef.getCheckedKeys(),
      //   id: this.roleId
      // })
    },

    cancel() {
      this.showPermissionDialog = false
    }
  }
}
</script>

<style>

</style>
