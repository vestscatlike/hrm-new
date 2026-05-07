<!--
 * @Author: 方书生 fanss1368@163.com
 * @Date: 2023-02-23 11:38:39
 * @LastEditors: 方书生 fanss1368@163.com
 * @LastEditTime: 2023-02-23 15:19:31
 * @FilePath: \hrsaas\src\views\employees\component\assign-role.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <el-dialog title="分配角色" :visible="showRoleDialog" @close="cancel">
    <!-- el-checkbox-group选中的是 当前用户所拥有的角色  需要绑定 当前用户拥有的角色-->
    <!-- 分配角色 -->
    <el-checkbox-group v-model="roleIds">
      <el-checkbox v-for="item in list" :key="item.id" :label="item.id">
        {{
          item.name
        }}
      </el-checkbox>
    </el-checkbox-group>
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="12">
        <el-button type="primary" size="small" @click="submit">确定</el-button>
        <el-button size="small" @click="cancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getRoleListApi } from '@/api/setting'
import { getUserDetailByIdApi, assignRolesApi } from '@/api/employees'

export default {
  name: 'AssignRole',
  props: {
    showRoleDialog: {
      type: Boolean,
      default: false
    },
    userId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      list: [], // 所有角色列表
      roleIds: [] // 选中角色数据
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    //  获取所有角色
    async getRoleList() {
      const { rows } = await getRoleListApi()
      this.list = rows
      console.log(this.list)
    },
    async getUserDetailById(id) {
      const { roleIds } = await getUserDetailByIdApi(id)
      this.roleIds = roleIds || [] // 赋值本用户的角色
      console.log(this.roleIds)
    },
    async submit() {
      await assignRolesApi({
        id: this.userId,
        roleIds: this.roleIds
      })
      this.$message.success('修改角色信息成功')
    },

    // 关闭弹层
    cancel() {
      this.$emit('update:showRoleDialog', false)
    }
  }
}
</script>
