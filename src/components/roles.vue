<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">
        首页
        </el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row >
        <el-button type="primary" @click="dialogVisible=true">添加角色</el-button>
        <el-dialog title="添加角色" :visible.sync="dialogVisible" width="50%">
          <el-form :model="addForm" status-icon :rules="addFormRules" ref="addFormRef" label-width="70px">
              <el-form-item label="角色名" prop="role">
                  <el-input v-model="addForm.role"></el-input>
              </el-form-item>
              <el-form-item label="描述" prop="desc">
                  <el-input v-model="addForm.desc"></el-input>
              </el-form-item>
          </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRole">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="分配权限" :visible.sync="permdv" width="50%">
        <el-tree
          :data="permList"
          show-checkbox
          default-expand-all
          node-key="id"
          ref="tree"
          highlight-current
          :props="defaultProps">
        </el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="permdv = false">取 消</el-button>
          <el-button type="primary" @click="getCheckedKeys">确 定</el-button>
        </span>
      </el-dialog>
      </el-row>
      <el-table
      :data="roles_list"
      style="width: 100%"
      stripe
      border>
        <el-table-column type="expand" border>
          <template slot-scope="scope">
            <el-row v-for="item in scope.row.perm" :key="item.name" border>
              <!-- 1 -->
              <el-col :span="5">
                <el-tag closable @close="closetag1(scope.row, item.name)">{{item.name}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 2/3 -->
              <el-col :span="19">
                <el-row v-for="it2 in item.children" :key="it2.name" border>
                  <el-col :span="8">
                    <el-tag closable @close="closetag2(item, it2.name)" type="success" >{{it2.name}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="2" v-for="it3 in it2.children" :key="it3.name" border>
                    <el-tag closable @close="closetag3(it2, it3.name)" type="warning">{{it3.name}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column
          type="index"
          width="50"
          label="#">
        </el-table-column>
        <el-table-column
          label="角色名称"
          prop="name">
        </el-table-column>
        <el-table-column
          label="角色描述"
          prop="desc">
        </el-table-column>
        <el-table-column
          label="操作">
          <el-button type="primary">编辑</el-button>
          <el-button type="danger">删除</el-button>
          <el-button type="warning" @click="permdv=true">分配权限</el-button>

        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>

export default {
  data () {
    return {
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      roles_list: [],
      dialogVisible: false,
      permdv: false,
      addForm: { role: '', desc: '' },
      addFormRules: {
        role: [
          { required: true, message: '请输入角色', trigger: 'blur' },
          { min: 3, max: 10, message: '角色名长度3~10个字符', trigger: 'blur' }
        ],
        desc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 10, max: 20, message: '密码长度10-20个字符', trigger: 'blur' }
        ]
      },
      permList: [
        { id: 101, authName: '商品管理', path: 'goods', pid: 0, children: [{ id: 104, authName: '商品列表', path: 'goods', pid: 101, children: [{ id: 105, authName: '添加商品', path: 'goods', pid: '104,101' }, { id: 116, authName: '商品修改', path: 'goods', pid: '104,101' }, { id: 117, authName: '商品删除', path: 'goods', pid: '104,101' }, { id: 150, authName: '更新商品图片', path: 'goods', pid: '104,101' }, { id: 151, authName: '更新商品属性', path: 'goods', pid: '104,101' }, { id: 152, authName: '更新商品状态', path: 'goods', pid: '104,101' }, { id: 153, authName: '获取商品详情', path: 'goods', pid: '104,101' }] }, { id: 115, authName: '分类参数', path: 'params', pid: 101, children: [{ id: 142, authName: '获取参数列表', path: 'categories', pid: '115,101' }, { id: 143, authName: '创建商品参数', path: 'categories', pid: '115,101' }, { id: 144, authName: '删除商品参数', path: 'categories', pid: '115,101' }] }, { id: 121, authName: '商品分类', path: 'categories', pid: 101, children: [{ id: 122, authName: '添加分类', path: 'categories', pid: '121,101' }, { id: 123, authName: '删除分类', path: 'categories', pid: '121,101' }, { id: 149, authName: '获取分类详情', path: 'categories', pid: '121,101' }] }] }, { id: 102, authName: '订 单管理', path: 'orders', pid: 0, children: [{ id: 107, authName: '订单列表', path: 'orders', pid: 102, children: [{ id: 109, authName: '添加订单', path: 'orders', pid: '107,102' }, { id: 154, authName: '订 单更新', path: 'orders', pid: '107,102' }, { id: 155, authName: '获取订单详情', path: 'orders', pid: '107,102' }] }] }, { id: 103, authName: '权限管理', path: 'rights', pid: 0, children: [{ id: 111, authName: '角色列表', path: 'roles', pid: 103, children: [{ id: 129, authName: '添加角色', path: 'roles', pid: '111,103' }, { id: 130, authName: '删除角色', path: 'roles', pid: '111,103' }, { id: 134, authName: '角色授 权', path: 'roles', pid: '111,103' }, { id: 135, authName: '取消角色授权', path: 'roles', pid: '111,103' }, { id: 138, authName: '获取角色列表', path: 'roles', pid: '111,103' }, { id: 139, authName: '获取角色详情', path: 'roles', pid: '111,103' }, { id: 140, authName: '更新角色信息', path: 'roles', pid: '111,103' }, { id: 141, authName: '更新角色权限', path: 'roles', pid: '111,103' }] }, { id: 112, authName: '权限列表', path: 'rights', pid: 103, children: [{ id: 147, authName: '查看权限', path: 'rights', pid: '112,103' }] }] }, { id: 125, authName: '用户管理', path: 'users', pid: 0, children: [{ id: 110, authName: '用户列表', path: 'users', pid: 125, children: [{ id: 131, authName: '添加用户', path: 'users', pid: '110,125' }, { id: 132, authName: '删除用户', path: 'users', pid: '110,125' }, { id: 133, authName: '更新用户', path: 'users', pid: '110,125' }, { id: 136, authName: '获取用户详情', path: 'users', pid: '110,125' }, { id: 137, authName: '分配用户角色', path: 'users', pid: '110,125' }, { id: 159, authName: '设置管理状态', path: 'users', pid: '110,125' }] }] }, { id: 145, authName: '数据统计', path: 'reports', pid: 0, children: [{ id: 146, authName: '数据报表', path: 'reports', pid: 145, children: [{ id: 148, authName: '查看数据', path: 'reports', pid: '146,145' }] }] }
      ]
    }
  },
  created () {
    this.getRoleList()
  },
  mounted () {},
  methods: {
    getCheckedNodes () {
      console.log(this.$refs.tree.getCheckedNodes())
    },
    getCheckedKeys () {
      console.log(this.$refs.tree.getCheckedKeys())
    },
    getRoleList () {
      this.roles_list = [
        { name: '董事长', desc: '超级管理员', perm: [{ name: '商品管理', children: [{ name: '商品列表', children: [{ name: '商品修改' }, { name: '商品删除' }, { name: '更新商品图片' }] }, { name: '分类参数', children: [{ name: '1' }, { name: '2' }, { name: '3' }] }] }, { name: '商品管理2', children: [{ name: '商品列表', children: [{ name: '商品修改' }, { name: '商品删除' }, { name: '更新商品图片' }] }, { name: '分类参数', children: [{ name: '1' }, { name: '2' }, { name: '3' }] }] }] },
        { name: '总经理', desc: '管理员' }
      ]
    },
    async closetag1 (row, name) {
      const res = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).catch(err => err)
      if (res !== 'confirm') {
        return this.$message.info('已取消')
      }
      var newPerms = []
      for (var i in row.perm) {
        if (row.perm[i].name === name) {
          continue
        }
        newPerms.push(row.perm[i])
      }
      row.perm = newPerms
      // patch api
    },
    async closetag2 (row, name) {
      const res = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).catch(err => err)
      if (res !== 'confirm') {
        return this.$message.info('已取消')
      }
      var newChildren = []
      for (var i in row.children) {
        if (row.children[i].name === name) {
          continue
        }
        newChildren.push(row.children[i])
      }
      row.children = newChildren
      // patch api
    },
    async closetag3 (row, name) {
      const res = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).catch(err => err)
      if (res !== 'confirm') {
        return this.$message.info('已取消')
      }
      var newChildren = []
      for (var i in row.children) {
        if (row.children[i].name === name) {
          continue
        }
        newChildren.push(row.children[i])
      }
      row.children = newChildren
      // patch api
    },
    addRole () {
      this.$refs.addFormRef.validate(valid => {
        if (valid) {
        //  this.$http.post(this.addForm)
          this.$message('添加角色成功')
          this.dialogVisible = false
          this.getRoleList()
        }
      })
    }
  }
}

</script>

<style lang="less" scoped>
.el-breadcrumb {
    margin-bottom: 15px;
    font-size: 12px;
}

.el-tag {
  margin: 7px;
}

.el-table {
    margin-top: 15px;
    font-size: 12px;
}
</style>
